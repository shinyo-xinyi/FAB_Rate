import requests
from lxml import etree
import re
from queue import Queue
from threading import Thread
from pandas.core.frame import DataFrame
from outlierDetection import *
from sentimentAnalyzer import SentimentIntensityAnalyzer
from nltk import tokenize

# use the headers mock browser to prevent detection by Amazon's anti-crawler feature
headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.55 Safari/537.36',
    'Cookie': 'session-id=146-0217750-3321058; session-id-time=2082787201l; ubid-main=133-5288147-5353307; lc-main=en_US; i18n-prefs=USD; skin=noskin; session-token=mU6RMjSD49dZsXlPZqhHLo2QiQWmmqUBnLh4LP9HnVkObJbjMYUOl5aKpc43feNsB2kK8oh73rJFUgGZbHK7Ttov3ogLdwgaD+yWUdJcGyyM53MXU3hTkRWLbCek1+bWeJ3BcexihL8wW/cEHwh2HQHhjcLBsY8vlEDdhEaOuHEZKRIB6myeCm2WWQKhOK44; csm-hit=tb:9PKWSFX587EJWEKYYXJD+s-FDSGQVQ151WZK1VGQ412|1637847673397&t:1637847673397&adb:adblk_no'
}

class Crawler(object):
    def __init__(self, url):
        self.url = url
        self.headers = headers
        self.analyzer = SentimentIntensityAnalyzer()

    def getParagraphScore(self, paragraph):
        '''
        Tokenize the whole paragraph into sentences
        Obtain the mean score of all the sentences
        '''
        queue = Queue()
        result_queue = Queue()
        sentence_list = tokenize.sent_tokenize(paragraph)
        paragraphSentiments = 0.0
        length = len(sentence_list)
        for sentence in sentence_list:
            queue.put(sentence)
        for index in range(10):
            thread = Thread(target=self.getSentenceScore, args=(queue, result_queue))
            thread.daemon = True
            thread.start()
        queue.join()
        while not (result_queue.empty()):
            result = result_queue.get()
            paragraphSentiments += result
        value = round(paragraphSentiments / length, 4)
        return value

    def getSentenceScore(self, in_q, out_q):
        # Get the score of a single sentence
        while in_q.empty() is not True:
            sentence_result = self.analyzer.polarity_scores(in_q.get())["compound"]
            out_q.put(sentence_result)

    def getScore(self, paragraph):
        # Get the score of a long paragraph
        sentence_list = tokenize.sent_tokenize(paragraph)
        paragraphSentiments = 0.0
        length = len(sentence_list)
        for sentence in sentence_list:
            sentence_result = self.analyzer.polarity_scores(sentence)
            sentenceSentiment = sentence_result["compound"]
            paragraphSentiments += sentenceSentiment
        value = round(paragraphSentiments / length, 4)
        return value

    def parge_page(self, in_q, out_q):
        # Iteratively crawls all reviews for the commodity in the URL
        while in_q.empty() is not True:
            html = etree.HTML(requests.get(url=in_q.get(), headers=headers).text)
            quan = html.xpath('//div[@id="cm_cr-review_list"]/div')
            for i in quan:
                comment = i.xpath('.//span[@data-hook="review-body"]/span/text()')
                if len(comment) > 0:
                    paragraph = str(comment[0]).lstrip("\n")
                    result = self.getScore(paragraph)
                    out_q.put(result)
            in_q.task_done()

    def get_reviews_number(self):
        # Crawl the number of the commodity
        response = requests.get(url=self.url, headers=headers)
        text = response.text
        html = etree.HTML(text)
        number = html.xpath('//div[@id="filter-info-section"]/div/text()')
        assert len(number) != 0  # judge list out of range
        number2 = str(number[0])
        number_list = re.findall("s.*[0-9]", number2) # use regular matching to get "global reviews"
        if number_list == []:
            number_list = re.findall("g.*[0-9]", number2)
        comment_number = number_list[0]
        if comment_number == 0:
            return 0
        final = re.sub("\D", "", comment_number)
        return int(final)

    def get_keyword(self):
        # Count the word frequency of all candidate keywords
        counts = {}
        for keyword in self.analyzer.keyword_list:
            if len(keyword.split()) == 2:
                counts[keyword] = counts.get(keyword, 0) + 0.5
            elif len(keyword.split()) == 3:
                counts[keyword] = counts.get(keyword, 0) + 0.7
            elif len(keyword.split()) == 4:
                counts[keyword] = counts.get(keyword, 0) + 1
        keywords = list(counts.items())
        keywords.sort(key=lambda x: x[1], reverse=True)
        return keywords

    def get_reviews_result(self, url, cur_item):
        # Get all reviews form an commodity
        print(url)
        queue = Queue()
        result_queue = Queue()
        page_number = int(cur_item["reviews"]) // 10 + 1

        for x in range(1, page_number + 1):
            queue.put(url + '&pageNumber=' + str(x))
        print("crawler start!")
        for index in range(20):
            thread = Thread(target=self.parge_page,
                            args=(queue, result_queue))  # use multithreading to speed up crawler
            thread.daemon = True  # exits as the main thread exits
            thread.start()

        queue.join()  # the queue finishes consuming and the thread terminates
        print("crawler stop!")

        data = []

        while not (result_queue.empty()):
            result = result_queue.get()
            data.append(result)

        c = {"value": data}
        df = DataFrame(c)
        if df.shape[0] >= 1:
            data_c = OutlierDetection(df)
        else:
            # there is only one review, cannot do the outlier elimination
            data_c = df

        cur_item["score"] = '%.2f' % (data_c['value'].mean() * 2.5 + 2.5)
        cur_item["pos"] = data_c.loc[data_c['value'] > 0].shape[0]
        cur_item["neu"] = data_c.loc[data_c['value'] == 0].shape[0]
        cur_item["neg"] = data_c.loc[data_c['value'] < 0].shape[0]

        keywords = self.get_keyword()
        cur_item["keywords"] = []
        if len(keywords) >= 3:
            for i in range(5):
                word, count = keywords[i]
                cur_item["keywords"].append(word.lower().strip(",").strip("."))
        else:
            for i in range(len(keywords)):
                word, count = keywords[i]
                cur_item["keywords"].append(word.lower().strip(",").strip("."))
        return cur_item

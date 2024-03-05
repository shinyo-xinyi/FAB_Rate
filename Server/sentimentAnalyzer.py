# -*- coding: utf-8 -*-
"""
citation:
Hutto, C.J. & Gilbert, E.E. (2014). VADER: A Parsimonious Rule-based Model for
Sentiment Analysis of Social Media Text. Eighth International Conference on
Weblogs and Social Media (ICWSM-14). Ann Arbor, MI, June 2014.
"""

import os
import math
import string
import codecs
from inspect import getsourcefile

# ##Constants##
# (empirically derived mean sentiment intensity rating increase for booster words)
B_INCR = 0.293
B_DECR = -0.293

# (empirically derived mean sentiment intensity rating increase for using ALLCAPs to emphasize a word)
C_INCR = 0.733
N_SCALAR = -0.74

NEGATE = \
    ["aint", "arent", "cannot", "cant", "couldnt", "darent", "didnt", "doesnt",
     "ain't", "aren't", "can't", "couldn't", "daren't", "didn't", "doesn't",
     "dont", "hadnt", "hasnt", "havent", "isnt", "mightnt", "mustnt", "neither",
     "don't", "hadn't", "hasn't", "haven't", "isn't", "mightn't", "mustn't",
     "neednt", "needn't", "never", "none", "nope", "nor", "not", "nothing", "nowhere",
     "oughtnt", "shant", "shouldnt", "uhuh", "wasnt", "werent",
     "oughtn't", "shan't", "shouldn't", "uh-uh", "wasn't", "weren't",
     "without", "wont", "wouldnt", "won't", "wouldn't", "rarely", "seldom", "despite",
     "only", "least"
     ]

# booster/dampener 'intensifiers' or 'degree adverbs'
# http://en.wiktionary.org/wiki/Category:English_degree_adverbs
# https://www.heywhale.com/mw/dataset/6113895baca2460017a475be/file

BOOSTER_DICT = \
    {  # increment booster words
        "astonishingly": B_INCR, "awfully": B_INCR, "above": B_INCR,
        "bitterly": B_INCR, "badly": B_INCR,
        "completely": B_INCR, "considerable": B_INCR, "considerably": B_INCR,
        "decidedly": B_INCR, "deep": B_INCR, "deeply": B_INCR, "deep-rooted": B_INCR, "deep-seated": B_INCR,
        "definitely": B_INCR,
        "disastrously": B_INCR, "downright": B_INCR,
        "effing": B_INCR, "enormous": B_INCR, "enormously": B_INCR,
        "entirely": B_INCR, "especially": B_INCR, "exceedingly": B_INCR, "excessive": B_INCR, "excessively": B_INCR,
        "exceptional": B_INCR, "exceptionally": B_INCR, "extreme": B_INCR, "extremely": B_INCR,
        "extraordinarily": B_INCR,
        "exorbitance": B_INCR, "extra": B_INCR,
        "fabulously": B_INCR, "flipping": B_INCR, "flippin": B_INCR, "frackin": B_INCR, "fracking": B_INCR,
        "fricking": B_INCR, "frickin": B_INCR, "frigging": B_INCR, "friggin": B_INCR, "fully": B_INCR,
        "fuckin": B_INCR, "fucking": B_INCR, "fuggin": B_INCR, "fugging": B_INCR, "fairly": B_INCR, "by far": B_INCR,
        "greatly": B_INCR, "greatest": B_INCR,
        "hella": B_INCR, "highly": B_INCR, "hugely": B_INCR, "heinous": B_INCR, "hundred-percent": B_INCR,
        "how": B_INCR, "however": B_INCR, "hyperphysical": B_INCR,
        "incredible": B_INCR, "incredibly": B_INCR, "intensely": B_INCR, "immensely": B_INCR, "immoderate": B_INCR,
        "incomparably": B_INCR, "ingrained": B_INCR, "indeed": B_INCR, "inflated": B_INCR, "inordinate": B_INCR,
        "major": B_INCR, "majorly": B_INCR, "more": B_INCR, "most": B_INCR, "matchlessly": B_INCR,
        "monstrous": B_INCR, "much": B_INCR,
        "out-and-out": B_INCR, "outstanding": B_INCR, "outstandingly": B_INCR,
        "particularly": B_INCR, "purely": B_INCR, "plus": B_INCR, "pretty": B_INCR,
        "quite": B_INCR,
        "really": B_INCR, "remarkably": B_INCR, "right-down": B_INCR, "rather": B_INCR,
        "so": B_INCR, "substantially": B_INCR, "sharply": B_INCR, "sheer": B_INCR, "superb": B_INCR,
        "super": B_INCR, "superheated": B_INCR, "superheterodyne": B_INCR, "surplus": B_INCR,
        "thoroughly": B_INCR, "total": B_INCR, "totally": B_INCR, "tremendous": B_INCR, "tremendously": B_INCR,
        "terribly": B_INCR, "towering": B_INCR, "too": B_INCR,
        "uber": B_INCR, "unbelievably": B_INCR, "unusually": B_INCR, "utter": B_INCR, "utterly": B_INCR,
        "unusually": B_INCR, "utmost": B_INCR, "ultra": B_INCR, "ultrastructural": B_INCR,
        "very": B_INCR,
        "100-percent": B_INCR, "as-fully-as-possible": B_INCR, "beyond-challenge": B_INCR, "beyond-compare": B_INCR,
        "beyond-comparison": B_INCR, "beyond-measure": B_INCR, "by-all-means": B_INCR,
        "in-a-penetrating-way": B_INCR, "in-every-possible-way": B_INCR, "in-the-extreme": B_INCR,
        "of-the-highest-degree": B_INCR, "reach-the-limit": B_INCR,
        "to-death": B_INCR, "to-the-full": B_INCR, "to-the-letter": B_INCR, "to-the-limit": B_INCR,
        "to-the-marrow": B_INCR,
        "to-the-utmost": B_INCR, "very-much": B_INCR, "a-lot": B_INCR, "to-a-serious-degree": B_INCR,
        "too-much": B_INCR, "what-a": B_INCR,
        # decrement booster words
        "almost": B_DECR, "barely": B_DECR, "hardly": B_DECR, "just enough": B_DECR, "just": B_DECR,
        "kinda": B_DECR, "kindof": B_DECR, "kind-of": B_DECR,
        "less": B_DECR, "little": B_DECR, "light": B_DECR,
        "marginal": B_DECR, "marginally": B_DECR, "merely": B_DECR,
        "occasional": B_DECR, "occasionally": B_DECR,
        "partly": B_DECR, "passably": B_DECR,
        "relative": B_DECR,
        "scarce": B_DECR, "scarcely": B_DECR, "slight": B_DECR, "slightly": B_DECR, "some": B_DECR, "somewhat": B_DECR,
        "sorta": B_DECR, "sortof": B_DECR, "sort-of": B_DECR,
        "a-bit": B_DECR, "a-bit-too": B_DECR, "a-little": B_DECR, "a-little-bit": B_DECR,
        "a-little-more": B_DECR, "more-or-less": B_DECR, "to-some-extent": B_DECR, "slightest-degree-of": B_DECR,
    }

# check for phrases
SPECIAL_CASES = \
    [  # idioms
        "the shit", "the bomb", "bad ass", "bus stop",
        "yeah right", "kiss of death", "to die for",
        "beating heart", "broken heart", "cut the mustard", "hand to mouth",
        "back handed", "blow smoke", "blowing smoke",
        "upper hand", "break a leg", "cooking with gas", "in the black", "in the red",
        "on the ball", "under the weather",
        # increment booster phrases
        "100 percent", "as fully as possible",
        "beyond challenge", "beyond compare", "beyond comparison", "beyond measure", "by all means",
        "in a penetrating way", "in every possible way", "in the extreme",
        "of the highest degree", "reach the limit",
        "to death", "to the full", "to the letter", "to the limit",
        "to the marrow", "to the utmost",
        "very much", "a lot", "to a serious degree", "too much", "what a",
        # decrement booster phrases
        "sort of", "kind of", "a bit", "a bit too", "a little", "a little bit",
        "a little more", "more or less", "to some extent", "slightest degree of",
        "much prefer"
    ]


def negated(input_words, include_nt=True):
    """
    Determine if input contains negation words
    """
    input_words = [str(w).lower() for w in input_words]
    neg_words = []
    neg_words.extend(NEGATE)
    for word in neg_words:
        if word in input_words:
            return True
    if include_nt:
        for word in input_words:
            if "n't" in word:
                return True
    return False


def allcap_differential(words):
    """
    Check whether just some words in the input are ALL CAPS
    :param list words: The words to inspect
    :returns: `True` if some but not all items in `words` are ALL CAPS
    """
    is_different = False
    allcap_words = 0
    for word in words:
        if word.isupper():
            allcap_words += 1
    if len(words) <= 2 and allcap_words == len(words):
        # if the sentence only contains less than or equal to two words that are ALL CAPS
        return True
    cap_differential = len(words) - allcap_words
    if 0 < cap_differential < len(words):
        is_different = True
    return is_different


def scalar_inc_dec(word, valence, is_cap_diff):
    """
    Check if the preceding words increase, decrease, or negate/nullify the
    valence
    """
    scalar = 0.0
    word_lower = word.lower()
    if word_lower in BOOSTER_DICT:
        scalar = BOOSTER_DICT[word_lower]
        if valence < 0:
            scalar *= -1
        # check if booster/dampener word is in ALLCAPS (while others aren't)
        if word.isupper() and is_cap_diff:
            if valence > 0:
                scalar += C_INCR
            else:
                scalar -= C_INCR
    return scalar


def normalize(score, alpha=1):
    """
    Normalize the score to be between -1 and 1 using an alpha that
    approximates the max expected value
    """
    norm_score = score / math.sqrt((score * score) + alpha)
    if norm_score < -1.0:
        return -1.0
    elif norm_score > 1.0:
        return 1.0
    else:
        return norm_score


class SentiText(object):
    """
    Identify sentiment-relevant string-level properties of input text.
    """

    def __init__(self, text):
        if not isinstance(text, str):
            text = str(text).encode('utf-8')
        self.text = text
        self.words_and_emoticons = self._words_and_emoticons()
        # doesn't separate words from\
        # adjacent punctuation (keeps emoticons & contractions)
        self.is_cap_diff = allcap_differential(self.words_and_emoticons)

    @staticmethod
    def _strip_punc_if_word(token):
        """
        Removes all trailing and leading punctuation
        If the resulting string has two or fewer characters,
        then it was likely an emoticon, so return original string
        (ie ":)" stripped would be "", so just return ":)"
        """
        stripped = token.strip(string.punctuation)
        if stripped.lower() == "no" or stripped.lower() == "ok":
            # preserve "no" and "ok" without punctuations as a token
            return stripped
        if len(stripped) <= 2:
            return token
        return stripped

    def _words_and_emoticons(self):
        """
        Removes leading and trailing puncutation
        Leaves contractions and most emoticons
            Does not preserve punc-plus-letter emoticons (e.g. :D)
        """
        wes = self.text.split()
        stripped = list(map(self._strip_punc_if_word, wes))
        return stripped


class SentimentIntensityAnalyzer(object):
    """
    Give a sentiment intensity score to sentences.
    """

    def __init__(self, lexicon_file="vader_lexicon.txt", emoji_lexicon="emoji_utf8_lexicon.txt",
                 stop_word_lexicon="stop_word.txt"):
        _this_module_file_path_ = os.path.abspath(getsourcefile(lambda: 0))  # the route of the current file

        lexicon_full_filepath = os.path.join(os.path.dirname(_this_module_file_path_),
                                             lexicon_file)  # the route of the lexicon file
        with codecs.open(lexicon_full_filepath, encoding='utf-8') as f:
            self.lexicon_full_filepath = f.read()
        self.lexicon = self.make_lex_dict()

        emoji_full_filepath = os.path.join(os.path.dirname(_this_module_file_path_), emoji_lexicon)
        with codecs.open(emoji_full_filepath, encoding='utf-8') as f:
            self.emoji_full_filepath = f.read()
        self.emojis = self.make_emoji_dict()

        stop_word_full_filepath = os.path.join(os.path.dirname(_this_module_file_path_), stop_word_lexicon)
        with codecs.open(stop_word_full_filepath, encoding='utf-8') as f:
            self.stop_word_full_filepath = f.read()
        self.stop_word_dict = self.make_stop_word_dict()

        self.keyword_list = []

    def make_lex_dict(self):
        """
        Convert lexicon file to a dictionary
        """
        lex_dict = {}
        for line in self.lexicon_full_filepath.rstrip('\n').split('\n'):
            if not line:
                continue
            (word, measure) = line.strip().split('\t')[0:2]
            lex_dict[word] = float(measure)
        return lex_dict

    def make_emoji_dict(self):
        """
        Convert emoji lexicon file to a dictionary
        """
        emoji_dict = {}
        for line in self.emoji_full_filepath.rstrip('\n').split('\n'):
            (emoji, description) = line.strip().split('\t')[0:2]
            emoji_dict[emoji] = description
        return emoji_dict

    def make_stop_word_dict(self):
        """
        Convert stop word file to a dictionary
        """
        stop_word_dict = []
        for line in self.stop_word_full_filepath.replace("\r", "").split('\n'):
            stop_word_dict.append(line)
        return stop_word_dict

    def polarity_scores(self, text):
        """
        Return a float for sentiment strength based on the input text.
        Positive values are positive valence, negative value are negative
        valence.
        """
        # convert emojis to their textual descriptions
        text_no_emoji = ""
        prev_space = True
        for chr in text:
            if chr in self.emojis:
                # get the textual description
                description = self.emojis[chr]
                if not prev_space:
                    text_no_emoji += ' '
                text_no_emoji += description
                prev_space = False
            elif chr == '$':
                text_no_emoji += chr + ': '
            else:
                text_no_emoji += chr
                prev_space = chr == ' '
        text = text_no_emoji.strip()

        sentitext = SentiText(text)

        sentiments = []
        words_and_emoticons = sentitext.words_and_emoticons

        words_and_emoticons = self._phrase_check(words_and_emoticons)

        for i, item in enumerate(words_and_emoticons):
            valence = 0
            # check for vader_lexicon words that may be used as modifiers or negations
            if item.lower() in BOOSTER_DICT:
                sentiments.append(valence)
                continue
            sentiments = self.sentiment_valence(valence, sentitext, item, i, sentiments)

        sentiments = self._but_check(words_and_emoticons, sentiments)
        valence_dict = self.score_valence(sentiments, text)

        return valence_dict

    def sentiment_valence(self, valence, sentitext, item, i, sentiments):
        is_cap_diff = sentitext.is_cap_diff
        words_and_emoticons = sentitext.words_and_emoticons
        item_lowercase = item.lower()
        if item_lowercase in self.lexicon:
            # get the sentiment valence
            valence = self.lexicon[item_lowercase]

            # check for "no" as negation for an adjacent lexicon item vs "no" as its own stand-alone lexicon item
            if item_lowercase == "no" \
                    and i != len(words_and_emoticons) - 1 \
                    and words_and_emoticons[i + 1].lower() in self.lexicon:
                # don't use valence of "no" as a lexicon item. Instead set it's valence to 0.0 and negate the next item
                valence = 0.0
            if (i > 0 and words_and_emoticons[i - 1].lower() == "no") \
                    or (i > 1 and words_and_emoticons[i - 2].lower() == "no") \
                    or (i > 2 and words_and_emoticons[i - 3].lower() == "no"
                        and words_and_emoticons[i - 1].lower() in ["or", "nor"]):
                valence = self.lexicon[item_lowercase] * N_SCALAR

            # check if sentiment laden word is in ALL CAPS (while others aren't)
            if item.isupper() and is_cap_diff:
                if valence > 0:
                    valence += C_INCR
                else:
                    valence -= C_INCR

            for start_i in range(0, 3):
                # dampen the scalar modifier of preceding words and emoticons
                # (excluding the ones that immediately precede the item) based
                # on their distance from the current item.
                if i > start_i and words_and_emoticons[i - (start_i + 1)].lower() not in self.lexicon:
                    s = scalar_inc_dec(words_and_emoticons[i - (start_i + 1)], valence, is_cap_diff)
                    if start_i == 1 and s != 0:
                        s = s * 0.95
                    if start_i == 2 and s != 0:
                        s = s * 0.9
                    valence = valence + s
                    valence = self._negation_check(valence, words_and_emoticons, start_i, i)

        sentiments.append(valence)
        return sentiments

    @staticmethod
    def _but_check(words_and_emoticons, sentiments):
        # check for modification in sentiment due to contrastive conjunction 'but'
        words_and_emoticons_lower = [str(w).lower() for w in words_and_emoticons]
        if 'but' in words_and_emoticons_lower:
            bi = words_and_emoticons_lower.index('but')  # return value is 1 if exists
            for sentiment in sentiments:
                si = sentiments.index(sentiment)
                if si < bi:
                    sentiments.pop(si)
                    sentiments.insert(si, sentiment * 0.5)
                elif si > bi:
                    sentiments.pop(si)
                    sentiments.insert(si, sentiment * 1.5)
        return sentiments

    def _phrase_check(self, words_and_emoticons):
        """
        Check the potential phrase in the text. If the combination matches a phrase,
        concatenate tokens as a whole and connect them with "-"
        """
        i = 0
        while 1:
            words_and_emoticons_lower = [str(w).lower() for w in words_and_emoticons]
            if len(words_and_emoticons) - i > 1:
                zeroone = "{0} {1}".format(words_and_emoticons_lower[i], words_and_emoticons_lower[i + 1])

                if (words_and_emoticons_lower[i] not in self.stop_word_dict \
                        and words_and_emoticons_lower[i + 1] not in self.stop_word_dict\
                        and (words_and_emoticons_lower[i] in self.lexicon
                            or words_and_emoticons_lower[i + 1] in self.lexicon)\
                    ):
                    self.keyword_list.append(zeroone)

                if zeroone in SPECIAL_CASES:
                    words_and_emoticons[i] = words_and_emoticons[i] + "-" + words_and_emoticons[i + 1]
                    del words_and_emoticons[i + 1]

            elif len(words_and_emoticons) - i > 2:
                zeroonetwo = "{0} {1} {2}".format(words_and_emoticons_lower[i],
                                                  words_and_emoticons_lower[i + 1], words_and_emoticons_lower[i + 2])

                if (words_and_emoticons_lower[i] not in self.stop_word_dict \
                        and words_and_emoticons_lower[i + 1] not in self.stop_word_dict \
                        and words_and_emoticons_lower[i + 2] not in self.stop_word_dict
                        and (words_and_emoticons_lower[i] in self.lexicon
                             or words_and_emoticons_lower[i + 1] in self.lexicon
                             or words_and_emoticons_lower[i + 2] in self.lexicon) \
                        ):
                    self.keyword_list.append(zeroonetwo)

                if zeroonetwo in SPECIAL_CASES:
                    words_and_emoticons[i] = words_and_emoticons[i] + "-" + words_and_emoticons[i + 1] + "-" + \
                                             words_and_emoticons[i + 2]
                    del words_and_emoticons[i + 2]
                    del words_and_emoticons[i + 1]

            elif len(words_and_emoticons) - i > 3:
                zeroonetwothree = "{0} {1} {2} {3}".format(words_and_emoticons_lower[i],
                                                           words_and_emoticons_lower[i + 1],
                                                           words_and_emoticons_lower[i + 2],
                                                           words_and_emoticons_lower[i + 3])

                if (words_and_emoticons_lower[i] not in self.stop_word_dict \
                        and words_and_emoticons_lower[i + 1] not in self.stop_word_dict \
                        and words_and_emoticons_lower[i + 2] not in self.stop_word_dict \
                        and words_and_emoticons_lower[i + 3] not in self.stop_word_dict
                        and (words_and_emoticons_lower[i] in self.lexicon
                             or words_and_emoticons_lower[i + 1] in self.lexicon
                             or words_and_emoticons_lower[i + 2] in self.lexicon
                             or words_and_emoticons_lower[i + 3] in self.lexicon) \
                        ):
                    self.keyword_list.append(zeroonetwothree)

                if zeroonetwothree in SPECIAL_CASES:
                    words_and_emoticons[i] = words_and_emoticons[i] + "-" + words_and_emoticons[i + 1] \
                                             + "-" + words_and_emoticons[i + 2] + "-" + words_and_emoticons_lower[i + 3]
                    del words_and_emoticons[i + 3]
                    del words_and_emoticons[i + 2]
                    del words_and_emoticons[i + 1]

            if len(words_and_emoticons) - i == 0:
                return words_and_emoticons
            i = i + 1

    @staticmethod
    def _negation_check(valence, words_and_emoticons, start_i, i):
        words_and_emoticons_lower = [str(w).lower() for w in words_and_emoticons]
        if start_i == 0:
            if negated([words_and_emoticons_lower[i - (start_i + 1)]]):  # 1 word preceding lexicon word (w/o stopwords)
                valence = valence * N_SCALAR
        if start_i == 1:
            if words_and_emoticons_lower[i - 2] == "never" and \
                    (words_and_emoticons_lower[i - 1] == "so" or
                     words_and_emoticons_lower[i - 1] == "this"):
                valence = valence * 1.25
            elif words_and_emoticons_lower[i - 2] == "without" and \
                    words_and_emoticons_lower[i - 1] == "doubt":
                valence = valence
            elif negated([words_and_emoticons_lower[i - (start_i + 1)]]):  # 2 words preceding the lexicon word position
                valence = valence * N_SCALAR
        if start_i == 2:
            if words_and_emoticons_lower[i - 3] == "never" and \
                    (words_and_emoticons_lower[i - 2] == "so" or words_and_emoticons_lower[i - 2] == "this") or \
                    (words_and_emoticons_lower[i - 1] == "so" or words_and_emoticons_lower[i - 1] == "this"):
                valence = valence * 1.25
            elif words_and_emoticons_lower[i - 3] == "without" and \
                    (words_and_emoticons_lower[i - 2] == "doubt" or words_and_emoticons_lower[i - 1] == "doubt"):
                valence = valence
            elif negated([words_and_emoticons_lower[i - (start_i + 1)]]):  # 3 words preceding the lexicon word position
                valence = valence * N_SCALAR
        return valence

    def _punctuation_emphasis(self, text):
        # add emphasis from exclamation points and question marks
        ep_amplifier = self._amplify_ep(text)
        qm_amplifier = self._amplify_qm(text)
        punct_emph_amplifier = ep_amplifier + qm_amplifier
        return punct_emph_amplifier

    @staticmethod
    def _amplify_ep(text):
        # check for added emphasis resulting from exclamation points (up to 4 of them)
        ep_count = text.count("!")
        if ep_count > 4:
            ep_count = 4
        # (empirically derived mean sentiment intensity rating increase for
        # exclamation points)
        ep_amplifier = ep_count * 0.292
        return ep_amplifier

    @staticmethod
    def _amplify_qm(text):
        # check for added emphasis resulting from question marks (2 or 3+)
        qm_count = text.count("?")
        qm_amplifier = 0
        if qm_count > 1:
            if qm_count <= 3:
                # (empirically derived mean sentiment intensity rating increase for
                # question marks)
                qm_amplifier = qm_count * 0.18
            else:
                qm_amplifier = 0.96
        return qm_amplifier

    @staticmethod
    def _sift_sentiment_scores(sentiments):
        # want separate positive versus negative sentiment scores
        pos_sum = 0.0
        neg_sum = 0.0
        neu_count = 0
        for sentiment_score in sentiments:
            if sentiment_score > 0:
                pos_sum += (float(sentiment_score) + 1)  # compensates for neutral words that are counted as 1
            if sentiment_score < 0:
                neg_sum += (float(sentiment_score) - 1)  # when used with math.fabs(), compensates for neutrals
            if sentiment_score == 0:
                neu_count += 1
        return pos_sum, neg_sum, neu_count

    def score_valence(self, sentiments, text):
        # sum the sentiments to obtain the final score
        if sentiments:
            sum_s = float(sum(sentiments))
            # compute and add emphasis from punctuation in text
            punct_emph_amplifier = self._punctuation_emphasis(text)
            if sum_s > 0:
                sum_s += punct_emph_amplifier
            elif sum_s < 0:
                sum_s -= punct_emph_amplifier

            compound = normalize(sum_s)
            # discriminate between positive, negative and neutral sentiment scores
            pos_sum, neg_sum, neu_count = self._sift_sentiment_scores(sentiments)

            if pos_sum > math.fabs(neg_sum):
                pos_sum += punct_emph_amplifier
            elif pos_sum < math.fabs(neg_sum):
                neg_sum -= punct_emph_amplifier

            total = pos_sum + math.fabs(neg_sum) + neu_count
            pos = math.fabs(pos_sum / total)
            neg = math.fabs(neg_sum / total)
            neu = math.fabs(neu_count / total)

        else:
            compound = 0.0
            pos = 0.0
            neg = 0.0
            neu = 0.0

        sentiment_dict = \
            {"neg": round(neg, 3),
             "neu": round(neu, 3),
             "pos": round(pos, 3),
             "compound": round(compound, 4),
             }

        return sentiment_dict

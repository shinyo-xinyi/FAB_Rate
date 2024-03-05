from crawler import *

# a list to temporarily store all the items recorded
item_dictionary = []


def write_db(cur_item):
    # Record the new item into the database
    with open("database.txt", "a") as f:
        f.write("product:" + cur_item["product"]
                + ",reviews:" + str(cur_item["reviews"])
                + ",pos:" + str(cur_item["pos"])
                + ",neu:" + str(cur_item["neu"])
                + ",neg:" + str(cur_item["neg"])
                + ",score:" + str(cur_item["score"])
                + ",keywords:")
        for item in cur_item["keywords"]:
            f.write(item + "/")
        f.write("\n")
    f.close()
    return cur_item


def read_db():
    # Load data from the database into the item dictionary
    with open("database.txt", "r") as f:
        for record in f.readlines():
            temp_dic = {}
            dic = {}
            record = str(record).replace("\n", "")
            record = record.split(",", 6)
            for item in record:
                temp_dic[item.split(":", 1)[0]] = item.split(":", 1)[1]
            # change the string into number
            dic["product"] = temp_dic["product"]
            dic["reviews"] = int(temp_dic["reviews"])
            dic["pos"] = int(temp_dic["pos"])
            dic["neu"] = int(temp_dic["neu"])
            dic["neg"] = int(temp_dic["neg"])
            dic["score"] = temp_dic["score"]
            dic["keywords"] = temp_dic["keywords"].rstrip("/").split("/")
            if dic not in item_dictionary:
                item_dictionary.append(dic)
    f.close()


def get_data(cur_item):
    """
    Check whether the item is recorded in the database
    If it is recorded, just use the record data
    Otherwise, crawl all the reviews to create a new item
    """
    for item in item_dictionary:
        if cur_item["product"] == item["product"]:
            # the item is recorded in the database, just use it
            print("Record found! Accessing database...")
            cur_item["reviews"] = item["reviews"]
            cur_item["score"] = item["score"]
            cur_item["pos"] = item["pos"]
            cur_item["neu"] = item["neu"]
            cur_item["neg"] = item["neg"]
            cur_item["keywords"] = item["keywords"]
            print("old_item:")
            print(cur_item)
            return cur_item
    # the item is not recorded in the database
    print("No record found!")
    return cur_item


def get_pid(url):
    # Obtain the product id from the URL
    if url.find("slredirect") != -1:
        # the URL is a redirect URL
        index = url.rfind("Fdp%2F") + 6
    else:
        # the URL points to the product review page
        index = url.rfind("/dp/") + 4
    name = url[index:index + 10]
    return name


def get_url(pid):
    """
    Obtain the url of the corresponding product"s reviews page
    :params: The product identifier in the form of a string with ten characters
             consisting of uppercase letters and numbers (such as "B076HTJRMZ")
    :returns: URL of corresponding reviews page
    """
    url = "https://www.amazon.com/product-reviews/" + pid + "/ref=cm_cr_dp_d_show_all_btm?ie=UTF8&reviewerType=all_reviews"
    return url


def get_dic(origin_url):
    # Search for the database to get the details of the original URL
    pid = get_pid(origin_url)
    url = get_url(pid)
    # initialize the current item
    cur_item = {"product": pid, "reviews": "NAN", "pos": "NAN", "neu": "NAN", "neg": "NAN", "score": "NAN", "keywords": []}
    dic = get_data(cur_item)
    return dic
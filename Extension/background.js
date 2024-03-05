
//                              Main Function

// recieve message from content script
chrome.extension.onMessage.addListener(function (request,sender,callback) {
    
    //alert(request.product_hyperlink);

    var message_return = {};

    if(request.id == 'product_window_request'){
        product_return = product_window_listener(request);
        message_return = {id:'product_window_return', product_name:product_return.name, product_score:product_return.score, product_positive:product_return.positive, product_neutral:product_return.neutral, product_negative:product_return.negative, product_reviews:product_return.reviews, product_keywords:product_return.keywords};
        callback(message_return);
    }
    
    if(request.id == 'pass_score_request'){
        // alert(request.product_positive);
        product_return = score_product_listener(request);
        message_return_score = {id:'pass_score_return', product_name:product_return.name, product_score:product_return.score, product_positive:product_return.positive, product_neutral:product_return.neutral, product_negative:product_return.negative, product_reviews:product_return.reviews, product_keywords:product_return.keywords};
        callback(message_return_score);
    }
});










//                                Database Struct

// basic parameters
var product_number = 24;

// struct of product
class Product {
    constructor(name, score, positive, neutral, negative, reviews, keywords){
        this.name = name;
        this.score = score;
        this.positive = positive;
        this.neutral = neutral;
        this.negative = negative;
        this.reviews = reviews;
        this.keywords = keywords;
    }
    // functions defination
}

// struct of page
class Page {
    constructor(id){
        this.id = id;
        this.products = Array(product_number);
    }
    // functions defination
    get_product(product_name){
        for(var i=0, len=product_number; i<len; i++){
            // if product exist, return the product
            if(this.products[i] != undefined){
                if (product_name == this.products[i].name){
                    return this.products[i];
                }
            } 
            // if not exist, add the product into array
            else 
            {
                let new_product = new Product(product_name, "waiting", 0, 0, 0, '-', null);
                this.set_product(new_product);
                return new_product;
            }
        }
    }
    set_product(product_imp){
        for(var i=0, len=product_number; i<len; i++){
            if(this.products[i] == undefined){
                this.products[i] = product_imp;
                break;
            }
        }
    }
    score_product(product_name, product_score, product_positve, product_neutral, product_negative, product_reviews, product_keywords){
        for(var i=0, len=product_number; i<len; i++){
            // if product exist, return the product
            if(this.products[i] != undefined){
                if (product_name == this.products[i].name){
                    this.products[i].score = product_score;
                    this.products[i].positive = product_positve;
                    this.products[i].neutral = product_neutral;
                    this.products[i].negative = product_negative;
                    this.products[i].reviews = product_reviews;
                    this.products[i].keywords = product_keywords;
                    return this.products[i];
                }
            }
        }
    }

}

// stuct of whole database
class Database {
    constructor(){
        this.pages = Array();
    }
    // functions defination
    add_page(page_id){
        let new_page = new Page(page_id);
        var i = 0;

        while(true)
        {
            if(this.pages[i] == undefined){
                this.pages[i] = new_page;
                break;
            }
            i++;
        }
    }
    remove_page(page_id){
        var i = 0;
        while(this.pages[i] != undefined){
            if(this.pages[i].id.id == page_id)  // 理论上应该是"this.pages[i].id", 这可能是个bug
            {
                console.log("Delete");
                this.pages.splice(i, 1);
            }
            i++;
        }
    }
}

//                            Database Implement

function create_new_page(id){
    let new_page = new Page(id);
    return new_page;
}


// testing code
/*
let databse = new Database();
let page1 = new Page(1);
let product1 = new Product("Switch", 4);
let product2 = new Product("XBOX", 3.5);

page1.set_product(product1);
page1.set_product(product2);

databse.add_page(page1);

databse.remove_page(1);
console.log(databse.pages);
*/
//console.log(page1.id);
//console.log(page1.get_product("Switch").name);












//                 Message Listener Functions

// create Page
page1 = create_new_page(1);

// ===================product window listener===============
function product_window_listener(request){
    return page1.get_product(request.product_name);
}

function score_product_listener(request){
    return page1.score_product(request.product_name, request.product_score, request.product_positive, request.product_neutral, request.product_negative, request.product_reviews, request.product_keywords);
}
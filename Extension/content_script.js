/**
 *  Menu
 * 
 *  1. Main Fucion
        * window listeners
     
*   2. Functions of Software Wizard

*   3. Functions of Compare Window
        * global parameters, database, struct of product
        * open Compare Window
        * create Display Button
        * relocate Compare Window
        * add product
        * remove product
        * sort products
    
*   4. Contentor with Background

 *  5. Functions of Product Window
        * Open Product Window
        * add Product Window content
        * draw Pie Chart
        * Hyperlink check


 */


//                                  Main Function

// A popup window should be create when cursor over Amazon products
// It should be automatically removed when cursor move out of the product and popup window


window.addEventListener("mousemove",
    function mousemove(event){
        var pointing;
        if(pointing = amazon_hyperlink_check(event))      // check if cursor over element of Amazon product
        {
            openProductWindow(event, pointing);
        }
        else if (!insideProductWindow(event.pageX, event.pageY))        // check if cursor over popup window
        {
            closeProductWindow();
        }
    }
)

// Move the compare window to the edge when chrome window is resized
window.onresize = function(){
    relocateCompareWindow();
}

window.onscroll = function(){
    relocateCompareWindow();
}















// ======================Wizard Window==========================

window.onload = function () {

    var wizard_show = false;
    var mouseOffsetX = 0; // current cursor position
    var mouseOffsetY = 0;
    var isDraging = false; // state dragable or not

    var wizard_icon = document.createElement('div');
    wizard_icon.id = 'wizard_icon';
    wizard_icon.setAttribute('class', 'wizard_icon');

    wizard_icon.innerText = '?';

    document.body.appendChild(wizard_icon);

    // function to drag the icon
    // when the mouse is pressed, the marking element can be dragged, and the offset of the current position of the mouse is recorded
    get('wizard_icon').addEventListener('mousedown', function (e) {
      var e = e || window.event;
      // mouse to div-left = e.pageX - get('move').offsetLeft
      mouseOffsetX = e.pageX - get('wizard_icon').offsetLeft;
      mouseOffsetY = e.pageY - get('wizard_icon').offsetTop;
     
      isDraging = true;
    })

    // when the mouse starts to move, check whether the floating layer is marked as moving. If so, update the element position to the current mouse position
    document.onmousemove = function (e) {
      var e = e || window.event;
      var moveX = 0;
      var moveY = 0;

      if (isDraging === true) {
        moveX = e.pageX - mouseOffsetX;
        moveY = e.pageY - mouseOffsetY;
        
        get('wizard_icon').style.left = moveX + "px";
        get('wizard_icon').style.top = moveY + "px";

        var wizard = document.getElementById('wizard');
        if(wizard != null){
            wizard.style.left = moveX + 80 + "px";
            wizard.style.top = moveY + "px";
        }
      }

    }
    
    // when release the mouse, the element becomes non draggable
    document.onmouseup = function () {
      isDraging = false;
    }
    
    function get (id) {
      return document.getElementById(id)
    }

    // open the wizard
    wizard_icon.onclick = function(){
        if(wizard_show)
        {
            var wizard = document.getElementById('wizard');
            document.body.removeChild(wizard);

            wizard_icon.innerText = '?';
            wizard_show = false;
        } 
        else
        {
            openWizard();

            wizard_icon.innerText = 'X';

            wizard_show = true;
        }
        
    }

}

// open the wizard window
var page_num = 8;
var current_page = 0;       // total wizard page
var pages = Array(page_num);

function openWizard(){
    var wizard = document.getElementById('wizard');

    if(wizard == null)
    {
        var wizard = document.createElement('div');
        wizard.id = 'wizard';
        wizard.setAttribute('class', 'wizard');
        document.body.appendChild(wizard);

        var wizard_icon = document.getElementById('wizard_icon');
        wizard.style.left = wizard_icon.offsetLeft + 80 + 'px';
        wizard.style.top = wizard_icon.offsetTop + 'px';



        // title
        var wizard_title = document.createElement('div');
        wizard_title.setAttribute('class', 'wizard_title');
        wizard_title.innerText = 'Program Wizard';



        // content
        var program_wizard_0 = createWizardPage('1. In the Amazon product page, point the mouse to the product(name) to be read.', "images/wizard_0.bmp");
        pages[0] = program_wizard_0;
        var program_wizard_1 = createWizardPage('2. The "Score" is calculated according to the comments of the product. The higher the score, the better the comments.', "images/wizard_1.bmp");
        pages[1] = program_wizard_1;
        var program_wizard_2 = createWizardPage('3. Click the "+Contrast" button, add this item to the comparison list.', "images/wizard_2.bmp");
        pages[2] = program_wizard_2;
        var program_wizard_3 = createWizardPage('4. Check the comparison list at the right-top corner.', "images/wizard_3.bmp");
        pages[3] = program_wizard_3;
        var program_wizard_4 = createWizardPage('5. "Sort" function helps to find the product with the best score.', "images/wizard_4.bmp");
        pages[4] = program_wizard_4;
        var program_wizard_5 = createWizardPage('6. Click the product box to navigate to the location of this product in the page.', "images/wizard_5.bmp");
        pages[5] = program_wizard_5;
        var program_wizard_6 = createWizardPage('7. Click the "minimize" button to hide the window.', "images/wizard_6.bmp");
        pages[6] = program_wizard_6;
        var program_wizard_7 = createWizardPage('8. The software wizard is over. Have a good time.', "images/wizard_7.bmp");
        pages[7] = program_wizard_7;

        program_wizard_0.setAttribute('class', 'wizard_visible_content');


        // buttons
        var wizard_buttons = document.createElement('div');
        wizard_buttons.setAttribute('class', 'wizard_buttons');

        var pre_button = document.createElement('button');
        pre_button.setAttribute('class', 'wizard_button');
        pre_button.innerText = 'Previous';
        pre_button.style.left = "10px";

        pre_button.style.visibility = "hidden";
        pre_button.onclick = function()
        {
            if(current_page != 0)
            {
                pages[current_page].setAttribute('class', 'wizard_hidden_content');
                current_page = current_page - 1;
                if(current_page == 0)
                {
                    pre_button.style.visibility = "hidden";
                }
                pages[current_page].setAttribute('class', 'wizard_visible_content');

                next_button.style.visibility = "visible";
            }

        }

        var next_button = document.createElement('button');
        next_button.setAttribute('class', 'wizard_button');
        next_button.innerText = 'Next';
        next_button.style.right = "10px";

        next_button.onclick = function()
        {
            if(current_page != page_num - 1)
            {
                pages[current_page].setAttribute('class', 'wizard_hidden_content');
                current_page = current_page + 1;
                if(current_page == page_num - 1)
                {
                    next_button.style.visibility = "hidden";
                }
                pages[current_page].setAttribute('class', 'wizard_visible_content');
            
                pre_button.style.visibility = "visible";
            }
            
        }

        wizard_buttons.appendChild(pre_button);
        wizard_buttons.appendChild(next_button);



        // append children
        wizard.appendChild(wizard_title);

        wizard.appendChild(program_wizard_0);
        wizard.appendChild(program_wizard_1);
        wizard.appendChild(program_wizard_2);
        wizard.appendChild(program_wizard_3);
        wizard.appendChild(program_wizard_4);
        wizard.appendChild(program_wizard_5);
        wizard.appendChild(program_wizard_6);
        wizard.appendChild(program_wizard_7);

        wizard.appendChild(wizard_buttons);
        
    }
}

// create the Content of wizard
function createWizardPage(text, image)
{
    var wizard_content = document.createElement('div');
    wizard_content.setAttribute('class', 'wizard_hidden_content');
    
    var wizard_content_text = document.createElement('div');
    wizard_content_text.setAttribute('class', 'wizard_text_part');
    wizard_content_text.innerText = text;

    var wizard_content_image = document.createElement('img');
    wizard_content_image.setAttribute('class', 'wizard_content_image');

    var imgURL = chrome.extension.getURL(image);
    wizard_content_image.src = imgURL;

    wizard_content.appendChild(wizard_content_text);
    wizard_content.appendChild(wizard_content_image);

    return wizard_content;
}


















// ======================compare window Parameters==========================

compare_window_Id = 'compare_window';       // 'id' of compare window
compare_window_width = 350;          // width of compare window
compare_window_height = 450;         // height of compare window


// database for compare_window
var compare_window_core = Array();

// struct of product
class Product {
    constructor(name, score, price, left, top){
        this.name = name;
        this.score = score;
        this.price = price;
        this.left = left;
        this.top = top;
    }
}


// ----------------function used to open compare window------------------
function openCompareWindow(product_name, product_score, product_price, product_left, product_top){
    
    // if the product already exist, do nothing
    var i = 0;
    while(compare_window_core[i] != undefined){
        if(compare_window_core[i].name == product_name) 
        {
            return;
        }
        i++;
    }

    if(i>2)     // resize the compare window menu if products out bound
    {
        var compare_window_menu = document.getElementById('compare_window_menu');
        compare_window_menu.style.width = '317px';
    }

    var compare_window = document.getElementById(compare_window_Id);
    if(compare_window == null)
    {
        var compare_window = document.createElement('div');

        compare_window.setAttribute('id', compare_window_Id);	
        compare_window.setAttribute('class', 'compare_window');

        document.getElementsByTagName('body')[0].appendChild(compare_window); 
        
        // locate the compare window		
        relocateCompareWindow();                // function only locate 'top'
        compare_window.style.right = 0 + 'px';

        // create a product list in compare window
        var product_list = document.createElement('div');

        product_list.id = 'product_list';
        product_list.setAttribute('class', 'product_list');

        // create a menu(div) in comparewindow
        var compare_window_menu = document.createElement('div');
        compare_window_menu.setAttribute('class', 'compare_window_menu');	

        // close button
        var compare_window_close_button = document.createElement("button");
        compare_window_close_button.setAttribute('class', 'compare_window_close_button');

        compare_window_close_button.innerText = "Close";
        compare_window_close_button.onclick =  function(){
                                        compare_window.parentNode.removeChild(compare_window);    // close compare window

                                        var i = 0;
                                        while(true)     // clean the database
                                        {
                                            if(compare_window_core[i] == undefined){
                                                break;
                                            }
                                            compare_window_core[i] = undefined;
                                            i++;
                                        }
                                    };

        // sort button
        var compare_window_sort_button = document.createElement("button");
        compare_window_sort_button.setAttribute('class', 'compare_window_sort_button');

        compare_window_sort_button.innerText = "Sort";
        compare_window_sort_button.onclick = function(){
            
                                        sort_product();

                                        // animation "sort the list"
                                        for(var i=0; i<product_list.childNodes.length; i++){
                                            product_list.childNodes[i].style.transition = "all 0.2s ease";
                                            product_list.childNodes[i].style.background = 'rgb(36, 202, 36, 0.8)';
                                        }
                                        setTimeout(function(){
                                            for(var i=0; i<product_list.childNodes.length; i++){
                                                product_list.childNodes[i].style.background = 'rgba(85, 85, 85, 0.8)';
                                            }
                                        }, 200);

                                        // highlight first product
                                        if(compare_window_core.length !=0){
                                            product_list.childNodes[0].style.borderColor = 'yellow';
                                        }
                                    };

        // hide button
        var compare_window_hide_button = document.createElement("button");
        compare_window_hide_button.setAttribute('class', 'compare_window_hide_button');

        compare_window_hide_button.innerText = ">>>";
        compare_window_hide_button.onclick =  function(){
                                        compare_window.style.right = -1 * compare_window_width + 'px';
                                        setTimeout(function(){createDisplayButton(compare_window);}, 300);
                                    };
        
        // append element
        compare_window_menu.appendChild(compare_window_sort_button);    
        compare_window_menu.appendChild(compare_window_hide_button);         
        compare_window_menu.appendChild(compare_window_close_button);

        compare_window.appendChild(compare_window_menu);
        compare_window.appendChild(product_list);

        // hide the window at first generation
        /*
        setTimeout(function(){
            compare_window_hide_button.click();
        }, 1000);
        */

    }

    // add product to compare window
    add_product(product_name, product_score, product_price, product_left, product_top);

    

}





// -----function to create compare window dispaly button
function createDisplayButton(compare_window){
    
    var compare_window_display_button = document.createElement("button");
    compare_window_display_button.setAttribute('class', 'compare_window_display_button');
    compare_window_display_button.id = 'compare_window_display_button';

    compare_window_display_button.innerText = "<<<";

    // show compare list when hovering
    var compare_window_menu = compare_window.childNodes[0];

    compare_window_display_button.onmouseover = function(){

        compare_window_display_button.innerText = "Pin the window";
        compare_window_display_button.style.width = "367px";

        compare_window.style.right = 0 + 'px';
    }

    compare_window_display_button.onmouseleave = function(){

        compare_window_display_button.innerText = "<<<";
        compare_window_display_button.style.width = "50px";

        compare_window.style.right = -1 * compare_window_width + 'px';

    }

    compare_window_display_button.onclick = function(){
        compare_window_display_button.parentNode.removeChild(compare_window_display_button);

        compare_window_menu.style.display = 'block';
        compare_window.style.right = 0 + 'px';
    }

    document.getElementsByTagName('body')[0].appendChild(compare_window_display_button); 

    // relocate the display button
    relocateCompareWindow();
}





// -----function used to relocate compare window when chrome window resized-----
function relocateCompareWindow(){
    if(document.documentElement.scrollTop < 140)
    {
        compare_window_top = 140 - document.documentElement.scrollTop;        // 100 是Amazon顶框的高度，40 是筛选框的高度
    } else
    {
        compare_window_top = 0; 
    }

    // set the compare window position
    var compare_window = document.getElementById(compare_window_Id);
    if(compare_window != null)
    {
        compare_window.style.top = compare_window_top + 'px';
    }

    // set the compare window display button position
    var compare_window_display_button = document.getElementById('compare_window_display_button');
    if(compare_window_display_button != null)
    {
        compare_window_display_button.style.top = compare_window_top + 'px';
    }
}




// ----------------------add a new product to list------------------------
function add_product(name, score, price, product_left, product_top){

    // control part
    let new_product_data = new Product(name, score, price, product_left, product_top);

    // add Product to the end of Array
    var i = 0;
    while(true)
    {
        if(compare_window_core[i] == undefined){
            compare_window_core[i] = new_product_data;
            break;
        }
        i++;
    }

    // view part
    var product_list = document.getElementById("product_list");

    var new_product = document.createElement("div");
    new_product.id = name;      // 'id' is defined as product name
    new_product.setAttribute('class', 'new_product');

    var new_product_content = document.createElement('div');
    new_product_content.setAttribute('class', 'new_product_content');



    // funtion to locate the product in web page
     new_product_content.onmouseover = function(){
        new_product.style.width = "350px";
        new_product_content.style.width = "300px";
    }

    new_product_content.onmouseleave = function(){
        new_product.style.width = "300px";
        new_product_content.style.width = "250px";
    }

    new_product_content.onclick = function(){
        document.documentElement.scrollTop = product_top - 500;

        // bookmark animation
        var product_bookmark = document.createElement('div');
        product_bookmark.setAttribute('class', 'product_bookmark');


        product_bookmark.style.left = product_left + 'px';
        product_bookmark.style.top = product_top + 'px';

        document.body.appendChild(product_bookmark);
        product_bookmark.style.height = 150 + 'px';

        
        setTimeout(function()
        {
            product_bookmark.style.height = 0 + 'px';

            setTimeout(function()
            {
                product_bookmark.parentNode.removeChild(product_bookmark);
            }, 300);
        }, 1000);
        
    }


    

    // content of the product

    // product name
    var new_product_name = document.createElement("div");
    new_product_name.setAttribute('class', 'new_product_name');
    new_product_name.innerText = name;

    // product price
    var new_product_price = document.createElement('div');
    new_product_price.setAttribute('class', 'new_product_price');
    new_product_price.innerText = price;

    // score
    var new_product_score = document.createElement("div");
    new_product_score.setAttribute('class', 'new_product_score');

    var new_product_score_word = document.createElement('div');
    new_product_score_word.setAttribute('class', 'new_product_score_word');
    new_product_score_word.innerText = 'Score:';

    var new_product_score_mark = document.createElement('div');
    new_product_score_mark.setAttribute('class', 'new_product_score_mark');
    new_product_score_mark.innerText = score;

    var new_product_score_base = document.createElement('class', 'new_product_score_base');
    new_product_score_base.setAttribute('class', 'new_product_score_base');
    new_product_score_base.innerText = '/5';

    new_product_score.appendChild(new_product_score_word);
    new_product_score.appendChild(new_product_score_mark);
    new_product_score.appendChild(new_product_score_base);


    // remove product button
    product_remove_button = document.createElement("button");
    product_remove_button.setAttribute('class', 'product_remove_button');
    product_remove_button.innerText = "-";
    product_remove_button.onclick = function(){
                                        remove_product(this.parentNode.id);
                                    };

    


    new_product_content.appendChild(new_product_name);
    new_product_content.appendChild(new_product_price);
    new_product_content.appendChild(new_product_score);

    new_product.appendChild(new_product_content);
    new_product.appendChild(product_remove_button);

    product_list.appendChild(new_product);

    // remove the highlight of first product
    if(compare_window_core.length !=0){
        product_list.childNodes[0].style.borderColor = 'rgb(0,0,0,0)';
    }
}

// --------------------------remove the product from list----------------------------
function remove_product(id_remove){
    // view part
    var product_remove = document.getElementById(id_remove);

    product_remove.style.transition = "all 0.2s ease";
    product_remove.style.backgroundColor = 'red';
    setTimeout(function(){product_remove.parentNode.removeChild(product_remove);}, 200);
    
    // control part
    var i = 0;
    while(compare_window_core[i] != undefined){
        if(compare_window_core[i].name == product_remove.id)        // product_remove's id is the name of Product
        {
            compare_window_core.splice(i, 1);
        }
        i++;
    }

    if(i<=3)     // resize the compare window menu if products in bound
    {
        setTimeout(function(){
            var compare_window_menu = document.getElementById('compare_window_menu');
        compare_window_menu.style.width = '300px';
        }, 200);    // the deleting of product need 0.2 seconds
        
    }
}

// ----------------------sort the product list-----------------------------------
function sort_product(){

    // sort the list data
    var i = 0, j;
    while(compare_window_core[i] != undefined){
        j = i+1;
        while(compare_window_core[j] != undefined){
            if(compare_window_core[i].score < compare_window_core[j].score)
            {
                temp_product = compare_window_core[i];
                compare_window_core[i] = compare_window_core[j];
                compare_window_core[j] = temp_product;
            }
            j++;
        }
        i++;
    }

    // clean the product list
    var product_list = document.getElementById('product_list');
    while(product_list.hasChildNodes()) 
    {
        product_list.removeChild(product_list.firstChild);
    }

    // add all product in order
    for(i=0; i<j; i++){
        temp_product = compare_window_core[i];
        add_product(temp_product.name, temp_product.score, temp_product.price, temp_product.left, temp_product.top);
    }

    // remove half of the list data
    compare_window_core.splice(1, j);

}

























//                              Content Functions

// Request data of product from database, if not exist, call python function

var old_hyperlink;      // avoid multi-request

function product_require(name, hyperlink, price, product_left, product_top) {
    var message_send = {id:"product_window_request", product_name:name, product_hyperlink:hyperlink,};
    if(typeof chrome.app.isInstalled!=="undefined"){
        chrome.runtime.sendMessage(message_send, function (response) {

            if(response.id == "product_window_return"){
                
                product_name = response.product_name;
                product_score = response.product_score;
                positive = response.product_positive;
                negative = response.product_negative;
                neutral = response.product_neutral;
                reviews = response.product_reviews;
                keywords = response.product_keywords;

                productWindowContent(product_name, product_score, price, reviews, keywords, product_left, product_top, positive, neutral, negative);

                if(product_score == "waiting"){
                    if(hyperlink != old_hyperlink){
                        getScore(name, hyperlink, price, product_left, product_top);
                        old_hyperlink = hyperlink;
                    }
                }
 
            }

        });
    }
}


// request calculated sentimental score of a product from python
function getScore(name, hyperlink, price, product_left, product_top) {
    var xhr = getXMLHttpRequest()
    xhr.open('POST', 'http://127.0.0.1:8080/sendData')
    
    
    // json
    xhr.setRequestHeader('Content-Type', 'application/json')
    var json = hyperlink;

    xhr.send(JSON.stringify(json))
    
    xhr.onreadystatechange = function(){
        if(xhr.readyState === 4) {
            if(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
                var obj = JSON.parse(xhr.responseText);
            
                var newscore = obj['score'];
                var positive = obj['pos'];
                var negative = obj['neg'];
                var neutral = obj['neu'];
                var reviews = obj['reviews'];
                var keywords = obj['keywords'];

                if(newscore == -1){
                    newscore = '---';
                }

                if(keywords.lenth == 0){
                    keywords = null;
                }

                pass_score(name, newscore, price, product_left, product_top, positive, neutral, negative, reviews, keywords);
                return obj['score', 'pos', 'neu', 'neg', 'reviews', 'keywords'];
            }
            else
            {
            return null;
            } 
        }
    }
}
    
// generate a XMLHttpRequest
function getXMLHttpRequest() { 
    var xmlHttpRequest = null;
    if(window.XMLHttpRequest) { 
        xmlHttpRequest = new XMLHttpRequest(); 
    }
    else 
    { 
        if(window.ActiveXObject) { 
            try {//IE5、6 
                xmlHttpRequest = new ActiveXObject("Microsoft.XMLHTTP"); 
            } catch(e){ 
            try { 
                xmlHttpRequest = new ActiveXObject("Msxml2.XMLHTTP"); 
            } catch(e){} 
            }
        } 
    } 
    return xmlHttpRequest; 
} 


// pass score to database
function pass_score(name, newscore, price, product_left, product_top, positive, negative, neutral, reviews, keywords) {
        var message_send = {id:"pass_score_request", product_name:name, product_score:newscore, product_positive:positive, product_negative:negative, product_neutral:neutral, product_reviews:reviews, product_keywords:keywords};
        if(typeof chrome.app.isInstalled!=="undefined"){
            chrome.runtime.sendMessage(message_send, function (response) {
                if(response.id == "pass_score_return"){
                    product_name = response.product_name;
                    product_score = response.product_score;
                    positive = response.product_positive;
                    negative = response.product_negative;
                    neutral = response.product_neutral;
                    reviews = response.product_reviews;
                    keywords = response.product_keywords;
                    
                    if(product_window != null){ 
                        var childs = product_window.childNodes; 
                        for(var i = childs.length - 1; i >= 0; i--) {
                            product_window.removeChild(childs[i]);
                        }
                    }

                    productWindowContent(product_name, product_score, price, reviews, keywords, product_left, product_top, positive, neutral, negative);
                }
            });
        }
    }












//                                  Product Window

// ===========================product window Parameters======================================

product_window_Id = 'product_window';    // 'id' of popup window
product_window_width = 400;          // width of product window
product_window_height = 300;         // height of product window
product_window_left = 0;             // store left of current product window
product_window_top = 0;              // store top of current product window

// function used to check, open product window and get product data
function openProductWindow(event, pointing){
    
    var temp_pointing = pointing;
    var product_window = document.getElementById(product_window_Id);
    if(product_window == null)
    {
        var product_window = document.createElement('div');     // create element (productwindow)
        
        product_window.setAttribute('id', product_window_Id);
        product_window.setAttribute('class', 'product_window');

        product_window_left = event.pageX;
        if(window.innerWidth - product_window_width < product_window_left){     // product window should inside chrome window (right edge)
            product_window_left = window.innerWidth - product_window_width;
        }
        
        product_window_top = event.pageY;
        if(window.innerHeight - (product_window_height - document.documentElement.scrollTop) < product_window_top){     // product window should inside chrome window (bottom edge)
            product_window_top = window.innerHeight - (product_window_height - document.documentElement.scrollTop);
        }

        product_window.style.top = product_window_top + 'px';
        product_window.style.left = product_window_left - 25 + 'px';	 

        // require product score from background

        // search for hyperlink
        var hyperlink = null;
        var hyperlink_node = temp_pointing;

        while(hyperlink == null && hyperlink_node != document.body){
            hyperlink = hyperlink_node.getAttribute("href");
            hyperlink_node = hyperlink_node.parentNode;
        }

        // get the name
        var name = "";
        if(temp_pointing.innerText != null)
        {
            name = temp_pointing.innerText;
        }

        // the location of the product on screen
        var temp_x = temp_pointing.getBoundingClientRect().left;
        var temp_y = temp_pointing.getBoundingClientRect().top + document.documentElement.scrollTop;
        var price = "N/A";



        var last_temp_pointing = null;         // record the parent div

        // function Search for price 
        while(temp_pointing != null){
            if(temp_pointing.className == "a-section a-spacing-none" || temp_pointing.className == "a-section a-spacing-small a-spacing-top-small" || temp_pointing.className == "a-section a-spacing-small s-padding-left-small s-padding-right-small" || temp_pointing.className == "b5zgse-0 kxVzkh")
            {
                break;
            }
            temp_pointing = temp_pointing.parentNode;
        }

        if(temp_pointing != null)
        {
            last_temp_pointing = temp_pointing;
            temp_pointing = temp_pointing.childNodes[2];
            if(temp_pointing == null)
            {
                temp_pointing = last_temp_pointing.childNodes[1];     // for some product with only 2 children, price may exist in second child
            }
        }
        last_temp_pointing = null;          // clean the data

        while(temp_pointing != null)    // search for price
        {
            if(temp_pointing.className == "a-offscreen" || includeClass(temp_pointing, "XmvAr"))
            {
                price = temp_pointing.innerText;
                break;
            }
            last_temp_pointing = temp_pointing;
            temp_pointing = temp_pointing.firstChild;
        }

        if(temp_pointing == null)   // for some products, price is not in the first child
        {
            temp_pointing = last_temp_pointing;

                while(temp_pointing != null)
                {
                    last_temp_pointing = last_temp_pointing.parentNode;
                    temp_pointing = temp_pointing.childNodes[1];
                
                    while(temp_pointing != null)
                    {
                        if(temp_pointing.className == "a-offscreen")
                        {
                            price = temp_pointing.innerText;
                            break;
                        }
                        temp_pointing = temp_pointing.firstChild;
                    }

                    if(temp_pointing == null)   // can't find price
                    {
                        temp_pointing = last_temp_pointing;
                    }
                } 

        }



        // require the information of product from background
        product_require(name, hyperlink, price, temp_x, temp_y);

        document.getElementsByTagName('body')[0].appendChild(product_window);       //'appendChild' is used to insert product window into chrome
    }

}

// function used to add content for product window
function productWindowContent(product_name, product_score, price, comment_num, product_key_words, product_left, product_top, positive_comment, neutral_comment, negative_comment){

    if(product_score == '---'){
        product_key_words = null;
    }

    var product_window = document.getElementById('product_window');

    if(product_window != null){

        var product_window_body = document.createElement('div');
        product_window_body.id = "product_window_body";
        product_window_body.setAttribute('class', "product_window_body");



        // product name
        var product_window_name = document.createElement('div');
        product_window_name.setAttribute('class', "product_name");

        product_window_name.innerHTML = product_name;



        // product score
        
        var product_window_score = document.createElement('div');
        product_window_score.setAttribute('class', 'product_score');

        var product_window_score_word = document.createElement('div');
        product_window_score_word.setAttribute('class', 'new_product_score_word');
        product_window_score_word.innerText = 'Score:';

        var product_window_score_mark = document.createElement('div');
        product_window_score_mark.setAttribute('class', 'new_product_score_mark');
        product_window_score_mark.innerText = product_score;

        var product_window_score_base = document.createElement('class', 'new_product_score_base');
        product_window_score_base.setAttribute('class', 'new_product_score_base');
        product_window_score_base.innerText = '/5';

        product_window_score.appendChild(product_window_score_word);
        product_window_score.appendChild(product_window_score_mark);
        product_window_score.appendChild(product_window_score_base);



        // draw pie chart
        var product_window_chart_div = document.createElement('div');
        product_window_chart_div.setAttribute('class', 'product_window_chart_div');

        var product_window_pie_chart = document.createElement('canvas');
        product_window_pie_chart.setAttribute('class', 'product_window_pie_chart');

        var tool_tip = document.createElement('div');
        tool_tip.setAttribute('class', 'tool_tip');
        tool_tip.id = 'tooltip';

        drawPieChart(product_window_pie_chart, [positive_comment, neutral_comment, negative_comment]);

        product_window_chart_div.appendChild(product_window_pie_chart);
        product_window_chart_div.appendChild(tool_tip);

        // key words
        var key_words = document.createElement('div');
        key_words.setAttribute('class', 'key_words');
        
        generate_key_words(key_words, product_key_words);

        // data declearation
        var data_declearation = document.createElement('div');
        data_declearation.setAttribute('class', 'data_declearation');

        var declearation_body_1 = document.createElement('span');
        declearation_body_1.innerText = "Base on ";

        var declearation_number = document.createElement('span');
        declearation_number.style.color = 'rgb(255, 200, 60)';
        declearation_number.innerText = comment_num;

        var declearation_body_2 = document.createElement('span');
        declearation_body_2.innerText = " comments";

        data_declearation.appendChild(declearation_body_1);
        data_declearation.appendChild(declearation_number);
        data_declearation.appendChild(declearation_body_2);



        // add animation
        var add_animation = document.createElement('div');
        add_animation.setAttribute('class', 'add_animation');

        add_animation.innerText = '+';



        // + contrast button
        if(product_score != "waiting"){
            var product_add_button = document.createElement("button");
            product_add_button.setAttribute('class', 'product_add_button');

            product_add_button.innerText = "+ Compare";
            product_add_button.onmouseover = function(){
                                                product_add_button.innerText = "+ Compare";
                                            };
            
            product_add_button.onmouseleave = function(){
                                                product_add_button.innerText = "+";
                                            };
            product_add_button.onmousedown = function(){
                                                product_add_button.style.color = 'rgb(16, 95, 16)';
                                            };

            product_add_button.onmouseup = function(){
                                                product_add_button.style.color = 'white';
                                            };

            product_add_button.onclick = function(){
                                            // if the product already exist, do nothing
                                            var i = 0;
                                            while(compare_window_core[i] != undefined){
                                                if(compare_window_core[i].name == product_name) 
                                                {
                                                    product_add_button.innerText = "already in List";
                                                    product_add_button.style.backgroundColor = 'rgb(200, 150, 35)';
                                                    return;
                                                }
                                                i++;
                                            }
                                            openCompareWindow(product_name, product_score, price, product_left, product_top);

                                            // animation "a product is added"
                                            add_animation.style.transition = "all 0s ease";
                                            add_animation.style.display = 'block';
                                            add_animation.style.left = product_window_left + 'px';
                                            add_animation.style.top = product_window_top - document.documentElement.scrollTop + 'px';

                                            console.log(product_window_top - document.documentElement.scrollTop);

                                            add_animation.style.transition = "all 1s ease";
                                            add_animation.style.left = window.innerWidth + 'px';
                                            add_animation.style.top = 150 + 'px';
                                            add_animation.style.color = 'rgb(0,0,0,0)';
                                            add_animation.style.backgroundColor = 'rgb(0,0,0,0)';
                                            setTimeout(function(){add_animation.style.display = 'none'}, 500);
                                            
                                        };
            product_window.appendChild(product_add_button);
        }
        


        // add child nodes to product window
        product_window_body.appendChild(product_window_name);
        product_window_body.appendChild(product_window_score);
        product_window_body.appendChild(product_window_chart_div);
        product_window_body.appendChild(key_words);
        product_window_body.appendChild(data_declearation);
                                    
        // append element
        product_window.appendChild(product_window_body);
        
        document.body.appendChild(add_animation);
    }
}


// function used to close product windows
function closeProductWindow(){	

    var product_window = document.getElementById(product_window_Id);
    if(product_window != null)
    {
        document.getElementsByTagName('body')[0].removeChild(product_window);       //'removeChild' is used to remove product window from chrome
    }
}

// function used to check the cursor inside opened product window
function insideProductWindow(cursorX, cursorY){

    product_window_right = product_window_left + product_window_width + 10;
    product_window_bottom = product_window_top + product_window_height + 10;

    if (cursorX > product_window_left -10 && cursorX < product_window_right && cursorY > product_window_top -10 && cursorY < product_window_bottom)     // cursor inside window
    {
        return true;
    }
    else
    {
        return false;
    }
}

// generate key words
function generate_key_words(parent_node, key_words)
{
    if(key_words != null)
    {
        for(var i=0; i<3; i++)
        {
            var new_key_word = document.createElement('div');
            new_key_word.setAttribute('class', 'new_key_word');
    
            new_key_word.innerText = key_words[i];
    
            parent_node.appendChild(new_key_word);
        }
    }

}

// function used to draw pie chart
function drawPieChart(canvas, data_arr)  
{
    let ctx = canvas.getContext("2d");
        data = [
            { text: "Positive: ", count: data_arr[0], color: "rgb(54, 252, 54)" },
            { text: "Neutral: ", count: data_arr[1], color: "rgb(249, 252, 54)" },
            { text: "Negative: ", count: data_arr[2], color: "rgb(252, 54, 54)" }
        ];
        function DrawPipe(data) {
            this.data = data;
            this.ctx = ctx;
            this.width = this.ctx.canvas.width;
            this.height = this.ctx.canvas.height;
            // center and radius
            this.x0 = this.width / 2 ;
            this.y0 = this.height / 2;
            this.r = 50;
            // movement rate
            this.steps = 1;
            this.stepsCounts = 50;
            this.speed = 0.5;
            // values required for initialization
            this.counts = 0;
            this.dataTransformToAngle = [];
            this.startAngle = 0;
            this.endAngle = 0;
            const that = this;
            // mouse in coordinates
            this.mousePosition = {};
            this.mouseTimer = null;
            // calculate sum
            this.data.forEach(element => {
                that.counts += element.count;
            });
            // calculate angle
            this.data.forEach(item => {
                // angle conversion
                item.angle = item.count / that.counts * Math.PI * 2;
                that.dataTransformToAngle.push(item);
            });
        }
        DrawPipe.prototype.init = function () {
            this.dynamicPipe();
            this.addEvent();
        }

        // Draw the circle
        DrawPipe.prototype.dynamicPipe = function () {
            
            const that = this;
            this.ctx.save();
            // offset and rotation settings of coordinate system
            this.ctx.translate(this.x0, this.y0);
            this.ctx.rotate((Math.PI * 2 / this.stepsCounts) * this.steps / 2);

            this.dataTransformToAngle.forEach((item, i) => {
                that.endAngle = that.endAngle + item.angle * that.steps / that.stepsCounts;
                that.ctx.beginPath();
                // reset the position of the center of the circle
                that.ctx.moveTo(0, 0);
                that.ctx.arc(0, 0, this.r * that.steps / this.stepsCounts, this.startAngle, that.endAngle);

                // put the mouse to take effect
                if (that.ctx.isPointInPath(that.mousePosition.x, that.mousePosition.y)) {
                    that.ctx.moveTo(0, 0);
                    that.ctx.arc(0, 0, that.r + 20, that.startAngle, that.endAngle);
                    let text = item.text + (item.angle / (Math.PI * 2) * 100.00).toFixed(2) + '%';
                    this.toolTip(that.mousePosition.x, that.mousePosition.y, text);
                }

                that.ctx.closePath();
                that.ctx.fillStyle = item.color;
                that.ctx.fill();
                that.ctx.globalAlpha = 1;
                that.startAngle = that.endAngle;

                // after drawing a cycle, restore the starting position
                if (i == that.dataTransformToAngle.length - 1) {
                    that.startAngle = 0;
                    that.endAngle = 0;
                }
                
            });

            this.ctx.restore();
            
            if (this.steps < this.stepsCounts) {
                this.steps++;
                setTimeout(() => {
                    that.ctx.clearRect(0, 0, that.width, that.height);
                    that.dynamicPipe();
                }, that.speed *= 1.085);
            }
            
        }
        
        DrawPipe.prototype.addEvent = function () {
            this.ctx.canvas.addEventListener("mousemove", function (e) {
                
                this.mousePosition.x = e.offsetX;
                this.mousePosition.y = e.offsetY;
                clearTimeout(this.mouseTimer);
                
                this.mouseTimer = setTimeout(() => {
                    this.ctx.clearRect(0, 0, this.width, this.height);
                    this.dynamicPipe();
                }, 0);
                
                if (!this.ctx.isPointInPath(this.mousePosition.x, this.mousePosition.y)) {
                    let doc = document.getElementById("tooltip");
                    doc.style.visibility = "hidden";
                }
            }.bind(this))
        }
        
        DrawPipe.prototype.toolTip = function (x, y, text) {
            
            let doc = document.getElementById("tooltip");
            doc.style.visibility = "visible";
            
            if (doc.hasChildNodes()) {
                doc.childNodes[0].innerText = text;
                doc.style.left = x + 90 + "px";
                doc.style.top = y + 120 + "px";
            }
            else {
                let span = document.createElement("span");
                span.innerText = text;
                doc.style.left = x + 90 + "px";
                doc.style.top = y + 120 + "px";
                doc.appendChild(span);
            }
            
            
        }
        
        let test = new DrawPipe(data);
        test.init();
    
}  

// function used to check if the hyper-link at cursor is the Amazon product page
function amazon_hyperlink_check(event) {
    
    var pointing = document.elementFromPoint(event.clientX, event.clientY);

    var checkhyperlink_condition1 = /^([\/\w\-\%\:\.]?)+(\/dp\/)+[\w\-\.\_\~\:\/\?\#[\]\@!\$\&\'\*\+\,\;\=\.\%]+$/g;
    var checkhyperlink_condition2 = /^\/gp\/+[\w\-\._~:/?#[\]@!\%\$&'\*\+,;=.]+$/g;
    var checkcurrent = /^https:\/\/www.amazon.com\/+[\w\-\._~:?#[\]@!\$&'\*\+,;=.]+$/g ;
          
    var url = window.location.href;
    var current = new RegExp(checkcurrent);
    var hyperlink_1 = new RegExp(checkhyperlink_condition1);
    var hyperlink_2 = new RegExp(checkhyperlink_condition2);

    if(pointing != null)
    {
        // product list
        if(includeClass(pointing, 'a-color-base') && includeClass(pointing, 'a-text-normal')){
            if(hyperlink_1.test(pointing.parentNode.getAttribute("href")) || hyperlink_2.test(pointing.parentNode.getAttribute("href"))){
                return pointing;
            }
            
            if(hyperlink_1.test(pointing.parentNode.parentNode.getAttribute("href")) || hyperlink_2.test(pointing.parentNode.parentNode.getAttribute("href"))){
                return pointing;
            }
        }

        // space of product list
        if(includeClass(pointing, 'a-size-mini') && includeClass(pointing, 'a-spacing-none') && includeClass(pointing, 'a-color-base')){
            if(hyperlink_1.test(pointing.firstChild.getAttribute("href")) || hyperlink_2.test(pointing.firstChild.getAttribute("href"))){
                return pointing.firstChild.firstChild;
            }
        }

        // recomand list
        if(includeClass(pointing, 'a-truncate-full')){ 
            if(hyperlink_1.test(pointing.parentNode.parentNode.getAttribute("href")) || hyperlink_2.test(pointing.parentNode.parentNode.getAttribute("href"))){
                return pointing;
            }
        }

        // history list
        if(includeClass(pointing, "p13n-sc-truncate-fallback"))
        {
            if(hyperlink_1.test(pointing.parentNode.parentNode.getAttribute("href")) || hyperlink_2.test(pointing.parentNode.parentNode.getAttribute("href"))){
                return pointing;
            }
        }

        // gifts webpage
        if(pointing.className == "sc-167fkr-0 z5x770-0 hoLOMk iJcgAl")
        {
            if(hyperlink_1.test(pointing.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute("href")) || hyperlink_2.test(pointing.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute("href"))){
                return pointing;
            }
        }
        
    }

    return null;
}

// function used to check emement containing specific class
function includeClass(element, class_name){
    if(element != null)
    {
        return ((' ' + element.className + ' ').indexOf(' '+ class_name +' ') > -1);
    }
    else
    {
        return false;
    }
    
}


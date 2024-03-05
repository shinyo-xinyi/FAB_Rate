
var page_num = 8;
var current_page = 0;       // total wizard page
var pages = Array(page_num);

var program_wizard_0 = document.getElementById("program_wizard_0");
pages[0] = program_wizard_0;
var program_wizard_1 = document.getElementById("program_wizard_1");
pages[1] = program_wizard_1;
var program_wizard_2 = document.getElementById("program_wizard_2");
pages[2] = program_wizard_2;
var program_wizard_3 = document.getElementById("program_wizard_3");
pages[3] = program_wizard_3;
var program_wizard_4 = document.getElementById("program_wizard_4");
pages[4] = program_wizard_4;
var program_wizard_5 = document.getElementById("program_wizard_5");
pages[5] = program_wizard_5;
var program_wizard_6 = document.getElementById("program_wizard_6");
pages[6] = program_wizard_6;
var program_wizard_7 = document.getElementById("program_wizard_7");
pages[7] = program_wizard_7;

var pre_button = document.getElementById("pre_button");
var next_button = document.getElementById("next_button");


// initial the popup
pre_button.style.visibility = "hidden";

pre_button.onclick = function()
{
    if(current_page != 0)
    {
        pages[current_page].setAttribute('class', 'hidden_content');
        current_page = current_page - 1;
        if(current_page == 0)
        {
            pre_button.style.visibility = "hidden";
        }
        pages[current_page].setAttribute('class', 'visible_content');

        next_button.style.visibility = "visible";
    }

}

next_button.onclick = function()
{
    if(current_page != page_num - 1)
    {
        pages[current_page].setAttribute('class', 'hidden_content');
        current_page = current_page + 1;
        if(current_page == page_num - 1)
        {
            next_button.style.visibility = "hidden";
        }
        pages[current_page].setAttribute('class', 'visible_content');
    
        pre_button.style.visibility = "visible";
    }
    
}



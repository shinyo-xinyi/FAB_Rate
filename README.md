# <center>FAB-rate system</center>

| Content                                     |
| ------------------------------------------- |
| [Introduction](#introduction)               |
| [Aims and Objectives](#Aims-and-Objectives) |
| [Components](#components)                   |
| [How to Run](#how-to-run)                   |
| [Code Reference](#Code-Reference)           |



Introduction
----------------------


The system, FAB-rate, is an evaluation add-on software to do sentiment analysis about product reviews on shopping websites,（currently support Amazon） in order to improve the user experience and meet the user requirements. It can also visualize the  sentiment results to users. 

First, the FAB-rate software serves as a Google add-on. The user only needs to install the add-on in the browser, and the relevant information like the URL of the product website  will be transmitted to the back-end for processing through Ajax. Second, we use Python to crawl all reviews of the item to the back-end. Thirdly, Sentiment analysis is  performed using a VADER improved dictionary. In this step,  we use isolation forest, a machine learning method to detect outliers of the results. Finally, the analysis results are returned to the front-end by flask and visualized to users on the web page, including product name, price, product score based on user review sentiment analysis, product keywords extracted from user reviews and the comment analysis pie chart.



### Aims and Objectives

FAB-rate collects user feedback of the products and detects hidden sentiments in comments and rates the product(s) accordingly. These aims and objectives is included:

- The FAB-rate system generates a rating for the system based on the comments of customers.

- The FAB-rate system calculates a more accurate rating based on user sentimental analysis system.

- The FAB-rate system is a simple and easy to use, which follows the user friendly principles.




### Components

The code is divided into two parts: 

- Extension: Google Chrome add-on part which servers as the client end
- Server: a python project serves as a server end

The documentation contains the following files:

- a user manual
- an installation tutorial
- a QA manual



### How to Run

See installation tutorial (both English and Chinese version) and user manual in Documentation file. 



### Code Reference

Hutto, C.J. & Gilbert, E.E. (2014). VADER: A Parsimonious Rule-based Model for Sentiment Analysis of Social Media Text. Eighth International Conference on Weblogs and Social Media (ICWSM-14). Ann Arbor, MI, June 2014.


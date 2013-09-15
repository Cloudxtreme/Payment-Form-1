#Credit Card Form

I wanted to design a payment gateway which was simple and elegant while also supporting rich client-side validation and end-user respone systems to prevent unnessary server requests.

I made use of HTML5's form validation paramaters as the first layer of user-feedback, making sure that the form is not able to be submitted until all of the fields contain inputs which could possibly be valid for a credit card.

Upon form submission the card number is then checked using the LUHN formula. If this test passes the card data is aggretaed into a single JSON document and is sent via a POST AJAX request to the server. Ideally this data would be encrypted on the client but such a task is beyond the scope of this project.

On the server the card information would be securely checked and the transaction would occur. A JSON response object is then sent back to the client. In this demo a "success" message is always sent if the client validations pass. A success message is then displayed to the client. 


Testing
----

I would recommend using one of the following valid card numbers for testing purposes. For testing invalid card numbers I recommend typing in any amount of digits, chances are that you will not produce a valid credit card number.

###Valid Card Numbers

* 4111111111111111
* 6011111111111117
* 5111111111111118
* 371111111111114

---------


##### LUHN Algorithm Code Source: 
http://web.archive.org/web/20100129174150/http://javascript.internet.com/forms/credit-card-number-validation.html?

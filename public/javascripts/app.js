$(document).ready(function(){

  $('#cardForm').submit(function(e){
    e.preventDefault();
    $form = $(this);

    //disable button for submittion
    $form.find('button').prop('disabled', true);

    //hide all messages
    $form.find('#card-message').addClass('hidden');

    var resObj = makeResObj($form);

    if(validateCardNum(resObj.number)){
      submitPayment($form, resObj);
    }
    else{
      renderError($form, "Invalid Card Number!");
    }

  });
});


//sends ajax request to the server to process the card payment object
function submitPayment($form, obj){
  $.post('/submit', obj, function(res){
      console.log(res);
      renderSuccess($form, res.message);
  });
}

// Prepares a javascript object to be sent as a response
function makeResObj($form){

  //this information should really be encrypted before it is send
  // to the server. There should be an application-specific public key
  // for the client which all of the input fields are encrypted with.
  // on post to the server the server would decrypt using the private
  // key and perform any other validation checks.
  // For the sake of brevity I will not do this.


  var cardNum = $form.find('#num').val();
  var cardExp = $form.find('#expiry').val();
  var cardCvc = $form.find('#cvc').val();

  var curTime = new Date().getTime();

  var obj = {
    number: cardNum,
    expiry: cardExp,
    cvc: cardCvc,
    tSent: curTime
  };

  return obj;
}

//
//returns truthy if all of the fields in the credit card form are valid
// a lot of this stuff is han
//

// render error message
function renderError($form, message){
  var errMessage = message || "Transaction Failed!"
  $form.find('#card-message').removeClass('hidden').removeClass('success').addClass('error');

  $form.find('#message-text').text(errMessage).removeClass('msg-success').addClass('msg-error');
  $form.find('button').prop('disabled', false);
}

// render success message
function renderSuccess($form, message){
  var succMessage = message || "Transaction Succeeded!"
  $form.find('#card-message').removeClass('hidden').removeClass('error').addClass('success');
  $form.find('#message-text').text(succMessage).removeClass('msg-success').addClass('msg-success');


  //empty all of the input fields so the same info is not resubmited

  $form.find('#num').val('');
  $form.find('#expiry').val('');
  $form.find('#cvc').val('');
  $form.find('button').prop('disabled', false);


}




///
// validation formula
///
///http://web.archive.org/web/20100129174150/http://javascript.internet.com/forms/credit-card-number-validation.html?

function validateCardNum(ccNumb) {  // v2.0
var valid = "0123456789"  // Valid digits in a credit card number
var len = ccNumb.length;  // The length of the submitted cc number
var iCCN = parseInt(ccNumb);  // integer of ccNumb
var sCCN = ccNumb.toString();  // string of ccNumb
sCCN = sCCN.replace (/^\s+|\s+$/g,'');  // strip spaces
var iTotal = 0;  // integer total set at zero
var bNum = true;  // by default assume it is a number
var bResult = false;  // by default assume it is NOT a valid cc
var temp;  // temp variable for parsing string
var calc;  // used for calculation of each digit

// Determine if the ccNumb is in fact all numbers
for (var j=0; j<len; j++) {
  temp = "" + sCCN.substring(j, j+1);
  if (valid.indexOf(temp) == "-1"){bNum = false;}
}

// if it is NOT a number, you can either alert to the fact, or just pass a failure
if(!bNum){
  bResult = false;
}

// Determine if it is the proper length
if((len == 0)&&(bResult)){  // nothing, field is blank AND passed above # check
  bResult = false;
} else{  // ccNumb is a number and the proper length - let's see if it is a valid card number
  if(len >= 15){  // 15 or 16 for Amex or V/MC
    for(var i=len;i>0;i--){  // LOOP throught the digits of the card
      calc = parseInt(iCCN) % 10;  // right most digit
      calc = parseInt(calc);  // assure it is an integer
      iTotal += calc;  // running total of the card number as we loop - Do Nothing to first digit
      i--;  // decrement the count - move to the next digit in the card
      iCCN = iCCN / 10;                               // subtracts right most digit from ccNumb
      calc = parseInt(iCCN) % 10 ;    // NEXT right most digit
      calc = calc *2;                                 // multiply the digit by two
      // Instead of some screwy method of converting 16 to a string and then parsing 1 and 6 and then adding them to make 7,
      // I use a simple switch statement to change the value of calc2 to 7 if 16 is the multiple.
      switch(calc){
        case 10: calc = 1; break;       //5*2=10 & 1+0 = 1
        case 12: calc = 3; break;       //6*2=12 & 1+2 = 3
        case 14: calc = 5; break;       //7*2=14 & 1+4 = 5
        case 16: calc = 7; break;       //8*2=16 & 1+6 = 7
        case 18: calc = 9; break;       //9*2=18 & 1+8 = 9
        default: calc = calc;           //4*2= 8 &   8 = 8  -same for all lower numbers
      }
    iCCN = iCCN / 10;  // subtracts right most digit from ccNum
    iTotal += calc;  // running total of the card number as we loop
  }  // END OF LOOP
  if ((iTotal%10)==0){  // check to see if the sum Mod 10 is zero
    bResult = true;  // This IS (or could be) a valid credit card number.
  } else {
    bResult = false;  // This could NOT be a valid credit card number
    }
  }
}
  return bResult; // Return the results
}
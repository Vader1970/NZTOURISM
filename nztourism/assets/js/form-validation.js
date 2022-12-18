// This code is using the jQuery Validate plugin to perform form validation on an HTML form. The form has five input fields: departdate, returndate, passengers, from, and to.  //

//he validationConfig object specifies the validation rules and error messages for the form. The rules property specifies that all five input fields are required, and the messages property specifies the error messages that should be displayed if any of the fields are left blank.
const validationConfig = {
  rules: {
    departdate: 'required',
    returndate: 'required',
    passengers: 'required',
    from: 'required',
    to: 'required',
  },

  // Validation error for which required input was missed
  messages: {
    departdate: 'Please select your start date',
    returndate: 'Please select your retun date',
    passengers: 'Please select number of passengers',
    from: 'Please select starting location',
    to: 'Please select destination',
  },
};

// The $().ready function waits for the page to load, and then registers a click event handler for the submitBtn element. When the submitBtn element is clicked, the event handler function calls the validate method of the myForm element, passing in the validationConfig object as an argument.
$().ready(function () {
  $('#submitBtn').click(function () {
    const isValid = $('#myForm').validate(validationConfig);
    // If the form is invalid (i.e., any of the required fields are left blank), the validate method returns an object with a form property set to false, and the error messages are displayed on the page.
    if (!isValid.form()) {
      // If the form is valid (i.e., all required fields are filled out), the validate method returns an object with a form property set to true, and the calcRoute function is called.
    } else {
      calcRoute();
    }
  });
});

// Form Validation  //

//Validation rules for required input
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

// Function to show validation errors; or if none run parent function calcRoute
$().ready(function () {
  $('#submitBtn').click(function () {
    const isValid = $('#myForm').validate(validationConfig);
    if (!isValid.form()) {
    } else {
      calcRoute();
    }
  });
});

// Form Validation  //

const validationConfig = {
  rules: {
    departdate: "required",
    returndate: "required",
    passengers: "required",
    from: "required",
    to: "required",
  },

  messages: {
    departdate: "Please select your start date",
    returndate: "Please select your retun date",
    passengers: "Please select number of passengers",
    from: "Please select starting location",
    to: "Please select destination",
  },
};

$().ready(function () {
  $("#submitBtn").click(function () {
    const isValid = $("#myForm").validate(validationConfig);
    if (!isValid.form()) {
    } else {
      calcRoute();
    }
  });
});

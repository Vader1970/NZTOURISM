/// Date Range Picker Function (jQuery plugin) to select Depart: startDate and Return: endDate from a drop-down calendar //

//Depart date
$(document).ready(function () {
  let minDate = new Date();
  $("#startDate").datepicker({
    showAnim: "drop",
    numberOfMonth: 1,
    minDate: minDate,
    dateFormat: "dd/mm/yy",
    onClose: function (selectedDate) {
      $("#endDate").datepicker("option", "minDate", selectedDate);
    },
  });
  //Return Date
  $("#endDate").datepicker({
    showAnim: "drop",
    numberOfMonth: 1,
    minDate: minDate,
    dateFormat: "dd/mm/yy",
    onClose: function (selectedDate) {
      $("#startDate").datepicker("option", "maxDate", selectedDate);
    },
  });
});

// Fuction to get values from itinery input fields and display the results of Transport options //
function getValShowResult() {
  // Get values from the form
  const departDate = $("#startDate").val();
  const returnDate = $("#endDate").val();
  const passengerNumber = $("#passengers").val();
  //Standardize time and and format for NZ
  const departDateTime = new Date(convertDateTime(departDate, "10:00"));
  const returnDateTime = new Date(convertDateTime(returnDate, "10:00"));

  //Calculate rental period from those dates
  let durationTime = (returnDateTime - departDateTime) / (1000 * 60 * 60 * 24);
  durationTime = Math.ceil(durationTime);

  //Distance
  let drivingDistance = document.getElementById("distanceText").innerHTML;
  drivingDistance = parseInt(drivingDistance.replace(" km", ""));
  //Call results
  showResultContainer(passengerNumber, durationTime, drivingDistance);
}

// Convert date from date picker to YYYY/MM/DD  //
function convertDateTime(date, time) {
  const dateArr = date.split("/");
  const day = dateArr[0];
  const month = dateArr[1];
  const year = dateArr[2];
  return year + "/" + month + "/" + day + " " + time;
}

// Transport options within an array //
const transport = [
  {
    id: 0,
    Vehicle: "Motorbike",
    MinPassengers: 1,
    MaxPassengers: 1,
    PricePerDay: 109,
    MinRentalPeriod: 1,
    MaxRentalPeriod: 5,
    Fuel: 3.7,
    Image: "./assets/images/bikesm.jpg",
  },
  {
    id: 1,
    Vehicle: "Small car",
    MinPassengers: 1,
    MaxPassengers: 2,
    PricePerDay: 129,
    MinRentalPeriod: 1,
    MaxRentalPeriod: 10,
    Fuel: 8.5,
    Image: "./assets/images/mustangsm.jpg",
  },
  {
    id: 2,
    Vehicle: "Large car",
    MinPassengers: 1,
    MaxPassengers: 5,
    PricePerDay: 144,
    MinRentalPeriod: 3,
    MaxRentalPeriod: 10,
    Fuel: 9.7,
    Image: "./assets/images/large_carsm.jpg",
  },
  {
    id: 3,
    Vehicle: "Motor home",
    MinPassengers: 2,
    MaxPassengers: 6,
    PricePerDay: 200,
    MinRentalPeriod: 2,
    MaxRentalPeriod: 15,
    Fuel: 17,
    Image: "./assets/images/motorhomesm.jpg",
  },
];

// Loop through Transport object (inside of an array) defined by user input and create elements (div) so to print in html about transport specifications i.e capacity, fuel consumption and etc
const results = document.querySelector("#ResultContainer");
for (let index of Object.keys(transport)) {
  const option = transport[index];
  const optionContainer = document.createElement("div");
  const vehicle = `<strong>${option.Vehicle}</strong>`;
  const capacity = `Capacity: ${option.MinPassengers}-${option.MaxPassengers} people`;
  const period = `min ${option.MinRentalPeriod} days / max ${option.MaxRentalPeriod} days`;
  const price = `$${option.PricePerDay} / day`;
  const fuel = `Fuel: ${option.Fuel}L / 100km`;
  const imagePath = option.Image;

  //Add image and append to optionContainer element
  let inner = "";
  const image = document.createElement("img");
  image.setAttribute("src", imagePath);
  image.setAttribute("alt", option.Vehicle);
  optionContainer.appendChild(image);
  //Add info
  const infoArr = [vehicle, capacity, period, price, fuel];
  infoArr.forEach((arrayItem) => {
    inner += arrayItem + "<br>";
  });
  const info = document.createElement("p");
  info.innerHTML = inner;
  optionContainer.appendChild(info);
  //Add id
  optionContainer.setAttribute("id", `transport${option.id}`);
  //Add cost info
  const totalPrice = document.createElement("p");
  totalPrice.setAttribute("id", "TotalPrice");
  const totalFuel = document.createElement("p");
  totalFuel.setAttribute("id", "TotalFuel");
  const totalCost = document.createElement("p");
  totalCost.setAttribute("id", "Total");
  optionContainer.appendChild(totalPrice);
  optionContainer.appendChild(totalFuel);
  optionContainer.appendChild(totalCost);
  //Append child optionContainer to results
  results.appendChild(optionContainer);
}

// Function to display results (passengers, duration & distance) //
function showResultContainer(passengers, duration, distance) {
  //filter through results
  for (let index of Object.keys(transport)) {
    const option = transport[index];
    const minPassengers = option.MinPassengers;
    const maxPassengers = option.MaxPassengers;
    const price = option.PricePerDay;
    const minPeriod = option.MinRentalPeriod;
    const maxPeriod = option.MaxRentalPeriod;
    const fuel = option.Fuel;
    //Return values (boolean OR operator) display results
    if (
      passengers < minPassengers ||
      passengers > maxPassengers ||
      duration < minPeriod ||
      duration > maxPeriod
    ) {
      document.querySelector(`#transport${option.id}`).style.display = "none";
    } else {
      document
        .querySelector(`#transport${option.id}`)
        .style.removeProperty("display");
    }

    //Calculate & show total price & fuel consumption
    const totalPrice = price * duration;
    const totalFuel = Math.round((fuel * distance) / 100);
    const totalFuelCost = Math.round(2.8 * totalFuel);
    const total = totalPrice + totalFuelCost;
    document
      .querySelector(`#transport${option.id}`)
      .querySelector(
        "#TotalPrice"
      ).textContent = `Price (${duration} days): $${totalPrice}`;
    document
      .querySelector(`#transport${option.id}`)
      .querySelector(
        "#TotalFuel"
      ).textContent = `Fuel: $${totalFuelCost} approx. (${totalFuel}L)`;
    document
      .querySelector(`#transport${option.id}`)
      .querySelector("#Total").textContent = `Total cost: $${total} approx.`;
  }
  $(".results").show();
  $(".form-control").change(function () {
    getValShowResult();
    setTimeout(() => {
      calcRoute();
    }, 1000);
  });
}

//  Google Maps API //
//API Extensions//
//Directions API
//Maps JavaScript API
//Distance Matrix API
//Places API

// create map
let map;

// create directions service object
let directionsService;

// create renderer used to display services
let directionsDisplay;

// create autocomplete objects for Origin and Destination inputs specifically for NZ cities
let options = {
  componentRestrictions: { country: "NZ" },
  types: ["(cities)"],
};
let input1 = document.getElementById("from");
let autocomplete1;
let input2 = document.getElementById("to");
let autocomplete2;

// Create a function to initialise a new map with map options and set a starting marker on the map
function initMap() {
  // New map
  map = new google.maps.Map(document.getElementById("googleMap"), {
    // Map lattitude and longitude for New Zealand
    zoom: 5.2,
    center: { lat: -41.2924, lng: 174.7787 },
    mapTypeid: google.maps.MapTypeId.ROADMAP,
  });

  // Set the google maps directions service and display
  directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer();

  // Add autocomplete functions to the location input boxes
  autocomplete1 = new google.maps.places.Autocomplete(input1, options);
  autocomplete2 = new google.maps.places.Autocomplete(input2, options);
}
// Wait for page to load and once ready initialise google maps
$(document).ready(function () {
  initMap(map);
  // Set Map
  directionsDisplay.setMap(map);
});
// function to calc distance
function calcRoute() {
  // Create request
  let request = {
    origin: document.getElementById("from").value,
    destination: document.getElementById("to").value,
    travelMode: google.maps.TravelMode.DRIVING,
    unitSystem: google.maps.UnitSystem.METRIC,
  };
  // Pass request to route method
  directionsService.route(request, (result, status) => {
    if (status == google.maps.DirectionsStatus.OK) {
      // Get distance and time values and print to html
      let distance =
        '<span id="distanceText">' +
        result.routes[0].legs[0].distance.text +
        "</span>";
      let duration = result.routes[0].legs[0].duration.text;
      let fromVal = document.getElementById("from").value;
      let toVal = document.getElementById("to").value;
      let outputContent =
        "<div class='travel-distance-results'> From: " +
        fromVal +
        ".<br/> To: " +
        toVal;
      outputContent +=
        ". <br/> Driving distance: " +
        distance +
        ".<br />Duration: " +
        duration +
        ". </div>";
      document.querySelector("#output").innerHTML = outputContent;
      // Display quickest route on map
      directionsDisplay.setDirections(result);
      getValShowResult();
    } else {
      // Delete route from map
      directionsDisplay.setDirections({ routes: [] });
      // Center map back to New Zealand
      map.setCenter({ lat: -36.8509, lng: 174.7645 });
      // Show error message if data is not received
      output.innerHTML =
        "<div class='alert-danger'>Could not retrieve driving distance.</div>";
    }
  });
}

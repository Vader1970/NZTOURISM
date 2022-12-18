//Informs JSHint that the code uses ECMAScript 6 (ES6) syntax
/*jshint esversion: 6 */

/// This code uses the datepicker function from the jQuery UI library to create two drop-down calendars for selecting a departure date and a return date.

//The #startDate calendar is set to display a single month and the #endDate calendar is also set to display a single month. The minimum date that can be selected in both calendars is the current date, as determined by the minDate option. The calendars are also set to display the selected dates in the format 'dd/mm/yy' using the dateFormat option.
$(document).ready(function () {
  let minDate = new Date();
  $('#startDate').datepicker({
    showAnim: 'drop',
    numberOfMonth: 1,
    minDate: minDate,
    dateFormat: 'dd/mm/yy',
    onClose: function (selectedDate) {
      $('#endDate').datepicker('option', 'minDate', selectedDate);
    },
  });

  //The onClose function is called whenever the user closes the calendar after selecting a date. For the #startDate calendar, the onClose function sets the minimum date that can be selected in the #endDate calendar to the selected departure date. This ensures that the return date cannot be set to a date earlier than the departure date. Similarly, for the #endDate calendar, the onClose function sets the maximum date that can be selected in the #startDate calendar to the selected return date. This ensures that the departure date cannot be set to a date later than the return date.
  $('#endDate').datepicker({
    showAnim: 'drop',
    numberOfMonth: 1,
    minDate: minDate,
    dateFormat: 'dd/mm/yy',
    onClose: function (selectedDate) {
      $('#startDate').datepicker('option', 'maxDate', selectedDate);
    },
  });
});

//This function is calculating the duration of a rental period based on start date and an end date, and using that duration along with the number of passengers and the distance to call a showResultContainer function.
function getValShowResult() {
  // The values of the departDate, returnDate, and passengerNumber form fields are being retrieved using document.getElementById() and stored in variables.
  const departDate = document.getElementById('startDate').value;
  const returnDate = document.getElementById('endDate').value;
  const passengerNumber = document.getElementById('passengers').value;

  //The departDateTime and returnDateTime variables are being set to new Date objects that are created using the convertDateTime() function and passed the departDate and returnDate variables as arguments, along with the string '10:00' to set the time to 10:00 AM.
  const departDateTime = new Date(convertDateTime(departDate, '10:00'));
  const returnDateTime = new Date(convertDateTime(returnDate, '10:00'));

  //The duration of the rental period is being calculated by taking the difference between the returnDateTime and departDateTime in milliseconds, dividing by the number of milliseconds in a day, and then using Math.ceil() to round up to the nearest whole number. This duration is stored in the durationTime variable.
  let durationTime = (returnDateTime - departDateTime) / (1000 * 60 * 60 * 24);
  durationTime = Math.ceil(durationTime);

  //The driving distance is being retrieved from an element with the id distanceText and stored in the drivingDistance variable. This value is then converted to an integer and stored in the distance variable.
  const drivingDistance = document.getElementById('distanceText').innerHTML;
  const distance = parseInt(drivingDistance);

  //The showResultContainer() function is being called and passed the passengerNumber, durationTime, and distance variables as arguments.
  showResultContainer(passengerNumber, durationTime, distance);
}

// This function takes in two strings as arguments: date and time. It splits the date string into an array of three strings using the / character as the delimiter. It then destructures the array into three variables: day, month, and year. Finally, it returns a new string that combines the year, month, day, and time variables in the format "YYYY/MM/DD HH:MM".
function convertDateTime(date, time) {
  const [day, month, year] = date.split('/');
  return `${year}/${month}/${day} ${time}`;
}

// An array of objects that represent different types of vehicles that are available for rental. Each object has several properties, such as Vehicle, MinPassengers, MaxPassengers, PricePerDay, MinRentalPeriod, MaxRentalPeriod, Fuel, and Image, that describe the specifications of each type of vehicle.
const transport = [
  {
    id: 0,
    Vehicle: 'Motorbike',
    MinPassengers: 1,
    MaxPassengers: 1,
    PricePerDay: 109,
    MinRentalPeriod: 1,
    MaxRentalPeriod: 5,
    Fuel: 3.7,
    Image: './assets/images/bikesm.jpg',
  },

  {
    id: 1,
    Vehicle: 'Small Car',
    MinPassengers: 1,
    MaxPassengers: 2,
    PricePerDay: 129,
    MinRentalPeriod: 1,
    MaxRentalPeriod: 10,
    Fuel: 8.5,
    Image: './assets/images/mustangsm.jpg',
  },

  {
    id: 2,
    Vehicle: 'Large Car',
    MinPassengers: 1,
    MaxPassengers: 5,
    PricePerDay: 144,
    MinRentalPeriod: 3,
    MaxRentalPeriod: 10,
    Fuel: 9.7,
    Image: './assets/images/large_carsm.jpg',
  },

  {
    id: 3,
    Vehicle: 'Motorhome',
    MinPassengers: 2,
    MaxPassengers: 6,
    PricePerDay: 200,
    MinRentalPeriod: 2,
    MaxRentalPeriod: 15,
    Fuel: 17,
    Image: './assets/images/motorhomesm.jpg',
  },
];

// The selector #ResultContainer specifies that the element with the ID ResultContainer should be retrieved.
// The element that is retrieved is stored in the results constant. This constant can then be used to access and manipulate the element in the rest of the code.
const results = document.querySelector('#ResultContainer');

//This code is creating a series of div elements in the HTML DOM based on the keys of object transport. For each key, it creates a new div element called optionContainer and then calls a function called createTransportOption to add elements to this optionContainer based on the current transport option.The createTransportOption function takes the current transport option and the optionContainer element as arguments. It first creates a series of HTML elements representing different aspects of the transport option (e.g. vehicle, capacity, period, etc.), and then it creates an img element called vehicleImage and sets its src and alt attributes based on the option. It then appends the vehicleImage to the optionContainer element.
function createTransportOption(option, optionContainer) {
  const vehicle = `<strong>${option.Vehicle}</strong>`;
  const capacity = `<strong>Capacity:</strong> ${option.MinPassengers}-${option.MaxPassengers} people`;
  const period = `<strong>Rental Period:</strong> min ${option.MinRentalPeriod} / max ${option.MaxRentalPeriod} days`;
  const price = `<strong>Rental Hire:</strong> ${option.PricePerDay} / day`;
  const fuel = `<strong>Fuel Economy:</strong> ${option.Fuel}L / 100km`;
  const imagePath = option.Image;
  const vehicleImage = document.createElement('img');

  vehicleImage.setAttribute('src', imagePath);
  vehicleImage.setAttribute('alt', option.Vehicle);
  optionContainer.appendChild(vehicleImage);

  //This code is defining a variable called transportSpecs and assigning it an empty string. Then it defines an array called infoArr that contains five elements: vehicle, capacity, period, price, and fuel.
  let transportSpecs = ' ';

  const infoArr = [vehicle, capacity, period, price, fuel];

  // Next, the code uses the forEach() method to iterate over the elements in the infoArr array. For each element in the array, it concatenates the element to the transportSpecs string, separated by a line break. Note that the forEach() method does not return a value, so the transportSpecs variable will be modified directly within the function.
  infoArr.forEach(arrayItem => {
    transportSpecs += arrayItem + '<br>';
  });

  //Creates an HTML p element to hold the transport specifications and sets its innerHTML to the concatenation of the different transport specification elements. It then appends this p element to the optionContainer. Finally, it creates three more p elements with id attributes of TotalPrice, TotalFuel, and Total, and appends them to the optionContainer as well.
  const info = document.createElement('p');
  info.innerHTML = transportSpecs;
  optionContainer.appendChild(info);

  const totalPrice = document.createElement('p');
  totalPrice.setAttribute('id', 'TotalPrice');

  const totalFuel = document.createElement('p');
  totalFuel.setAttribute('id', 'TotalFuel');

  const totalCost = document.createElement('p');

  totalCost.setAttribute('id', 'Total');
  optionContainer.appendChild(totalPrice);
  optionContainer.appendChild(totalFuel);
  optionContainer.appendChild(totalCost);
}

// The code then loops through the keys of the transport object using for (let index of Object.keys(transport)), and for each key it creates a new div element called optionContainer, sets its id attribute to transport${option.id}, and calls the createTransportOption function to add elements to it.
for (let index of Object.keys(transport)) {
  const option = transport[index];
  const optionContainer = document.createElement('div');
  optionContainer.setAttribute('id', `transport${option.id}`);

  createTransportOption(option, optionContainer);

  //Finally, it appends the optionContainer to the #ResultContainer element in the HTML DOM.
  results.appendChild(optionContainer);
}

// This function displays the results of transportation cost calculation based on several input parameters:
// -passengers: the number of passengers.
// -duration: the length of time for which the transportation will be used.
// -distance: the distance the transportation will be used for.
// The function first loops through the transport object and retrieves several values for each option:
// -minPassengers: the minimum number of passengers allowed for this option.
// -maxPassengers: the maximum number of passengers allowed for this option.
// -price: the price per day for this option.
// -minPeriod: the minimum rental period for this option.
// -maxPeriod: the maximum rental period for this option.
// -fuel: the fuel consumption rate for this option.
function showResultContainer(passengers, duration, distance) {
  //Loops through the keys of the transport object and assigns the corresponding value to the option variable.
  for (let index of Object.keys(transport)) {
    const option = transport[index];
    // Object called optionValues that contains several properties extracted from the option object.
    const optionValues = {
      minPassengers: option.MinPassengers,
      maxPassengers: option.MaxPassengers,
      price: option.PricePerDay,
      minPeriod: option.MinRentalPeriod,
      maxPeriod: option.MaxRentalPeriod,
      fuel: option.Fuel,
    };

    // It then filters out any options that do not meet the criteria for the input passengers, duration, and distance, by setting the display style of the corresponding element to 'none' if the criteria are not met.
    const shouldHide =
      passengers < optionValues.minPassengers ||
      passengers > optionValues.maxPassengers ||
      duration < optionValues.minPeriod ||
      duration > optionValues.maxPeriod;
    if (shouldHide) {
      document.querySelector(`#transport${option.id}`).style.display = 'none';
    } else {
      document.querySelector(`#transport${option.id}`).style.display = 'block';
    }

    // The function then calculates the total price, fuel consumption, and total cost for each option that has not been filtered out. It does this by multiplying the price by the duration to get the total price, and using the fuel and distance to calculate the total fuel consumption and cost.
    const totalPrice = optionValues.price * duration;
    const totalFuel = Math.round((optionValues.fuel * distance) / 100);
    const totalFuelCost = Math.round(2.68 * totalFuel);
    const total = totalPrice + totalFuelCost;

    // Finally, it updates the text content of several elements to display the results.
    document.querySelector(
      `#transport${option.id} #TotalPrice`
    ).textContent = `Price (${duration} days): $${totalPrice}`;
    document.querySelector(
      `#transport${option.id} #TotalFuel`
    ).textContent = `Fuel: $${totalFuelCost} approx. (${totalFuel}L)`;
    document.querySelector(
      `#transport${option.id} #Total`
    ).textContent = `Total Cost: $${total} approx.`;
  }

  $('.results').show();
  $('.form-control').change(function () {
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

// This code is for Google Maps API that allows a user to enter a starting location and a destination, and then displays the route on a map, as well as the driving distance and duration between the two points.
// The code starts by declaring three variables: map, directionsService, and directionsDisplay. These variables will be used to store the Google Maps map object, the Google Maps Directions Service object, and the Google Maps Directions Renderer object, respectively.
let map;
let directionsService;
let directionsDisplay;

// Next, the code defines the options object, which will be used to restrict the origin and destination inputs to New Zealand cities and provide autocomplete suggestions for the user as they type in the origin and destination fields.
const options = {
  componentRestrictions: { country: 'NZ' },
  types: ['(cities)'],
};

// Autocomplete feature, which will be used to provide autocomplete suggestions for the user as they type in the origin and destination fields
const originInput = document.getElementById('from');
let originAutoComplete;

const destinationInput = document.getElementById('to');
let destinationAutoComplete;

// The code then gets references to the originInput and destinationInput elements on the page, which are the input fields for the origin and destination locations. It also declares originAutoComplete and destinationAutoComplete variables, which will be used to store the Autocomplete objects for the origin and destination inputs, respectively.
originAutoComplete = new google.maps.places.Autocomplete(originInput, options);
destinationAutoComplete = new google.maps.places.Autocomplete(
  destinationInput,
  options
);

// The initMap function is then defined, which initializes the map by creating a new Google Maps map object and rendering it to the googleMap element on the page. It also creates new Google Maps Directions Service and Directions Renderer objects, and initializes the Autocomplete objects for the origin and destination inputs using the options defined earlier.
function initMap() {
  map = new google.maps.Map(document.getElementById('googleMap'), {
    // Map latitude and longitude for New Zealand and type ROADMAP
    zoom: 5.2,
    center: { lat: -41.2924, lng: 174.7787 },
    mapTypeId: google.maps.MapTypeId.ROADMAP,
  });

  directionsService = new google.maps.DirectionsService();

  directionsDisplay = new google.maps.DirectionsRenderer();
}

// The $(document).ready function waits for the page to load, and then calls the initMap function.
$(document).ready(function () {
  initMap();

  // directionsDisplay.setMap(map) is a method of the Google Maps Directions Renderer object that is used to bind the Directions Renderer to the map. This means that the directions will be displayed on the map when they are returned from the Directions Service.
  directionsDisplay.setMap(map);
});

// The calcRoute function is called when the user clicks 'Search Transport'. The function is used to calculate and display the route between the origin and destination locations on the map, as well as the driving distance and duration between the two points.
function calcRoute() {
  // Creates a new request object for the Google Maps Directions Service, which includes the origin and destination locations as well as the travel mode and unit system.
  const routeRequest = {
    origin: document.getElementById('from').value,
    destination: document.getElementById('to').value,
    travelMode: google.maps.TravelMode.DRIVING,
    unitSystem: google.maps.UnitSystem.METRIC,
  };

  // Calls the route method of the Directions Service, passing in the request object and a callback function that will be executed when the directions are returned. The callback function has two arguments, result and status, which contain the result of the request (including the calculated route) and the status of the request, respectively.
  directionsService.route(routeRequest, (result, status) => {
    // If the directions are returned successfully (i.e., the status is google.maps.DirectionsStatus.OK), the callback function updates the page to display the driving distance and duration, and renders the route on the map using the Directions Renderer. The driving distance and duration are calculated by accessing the distance.text and duration.text properties of the result.routes[0].legs[0] object, respectively. The function also gets the values of the originInput and destinationInput elements and displays them on the page.
    if (status === google.maps.DirectionsStatus.OK) {
      let distance =
        '<span id="distanceText">' +
        result.routes[0].legs[0].distance.text +
        '</span>';
      let duration = result.routes[0].legs[0].duration.text;
      let fromVal = document.getElementById('from').value;
      let toVal = document.getElementById('to').value;
      let outputContent =
        "<div class='travel-distance-results'> <strong>From:</strong> " +
        fromVal +
        '.<br/> <strong>To:</strong> ' +
        toVal;
      outputContent +=
        '. <br/> <strong>Driving distance:</strong> ' +
        distance +
        '.<br /><strong>Duration:</strong> ' +
        duration +
        '. </div>';

      document.querySelector('#output').innerHTML = outputContent;

      // Display the obtained route
      directionsDisplay.setDirections(result);
      getValShowResult();

      //If there is an error retrieving the directions, the function displays an error message and removes the route from the map.
    } else {
      // Remove route from map
      directionsDisplay.setDirections({ routes: [] });

      // Center map back to current position
      map.setCenter({ lat: -36.8509, lng: 174.7645 });

      // Show error message in case there is any
      output.innerHTML =
        "<div class='alert-danger'>Could not retrieve driving distance.</div>";
    }
  });
}

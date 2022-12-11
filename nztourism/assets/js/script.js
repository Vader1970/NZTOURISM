/// Date Range Picker Function (jQuery plugin) to select Depart: '#startDate' and Return: '#endDate' from a drop-down calendar //

//Depart date
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

  //Return Date
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

// Get values from itinery input fields
function getValShowResult() {
  // Get values from the itinery form startDate, endDate and number of passengers
  const departDate = $('#startDate').val();
  const returnDate = $('#endDate').val();
  const passengerNumber = $('#passengers').val();

  //Standardize time and format for NZ
  const departDateTime = new Date(convertDateTime(departDate, '10:00'));
  const returnDateTime = new Date(convertDateTime(returnDate, '10:00'));

  //Calculate rental period from dates selected
  let durationTime = (returnDateTime - departDateTime) / (1000 * 60 * 60 * 24);
  durationTime = Math.ceil(durationTime);

  //Get value for distance from element 'distanceText'. Calculation done by Distance Matrix API.
  let drivingDistance = document.getElementById('distanceText').innerHTML;
  // Change to integer
  drivingDistance = parseInt(drivingDistance.replace(' km', ''));
  //Call results
  showResultContainer(passengerNumber, durationTime, drivingDistance);
}

// Convert date from date picker to YYYY/MM/DD  //
function convertDateTime(date, time) {
  const dateArr = date.split('/');
  const day = dateArr[0];
  const month = dateArr[1];
  const year = dateArr[2];
  return year + '/' + month + '/' + day + ' ' + time;
}

// Transport options within an array //
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

// Create element div.ResultContainer and add elements from transport object keys
const results = document.querySelector('#ResultContainer');
for (let index of Object.keys(transport)) {
  const option = transport[index];
  const optionContainer = document.createElement('div');
  const vehicle = `<strong>${option.Vehicle}</strong>`;
  const capacity = `<strong>Capacity:</strong> ${option.MinPassengers}-${option.MaxPassengers} people`;
  const period = `<strong>Rental Period:</strong> min ${option.MinRentalPeriod} / max ${option.MaxRentalPeriod} days`;
  const price = `<strong>Rental Hire:</strong> ${option.PricePerDay} / day`;
  const fuel = `<strong>Fuel Economy:</strong> ${option.Fuel}L / 100km`;
  const imagePath = option.Image;

  //Add image and append to optionContainer element
  let inner = '';
  const image = document.createElement('img');
  image.setAttribute('src', imagePath);
  image.setAttribute('alt', option.Vehicle);
  optionContainer.appendChild(image);

  //Add info
  const infoArr = [vehicle, capacity, period, price, fuel];
  infoArr.forEach(arrayItem => {
    inner += arrayItem + '<br>';
  });

  //Create element for info
  const info = document.createElement('p');
  info.innerHTML = inner;
  optionContainer.appendChild(info);

  //Add id
  optionContainer.setAttribute('id', `transport${option.id}`);

  //Add cost info
  const totalPrice = document.createElement('p');
  totalPrice.setAttribute('id', 'TotalPrice');
  const totalFuel = document.createElement('p');
  totalFuel.setAttribute('id', 'TotalFuel');
  const totalCost = document.createElement('p');
  totalCost.setAttribute('id', 'Total');
  optionContainer.appendChild(totalPrice);
  optionContainer.appendChild(totalFuel);
  optionContainer.appendChild(totalCost);

  //Append child optionContainer to results
  results.appendChild(optionContainer);
}

// Function to display results//
function showResultContainer(passengers, duration, distance) {
  //Defacture and assign transport object keys to constant variables
  for (let index of Object.keys(transport)) {
    const option = transport[index];
    const minPassengers = option.MinPassengers;
    const maxPassengers = option.MaxPassengers;
    const price = option.PricePerDay;
    const minPeriod = option.MinRentalPeriod;
    const maxPeriod = option.MaxRentalPeriod;
    const fuel = option.Fuel;

    //Filter through conditions and if conditions are true show results
    if (
      passengers < minPassengers ||
      passengers > maxPassengers ||
      duration < minPeriod ||
      duration > maxPeriod
    ) {
      document.querySelector(`#transport${option.id}`).style.display = 'none';
    } else {
      document
        .querySelector(`#transport${option.id}`)
        .style.removeProperty('display');
    }

    //Calculate & show total price & fuel consumption
    const totalPrice = price * duration;
    const totalFuel = Math.round((fuel * distance) / 100);
    const totalFuelCost = Math.round(2.68 * totalFuel);
    const total = totalPrice + totalFuelCost;
    document
      .querySelector(`#transport${option.id}`)
      .querySelector(
        '#TotalPrice'
      ).textContent = `Price (${duration} days): $${totalPrice}`;
    document
      .querySelector(`#transport${option.id}`)
      .querySelector(
        '#TotalFuel'
      ).textContent = `Fuel: $${totalFuelCost} approx. (${totalFuel}L)`;
    document
      .querySelector(`#transport${option.id}`)
      .querySelector('#Total').textContent = `Total Cost: $${total} approx.`;
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

// Create variable for map
let map;

// Create directionsService variable
let directionsService;

// Create directionsrenderer variable
let directionsDisplay;

// Create autocomplete features for Origin and Destination inputs specifically for NZ cities
let options = {
  componentRestrictions: { country: 'NZ' },
  types: ['(cities)'],
};

// Create input1 variable to store 'from' value for autocomplete1
let input1 = document.getElementById('from');
let autocomplete1;

// Create input2 variable to store 'to' value for autocomplete2
let input2 = document.getElementById('to');
let autocomplete2;

// Create a function to initialise map
function initMap() {
  // Create a map
  map = new google.maps.Map(document.getElementById('googleMap'), {
    // Map lattitude and longitude for New Zealand and type ROADMAP
    zoom: 5.2,
    center: { lat: -41.2924, lng: 174.7787 },
    mapTypeid: google.maps.MapTypeId.ROADMAP,
  });

  // Call Direction service object form Google Map API
  directionsService = new google.maps.DirectionsService();

  //Render the direction object
  directionsDisplay = new google.maps.DirectionsRenderer();

  // Add autocomplete functions to the 'from' and 'to' input boxes
  autocomplete1 = new google.maps.places.Autocomplete(input1, options);
  autocomplete2 = new google.maps.places.Autocomplete(input2, options);
}

// Wait for page to load and once ready initialise google maps
$(document).ready(function () {
  initMap();

  // Display the directions on the map by binding the directions service to the map service
  directionsDisplay.setMap(map);
});

// Function to calc route
function calcRoute() {
  // Create  a new request
  let request = {
    origin: document.getElementById('from').value,
    destination: document.getElementById('to').value,
    travelMode: google.maps.TravelMode.DRIVING,
    unitSystem: google.maps.UnitSystem.METRIC,
  };

  // Pass created request to route method
  directionsService.route(request, (result, status) => {
    if (status == google.maps.DirectionsStatus.OK) {
      // Get distance and time values and display on map
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
    } else {
      // Delete route from map
      directionsDisplay.setDirections({ routes: [] });

      // Center map back to current position
      map.setCenter({ lat: -36.8509, lng: 174.7645 });

      // Show error message in case there is any
      output.innerHTML =
        "<div class='alert-danger'>Could not retrieve driving distance.</div>";
    }
  });
}

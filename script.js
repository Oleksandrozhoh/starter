'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

// get users geo location
navigator.geolocation.getCurrentPosition(
  function (position) {
    console.log(
      `Latitude: ${position.coords.latitude}, Longitude: ${position.coords.longitude}`
    );
    const { latitude } = position.coords;
    const { longitude } = position.coords;

    // leaflet library code
    const coords = [latitude, longitude];

    //map(id of the element to insert the map into)
    //setView(coordinates array and zoom)
    const map = L.map('map').setView(coords, 13);

    // style of the map
    L.tileLayer('https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    L.marker(coords)
      .addTo(map)
      .bindPopup('A pretty CSS popup.<br> Easily customizable.')
      .openPopup();
  },
  function () {
    alert('Could not get your location');
  }
);

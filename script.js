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
    const url = `https://www.google.pt/maps/@${latitude},${longitude}`;
    console.log(url);
  },
  function () {
    alert('Could not get your location');
  }
);

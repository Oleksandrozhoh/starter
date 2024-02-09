'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

class Workout {
  date = new Date();
  id = Math.trunc(Math.random() * 100000000000);

  constructor(coords, distance, duration) {
    this.coords = coords;
    this.distance = distance;
    this.duration = duration;
  }
}

class Running extends Workout {
  type = 'running';
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.pace = this.calcPace();
  }
  calcPace() {
    // min/km
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}
class Cycling extends Workout {
  type = 'cycling';
  constructor(coords, distance, duration, elevation) {
    super(coords, distance, duration);
    this.elevation = elevation;
    this.speed = this.calcSpeed();
  }
  calcSpeed() {
    // km/h
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

const run = new Running([39, -12], 5.2, 23, 178);
const cycling = new Running([39, -12], 27, 40, 523);
console.log(run);
console.log(cycling);

/////////////////////////////////////////////////
// APLICATION ARCHITECTURE

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class App {
  workouts = [];
  #map;
  #mapEvent;

  constructor() {
    this._getPosition();
    form.addEventListener('submit', this._newWorkout.bind(this));

    inputType.addEventListener('change', this._toggleElevationField.bind(this));
  }

  _getPosition() {
    // get users geo location
    navigator.geolocation.getCurrentPosition(
      this._loadMap.bind(this),
      function () {
        alert('Could not get your location');
      }
    );
  }

  _loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;

    // leaflet library code
    const coords = [latitude, longitude];

    //map(id of the element to insert the map into)
    //setView(coordinates array and zoom)
    this.#map = L.map('map').setView(coords, 13);

    // style of the map
    L.tileLayer('https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    // handling map clicks
    this.#map.on('click', this._showForm.bind(this));
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  _toggleElevationField() {
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _newWorkout(e) {
    const validInput = function (value) {
      if (!Number.isFinite(value) || value < 0) {
        return true;
      }
      return false;
    };
    e.preventDefault();

    //Get data from the form
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const { lat, lng } = this.#mapEvent.latlng;
    let workout;

    // if acrivity is running => create runniung object
    if (type === 'running') {
      const cadence = +inputCadence.value;
      //Check the data
      if (validInput(distance)) {
        return alert('Distance input has to be a possitive number!');
      }
      if (validInput(duration)) {
        return alert('Duration input has to be a possitive number!');
      }
      if (validInput(cadence)) {
        return alert('Cadence input has to be a possitive number!');
      }

      workout = new Running([lat, lng], distance, duration, cadence);
    }

    // if activity is cycling => create new cycling object
    if (type === 'cycling') {
      const elevation = +inputElevation.value;
      //Check the data
      if (validInput(distance)) {
        return alert('Distance input has to be a possitive number!');
      }
      if (validInput(duration)) {
        return alert('Duration input has to be a possitive number!');
      }
      if (!Number.isFinite(elevation)) {
        return alert('Elevation input has to be a possitive number!');
      }
      workout = new Cycling([lat, lng], distance, duration, elevation);
    }

    // Add new object to workouts array
    this.workouts.push(workout);
    console.log(this.workouts);

    // render workout on the map
    this.renderWorkoutMarker(workout);

    // render workout on the workout list

    // add a popup on to the map

    inputCadence.value =
      inputDistance.value =
      inputDuration.value =
      inputElevation.value =
        '';
  }

  renderWorkoutMarker(workout) {
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(`${workout.distance}`)
      .openPopup();
  }
}

const app = new App();

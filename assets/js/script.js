// https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
// API Key = 96d6d065213dba04092397c03343aea2

// select elements 

const getInfoBtn = document.querySelector('.getInfo');
const city = document.getElementById('city');
const sectionDiv = document.querySelector('.section-div');
const weatherInputContainer = document.querySelector('.weather-input');
const form = document.querySelector('#form');
const sectionContainer = document.querySelector('.sectionContainer');

const API_KEY = '96d6d065213dba04092397c03343aea2';

let intervalId = 0;
let obj = {};
let errorCity = false;

getInfoBtn.disabled = true;

// Get Weather Info function

const getWeatherInfo = async (city) => {
    try {
        const data = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);
        const response = await data.json();

        // destructure response and build a new object with that response
        doDestructuring(response);

        // generateview method generate 2 containers which contains weather information 
        generateview(obj);

    } catch (error) {
        displayErrorMsg("Location is not found! Try Again ☹");
        errorCity = true;
        getInfoBtn.disabled = false;
    }
}

// when form submit display weather data

form.addEventListener('submit', async function (e) {
    e.preventDefault();
    sectionContainer.innerHTML = '';
    getInfoBtn.classList.add('box-btn');
    const cityName = city.value.trim().toLowerCase();

    if (cityName != "") {
        console.log("button is enabbled")
        if (localStorage.getItem(cityName)) {
            console.log("no need to call api display data from the localstorage")
            const displayLocalObject = JSON.parse(localStorage.getItem(cityName));

            // check local storage item time then display data
            checkTimeAndDisplayData(cityName, displayLocalObject);
        }
        else {
            await getWeatherInfo(cityName);
            if (!errorCity) {
                console.log(errorCity, cityName)
                console.log('2', obj);
                localStorage.setItem(cityName, JSON.stringify(obj));
            }
            errorCity = false;
        }
        // Clear out input field after fetch is complete
        city.value = "";
    }
    // else {
    //     // if the input field is empty make "Get Info" Button disable and skip making API call
    //     console.log("button is disabled")
    //     getInfoBtn.classList.remove('box-btn');
    //     // getInfoBtn.classList.add('not-allowed');
    //     getInfoBtn.disabled = true;
    // }
    // getInfoBtn.disabled = false;
    // getInfoBtn.classList.remove('disable');
});

// apply disable class to getInfo button

if (getInfoBtn.disabled === true) {
    getInfoBtn.classList.remove('box-btn');
    getInfoBtn.classList.add('not-allowed');
}

// when field is empty disable btn otherwise enabled that
city.addEventListener('keyup', function () {
    if (city.value.length > 0 && city.value.trim() !== '') {
        getInfoBtn.disabled = false;
        // getInfoBtn.classList.add('box-btn');
        getInfoBtn.classList.remove('not-allowed');
    } else {
        getInfoBtn.disabled = true;
        getInfoBtn.classList.remove('box-btn');
        getInfoBtn.classList.add('not-allowed');
    }
});

// when focus out on button remove box-btn class
getInfoBtn.addEventListener('focusout', function () {
    getInfoBtn.classList.remove('box-btn');
});

// generate weather icon based on the weatherDescription and weatherMain property. function returns src
function generateWeatherIcon(weatherDes, weatherMain) {
    if (weatherMain === 'Rain' || weatherDes === 'light rain' || weatherDes === 'moderate rain' || weatherDes === 'heavy intensity rain' || weatherDes === 'very heavy rain' || weatherDes === 'extreme rain') {
        return './assets/animated/rain.svg';

    } else if (weatherMain === 'Snow' || weatherDes === 'freezing rain') {
        return './assets/animated/snow.svg';

    } else if (weatherMain === 'Drizzle' || weatherDes === 'light intensity shower rain' || weatherDes === 'shower rain' || weatherDes === 'heavy intensity shower rain' || weatherDes === 'ragged shower rain') {
        return './assets/animated/shower_rain.svg';

    } else if (weatherMain === 'Clouds' || weatherDes === 'few clouds') {
        return './assets/animated/few_clouds.svg';

    } else if (weatherDes === 'scattered clouds' || weatherDes === 'broken clouds' || weatherDes === 'overcast clouds') {
        return './assets/animated/broken_clouds.svg';

    } else if (weatherMain === 'Clear') {
        return `./assets/animated/clear_sky.svg`;

    } else if (weatherMain === 'Thunderstorm') {
        return `./assets/animated/thunderstorm.svg`;

    } else if (weatherMain === 'Mist' || weatherMain === 'Smoke' || weatherMain === 'Haze' || weatherMain === 'Dust' || weatherMain === 'Fog' || weatherMain === 'Sand' || weatherMain === 'Ash' || weatherMain === 'Squall' || weatherMain === 'Tornado') {
        return `./assets/animated/mist.svg`;
    }
    else {
        return;
    }
}

// displayErrorMsg when something is wrong
function displayErrorMsg(msg) {
    sectionDiv.style.display = "none";
    const errorMsg = document.createElement('h2');
    errorMsg.innerHTML = msg;
    errorMsg.classList.add('error-msg');
    weatherInputContainer.append(errorMsg);
    setTimeout(() => {
        errorMsg.style.display = "none";
    }, 3000);
}

// realtime clock
function timeZone(timezone) {
    const timezoneInMinutes = timezone / 60;
    const currTime = moment().utcOffset(timezoneInMinutes).format("h:mm:ss A");
    const time = document.querySelector('.time');
    if (time) time.innerHTML = currTime;
}

// generateview method which returns src
function generateview(obj) {

    // display containers when user clicks the button
    sectionDiv.style.display = "block";

    // show clock time
    clearInterval(intervalId);
    intervalId = setInterval(() => timeZone(obj.timezone), 1000);

    // generate weather icon method based on the weatherDescription and weatherMain property. 
    const sectionChild = `<div class="current-weather-div">
            <div class="name-info">
              <h2 class="country-name">${obj.name}${obj.country ? "," + obj.country : ''}</h2>
            </div>
            <div class="current-weather-info">
              <div class="current-weather-imginfo">
              <img alt="current weather image" src=${generateWeatherIcon(obj.description, obj.weatherMain)} />
                <h2 class="overcast">${obj.weatherMain}</h2>
              </div>
              <div class="current-weather-degreeinfo">
                <h1 class="degree">${(obj.temp - 273.15).toFixed(2)}°C</h1>
              </div>
            </div>
            <div class="time-info">
              <h2>${getCurrentDate(obj.dt, obj.timezone)}</h2>
              <h2 class="time"></h2>
            </div>
          </div>
          
          <div class="more-info-div">
              <div class="more-info-heading">
                      <h2>More Info</h2>
                  </div>
              <div class="info-div">
                  <div class="single-info">
                      <p class="more-info-p">Pressure: ${obj.pressure}</p>
                      <i class="bi bi-arrows-collapse"></i>
                  </div>
                  <div class="single-info">
                      <p class="more-info-p">Visibility: ${obj.visibility}</p>
                      <i class="far fa-binoculars"></i>
                  </div>
                  <div class="single-info">
                      <p class="more-info-p">Wind Speed: ${obj.speed}</p>
                      <i class="far fa-wind"></i>
                  </div>
                  <div class="single-info">
                      <p class="more-info-p">Wind Degree: ${obj.deg}</p>
                      <i class="far fa-location-arrow"></i>
                  </div>
                  <div class="single-info">
                      <p class="more-info-p">Humidity: ${obj.humidity}</p>
                      <i class="far fa-tint"></i>
                  </div>
              </div>
          </div>`;

    sectionContainer.insertAdjacentHTML("afterbegin", sectionChild);
}

// getCurrentDate function to display current date of specific country
function getCurrentDate(dt, timezone) {
    const inputDate = new Date(dt * 1000 + (timezone * 1000)).toISOString().slice(0, 10); // 2020-06-14

    const date = new Date(inputDate);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);

    const formatedSplitDate = formattedDate.split(' '); //June 14, 2020

    const newDate = formatedSplitDate[1].replace(",", '');
    const month = formatedSplitDate[0];
    const year = formatedSplitDate[2];

    return newDate + " " + month + " " + year; //14 June 2020
}

// checkTimeAndDisplayData check time of local storage item if it is > 1 hour then remove from local storage and again make api and store in localstorage. It also remove item from local storage for invalid country
const checkTimeAndDisplayData = async (cityName, displayLocalObject) => {

    const now = Date.now();

    console.log(`calculate difference between now & local storage item time: ${now - displayLocalObject.time}`);

    if (now - displayLocalObject.time > 3600000) {
        console.log("Time is gone so remove item from the local storage and make api call again and set it into local storage")
        localStorage.removeItem(cityName)

        // fetch data again and set it in local storage

        console.log("Now API is called")
        await getWeatherInfo(cityName);

        localStorage.setItem(cityName, JSON.stringify(obj));
        if (errorCity) {
            localStorage.removeItem(cityName);
        }

    } else {
        console.log("get data from local storage and display data");
        console.log(`Local Storage Object : `, displayLocalObject)
        generateview(displayLocalObject);
    }

}

// Destructure response object and build a new object
const doDestructuring = (response) => {

    // Destructuring Response Object
    const { name, visibility, sys: { country }, weather, main: { temp, pressure, humidity }, wind: { speed, deg }, dt, timezone } = response;

    // main as weatherMain and destructure weather[0] again 
    const { main: weatherMain, description } = weather[0];

    const currentNowTime = Date.now();

    // create object and pass to generateView method
    obj = {
        name: name, visibility: visibility, country: country, weather: weather, temp: temp, pressure: pressure, humidity: humidity, speed: speed, deg: deg, dt: dt, timezone: timezone, weatherMain: weatherMain, description: description, time: currentNowTime,
    };
}
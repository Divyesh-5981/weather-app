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

let isButtonDisable = false;
let errorCity = false;

// Get Weather Info function

const getWeatherInfo = function (city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`)
        .then((data) => data.json()).then((response) => {

            // Destructuring Response Object
            const { name, visibility, sys: { country }, weather, main: { temp, pressure, humidity }, wind: { speed, deg }, dt, timezone } = response;

            // main as weatherMain and destructure weather[0] again 
            const { main: weatherMain, description } = weather[0];

            // create object and pass to generateView method
            const currentNowTime = Date.now();
             obj = {
                name: name, visibility: visibility, country: country, weather: weather, temp: temp, pressure: pressure, humidity: humidity, speed: speed, deg: deg, dt: dt, timezone: timezone, weatherMain: weatherMain, description: description, time:currentNowTime,
            }

            console.log(obj)

            // display containers when user clicks the button
            sectionDiv.style.display = "block";

            // generateview method generate 2 containers which contains weather information 
            generateview(obj);

            // show clock time
            clearInterval(intervalId);
            intervalId = setInterval(() => timeZone(obj.timezone), 1000);

        }).catch((err) => {
            // console.log(err)
            displayErrorMsg("Location is not found! Try Again ☹");
            errorCity = true;
        })
}

// when form submit display weather data

form.addEventListener('submit', function (e) {
    e.preventDefault();
    sectionContainer.innerHTML = '';
    getInfoBtn.classList.add('box-btn');
    const cityName = city.value.trim().toLowerCase();

        if (cityName != "") {
        console.log("button is enabbled")
            if(localStorage.getItem(cityName)){
                console.log("no need to call api display data from the localstorage")
                const displayLocalObject = JSON.parse(localStorage.getItem(cityName));

                // const dtTimeInMs = displayLocalObject.dt * 1000;
                // check if local storage object time is greater than 1 or not

                const now = Date.now();

                console.log(` calculate difference between now & dt : ${now-displayLocalObject.time}`);

                if(now - displayLocalObject.time > 3600000){
                    console.log("Time is gone so remove item from the local storage and make api call again and set it into local storage")
                    localStorage.removeItem(cityName)

                    // fetch data again and set it in local storage
                    setTimeout(() => {
                        console.log("Now API is called")
                        getWeatherInfo(cityName);
                        setTimeout(() => {
                            console.log(obj);
                            localStorage.setItem(cityName, JSON.stringify(obj));
                            if(errorCity){
                                localStorage.removeItem(cityName);
                            }
                        },500);
                    },500); 
                }else{
                    console.log("get data from local storage and display data");
                    generateview(displayLocalObject);
                }
            }
            else{
                setTimeout(() => {
                    getWeatherInfo(cityName);
                    setTimeout(() => {
                        console.log(obj);
                        if(!errorCity){
                            localStorage.setItem(cityName, JSON.stringify(obj));
                        }
                    },500);
                },500); 
            }
        // Clear out input field after fetch is complete
        city.value = "";
        }
        else {
            // if the input field is empty make "Get Info" Button disable and skip making API call
            console.log("button is disabled")
            getInfoBtn.classList.remove('box-btn');
            getInfoBtn.disabled = true;
        }
        getInfoBtn.disabled = false;
    }

    
)

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

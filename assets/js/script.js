// https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
// API Key = 96d6d065213dba04092397c03343aea2

// select elements 

const countryName = document.querySelector('.country-name');
const overCast = document.querySelector('.overcast');
const degreeInfo = document.querySelector('.degree');
const time = document.querySelector('.time');
const getInfoBtn = document.querySelector('.getInfo');
const city = document.getElementById('city');
const rightContainer = document.querySelector('.more-info-div');
const sectionDiv = document.querySelector('.section-div');
const weatherImg = document.querySelector('.current-weather-img');
const weatherInputContainer = document.querySelector('.weather-input');
const form = document.querySelector('#form');

const API_KEY = '96d6d065213dba04092397c03343aea2';

let intervalId = 0;

// Get Weather Info function

const getWeatherInfo = function (city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`)
        .then((data) => data.json()).then((response) => {

            // Destructuring Response Object
            const { name, visibility, sys: { country }, weather, main: { temp, pressure, humidity }, wind: { speed, deg }, timezone } = response;

            // main alias with weatherMain
            const { main: weatherMain, description } = weather[0];

            // display containers when user clicks the button
            sectionDiv.style.display = "block";

            //1. weather info of left container

            // city and country name
            countryName.innerHTML = `${name}${country ? "," + country : ''}`;

            // overcast
            overCast.innerHTML = `<h2 class="overcast">${weatherMain}</h2>`;

            // generate weather icon based on the weatherDescription and weatherMain property
            generateWeatherIcon(description, weatherMain);

            // convert temperature from kelvin to celsius and add DOM to HTML
            degreeInfo.innerHTML = `${(temp - 273.15).toFixed(2)}°C`;

            // show clock time
            clearInterval(intervalId);
            intervalId = setInterval(() => timeZone(timezone), 1000);

            //2. weather info of right container
            rightContainer.innerHTML =
                `<div class="more-info-heading">
                        <h2>More Info</h2>
                    </div>
                <div class="info-div">
                    <div class="single-info">
                        <p class="more-info-p">Pressure: ${pressure}</p>
                        <i class="bi bi-arrows-collapse"></i>
                    </div>
                    <div class="single-info">
                        <p class="more-info-p">Visibility: ${visibility}</p>
                        <i class="far fa-binoculars"></i>
                    </div>
                    <div class="single-info">
                        <p class="more-info-p">Wind Speed: ${speed}</p>
                        <i class="far fa-wind"></i>
                    </div>
                    <div class="single-info">
                        <p class="more-info-p">Wind Degree: ${deg}</p>
                        <i class="far fa-location-arrow"></i>
                    </div>
                    <div class="single-info">
                        <p class="more-info-p">Humidity: ${humidity}</p>
                        <i class="far fa-tint"></i>
                    </div>
                </div>`;
        }).catch((err) => {
            alert(err)
            displayErrorMsg("Location is not found! Try Again ☹");
        })
}

// when form submit display weather data
form.addEventListener('submit', function (e) {
    e.preventDefault();
    getInfoBtn.classList.add('box-btn');
    const cityName = city.value.trim();

    if (cityName != "")
        getWeatherInfo(cityName);
    else
        displayErrorMsg("Please Enter City Name.")
})

// when focus out on button remove box-btn class
getInfoBtn.addEventListener('focusout', function () {
    getInfoBtn.classList.remove('box-btn');
});

// generate weather icon based on the weatherDescription and weatherMain property
function generateWeatherIcon(weatherDes, weatherMain) {
    if (weatherMain === 'Rain' || weatherDes === 'light rain' || weatherDes === 'moderate rain' || weatherDes === 'heavy intensity rain' || weatherDes === 'very heavy rain' || weatherDes === 'extreme rain') {
        weatherImg.src = './assets/animated/rain.svg';
    } else if (weatherMain === 'Snow' || weatherDes === 'freezing rain') {
        weatherImg.src = './assets/animated/snow.svg';
    } else if (weatherMain === 'Drizzle' || weatherDes === 'light intensity shower rain' || weatherDes === 'shower rain' || weatherDes === 'heavy intensity shower rain' || weatherDes === 'ragged shower rain') {
        weatherImg.src = './assets/animated/shower_rain.svg';
    } else if (weatherMain === 'Clouds' || weatherDes === 'few clouds') {
        weatherImg.src = './assets/animated/few_clouds.svg';
    } else if (weatherDes === 'scattered clouds' || weatherDes === 'broken clouds' || weatherDes === 'overcast clouds') {
        weatherImg.src = './assets/animated/broken_clouds.svg';
    } else if (weatherMain === 'Clear') {
        weatherImg.src = `./assets/animated/clear_sky.svg`;
    } else if (weatherMain === 'Thunderstorm') {
        weatherImg.src = `./assets/animated/thunderstorm.svg`;
    } else if (weatherMain === 'Mist' || weatherMain === 'Smoke' || weatherMain === 'Haze' || weatherMain === 'Dust' || weatherMain === 'Fog' || weatherMain === 'Sand' || weatherMain === 'Ash' || weatherMain === 'Squall' || weatherMain === 'Tornado') {
        weatherImg.src = `./assets/animated/mist.svg`;
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
    time.innerHTML = `<h2 class="time">${currTime}</h2>`;
}
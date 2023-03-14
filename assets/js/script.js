// https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
// API Key = 96d6d065213dba04092397c03343aea2

// select elements 

const country = document.querySelector('.country-name');
const overCast = document.querySelector('.overcast');
const degreeInfo = document.querySelector('.degree');
const time = document.querySelector('.time');
const getInfoBtn = document.querySelector('.getInfo');
const city = document.getElementById('city');
const rightContainer = document.querySelector('.more-info-div');
const sectionDiv = document.querySelector('.section-div');
const weatherImg = document.querySelector('.current-weather-img');
const weatherInputContainer = document.querySelector('.weather-input')

const API_KEY = '96d6d065213dba04092397c03343aea2';

// Get Weather Info function

const getWeatherInfo = function (city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`)
        .then((data) => data.json()).then((response) => {

            // display containers when user clicks the button
            sectionDiv.style.display = "block";

            //1. weather info of left container

            // city and country name
            country.innerHTML = `${response.name}${response.sys.country ? "," + response.sys.country : ''}`;

            // overcast
            overCast.innerHTML = `<h2 class="overcast">${response.weather[0].main}</h2>`;

            // Get weather detail and set img dynamically
            const weatherDetail = response.weather[0].main;

            // get weather icon based on the description
            let updateValue = getWeatherIconUsingDes(response.weather[0].description);

            if (updateValue === 0) {
                // switch case
                switch (weatherDetail) {
                    // Clear
                    case 'Clear': weatherImg.src = `./assets/animated/clear_sky.svg`;
                        break;

                    // Clouds
                    case 'Clouds': weatherImg.src = `./assets/animated/few_clouds.svg`;
                        break;

                    // Rain
                    case 'Rain': weatherImg.src = `./assets/animated/rain.svg`;
                        break;

                    // Thunderstorm
                    case 'Thunderstorm': weatherImg.src = `./assets/animated/thunderstorm.svg`;
                        break;

                    // Snow
                    case 'Snow': weatherImg.src = `./assets/animated/snow.svg`;
                        break;

                    // Drizzle
                    case 'Drizzle': weatherImg.src = `./assets/animated/shower_rain.svg`;
                        break;

                    // Atmosphere
                    case 'Mist': weatherImg.src = `./assets/animated/mist.svg`;
                        break;
                    case 'Smoke': weatherImg.src = `./assets/animated/mist.svg`;
                        break;
                    case 'Haze': weatherImg.src = `./assets/animated/mist.svg`;
                        break;
                    case 'Dust': weatherImg.src = `./assets/animated/mist.svg`;
                        break;
                    case 'Fog': weatherImg.src = `./assets/animated/mist.svg`;
                        break;
                    case 'Sand': weatherImg.src = `./assets/animated/mist.svg`;
                        break;
                    case 'Ash': weatherImg.src = `./assets/animated/mist.svg`;
                        break;
                    case 'Squall': weatherImg.src = `./assets/animated/mist.svg`;
                        break;
                    case 'Tornado': weatherImg.src = `./assets/animated/mist.svg`;
                        break;
                }
            }

            // convert temperature from kelvin to celsius
            degreeInfo.innerHTML = `${(response.main.temp - 273.15).toFixed(2)}°C`;

            // show clock time
            realTimeClock();

            //2. weather info of right container
            rightContainer.innerHTML =
                `<div class="more-info-heading">
                        <h2>More Info</h2>
                    </div>
                <div class="info-div">
                    <div class="single-info">
                        <p class="more-info-p">Pressure: ${response.main.pressure}</p>
                        <i class="bi bi-arrows-collapse"></i>
                    </div>
                    <div class="single-info">
                        <p class="more-info-p">Visibility: ${response.visibility}</p>
                        <i class="far fa-binoculars"></i>
                    </div>
                    <div class="single-info">
                        <p class="more-info-p">Wind Speed: ${response.wind.speed}</p>
                        <i class="far fa-wind"></i>
                    </div>
                    <div class="single-info">
                        <p class="more-info-p">Wind Degree: ${response.wind.deg}</p>
                        <i class="far fa-location-arrow"></i>
                    </div>
                    <div class="single-info">
                        <p class="more-info-p">Humidity: ${response.main.humidity}</p>
                        <i class="far fa-tint"></i>
                    </div>
                </div>`;
        }).catch((err) => {
            displayErrorMsg();
        })
}

// When get info button is clicked add box-btn class and also display weather data
getInfoBtn.addEventListener('click', function () {
    getInfoBtn.classList.add('box-btn');
    const cityName = city.value.trim();
    getWeatherInfo(cityName);
});

// when focus out on button remove box-btn class
getInfoBtn.addEventListener('focusout', function () {
    getInfoBtn.classList.remove('box-btn');
});

// get weather icon based on the description
function getWeatherIconUsingDes(weatherDes) {
    if (weatherDes === 'light rain' || weatherDes === 'moderate rain' || weatherDes === 'heavy intensity rain' || weatherDes === 'very heavy rain' || weatherDes === 'extreme rain') {
        weatherImg.src = './assets/animated/rain.svg';
        return 1;
    } else if (weatherDes === 'freezing rain') {
        weatherImg.src = './assets/animated/snow.svg';
        return 1;
    } else if (weatherDes === 'light intensity shower rain' || weatherDes === 'shower rain' || weatherDes === 'heavy intensity shower rain' || weatherDes === 'ragged shower rain') {
        weatherImg.src = './assets/animated/shower_rain.svg';
        return 1;
    } else if (weatherDes === 'few clouds') {
        weatherImg.src = './assets/animated/few_clouds.svg';
        return 1;
    } else if (weatherDes === 'scattered clouds' || weatherDes === 'broken clouds' || weatherDes === 'overcast clouds') {
        weatherImg.src = './assets/animated/broken_clouds.svg';
        return 1;
    } else {
        return 0;
    }
}

// showing clock time

function realTimeClock() {

    let clock = new Date();
    let hours = clock.getHours();
    let minutes = clock.getMinutes();
    let seconds = clock.getSeconds();

    // showing AM and PM
    let amPm = (hours < 12) ? "AM" : "PM";

    hours = ("0" + hours).slice(-2);
    minutes = ("0" + minutes).slice(-2);
    seconds = ("0" + seconds).slice(-2);

    hours = (hours > 12) ? hours - 12 : hours;

    time.innerHTML = `<h2 class="time">${hours + ":" + minutes + ":" + seconds + " " + amPm}</h2>`;
    var t = setTimeout(realTimeClock, 500);
}

// displayErrorMsg when something is wrong

function displayErrorMsg() {
    sectionDiv.style.display = "none";
    const errorMsg = document.createElement('h2');
    errorMsg.innerHTML = "Location is not found! Try Again ☹";
    errorMsg.classList.add('error-msg');
    weatherInputContainer.append(errorMsg);
    setTimeout(() => {
        errorMsg.style.display = "none";
    }, 3000);
}
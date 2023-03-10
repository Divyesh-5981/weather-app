// https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
// URL is https://openweathermap.org/img/wn/10d@2x.png
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

const API_KEY = '96d6d065213dba04092397c03343aea2';

// Get Weather Info function

const getWeatherInfo = function (city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`)
        .then((data) => data.json()).then((response) => {
            console.log(response)

            // display containers when user clicks the button
            sectionDiv.style.display = "block";

            // weather info of left container
            overCast.innerHTML = `<h2 class="overcast">${response.weather[0].main}</h2>`;

            // show clock time
            realTimeClock();

            weatherImg.src = `https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`;

            // weather info of right container
            rightContainer.innerHTML =
                `<div class="more-info-heading">
                        <h2>More Info</h2>
                    </div>
                <div class="info-div">
                    <div class="single-info">
                        <p class="more-info-p">Last Updated: 2023-03-08 08:45</p>
                        <i class="bi bi-clock-history"></i>
                    </div>
                    <div class="single-info">
                        <p class="more-info-p">UV Index: 6</p>
                        <i class="bi bi-speedometer"></i>
                    </div>
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
                        <p class="more-info-p">Wind Direction: NNE</p>
                        <i class="far fa-compass"></i>
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
        }).catch((err) => alert('location is not found'))
}

// When get info button is clicked add box-btn class and also display weather data

getInfoBtn.addEventListener('click', function () {
    getInfoBtn.classList.add('box-btn');
    getWeatherInfo(city.value);
});

// when focus out on button remove box-btn class

getInfoBtn.addEventListener('focusout', function () {
    getInfoBtn.classList.remove('box-btn');
});

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


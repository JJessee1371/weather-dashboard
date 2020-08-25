//Variable declaration
const userInput = $('#user-input');
const search = $('#search-history');
const searchBtn = $('#searchBtn');
const city = $('#card-title');
const cardContent = $('#card-content')
const day1 = $('#day1');
const day2 = $('#day1');
const day3 = $('#day1');
const day4 = $('#day1');
const day5 = $('#day1');

console.log('Sanity Check');
//Call using city name api.openweathermap.org/data/2.5/weather?q={city name}&appid={your api key}
searchBtn.on('click', function() {
    let cityName = userInput.val().trim();
    let currentDay = moment().format("MM/DD/YYYY");

    let queryURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=09009915e3fc252d07db5e780defa8fe';

    $.ajax({
        url: queryURL,
        method: 'GET'
    })
        //Returns response data from open weather
        .then(function(response) {
            console.log(response);

            //Current days forecast
            city.text('Todays weather in: ' + cityName + ' ' + currentDay);
            //Convert Kelvin temp to Farenheit
            let k = response.main.temp;
            let f = Math.floor(1.8 * (k - 273) + 32);
            let temp = $('<p>');
            temp.text('Temperature:' + ' '  + f + ' ' + '°F');
            let humid = $('<p>');
            humid.text('Humidity:' + ' ' + response.main.humidity);
            let wind = $('<p>');
            wind.text('Wind speed:' + ' ' + response.wind.speed + 'mph');
            // uv.text('UV Index:' + ' ' + )
            cardContent.append(temp, humid, wind);
        })

})
//Variable declaration
const userInput = $('#user-input');
const search = $('#search-history');
const searchBtn = $('#searchBtn');
const city = $('#card-title');
const temp = $('#temp');
const humidity = $('#humid');
const wind = $('#wind');
const uv = $('#uv');
const table = $('#table');
const day1 = $('#day1');
const day2 = $('#day1');
const day3 = $('#day1');
const day4 = $('#day1');
const day5 = $('#day1');

console.log('Sanity Check');
//Load local storage items
for (i = 0; i < localStorage.length; i++) {
    let savedCity = localStorage.getItem(localStorage.key(i));
    let listItem = $('<tr>');
    table.append(listItem.text(savedCity));
}
//Local Storage will clear out at the end of each day
let now = moment();
let currentHour = now.hour();
if (currentHour === 0) {localStorage.clear()};

//Key variable ensures a new key is created for each save to local storage
let key = 1;
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

            //Saves city searches to the local storage and displays
            localStorage.setItem('city' + key, cityName);
            key++;
            
            temp.empty();
            //Current days forecast
            city.text('Todays weather in: ' + cityName + ' ' + currentDay);
            //Convert Kelvin temp to Farenheit
            let k = response.main.temp;
            let f = Math.floor(1.8 * (k - 273) + 32);
            temp.text('Temperature:' + ' '  + f + ' ' + '°F');
            humidity.text('Humidity:' + ' ' + response.main.humidity + '%');
            wind.text('Wind speed:' + ' ' + response.wind.speed + 'mph');
            // uv.text('UV Index:' + ' ' + )
        })

})
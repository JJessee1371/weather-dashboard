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
//Load local storage items into search history
// for (i = 0; i < localStorage.length; i++) {
//     let savedCity = localStorage.getItem(localStorage.key(i));
//     let listItem = $('<tr>');
//     table.append(listItem.text(savedCity));
// }


//Local Storage will clear at the end of each day
let now = moment();
let currentHour = now.hour();
if (currentHour === 0) { localStorage.clear() };


//Key variable ensures a new key is created for each save to local storage
let key = 1;
searchBtn.on('click', function () {
    let cityName = userInput.val().trim();

    let queryURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=09009915e3fc252d07db5e780defa8fe';

    $.ajax({
        url: queryURL,
        method: 'GET'
    }).then(function (response) {
        console.log(response);

        //One Call API to get UV index information utilizing lat/lon from previous ajax request
        let lat = response.coord.lat;
        let lon = response.coord.lon;
        let queryURL2 = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&exclude=hourly,minutely&appid=09009915e3fc252d07db5e780defa8fe';
        $.ajax({
            url: queryURL2,
            method: 'GET'
        }).then(function (response2) {
            console.log(response2);
            //Set UV index for the current day
            uv.text('UV Index: ' + response2.current.uvi);
        })

        //Saves city searches to the local storage and displays
        localStorage.setItem('city' + key, cityName);
        key++;
        //Empty the previously set items in the card

        //Current days forecast
        city.text('Todays weather in: ' + cityName + ' ');
        //Convert Kelvin temp to Farenheit
        let k = response.main.temp;
        let f = Math.floor(1.8 * (k - 273) + 32);
        temp.text('Temperature:' + ' ' + f + ' ' + '°F');
        humidity.text('Humidity:' + ' ' + response.main.humidity + '%');
        wind.text('Wind speed:' + ' ' + response.wind.speed + 'mph');
        // uv.text('UV Index:' + ' ' + )

        let savedCity = localStorage.getItem('city' + (key - 1));
        console.log('city' + key);
        let listItem = $('<tr>');
        table.append(listItem.text(savedCity));
    });
        // let day1Date = $('<p>').text(moment().add(1, 'days').format("MM/DD/YYYY"));
        // let day1k = response.main.temp;
        // let day1f = $('<p>').text(Math.floor(1.8 * (k - 273) + 32));
        // let day1Humidity = $('<p>').text(response.main.humidity);
        // day1.append(date, f, humidity);
        

    })
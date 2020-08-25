//Variable declaration
const userInput = $('#user-input');
const search = $('#search-history');
const searchBtn = $('#searchBtn');
const city = $('#card-title');
const icon = $('#weathicon');
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
            //Empty previously set items
            uv.empty();

            
            //Set UV index for the current day
            uv.text('UV Index: ' + response2.current.uvi);

            //Set 5 day forecast
            daysAddArr = [1, 2, 3, 4, 5];
            dailyArr = [0, 1, 2, 3, 4];
            displayArr = [day1, day2, day3, day4, day5];

            for (i = 0; i < 5; i++) {
                //Set Date
                let date = $('<p>').text(moment().add(daysAddArr[i], 'days').format("MM/DD/YYYY"));
                //Set Icon
                let iconCode = response2.daily[dailyArr[i]].weather[0].icon;
                let iconURL = 'http://openweathermap.org/img/w/' + iconCode + '.png';
                let newIcon = $('<img>').attr('alt', 'Weather Icon').attr('src', iconURL);
                //Set Temperature
                let k = response2.daily[dailyArr[i]].temp.day;
                let f = $('<p>').text(Math.floor(1.8 * (k - 273) + 32) + '°F');
                //Set Humidity
                let humidity = $('<p>').text(response2.daily[dailyArr[i]].humidity + '%');
                //Append all items to specified day
                displayArr[i].append(newIcon, date, f, humidity);
            }
        })

        //Saves city searches to the local storage and displays
        localStorage.setItem('city' + key, cityName);
        key++;
        //Empty the previously set items in the card
        city.empty();
        icon.attr('src', '');
        temp.empty();
        humidity.empty();
        wind.empty();
        //Current days forecast
        city.text('Todays weather in: ' + cityName + ' ' + moment().format("MM/DD/YYYY"));
        //Get the open weather icon
        let iconCode = response.weather[0].icon;
        let iconURL = 'http://openweathermap.org/img/w/' + iconCode + '.png';
        icon.attr('src', iconURL);
        //Convert Kelvin temp to Farenheit
        let k = response.main.temp;
        let f = Math.floor(1.8 * (k - 273) + 32);
        temp.text('Temperature:' + ' ' + f + ' ' + '°F');
        humidity.text('Humidity:' + ' ' + response.main.humidity + '%');
        wind.text('Wind speed:' + ' ' + response.wind.speed + 'mph');

        let savedCity = localStorage.getItem('city' + (key - 1));
        console.log('city' + key);
        let listItem = $('<tr>');
        table.append(listItem.text(savedCity));
    });
})
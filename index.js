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
const day2 = $('#day2');
const day3 = $('#day3');
const day4 = $('#day4');
const day5 = $('#day5');

console.log('Sanity Check');
//Load items from local storage when the page is reloaded
//Change key variable to be equal to the localStorage.length, that way new items are added properly?
//Set limit on the table for search history? New searches override the old ones via key variable


//Local Storage will clear at the end of each day
let now = moment();
let currentHour = now.hour();
if (currentHour === 0) { localStorage.clear() };


//Key variable ensures a new key is created for each saved search to local storage
let key = 1;

//Search button click listener
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
            //Empty previously set items in the 5 day forecast
            uv.empty();
            day1.empty();
            day2.empty();
            day3.empty();
            day4.empty();
            day5.empty();

            //Set UV index value for the current day
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
            };
        });


        //Saves city searches to the local storage
        localStorage.setItem('city' + key, cityName);
        key++;
        //Displays the search history to the screen
        let savedCity = localStorage.getItem('city' + (key - 1));
        let listItem = $('<tr>');
        table.append(listItem.text(savedCity));


        //Empty the previously set items in the current days weather
        city.empty();
        icon.attr('src', '');
        temp.empty();
        humidity.empty();
        wind.empty();
        //Set current days forecast
        city.text('Todays weather in: ' + cityName + ' ' + moment().format("MM/DD/YYYY"));
        //Get the open weather icon
        let iconCode = response.weather[0].icon;
        let iconURL = 'http://openweathermap.org/img/w/' + iconCode + '.png';
        icon.attr('src', iconURL);
        //Convert Kelvin temp to Farenheit and set
        let k = response.main.temp;
        let f = Math.floor(1.8 * (k - 273) + 32);
        temp.text('Temperature:' + ' ' + f + ' ' + '°F');
        //Set humidity
        humidity.text('Humidity:' + ' ' + response.main.humidity + '%');
        //Set wind speed
        wind.text('Wind speed:' + ' ' + response.wind.speed + 'mph');
    });
})
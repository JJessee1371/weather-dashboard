//Variable declaration
const userInput = $('#user-input');
const search = $('#search-history');
const searchBtn = $('#searchBtn');
const clearBtn = $('#clear');
const city = $('#card-title');
const icon = $('#weathicon');
const temp = $('#temp');
const humidity = $('#humid');
const wind = $('#wind');
const uv = $('#uv');
const uvNum = $('#uvNum');
const list = $('#list');
const day1 = $('#day1');
const day2 = $('#day2');
const day3 = $('#day3');
const day4 = $('#day4');
const day5 = $('#day5');

console.log('Sanity Check');
//Clear search history when button is clicked
clearBtn.on('click', function () {
    localStorage.clear();
    list.empty();
});

// for (i = 0; i < localStorage.length; i++) {
//     console.log(localStorage.key(i));
//     let savedCity = localStorage.getItem(localStorage.key(i))
//     let listItem = $('<li>');
//     list.append(listItem.text(savedCity));
// };
let searchedArr = [];
// console.log(key);

//Function retrieves weather data
function getWeather(cityName) {
    let queryURL = 'http://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=09009915e3fc252d07db5e780defa8fe';
    $.ajax({
        url: queryURL,
        method: 'GET'
    }).then(function (response) {
        //One Call API to get UV index information utilizing lat/lon from previous ajax request
        let lat = response.coord.lat;
        let lon = response.coord.lon;
        let queryURL2 = 'http://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&exclude=hourly,minutely&appid=09009915e3fc252d07db5e780defa8fe';
        $.ajax({
            url: queryURL2,
            method: 'GET'
        }).then(function (response2) {
            //Empty previously set items in the 5 day forecast
            uv.empty();
            day1.empty();
            day2.empty();
            day3.empty();
            day4.empty();
            day5.empty();

            //Set UV index value for the current day
            uv.text('UV Index: ');
            uvNum.text(response2.current.uvi);
            uvNum.removeClass('label-success label-warning label-error');
            if (response2.current.uvi < 4) {
                uvNum.addClass('label-success');
            }
            else if (response2.current.uvi >= 4 && response2.current.uvi <= 7) {
                uvNum.addClass('label-warning');
            }
            else if (response2.current.uvi > 7) {
                uvNum.addClass('label-error');
            };

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
        searchedArr.push(cityName);
        localStorage.setItem('storedArr', JSON.stringify(searchedArr));
        // //Displays the search history to the screen
        let searchHist = JSON.parse(localStorage.getItem('storedArr'));
        let listItem = searchHist[searchHist.length - 1]
        let listDisplay = $('<li>');
        list.append(listDisplay.text(listItem));


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
};


//Search button click listener
searchBtn.on('click', function () {
    getWeather(userInput.val().trim());  
});


// When user clicks an item in search history they are presented with current/future data for that city
list.on('click', function (event) {
    getWeather($(event.target).text()); 
});


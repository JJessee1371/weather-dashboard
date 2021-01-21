//Variable declaration
const search = $('#search-history');
const city = $('#card-title');
const icon = $('#weathicon');
const temp = $('#temp');
const humidity = $('#humid');
const wind = $('#wind');
const uv = $('#uv');
const uvNum = $('#uvNum');
const day1 = $('#day1');
const day2 = $('#day2');
const day3 = $('#day3');
const day4 = $('#day4');
const day5 = $('#day5');
const list = $('#list');

//Clear search history when button is clicked
$('#clear').on('click', function () {
    localStorage.clear();
    searchedArr = [];
    list.empty();
});


//Setup for the search history items array
let searchedArr = [];
let searchHist = JSON.parse(localStorage.getItem('storedArr'));
if (searchHist) {
    for (j = 0; j < searchHist.length; j++) {
        searchedArr.push(searchHist[j]);
    };
    //Most recent searches' weather data will be loaded
    getWeather(searchedArr[searchedArr.length - 1]);
};


//Loads search history to the page when opened or refreshed
function loadHistory() {
    let searchHist = JSON.parse(localStorage.getItem('storedArr'));
    if(!searchHist) {
        return;
    } else {
        list.empty();
        for (i = 0; i < searchHist.length; i++) {
            let listItem = searchHist[i];
            let listDisplay = $('<li>');
            list.prepend(listDisplay.text(listItem));
        };
    };
};
loadHistory();


//Function to save searches to local storage
function storeSearch(cityName) {
    if(cityName == searchedArr[searchedArr.length - 1]) {
        return;
    } else {
        searchedArr.push(cityName);
        localStorage.setItem('storedArr', JSON.stringify(searchedArr));
        loadHistory();
    }
};


//Main function retrieves weather data from the API
function getWeather(cityName) {
    let queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=09009915e3fc252d07db5e780defa8fe`;
    $.ajax({
        url: queryURL,
        method: 'GET'
    })
    .then((response) => {
        //One Call API to get UV index information utilizing lat/lon from previous ajax request
        let lat = response.coord.lat;
        let lon = response.coord.lon;
        let queryURL2 = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&appid=09009915e3fc252d07db5e780defa8fe`;
        $.ajax({
            url: queryURL2,
            method: 'GET'
        })
        .then((response2) => {
            //Empty previously set items in the 5 day forecast
            uv.empty();
            day1.empty();
            day2.empty();
            day3.empty();
            day4.empty();
            day5.empty();

            //Set UV index value for the current day
            let uvVal = response2.current.uvi;
            uv.text('UV Index: ');
            uvNum.text(uvVal);
            uvNum.removeClass('label-success label-warning label-error');
            if (uvVal < 4) {
                uvNum.addClass('label-success');
            }
            else if (uvVal >= 4 && uvVal <= 7) {
                uvNum.addClass('label-warning');
            }
            else if (uvVal > 7) {
                uvNum.addClass('label-error');
            };

            //Set 5 day forecast
            daysAddArr = [1, 2, 3, 4, 5];
            dailyArr = [0, 1, 2, 3, 4];
            displayArr = [day1, day2, day3, day4, day5];

            for (i = 0; i < 5; i++) {
                let date = $('<p>').text(moment().add(daysAddArr[i], 'days').format("MM/DD/YYYY"));
                let iconCode = response2.daily[dailyArr[i]].weather[0].icon;
                let iconURL = `https://openweathermap.org/img/w/${iconCode}.png`;
                let newIcon = $('<img>').attr('alt', 'Weather Icon').attr('src', iconURL);
                let k = response2.daily[dailyArr[i]].temp.day;
                let c = Math.floor(k - 273.15);
                let f = $('<p>').text(`${Math.floor(1.8 * (k - 273) + 32)}°F / ${c}°C`);
                let humidity = $('<p>').text(`Humidity: ${response2.daily[dailyArr[i]].humidity}%`);

                //Append information to its given div element
                displayArr[i].append(date, newIcon, f, humidity);
            };
        });

        //Saves information to local storage and loads the searched items
        storeSearch(cityName);

        //Empty previous search results 
        city.empty();
        icon.attr('src', '');
        temp.empty();
        humidity.empty();
        wind.empty();

        //Set current days forecast including icon, temp, humidity, wind speed, etc
        city.text(`Todays weather in: ${cityName} - ` + moment().format("MM/DD/YYYY"));
        let iconCode = response.weather[0].icon;
        let iconURL = `https://openweathermap.org/img/w/${iconCode}.png`;
        icon.attr('src', iconURL).attr('alt', 'Weather icon');
        let k = response.main.temp;
        let c = Math.floor(k - 273.15);
        let f = Math.floor(1.8 * (k - 273) + 32);
        temp.text(`Temperature: ${f}°F / ${c}°C`);
        humidity.text(`Humidity: ${response.main.humidity}%`);
        wind.text(`Wind speed: ${response.wind.speed}mph`);

        //Add styles to the now visible items
        day1.addClass('day5');
        day2.addClass('day5');
        day3.addClass('day5');
        day4.addClass('day5');
        day5.addClass('day5');
        icon.removeClass('hidden').addClass('visible');
    });
};



//Search button click listener
$('#searchBtn').on('click', () => {
    getWeather($('#user-input').val().trim());  
});


//If search history items are clicked, city data is populated
list.on('click', function (event) {
    getWeather($(event.target).text()); 
});
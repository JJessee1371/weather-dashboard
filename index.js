//Variable declaration
const userInput = $('#user-input');
const search = $('#search-history');
const searchBtn = $('#searchBtn');
const today = $('#card-title');
const day1 = $('#day1');
const day2 = $('#day1');
const day3 = $('#day1');
const day4 = $('#day1');
const day5 = $('#day1');

console.log('Sanity Check');
//Call using city name api.openweathermap.org/data/2.5/weather?q={city name}&appid={your api key}
searchBtn.on('click', function() {
    let cityName = userInput.val().trim();
    console.log(cityName); })
    // let queryURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=09009915e3fc252d07db5e780defa8fe';

//     $ajax({
//         url: queryURL,
//         method: 'GET'
//     })
//         //Returns response data from 
//         .then(function(response) {

//         })

// })
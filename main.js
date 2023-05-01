// https://home.openweathermap.org/api_keys
// https://openweathermap.org/current
// 24d083b54aa399b021b848c3a6706695
// http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}

const APIKey = "24d083b54aa399b021b848c3a6706695"

const errorCard = document.getElementById('error-card')
const weatherCard = document.getElementById('weather-card')
const introCard = document.getElementById('intro-card')

// Fake Boston data for testing
// let boston = {
//     coord: { lon: -71.0605, lat: 42.3554 },
//     weather: [
//         {
//             id: 501,
//             main: 'Rain',
//             description: 'moderate rain',
//             icon: '10d'
//         },
//         { id: 741, main: 'Fog', description: 'fog', icon: '50d' }
//     ],
//     base: 'stations',
//     main: {
//         temp: 50.22,
//         feels_like: 49.21,
//         temp_min: 47.17,
//         temp_max: 54.28,
//         pressure: 1002,
//         humidity: 91
//     },
//     visibility: 805,
//     wind: { speed: 16.11, deg: 40 },
//     rain: { '1h': 1.33 },
//     clouds: { all: 100 },
//     dt: 1682891118,
//     sys: {
//         type: 2,
//         id: 2013408,
//         country: 'US',
//         sunrise: 1682847664,
//         sunset: 1682898101
//     },
//     timezone: -14400,
//     id: 4930956,
//     name: 'Boston',
//     cod: 200
// }

const getGeoData = async (city) => {
    let url = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=${2}&appid=${APIKey}`
    // console.log(url)
    const res = await fetch(url)
    const data = await res.json()
    // console.log(data)
    // const jsonString = JSON.stringify(data)
    return data
}

const getWeatherData = async (lat,lon) => {
    let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKey}&units=imperial`
    // let url = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=${2}&appid=${APIKey}`
    console.log(url)
    const res = await fetch(url)
    const data = await res.json()
    console.log(data)
    const jsonString = JSON.stringify(data)
    return data

    // fs.writeFile('bostonweather.json', jsonString, err => {
    //     if (err) {
    //         console.log('Error writing file', err)
    //     } else {
    //         console.log('Successfully wrote file')
    //     }
    // })
}

// Working JSON Reader
// function jsonReader(filePath) {
//     try {
//         return JSON.parse(fs.readFileSync(filePath))

//     } catch (error) {
//         console.error(error)
//     }
// }

// let i = jsonReader("bostongeo.json")
// let lat = i[0]['lat']
// let lon = i[0]['lon']
// console.log(lat,lon)
// getWeatherData(lat,lon)

// let i = jsonReader("bostonweather.json")
// console.log(i) 
// let lat = i[0]['lat']
// let lon = i[0]['lon']

// let weatherData = boston

const form = document.querySelector('#myForm')
form.addEventListener('submit',async (e)=> {
    e.preventDefault()
    introCard.hidden = true
    
    const cityName = document.getElementById('city-name-input').value.toLowerCase()
    let geoData
    try {
        geoData = await getGeoData(cityName)
        console.log(geoData)
        let lat = geoData[0].lat
        let lon = geoData[0].lon
        let cityInfo = new Object
        cityInfo.name = geoData[0].name
        cityInfo.country = geoData[0].country
        cityInfo.state = geoData[0].state
        
        weatherData = await getWeatherData(lat,lon)

        // let cityInfo = {
        //     name:"Boston",
        //     state:"Massachusetts",
        //     country:"US",
        // }
        // weatherData = boston

        renderPage(weatherData,cityInfo)

    } catch (err) {
        errorCard.hidden = false
        weatherCard.hidden = true
        return
    }
    // console.log(e)
})

function renderPage(weatherData,cityInfo) {
    let iconHolder = document.getElementById('icon-holder')
    iconHolder.innerHTML = ""
    let forecastList = []
    for (let i = 0; i < weatherData.weather.length; i++) {
        console.log(weatherData.weather[i].icon)
        let img = document.createElement('img');
        img.src = `https://openweathermap.org/img/wn/${weatherData.weather[i].icon}@2x.png`
        img.classList.add("weather-icon")
        iconHolder.appendChild(img)
        forecastList.push(weatherData.weather[i].description)
    }

    document.getElementById('city-name').innerText = cityInfo.name
    document.getElementById('location').innerText = cityInfo.state + "/" + cityInfo.country
    document.getElementById('todays-high').innerText = Math.round(weatherData.main.temp_max)
    document.getElementById('todays-low').innerText = Math.round(weatherData.main.temp_min)
    document.getElementById('feels-like').innerText = Math.round(weatherData.main.feels_like)
    document.getElementById('humidity').innerText = Math.round(weatherData.main.humidity)
    let forecastString = forecastList.join("/")
    document.getElementById('forecast').innerText = forecastString
    body = document.getElementById('body')
    
    // console.log(typeof body.classList)
    
    for (let theClass of body.classList) {
        body.classList.remove(theClass)
    }
    
    if (forecastString.includes("thunder")) {
        body.classList.add("weather-thunder")
    } else if (forecastString.includes("snow")) {
        body.classList.add("weather-snow")
    } else if (forecastString.includes("rain")) {
        body.classList.add("weather-rain")
    } else if (forecastString.includes("drizzle")) {
        body.classList.add("weather-rain")
    } else if (forecastString.includes("fog") || forecastString.includes("mist")) {
        body.classList.add("weather-fog")
    } else if (forecastString.includes("overcast clouds") || forecastString.includes("broken clouds")) {
        body.classList.add("weather-very-cloudy")
    } else if (forecastString.includes("scattered clouds")) {
        body.classList.add("weather-kinda-cloudy")
    }
    
    errorCard.hidden = true
    weatherCard.hidden = false 
}
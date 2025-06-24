import axios from 'axios'

const apiKey = import.meta.env.VITE_WEATHER_API_KEY

const getCapitalWeather = (lat, lon) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
    const request = axios.get(url)
    return request.then(res => res.data)
}

export default { getCapitalWeather }


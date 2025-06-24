
const CountryWeather = ({ country, weather }) => {

    return (
        <div>
            <h2>Weather in {country.capital ? country.capital[0] : country.name.common}</h2>
            <p>Temperature {weather.main.temp} Celsius</p>
            <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt={weather.weather[0].description}
            />
            <p>Wind {weather.wind.speed} m/s</p>
        </div>
    )

}

export default CountryWeather
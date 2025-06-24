import { useState, useEffect } from 'react'

import weatherService from '../services/weather'

import CountryWeather from './CountryWeather'

const Country = ({ country }) => {
    const [weather, setWeather] = useState(null)

    useEffect(() => {
        const getCoordinates = () => {
            return (country.capitalInfo && Object.keys(country.capitalInfo).length !== 0) 
                ? country.capitalInfo.latlng 
                : country.latlng
        }
        const coords = getCoordinates()
        if (!coords) return

        weatherService
            .getCapitalWeather(...coords)
            .then(data => setWeather(data))
            .catch(error => console.error('Weather fetching failed', error))
    }, [country])



    return (
        <div>
            <h1>{country.name.common}</h1>

            {/*Have to join the captial array since a country could have more than one */}
            {country.capital && <p>Capital(s): {country.capital.join(', ')}</p>}
            <p>Area: {country.area}</p>

            {country.languages && (
                <>
                    <h2>Languages:</h2>
                    <ul>
                        {Object.values(country.languages).map(lang => <li key={lang}>{lang}</li>)}
                    </ul>
                </>
            )}
            <img src={country.flags.png} alt={`Flag of ${country.name.common}`} />

            {weather && <CountryWeather country={country} weather={weather}/>}

        </div>
    )
}

export default Country

import { useState, useEffect } from 'react'

import Country from './components/Country'
import CountryList from './components/CountryList'

import countryService from './services/countries'


const App = () => {

  const [countrySearch, setCountrySearch] = useState('')
  const [countries, setCountries] = useState([])
  const [countriesToShow, setCountriesToShow] = useState([])

  useEffect(() => {
    countryService
      .getAllCountries()
      .then(
        (allCountries) => setCountries(allCountries.map(countryObj => countryObj))
      )
  }, [])

  const handleCountrySearch = (event) => {
    const countryQuery = event.target.value
    setCountrySearch(countryQuery)

    // Find all countries with the query
    setCountriesToShow(
      countries.filter(c => c.name.common.toLowerCase().includes(countryQuery.toLowerCase()))
    )
  }

  const handleShowCountry = (country) => {
    setCountriesToShow([country])
  }

  return (
    <div>
      <div>
        find countries: <input value={countrySearch} onChange={handleCountrySearch} />
        {
          // Have to use a double ternary for the triple condition
          // If the amount is over 10 -> "Be more specific"
          // Else if the countries to show has len 1 -> Full info
          // Else the remaining countries

          countriesToShow.length > 10
            ? <p>Too many matches, specify another filter</p>
            : countriesToShow.length === 1
              ? <Country country={countriesToShow[0]} />
              : <CountryList countries={countriesToShow} onShowCountry={handleShowCountry} />
        }
      </div>
    </div>
  );

}

export default App
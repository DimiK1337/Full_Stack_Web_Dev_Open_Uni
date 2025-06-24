
const Country = ({ country }) => {

    return (
        <div>
            <h1>{country.name.common}</h1>
            <p>Capital(s): {country.capital.join(', ')}</p> {/*Have to join the captial array since a country could have more than one */}
            <p>Area: {country.area}</p>
            <h2>Languages:</h2>
            <ul>
                {Object.values(country.languages).map(lang => <li key={lang}>{lang}</li>)}
            </ul>
            <img src={country.flags.png} alt={`Flag of ${country.name.common}`} />
        </div>
    )
}

export default Country
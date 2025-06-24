const CountryList = ({ countries, onShowCountry }) => {
    return (
        countries.map(
            country => (
                <div key={country.name.common}>
                    {country.name.common}
                    <button onClick={() => onShowCountry(country)}>Show</button>
                </div>
            )
        )
    )
}

export default CountryList
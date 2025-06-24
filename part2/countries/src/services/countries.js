import axios from 'axios'

const baseURL = "https://studies.cs.helsinki.fi/restcountries/"


const getAllCountries = () => {
    const request = axios.get(`${baseURL}/api/all`)
    return request.then(res => res.data)
}

const getCountry = (name) => {
    const request = axios.get(`${baseURL}/api/name/${name}`)
    return request.then(res => res.data)
}



export default { getAllCountries, getCountry }
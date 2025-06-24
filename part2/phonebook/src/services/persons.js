import axios from 'axios'

const port = 3001
const baseurl = `http://localhost:${port}/persons`

const getAll = () => {
    const request = axios.get(baseurl)
    return request.then(res => res.data)
}

const create = (newObject) => {
    const request = axios.post(baseurl, newObject)
    return request.then(res => res.data)
}

const update = (id, newObject) => {
    const request = axios.put(`${baseurl}/${id}`, newObject)
    return request.then(res => res.data)
}

export default { getAll, create, update }
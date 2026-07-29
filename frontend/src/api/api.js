import axios from 'axios'

const baseURL = import.meta.env.VITE_BASE_URL

const apiClient = axios.create({
    baseURL
})



export const codeAPI={
    run: (code,language)=>apiClient.post('/run',{code,language})
}

import axios from 'axios'

import { API_BASE_URL, API_HOST, API_KEY } from '../config/api.config'

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'x-rapidapi-key': API_KEY,
    'x-rapidapi-host': API_HOST,
  },
})

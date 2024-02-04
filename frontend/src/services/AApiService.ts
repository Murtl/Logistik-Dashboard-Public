import axios from 'axios'
import { auth } from '@/firebase'

/**
 * AApiService is a axios instance that is used to make requests to the backend
 */
const AApiService = axios.create({
  baseURL: 'http://localhost:3000/api/',
  headers: {
    'Content-Type': 'application/json'
  }
})

/**
 * Interceptor that adds the firebase auth token to the request header
 */
AApiService.interceptors.request.use(async (config) => {
  const token = await auth.currentUser?.getIdToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default AApiService

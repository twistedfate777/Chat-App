import axios from 'axios'

export const axiosInstance = axios.create({
  baseURL : "https://chat-app-backend-six-zeta.vercel.app/api",
  withCredentials : true, //send cookies with request
})
import { axiosInstance } from "./axios"

export const signupFn = async(signupData)=>{
  const res = await axiosInstance.post('/auth/signup',signupData)
  return res.data
}

export const getAuthUserFn = async()=>{
  try {
    const res = await axiosInstance.get('/auth/me')
    return res.data
  } catch (error) {
    return null
  }
}
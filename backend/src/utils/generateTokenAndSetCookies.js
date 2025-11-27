import jwt from 'jsonwebtoken'

export const generateTokenAndSetCookies =  (userId,res)=>{
  const token = jwt.sign({userId:userId},process.env.JWT_SECRET,{
    expiresIn:"7d"
  })
  console.log(process.env.NODE_ENV)
  res.cookie("jwt",token,{
    maxAge: 7 * 24 * 3600 * 1000,
    httpOnly:true,
    sameSite:"none",
    secure : process.env.NODE_ENV === "production"
  })}
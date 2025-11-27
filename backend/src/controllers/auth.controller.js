import User from "../models/user.model.js";
import jwt from 'jsonwebtoken'
import bcrypt from "bcryptjs"
import { generateTokenAndSetCookies } from "../utils/generateTokenAndSetCookies.js";
import { upsertStreamUser } from "../lib/stream.js";

export const signup = async(req,res)=>{
  const {fullName,email,password} = req.body

  try {
    if(!email || !fullName || !password){
      return res.status(400).json({error:'please fill in all fields'})
    }

    if(password.length < 6){
      return res.status(400).json({error:'password must be atleast 6 characters long'})
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne({email})
    if(existingUser){
      return res.status(400).json({error:"email already exist"})
    }
    //generate random avatar dari api https://avatar.iran.liara.run/public
    const index = Math.floor(Math.random() * 100) + 1 //generate random number between 1-100
    const randomAvatar = `https://avatar.iran.liara.run/public/${index}.png`

    const newUser = await User.create({
      fullName,
      email,
      password,
      profilePic:randomAvatar
    })
    generateTokenAndSetCookies(newUser._id,res)

    try {
      //create the user in stream
      await upsertStreamUser({
      id:newUser._id.toString(),
      name:newUser.fullName,
      image:newUser.profilePic || ""
      })
      console.log(`stream user created ${newUser.fullName}`)
    } catch (error) {
      console.log("error in creating stream user",error)
    }

    res.status(201).json(newUser)
  } catch (error) {
    console.log("error in signup controller", error)
    res.status(500).json({error:"internal server error"})
  }
}
export const login = async(req,res)=>{
  const {email,password} = req.body
  try {
    if(!email || !password) return res.status(400).json({error:"please fill in all fields"})
    const user = await User.findOne({email})
    if(!user) return res.status(400).json({error:"user does not exist"})
    const isPasswordMatch = await bcrypt.compare(password,user.password)
    if(!isPasswordMatch) return res.status(400).json({error:"password incorrect"})

    generateTokenAndSetCookies(user._id,res)
    
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      bio: user.bio,
      profilePic: user.profilePic,
      nativeLanguage: user.nativeLanguage,
      learningLanguage: user.learningLanguage,
      location: user.location,
      isOnboarded: user.isOnboarded,
      friends: user.friends
    })
  } catch (error) {
    console.log("error in login controller", error)
    res.status(500).json({error:"internal server error"})
  }
}
export const logout = async(req,res)=>{
  res.clearCookie("jwt")
  res.status(200).json({message:"logout successfully"})
}

export const onBoard = async(req,res)=>{
  const userId = req.user._id
  try {
    const {fullName,bio,nativeLanguage,learningLanguage,location} = req.body
    if(!fullName || !bio || !nativeLanguage || !learningLanguage || !location) {
      return res.status(400).json({error:'please fill in all fields'})
    }
    /* cara ini juga bisa
    const user = req.user
    user.fullName = fullName
    user.bio = bio
    user.nativeLanguage = nativeLanguage
    user.learningLanguage = learningLanguage
    user.location = location
    user.isOnboarded = true
    await user.save()
    res.status(200).json(user)*/
    const updatedUser = await User.findByIdAndUpdate(userId,{
      fullName,bio,nativeLanguage,learningLanguage,location,isOnboarded:true
    },{new:true}).select('-password')
    //kalo bingung new itu apa tinggal di hover aja

    if(!updatedUser) return res.status(404).json({error:"user not found"})

    //update di stream
    try {
      await upsertStreamUser({
        id:updatedUser._id.toString(),
        name:updatedUser.fullName,
        image:updatedUser.profilePic || ""
      })
    } catch (error) {
      console.log("error in updating stream user at onBoard controller", error)
    res.status(500).json({error:"internal server error"})
    }
    
    res.status(200).json(updatedUser)
  } catch (error) {
    console.log("error in onBoard controller", error)
    res.status(500).json({error:"internal server error"})
  }
}
 export const getMe = async(req,res)=>{
    try {
      res.status(200).json(req.user)
    } catch (error) {
      console.log("error in getMe controller", error)
    res.status(500).json({error:"internal server error"})
    }
 }
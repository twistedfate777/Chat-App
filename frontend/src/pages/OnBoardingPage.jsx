import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useEffect, useState } from 'react'
import PageLoader from '../components/pageLoader'
import useAuthUser from '../hooks/useAuthUser'
import { LANGUAGES } from '../constants/constant'
import { LoaderIcon, MapPinIcon, ShipWheelIcon, ShuffleIcon } from "lucide-react";
import { axiosInstance } from '../lib/axios'
import {toast} from 'react-hot-toast'

const OnBoardingPage = () => {
  const queryClient = useQueryClient()
  const {authUser,isLoading} = useAuthUser()
  const [onBoardingData,setOnBoardingData] = useState({
   fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || ""
  })

   const {mutate:onBoard,isPending} = useMutation({
    mutationFn:async()=>{
      const res = await axiosInstance.post('/auth/onboarding',onBoardingData)
      return res.data
    },
    onSuccess:()=>{
      toast.success('Onboarded!!')
      queryClient.invalidateQueries({queryKey:['authUser']})
    },
    onError:(error)=>{
      toast.error(error.response?.data?.error)
    }
  })
  const handleRandomAvatar = ()=>{
     const idx = Math.floor(Math.random() * 100) + 1; // 1-100 included
     const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`
    setOnBoardingData({...onBoardingData, profilePic:randomAvatar})
  }
  const handleSubmit = (e)=>{
    e.preventDefault()
    onBoard()
  }
  if(isLoading) return <PageLoader/>
  return (
    <div className='flex flex-col items-center pt-10 gap-5 px-20 ' data-theme='retro'>
      <h1 className='text-2xl font-bold'>Complete Your Profile</h1>
      <div className='size-20'>
         <img src={onBoardingData.profilePic} alt='profile-img'/> 
      </div>
      <button className='btn bg-secondary px-3 ' onClick={handleRandomAvatar}>
        <ShuffleIcon className='size-4'/>
        Generate Random Avatar
      </button>
      <form className=' w-full form-control gap-4' onSubmit={handleSubmit}>
        <label className='form-control w-full '>
         <div className='label'>
            <span className='label-text'>Full Name</span>
         </div>
         <input 
        type='text'
        value={onBoardingData.fullName}
        onChange={(e)=>{setOnBoardingData({...onBoardingData , fullName : e.target.value})}}
        className="input input-bordered w-full "
        placeholder='FullName...'
        />

        </label>
        
        <label className='form-control'>
          <div className='label'>
            <span className='label-text'>Bio</span>
          </div>
          <textarea
          type='text'
          value={onBoardingData.bio}
          onChange={(e)=>{setOnBoardingData({...onBoardingData , bio : e.target.value})}}
          placeholder='Tell us about yourself and your learning goals'
          className="input input-bordered w-full min-h-[90px] pt-2"
        />
        </label>
        
        <label className='form-control'>
          <div className='label'>
            <span className='label-text'>Native Language</span>
          </div>
          <select 
          onChange={(e)=>setOnBoardingData({...onBoardingData, nativeLanguage : e.target.value})}
          className="input input-bordered w-full "
        >
          <option value=''>Select your native language</option>
          {LANGUAGES.map((lang)=>(
            <option key={`native-${lang}`} value={lang.toLowerCase()}>{lang}</option>
          ))}
        </select>
        </label>
        
        <label className='form-control'>
          <div className='label'>
            <span className='label-text'>Learning Language</span>
          </div>
           <select 
          onChange={(e)=>setOnBoardingData({...onBoardingData, learningLanguage : e.target.value})}
          className="input input-bordered w-full "
        >
          <option value=''>Select your learning language</option>
          {LANGUAGES.map((lang)=>(
            <option key={`native-${lang}`} value={lang.toLowerCase()}>{lang}</option>
          ))}
        </select>
        </label>
       
      <label className='form-control'>
        <div className='label'>
          <span className='label-text'>Location</span>
        </div>
        <div className="input input-bordered flex items-center gap-2">
          <MapPinIcon />
           <input 
           type="text" 
           className='grow'
          placeholder='City, Country'
          value={onBoardingData.location}
          onChange={(e)=>setOnBoardingData({...onBoardingData, location:e.target.value})}
        />
        </div>
      </label>
      <div className='w-full flex justify-center py-2'>
        <button className='btn btn-primary w-full max-w-xs bg-primary' type='submit' disabled={isPending}>
        {isPending ? (<>
          <LoaderIcon className='animate-spin'/>
          <span>Onboarding...</span>
        </>) : (
          <>
            <ShipWheelIcon/>
            <span>Complete Onboarding</span>
          </>
        )}
      </button>
      </div>
      </form>
    </div>
  )
}

export default OnBoardingPage
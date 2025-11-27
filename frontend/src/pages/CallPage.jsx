import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import {toast} from 'react-hot-toast'
import PageLoader from '../components/PageLoader'

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY

const CallPage = () => {
  const {id:callId} =useParams()
  const [client,setClient] = useState(null)
  const [call,setCall] =useState(null)
  const [isConnecting,setIsConnecting] = useState(true)
  const {authUser,isLoading} = useAuthUser()
   const {data:streamToken}=useQuery({
      queryKey:['streamToken'],
      queryFn:async()=>{
       const response = await axiosInstance.get("/chats/token");
      return response.data;
      },
      enabled: !!authUser //dua tanda seru itu convert authUser ke boolean, maksud dari enabled ini adalah jangan run query ini sebelum ada authUser
    })
  useEffect(()=>{
    const initializeCall = async()=>{    
      if(!authUser || !streamToken.token || !callId ) return;
      try {
        const user = {
        id:authUser._id,
        name:authUser.fullName,
        image:authUser.profilePic
      }
      const videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user,
          token: streamToken.token,
        });

      const callInstance = videoClient.call("default",callId)

      await callInstance.join({create:true})

      console.log("joined call successfully")
      setClient(videoClient)
      setCall(callInstance)
      } catch (error) {
        console.error("Error joining call:", error);
        toast.error("Could not join the call. Please try again.");
      }finally {
        setIsConnecting(false);
      }
    }
    initializeCall()
  },[authUser,callId,streamToken])

  if(isLoading || isConnecting) return <PageLoader/>
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="relative">
        {client && call ? (
          <StreamVideo client={client}>
            <StreamCall call={call}>
              <CallContent />
            </StreamCall>
          </StreamVideo>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>Could not initialize call. Please refresh or try again later.</p>
          </div>
        )}
      </div>
    </div>
  )
}



export default CallPage

const CallContent = ()=>{
  const {useCallCallingState} = useCallStateHooks()
  const callingState = useCallCallingState()

  const navigate = useNavigate();

  if(callingState === CallingState.LEFT) return navigate('/') // kalo left call, di naviaget ke home

   return (
    <StreamTheme>
      <SpeakerLayout />
      <CallControls />
    </StreamTheme>
   )

}
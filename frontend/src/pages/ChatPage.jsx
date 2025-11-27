import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import useAuthUser from '../hooks/useAuthUser'
import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from '../lib/axios'
import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import { StreamChat } from 'stream-chat'
import toast from 'react-hot-toast'

import ChatLoader from '../components/ChatLoader'
import CallButton from '../components/CallButton'

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY

const ChatPage = () => {
  const {id:targetUserId} = useParams()
  
  const [isLoading,setIsLoading] = useState(true)
  const [chatClient,setChatClient] = useState(null)
  const [channel,setChannel] = useState(null)
  const {authUser} = useAuthUser()
  const {data:streamToken}=useQuery({
    queryKey:['streamToken'],
    queryFn:async()=>{
      const res = await axiosInstance.get('/chats/token')
      return res.data
    },
    enabled: !!authUser //dua tanda seru itu convert authUser ke boolean, maksud dari enabled ini adalah jangan run query ini sebelum ada authUser
  })
  useEffect(()=>{
    const initializeChat = async()=>{
      if (!streamToken?.token || !authUser) return;

      try {
        console.log("initializing stream chat client...")

        const client = StreamChat.getInstance(STREAM_API_KEY)
        //connect user, harus kasih streamToken nya
        await client.connectUser({
          id:authUser._id,
          name:authUser.fullName,
          image:authUser.profilePic
        },streamToken.token)

        //di sort buat dua user tetap memiliki channel yang sama terlepas dari siapa yang memuali chat nya
        //ensure that between two user will have the same channel reagrdless who started it
        const channelId = [authUser._id, targetUserId].sort().join('-')
        // you and me
        // if i start the chat => channelId: [myId, yourId]
        // if you start the chat => channelId: [yourId, myId] di sort jadi  => [myId,yourId]


        //bisa di check di documentation
        const currChannel = client.channel("messaging",channelId,{
          members:[ authUser._id,targetUserId]
        })

        await currChannel.watch()
        setChatClient(client)
        setChannel(currChannel)
        setIsLoading(false)
      } catch (error) {
        setIsLoading(false)
        toast.error("could not connect the chat, please try again")
        console.error("error in initializing chat", error)
      }
    }
    initializeChat()
  },[authUser,targetUserId,streamToken])
  const handleVideoCall = ()=>{
    if(channel){
      const callUrl = `${window.location.origin}/call/${channel.id}`

      channel.sendMessage({
        text:`I've started a video call. join me here : ${callUrl}`
      })
    }
  }
  if(isLoading || !channel || !chatClient) return <ChatLoader/>
  return (
    <div className="h-[93vh]">
      <Chat client={chatClient}>
        <Channel channel={channel}>
          <div className="w-full relative">
            <CallButton handleVideoCall={handleVideoCall} />
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput focus />
            </Window>
          </div>
          <Thread />
        </Channel>
      </Chat>
    </div>
  )
}

export default ChatPage
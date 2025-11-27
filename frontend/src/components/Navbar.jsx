import { Link, useLocation } from "react-router";

import { BellIcon, LogOutIcon, ShipWheelIcon } from "lucide-react";
import useAuthUser from "../hooks/useAuthUser";
import { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import ThemeSelector from "./ThemeSelector";
import { StreamChat } from "stream-chat";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY

const Navbar = () => {
  const queryClient = useQueryClient()
  const {mutate:logout, isPending,error} = useMutation({
    mutationFn : async()=>{
      const res = await axiosInstance.post('/auth/logout')
      
      return res.data
    },
    onSuccess:()=>{
      queryClient.invalidateQueries({queryKey:['authUser']})
      toast.success('logout successfull')
    },
    onError:(error)=>{
      toast.error(error.response?.data?.error)
    }
  })
  const {authUser} = useAuthUser()
  const location = useLocation()
  const isChatPage = location.pathname?.startsWith('/chat')
  const handleLogout = ()=>{
    logout()
  }
  return (
    <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-end w-full">
          {/* LOGO - ONLY IN THE CHAT PAGE */}
          {isChatPage && (
            <div className="pl-5">
              <Link to="/" className="flex items-center gap-2.5">
                <ShipWheelIcon className="size-9 text-primary" />
                <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary  tracking-wider">
                  Chatly
                </span>
              </Link>
            </div>
          )}

          <div className="flex items-center gap-3 sm:gap-4 ml-auto">
            <Link to={"/notifications"}>
              <button className="btn btn-ghost btn-circle">
                <BellIcon className="h-6 w-6 text-base-content opacity-70" />
              </button>
            </Link>
          </div>

         
          <ThemeSelector/> 

          <div className="avatar">
            <div className="w-9 rounded-full">
              <img src={authUser?.profilePic} alt="User Avatar" rel="noreferrer" />
            </div>
          </div>

          {/* Logout button */}
          <button className="btn btn-ghost btn-circle" onClick={handleLogout}>
            <LogOutIcon className="h-6 w-6 text-base-content opacity-70" />
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
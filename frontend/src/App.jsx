import { Navigate, Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import OnBoardingPage from "./pages/OnBoardingPage";
import NotificationsPage from "./pages/NotificationsPage";
import CallPage from "./pages/CallPage";
import ChatPage from "./pages/ChatPage";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "./lib/axios";
import PageLoader from "./components/PageLoader";
import useAuthUser from "./hooks/useAuthUser";
import Layout from "./components/Layout";
import { useThemeStore } from "./store/useThemeStore";


export default function App() {
  const {authUser,isLoading} = useAuthUser()
  const {theme} = useThemeStore()
  if(isLoading) return <PageLoader/>
  const isOnboarded = authUser?.isOnboarded
  return (
    <div data-theme={theme}>
      <Routes>
        <Route path="/" element={authUser && isOnboarded ?(
          <Layout showSidebar={true}>
            <HomePage/>
          </Layout> ): 
        authUser ? <Navigate to={'/onboarding'}/> : <Navigate to={'/login'}/>
      }/>
        <Route path="/signup" element={!authUser ? <SignUpPage/> : <Navigate to={'/'}/>}/>
        <Route path="/login" element={!authUser ? <LoginPage/> : <Navigate to={'/'}/>}/>
        <Route path="/onboarding" element={authUser && !isOnboarded ? <OnBoardingPage/> : (
          authUser && isOnboarded ? <Navigate to={'/'}/> : <Navigate to='/login'/>
        )}/>
        <Route path="/notifications" element={authUser && isOnboarded ? <Layout showSidebar={true}><NotificationsPage/></Layout> : !authUser ? <Navigate to={'/login'}/> : <Navigate to={'/onboarding'}/>}/>
        <Route path="/call/:id" element={authUser && isOnboarded ? <CallPage/> : <Navigate to={!authUser ? '/login' : '/onboarding' }/>}/>
        <Route path="/chat/:id" element={authUser && isOnboarded ?
        ( <Layout>
          <ChatPage/>
        </Layout> ): <Navigate to={!authUser ? '/login' : '/onboarding'}/>}/>
      </Routes>
      <Toaster/>
    </div>
  )
}
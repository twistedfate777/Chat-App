import { useQuery } from "@tanstack/react-query";
import { getAuthUserFn } from "../lib/api";

const useAuthUser = ()=>{
  const {data:authUser ,isLoading} = useQuery({
    queryKey:['authUser'],
    queryFn:getAuthUserFn,
    retry:false
  })
  return {authUser, isLoading }
}

export default useAuthUser
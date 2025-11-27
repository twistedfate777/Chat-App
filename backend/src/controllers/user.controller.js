import FriendRequest from "../models/friendRequest.model.js";
import User from "../models/user.model.js"

export const getRecommendedUsers = async(req,res)=>{
  try {
    const userId = req.user._id
    const user = req.user
    const recommendedUsers= await User.find({
      $and: [
        { _id: { $ne: userId } }, //exclude current user
        { _id: { $nin: user.friends } }, // exclude current user's friends
        { isOnboarded: true },
      ],
    });
    res.json(recommendedUsers)
  } catch (error) {
    console.log("error in getRecommendedUsers controller", error)
    res.status(500).json({error:"internal server error"})
  }
}

export const getMyFriends = async(req,res)=>{
  try {
    const user = req.user
    const friends = await User.find({
      _id : {$in : user.friends}
    }).select("-password")
    res.json(friends)
  } catch (error) {
    console.log("error in getMyFriends controller", error)
    res.status(500).json({error:"internal server error"})
  }
}

export const sendFriendRequest = async(req,res)=>{
  const user = req.user
  const {id:friendId} = req.params
  try {
    const friend = await User.findById(friendId)
    if(friendId.toString() === req.user._id.toString()) return res.status(400).json({error:"cannot send request to yourself"})
    if(!friend) return res.status(404).json({error:"user not found"})
    const existingRequest = await FriendRequest.findOne({
      $or : [
        {sender:req.user._id , recipient : friendId , status: "pending"},
        {sender : friendId , recipient : req.user._id, status:"pending"}
      ]
    })
    if(existingRequest) return res.status(400).json({error:"a friend request already exist between you and this user"})
    const inFriendList = user.friends.includes(friendId)
    if(inFriendList){
      //unfriend
      /* ini fitur tambahan */
      const myFriendIndex = user.friends.indexOf(friendId)
      const friendIndex = friend.friends.indexOf(req.user._id)
      await user.friends.splice(myFriendIndex)
      await friend.friends.splice(friendIndex)
      await user.save()
      await friend.save()
      return res.status(200).json({message:"user unfriended"})
    }
    const friendRequest = await FriendRequest.create({
        sender : req.user._id,
        recipient : friendId
      })
    
    res.status(201).json(friendRequest)
  } catch (error) {
    console.log("error in sendFriendRequest controller", error)
    res.status(500).json({error:"internal server error"})
  }
}

export const acceptFriendRequest = async(req,res)=>{
  const {id:requestId} = req.params
  const user = req.user
  try {
    const request = await FriendRequest.findById(requestId)
    if(!request) return res.status(404).json({error:"request not found"})
    if(request.recipient.toString()!==req.user._id.toString()) return res.status(401).json({error:"this request is not for you"})
    const senderId = request.sender
    const sender = await User.findById(senderId)
    if(user.friends.includes(senderId) || sender.friends.includes(req.user._id)) return res.status(400).json({error:'you already a friend with this user'})

    // add each users to friends array
    user.friends.push(senderId)
    sender.friends.push(req.user._id)
    await user.save()
    await sender.save()

    request.status = "accepted"
    await request.save()
    res.status(200).json({message : "request accepted", user,sender})
  } catch (error) {
    console.log("error in acceptFriendRequest controller", error)
    res.status(500).json({error:"internal server error"})
  }
}

export const getFriendRequest = async(req,res)=>{
  try {
    const incomingRequests = await FriendRequest.find({recipient:req.user._id,status:"pending"}).populate({
      path:"sender",
      select:"-password"
    })
    const acceptedRequests = await FriendRequest.find({sender:req.user._id,status:"accepted"}).populate({
      path:"recipient",
      select:"-password"
    })
    res.json({incomingRequests,acceptedRequests})
  } catch (error) {
    console.log("error in getFriendRequest controller", error)
    res.status(500).json({error:"internal server error"})
  }
}

export const getOutgoingFriendRequest = async(req,res)=>{
  try {
    const outgoingRequests = await FriendRequest.find({sender:req.user._id, status:"pending"}).populate({
      path:"recipient",
      select:"-password"
    })
    res.json(outgoingRequests)
  } catch (error) {
    console.log("error in getOutgoingFriendRequest controller", error)
    res.status(500).json({error:"internal server error"})
  }
}
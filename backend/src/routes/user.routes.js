import express from 'express'
import { getMyFriends,getRecommendedUsers,sendFriendRequest ,acceptFriendRequest, getFriendRequest, getOutgoingFriendRequest} from '../controllers/user.controller.js'
import { protectRoute } from '../middleware/auth.middleware.js'

const router = express.Router()

router.get('/',protectRoute,getRecommendedUsers)
router.get('/friends',protectRoute,getMyFriends)
router.get('/friend-requests',protectRoute,getFriendRequest)
router.get('/outgoing-friend-requests',protectRoute,getOutgoingFriendRequest)


router.post('/friend-request/:id',protectRoute,sendFriendRequest)
router.put('/friend-request/:id/accept',protectRoute,acceptFriendRequest)




export default router
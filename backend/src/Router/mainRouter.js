let Router = require("express");
const router = Router();
let user = require('./userRouter')
let MasterList = require('./MasterListRouter')
let bus = require('./Bus_detailRouter')
let booking = require('./BookingRouter')
let busowner = require('./BusOwnerUserRouter')
let Adminpanel = require('./Adminpanel_userRouter')
let sendMessage = require('./sendMessageRoute')

router.use('/user', user)
router.use('/MasterList', MasterList)
router.use('/bus', bus)
router.use('/Booking', booking)
router.use('/busowner', busowner)
router.use('/Adminpanel', Adminpanel)
router.use('/sendMessage', sendMessage)


module.exports = router;
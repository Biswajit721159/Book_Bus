let Router = require("express");
const router = Router();
let user = require('./userRouter')
let MasterList = require('./MasterListRouter')
let bus=require('./Bus_detailRouter')
let booking=require('./BookingRouter')

router.use('/user', user)
router.use('/MasterList', MasterList)
router.use('/bus',bus)
router.use('/Booking',booking)


module.exports = router;
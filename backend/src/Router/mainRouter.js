let Router = require("express");
const router = Router();
let user = require('./userRouter')
let MasterList = require('./MasterListRouter')
let bus=require('./Bus_detailRouter')

router.use('/user', user)
router.use('/MasterList', MasterList)
router.use('/bus',bus)


module.exports = router;
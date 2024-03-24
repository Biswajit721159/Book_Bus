let Router = require("express");
const router = Router();
let user = require('./userRouter')
let MasterList = require('./MasterListRouter')



router.use('/user', user)
router.use('/MasterList', MasterList)


module.exports = router;
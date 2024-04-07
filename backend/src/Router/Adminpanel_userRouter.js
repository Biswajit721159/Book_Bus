let Router = require("express");
const router = Router();
let verifytoken = require('../Middelware/TokenVerification')
let {login, register,AdminPanelgetdata,UpdateBusDetail}=require('../Controler/AdminpanelUsercontolter')

router.route('/login').post(login);
router.route('/register').post(register);
router.route('/getdata').get(verifytoken,AdminPanelgetdata);
router.route('/updatebusdetail').put(verifytoken,UpdateBusDetail);

module.exports = router;
let Router = require("express");
const router = Router();
let verifytoken = require('../Middelware/TokenVerification')
let { login, register, AdminPanelgetdata, UpdateBusDetail, logInByToken } = require('../Controler/AdminpanelUsercontolter')
let { validateRegisterData } = require('../utils/validateData');

router.route('/login').post(login);
router.route('/register').post(validateRegisterData, register);
router.route('/getdata').get(verifytoken, AdminPanelgetdata);
router.route('/updatebusdetail').put(verifytoken, UpdateBusDetail);
router.route('/logInByToken').post(verifytoken, logInByToken);

module.exports = router;
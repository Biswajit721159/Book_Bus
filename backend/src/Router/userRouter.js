let Router = require("express");
const router = Router();
let verifytoken = require('../Middelware/TokenVerification')
let { login, register, DeleteByEmail, UpdateByEmail, getByEmail } = require('../Controler/usercontrolter')


router.route('/usermail/:email').get(verifytoken, getByEmail);
router.route('/usermail/:email').put(verifytoken, UpdateByEmail);
router.route('/usermail/:email').delete(verifytoken, DeleteByEmail);
router.route('/register').post(register);
router.route('/login').post(login);

module.exports = router;
let Router = require("express");
const router = Router();
let verifytoken = require('../Middelware/TokenVerification')
let { insertSendMessage } = require('../Controler/sendMessagecontrolter')

router.route('/').post(verifytoken, insertSendMessage);

module.exports = router;
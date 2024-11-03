let Router = require("express");
const router = Router();
let verifytoken = require('../Middelware/TokenVerification')
let { createMessage, deleteMessage, fetchMessage } = require('../Controler/MessageController')


router.route('/createMessage').post(createMessage);
router.route('/fetchMessage').get(verifytoken, fetchMessage);
router.route('/deleteMessage/:id').delete(verifytoken, deleteMessage);

module.exports = router;
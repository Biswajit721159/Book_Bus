let Router = require("express");
const router = Router();
let verifytoken = require('../Middelware/TokenVerification')

const { GetMasterUser, DeleteMasterUser, PostMasterUser, UpdateMasterUser } = require('../Controler/MasterListControler')

router.route('/:user_id').get(verifytoken, GetMasterUser);
router.route('/:user_id').post(verifytoken, PostMasterUser);
router.route('/:user_id').put(verifytoken, UpdateMasterUser);
router.route('/:user_id').delete(verifytoken, DeleteMasterUser);

module.exports = router;
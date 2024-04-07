let sendMessage = require('../models/sendMessage_models')
let { ApiResponse } = require("../utils/ApiResponce")

const insertSendMessage = async (req, res) => {
    try {
        let result = await sendMessage.create(req.body)
        if (result.acknowledged == true) {
            return res
                .status(201)
                .json(new ApiResponse(201, null, "Successfully added"));
        }
        else {
            return res
                .status(500)
                .json(new ApiResponse(500, null, "Server down !"));
        }
    } catch {
        return res
            .status(500)
            .json(new ApiResponse(500, null, "Server down !"));
    }
}

module.exports = { insertSendMessage }
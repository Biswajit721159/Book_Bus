const nodemailer = require("nodemailer");
const User = require("../models/user_models.js");
let { ApiResponse } = require("../utils/ApiResponse.js");
let userValidation = require("../models/userValidation_models.js");
const bcrypt = require("bcryptjs");
let { register, login } = require("../Controler/usercontrolter");

let VerificationRegister = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Email is required"));
    }

    let user = await User.findOne({ email: email });
    if (user == null) {
      return OTPGenerateAndSendToUser(res, email);
    } else {
      return res
        .status(409)
        .json(new ApiResponse(409, null, `Email already exists`));
    }
  } catch {
    res
      .status(500)
      .json(
        new ApiResponse(500, null, "Some Error is Found Please Try Again Later")
      );
  }
};

let OTPGenerateAndSendToUser = async (res, email) => {
  const otp = Math.floor(1000 + Math.random() * 9000);
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "bg5050525@gmail.com",
      pass: "vqxn zycm bovh xexf",
    },
  });
  let HtmlTemplates = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
    <h2 style="color: #4CAF50;">OTP Verification</h2>
    <p style="font-size: 16px; color: #333;">Hello,</p>
    <p style="font-size: 16px; color: #333;">
      Thank you for verifying your email address. Your OTP for verification is:
    </p>
    <div style="text-align: center; margin: 20px 0;">
      <span style="display: inline-block; font-size: 24px; font-weight: bold; color: #4CAF50; border: 2px dashed #4CAF50; padding: 10px 20px; border-radius: 5px;">
        ${otp}
      </span>
    </div>
    <p style="font-size: 16px; color: #333;">
      Please enter this OTP within the next 10 minutes to complete your verification process.
    </p>
    <p style="font-size: 16px; color: #333;">Thank you!</p>
    <p style="font-size: 10px; color: #999;">Best regards,<br>Blue Bus</p>
    <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;">
    <p style="font-size: 12px; color: #999; text-align: center;">
      This email was sent to you because you requested OTP verification. If you did not request this, please ignore this email.
    </p>
  </div>
  `
  const mailOptions = {
    from: "bg5050525@gmail.com",
    to: email,
    subject: "Your OTP for Verification",
    text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
    html: HtmlTemplates
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res
        .status(500)
        .json(new ApiResponse(500, null, "Failed to send OTP via email"));
    } else {
      return checkMailIsPresent(otp, email, res);
    }
  });
};

let LoginVerification = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json(
          new ApiResponse(400, null, "Both Email and Password is required")
        );
    }

    let user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "User does not exist"));
    }
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json(new ApiResponse(401, null, "Invalid user credentials"));
    } else {
      return OTPGenerateAndSendToUser(res, email);
    }
  } catch {
    return res
      .status(500)
      .json(
        new ApiResponse(500, null, "Some Error is Found Please Try Again Later")
      );
  }
};

let checkMailIsPresent = async (otp, email, res) => {
  try {
    let user = await userValidation.findOne({ email: email });
    if (user) {
      const passwordHash = await bcrypt.hash(otp.toString(), 10);
      const result = await userValidation.updateOne(
        { email: email },
        { $set: { OTP: passwordHash } }
      );
      if (result.modifiedCount === 1) {
        return res
          .status(200)
          .json(new ApiResponse(200, null, "OTP sent successfully"));
      } else {
        return res
          .status(200)
          .json(
            new ApiResponse(200, null, `No user found with email: ${email}`)
          );
      }
    } else {
      let result = await userValidation.create({ email: email, OTP: otp });
      if (result) {
        return res
          .status(200)
          .json(new ApiResponse(200, null, "OTP sent successfully"));
      } else {
        res
          .status(500)
          .json(
            new ApiResponse(
              500,
              null,
              "Some Error is Found Please Try Again Later"
            )
          );
      }
    }
  } catch {
    res
      .status(500)
      .json(
        new ApiResponse(500, null, "Some Error is Found Please Try Again Later")
      );
  }
};

let VerifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res
        .status(400)
        .json(
          new ApiResponse(400, null, "Both Email and Password is required")
        );
    } else {
      let user = await userValidation.findOne({ email: email });
      if (user) {
        const updatedAt = user.updatedAt;
        if (!updatedAt || Date.now() - updatedAt.getTime() > 10 * 60 * 1000) {
          return res
            .status(403)
            .json(new ApiResponse(403, null, "OTP expired or invalid"));
        }
        const isOTPCorrect = await bcrypt.compare(otp.toString(), user.OTP);
        if (isOTPCorrect) {
          let data = await userValidation.deleteOne({ email });
          if (data) {
            let finduseronregister = await User.findOne({ email: email });
            if (!finduseronregister) return register(req, res);
            else return login(req, res);
          } else {
            return res
              .status(404)
              .json(new ApiResponse(404, null, "Please Try Again Later"));
          }
        } else {
          return res
            .status(401)
            .json(new ApiResponse(401, null, "Invalid OTP"));
        }
      } else {
        return res
          .status(404)
          .json(new ApiResponse(404, null, "Please Try Again Later"));
      }
    }
  } catch {
    return res
      .status(500)
      .json(
        new ApiResponse(500, null, "Some Error is Found Please Try Again Later")
      );
  }
};

let ForgotPassword = async (req, res) => {
  try {
    let { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Email is required"));
    } else {
      let user = await User.findOne({ email: email });
      if (!user) {
        return res
          .status(404)
          .json(new ApiResponse(404, null, "User does not exist"));
      } else {
        return OTPGenerateAndSendToUser(res, email);
      }
    }
  } catch {
    return res
      .status(500)
      .json(
        new ApiResponse(500, null, "Some Error is Found Please Try Again Later")
      );
  }
};

let passwordSave = async (req, res) => {
  try {
    const { email, password, otp } = req.body;
    if (!email || !password || !otp) {
      return res
        .status(400)
        .json(
          new ApiResponse(400, null, "Both Email and Password is required")
        );
    } else {
      let user = await userValidation.findOne({ email: email });
      if (user) {
        const updatedAt = user.updatedAt;
        if (!updatedAt || Date.now() - updatedAt.getTime() > 10 * 60 * 1000) {
          return res
            .status(403)
            .json(new ApiResponse(403, null, "OTP expired or invalid"));
        }
        const isOTPCorrect = await bcrypt.compare(otp.toString(), user.OTP);
        if (isOTPCorrect) {
          let data = await userValidation.deleteOne({ email });
          if (data) {
            const passwordHash = await bcrypt.hash(password.toString(), 10);
            const result = await User.updateOne(
              { email: email },
              { $set: { password: passwordHash } }
            );
            if (result.modifiedCount === 1) {
              return res
                .status(200)
                .json(new ApiResponse(200, null, "Password Reset successfully"));
            } else {
              return res
                .status(200)
                .json(
                  new ApiResponse(200, null, `No user found with email: ${email}`)
                );
            }
          } else {
            return res
              .status(404)
              .json(new ApiResponse(404, null, "Please Try Again Later"));
          }
        } else {
          return res
            .status(401)
            .json(new ApiResponse(401, null, "Invalid OTP"));
        }
      } else {
        return res
          .status(404)
          .json(new ApiResponse(404, null, "Please Try Again Later"));
      }
    }
  } catch {
    return res
      .status(500)
      .json(
        new ApiResponse(500, null, "Some Error is Found Please Try Again Later")
      );
  }
};

module.exports = {
  VerificationRegister,
  LoginVerification,
  VerifyOTP,
  ForgotPassword,
  passwordSave
};
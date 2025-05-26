const uuid = require("uuid");
const otpGenerator = require("otp-generator");
const { sendErrorResponse } = require("../helpers/send.error.response");
const { addMinutesToDate } = require("../helpers/add_minutes");
const { encode, decode } = require("../helpers/crypt");
const pool = require("../config/db");

const newOtp = async (req, res) => {
  try {
    const { phone_number } = req.body;

    const otp = otpGenerator.generate(4, {
      digits: true,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    const now = new Date();
    const expiration_time = addMinutesToDate(now, 5);

    const newOtpDb = await pool.query(
      `
        INSERT INTO otp(id, otp, expiration_time) 
        VALUES($1, $2, $3) returning id
        `,
      [uuid.v4(), otp, expiration_time]
    );
    //sms, bot, email

    const details = {
      time: now,
      phone_number: phone_number,
      otp_id: newOtpDb.rows[0].id,
    };

    const encodedData = await encode(JSON.stringify(details));

    res.status(200).send({
      message: "OTP Generated",
      verification_key: encodedData,
    });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { verification_key, otp, phone_number } = req.body;
    const decodedData = await decode(verification_key);
    const data = JSON.parse(decodedData);
    if (phone_number != data.phone_number) {
      return res
        .status(400)
        .send({ message: "OTP wasn't send to this number" });
    }

    const otpResult = await pool.query(`SELECT * FROM otp WHERE id = $1`, [
      data.otp_id,
    ]);
    const result = otpResult.rows[0];
    if (result == null) {
      return res.status(400).send({ message: "OTP not found" });
    }
    if (result.verified == true) {
      return res.status(400).send({ message: "This OTP checked before" });
    }
    if (result.expiration_time < new Date()) {
      return res.status(400).send({ message: "This OTP expired" });
    }
    if (otp != result.otp) {
      return res.status(400).send({ message: "OTPs not same" });
    }
    await pool.query(
      `
        UPDATE otp SET verified = $2 WHERE id=$1
      `,
      [result.id, true]
    );
    res.status(200).send({ message: "OTP verified!👍" });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

module.exports = {
  newOtp,
  verifyOtp,
};

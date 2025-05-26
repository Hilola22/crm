const uuid = require("uuid");
const otpGenerator = require("otp-generator");
const { sendErrorResponse } = require("../helpers/send.error.response");
const { addMinutesToDate } = require("../helpers/add_minutes");
const { encode, decode } = require("../helpers/crypt");
const pool = require("../config/db");
const mailService = require("../services/mail.service");
const config = require('config');

const newOtp = async (req, res) => {
  try {
    const { phone_number, email } = req.body;

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
    await mailService.sendMail(email, otp);
    
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
    const clientResult = await pool.query(
      "SELECT * FROM client WHERE phone_number=$1",
      [phone_number]
    );
    let client_id, isNew;
    if (clientResult.rows.length == 0) {
      const newClient = await pool.query(
        `
            INSERT INTO client (phone_number, is_active)
            VALUES ($1, $2) returning id 
            `,
        [phone_number, true]
      );

      client_id = newClient.rows[0].id;
      isNew = true;
    } else {
      client_id = clientResult.rows[0].id;
      isNew = false;
      await pool.query(`
        UPDATE client SET is_active=true WHERE id=$1`,
        [client_id]
      );
    }
    res.status(200).send({ message: "OTP verified!👍", isNew, client_id });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

module.exports = {
  newOtp,
  verifyOtp,
};

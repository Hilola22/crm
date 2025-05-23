const { sendErrorResponse } = require("../helpers/send.error.response");
const pool = require("../config/db");

const addPayment = async (req, res) => {
  try {
    const {
      student_id,
      payment_last_date,
      payment_date,
      price,
      is_paid,
      total_attent,
    } = req.body;
    const newPayment = await pool.query(
      `
        INSERT INTO payment (student_id, payment_last_date, payment_date, price, is_paid, total_attent)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *           
        `,
      [
        student_id,
        payment_last_date,
        payment_date,
        price,
        is_paid,
        total_attent,
      ]
    );
    console.log(newPayment);

    res.status(201).send(newPayment.rows[0]);
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const getAll = async (req, res) => {
  try {
    const paymentes = await pool.query(`
        SELECT * FROM payment`);
    res.status(200).send({ data: paymentes.rows });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const getPayment = await pool.query(
      `
        SELECT * FROM payment WHERE id = $1`,
      [id]
    );
    res.status(200).send({ data: getPayment.rows[0] });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const update = async (req, res) => {
  const {
    student_id,
    payment_last_date,
    payment_date,
    price,
    is_paid,
    total_attent,
  } = req.body;
  const { id } = req.params;

  try {
    const updatePayment = await pool.query(
      `UPDATE payment SET student_id = $1, payment_last_date = $2, payment_date = $3, price = $4, is_paid = $5, total_attent = $6  WHERE id = $7 RETURNING *`,
      [
        student_id,
        payment_last_date,
        payment_date,
        price,
        is_paid,
        total_attent,
        id
      ]
    );

    res.status(200).send({ data: updatePayment.rows[0] });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const remove = async (req, res) => {
  const { id } = req.params;
  try {
    const deleteSPayment = await pool.query(
      `
        DELETE FROM payment WHERE id = $1
        `,
      [id]
    );
    res.status(200).send({ message: "Payment deleted!" });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

module.exports = {
  addPayment,
  getAll,
  getOne,
  update,
  remove,
};

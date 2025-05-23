const { sendErrorResponse } = require("../helpers/send.error.response");
const pool = require("../config/db");

const addReason = async (req, res) => {
  try {
    const { reason_lid } = req.body;
    const newReason = await pool.query(
      `
        INSERT INTO reason (reason_lid)
        VALUES ($1) RETURNING *           
        `,
      [reason_lid]
    );
    console.log(newReason);

    res.reason(201).send(newReason.rows[0]);
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const getAll = async (req, res) => {
  try {
    const reasons = await pool.query(`
        SELECT * FROM reason`);
    res.reason(200).send({ data: reasons.rows });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const getReason = await pool.query(
      `
        SELECT * FROM reason WHERE id = $1`,
      [id]
    );
    res.reason(200).send({ data: getReason.rows[0] });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const update = async (req, res) => {
  const { reason_lid } = req.body;
  const { id } = req.params;

  try {
    const updateReason = await pool.query(
      `UPDATE reason SET reason_lid = $1 WHERE id = $2 RETURNING *`,
      [reason_lid, id]
    );

    res.reason(200).send({ data: updateReason.rows[0] });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const remove = async (req, res) => {
  const { id } = req.params;
  try {
    const deleteSReason = await pool.query(
      `
        DELETE FROM reason WHERE id = $1
        `,
      [id]
    );
    res.reason(200).send({ message: "Reason deleted!" });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

module.exports = {
  addReason,
  getAll,
  getOne,
  update,
  remove,
};

const { sendErrorResponse } = require("../helpers/send.error.response");
const pool = require("../config/db");

const addStatus = async (req, res) => {
  try {
    const { name } = req.body;
    const newStatus = await pool.query(
      `
        INSERT INTO status (name)
        VALUES ($1) RETURNING *           
        `,
      [name]
    );
    console.log(newStatus);

    res.status(201).send(newStatus.rows[0]);
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const getAll = async (req, res) => {
  try {
    const statuss = await pool.query(`
        SELECT * FROM status`);
    res.status(200).send({ data: statuss.rows });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const getStatus = await pool.query(
      `
        SELECT * FROM status WHERE id = $1`,
      [id]
    );
    res.status(200).send({ data: getStatus.rows[0] });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const update = async (req, res) => {
  const { name } = req.body;
  const { id } = req.params;

  try {
    const updateStatus = await pool.query(
      `UPDATE status SET name = $1 WHERE id = $2 RETURNING *`,
      [name, id]
    );

    res.status(200).send({ data: updateStatus.rows[0] });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const remove = async (req, res) => {
  const { id } = req.params;
  try {
    const deleteStatus = await pool.query(
      `
        DELETE FROM status WHERE id = $1
        `,
      [id]
    );
    res.status(200).send({ message: "Status deleted!" });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

module.exports = {
  addStatus,
  getAll,
  getOne,
  update,
  remove,
};

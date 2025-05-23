const { sendErrorResponse } = require("../helpers/send.error.response");
const pool = require("../config/db");

const addBranch = async (req, res) => {
  try {
    const { name, addres, call_number } = req.body;
    const newBranch = await pool.query(
      `
        INSERT INTO branch (name, addres, call_number)
        VALUES ($1, $2, $3) RETURNING *           
        `,
      [name, addres, call_number]
    );
    console.log(newBranch);

    res.status(201).send(newBranch.rows[0]);
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const getAll = async (req, res) => {
  try {
    const branches = await pool.query(`
        SELECT * FROM branch`);
    res.status(200).send({ data: branches.rows });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const getBranch = await pool.query(
      `
        SELECT * FROM branch WHERE id = $1`,
      [id]
    );
    res.status(200).send({ data: getBranch.rows[0] });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const update = async (req, res) => {
  const { name, addres, call_number } = req.body;
  const { id } = req.params;

  try {
    const updateBranch = await pool.query(
      `UPDATE branch SET name = $1, addres = $2, call_number=$3 WHERE id = $4 RETURNING *`,
      [name, addres, call_number, id]
    );

    res.status(200).send({ data: updateBranch.rows[0] });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const remove = async (req, res) => {
  const { id } = req.params;
  try {
    const deleteSBranch = await pool.query(
      `
        DELETE FROM branch WHERE id = $1
        `,
      [id]
    );
    res.status(200).send({ message: "Branch deleted!" });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

module.exports = {
  addBranch,
  getAll,
  getOne,
  update,
  remove,
};

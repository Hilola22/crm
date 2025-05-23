const { sendErrorResponse } = require("../helpers/send.error.response");
const pool = require("../config/db");

const addStage = async (req, res) => {
  try {
    const { name, description } = req.body;
    const newStage = await pool.query(
      `
        INSERT INTO stage (name, description)
        VALUES ($1, $2) RETURNING *           
        `, //returnings barcha qo'shilgan qiymatlarni qo'shib barcha ustunlari bn qaytaradi
      [name, description]
    );
    console.log(newStage);

    res.status(201).send(newStage.rows[0]);
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const getAll = async (req, res) => {
  try {
    const stages = await pool.query(`
        SELECT * FROM stage`);
    res.status(200).send({ data: stages.rows });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const getStage = await pool.query(
      `
        SELECT * FROM stage WHERE id = $1`,
      [id]
    );
    res.status(200).send({ data: getStage.rows[0] });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const update = async (req, res) => {
  const { name, description } = req.body;
  const { id } = req.params;

  try {
    const updateStage = await pool.query(
      `UPDATE stage SET name = $1, description = $2 WHERE id = $3 RETURNING *`,
      [name, description, id]
    );

    res.status(200).send({ data: updateStage.rows[0] });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const remove = async (req, res) => {
  const { id } = req.params;
  try {
    const deleteStage = await pool.query(
      `
        DELETE FROM stage WHERE id = $1
        `,
      [id]
    );
    res.status(200).send({ message: "Stage deleted!" });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

module.exports = {
  addStage,
  getAll,
  getOne,
  update,
  remove,
};

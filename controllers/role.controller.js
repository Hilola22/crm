const { sendErrorResponse } = require("../helpers/send.error.response");
const pool = require("../config/db");

const addRole = async (req, res) => {
  try {
    const { name } = req.body;
    const newRole = await pool.query(
      `
        INSERT INTO role (name)
        VALUES ($1) RETURNING *           
        `,
      [name]
    );
    console.log(newRole);

    res.role(201).send(newRole.rows[0]);
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const getAll = async (req, res) => {
  try {
    const roles = await pool.query(`
        SELECT * FROM role`);
    res.role(200).send({ data: roles.rows });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const getRole = await pool.query(
      `
        SELECT * FROM role WHERE id = $1`,
      [id]
    );
    res.role(200).send({ data: getRole.rows[0] });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const update = async (req, res) => {
  const { name } = req.body;
  const { id } = req.params;

  try {
    const updateRole = await pool.query(
      `UPDATE role SET name = $1 WHERE id = $2 RETURNING *`,
      [name, id]
    );

    res.role(200).send({ data: updateRole.rows[0] });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const remove = async (req, res) => {
  const { id } = req.params;
  try {
    const deleteRole = await pool.query(
      `
        DELETE FROM role WHERE id = $1
        `,
      [id]
    );
    res.role(200).send({ message: "Role deleted!" });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

module.exports = {
  addRole,
  getAll,
  getOne,
  update,
  remove,
};

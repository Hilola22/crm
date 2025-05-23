const { sendErrorResponse } = require("../helpers/send.error.response");
const pool = require("../config/db");

const addStudent = async (req, res) => {
  try {
    const { first_name, last_name, phone_number, birthday, male } = req.body;
    const newStudent = await pool.query(
      `
        INSERT INTO students (
          first_name,
          last_name,
          phone_number,
          birthday,
          male)
        VALUES ($1, $2, $3, $4, $5) RETURNING *           
        `,
      [first_name, last_name, phone_number, birthday, male]
    );
    console.log(newStudent);
    res.status(201).send(newStudent.rows[0]);
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const getAll = async (req, res) => {
  try {
    const students = await pool.query(`
        SELECT * FROM students`);
    res.status(200).send({ data: students.rows });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const getStudent = await pool.query(
      `
        SELECT * FROM students WHERE id = $1`,
      [id]
    );
    res.status(200).send({ data: getStudent.rows[0] });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const update = async (req, res) => {
  const { first_name, last_name, phone_number, birthday, male } = req.body;
  const { id } = req.params;

  try {
    const updateStudent = await pool.query(
      `UPDATE students SET first_name = $1,
          last_name = $2,
          phone_number = $3,
          birthday = $4,
          male = $5
          WHERE id = $6 RETURNING *`,
      [
        first_name,
        last_name,
        phone_number,
        birthday,
        male,
        id
      ]
    );

    res.status(200).send({ data: updateStudent.rows[0] });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const remove = async (req, res) => {
  const { id } = req.params;
  try {
    const deleteSStudent = await pool.query(
      `
        DELETE FROM students WHERE id = $1
        `,
      [id]
    );
    res.status(200).send({ message: "Student deleted!" });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

module.exports = {
  addStudent,
  getAll,
  getOne,
  update,
  remove,
};

const { sendErrorResponse } = require("../helpers/send.error.response");
const pool = require("../config/db");

const addStudentLesson = async (req, res) => {
  try {
    const { lesson_id, student_id, is_there, reason, be_paid } = req.body;
    const newStudentLesson = await pool.query(
      `
        INSERT INTO student_lesson (lesson_id, student_id, is_there, reason, be_paid)
        VALUES ($1, $2, $3, $4, $5) RETURNING *           
        `,
      [lesson_id, student_id, is_there, reason, be_paid]
    );
    console.log(newStudentLesson);

    res.status(201).send(newStudentLesson.rows[0]);
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const getAll = async (req, res) => {
  try {
    const student_lessones = await pool.query(`
        SELECT * FROM student_lesson`);
    res.status(200).send({ data: student_lessones.rows });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const getStudentLesson = await pool.query(
      `
        SELECT * FROM student_lesson WHERE id = $1`,
      [id]
    );
    res.status(200).send({ data: getStudentLesson.rows[0] });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const update = async (req, res) => {
  const { lesson_id, student_id, is_there, reason, be_paid } = req.body;
  const { id } = req.params;

  try {
    const updateStudentLesson = await pool.query(
      `UPDATE student_lesson SET lesson_id=$1, student_id=$2, is_there=$3, reason=$4, be_paid=$5 WHERE id = $6 RETURNING *`,
      [lesson_id, student_id, is_there, reason, be_paid]
    );

    res.status(200).send({ data: updateStudentLesson.rows[0] });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const remove = async (req, res) => {
  const { id } = req.params;
  try {
    const deleteSStudentLesson = await pool.query(
      `
        DELETE FROM student_lesson WHERE id = $1
        `,
      [id]
    );
    res.status(200).send({ message: "StudentLesson deleted!" });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

module.exports = {
  addStudentLesson,
  getAll,
  getOne,
  update,
  remove,
};

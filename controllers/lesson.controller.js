const { sendErrorResponse } = require("../helpers/send.error.response");
const pool = require("../config/db");

const addLesson = async (req, res) => {
  try {
    const { lesson_theme, lesson_number, group_id, lesson_date } = req.body;
    const newLesson = await pool.query(
      `
        INSERT INTO lesson (lesson_theme, lesson_number, group_id, lesson_date)
        VALUES ($1, $2, $3, $4) RETURNING *           
        `,
      [lesson_theme, lesson_number, group_id, lesson_date]
    );
    console.log(newLesson);

    res.status(201).send(newLesson.rows[0]);
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const getAll = async (req, res) => {
  try {
    const lessons = await pool.query(`
        SELECT * FROM lesson`);
    res.status(200).send({ data: lessons.rows });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const getLesson = await pool.query(
      `
        SELECT * FROM lesson WHERE id = $1`,
      [id]
    );
    res.status(200).send({ data: getLesson.rows[0] });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const update = async (req, res) => {
  const { lesson_id, student_id, is_there, reason, be_paid } = req.body;
  const { id } = req.params;

  try {
    const updateLesson = await pool.query(
      `UPDATE lesson SET lesson_id=$1, student_id=$2, is_there=$3, reason=$4, be_paid=$5 WHERE id = $6 RETURNING *`,
      [lesson_id, student_id, is_there, reason, be_paid]
    );

    res.status(200).send({ data: updateLesson.rows[0] });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const remove = async (req, res) => {
  const { id } = req.params;
  try {
    const deleteSLesson = await pool.query(
      `
        DELETE FROM lesson WHERE id = $1
        `,
      [id]
    );
    res.status(200).send({ message: "Lesson deleted!" });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

module.exports = {
  addLesson,
  getAll,
  getOne,
  update,
  remove,
};

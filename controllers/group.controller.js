const { sendErrorResponse } = require("../helpers/send.error.response");
const pool = require("../config/db");

const addGroup = async (req, res) => {
  try {
    const {
      name,
      lesson_start_time,
      lesson_continious,
      lesson_week_day,
      stage_id,
      room,
      room_floor,
      branch_id,
      lessons_quantity,
    } = req.body;
    const newGroup = await pool.query(
      `INSERT INTO "group" (
      name, 
      lesson_start_time,
      lesson_continious,
      lesson_week_day,
      stage_id,
      room,
      room_floor,
      branch_id,
      lessons_quantity)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *           
        `,
      [
        name,
        lesson_start_time,
        lesson_continious,
        lesson_week_day,
        stage_id,
        room,
        room_floor,
        branch_id,
        lessons_quantity,
      ]
    );
    console.log(newGroup.rows[0]);

    res.status(201).send(newGroup.rows[0]);
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const getAll = async (req, res) => {
  try {
    const groups = await pool.query(`
        SELECT * FROM group`);
    res.status(200).send({ data: groups.rows });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const getGroup = await pool.query(
      `
        SELECT * FROM group WHERE id = $1`,
      [id]
    );
    res.status(200).send({ data: getGroup.rows[0] });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const update = async (req, res) => {
  const {
    name,
    lesson_start_time,
    lesson_continuous,
    lesson_week_day,
    stage_id,
    room,
    room_floor,
    branch_id,
    lessons_quantity,
  } = req.body;
  const { id } = req.params;

  try {
    const updateGroup = await pool.query(
      `UPDATE group SET name = $1, name,
        lesson_start_time = $2,
        lesson_continuous = $3,
        lesson_week_day = $4,
        stage_id = $5,
        room = $6,
        room_floor = $7,
        branch_id = $8,
        lessons_quantity = $9, WHERE id = $10 RETURNING *`,
      [
        name,
        lesson_start_time,
        lesson_continuous,
        lesson_week_day,
        stage_id,
        room,
        room_floor,
        branch_id,
        lessons_quantity,
        id,
      ]
    );

    res.status(200).send({ data: updateGroup.rows[0] });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const remove = async (req, res) => {
  const { id } = req.params;
  try {
    const deleteGroup = await pool.query(
      `
        DELETE FROM group WHERE id = $1
        `,
      [id]
    );
    res.status(200).send({ message: "Group deleted!" });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

module.exports = {
  addGroup,
  getAll,
  getOne,
  update,
  remove,
};
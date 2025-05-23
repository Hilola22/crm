const { sendErrorResponse } = require("../helpers/send.error.response");
const pool = require("../config/db");

const addLid = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      phone_number,
      target_id,
      stage_id,
      test_date,
      trial_lesson_date,
      trial_lesson_time,
      trial_lesson_group_id,
      status_id,
      cancel_reason_id,
    } = req.body;
    const newLid = await pool.query(
      `
        INSERT INTO lid (
          first_name,
          last_name,
          phone_number,
          target_id,
          stage_id,
          test_date,
          trial_lesson_date,
          trial_lesson_time,
          trial_lesson_group_id,
          status_id,
          cancel_reason_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *           
        `,
      [
        first_name,
        last_name,
        phone_number,
        target_id,
        stage_id,
        test_date,
        trial_lesson_date,
        trial_lesson_time,
        trial_lesson_group_id,
        status_id,
        cancel_reason_id
      ]
    );
    console.log(newLid);
    res.status(201).send(newLid.rows[0]);
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const getAll = async (req, res) => {
  try {
    const lids = await pool.query(`
        SELECT * FROM lid`);
    res.status(200).send({ data: lids.rows });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const getOne = async (req, res) => {
  try {
    const { id } = req.params;
    const getLid = await pool.query(
      `
        SELECT * FROM lid WHERE id = $1`,
      [id]
    );
    res.status(200).send({ data: getLid.rows[0] });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const update = async (req, res) => {
  const {
    first_name,
    last_name,
    phone_number,
    target_id,
    stage_id,
    test_date,
    trial_lesson_date,
    trial_lesson_time,
    trial_lesson_group_id,
    status_id,
    cancel_reason_id,
  } = req.body;
  const { id } = req.params;

  try {
    const updateLid = await pool.query(
      `UPDATE lid SET first_name = $1,
          last_name = $2,
          phone_number = $3,
          target_id = $4,
          stage_id = $5,
          test_date = $6,
          trial_lesson_date = $7,
          trial_lesson_time = $8,
          trial_lesson_group_id = $9,
          status_id = $10,
          cancel_reason_id = $11 WHERE id = $12 RETURNING *`,
      [
        first_name,
        last_name,
        phone_number,
        target_id,
        stage_id,
        test_date,
        trial_lesson_date,
        trial_lesson_time,
        trial_lesson_group_id,
        status_id,
        cancel_reason_id,
        id
      ]
    );

    res.status(200).send({ data: updateLid.rows[0] });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

const remove = async (req, res) => {
  const { id } = req.params;
  try {
    const deleteSLid = await pool.query(
      `
        DELETE FROM lid WHERE id = $1
        `,
      [id]
    );
    res.status(200).send({ message: "Lid deleted!" });
  } catch (error) {
    sendErrorResponse(error, res);
  }
};

module.exports = {
  addLid,
  getAll,
  getOne,
  update,
  remove,
};

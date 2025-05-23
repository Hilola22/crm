const { addStudent, getAll, getOne, update, remove } = require("../controllers/students.controller");

const router = require("express").Router();

router.post("/", addStudent);
router.get("/", getAll);
router.get("/:id", getOne);
router.patch("/:id", update);
router.delete("/:id", remove);

module.exports = router;
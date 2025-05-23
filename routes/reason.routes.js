const { addReason, getAll, getOne, update, remove } = require("../controllers/reason.controller");

const router = require("express").Router();

router.post("/", addReason);
router.get("/", getAll);
router.get("/:id", getOne);
router.patch("/:id", update);
router.delete("/:id", remove);

module.exports = router;
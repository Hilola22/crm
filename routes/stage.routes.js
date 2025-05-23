const { addStage, getAll, getOne, update, remove } = require("../controllers/stage.controller");

const router = require("express").Router();

router.post("/", addStage);
router.get("/", getAll);
router.get("/:id", getOne);
router.patch("/:id", update);
router.delete("/:id", remove);

module.exports = router;
const { addStatus, getAll, getOne, update, remove } = require("../controllers/status.controller");

const router = require("express").Router();

router.post("/", addStatus);
router.get("/", getAll);
router.get("/:id", getOne);
router.patch("/:id", update);
router.delete("/:id", remove);

module.exports = router;
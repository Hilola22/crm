const { addLid, getAll, getOne, update, remove } = require("../controllers/lid.controller");

const router = require("express").Router();

router.post("/", addLid);
router.get("/", getAll);
router.get("/:id", getOne);
router.patch("/:id", update);
router.delete("/:id", remove);

module.exports = router;
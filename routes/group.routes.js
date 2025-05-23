const { addGroup, getAll, getOne, update, remove } = require("../controllers/group.controller");

const router = require("express").Router();

router.post("/", addGroup);
router.get("/", getAll);
router.get("/:id", getOne);
router.patch("/:id", update);
router.delete("/:id", remove);

module.exports = router;
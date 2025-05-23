const { addPayment, getAll, getOne, update, remove } = require("../controllers/payment.controller");

const router = require("express").Router();

router.post("/", addPayment);
router.get("/", getAll);
router.get("/:id", getOne);
router.patch("/:id", update);
router.delete("/:id", remove);

module.exports = router;
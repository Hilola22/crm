const router = require("express").Router();
const stageRouter = require("./stage.routes");
const statusRouter = require("./status.routes");
const branchRouter = require("./branch.routes");
const groupRouter = require("./group.routes");
const reasonRouter = require("./reason.routes");
const roleRouter = require("./role.routes");
const lidRouter = require("./lid.routes");
const studentsRouter = require("./students.routes");
const paymentRouter = require("./payment.routes");
const otpRouter = require("./otp.routes");

router.use("/stage", stageRouter);
router.use("/status", statusRouter);
router.use("/branch", branchRouter);
router.use("/group", groupRouter);
router.use("/reason", reasonRouter);
router.use("/role", roleRouter);
router.use("/lid", lidRouter);
router.use("/student", studentsRouter);
router.use("/payment", paymentRouter);
router.use("/otp", otpRouter);

module.exports = router;

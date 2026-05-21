const router = require("express").Router();
const oc = require("../controllers/orderController");
const { auth, adminOnly } = require("../middleware/auth");

router.use(auth);
router.post("/",           oc.placeOrder);
router.get("/my",          oc.getMyOrders);
router.get("/all",         adminOnly, oc.getAllOrders);
router.put("/:id/status",  adminOnly, oc.updateStatus);

module.exports = router;

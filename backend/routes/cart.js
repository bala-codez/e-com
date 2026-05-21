const router = require("express").Router();
const cc = require("../controllers/cartController");
const { auth } = require("../middleware/auth");

router.use(auth);
router.get("/",         cc.getCart);
router.post("/",        cc.addToCart);
router.put("/:id",      cc.updateCart);
router.delete("/clear", cc.clearCart);
router.delete("/:id",   cc.removeFromCart);

module.exports = router;

const router = require("express").Router();
const pc = require("../controllers/productController");
const { auth, adminOnly } = require("../middleware/auth");

router.get("/categories", pc.getCategories);
router.get("/",           pc.getAll);
router.get("/:id",        pc.getOne);
router.post("/",          auth, adminOnly, pc.create);
router.put("/:id",        auth, adminOnly, pc.update);
router.delete("/:id",     auth, adminOnly, pc.remove);

module.exports = router;

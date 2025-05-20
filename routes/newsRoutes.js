const express = require("express");
const router = express.Router();
const newsController = require("../controllers/newsController");
const uploadImage = require("../middlewares/uploadImage");

const newsUpload = uploadImage("uploads/news/");

router.post("/", newsUpload.single("image"), newsController.createNews);
router.get("/", newsController.getAllNews);
router.get("/:id", newsController.getNewsById);
router.put("/:id", newsUpload.single("image"), newsController.updateNews);
router.patch("/:id", newsController.updateNewsStatus);
router.delete("/:id", newsController.deleteNews);

module.exports = router;

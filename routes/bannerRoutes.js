const express = require("express");
const router = express.Router();
const bannerController = require("../controllers/bannerController");
const uploadImage = require("../middlewares/uploadImage");

const bannerUpload = uploadImage("uploads/banners/");

router.post("/", bannerUpload.single('image'), bannerController.createBanner);
router.get("/", bannerController.getAllBanner);
router.get("/:id", bannerController.getBannerById);
router.put("/:id", bannerUpload.single('image'), bannerController.updateBanner);
router.patch("/:id", bannerController.updateBannerStatus);
router.delete("/:id", bannerController.deleteBanner);


module.exports = router;
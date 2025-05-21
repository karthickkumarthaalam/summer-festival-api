const express = require("express");
const router = express.Router();
const showArtistController = require("../controllers/showArtistController");
const uploadImage = require("../middlewares/uploadImage");

const showArtistUpload = uploadImage("uploads/showArtist/");

router.post("/", showArtistUpload.single('image'), showArtistController.createShowArtist);
router.get("/", showArtistController.getShowArtists);
router.get("/:id", showArtistController.getShowArtistById);
router.put("/:id", showArtistUpload.single('image'), showArtistController.updateShowArtist);
router.delete("/:id", showArtistController.deleteShowArtist);


module.exports = router;
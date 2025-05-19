const express = require('express');
const router = express.Router();
const artistController = require("../controllers/artistController");
const uploadImage = require("../middlewares/uploadImage");

const artistUpload = uploadImage("uploads/artists/");

router.post('/', artistUpload.single('image'), artistController.createArtist);
router.get("/", artistController.getAllArtists);
router.get("/:id", artistController.getArtistById);
router.put("/:id", artistUpload.single("image"), artistController.updateArtist);
router.patch("/:id", artistController.updateArtistStatus);
router.delete("/:id", artistController.deleteArtist);

module.exports = router;
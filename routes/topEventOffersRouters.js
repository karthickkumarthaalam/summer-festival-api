const express = require("express");
const router = express.Router();
const topEventOfferController = require("../controllers/topEventOffersController");


router.post("/", topEventOfferController.createOffers);
router.get("/", topEventOfferController.getAllOffers);
router.get("/:id", topEventOfferController.getOfferById);
router.put("/:id", topEventOfferController.updateOffer);
router.patch("/:id", topEventOfferController.updateOfferStatus);
router.delete("/:id", topEventOfferController.deleteOffer);


module.exports = router;
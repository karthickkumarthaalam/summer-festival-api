const express = require("express");
const router = express.Router();
const showLineUpController = require("../controllers/showLineUpController");


router.get("/by-date", showLineUpController.getShowLineupByDate);

router.post("/", showLineUpController.createShowLineUp);
router.get("/", showLineUpController.getShowLineups);
router.get("/:id", showLineUpController.getShowLineupById);
router.put("/:id", showLineUpController.updateShowLineup);
router.patch("/:id", showLineUpController.updateShowLineupStatus);
router.delete("/:id", showLineUpController.deleteShowLineup);


module.exports = router;
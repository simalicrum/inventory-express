var express = require("express");
var router = express.Router();

var all_items_controller = require("../controllers/allitemsController");

router.get("/", all_items_controller.all_items);

module.exports = router;

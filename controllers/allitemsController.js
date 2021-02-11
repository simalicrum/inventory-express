var Item = require("../models/item");
var Catagory = require("../models/catagory");

// const { body, validationResult } = require("express-validator");

var async = require("async");

exports.all_items = function (req, res, next) {
  async.parallel(
    {
      catagory_list: function (callback) {
        Catagory.find(callback);
      },
      all_items: function (callback) {
        Item.find().populate("catagories").exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      res.render("all_items", {
        catagory_list: results.catagory_list,
        all_items: results.all_items,
      });
    }
  );
};

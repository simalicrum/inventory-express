var Catagory = require("../models/catagory");
const Item = require("../models/item");

var async = require("async");
const { body, validationResult } = require("express-validator");

exports.catagories = function (req, res, next) {
  Catagory.find().exec(function (err, all_catagories) {
    if (err) {
      return next(err);
    }
    res.render("catagories", { catagory_list: all_catagories });
  });
};

exports.catagory_detail = function (req, res, next) {
  async.parallel(
    {
      catagory_list: function (callback) {
        Catagory.find(callback);
      },
      catagory: function (callback) {
        Catagory.findById(req.params.id).exec(callback);
      },
      catagory_items: function (callback) {
        Item.find({ catagories: req.params.id })
          .populate("catagories")
          .exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      res.render("catagory_detail", {
        catagory: results.catagory,
        catagory_items: results.catagory_items,
        catagory_list: results.catagory_list,
      });
    }
  );
};

exports.catagory_create_get = function (req, res, next) {
  async.parallel(
    {
      catagory_list: function (callback) {
        Catagory.find(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      res.render("catagory_form", {
        catagory_list: results.catagory_list,
        title: "Create Catagory",
        catagory: {
          name: "",
          description: "",
        },
      });
    }
  );
};

exports.catagory_create_post = [
  body("name", "Name must not be empty.").trim().isLength({ min: 1 }).escape(),
  body("description", "Description must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    var catagory = new Catagory({
      name: req.body.name,
      description: req.body.description,
    });
    if (!errors.isEmpty()) {
      res.render("catagory_form", {
        title: "Create Catagory",
        errors: errors.array(),
      });
      return;
    } else {
      catagory.save(function (err) {
        if (err) {
          return next(err);
        }
        res.redirect(catagory.url);
      });
    }
  },
];

exports.catagory_delete_get = function (req, res) {
  async.parallel(
    {
      catagory_list: function (callback) {
        Catagory.find(callback);
      },
      catagory: function (callback) {
        Catagory.findById(req.params.id).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      res.render("catagory_delete", {
        catagory_list: results.catagory_list,
        catagory: results.catagory,
      });
    }
  );
};

exports.catagory_delete_post = function (req, res) {
  Catagory.findByIdAndRemove(req.body.catagoryid, function deleteCatagory(err) {
    if (err) {
      return next(err);
    }
    console.log("catagory_delete_post did a thing: ", req.body.catagoryid);
    res.redirect("/");
  });
};

exports.catagory_update_get = function (req, res, next) {
  async.parallel(
    {
      catagory_list: function (callback) {
        Catagory.find(callback);
      },
      catagory: function (callback) {
        Catagory.findById(req.params.id).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      res.render("catagory_form", {
        catagory_list: results.catagory_list,
        catagory: results.catagory,
        title: "Edit Catagory",
      });
    }
  );
};

exports.catagory_update_post = [
  body("name", "Name must not be empty.").trim().isLength({ min: 1 }).escape(),
  body("description", "Description must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    var catagory = new Catagory({
      name: req.body.name,
      description: req.body.description,
      _id: req.params.id,
    });
    if (!errors.isEmpty()) {
      async.parallel(
        {
          catagory_list: function (callback) {
            Catagory.find(callback);
          },
          catagory: function (callback) {
            Catagory.findById(req.params.id).exec(callback);
          },
        },
        function (err, results) {
          if (err) {
            return next(err);
          }
          res.render("catagory_form", {
            catagory_list: results.catagory_list,
            catagory: results.catagory,
            title: "Edit Catagory",
            errors: errors.array(),
          });
        }
      );
      return;
    } else {
      Catagory.findByIdAndUpdate(
        req.params.id,
        catagory,
        {},
        function (err, thecatagory) {
          if (err) {
            return next(err);
          }
          res.redirect(catagory.url);
        }
      );
    }
  },
];

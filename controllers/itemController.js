var Item = require("../models/item");
var Catagory = require("../models/catagory");
const { body, validationResult } = require("express-validator");
var async = require("async");
const { catagory_list } = require("./catagoryController");

exports.item_detail = function (req, res, next) {
  async.parallel(
    {
      catagory_list: function (callback) {
        Catagory.find(callback);
      },
      item: function (callback) {
        Item.findById(req.params.id).populate("catagories").exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      res.render("item_detail", {
        catagory_list: results.catagory_list,
        item: results.item,
      });
    }
  );
};

exports.item_create_get = function (req, res, next) {
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
      res.render("item_form", {
        catagory_list: results.catagory_list,
        title: "Create Item",
        item: {
          name: "",
          description: "",
          price: "",
          number: "",
          catagories: [results.catagory_list[0]],
        },
      });
    }
  );
};

exports.item_create_post = [
  body("name", "Name must not be empty.").trim().isLength({ min: 1 }).escape(),
  body("description", "Description must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("price", "Price must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .custom((value) => /\d*.\d\d/.test(value))
    .withMessage("Currency must be formatted correctly."),
  body("number", "Number must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("catagory.*").escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    var item = new Item({
      name: req.body.name,
      description: req.body.description,
      price: parseFloat(req.body.price),
      number: req.body.number,
      catagories: req.body.catagory,
      errors: errors.array(),
    });
    if (!errors.isEmpty()) {
      async.parallel(
        {
          catagory_list: function (callback) {
            Catagory.find(callback);
          },
          item: function (callback) {
            Item.findById(req.params.id).populate("catagories").exec(callback);
          },
        },
        function (err, results) {
          if (err) {
            return next(err);
          }
          res.render("item_form", {
            catagory_list: results.catagory_list,
            item: item,
            title: "Create Item",
          });
        }
      );
      return;
    } else {
      item.save(function (err) {
        if (err) {
          return next(err);
        }
        res.redirect(item.url);
      });
    }
  },
];

exports.item_delete_get = function (req, res) {
  async.parallel(
    {
      catagory_list: function (callback) {
        Catagory.find(callback);
      },
      item: function (callback) {
        Item.findById(req.params.id).populate("catagories").exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      res.render("item_delete", {
        catagory_list: results.catagory_list,
        item: results.item,
      });
    }
  );
};

exports.item_delete_post = function (req, res) {
  Item.findByIdAndRemove(req.body.itemid, function deleteItem(err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};

exports.item_update_get = function (req, res, next) {
  async.parallel(
    {
      catagory_list: function (callback) {
        Catagory.find(callback);
      },
      item: function (callback) {
        Item.findById(req.params.id).populate("catagories").exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      res.render("item_form", {
        catagory_list: results.catagory_list,
        item: results.item,
        title: "Edit Item",
      });
    }
  );
};

exports.item_update_post = [
  body("name", "Name must not be empty.").trim().isLength({ min: 1 }).escape(),
  body("description", "Description must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("price", "Price must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .custom((value) => /\d*.\d\d/.test(value))
    .withMessage("Currency must be formatted correctly."),
  body("number", "Number must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("catagory.*").escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    var item = new Item({
      name: req.body.name,
      description: req.body.description,
      price: parseFloat(req.body.price),
      number: req.body.number,
      catagories: req.body.catagory,
      _id: req.params.id,
    });
    if (!errors.isEmpty()) {
      async.parallel(
        {
          catagory_list: function (callback) {
            Catagory.find(callback);
          },
          item: function (callback) {
            Item.findById(req.params.id).populate("catagories").exec(callback);
          },
        },
        function (err, results) {
          if (err) {
            return next(err);
          }
          console.log("errors.array(): ", errors.array());
          res.render("item_form", {
            catagory_list: results.catagory_list,
            item: item,
            title: "Edit Item",
            errors: errors.array(),
          });
        }
      );
      return;
    } else {
      Item.findByIdAndUpdate(req.params.id, item, {}, function (err, theitem) {
        if (err) {
          return next(err);
        }
        res.redirect(theitem.url);
      });
    }
  },
];

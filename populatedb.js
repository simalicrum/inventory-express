#! /usr/bin/env node

console.log(
  "This script populates some test entries to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true"
);

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require("async");
var Item = require("./models/item");
var Catagory = require("./models/catagory");

var mongoose = require("mongoose");
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

var items = [];
var catagories = [];

function itemCreate(name, description, price, number, catagories, cb) {
  itemdetail = {
    name: name,
    description: description,
    price: price,
    number: number,
    catagories: catagories,
  };

  var item = new Item(itemdetail);

  item.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Item: " + item);
    items.push(item);
    cb(null, item);
  });
}

function catagoryCreate(name, description, cb) {
  var catagory = new Catagory({ name: name, description: description });

  catagory.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Catagory: " + catagory);
    catagories.push(catagory);
    cb(null, catagory);
  });
}

function createCatagories(cb) {
  async.series(
    [
      function (callback) {
        catagoryCreate(
          "Cats",
          "Small carnivorous mammals that sometimes act as house pets.",
          callback
        );
      },
      function (callback) {
        catagoryCreate(
          "Bicycles",
          "Two wheeled vehicles and impede traffic and terrorize pedestrians.",
          callback
        );
      },
      function (callback) {
        catagoryCreate(
          "Digital Cameras",
          "Pocket sized electronic devices that take pictures.",
          callback
        );
      },
    ],
    cb
  );
}

function createItems(cb) {
  async.series(
    [
      function (callback) {
        itemCreate(
          "Black Cat",
          "Your very own 'pocket panther'. They make great Halloween decorations.",
          "9.99",
          "18",
          catagories[0],
          callback
        );
      },
      function (callback) {
        itemCreate(
          "Siamese Cat",
          "The average house cat believes they should be treated like royalty. The siamese takes this concept and ramps it up to the next level. Feel like an intruder in your own home!",
          "1799.99",
          "2",
          catagories[0],
          callback
        );
      },
      function (callback) {
        itemCreate(
          "Tabby Cat",
          "Literally the worst pet ever. One step above a racoon. Tabby cats sleep 20 hours a day and will ruin everything you love.",
          "99.99",
          "2",
          catagories[0],
          callback
        );
      },
      function (callback) {
        itemCreate(
          "Tuxedo Cat",
          "Prim and proper. The best of the bunch.",
          "199.99",
          "1",
          catagories[0],
          callback
        );
      },
      function (callback) {
        itemCreate(
          "Hipstar Dream of the '80s Special",
          "The bicycle derailleur was invented in the 1930s but this won't stop you sticking with the good old reliable 'fixie'. Feel authentic while you struggle up every hill. Who needs knees anyway.",
          "3999.99",
          "3",
          catagories[1],
          callback
        );
      },
      function (callback) {
        itemCreate(
          "Cannondale Supersix Evo",
          "The all-new SuperSix EVO is a beautiful evolution of our classic race machine. We kept the light weight and telepathic handling of the award-winning previous version, and amplified the hell out of everything else. Smoother, more capable and much, much faster - it's built to fly.",
          "1999.99",
          "25",
          catagories[1],
          callback
        );
      },
      function (callback) {
        itemCreate(
          "Fujifilm x100v",
          "The X100V’s timeless body has top and bottom plates milled from single pieces of aluminum, which results in a refined and classic camera body with clean, attractive edges. Finished with a beautiful satin coating, the X100V is a perfect combination of design and engineering that is sure to make photographers of any level joyful as they make their images.",
          "1899.99",
          "12",
          catagories[2],
          callback
        );
      },
      function (callback) {
        itemCreate(
          "Fujifilm X100v",
          "The X100V’s timeless body has top and bottom plates milled from single pieces of aluminum, which results in a refined and classic camera body with clean, attractive edges. Finished with a beautiful satin coating, the X100V is a perfect combination of design and engineering that is sure to make photographers of any level joyful as they make their images.",
          "1899.99",
          "12",
          catagories[2],
          callback
        );
      },
      function (callback) {
        itemCreate(
          "Fujifilm X-T4",
          "Making a camera that is suitable for both photography and videography is no simple task. The X-T4 is our most powerful X Series camera to date with no compromises for stills or video. Using the 4th generation X-Trans CMOS 4 sensor, X-Processor 4, a newly developed compact in-body image stabilization (IBIS) system, new Film Simulation mode “ETERNA Bleach Bypass” and various other features that have evolved based on user feedback, this camera delivers image quality that can satisfy the demands of professional photographers and videographers.",
          "2399.99",
          "5",
          catagories[2],
          callback
        );
      },
      function (callback) {
        itemCreate(
          "Fujifilm X-S10",
          "A compact mirrorless camera body that’s packed with cutting-edge technologies to bring out your best as a photographer. The portability and power of this camera will let you connect with your subjects like never before. FUJIFILM X-S10 helps unleash your creativity to its fullest extent.",
          "1699.99",
          "8",
          catagories[2],
          callback
        );
      },
    ],
    cb
  );
}

async.series(
  [createCatagories, createItems],
  // Optional callback
  function (err, results) {
    if (err) {
      console.log("FINAL ERR: " + err);
    } else {
      console.log("This did a thing successfully.");
    }
    // All done, disconnect from database
    mongoose.connection.close();
  }
);

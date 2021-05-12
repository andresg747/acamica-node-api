// BASE SETUP
// =============================================================================

// call the packages we need
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var morgan = require('morgan');

// configure app
app.use(morgan('dev')); // log requests to the console

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = 8080; // set our port

// Bear models lives here
var Bear = require('../app/models/bear');

// ROUTES FOR OUR API
// =============================================================================

// create our router
var router = express.Router();

// middleware to use for all requests
router.use(function (req, res, next) {
  // do logging
  console.log('Something is happening.');
  next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function (req, res) {
  res.json({ message: 'hooray! welcome to our api!' });
});

const bears = [
  {
    $oid: "609c5e0bb20b6a94c89452db",
    name: "Papá Oso",
  },
  {
    $oid: "609c5e0bb20b6a94c89452dc",
    name: "Mamá Oso",
  },
]


// on routes that end in /bears
// ----------------------------------------------------
router.route('/bears')

  // create a bear (accessed at POST http://localhost:8080/bears)
  .post(function (req, res) {
    const bear = {};
    bear.name = req.body.name;  // set the bears name (comes from the request)
    bears.push(bear);
    res.json({ message: 'Bear created!' });
  })

  // get all the bears (accessed at GET http://localhost:8080/api/bears)
  .get(function (req, res) {
    res.json(bears);
  });

// on routes that end in /bears/:bear_id
// ----------------------------------------------------
router.route('/bears/:bear_id')

  // get the bear with that id
  .get(function (req, res) {
    Bear.findById(req.params.bear_id, function (err, bear) {
      if (err)
        res.send(err);
      res.json(bear);
    });
  })

  // update the bear with this id
  .put(function (req, res) {
    Bear.findById(req.params.bear_id, function (err, bear) {

      if (err)
        res.send(err);

      bear.name = req.body.name;
      bear.save(function (err) {
        if (err)
          res.send(err);

        res.json({ message: 'Bear updated!' });
      });

    });
  })

  // delete the bear with this id
  .delete(function (req, res) {
    Bear.remove({
      _id: req.params.bear_id
    }, function (err, bear) {
      if (err)
        res.send(err);

      res.json({ message: 'Successfully deleted' });
    });
  });


// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);

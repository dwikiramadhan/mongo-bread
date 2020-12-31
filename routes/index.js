var express = require('express');
var router = express.Router();

module.exports = function (db) {
  /* GET home page. */
  router.get('/', function (req, res, next) {
    res.render('pages/index', { title: 'Express' });
  });

  router.get('/add', function (req, res, next) {
    res.render('pages/add', { title: 'Express' });
  });

  router.get('/edit/:id', function (req, res, next) {
    res.render('pages/edit', { title: 'Express' });
  });
  return router;
}

// module.exports = router;

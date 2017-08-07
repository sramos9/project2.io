const express = require('express');
const router = express.Router();
const Wine = require('../models/wines.js');
const wineSeed = require('../models/seed.js');
const Post = require('../models/posts.js');


// index : GET route
router.get('/', (req, res) =>{
  Wine.find({}, (err, foundWines)=>{
    res.render('./wines/index.ejs', {
        wines: foundWines
      });
  });
});

router.post('/', (req, res) =>{
  Wine.create(req.body, (err, createdWine)=>{
    res.redirect('/wines');
  });
});


// seed data route to seed.js file
router.get('/seed', (req, res)=>{
  Wine.insertMany(wineSeed, (err, wines) =>{
      if(err) {console.log(err); } else
      {
        res.redirect('/wines');
      }
  });
});

// wine show page
router.get('/:id', (req, res)=>{
  Wine.findById(req.params.id, (err, foundWine) =>{
    console.log(foundWine);
    res.render('wines/show.ejs', {
        wine: foundWine
    });
  });
});





module.exports = router;

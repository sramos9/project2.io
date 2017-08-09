const express = require('express');
const router = express.Router();
const Wine = require('../models/wines.js');
const Post = require('../models/posts.js');
const wineSeed = require('../models/seed.js');
const bcrypt = require('bcrypt');

// POST INDEX PAGE - SESSIONS REQUIREMENT LOGIN TO SEE POSTS
router.get('/', (req, res) =>{
  console.log(req.session);
  if(req.session.logged){
    Post.find({}, (err, foundPost)=>{
      res.render('posts/index.ejs', {
          posts: foundPost
      });
    });
  } else {
    res.redirect('/sessions/login')
  }
});


// CREATE NEW POST ROUTE
router.get('/new', (req, res) =>{
  Wine.find({}, (err, allWines)=>{
    // console.log("---------------", req.session);
    res.render('posts/new.ejs', {
       wines: allWines,
       userSession: req.session
    });
  });
});



// POST NEW FROM CREATE ROUTE TO INDEX PAGE
router.post('/', (req, res)=>{
  //console.log("this is what req.body.wineId is.....", req.body.wineId);
  Wine.findById(req.body.wineId, (err, foundWine)=>{
    console.log(foundWine);
    Post.create(req.body, (err, createdPost)=>{
      foundWine.posts.push(createdPost);
      foundWine.save((err, data)=>{
        res.redirect('/posts');
      });
    });
  });
});


// GET ROUTE TO POST SHOW PAGE
router.get('/:id', (req, res)=>{
  Post.findById(req.params.id, (err, foundPost)=>{
    Wine.findOne({'posts._id':req.params.id}, (err, foundWine)=>{
      res.render('posts/show.ejs',
      {
          wine: foundWine,
          post: foundPost
      });
    });
  });
});


// DELETE POST ROUTE
router.delete('/:id', (req, res) =>{
  Post.findByIdAndRemove(req.params.id, (err, foundPost)=>{
    Wine.findOne({"posts._id":req.params.id}, (err, foundWine)=>{
      foundWine.posts.id(req.params.id).remove();
      foundWine.save((err, data)=>{
        res.redirect('/posts');
      });
    });
  });
});

// EDIT ROUTE FROM SHOW PAGE
router.get('/:id/edit', (req, res)=>{
  //console.log('***********************');
  Post.findById(req.params.id, (err, foundPost)=>{
    Wine.find({}, (err, allWines)=>{
      Wine.findOne({'posts._id':req.params.id}, (err, foundPostWine)=>{
        res.render('posts/edit.ejs', {
          post: foundPost,
          wine: allWines,
          postWine: foundPostWine
        });
      });
    });
  });
});

// router.put('/:id', (req, res)=>{
//   Post.findByIdAndUpdate(req.params.id, req.body, (err, data)=>{
//     res.redirect('/posts');
//   });
// });

// PUT EDIT ROUTE TO SEE EDIT CHANGES MADE
router.put('/:id', (req, res)=>{
  Post.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, updatedPost)=>{
    Wine.findOne({ 'posts._id' : req.params.id }, (err, foundWine)=>{
      console.log("+++++++++++++++++", req.params.id);
      if(foundWine._id.toString() !== req.body.wineId){
        foundWine.posts.id(req.params.id).remove();
        foundWine.save((err, savedFoundWine)=>{
          Wine.findById(req.body.wineId, (err, newWine)=>{
            newWine.posts.push(updatedPost);
            newWine.save((err, savedNewWine)=>{
              res.redirect('/posts/'+req.params.id);
            });
          });
        });
      } else {
        foundWine.posts.id(req.params.id).remove();
        foundWine.posts.push(updatedPost);
        foundWine.save((err, data)=>{
          res.redirect('/posts/'+req.params.id);
        });
      }
    });
  });
});




module.exports = router;

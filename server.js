const express 				= require('express');
const app 						= express();
const mongoose 				= require('mongoose');
const bodyParser 			= require('body-parser');
const methodOverride 	= require('method-override');

//middleware
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended:false}));


const winesController = require('./controllers/wines.js');
app.use('/wines', winesController);

const postsController = require('./controllers/posts.js');
app.use('/posts', postsController);

app.get('/', (req, res)=>{
  res.render('index.ejs');
})



// mongoose
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/winesite'
mongoose.connect(mongoUri);
mongoose.connection.once('open', ()=>{
	console.log('connected to mongo');
});


// listen port
const port = process.env.PORT || 3000;
app.listen(port, ()=>{
	console.log('listening....');
});

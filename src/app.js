const express = require("express");
const hbs = require("hbs");
const path = require("path");
const bcrypt = require("bcrypt");
const app = express();
const auth = require('./auth');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const User = require('../models/User');

app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({extended:false}));

// Middleware Definition
app.use('/css', express.static(path.join(__dirname, "../node_modules/bootstrap/dist/css/")));
app.use('/js', express.static(path.join(__dirname, "../node_modules/bootstrap/dist/js/")));
app.use('/jquery', express.static(path.join(__dirname, "../node_modules/jquery/dist/")));

app.get('/', (req,res) => {
	res.render("index.hbs");
});

app.post('/register', async (req,res) => {
	const {name,phone,email,password} = req.body;
	const user = new User({
		name:name,
		phone:phone,
		email:email,
		password:password
	});
	const token = await user.generateToken();
	await user.save();

	// Store the cookie
	res.cookie("jwt", token, {httpOnly:true});
	res.status(201).send(`Hello ${name}, You are succesfully registered with us now !`)
});

app.get('/login', (req, res) => {
	res.render("login.hbs");
});

app.post('/login', async (req, res) => {
	try{
		const password = req.body.password;
		const name = req.body.name;
		const user = await User.findOne({name:name});
		const isMatch = await bcrypt.compare(password, user.password);
		console.log(isMatch)
		const token = await user.generateToken();
		if(isMatch){
			res.send("Login succesful");
		}else{
			res.send("Login unsuccesful");
		}
	}catch(err){
		console.log(err);
	}
});

app.get('/secret',auth,(req, res) => {
	console.log(`The cookie is ${req.cookies.jwt}`)
	res.send("Shh... This is a top secret page !");
});

app.listen(3000, ()=>{
	console.log("http://localhost:3000/");
});
const jwt = require("jsonwebtoken");
const User = require('../models/User');

const auth = async function(req, res, next){
	try{
		const token = req.cookies.jwt;
		const verify = jwt.verify(token, "IshanIsAGoodBoy");
		const user = await User.findOne({_id:verify._id});
		next();
	}catch(err){	
		res.status(400).send(err)
	}
} 
module.exports = auth;
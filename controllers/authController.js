const User = require("../models/UserModel");

const cookieParser = require("cookie-parser");

const jwt = require("jsonwebtoken");
//handel errors
const handelErrors = (err)=>{

    console.log("errors from handelErrors ==> "+err.message,err.code);

    let errors = {email:"",password:""};

    //incorrect email
    if(err.message==="Incorrect email")
    {
        errors.email ="User is not registered"


    }

    //incorrect password
    if(err.message==="Incorrect password")
    {
        errors.password="Password is incorrect"

        
    }
    //duplicate error code

    if (err.code ===11000)
    {
        errors.email = "This email is already registered";
        return errors;
    }

    //validation errors
    if(err.message.includes("user validation failed"))
    {
        Object.values(err.errors).forEach(({properties})=>{

            errors[properties.path] = properties.message;


        })
    }

    return errors;

}


//create jwt tokens
const maxAge=3*24*60*60; //max Age of jwt token in sec
const createToken =(id)=>{
return jwt.sign({id},"vaibhav @3000",{
    expiresIn:maxAge
})

}


module.exports.signup_get = (req,res)=>{
    res.render("signup");
}

module.exports.login_get = (req,res)=>{
    res.render("login");
}

module.exports.signup_post = async (req,res)=>{
    const {email, password} = req.body;

    try { 
     const user = await User.create({email, password});
    const token = createToken(user._id);

    res.cookie("jwt",token,{httpOnly:true, maxAge:maxAge*1000});

     res.status(201).json({user:user._id});

    }
    catch(err)
    {
        const errors = handelErrors(err);
        
        res.status(400).json({errors});
    }

}

module.exports.login_post = async (req,res)=>{
    
const {email, password} = req.body;
try {

    const user = await User.login(email,password);

    const token = createToken(user._id);

    res.cookie("jwt",token,{httpOnly:true, maxAge:maxAge*1000});

    res.status(200).json({user:user._id});

    
} catch (error) {

    
    const errors = handelErrors(error);
    res.status(400).json({errors});
    console.log("Error in login POST method ==> "+error);
    
}



}

module.exports.logout_get = (req,res)=>{
   
    res.cookie("jwt","",{maxAge:1});
    res.redirect("/");
}
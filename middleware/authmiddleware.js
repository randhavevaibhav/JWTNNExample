const jwt = require("jsonwebtoken");

const User = require("../models/UserModel")

const reuireAuth = (req,res,next)=>{
    
    const token = req.cookies.jwt;

    //check jwt token exist and it is verified

    if(token)
    {
        jwt.verify(token,"vaibhav @3000",(err,decodedToken)=>{
            if(err)
            {
               console.log("Error in JWT token compare ==> "+err);
               res.redirect("/login");
            }
            else{
                console.log("Decoded Token in JWT compare ==> "+decodedToken);
                next();
            }

        })

    }
    else{
        res.redirect("/login");
    }

}

//check current user

const checkUser =  (req,res,next)=>{
    const token = req.cookies.jwt;

    if(token)
    {
        jwt.verify(token,"vaibhav @3000",async (err,decodedToken)=>{
            if(err)
            {
               console.log("Error in JWT token compare ==> "+err);
               res.locals.user=null;
               next();
            }
            else{
                let user = await User.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }

        })

    }
    else{
        res.locals.user=null;
        next();

    }


}

module.exports = {reuireAuth,checkUser};
exports.userIdCheck = redirectLogin = (req, res, next) => {
    if(!req.session.userId){
        res.redirect("/login");
    }
    else{
        next();
    }
}
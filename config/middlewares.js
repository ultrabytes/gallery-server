const jwt = require('jwt-simple');
var User = require('../app/models/user');
module.exports = function (app) {

    return {
    		auth: function (req, res, next) {


                var token = req.headers.token || req.body.token || req.params.token || req.query.token;

                req.token = token;

                var decoded = jwt.decode(token, process.env.SECRET);

                req.user = decoded;

                User.findOne({_id:decoded._id},function(err,user){

                    if (err || !user) {
                        res.statusCode = 401;
                        return res.end();
                    }

                    req.user = user;

                    next();
                });


        	}
    };
};
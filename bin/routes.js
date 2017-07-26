const jwt = require('jwt-simple');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const http = require('http');
const mongoose = require('mongoose');
const fs = require('fs');


const User = require("../app/models/user");
const Media = require("../app/models/media");

module.exports = function (app,router) {


    var route = router();

    const middlewares = require("../config/middlewares")(app);


	route.get('/', function(req, res){

	   res.api( {ver: '1.0.1'} );
	});

	route.post('/auth/login',function(req, res) {


		User.findOne({email:req.body.email},function(err,user){

		    if(user){
                bcrypt.compare(req.body.password, user.password, function(err, r) {

                    if(r){
                        var userObject = user.toObject();
                        delete userObject.password;
                        var empJson = {
                            email:userObject.email,
                            _id:userObject._id
                        };
                        var token = jwt.encode(empJson,process.env.SECRET);
                        userObject.token = token;
                        return res.api({user:userObject});

                    }else{
                        return res.error("User not Authorized.",401);
                    }


                });

            }else{
		        return res.error("User not exists.",404);

            }


		});



    });

	route.post("/auth/register",function(req,res){

        User.findOne({email:req.body.email},function(err,user){

            if(user){
                return res.error("User already Exists.",400);
            }

            bcrypt.genSalt(saltRounds, function(err, salt) {

                bcrypt.hash(req.body.password, saltRounds, function(err, hash) {

                    User.create({email:req.body.email,password: hash},function(err,o){

                        if(err){
                            return res.api({error: err});

                        }
                        
                        var userObject = o.toObject();

                        delete userObject.password;

                        return res.api({user:userObject});



                    });

                });
            });


        });




	});

    route.post("/upload", middlewares.auth,function(req,res){
  
	    var user_id = req.user._id;

        if (!req.files)

             return res.error("No files were uploaded.",400);

           var image = req.files.image;

           var imageName = (new Date()).getTime() + '-' + image.name;

            image.mv('./uploads/'+imageName, function(err) {
                if (err)
                    return res.status(500).send(err);

                Media.create({user_id:req.user._id,picture:imageName },function(err,o){

                    if(err){
                        return res.error(err,400);

                    }
                    return res.api({media:o});

                });
                  
            });

    });

    route.get("/gallery", middlewares.auth,function(req,res){

        Media.find({user_id:req.user._id},function(err,o){

            if(err){
                return res.error(err,400);
            }

            return res.api({media:o});

        });

    }).get("/gallery/:id", middlewares.auth,function(req,res){



        Media.findOne({_id:req.params.id,user_id:req.user._id},function(err,o){

            if(err){
                return res.error(err,400);
            }

            fs.readFile('uploads/'+o.picture, function(err, data) {

                if(err){
                    return res.error(err,500);
                }
                res.writeHead(200, {'Content-Type': 'image/jpeg'});

                return res.end(data);

            });

         
        });

    });


    route.get("/get-random-image",function(req,res){

        http.get("http://www.splashbase.co/api/v1/images/random", function(resp){
            
            resp.on('data', function(chunk){
                return res.api({image:chunk.toString()});
            });

        }).on("error", function(e){
            return res.error(e,400);
        });


    });



    app.use('/', route);
	
}
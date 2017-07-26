const extend = require('util')._extend

module.exports = function (req,res,next) {
	

	res.api = function (data, code) {
	
		var resData = extend({
			status: code || 200,
			statusText: 'OK'
		}, data);

		res.json(resData);

	};

    res.validationError  = function( errors ){


    	res.statusCode = 422;
    	res.statusText = 'Unprocessable entity.';
        res.json(errors);

    };

	res.error = function( statusText, code){

        var resData = {
            status: code || 400,
            statusText: statusText || res.statusText || 'Bad Request'
        };

        res.json(resData);

	};
	

	return next();
};
const assert = require('assert');

function output(done){
		return function(err, res){ 
	    	if (err || !res) {
	    	       console.log('Oh no! error');
	    	       console.log(err);
	    	     } else {
	    	       console.log('yay got ', res.body);
	    	       // console.log('yay got ' + JSON.stringify(res.body));
	    	     }
	    	 done();
	    	 }
	}

function resIsArray(res) {
	assert.equal(Array.isArray(res.body.data), true);
}

function notPermitted(res) {
	assert.equal(res.body.err, 'not permitted');
}



module.exports = {
	output,
	resIsArray,
	notPermitted
}
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

// set up body parser
app.use(bodyParser.json());

/*
app.get("/", function(req, res) {
	var contents = "test"
	var html = '<html>\n<body>\n' + contents + '</body>\n</html>';
	res.send(html);
});
*/

app.post('/lcs', function(req, res) {
	// send request for LCS of set of strings
	//console.log(req.body);
	// {"setOfStrings":[{"value":"comcast"},{"value":"communicate"},{"value":"commutation"}]}
	
	var strSet = new Set();

	var jsonObj = JSON.parse(JSON.stringify(req.body));

	var setOfStrings;

	// 400 - bad request
	// 422 - unprocessable entity
	// 200 - ok


	if (Object.keys(jsonObj).length === 0) {
		// empty body
		res.status(400).send("The format of the request was not acceptable.");
	}
	else {
		if (jsonObj.hasOwnProperty('setOfStrings')) {
			setOfStrings = jsonObj['setOfStrings'] // array of objects 
			if (setOfStrings.length === 0) {
				res.status(422).send("setOfStrings should not be empty.")
			}
			//console.log("setofstrings" + JSON.stringify(setOfStrings));
		}
		else {
			// incorrect format
			res.status(400).send("The format of the request was not acceptable.");
		}
	}

	//var check = checkBody(jsonObj, strSet);

	var check = checkBody(setOfStrings, strSet);

	// incorrect format
	if (check === 0) {
		res.status(400).send("The format of the request was not acceptable.");
	}
	// not a set
	else if (check === 1) {
		res.status(422).send("setOfStrings must be a set.");
	}
	else { // conditions met
		//console.log("lcs");
		var strs = Array.from(strSet);
		res.status(200).send(lcs(strs));
	}
	
});

// function to determine lcs and return in proper format
function lcs(strs) {
	var n = strs.length;
	var first = strs[0];
	var len = first.length;
	var lcs = [];
	var glen = 0; 
	
	// take all substrings 
	for (var i = 0; i < len; i++) {
		for (var j = i + 1; j <= len; j++) {
			//take all substrings of first word
			var sub = first.substring(i, j);
			// check if sub in all other words
			var c = 1;
			for (c = 1; c < n; c++) {
				if (!strs[c].includes(sub)) { // if not in other word, break
					break;
				}
				
			}
			// check if all words contained sub and longest substring
			if (c == n) {
				if (sub.length > glen) {
					lcs = []; // get rid of old word(s)
					lcs.push(sub);
					glen = sub.length;	// change greatest length			
				}
				else if (sub.length === glen) {
					lcs.push(sub); // add to array
				}
				
				//console.log("i: "+i+ "\nj:" + j + "\nlcs:" + lcs);
			}
		}
	}

	// return lcs in correct format
	
	var ans = new Object();

	// check if lcs more than one word or no words
	if (lcs.length > 1) {
		//console.log(lcs);
		lcs.sort(); // sort in alphabetical order

		var mult = [];

		for (var v in lcs) {
			//console.log(lcs[v]);
			var val = new Object();
			val.value = lcs[v];
			mult.push(val);
		}
		ans = {"lcs":mult};
	}
	else if (lcs.length === 1) { // only one lc
		var val = new Object();
		val.value = lcs[0];
		ans = {"lcs":val};
	}
	else { // no lcs
		var val = {"value": ""};
		ans = {"lcs": val};
	}
	
	return ans;
}

// function to check body request has proper formatting
function checkBody(jsonObj, strSet) {
	//console.log(jsonObj);
	for (var i = 0; i < jsonObj.length; i++) {
		//console.log(jsonObj[i]);
		//console.log(jsonObj[i]['value']);
		// check if property is 'value'
		if (jsonObj[i].hasOwnProperty('value')) {
			// check if in set
			if (strSet.has(jsonObj[i]['value'])) {
				return 1; // not a set
			}
			else { // add to set
				strSet.add(jsonObj[i]['value']);
			}
		}
		else { // property is not 'value'
			return 0; // incorrect format
		}
	}
	// successfully added all words to set
	return 2;
}


app.listen(3000, function() {
    console.log('App listening at http://localhost:3000');
});




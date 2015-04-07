var express = require('express');
var bodyParser = require('body-parser');
var redis = require('redis');
var url=require('url');
var client = redis.createClient();
var bases=require('bases');
var app = express();

app.use(express.static('public'));
//var resultArray;
//var obj='{}';

var num=479890;
//var gameArray = ["rock", "paper", "scissors", "lizard", "spock"];
//var resultJSON = JSON.parse(resultArray);
//obj["479890"]="http://google.com";
//resultArray.push(obj);
//console.log(resultArray);
app.use(bodyParser.urlencoded({
    extended: false
}));

client.on('error', function(error)
{
    console.log("Error " + error);
});

client.exists('counter', function(err, reply) {
	 if (reply != 1) {
		{
			client.set('counter', 479890);
		}
	}
});


//console.log(bases.toBase36(479891));

app.post('/request', function(req,res) {
	var link=req.body.link;
	
	var counter;
	parseurl=url.parse(link).pathname;
	console.log("parse url "+parseurl);
	console.log(parseurl.slice(1));
	
	client.exists(link, function(err, reply) {


    if (reply === 1) {
    	client.get(link, function(err, reply) {
    		res.send("Already Created <br/> http://localhost:3000/"+reply);
    		//res.send(reply);
    	});
    }
    else {
        //console.log('doesn\'t exist');
        client.get('counter', function(err, reply) {
		counter=reply;
	var shorturl=bases.toBase36(counter);
	console.log(shorturl);
	client.set(link,shorturl);
	client.set(shorturl,link);
	client.set('counter', Number(counter)+1);

	res.send("http://localhost:3000/"+ shorturl);
	});

    }
	});
	
	/*
	client.get(link, function(err, reply) {

			//console.log("short link  " + reply);
			//res.send("http://localhost:3000/"+shorturl);
	});

	client.get(shorturl, function(err, reply) {
			console.log("Ori link "  + reply);
	});
	*/
});

app.listen(3000);

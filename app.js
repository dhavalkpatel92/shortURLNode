var express = require('express');
var bodyParser = require('body-parser');
var redis = require('redis');
var client = redis.createClient();
var bases=require('bases');
var url=require('url');
var app = express();
app.use(express.static('public'));
var num=479890;
app.use(bodyParser.urlencoded({
    extended: false
}));

client.on('error', function(error)
{
    console.log("Error " + error);
});

client.exists('counter', function(err, reply) {
	if (reply != 1) {
		client.set('counter', 479890);
	}
});


//console.log(bases.toBase36(479891));

app.post('/request', function(req,res) {
	var link=req.body.link;
	var parseurl=url.parse(link).pathname.slice(1);
	var hostname=url.parse(link).hostname;
	if(hostname=="localhost")
	{
		client.exists(parseurl, function(err, reply) {
			if (reply === 1) {
				client.get(parseurl, function(err, reply) {
    				//res.send("Already Created <br/> http://localhost:3000/"+reply);
    				res.send(reply);
    			});
			}
			else
			{
				res.send("URL not found");
			}
		});

	}
	else
	{
	//console.log("parse_url"+parseurl);     
	//console.log("hostname"+url.parse(link).hostname);
	var counter;

	client.exists(link, function(err, reply) {
    if (reply === 1) {
    	client.get(link, function(err, reply) {
    		res.send("Already Created <br/> http://localhost:3000/"+reply);
    		//res.send(reply);
    	});
    } else {
        //console.log('doesn\'t exist');
        client.get('counter', function(err, reply) {
		counter=reply;
	var shorturl=bases.toBase36(counter);
	//console.log(shorturl);
	client.set(link,shorturl);
	client.set(shorturl,link);
	client.set('counter', Number(counter)+1);

	res.send("http://localhost:3000/"+ shorturl);
	});

    }
	});
	}
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
app.route("/:url").all(function(req, res) {
	 var url = req.params.url;
	 //console.log(url);
	 client.exists(url, function(err, reply) {
    if (reply === 1) {
    	client.get(url, function(err, reply) {
    		res.status(301);
            res.set("Location", reply);
            res.send();
    	});
    } else {
    	res.send("URL not found");
    }
});
});
app.listen(3000);

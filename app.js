var express = require('express');
var bodyParser = require('body-parser');
var redis = require('redis');
var client = redis.createClient();
var bases = require('bases');
var url = require('url');
var app = express();
app.use(express.static(__dirname + '/public', {
    maxAge: 20
}));
//var num = 479890;
app.use(bodyParser.urlencoded({
    extended: false
}));

client.on('error', function(error) {
    console.log("Error " + error);
});

client.exists('counter', function(err, reply) {
    if(err)console.log(err);
    if (reply != 1) {
        client.set('counter', 479890);
    }
});
app.post('/request', function(req, res) {
    var link = req.body.link;
    var parseurl = url.parse(link).pathname.slice(1);
    var hostname = url.parse(link).hostname;
    if (hostname == "localhost") {
        client.exists(parseurl, function(err, reply) {
            if(err)console.log(err);
            if (reply === 1) {
                client.get(parseurl, function(err, reply) {
                  if(err)console.log(err);
                    res.send(reply);
                });
            } else {
                res.send("URL not found");
            }
        });

    } else {
        var counter;
        client.exists(link, function(err, reply) {
            if(err)console.log(err);
            if (reply === 1) {
                client.get(link, function(err, reply) {
                    if(err)console.log(err);
                    res.send("Already Created <br/> http://localhost:3000/" + reply+"<br/>");
                });
            } else {
                client.get('counter', function(err, reply) {
                    if(err) console.log(err);
                    counter = reply;
                    var shorturl = bases.toBase36(counter);
                    client.set(link, shorturl);
                    client.set(shorturl, link);
                    client.set('counter', Number(counter) + 1);
                    res.send("http://localhost:3000/" + shorturl);
                });

            }
        });
    }
});
app.route("/:url").all(function(req, res) {
    var url = req.params.url;
    client.exists(url, function(err, reply) {
        if(err)console.log(err);
        if (reply === 1) {
            client.get(url, function(err, reply) {
                                if(err)console.log(err);
                client.zincrby('views', 1, url);
                res.status(301);
                res.setHeader("Cache-Control", "no-cache");
                res.set("Location", reply);
                res.send();
            });
        } else {
            res.send("URL not found");
        }
    });
});
app.get('/result/urls', function(req, res) {
    console.log("inside"+req.url)
    client.zrevrangebyscore('views', "+inf", 0, "limit", 0, 10, function(err, members) {
        if(err)console.log(err);
        res.send(members);
    });
});
app.listen(3000);
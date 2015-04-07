var express = require('express');
var bodyParser = require('body-parser');
var redis = require('redis');
var client = redis.createClient();
var bases = require('bases');
var url = require('url');
var app = express();
app.use(express.static(__dirname + '/public', { maxAge: 20 }));
var num = 479890;
app.use(bodyParser.urlencoded({
    extended: false
}));

client.on('error', function(error) {
    console.log("Error " + error);
});

client.exists('counter', function(err, reply) {
    if (reply != 1) {
        client.set('counter', 479890);
    }
});


//console.log(bases.toBase36(479891));

app.post('/request', function(req, res) {
    var link = req.body.link;
    var parseurl = url.parse(link).pathname.slice(1);
    var hostname = url.parse(link).hostname;
    if (hostname == "localhost") {
        client.exists(parseurl, function(err, reply) {
            if (reply === 1) {
                client.get(parseurl, function(err, reply) {
                    //res.send("Already Created <br/> http://localhost:3000/"+reply);
                    res.send(reply);
                });
            } else {
                res.send("URL not found");
            }
        });

    } else {
        //console.log("parse_url"+parseurl);     
        //console.log("hostname"+url.parse(link).hostname);
        var counter;

        client.exists(link, function(err, reply) {
            if (reply === 1) {
                client.get(link, function(err, reply) {
                    res.send("Already Created <br/> http://localhost:3000/" + reply);
                    //res.send(reply);
                });
            } else {
                //console.log('doesn\'t exist');
                client.get('counter', function(err, reply) {
                    counter = reply;
                    var shorturl = bases.toBase36(counter);
                    //console.log(shorturl);
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
    //console.log(url);
    client.exists(url, function(err, reply) {
        if (reply === 1) {
            //console.log("here");
            client.get(url, function(err, reply) {
                
                client.zincrby('views', 1, url);
                res.status(301);
                res.setHeader("Cache-Control", "no-cache");
                res.set("Location", reply);
                res.send();
            });
        } else {
            console.log("hsdfsd");
            res.send("URL not found");
        }
    });
});

client.keys('*', function(err, keys) {
    if (err) return console.log(err);

    for (var i = 0, len = keys.length; i < len; i++) {
        var hostname = url.parse(keys[i]).hostname;
        if (hostname === null && keys[i] != 'counter') {
           // console.log(keys[i]);
        }
    }
});

app.get('/result/urls', function(req, res) {
    //var members=[];
client.zrevrangebyscore('views', "+inf", 0, "limit", 0, 10,function(err, members) {
        console.log(members);
        res.send(members);
});
});
/*
client.hmset("hosts", "mjr", "91");
client.hmset("hosts","another", "23", "home", "1234");

//client.zincrby("hosts", 1, "mjr");
//client.zincrby("hosts", 1, "mjr");
client.hgetall("hosts", function (err, obj) {
    console.dir(obj);
});
*/
app.listen(3000);
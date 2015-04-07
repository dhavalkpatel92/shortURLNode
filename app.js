var express = require('express');
var bodyParser = require('body-parser');
var redis = require('redis');
var client = redis.createClient();

var app = express();

app.use(express.static('public'));
var resultArray = '{"outcome":"result","wins":0,"losses":0,"ties":0}';
//var gameArray = ["rock", "paper", "scissors", "lizard", "spock"];
//var resultJSON = JSON.parse(resultArray);

app.use(bodyParser.urlencoded({
    extended: false
}));

client.on('error', function(error)
{
console.log("Error " + error);

});


app.post('/linksubmit', function(req,res) {
    //console.log('here');
    /*
    client.set('vege','Onion'­,redis.print);
    client.get('vege',function(error­,value)
    {
    if(error)
    {
    throw error;
    }
    console.log('The vegetable is = '+ value);

    });
    */
    console.log(req.body.link);
    res.write(req.body.link);
    res.end();
    //res.json(resultJSON);
    //console.log(resultJSON);
})

app.listen(3000);

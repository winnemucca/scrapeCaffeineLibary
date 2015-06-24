var express = require('express');
var bodyParser = require('body-parser');
var cheerio = require('cheerio');
var fs = require('fs');
var request = require('request');
var Xray = require('x-ray');
var path = require('path');
var childProcess = require('child_process');
var phantomjs = require('phantomjs');
var binPath = phantomjs.path;
var fs = require('fs');


var phantom=require('node-phantom-simple');
phantom.create(function(err,ph) {
  return ph.createPage(function(err,page) {
    return page.open("http://www.caffeineinformer.com/the-caffeine-database", function(err,status) {
      console.log("opened site? ", status);
      page.includeJs('http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js', function(err) {
        //jQuery Loaded.
        //Wait for a bit for AJAX content to load on the page. Here, we are waiting 5 seconds.
        setTimeout(function() {
        	// var tableData =[];
          return page.evaluate(function() {
            //Get what you want from the page using jQuery. A good way is to populate an object with all the jQuery commands that you need and then return the object.
            
            var nameArray = [];
           

            $("tbody[role='alert'] tr").each(function(data){
            	  var json = {};
            	  json.name= $(this).children(':first-child').find('a').text();
            	  json.size= $(this).children(':nth-child(2)').text();
            	  json.caffeine= $(this).children(':nth-child(3)').text();
            	  json.mgFloz=$(this).children(':last-child').text();
                json.url=$(this).children(':first-child').html();
                json.url=$(this).children(':first-child').find('a').attr('href');


            	nameArray.push(json);
            });

          	// return tableData;
	            return nameArray;
         
          }, function(err,result) {
          		// var name,size,caffeine,mgFloz;
          		// var json= {name:"",size:"",caffeine:"",mgFloz:""};
            console.log(result);

            fs.writeFile('caffeineList.json',JSON.stringify(result,null,4),function(err){
            	console.log('file successfully written')
            });
            

            ph.exit();
          });
        }, 5000);
      });
    });
  });
});







// var x = Xray();


// var target = "http://www.caffeineinformer.com/the-caffeine-database";
// request(target,function(error,response,body){
// 		if(!error && response.statusCode ===200){
// 			var $ = cheerio.load(body);
// 			 normalizeWhitespace: true
// 			// console.log(body);
// 			var href, name, fluidOunces,caffeineLevel, mgFl;

// 			var json = {href:"",name:"",fluidOunces:"",caffeineLevel:"",mgFl:""};
// 			// console.log($('tbody').children());

			

// 			$(".main, div:nth-child(3), tbody ").filter(function(tbldata){
// 				var data = $(this).prev().text();
// 				// console.log(data.length);
// 			})

// 			$(".main ,tr").each(function(){
// 				var data = $(this).prev().text();
// 				// console.log(data);
// 			})

// 			// $(".main, div:nth-child(6)").each(function(tr){
// 			// 	// console.log('main');
// 			// 	// var data = $(this).children().text();
// 			// 	var data3 = $(this).children().text();
// 			// 	var data = $(this).children().text();
// 			// 	var data2= $(this).children().length;
// 			// 	// console.log('data2',data2);
// 			// 	// console.log('data',data);
// 			// 	console.log('data3',data3)
// 			// })

			

// 		}
	// })


var app = express();
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function(req, res) {
	res.render('index');
});

var server = app.listen(9327, function() {
	console.log('Express server listening on port ' + server.address().port);
});

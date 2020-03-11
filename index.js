var xlsx = require('node-xlsx').default;
var fs  = require('fs')
var Crawler = require("crawler");
let data = []
let start = 0
var c = new Crawler({
    maxConnections : 10,
    // This will be called for each crawled page
    callback : function (error, res, done) {
        if(error){
            console.log(error);
        }else{
            var $ = res.$;
            // $ is Cheerio by default
            //a lean implementation of core jQuery designed specifically for the server
            const booklist = Object.values($('.article').find('.item'))
            // console.log(booklist)
            booklist.forEach((element,index) => {
                const el =  $.load(element)
                if(el('.pl2 a').attr('title')){
                    let row = []
                    row.push(el('.pl2 a').attr('title'))
                    row.push(el('.pl2 a').attr('href'))
                    row.push(el('.pl').text())


                   data.push(row)
                }

                    
            });
            
        }
        done();
    }
});
c.on('drain',function(){
    // For example, release a connection to database.
    var buffer = xlsx.build([{name: "book250", data: data}]); // Returns a buffer

    fs.writeFileSync('./book250.xlsx',buffer,"binary");

});


    // c.queue(`http://book.douban.com/top250?start=${0}`);

for(;start<250;start=start+25){
    c.queue(`http://book.douban.com/top250?start=${start}`);
}




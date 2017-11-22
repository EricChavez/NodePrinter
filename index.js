var printer = require('printer'),
    util = require('util');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(function (req, res, next) {
    //Enabling CORS 
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization');
    next();
});

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

var server = app.listen(process.env.PORT || 50, function () {
    var port = server.address().port;
    console.log('App now running on port', port);
});


app.get('/printers', (req, res) => {
    res.send({
        printers: printer.getPrinters()            
    });
});


app.get('/defprinter', (req, res) => {
    res.send({
        printers: (printer.getDefaultPrinterName() || 'is not defined on your computer')
    });
});

app.get('/getsupportedformats', (req, res) => {
    console.log(printer.getSupportedPrintFormats());
    res.send({
        printers: printer.getSupportedPrintFormats()
    });
});


app.get('/getsupportedjobcommands', (req, res) => {
    console.log(util.inspect(printer.getSupportedJobCommands(), {colors:true, depth:10}));
    res.send({        
        printers: printer.getSupportedJobCommands()
    });
});


app.post('/printfile', (req, res) => {
    console.log(req.body);
    var printername=req.body.printer;
    var filename=req.body.filename;
    console.log('platform:', process.platform);
    console.log('try to print file: ' + filename);
    console.log('try to print file: ' + filename);
    if( process.platform != 'win32') {
        var printer = require('printer')
        printer.printFile({filename:filename,
          printer:printer ,
          type:'TEXT',
           // printer name, if missing then will print to default printer process.env[3]
          success:function(jobID){
            console.log("sent to printer "+printer+" with ID: "+jobID);
            res.status(200).send({mesage:"sent to printer "+printer+" with ID: "+jobID});
          },
          error:function(err){
            console.log(err);
            res.status(400).send({mesage:err});
          }
        });
      }

      else {
        var printer = require('printer')
        // not yet implemented, use printDirect and text
        var fs = require('fs');
        printer.printDirect({data:fs.readFileSync(filename),
          printer:printername ,
          type:'TEXT', // printer name, if missing then will print to default printer  process.env[3]
          success:function(jobID){
            console.log("sent to printer "+printername+" with ID: "+jobID);
            res.status(200).send({mesage:"sent to printer "+printername+" with ID: "+jobID});
          },
          error:function(err){
              console.log(err);
            res.status(400).send({mesage:err});
          }
        });
      }


});

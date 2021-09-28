import escpos from 'escpos';
import Handlebars from 'handlebars';

//TODO
//view https://www.npmjs.com/package/escpos
//If you are reading this and you own an old esc-pos compatiple printer, can you please help me testing this or sending me a very cheap printer?
//Thanks a lot! If you want to contact me, write an email to matteo.gheza07@gmail.com

/*
var escpos = require('escpos');
escpos.Network = require("escpos-network");
escpos.Console = require("escpos-console");

const device  = new escpos.Network('localhost');
const device_console = new escpos.Console();

const printer = new escpos.Printer(device);

device.open(function(error){
  printer
  .font('a')
  .align('ct')
  .style('bu')
  .size(1, 1)
  .text('The quick brown fox jumps over the lazy dog')
  .barcode('1234567', 'EAN8')
  .cut("full")
  .close();
});
*/
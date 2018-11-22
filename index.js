var Zip = require('node-7z-forall'); 
var myTask = new Zip();
var rimraf = require('rimraf');
var fs = require('fs');
var _ = require('lodash');
var find = require('find');
var copydir = require('copy-dir');
var zipdir = require('zip-dir');

var inputPath = './input';
var output = './output';

fs.readdir(inputPath, function(err, items) {
    _.each(items,function(file){
        var src = inputPath + "/" + file;
        var dest = output + "/" + file.split('.zip')[0];
        extractZip(src,dest);
    });
});


function extractZip(src, dest){
  myTask.extractFull(src, dest)
  .progress(function (files) {
    var zipfilepath = files.filter(function (value) {
      return value.includes(".zip");
    });
    var source = zipfilepath.toString();
    if(source){
      var destination = source.split('.zip')[0];
      source = dest + "/" + source;
      destination = dest + "/" + destination;
      extractContent(source.trim(), destination.trim(),dest);
    }
  })
  .then(function () {
    console.log('First level Extraction is Done!!');
  })
  .catch (function (err) {
  });
}


function extractContent(contentPath, location,finalECARPath)
{
  myTask.extractFull(contentPath.trim(), location.trim())
    .progress(function (files) {
      rimraf(contentPath.trim(), function () { console.log('Directory deleted!!!'); }); 
       fs.readdir(location, function(err, items) {
         var assetsPath = items.filter(function (value) {
          return value.includes("assets");
        });
        fs.readdir(location + "/" + assetsPath, function(err, files) {
            var temp = files.filter(function (value) {
            return value.includes("content-plugins");
          });
          var dirName = location + "/" + assetsPath + "/" + temp[0];
          copydir.sync('./assets', dirName);
        });
      }); 
      var arr = location.split('/');
      var result = location.replace("/" + arr.pop(),'');
      zipdir(result.trim(), { saveTo: result.trim() + "/"+ arr.pop() +".zip"}, function (err, buffer) {
        rimraf(location.trim(), function () { 
          console.log('Directory deleted!!!'); 
          generateECAR(finalECARPath);
        }); 
      });
    })
    .then(function () {
      console.log('Second level Extraction is Done!!');
    })
    .catch(function (err) {
      console.error(err);
    });
}

function generateECAR(ecarPath){
  console.log("Final ECAR generate",ecarPath);
  var arr = ecarPath.split('/');
  zipdir(ecarPath.trim(), { saveTo: "./ECARS/" + arr[2] + ".ecar"}, function (err, buffer) {
  });
}
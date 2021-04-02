const fs = require('fs-extra');
const path = require('path');
var parser = require('xml-js');
var xcode = require("xcode");

var projectRoot
var IOS_DIR = 'platforms/ios';
var ANDROID_DIR = 'platforms/android';
var PLATFORM;
var _configXml;

var setupEnv = function(){
  appName = getAppName();
  PLUGIN_ID = getPluginId();
  PLATFORM = {
    IOS: {
        dest: IOS_DIR + '/' + appName + '/Resources/intro.mp4',
        src: [
            'intro.mp4',
            IOS_DIR + '/www/intro.mp4',
            'www/intro.mp4'
        ]
    },
    /*ANDROID: {
        dest: ANDROID_DIR + '/app/intro.mp4',
        src: [
            'intro.mp4',
            ANDROID_DIR + '/assets/www/intro.mp4',
            'www/intro.mp4',
            ANDROID_DIR + '/app/src/main/intro.mp4'
        ]
    }*/
  };
}

module.exports = function (context) {
  //console.log(context.hook + ': Importing video file', context.opts.platforms);
  var platforms = context.opts.platforms;
  setContext(context);
  setupEnv();

  if(platforms.indexOf('ios') !== -1 && directoryExists(IOS_DIR)){
    copyFile(PLATFORM.IOS);

    var xcodeProjectPath = getXcodeProjectPath();
    var xcodeProject = xcode.project(xcodeProjectPath);
    //console.log(xcodeProject);
    xcodeProject.parse(function (err){

      xcodeProject.removeResourceFile('Resources/intro.mp4');
      xcodeProject.addResourceFile('Resources/intro.mp4');

      // Finally, write the .pbxproj back out to disk.
      fs.writeFileSync(path.resolve(xcodeProjectPath), xcodeProject.writeSync());
      //console.log(err);
    });
  }
}

//Utilities

setContext = function(context){
  _context = context;
};

copyFile = function(platform){
  for(var i = 0; i < platform.src.length; i++){
      var file = platform.src[i];
      if(this.fileExists(file)){
          try{
              var contents = fs.readFileSync(path.resolve(file));

              try{
                  var destinationPath = platform.dest;
                  var folder = destinationPath.substring(0, destinationPath.lastIndexOf('/'));
                  fs.ensureDirSync(folder);
                  fs.writeFileSync(path.resolve(destinationPath), contents);
              }catch(e){
                  // skip
              }
          }catch(err){
              console.log(err);
          }

          break;
      }
  }
};

fileExists = function(filePath){
  try{
      return fs.statSync(path.resolve(filePath)).isFile();
  }catch(e){
      return false;
  }
};

directoryExists = function(dirPath){
  try{
      return fs.statSync(path.resolve(dirPath)).isDirectory();
  }catch(e){
      return false;
  }
};

parseConfigXml = function(){
  if(_configXml) return _configXml;
  _configXml = parseXmlFileToJson("config.xml");
  return _configXml;
};

parseXmlFileToJson = function(filepath, parseOpts){
  parseOpts = parseOpts || {compact: true};
  return JSON.parse(parser.xml2json(fs.readFileSync(path.resolve(filepath), 'utf-8'), parseOpts));
};

getAppName = function(){
  return parseConfigXml().widget.name._text.toString().trim();
};

getPluginId = function(){
  // if(!_context) throw "Cannot retrieve plugin ID as hook context is not set";
  return _context.opts.plugin.id;
};

//Xcode 

/**
 * Used to get the path to the XCode project's .pbxproj file.
 */
getXcodeProjectPath = function () {
  var appName = getAppName();
  return path.join("platforms", "ios", appName + ".xcodeproj", "project.pbxproj");
}

/**
* This helper is used to add a build phase to the XCode project 
*/
addBuildPhase = function (context, xcodeProjectPath) {

  // Read and parse the XCode project (.pxbproj) from disk.
  // File format information: http://www.monobjc.net/xcode-project-file-format.html
  var xcodeProject = xcode.project(xcodeProjectPath);
  xcodeProject.parseSync();

  // Generate a unique ID for our new build phase.
  var id = xcodeProject.generateUuid();
}
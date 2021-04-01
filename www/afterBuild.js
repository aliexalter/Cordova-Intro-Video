const fs = require('fs-extra');
const path = require('path');
var parser = require('xml-js');

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
        dest: ANDROID_DIR + '/app/google-services.json',
        src: [
            'google-services.json',
            ANDROID_DIR + '/assets/www/google-services.json',
            'www/google-services.json',
            ANDROID_DIR + '/app/src/main/google-services.json'
        ],
        colorsXml: {
            src: './plugins/' + utilities.getPluginId() + '/src/android/colors.xml',
            target: ANDROID_DIR + '/app/src/main/res/values/colors.xml'
        },
        performanceGradlePlugin: {
            classDef: 'com.google.firebase:perf-plugin',
            pluginDef: 'com.google.firebase.firebase-perf'
        }
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
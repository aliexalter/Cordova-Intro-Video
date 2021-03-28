const fse = require('fs-extra')
const path = require('path')

var projectRoot

module.exports = function (context) {
  console.log(context.hook + ': Importing video file')

  projectRoot = path.resolve(path.dirname(context.scriptLocation), '..')
  console.log('Project root directory:', projectRoot)
  //copyFile('jquery', path.join('dist', 'jquery.min.js'), path.join('www', 'js', 'res', 'jquery.min.js'))
  fse.copySync('/videoTest2.mp4', projectRoot);
  console.log(path.relative(projectRoot,'/videoTest2.mp4'));
}

function copyFile (npmPackage, // oficial name of the npm package from which the file is to be copied from
  fileRelativePath, // file path with respect to the main directory of the npm package (node_modules/<package>/)
  destFilePath) { // file's path to where it is copied, relative to the project bin/ directory
  // trick to get the npm module main directory
  // https://stackoverflow.com/a/49455609/1243247
  const packageDirFullpath = path.dirname(require.resolve(path.join(npmPackage, 'package.json')))
  const fileOriginFullPath = path.join(packageDirFullpath, fileRelativePath)
  const fileDestFullPath = path.join(projectRoot, destFilePath)

  fse.copySync(fileOriginFullPath, fileDestFullPath)

  const consoleMsg = npmPackage + ': ' +
    path.relative(projectRoot, fileOriginFullPath) + ' -> ' +
    path.relative(projectRoot, fileDestFullPath)

  console.log(consoleMsg)
}
const fse = require('fs-extra')
const path = require('path')

var projectRoot

module.exports = function (context) {
  console.log(context.hook + ': Importing video file', context);

  projectRoot = path.resolve(context.opts.paths[0]);
  console.log('Projec destination directory:', projectRoot)
  //copyFile('jquery', path.join('dist', 'jquery.min.js'), path.join('www', 'js', 'res', 'jquery.min.js'))
  var fileRaed = fse.readFileSync(context.opts.projectRoot+'/intro.mp4');
  fse.writeFileSync(projectRoot+'/intro.mp4',fileRaed);
  console.log(path.relative(projectRoot,'/intro.mp4'));
}
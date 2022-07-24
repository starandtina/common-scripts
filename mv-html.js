const glob = require('glob');
const fse = require('fs-extra');

const cwd = process.cwd();

glob.sync(`${cwd}/**/*.{html,docx,pptx}`).forEach(fileName => {
  const newFileName = fileName.replace(/\s*\|\s*/g, '-').replace(/\(.+?\)/, '');
  console.log(newFileName);

  if (fileName !== newFileName) {
    fse.moveSync(fileName, newFileName, { overwrite: true });
  }
});

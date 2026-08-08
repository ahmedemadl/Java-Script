//Q1:
function fileName() {
  console.log({ File: __filename, Dir: __dirname });
}
fileName();

//Q2:
const path = require('path');

function fileName(filePath) {
  return path.basename(filePath);
}
const result = fileName("C:\\Users\\ahmed\\OneDrive\\Desktop\\node.js Route course\\assigment2.js");
console.log(result);

//Q3:
const path = require('path');

function build(Object) {
  return path.format(Object);
}
const result = build({dir:"/folder", name:"app", ext:".js"});
console.log(result);

//Q4
const path = require('path');

function fileExtension(filePath) {
  return path.extname(filePath);
}
const result = fileExtension("/docs/readme.md");
console.log(result);

//Q5:
const path = require('path');

function parsePath(filePath) {
  const parsed = path.parse(filePath);
  return { Name: parsed.name, Ext: parsed.ext };
}
const result = parsePath("/home/app/main.js");
console.log(result);

//Q6:
const path = require('path');

function absoluteCheck(filePath) {
  return path.isAbsolute(filePath);
}
const result = absoluteCheck("/home/app/main.js");
console.log(result);

//Q7:
const path = require('path');

function joins_multi_segments(...filePath) {
  return path.join(...filePath);
}
const result = joins_multi_segments("src","components", "App.js");
console.log(result);

//Q8:
const path = require('path');

function resolve(filePath) {
  return path.resolve(filePath);
}
const result = resolve("./index.js");
console.log(result);

//Q9:
const path = require('path');

function twoPaths(path1, path2) {
  return path.join(path1, path2);
}
const result = twoPaths("/folder1", "folder2/file.txt");
console.log(result);

//Q10:
const fs = require('fs/promises');
const path = require('path');

async function delete_file_asynchronously(filePath) {
  await fs.unlink(filePath);
  const fileName = path.basename(filePath);
  console.log(`The ${fileName} is deleted.`);
}

delete_file_asynchronously("C:/Users/ahmed/OneDrive/Desktop/node.js Route course/test.txt");


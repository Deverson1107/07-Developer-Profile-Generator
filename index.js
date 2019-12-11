const inquirer = require("inquirer");
const fs = require("fs");
const PDFDocument = require("pdfkit");
const util = require("util");
const axios = require("axios");
var pdf = require('html-pdf');
 
const writeFileAsync = util.promisify(fs.writeFile);

function promptuser() {
    inquirer.prompt({
    message: "Enter your GitHub username:",
    name: "username"
    })
  .then(function({ username }) {
    const queryURL = `https://api.github.com/users/${username}`;

    axios
    .get(queryURL)
    .then(function(result) {
        const stats = {
            "name" : result.data.name,
            "pageURL" : result.data.url,
            "location" : result.data.location,
            "followers" : result.data.followers,
            "following" : result.data.following,
            "repocount" : result.data.public_repos,
            "imgURL" : result.data.avatar_url,
            "bio" : result.data.bio,
        }
        var html = generateHTML(stats);
        writeFileAsync("index.html", html);
        
        var options = { format: 'Letter' };
        pdf.create(html, options).toFile('./githubUser.pdf', function(err, res) {
          if (err) return console.log(err);
          console.log(res);
        });
    });
  });
};

function generateHTML(stats) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Github Profile Info</title>
</head>
<body>
  <img src="${stats.imgURL}" height="42" width="42">
  <h1>${stats.name}</h1>
  <h2>${stats.bio}</h2>
  <a href="${stats.pageURL}">Github Page</a>
  <div>${stats.location}</div>
  <h4>Repositories: ${stats.repocount}</h4>
  <h4>Following: ${stats.following}</h4>
  <h4>Followers: ${stats.followers}</h4>
</body>
</html>`;
}

promptuser()
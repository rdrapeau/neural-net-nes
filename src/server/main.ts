/// <reference path="../common/def/express.d.ts"/>

import express = require("express");
var app = express();

app.use(express.static(__dirname + '/../client/static'));

app.listen(1337);

console.log('Listening on port 1337...');
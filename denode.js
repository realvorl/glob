var express = require('express');
var kbaPlugin = require('./plugins/kba');

var app = express();

PORT = 3000;

app.get('/kba/barometer', function (req, res) { kbaPlugin.barometer(req, res) });

app.get('/kba/new-registration', function (req, res) { kbaPlugin.newRegistrations(req, res) });

app.get('/kba/top-50', function (req, res) { kbaPlugin.top50(req, res) });

console.log("Server Started on port: " + PORT);
app.listen(PORT);

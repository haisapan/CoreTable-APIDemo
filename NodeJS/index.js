var express = require('express');
var app = express();

app.get('/', function (req, res) {
    res.send('CoreTable API NodeJS version');
});

app.get('/api/coretable', function (req, res) {
    console.log(req, res);

    res.send("get");
})
    .post('/api/coretable', function (req, res) {
        console.log(req, res);

        res.send("post");
    })
    .put('/api/coretable', function (req, res) {
        console.log(req, res);

        res.send("put");
    })
    .delete('/api/coretable', function (req, res) {
        console.log(req, res);

        res.send("delete");
    });

app.listen(3000);
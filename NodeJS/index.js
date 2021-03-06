var express = require('express');
var bodyParser = require('body-parser');

var cors = require('cors');
var faker = require('faker');
var _ = require('lodash');

faker.locale = "zh_CN";

var app = express();
app.use(cors()); //Enable CORS
app.use(bodyParser.json({
    limit: '1mb'
}));
app.use(bodyParser.urlencoded({
    extended: true,
    limit: '1mb'
}));
app.use(require('method-override')());

/**Init the dataSource --Begin */

var total = 43;
var dataSource = [];
for (let i = 0; i < total; i++) {
    var item = {
        "NO": i, // faker.random.number(500),
        "NAME": faker.random.words(),
        "StartTime": faker.date.past(),
        "TYPE": "cool",
        "TYPE_TEXT": "好",
        "SEX": "feman",
        "STATUS": "",
        "DESC": faker.lorem.sentence(),
        "id": faker.random.number()
    };
    dataSource.push(item);
}

/**Init the dataSource --End */

/**Home */
app.get('/', function (req, res) {
    res.send('CoreTable API NodeJS version');
});

/**Get Table Data */
app.get('/api/coretable', function (req, res) {
        var dataList = dataSource;
        if (req.query.pageSize && req.query.page) {
            dataList = _.take(_.drop(dataList, req.query.pageSize * (req.query.page - 1)), req.query.pageSize);
        }
        // var queryList = _.take(_.drop(dataSource, req.query.pageSize * (req.query.page - 1)), req.query.pageSize);
        res.send({
            total: total,
            data: dataList
        });
    })
    .post('/api/coretable', function (req, res) {
        // console.log(req, res);
        var newItem = req.body;

        dataSource.push(newItem);
        total++;
        newItem.NO = total - 1; //faker.random.number();
        res.send(newItem);
    })
    .put('/api/coretable', function (req, res, next) {
        // console.log(req, res);
        var updateItem = req.body;

        var existedOne = _.find(dataSource, function (item) {
            return item.NO == updateItem.NO;
        });
        if (!existedOne) {
            next("not found the item need be update!");
            return;
        }
        _.assign(existedOne, updateItem);
        // debugger;
        // existedOne=updateItem;
        // dataSource.push(newItem);
        res.send(existedOne);
    })
    .delete('/api/coretable', function (req, res, next) {
        // console.log(req, res);
        var deleteKeys = req.body.deleteKeys;
        if (!deleteKeys || deleteKeys.length == 0) {
            next("not found delete IDs");
            return;
        }
        var deleted = _.remove(dataSource, function (item) {
            return _.some(deleteKeys, function (key) {
                return key == item.NO;
            });
        });
        console.log("delete: ", deleted);
        if (!deleted || deleted.length == 0) {
            next("delete failed!");
            return;
        }
        res.sendStatus(200);
    });

app.use(function (err, req, res, next) {
    console.error(err);
    res.status(500).send('Something broke!');
});

app.listen(7001);
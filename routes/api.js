var express = require('express');
var router = express.Router();
const mongo = require('../config/db.js');
var ObjectId = require('mongodb').ObjectId;
const url = require('url');

var client;
mongo.mongoClient((connection) => {
    client = connection;
})

module.exports = function (db) {
    router.get('/', async (req, res) => {
        const { id, string, integer, float, start_date, end_date, boolean, checked_id, checked_string, checked_integer, checked_float, checked_date, checked_boolean } = req.query;

        const per_page = 3;
        const page = req.params.page || 1;
        const queryObject = url.parse(req.url, true).search;

        var fullUrl = req.search;
        // console.log(fullUrl);

        let field = [];
        if (checked_id === "true" && id) {
            var val = { 'id': id }
            field.push(val);
        }
        if (checked_string === "true" && string) {
            var val = { 'string': string }
            field.push(val);
        }
        if (checked_integer === "true" && integer) {
            var val = { 'integer': integer }
            field.push(val);
        }
        if (checked_float === "true" && float) {
            var val = { 'float': float }
            field.push(val);
        }
        if (checked_date === "true" && start_date && end_date) {
            var val = { 'date': { $gte: `${start_date}`, $lt: `${end_date}` } }
            field.push(val);
            // field.push(`date between '${start_date}' and '${end_date}'`);
        }
        if (checked_boolean === "true" && boolean) {
            var val = { 'boolean': boolean }
            field.push(val);
        }

        if (field.length > 0) {
            let total_data = await client.db('data_type').collection('datatype')
                .find({ $or: field })
                .toArray();

            await client.db('data_type').collection('datatype')
                .find({ $or: field })
                .limit(3)
                .skip(0)
                .toArray()
                .then(result => {
                    console.log(result.length)
                    res.json({
                        data: result,
                        current: page,
                        filter: queryObject,
                        next_page: parseInt(page) + 1,
                        previous_page: parseInt(page) - 1,
                        pages: Math.ceil(total_data.length / per_page)
                    })
                })
                .catch(err => console.log(err));
        } else {
            let total_data = await client.db('data_type').collection('datatype').countDocuments();
            await client.db('data_type').collection('datatype')
                .find({})
                .limit(3)
                .skip(0)
                .toArray()
                .then(result => {
                    res.json({
                        data: result,
                        current: page,
                        filter: queryObject,
                        next_page: parseInt(page) + 1,
                        previous_page: parseInt(page) - 1,
                        pages: Math.ceil(total_data / per_page)
                    })
                })
                .catch(err => console.log(err));
        }

    });

    router.get('/:page', async (req, res) => {
        const { id, string, integer, float, start_date, end_date, boolean, checked_id, checked_string, checked_integer, checked_float, checked_date, checked_boolean } = req.query;

        const per_page = 3;
        const page = req.params.page || 1;
        const queryObject = url.parse(req.url, true).search;

        var fullUrl = req.search;
        // console.log(fullUrl);

        let field = [];
        if (checked_id === "true" && id) {
            var val = { 'id': id }
            field.push(val);
        }
        if (checked_string === "true" && string) {
            var val = { 'string': string }
            field.push(val);
        }
        if (checked_integer === "true" && integer) {
            var val = { 'integer': integer }
            field.push(val);
        }
        if (checked_float === "true" && float) {
            var val = { 'float': float }
            field.push(val);
        }
        if (checked_date === "true" && start_date && end_date) {
            var val = { 'date': { $gte: `${start_date}`, $lt: `${end_date}` } }
            field.push(val);
            // field.push(`date between '${start_date}' and '${end_date}'`);
        }
        if (checked_boolean === "true" && boolean) {
            var val = { 'boolean': boolean }
            field.push(val);
        }

        // let total_data = await client.db('data_type').collection('datatype').countDocuments();
        if (field.length > 0) {
            let total_data = await client.db('data_type').collection('datatype')
                .find({ $or: field })
                .toArray();
            await client.db('data_type').collection('datatype')
                .find({ $or: field })
                .limit(3)
                .skip((page - 1) * per_page)
                .toArray()
                .then(result => {
                    res.json({
                        data: result,
                        current: page,
                        filter: queryObject,
                        next_page: parseInt(page) + 1,
                        previous_page: parseInt(page) - 1,
                        pages: Math.ceil(total_data.length / per_page)
                    })
                })
                .catch(err => console.log(err));
        } else {
            let total_data = await client.db('data_type').collection('datatype').countDocuments();
            await client.db('data_type').collection('datatype')
                .find({})
                .limit(3)
                .skip((page - 1) * per_page)
                .toArray()
                .then(result => {
                    res.json({
                        data: result,
                        current: page,
                        filter: queryObject,
                        next_page: parseInt(page) + 1,
                        previous_page: parseInt(page) - 1,
                        pages: Math.ceil(total_data / per_page)
                    })
                })
                .catch(err => console.log(err));
        }
    });

    router.post('/add', async (req, res) => {
        var { string, date } = req.body;
        const integer = Number(req.body.integer);
        const float = Number(req.body.float);
        const boolean = req.body.boolean;

        let last_id = await client.db('data_type').collection('datatype')
            .find({})
            .sort({ _id: -1 })
            .limit(1)
            .toArray();
        let idNew = last_id[0].id + 1;

        await client.db('data_type').collection('datatype')
            .insertOne({
                id: idNew,
                string: string,
                integer: integer,
                float: float,
                date: date,
                boolean: boolean
            })
            .then(result => {
                res.send('Add data is Successfully!')
            })
            .catch(err => res.send(err));
    });

    router.delete('/delete/:id', async (req, res) => {
        const { id } = req.params;
        var o_id = new ObjectId(id)

        console.log(o_id);

        await client.db('data_type').collection('datatype')
            .deleteMany({
                _id: o_id
            })
            .then(result => {
                res.send(`Delete data is Successfully! ${result}`)
            })
            .catch(err => res.send(err))
    });

    router.get('/edit/:id', async (req, res) => {
        const { id } = req.params;
        var o_id = new ObjectId(id)
        await client.db('data_type').collection('datatype')
            .findOne({
                _id: o_id
            })
            .then(result => {
                res.json(result)
            })
            .catch(err => res.send(err))
    });

    router.put('/edit/:id', async (req, res) => {
        const { id } = req.params;
        var o_id = new ObjectId(id)

        var { string, date } = req.body;
        const integer = Number(req.body.integer);
        const float = Number(req.body.float);
        const boolean = req.body.boolean;
        console.log(o_id)
        await client.db('data_type').collection('datatype')
            .updateOne(
                { _id: o_id },
                {
                    $set: req.body
                }
            )
            .then(result => {
                res.send('Data has been Update!' + result);
            })
            .catch(err => res.send(err))
    })

    return router;
}

// module.exports = router;
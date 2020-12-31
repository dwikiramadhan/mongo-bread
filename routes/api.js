var express = require('express');
var router = express.Router();
const mongo = require('../config/db.js');
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
            var val = { 'id': Number(id) }
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
                    console.log(result.length)
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
            var val = { 'id': Number(id) }
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
                    console.log(result.length)
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
    return router;
}

// module.exports = router;
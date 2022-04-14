const mongoose = require('mongoose');
const {parse} = require("csv-parse");
const { Schema } = mongoose;

const fs = require('fs');

// console.log(jsonList);


mongoose.connect('mongodb://localhost:27017/carDB',
    {useNewUrlParser: true}, function () {
        console.log("db connection successful");
    });

const carSchema = new Schema({
    //stock_num,make,model,year,color,url,price
    stock_num: {
        type: String,
        required: "required",
        minLength: 5,
    },
    make: {
        type: String,
        required: "required"
    },
    model: {
        type: String,
        required: "required"
    },
    year: {
        type: Number,
        required: "required",
        min: 1900,
        max: new Date().getFullYear()
    },
    color: {
        type: String,
        required: "required"
    },
    url: {
        type: String,
        required: "required"
    },
    price: {
        type: Number,
        required: "required",
        min: 1,
    }
})

const Car = mongoose.model('Car', carSchema);

const csvList = [];

fs.createReadStream('data100.csv')
    .pipe(parse({
        columns: true,
        skip_empty_lines: true
    }))
    .on('data', function (csvrow) {
        // console.log(csvrow);
        csvList.push(csvrow);
    })
    .on('end', function () {
        Car.insertMany(csvList, {}, (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log("all data saved");
                mongoose.connection.close();
            }
        });
        console.log(csvList);
    });


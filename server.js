const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));


mongoose.connect('mongodb://localhost:27017/carDB',
    {useNewUrlParser: true}, function () {
        console.log("db connection successful");
    });

const carSchema = {
    //stock_num,make,model,year,color,url,price
    stock_num: String,
    make: String,
    model: String,
    year: Number,
    color: String,
    url: String,
    price: Number
}

const Car = mongoose.model('Car', carSchema);

app.listen(3000, function () {
    console.log("server started at 3000");
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/public/index.html");
});

//Get all cars in the db
app.get("/get_all_cars", function (req, res) {
    Car.find(function (err, data) {
        if (err) {
            res.send({
                "message": "internal database error",
                "data": []
            });
        } else {
            res.send({
                "message": "success",
                "data": data
            })
        }
    });
});

// Get car by _id
app.get('/get_car_by_id',
    function (req, res) {
        // console.log(req.query.car_id);
        Car.find({"_id": req.query.car_id}, function (err, data) {
            if (err || data.length === 0) {
                res.send({
                    "message": "internal database error",
                    "data": {}
                });
            } else {
                res.send({
                    "message": "success",
                    "data": data[0]
                })
            }
        });
    });


app.post('/delete_car_by_id', (req, res) => {
    Car.deleteOne({"_id": req.body}, {},
        (err => {
            if (err) {
                res.send({"message": "database deletion error" + err})
            } else {
                res.send({"message": "success"})
            }
        }));
});

app.post("/new-car", (req, res) => {
    const car = {
        stock_num: req.body.stock_num,
        make: req.body.make,
        model: req.body.model,
        year: req.body.year,
        color: req.body.color,
        url: req.body.url,
        price: req.body.price
    }
    console.log(req.body._id);
    if (req.body._id) {
        // update existed car
        Car.updateOne({_id: req.body._id},
            {$set: car},
            {runValidators: true},
            (err, info) => {
                if (err) {
                    console.log(err);
                    // res.send("Database error");
                    res.redirect("/edit.html?error_message=" + err["message"] + "&input=" + car
                        + "&carId=" + req.body._id);
                } else {
                    res.redirect("/detail.html?car_id=" + req.body._id);
                }
            }
        )
    } else {
        // create a new car
        const nm = new Car(car);
        nm.save((err, new_car) => {
            if (err) {
                console.log(err);
                // res.send("Database error");
                res.redirect("/edit.html?error_message=" + err["message"] + "&input=" + car);
            } else {
                console.log(new_car._id)
                res.redirect("/car_detail.html?car_id=" + new_car._id);
            }
        });
    }
});

app.get("/get_cars_by_filters", (req, res) => {
    const sk = req.query.search_key;
    let minyr = parseInt(req.query.min_year);
    if (!minyr) {
        minyr = 0;
    }
    let maxyr = parseInt(req.query.max_year);
    if (!maxyr) {
        maxyr = 99999;
    }
    let minpr = parseInt(req.query.min_price);
    if (!minpr) {
        minpr = 0;
    }
    let maxpr = parseInt(req.query.max_price);
    if (!maxpr) {
        maxpr = 99999999;
    }
    console.log(minyr);
    console.log(maxyr);
    console.log(minpr);
    console.log(maxpr);
    console.log(sk);

    Car.find({
        $and: [
            {price: {$gte: minpr}},
            {price: {$lte: maxpr}},
            {year: {$gte: minyr}},
            {year: {$lte: maxyr}},
            {
                $or: [
                    {stock_num: {$regex: sk}},
                    {make: {$regex: sk}},
                    {model: {$regex: sk}},
                    {color: {$regex: sk}}
                ]
            }, (err, data)=>{
                if(err){
                    res.send({"message":"error: "+ err,
                        "data": data})
                }else {
                    //console.log(data);
                    res.send({"message":"success",
                        "data": data})
                }
            }
        ]
    })
});

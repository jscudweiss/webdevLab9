let car = {
    "stock_num": "Movie title",
    "make": "Model",
    "url": "img/placeholder.jpg",
    "year": "2021-01-01",
    "color": "fuckoff",
    "price": "fuckthisshit"
}

function load_car(car) {//stock_num,make,model,year,color,url,price
    $('#stock_num').text(car.stock_num);
    $('#make').text(car.make);
    $('#model').text(car.model);
    $('#year').text(car.year);
    $('#color').text(car.color);
    $('#price').text(car.price);
    $('#car_img').attr('src', car.url);
}

// load_movie(movie);
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const car_id = urlParams.get('car_id');
console.log(car_id);
$(document).ready(function () {
    if (car_id) {
        $.get('/get_car_by_id?car_id=' + car_id)
            .done(function (data) {
                if (data["message"] === "success") {
                    car = data["data"];
                    load_car(car);
                }
            });
    }
});

function onEdit(){
    location.href = "/edit.html?car_id=" + car_id;
}
function onDelete(){
    $.post('/delete_car_by_id', {_id:car_id}).done(
        (data)=>{
            if(data.message==="success"){
                location.href="/index.html"
            }else{
                console.log(data.message)
            }
        }
    );
}

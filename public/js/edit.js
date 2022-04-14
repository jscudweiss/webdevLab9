function fillCar(car) {
    //stock_num,make,model,year,color,url,price
    $('#stock_num').val(car.stock_num);
    $('#make').val(car.make);
    $('#model').val(car.model);
    $('#year').val(car.year);
    $('#color').val(car.color);
    $('#url').val(car.url);
    $('#price').val(car.price);
}

function onCancel() {
    if (car_id) {
        // come from detail page
        location.href = "/car_detail.html?car_id=" + car_id;
    } else {
        // come from home page
        location.href = "/";
    }
}

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const errorMessage = urlParams.get('error_message');
const car = JSON.parse(urlParams.get('input'));
const car_id = urlParams.get('car_id');

$('form').on('submit', function () {
    if (car_id) {
        $('form').append(() => {
            const input = $('<input>')
                .attr('name', '_id')
                .attr('value', car_id)
            return input;
        });
    }
});


if (errorMessage) {
    console.log(errorMessage);
    fillCar(car);
    $('#error_message').text(errorMessage);
    $('input').each(function (){
        if(errorMessage.includes($(this).attr('id'))){
            $(this).addClass('is-invalid text-danger');
        } else {
            $(this).removeClass('is-invalid text-danger');
        }
    })
}


if (car_id) {
    $.getJSON('/get_car_by_id?car_id=' + car_id)
        .done((data) => {
            if (data['message'] === 'success') {
                console.log(data.data);
                fillCar(data.data);
            }
        })
}
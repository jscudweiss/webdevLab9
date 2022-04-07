function get_car_object(car, idx) {
    return `<li class="carRow row ${idx % 2 === 0 ? 'even_row' : 'odd_row'}" data-m="${car._id}">
        <div class="col-3"><a>${car.make}</a></div>
        <div class="col-3"><a>${car.model}</a></div>
        <div class="col-2"><a>${car.year}</a></div>
        <div class="col-2"><a>${car.price}</a></div>
        <div class="col-2"><button type="button" class="btn btn-outline-primary">Show More</button></div>
    </li>
    <br>`
}

function sortMake(a, b) {
    const makeA = a.make.toUpperCase(); // ignore upper and lowercase
    const makeB = b.make.toUpperCase(); // ignore upper and lowercase
    if (makeA < makeB) {
        return -1;
    }
    if (makeA > makeB) {
        return 1;
    }
}

function sortModel(a, b) {
    const modelA = a.model.toUpperCase(); // ignore upper and lowercase
    const modelB = b.model.toUpperCase(); // ignore upper and lowercase
    if (modelA < modelB) {
        return -1;
    }
    if (modelA > modelB) {
        return 1;
    }
}

function sortPrice(a, b) {
    return (parseInt(a.price) - parseInt(b.price));
}

function sortYear(a, b) {
    return (parseInt(a.year) - parseInt(b.year));
}


function showList(cars) {
    $('#car_list').empty();
    cars.forEach((car, idx) => {
        //console.log(car);
        $('#car_list').append(get_car_object(car, idx));
    });
    $('.col-2 .btn').on('click', function () {
        const car_id = $(this).parents('li').attr('data-m');
        //console.log(car_id)
        location.href = "detail.html?car_id=" + car_id;
    });
}


$.get("/get_all_cars")
    .done(function (data) {
        let carArr = Array.from(data.data);
        if (data.message === "success") {
            $('#cars #headers .header').on('click', function () {
                console.log(carArr);
                const header = $(this).attr('id');
                switch (header) {
                    case "model":
                        carArr.sort(sortModel);
                        break;
                    case "price":
                        carArr.sort(sortPrice);
                        break;
                    case "year":
                        carArr.sort(sortYear);
                        break;
                    default:
                        carArr.sort(sortMake);
                }
                showList(carArr);
            })
            showList(carArr);
        }

    });



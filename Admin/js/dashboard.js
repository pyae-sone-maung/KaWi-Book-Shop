var order_table = $('#order-dataTable').DataTable();
var lessQuantity =[];
var quantity_count =0;

$(document).ready(function() {
    allCustomer();
    allBook();
});

function allCustomer(){
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: "http://localhost:8000/customers/",
        data: JSON.stringify(),
        success: function(data){
            $('#total-customer').html('<strong>Total Customer: '+data.length+'</strong>');
        }
    });
}

function allBook(){
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: "http://localhost:8000/books/",
        data: JSON.stringify(),
    }).then(function(data){
        for(var i=0; i<data.length; i++)
        {
            if(data[i].book_quantity <5)
            {
                lessQuantity[quantity_count++] = data[i].book_name +'</br>';
            }
        }
        $('#less-books').html('<strong>Books Qty less than 5 : '+lessQuantity.length+'</strong>');
    });
}

function loadOrderData(){
    var ordercount = 0;
    var order="";

    $('#new-order').html('<strong> New Order Books: '+ordercount+'</strong>');
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: "http://127.0.0.1:8000/order/",
        dataType: "json",
        data: JSON.stringify(),
    }).then(function(data){
        for(let i=0; i<data.length; i++){
            if(data[i].order_status == "New"){
                ordercount++;
                $('#new-order').html('<strong> New Order Books: '+ordercount+'</strong>');

                $.when(
                    $.ajax({url: "http://localhost:8000/books/"+data[i].order_book+"/"}),
                    $.ajax({url: "http://localhost:8000/customers/"+data[i].order_customer+"/"}),
                ).then(function(book_data, customer_data){
                    order_table.row.add([
                        order + data[i].id,
                        order + customer_data[0].customer_name,
                        order + book_data[0].book_name,
                        order + data[i].order_phone,
                        order + data[i].order_delivery_address,
                        order + data[i].order_date,
                        order + '<strong>' + data[i].order_status + '</strong>',
                        order + data[i].order_quantity,
                        order + data[i].order_price,
                        order + parseInt(data[i].order_price + data[i].order_price * 0.05),
                        order + '&emsp;' + '<button id="confirm-order'+data[i].id+'" class="btn btn-success" onclick="orderConfirmForm('+data[i].id+')" data-toggle="modal" data-target="#orderConfirmModal"> <i class="far fa-check-circle"></i> </button>' + '&emsp;' +
                                '<button id="cancel-order'+data[i].id+'" class="btn btn-danger" onclick="orderDeleteForm('+data[i].id+')" data-toggle="modal" data-target="#orderCancelModal"> <i class="fas fa-trash"></i> </button>',
                    ]).draw(false);
                });
            }
        }
    });
}

// Order Cancel Button Dialog
function orderDeleteForm(id){
    $('#order-delete').attr('onclick', 'orderDeleteYes('+id+')');
    $('#orderCancelModal').modal('show');
};

function orderDeleteNo(){
    $('#orderCancelModal').modal('hide');
};

function orderDeleteYes(id){
    $.ajax({
        type: "DELETE",
        contentType: "application/json; charset=utf-8",
        url: "http://localhost:8000/order/"+id+"/",
        dataType: "json",
        success: function(){
            $('#orderCancelModal').modal('hide');
            order_table.clear();
            order_table.draw(false);
            loadOrderData();
        }
    });
};

// Order Confirm Button Dialog
function orderConfirmForm(id){
    $('#order-confirm').attr('onclick', 'orderConfirmYes('+id+')');
    $('#orderConfirmModal').modal('show');
}

function orderConfirmNo(){
    $('#orderConfirmModal').modal('hide');
};

function orderConfirmYes(id){
    var updateData = {"order_status": "Delivered"};
    $.ajax({
        type: "PATCH",
        contentType: "application/json; charset=utf-8",
        url: "http://localhost:8000/order/"+id+"/",
        data: JSON.stringify(updateData),
        dataType: "json",
        success: function(data){
            $('#orderConfirmModal').modal('hide');
            order_table.clear();
            order_table.draw();
            loadOrderData();
        }
    });
};

function lessBooks(){
    if(lessQuantity.length == 0)
    {
        $('#less-book-name').html('<h2> <strong> None </strong> </h2>');
    }
    else
    {
        $('#less-book-name').html('<h6> <strong> '+ lessQuantity.join(" ")+ '</strong> </h6>');
    }

    $('#lessBooksModalss').modal('show');
}

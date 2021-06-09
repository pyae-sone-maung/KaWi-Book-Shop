
function loadDeliveredHistory(){
    var order_table = $('#order-dataTable').DataTable();
    var order="";

    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: "http://127.0.0.1:8000/order/",
        dataType: "json",
        data: JSON.stringify(),
    }).then(function(data){
        for(let i=0; i<data.length; i++){
            if(data[i].order_status == "Delivered")
            {
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
                    ]).draw(false);
                });
            }
        }
    });
}


function loadUserData(){
    var customer_table = $('#customer-dataTable').DataTable();
    var customer ="";

    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: "http://localhost:8000/customers/",
        dataType: "json",
        data: JSON.stringify(),
    }).then(function(data){
        for(var i=0; i<data.length; i++){
            customer_table.row.add( [
                customer + data[i].id,
                // customer + '<img src="'+data[i].profile_pic+'" width="100px" height="85">',
                customer + data[i].customer_name,
                customer + data[i].email,
                customer + data[i].password,
            ] ).draw( false );
        }
    });
}

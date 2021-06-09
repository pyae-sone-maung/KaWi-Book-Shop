/* Global variable */
var taxRate = 0.05;
// var shippingRate = 500;
var fadeTime = 300;
var userId = sessionStorage.getItem("userId");
var cartId_list = [];
var cart_count = 0;
var bookId_list = [];
var book_count = 0;
var total_book_quantity=[];
var total_book_count=0;
var booksincart = 0;

$(window).scroll(function(){
    var scrollno = $(window).scrollTop();
    if(scrollno > 100)
    {
        $('#home-navbar').addClass('sticky');
    }
    else{
        $('#home-navbar').removeClass('sticky');
    }
})

$('#delivery-address').val("");
$('#delivery-phone').val("");

aboutAccount();
function loadCartData(){
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: "http://127.0.0.1:8000/cart/",
        dataType: "json",
        data: JSON.stringify(),
        success: function(data){
            console.log(data.length)
            if(data.length==1){
                $('.shopping-cart').attr("hidden", "hidden");
                $('.ordered').attr("hidden", "hidden");
                $('#delivery-info').attr("hidden", "hidden");
                $('.empty-cart').removeAttr("hidden");
                $('#cart-count').text('0');

            }
            else
            {
                for(let i=0; i<data.length; i++){
                    if(data[i].cart_customer == userId)
                    {
                        cartId_list[cart_count++] = data[i].id;
                        bookId_list[book_count++] = data[i].cart_book;
                        booksincart = booksincart + data[i].cart_book_quantity;

                        // For Local
                        var bookID=[];
                        var count=0;
                        bookID[count++]=data[i].cart_book;

                        $.ajax({
                            type: "GET",
                            contentType: "application/json; charset=utf-8",
                            url: "http://127.0.0.1:8000/books/"+bookID[0]+"/",
                            data: JSON.stringify(),
                            success: function(bookdata){
                                $('#cart-list').append("<div id='book"+data[i].id+"'>"+
                                                        "<div class='product' id='"+data[i].id+"'>"+
                                                            "<div class='product-image'>"+
                                                                "<img src='"+bookdata.book_cover+"'>"+
                                                            "</div>"+
                                                            "<div class='product-details'>"+
                                                                "<div class='product-title'>"+bookdata.book_name+"</div>"+
                                                                "<p class='product-description'> "+bookdata.author+"</p>"+
                                                                "<div class='product-removal'>"+
                                                                    "<br>"+
                                                                    "<button class='remove-product' onclick='removeItem("+data[i].id+")'>"+
                                                                        "Remove"+
                                                                    "</button>"+
                                                                "</div>"+
                                                            "</div>"+
                                                            "<div class='product-price' id='book-price"+data[i].id+"'>"+bookdata.price+"</div>"+
                                                            "<div class='product-quantity'>"+
                                                                "<input type='number' id='book-quantity"+data[i].id+"' onclick='quantityValueChange("+data[i].id+")' value='"+data[i].cart_book_quantity+"' min='1'>"+
                                                            "</div>"+
                                                            "<div class='product-line-price' id='book-line-price"+data[i].id+"'>"+bookdata.price * data[i].cart_book_quantity+"</div>"+
                                                        "</div>"+
                                                        "</div>");
                                                        recalculateCart();
                                                        total_book_quantity[total_book_count++]=bookdata.book_quantity;
                            }
                        });
                    }
                }
                sessionStorage.setItem("cartId", cartId_list);
                $('#cart-count').text(booksincart);
            }
        }
    });
}


/* Assign actions */
function quantityValueChange(id){
    var quantity = parseFloat($('#book-quantity'+id+'').val());
    var price = parseFloat($('div #book-price'+id+'').text());
    var result = quantity * price;

    $('.product #book-line-price'+id+'').fadeOut(fadeTime, function(){
        $('.product #book-line-price'+id+'').html(result);
        $('.product #book-line-price'+id+'').fadeIn(fadeTime);
        recalculateCart();
    });
}


function recalculateCart(){
    if($('#cart-list').html() != '')
    {
        var subtotal = 0;
        $('.product').each(function () {
            subtotal += parseFloat($(this).children('.product-line-price').text());
            var tax = subtotal * taxRate;
            var grandtotal = subtotal + tax;

            $('.table #cart-subtotal').text(subtotal + " Ks");
            $('.table #cart-tax').text(tax + " Ks");
            $('.table #cart-total').text(subtotal + tax + " Ks");

            $('.totals-value').fadeOut(fadeTime, function()
            {
                $('#cart-tax').html(tax);
                $('#cart-subtotal').html(subtotal);
                $('#cart-grandtotal').html(grandtotal);
                $('.totals-value').fadeIn(fadeTime);
            });
        });
    }
    else
    {
        loadCartData();
    }
}

function removeItem(id){
    var bookQuantity = $('#cart-count').html();
    var removeQuantity = $('#book-quantity'+id).val();

    $('body #book'+id+'').slideUp(350, function(){
        $('body #book'+id+'').remove();
        $.ajax({
            type: "DELETE",
            contentType: "application/json; charset=utf-8",
            url: "http://127.0.0.1:8000/cart/"+id+"/",
            dataType: "json",
            success: function(){
                recalculateCart();
                $('#cart-count').text(bookQuantity - removeQuantity);
            }
        });
    });
}

function saveChangesCart(){
    for(var cart=0; cart<cartId_list.length; cart++){
        var cartId = cartId_list[cart];
        var quantity = $('#book-quantity'+cartId_list[cart]).val();
        $.ajax({
            type: "PATCH",
            contentType: "application/json; charset=utf-8",
            url : "http://127.0.0.1:8000/cart/"+cartId+"/",
            data: JSON.stringify({"cart_book_quantity": quantity}),
            success: function(){
                window.location.reload();
            }
        });
    }
}

// Total Price
function amount(){
    var grandtotal = parseInt($('#cart-grandtotal').text()) / 1590;
    var price = grandtotal.toFixed(2) * 100;
    return price;
}
//Stripe Payment
var handler = StripeCheckout.configure({
    key: 'pk_test_51I9BhgFlfuo7hF2V4EpagFGtXyFFl0qwvKE3oXGYtT4Xh8ynVDAQYMWLBFFGk5XcqalbUcgq7e7blIpu7fUMiVyq00vZx6LL60',
    image: 'https://seeklogo.com/images/S/stripe-logo-4039DEE4FE-seeklogo.com.jpg',
    locale: 'auto',
    token: function(token) {
        var bookprice = amount();
        fetch('/purchase', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
            stripeTokenId: token.id,
            amount: bookprice
            })
        })
        confirmCheckout();
    }
});

function checkOut(){
    if($('#delivery-address').val() != '' && $('#delivery-phone').val() != ''){
        if($('#delivery-phone').val().length == 11){
            var bookprice = amount();
            handler.open({
                name: 'KaWi Book Shop',
                description: 'Stripe Payment',
                amount: bookprice
            });

        } else{
            $.alert({
                title: '',
                content: 'Please Fill Phone number.',
                theme: 'material'
            });
        }
    } else{
        $.alert({
            title: '',
            content: 'Please Fill Address and Phone no.',
            theme: 'material'
        });
    }
}

// For Checkout
function confirmCheckout(){
    var dt = new Date();
    var curr_date_time = dt.toDateString((dt.getDate()))+ " "+ dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();

    for(var orderBook = 0; orderBook < bookId_list.length; orderBook ++){
        var bookId = bookId_list[orderBook];
        var total_book = total_book_quantity[orderBook];
        var order_book_quantity = $('#book-quantity'+cartId_list[orderBook]).val();

        orderData = {
            "order_customer": userId,
            "order_book": bookId,
            "order_phone": $('#delivery-phone').val(),
            "order_delivery_address": $('#delivery-address').val(),
            "order_date": curr_date_time,
            "order_status":"New",
            "order_quantity": order_book_quantity,
            "order_price": $('#book-line-price'+cartId_list[orderBook]+'').text(),
        };

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url : "http://127.0.0.1:8000/order/",
            data: JSON.stringify(orderData),
            success: function(){
                console.log("Successful checkout")
            }
        });
        bookInventoryControl(bookId, order_book_quantity, total_book);
    }
    clearOrderConfirm();
}

// clear delivery data
function clearOrderConfirm(){
    for(var cart=0; cart<cartId_list.length; cart++){
        $.ajax({
            type: "DELETE",
            contentType: "application/json; charset=utf-8",
            url: "http://127.0.0.1:8000/cart/"+cartId_list[cart]+"/",
            success: function(){
                Swal.fire({
                    title:'Payment Successful',
                    text:'',
                    icon: "success"
                }).then(okay => {
                          if (okay) {
                            window.location.href = "../webpage/home.html";
                          }
                        });
            }
        });
    }
}

function bookInventoryControl(bookId, quantity, total_book){
    $.ajax({
        type: "PATCH",
        contentType: "application/json; charset=utf-8",
        url: "http://127.0.0.1:8000/books/"+bookId+"/",
        data: JSON.stringify({"book_quantity": total_book - quantity})
    });
}


// =======> For Nav Bar <======================
$('#home').click(function(){
    location.href = "../webpage/home.html";
});

$('#user').click(function(){
    if(userId != null){
        $('#user #signin').attr("hidden", "hidden");
        $('#user #signup').attr("hidden", "hidden");
    }
    else {
        $('#user #profile').attr("hidden", "hidden");
        $('#user #logout').attr("hidden", "hidden");
    }
    var dropdown = $('#user ul');
    if(dropdown[0].style.display == "none"){
        dropdown[0].style.display = "block";
    }
    else {
        dropdown[0].style.display = "none";
    }
});

$('#user ul #profile').click(function(){
    var books = $('#cart-count').html();
    sessionStorage.setItem("booksincart", books);
    location.href = "../webpage/userprofile.html";
});

$('#user ul #logout').click(function(){
    sessionStorage.clear();
    location.href = "../webpage/home.html";
});

$('#cart').click(function(){
    location.reload(true);
});

function aboutAccount(){
    var userName =[];
    var userImage = sessionStorage.getItem("userImage");
    var name = sessionStorage.getItem("userName");
    if(userId == null){
        $('#user p').text("Account");
        $('#user span').html('<i class="fas fa-user-circle fa-2x"> </i>');
    }
    else {
        userName = name.split(" ");
        if(userName.length == 1){
            $('#user p').text(userName[0]);
        }
        else {
            $('#user p').text(userName[0] +" "+ userName[1]);
        }
        if(userImage != 'null'){
            $('#user span').empty();
            $('#user img').removeAttr("hidden");
            $('#user img').attr("src", userImage);
        }
    }
}

//For Footer
function showPageFooter(){
    $('.page-footer').css('display', 'block');
}

function hidePageFooter(){
    $('.page-footer').css('display', 'none');
}

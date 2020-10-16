
var userId = sessionStorage.getItem("userId");

$('#search-bar .input-group').on('keypress',function(e) {
    if(e.which == 13) {
        searchBooks();
    }
});

aboutAccount();
$(window).scroll(function(){
    var scrollno = $(window).scrollTop();
    if(scrollno > 350)
    {
        $('#home-navbar').addClass('sticky');
        $('.page-logo').removeAttr("hidden");
    }
    else{
        $('#home-navbar').removeClass('sticky');
        $('.page-logo').attr("hidden", "hidden")
    }
})

// Unique value From Array
function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function showAllBooks(){
    $("#userInput").val("");
    $('#author-list').empty();
    $('#category-list').empty();
    $('.search-about').empty();
    $("#booksTableBody").empty();
    booksInCart();

    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: "http://localhost:8000/books/",
        dataType: "json",
    }).then(function(data){
        var author = [];
        var category = [];

        for(var i=0; i<data.length; i++)
        {
            author[i] = data[i].author;
            category[i] = data[i].category;
            var id = data[i].id;
            var bookName = data[i].book_name;
            var cover = data[i].book_cover;
            $("#booksTableBody").append('<div class="col-lg-3 col-md-4 col-sm-6" id="bookdiv">'+
                                            '<button class="btn" onclick="bookDescriptiion('+id+')">'+
                                                '<img id="book-cover" src="'+cover+'">'+
                                                '<p id="book-name">'+bookName+'</p>'+
                                            '</button>'+
                                        '</div>');
        }
        author = author.filter(onlyUnique);
        category = category.filter(onlyUnique);

        // For Author
        for(var index=0; index<author.length; index++)
        {
            $('#author-list').append('<span class="dropdown-item author'+index+'" id="fake-link" onclick="authorSearch('+index+')">'+author[index]+'</span>');
        }

        //For Categories
        for(var index=0; index<category.length; index++)
        {
            $('#category-list').append('<span class="dropdown-item category'+index+'" id="fake-link" onclick="categorySearch('+index+')">'+category[index]+'</span>');
        }
    });
}

$('#home').click(function(){
    $('#booksTableBody').empty();
    showAllBooks();
});

function searchBooks(){
    var userInput = $("#userInput").val().toLowerCase().split(/\s/).join('');
    if(userInput == "")
    {
        $('#booksTableBody').empty();
        $('.search-about').empty();
        showAllBooks();
    }

    else
    {
        var isBook = false;
        var bookcount = 0;
        $('#booksTableBody').empty();
        $('.search-about').empty();
        $.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            url: "http://localhost:8000/books/",
        }).then(function(data){
            for(var i=0; i<data.length; i++)
            {
                var bookId = data[i].id;
                var name = data[i].book_name;
                var bookName = name.toLowerCase().split(/\s/).join('');
                var cover = data[i].book_cover;
                var author = data[i].author;
                var bookAuthor = author.toLowerCase().split(/\s/).join('');
                var category = data[i].category;
                var bookCategory = category.toLowerCase().split(/\s/).join('');

                if(bookName.match(userInput) || bookAuthor.match(userInput) || bookCategory.match(userInput))
                {
                    isBook = true;
                    bookcount = bookcount + 1;
                    $('#booksTableBody').append('<div class="col-lg-3 col-md-4 col-sm-6" id="bookdiv">'+
                                                    '<button class="btn" onclick="bookDescriptiion('+bookId+')">'+
                                                        '<img id="book-cover" src="'+cover+'">'+
                                                        '<p id="book-name">'+data[i].book_name+'</p>'+
                                                    '</button>'+
                                                '</div>');
                }
            }
            $('.search-about').append('<p> Search result: [ '+ bookcount+' books ]</p');
            if(isBook == false){
                $('.search-about').empty();
                $('#booksTableBody').empty();
                $("#booksTableBody").html('<p id="no-books"> Search result: [ No Books ] </p>');
            }
        });
    }
}

function categorySearch(index){
    var selectCategory = $('.category'+index+'').text();
    var bookcount = 0;
    $("#userInput").val("");
    $('#booksTableBody').empty();
    $('.search-about').empty();

    $.ajax({
    	type: "GET",
    	contentType: "application/json; charset=utf-8",
    	url: "http://localhost:8000/books/",
    	dataType: "json",
    }).then(function(data){
        for(var i=0; i<data.length; i++)
        {
            var bookId = data[i].id;
            var bookName = data[i].book_name;
            var cover = data[i].book_cover;
            var category = data[i].category;
            var author = data[i].author;

            if(category == selectCategory)
            {
                bookcount = bookcount + 1;
                $("#booksTableBody").append('<div class="col-lg-3 col-md-4 col-sm-6" id="bookdiv">'+
                                                '<button class="btn" onclick="bookDescriptiion('+bookId+')">'+
                                                    '<img id="book-cover" src="'+cover+'">'+
                                                    '<p id="book-name">'+bookName+'</p>'+
                                                '</button>'+
                                            '</div>');
            }
        }
        $('.search-about').append('<p>'+selectCategory+' Books <p id="book-count"> [ '+bookcount+' books. ]</p> </p>');

    });
}

function authorSearch(index){
    var selectAuthor = $('.author'+index+'').text();
    var bookcount = 0;
    $("#userInput").val("");
    $('#booksTableBody').empty();
    $('.search-about').empty();

    $.ajax({
    	type: "GET",
    	contentType: "application/json; charset=utf-8",
    	url: "http://localhost:8000/books/",
    	dataType: "json",
    }).then(function(data){
        for(var i=0; i<data.length; i++)
        {
            var bookId = data[i].id;
            var bookName = data[i].book_name;
            var cover = data[i].book_cover;
            var category = data[i].category;
            var author = data[i].author;

            if(author == selectAuthor)
            {
                bookcount = bookcount + 1;
                $("#booksTableBody").append('<div class="col-lg-3 col-md-4 col-sm-6" id="bookdiv">'+
                                                '<button class="btn" onclick="bookDescriptiion('+bookId+')">'+
                                                    '<img id="book-cover" src="'+cover+'">'+
                                                    '<p id="book-name">'+bookName+'</p>'+
                                                '</button>'+
                                            '</div>');
            }
        }
        $('.search-about').append('<p>'+selectAuthor+'<p id="book-count"> [ '+bookcount+' books. ]</p> </p>');
    });
}

//For Book Description
function bookDescriptiion(bookId){
    cartBooks = [];
    count = 0;

    $('.search-about').empty();
    $('#booksTableBody').empty();
    $.ajax({
        type: "GET",
        contentType: "Kawi_Application/json; charset=utf-8",
        url: "http://127.0.0.1:8000/cart/",
        data: JSON.stringify(),
    }).then(function(data){
        for (var i=0; i<data.length; i++){
            if(data[i].cart_customer == userId){
                cartBooks[count++] = data[i].cart_book
            }
        }
    });

    $.ajax({
      type: "GET",
      contentType: "Kawi_Application/json; charset=utf-8",
      url: "http://localhost:8000/books/"+bookId+"/",
    }).then(function(data){
            $("#booksTableBody").append('<div class="col-lg-6 col-sm-12">'+
                                            '<div class="book-cover">'+
                                                '<div class="book">'+
                                                    '<img src="'+data.book_cover+'">'+
                                                    '<div class="book-bg"></div>'+
                                                '</div>'+
                                            '</div>'+
                                            '<h5 class="price"> <strong> Price : </strong>'+ data.price + ' MMK</h5>'+
                                            '<div class="action">'+
                                                '<button class="add-to-cart" onclick="addToCart('+bookId+')"> Add To Cart <i class="fas fa-cart-plus"></i></button>'+
                                            '</div>'+
                                        '</div>'+
                                        '<div class="col-lg-6 col-sm-12">'+
                                            '<h3 class="book-title">'+ data.book_name +'</h3>'+
                                            '<h5 id="author"> <strong> Author : </strong>'+ data.author +'</h5>'+
                                            '<h5 id="publisher"> <strong> Publisher : </strong>'+ data.publisher+'</h5>'+
                                            '<p class="book-description">'+data.description+'</p>'+
                                        '</div>'
                                    );
        for(var i=0; i<cartBooks.length; i++){
            if(cartBooks[i] == bookId){
                $('#booksTableBody button').removeAttr("onclick", "addToCart()");
                $('#booksTableBody button').html("Book in Cart <i class='fas fa-cart-plus'></i>");
                $('#booksTableBody button').css("background-color", "blue").css("padding", "6px 30px");
                $('#booksTableBody button').attr("onclick", "goToCart()");
            }
        }
    });
}

function addToCart(bookId){
    if(userId != null)
    {
        var postData={
            "cart_customer" : userId ,
            "cart_book" : bookId,
            "cart_book_quantity" : 1,
        };
        $.ajax({
            type : "POST",
            contentType: "application/json; charset=utf-8",
            url : "http://localhost:8000/cart/",
            data:JSON.stringify(postData),
            dataType : "json",
            success:function(){
                $('#booksTableBody button').removeAttr("onclick", "addToCart()");
                $('#booksTableBody button').html("Book in Cart <i class='fas fa-cart-plus'></i>");
                $('#booksTableBody button').css("background-color", "blue").css("padding", "6px 30px");
                $('#booksTableBody button').attr("onclick", "goToCart()");
                var count = parseInt($('#cart-count').html());
                $('#cart-count').text(count + 1);
            }
        });
    }
    else
    {
        openLoginForm();
    }
};

function goToCart(){
    location.href = "../webpage/cartlist.html";
}

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

$('#user ul #signin').click(function(){
    openLoginForm();
});

$('#user ul #signup').click(function(){
    openRegisterForm();
})

$('#user ul #profile').click(function(){
    var books = $('#cart-count').html();
    sessionStorage.setItem("booksincart", books)
    location.href = "../webpage/userprofile.html";
});

$('#user ul #logout').click(function(){
    sessionStorage.clear();
    location.href = "../webpage/home.html";
});

$('#cart').click(function(){
    if(userId == null){
        openLoginForm();
    }
    else {
        location.href = "../webpage/cartlist.html";
    }
});

function booksInCart(){
    let count = 0;
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: "http://127.0.0.1:8000/cart/",
        data: JSON.stringify(),
        success: function(data){
            for(var i=0; i<data.length; i++){
                if(userId == data[i].cart_customer){
                    count = count + data[i].cart_book_quantity;
                }
            }
            sessionStorage.setItem("cart", count);
            $('#cart-count').text(count);
        }
    });
}

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

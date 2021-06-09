var userId = sessionStorage.getItem("userId");
var booksincart = sessionStorage.getItem("booksincart");
var userData = null;
var booksData = null;

$(window).scroll(function(){
    var scrollno = $(window).scrollTop();
    if(scrollno > 120)
    {
        $('#home-navbar').addClass('sticky');
        $('.page-logo').removeAttr("hidden");
    }
    else{
        $('#home-navbar').removeClass('sticky');
        $('.page-logo').attr("hidden", "hidden")
    }
})

$(document).ready(function(){
    aboutAccount();
    $('#cart-count').text(booksincart);
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: "http://127.0.0.1:8000/customers/"+userId+"/",
        data: JSON.stringify(),
    }).then(function(data){
        userData = Object.assign(data);
        $('.profile-info h3').text(data.customer_name);
        $('.profile-info h6').html("<i class='fas fa-envelope'></i> "+data.email);
        if(data.profile_pic == null){
            $('.profile-img img').attr("src", "../images/default-profile.png");
        }
        else{
            $('.profile-img img').attr("src", data.profile_pic);
        }
    });
});

// Convert to Base64 function
const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

function editAccount(){
    $('#editAccountModal').modal('show');
    $('#edit-account-id').val(userData.id);
    $('#edit-account-name').val(userData.customer_name);
    $('#edit-account-email').val(userData.email);
    $('#profile-img').attr('src', userData.profile_pic);
}

$('#editAccountModal').on('keypress',function(e) {
    if(e.which == 13) {
        saveEditAccount();
    }
});

async function saveEditAccount(){
    var id = $('#edit-account-id').val();
    var name = $('#edit-account-name').val();
    var email = $('#edit-account-email').val();
    var img = $('#edit-account-img')[0].files[0];
    if (typeof img === "undefined"){ var profile = $('#profile-img').attr('src');}
    else { var profile = await toBase64(img);}

    if(name !="" && email !="")
    {
        customer = {
            "customer_name": name,
            "email": email,
            "profile_pic": profile,
        };
        $.ajax({
            type: "PATCH",
            contentType: "application/json; charset=utf-8",
            url: "http://127.0.0.1:8000/customers/"+userId+"/",
            data: JSON.stringify(customer),
            success: function(){
                cancelEditAccount();
                sessionStorage.setItem("userImage", profile);
                location.reload(true);
            }
        });
    }
}

function cancelEditAccount(){
    $('#editAccountModal').modal('hide');
}

function changePassword(){
    $('#changePasswordModal').modal('show');
}

$("#changePasswordModal").on('shown.bs.modal', function(){
    $(this).find('input[id="current-password"]').focus();
});

$('#changePasswordModal').on('keypress',function(e) {
    if(e.which == 13) {
        saveChangePassword();
    }
});

function saveChangePassword(){
    var currentPswd = userData.password;
    var customerPswd = $('#current-password').val();
    var newPswd = $('#new-password').val();
    var confirmPswd = $('#confirm-password').val();

    if(currentPswd == customerPswd)
    {
        if(newPswd.length>=8){
            if(!(/\s/.test(newPswd)))
            {
                if(newPswd == confirmPswd)
                {
                    $.ajax({
                        type: "PATCH",
                        contentType: "application/json; charset=utf-8",
                        url: "http://127.0.0.1:8000/customers/"+userId+"/",
                        data: JSON.stringify({"password": newPswd}),
                        success: function(){
                            $.alert({
                                title: '',
                                content: 'Password change successfully.',
                                theme: 'material'
                            });
                            cancelChangePassword();
                        },
                        error: function(){
                            console.clear();
                            $.alert({
                                title: '',
                                content: 'Please fill new password.',
                                theme: 'material'
                            });
                        }
                    });
                }
                else{
                    $.alert({
                        title: '',
                        content: 'Password does not match.',
                        theme: 'material'
                    });
                }
            }
            else {
                $.alert({
                    title: '',
                    content: 'Password does not allow space.',
                    theme: 'material'
                });
            }
        }
        else {
            $.alert({
                title: '',
                content: 'Password must have at least 8 characters. (But white space does not allow.)',
                theme: 'material'
            });
        }
    }
    else{
        $.alert({
            title: '',
            content: 'Current password does not incorrect.',
            theme: 'material'
        });
    }
}
function cancelChangePassword(){
    $('#changePasswordModal').modal('hide');
    $('#current-password').val(null);
    $('#new-password').val(null);
    $('#confirm-password').val(null);
}

function viewYourPurchasedBooks(){
    var bookId_list = [];
    var count=0;

    $('#your-books').html(" <i class='fas fa-book'></i> Hide Your Books");
    $('#your-books').attr("onclick", "hideYourPurchasedBooks()");
    $('#purchased-books').removeAttr("hidden");

    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: "http://127.0.0.1:8000/order/",
        data: JSON.stringify(),
    }).then(function(data){
        for(var i=0; i<data.length; i++)
        {
            if(data[i].order_customer == userId && data[i].order_status == "Delivered")
            {
                bookId_list[count++] = data[i].order_book;
            }
        }

        if(bookId_list == "")
        {
            $('#purchased-books-info').append("<p> <strong> There is no your books. </strong> </p>");
        }
        else
        {
            for (var book=0; book<bookId_list.length; book++)
            {
                $.ajax({
                    type: "GET",
                    contentType: "application/json; charset=utf-8",
                    url: "http://127.0.0.1:8000/books/"+bookId_list[book]+"/",
                    data: JSON.stringify(),
                }).then(function(data){
                    $('#purchased-books-info').append(
                        "<div class='col-lg-3 col-md-4 col-sm-6'>" +
                            "<img src='"+data.book_cover+"' width='100px' height='100px'>" +
                            "<p>"+data.book_name+"</p>"+
                        "</div>"
                    );
                });
            }
        }
    });
}

function hideYourPurchasedBooks(){
    $('#purchased-books').attr("hidden", "hidden");
    $('#your-books').attr("onclick", "viewYourPurchasedBooks()");
    $('#your-books').html("<i class='fas fa-book'></i> Your Books");
    $('#purchased-books-info').empty();
}

// ==========> For Navbar <===============

$('#home').click(function(){
    location.href = "../webpage/home.html";
});

$('#user').click(function(){
    if(userId != null){
        $('#user #signin').attr("hidden", "hidden");
        $('#user #signup').attr("hidden", "hidden");
    }
    else {
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
    location.href = "../webpage/userprofile.html";
});

$('#user ul #logout').click(function(){
    sessionStorage.clear();
    location.href = "../webpage/home.html";
});

$('#cart').click(function(){
    location.href = "../webpage/cartlist.html";
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

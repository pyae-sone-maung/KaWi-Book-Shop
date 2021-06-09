$('#logindiv .popup').on('keypress',function(e) {
    if(e.which == 13) {
        LoginData();
    }
});

$('#registerdiv .popup').on('keypress',function(e) {
    if(e.which == 13) {
        RegisterData();
    }
});

function openLoginForm(){
    $('#registerdiv').hide();
    $('#logindiv').show();
    $('body').addClass("showLoginForm");
    $('#home-navbar').css("z-index", "2");
    $('.book-cover img').css("z-index", "1");
    $('#useremail').focus();
    $('.popup').css('height', '470px');
}

function closeLoginForm(){
    $('body').removeClass("showLoginForm");
    $('body').removeClass("showRegisterForm");
    // $('#registerdiv').show();
}

function openRegisterForm(){
    $('#logindiv').hide();
    $('#registerdiv').show();
    $('body').addClass("showRegisterForm");
    $('#reg_username').focus();
    $(".popup").css("height", "650px");
}

function closeRegisterForm(){
    $('body').removeClass("showRegisterForm");
    $('#logindiv').show();
}

function RegisterLink(){
    $('body').removeClass("showLoginForm");
    $('#logindiv').hide();
    $('#registerdiv').show();
    $('body').addClass("showRegisterForm");
    $('#reg_username').focus();
    $(".popup").css("height", "650px");
}

function LoginLink(){
    $('body').removeClass("showRegisterForm");
    $('#registerdiv').hide();
    $('#logindiv').show();
    $('body').addClass("showLoginForm");
    $('#useremail').focus();
    $('.popup').css('height', '470px');
}

function LoginData(){
    var user = null;
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: "http://127.0.0.1:8000/customers/",
        dataType: "json",
        success: function(data){
            for(var i=0; i<data.length; i++){
                if($('#useremail').val() == data[i].email && $('#userpassword').val() == data[i].password)
                {
                    sessionStorage.setItem("userId", data[i].id);
                    sessionStorage.setItem("userImage", data[i].profile_pic);
                    sessionStorage.setItem("userName", data[i].customer_name);
                    user = true;
                    break;
                }
            }
            if (user)
            {
                location.reload(true);
            }
            else
            {
                $.alert({
                    title: '',
                    content: 'Email and Password are not match.',
                    theme: 'material'
                });
            }
        },
        error: function(){
            location.href = "../webpage/errorpage.html";
        }
    });
}

function RegisterData(){
    var test_email = "@gmail.com";
    var reg_name = $('#reg_username').val();
    var reg_email = $('#reg_useremail').val();
    var reg_pswd = $('#reg_userpassword').val();
    var confirm_pswd = $('#confirm_password').val();

    if(reg_name != '' && reg_email != '' && reg_pswd != '' && confirm_pswd !=''){
        if(reg_pswd.length >=8){
            if(reg_email.match(test_email)){
                if(!(/\s/.test(reg_pswd))){
                    if(reg_pswd == confirm_pswd){
                        var userData = {
                            "customer_name": reg_name,
                            "email": reg_email,
                            "profile_pic": null,
                            "password": reg_pswd,
                        };
                        $.ajax({
                            type: "POST",
                            contentType: "application/json; charset=utf-8",
                            url: "http://localhost:8000/customers/",
                            data: JSON.stringify(userData),
                            dataType: "json",
                            success: function(){
                                clearRegisterData();
                                clearLoginData();
                                openLoginForm();
                            },
                            error: function(){
                                location.href = "../webpage/errorpage.html";
                            }
                        });
                    }
                    else {
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
                    title: 'Invalid',
                    content: 'Email must be gmail (example@gmail.com )',
                    theme: 'material'
                });
            }
        }else {
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
            content: 'Please fills data.',
            theme: 'material'
        });
    }
}

function clearLoginData(){
    $('#useremail').val("");
    $('#userpassword').val("");
}

function clearRegisterData(){
    $('#reg_username').val("");
    $('#reg_useremail').val("");
    $('#reg_userpassword').val("");
}

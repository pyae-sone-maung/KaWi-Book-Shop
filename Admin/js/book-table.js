$('#add-author').val('');
$('#add-category').val('');

var editAuthor = null;
var editCategory = null;

//Author Collections
function authors(){
    $('#add-book-author-collection').empty();
    $('#edit-book-author-collection').empty();
    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: "http://127.0.0.1:8000/author/",
        data: JSON.stringify(),
    }).then(function(data){
        editAuthor = Object.assign(data);
        $('#add-book-author-collection').append('<option> </option');
        $('#edit-book-author-collection').append('<option> </option');

        for(var i=0; i<data.length; i++)
        {
            $('#add-book-author-collection').append('<option>' + data[i].author + '</option');
            $('#edit-book-author-collection').append('<option>' + data[i].author + '</option');
        }
    });
}

//Add Author
function addAuthor(){
    var newAuthor = $('#add-author').val().toUpperCase();
    if(newAuthor.replace(/^\s+|\s+$/g, "").length != 0)
    {
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "http://127.0.0.1:8000/author/",
            data: JSON.stringify({"author": newAuthor}),
            success: function(){
                $('#addAuthorModal').modal('hide');
                $('#add-author').val('');
            },
            error:function(){
                console.clear();
                $.alert({
                    title: '',
                    content: 'Author is alerady exist.',
                    theme: 'material'
                });
            }
        });
    }
    else
    {
        $.alert({
            title: '',
            content: 'Please Enter Author Name.',
            theme: 'material'
        });
    }
}

//Edit Author
$('.btn-editauthor').click(function(){
    $('.edit-author').empty();
    for(var i=0; i<editAuthor.length; i++){
        $('.edit-author').append('<option value="'+editAuthor[i].id+'">'+editAuthor[i].author+'</option>');
    }
});

function editAuthorSave(){
    var authorId = $('.edit-author').val();
    var author = $('#edit-author').val().toUpperCase();

    $.ajax({
        type: "PATCH",
        contentType: "application/json; charset=utf-8",
        url: "http://127.0.0.1:8000/author/"+authorId+"/",
        data: JSON.stringify({"author": author}),
        success: function(){
            $('#editAuthorModal').modal('hide');
            authors();
        }
    })
}

//Category Collections
function categories(){
    $('#add-book-category-collection').empty();
    $('#edit-book-category-collection').empty();

    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: "http://127.0.0.1:8000/category/",
        data: JSON.stringify(),
    }).then(function(data){
        editCategory = Object.assign(data);
        $('#add-book-category-collection').append('<option> </option>');
        $('#edit-book-category-collection').append('<option> </option>');

        for(var i=0; i<data.length; i++)
        {
            $('#add-book-category-collection').append('<option>' + data[i].category + '</option');
            $('#edit-book-category-collection').append('<option>' + data[i].category + '</option');
        }
    });
}

// Add Category
function addCategory(){
    var newCategory = $('#add-category').val().toUpperCase();
    if(newCategory.replace(/^\s+|\s+$/g, "").length != 0)
    {
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "http://127.0.0.1:8000/category/",
            data: JSON.stringify({"category": newCategory}),
            success: function(){
                $('#addCategoryModal').modal('hide');
                $('#add-category').val('');
            },
            error:function(){
                console.clear();
                $.alert({
                    title: '',
                    content: 'Category is alerady exist.',
                    theme: 'material'
                });
            }
        });
    }
    else
    {
        $.alert({
            title: '',
            content: 'Please Enter Category Name.',
            theme: 'material'
        });
    }
}

//Edit Category
$('.btn-editcategory').click(function(){
    $('.edit-category').empty();
    for(var i=0; i<editCategory.length; i++){
        $('.edit-category').append('<option value="'+editCategory[i].id+'">'+editCategory[i].category+'</option>');
    }
});

function editCategorySave(){
    var categoryId = $('.edit-category').val();
    var category = $('#edit-category').val().toUpperCase();

    $.ajax({
        type: "PATCH",
        contentType: "application/json; charset=utf-8",
        url: "http://127.0.0.1:8000/category/"+categoryId+"/",
        data: JSON.stringify({"category": category}),
        success: function(){
            $('#editCategoryModal').modal('hide');
            categories();
        }
    })
}

//Book List
var book_table = $('#book-dataTable').DataTable();
function dataTableLoad(){
    authors();
    categories();
    var book = "";

    $.ajax({
        type: "GET",
        contentType: "application/json; charset=utf-8",
        url: "http://127.0.0.1:8000/books/",
        dataType: "json",
        data: JSON.stringify(),
    }).then(function(data){
        for(var i=0; i<data.length; i++){
            book_table.row.add( [
                book + data[i].id,
                book + '<img src="'+data[i].book_cover+'" style="width:100%; height: 120px;">',
                book + data[i].book_name,
                book + data[i].author,
                book + data[i].category,
                book + '<p style="width: 350px; height: 105px; overflow: auto">'+data[i].description+'</p>',
                book + data[i].publisher,
                book + data[i].book_quantity,
                book + data[i].price,
                book + '<button id="edit-book" class="btn btn-success" data-toggle="modal" data-target="#editBookModal" onclick="editBookInformation('+data[i].id+')" > Edit </button>',
            ] ).draw( false );
        }
    });
};

// Convert to Base64 function
const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

$('.btn-book').click(function(){
    authors();
    categories();
    $('#addBookModal').modal('show');
})

// Add Book
async function addNewBook(){
    var book_name = $('#add-book-name').val();
    var author = $('#add-book-author-collection').val();
    var category = $('#add-book-category-collection').val();
    var description = $('#add-book-description').val();
    var publisher = $('#add-book-publisher').val();
    var book_quantity = $('#add-book-quantity').val();
    var price =  $('#add-book-price').val();
    var img = $('#add-book-cover')[0].files[0];

    if(book_name!='' && author!='' && category!='' && description!='' && publisher!='' && book_quantity!='' && price!='' && img!= undefined)
    {
        var bookData = {
            "book_name": book_name,
            "author": author,
            "category": category,
            "description": description,
            "publisher": publisher,
            "book_quantity": book_quantity,
            "price": price,
            "book_cover": await toBase64(img),
        };
        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "http://127.0.0.1:8000/books/",
            dataType: "json",
            data: JSON.stringify(bookData),
            success: function(){
                clearAddBookModal();
                book_table.clear();
                dataTableLoad();
            }
        });
    }
    else
    {
        $.alert({
            title: '',
            content: 'Please fills data.',
            theme: 'material'
        });
    }

};

// Clear Book Model Data
function clearAddBookModal(){
    $('#addBookModal').modal('hide');
    $('#add-book-name').val("");
    $('#add-book-author-collection').val("");
    $('#add-book-category-collection').val("");
    $('#add-book-description').val("");
    $('#add-book-publisher').val("");
    $('#add-book-quantity').val("");
    $('#add-book-price').val("");
    $('#add-book-cover').val("");
};

// Retrieve Book Information For Edit
function editBookInformation(id){
    if(id != " "){
        $.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            url: "http://127.0.0.1:8000/books/"+id+"/",
            dataType: "json",
        }).then(function(data){
            $('#edit-book-id').val(data.id);
            $('#edit-book-name').val(data.book_name);
            $('#edit-book-author-collection').val(data.author);
            $('#edit-book-category-collection').val(data.category);
            $('#edit-book-description').val(data.description);
            $('#edit-book-publisher').val(data.publisher);
            $('#edit-book-quantity').val(data.book_quantity);
            $('#edit-book-price').val(data.price);
            $('#book-cover').attr('src', data.book_cover);
        });
    }
};

async function SaveEditBook(){
    var id = $('#edit-book-id').val();
    var book_name = $('#edit-book-name').val();
    var author = $('#edit-book-author-collection').val();
    var category = $('#edit-book-category-collection').val();
    var description = $('#edit-book-description').val();
    var publisher = $('#edit-book-publisher').val();
    var quantity = $('#edit-book-quantity').val();
    var price = $('#edit-book-price').val();
    var cover = $('#edit-book-cover')[0].files[0];
    if (cover == null){var img = cover;}
    else {var img = await toBase64(cover);}

    if (book_name != "" && author != "" && category != "" && description != "" && publisher != "" && quantity != "" && price != "")
    {
        var editeBookData = {
            "book_name": book_name,
            "author": author,
            "category": category,
            "description": description,
            "publisher": publisher,
            "book_quantity": quantity,
            "price": price,
            "book_cover": img,
        };
        $.ajax({
            type: "PATCH",
            contentType: "application/json; charset=utf-8",
            url: "http://127.0.0.1:8000/books/"+id+"/",
            data: JSON.stringify(editeBookData),
            dataType: "json",
            success: function(){
                cancelEditBookModal();
                book_table.clear();
                dataTableLoad();
            }
        });
    }
    else {
        $.alert({
            title: '',
            content: 'Please fills data.',
            theme: 'material'
        });
    }
};

function DeleteBook(){
    var id = $('#edit-book-id').val();
    if(id != "")
    {
        $.ajax({
            type: "DELETE",
            contentType: "application/json; charset=utf-8",
            url: "http://127.0.0.1:8000/books/"+id+"/",
            dataType: "json",
            success: function(){
                cancelEditBookModal();
                book_table.clear();
                book_table.draw();
                dataTableLoad();
            }
        });
    }
};

//Cancel Button
function cancelEditBookModal(){
    $('#editBookModal').modal('hide');
};

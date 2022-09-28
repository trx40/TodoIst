// $.get('/todos', function (data) {
//     console.log(data)
// });
// ------------------------------------------- FORM for adding NEW ITEM------------------------------------------
$('#newItem-form').submit(function (event) {
    event.preventDefault();
    let formData = $(this).serialize();
    if (formData) {
        $.post('/todos', formData, function (data) {
            $('#todo-list').append(
                `
                <li class="list-group-item list-group-item-light d-flex align-items-center">
                            <span data-="TODO" class="flex-grow-1 lead">
                                ${data.text}
                            </span>
                            <div class="gap-2 d-flex align-items-center">

                                <form action="/todos/${data._id}/edit" method="GET">
                                    <button type="submit" class="btn btn-md btn-block btn-warning">Edit</button>
                                </form>


                                <form action="/todos/${data._id}" method="POST" id="delItem-form">
                                    <button type="submit" class="btn btn-md btn-block btn-danger">Delete</button>
                                </form>

                            </div>
                        </li>
                
                `
            )
            $('#newItem-form').find('.form-control').val('')
        });

    }
});

$('#todo-list').on('click', '#editItem-button', function () {
    $(this).parent().siblings('#editItem-form').toggle();
})

// $('#editItem-form').submit(function (event) {
//     event.preventDefault();
//     let formData = $(this).serialize();
//     let formAction = $(this).attr('action');
//     if (formData) {
//         $.ajax({
//             url: formAction,
//             data: formData,
//             type: 'PUT',
//             success: function (data) {
//                 console.log(data)
//             }
//         })
//     }
// });

// $('#delItem-form').submit(function (event) {
//     event.preventDefault();
//     let formAction = $(this).attr('action');
//     $.ajax({
//         url: formAction,
//         type: 'DELETE',
//         success: function (data) {
//             console.log(data)
//         }
//     })
// });
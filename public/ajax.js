$.get('/todos', function (data) {
    console.log(data)
});

$('#newItem').submit(function (e) {
    e.preventDefault();
    let formData = $(this).serialize();
    if (formData) {
        $.post('/todos', formData, function (data) {
            console.log(data);
        });
    }
});
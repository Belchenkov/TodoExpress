$(function() {
    $('.btn-delete').on('click', (e) => {
        e.preventDefault();
        $target = $(e.target);
        const id = $target.attr('data-id');

        // Ajax Delete Task
        $.ajax({
            type: 'DELETE',
            url: '/todo/delete/' + id,
            success: (response) => {
                alert('Deleted Task');
                window.location.href = '/';
            },
            error: (error) => {
                console.log(error);
            }
        });
    });
});

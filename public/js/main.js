$(() => {
    if ($('textarea#ta').length) {
        CKEDITOR.replace('ta')
    }
    $('a.confirmDeletetion').on('click', (e) => {
        if (!confirm('Confirm deletion'))
            return false
    })

    if ($("[data-fancybox]").length) {
        $("[data-fancybox]").fancybox()
    }
})
$(document).ready(
    function() {
        $(document).on('click', '.btn-info1',
            function() {
                $('.info-1').show();
                $('.info-2').hide();
                $('.info-3').hide();
            }
        );
        $(document).on('click', '.btn-add',
            function() {
                $('.info-1').hide();
                $('.info-2').show();
                $('.info-3').hide();
            }
        );
        $(document).on('click', '.btn-features',
            function() {
                $('.info-1').hide();
                $('.info-2').hide();
                $('.info-3').show();
            }
        );

    }
);

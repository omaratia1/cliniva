(function ($) {
    'use strict';

    function initClinivaFooter($scope) {

        const footer = $scope.find('.cliniva-footer')[0];

        if (!footer) {
            return;
        }

        if (footer.dataset.clinivaFooterInitialized === 'yes') {
            return;
        }

        footer.dataset.clinivaFooterInitialized = 'yes';


        /* =====================================================
         * NEWSLETTER
         * ===================================================== */

        const form = footer.querySelector(
            '.cliniva-footer__newsletter-form'
        );

        if (form) {

            form.addEventListener('submit', function (event) {

                event.preventDefault();

                const input = form.querySelector(
                    'input[type="email"]'
                );

                if (!input) {
                    return;
                }

                if (!input.value.trim()) {
                    input.focus();
                    return;
                }

                if (!input.checkValidity()) {
                    input.reportValidity();
                    return;
                }

                /*
                 * Newsletter backend can be connected later.
                 * Currently the form only prevents page reload.
                 */

            });
        }
    }


    /* =========================================================
     * ELEMENTOR FRONTEND
     * ========================================================= */

    $(window).on(
        'elementor/frontend/init',
        function () {

            elementorFrontend.hooks.addAction(
                'frontend/element_ready/cliniva-footer.default',
                initClinivaFooter
            );

        }
    );

})(jQuery);
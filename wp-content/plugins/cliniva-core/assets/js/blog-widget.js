(function ($) {
    'use strict';

    function initBlog($scope) {
        var $blog = $scope.find('.cliniva-blog');

        if (!$blog.length) {
            return;
        }

        if ($blog.data('cliniva-blog-initialized')) {
            return;
        }

        $blog.data('cliniva-blog-initialized', true);

        var $results = $blog.find('.cliniva-blog__results');
        var $pagination = $blog.find('.cliniva-blog__pagination');
        var $search = $blog.find('.cliniva-blog__search-input');
        var $categories = $blog.find('.cliniva-blog__category');
        var dateIcon =
            $blog.attr('data-date-icon') || '';

        var readingIcon =
            $blog.attr('data-reading-icon') || '';
        var state = {
            page: 1,
            category: 0,
            search: '',
            timer: null,
            request: null
        };

        /*
         * Blog configuration.
         */
        function config() {
            var defaults = {
                postsPerPage: 5,
                excerptWords: 18,
                dateIcon: '',
                readingIcon: ''
            };

            if (window.ClinivaBlog) {
                return $.extend(defaults, window.ClinivaBlog);
            }

            return defaults;
        }

        /*
         * AJAX URL.
         */
        function getAjaxUrl() {
            return window.ClinivaBlog &&
                window.ClinivaBlog.ajaxUrl
                ? window.ClinivaBlog.ajaxUrl
                : '';
        }

        /*
         * Nonce.
         */
        function getNonce() {
            return window.ClinivaBlog &&
                window.ClinivaBlog.nonce
                ? window.ClinivaBlog.nonce
                : '';
        }

        /*
         * Scroll to results.
         */
        function scrollToResults() {
            if (!$results.length) {
                return;
            }

            var offset = $results.offset();

            if (!offset) {
                return;
            }

            $('html, body').animate(
                {
                    scrollTop: Math.max(
                        0,
                        offset.top - 100
                    )
                },
                350
            );
        }

        /*
         * AJAX error.
         */
        function showAjaxError() {
            var message =
                'Unable to load posts. Please try again.';

            if (
                window.ClinivaBlog &&
                window.ClinivaBlog.strings &&
                window.ClinivaBlog.strings.error
            ) {
                message =
                    window.ClinivaBlog.strings.error;
            }

            $results.html(
                '<div class="cliniva-blog__empty">' +
                $('<div>')
                    .text(message)
                    .html() +
                '</div>'
            );
        }

        /*
         * AJAX request.
         */
        function request(page, shouldScroll) {
            var ajaxUrl = getAjaxUrl();
            var nonce = getNonce();
            var settings = config();

            if (!ajaxUrl || !nonce) {
                showAjaxError();
                return;
            }

            state.page = page || 1;

            /*
             * Abort previous request.
             */
            if (
                state.request &&
                state.request.readyState !== 4
            ) {
                state.request.abort();
            }

            $results.addClass('is-loading');

            state.request = $.ajax({
                url: ajaxUrl,

                type: 'POST',

                dataType: 'json',

                data: {
                    action: 'cliniva_blog_filter',

                    nonce: nonce,

                    page: state.page,

                    category: state.category,

                    search: state.search,

                    posts_per_page:
                        settings.postsPerPage,

                    excerpt_words:
                        settings.excerptWords,

                   date_icon: dateIcon,

    reading_icon: readingIcon

                }
            });

            /*
             * Success.
             */
            state.request.done(function (response) {

                if (
                    !response ||
                    !response.success ||
                    !response.data
                ) {
                    showAjaxError();
                    return;
                }

                /*
                 * Replace posts.
                 */
                $results.html(
                    response.data.html || ''
                );

                /*
                 * Replace pagination.
                 */
                if (response.data.pagination) {

                    if ($pagination.length) {

                        $pagination.replaceWith(
                            response.data.pagination
                        );

                    } else {

                        $blog.append(
                            response.data.pagination
                        );
                    }

                    $pagination =
                        $blog.find(
                            '.cliniva-blog__pagination'
                        );
                }

                /*
                 * Update current page.
                 */
                $results.attr(
                    'data-page',
                    state.page
                );

                if (shouldScroll !== false) {
                    scrollToResults();
                }
            });

            /*
             * Error.
             */
            state.request.fail(function (
                xhr,
                status
            ) {

                if (status !== 'abort') {

                    showAjaxError();

                    if (
                        window.console &&
                        window.console.error
                    ) {

                        console.error(
                            'Cliniva Blog AJAX error:',
                            xhr.responseText ||
                            status
                        );
                    }
                }
            });

            /*
             * Finish.
             */
            state.request.always(function () {

                $results.removeClass(
                    'is-loading'
                );

                state.request = null;
            });
        }

        /*
         * =====================================================
         * PAGINATION
         * =====================================================
         */

        $blog.on(
            'click',
            '.cliniva-blog__page:not(.is-disabled)',
            function (event) {

                event.preventDefault();

                var page = parseInt(
                    $(this).attr('data-page'),
                    10
                );

                if (
                    page &&
                    page !== state.page
                ) {
                    request(page, true);
                }
            }
        );

        /*
         * =====================================================
         * CATEGORIES
         * =====================================================
         */

        $blog.on(
            'click',
            '.cliniva-blog__category',
            function (event) {

                event.preventDefault();

                $categories.removeClass(
                    'is-active'
                );

                $(this).addClass(
                    'is-active'
                );

                state.category = parseInt(
                    $(this).attr(
                        'data-category'
                    ),
                    10
                ) || 0;

                state.page = 1;

                request(1, true);
            }
        );

        /*
         * =====================================================
         * SEARCH
         * =====================================================
         */

        if ($search.length) {

            $search.on(
                'input',
                function () {

                    var value =
                        $(this).val() || '';

                    clearTimeout(
                        state.timer
                    );

                    state.timer = setTimeout(
                        function () {

                            state.search =
                                $.trim(value);

                            state.page = 1;

                            request(
                                1,
                                false
                            );

                        },
                        450
                    );
                }
            );

            $search.closest('form').on(
                'submit',
                function (event) {

                    event.preventDefault();

                    clearTimeout(
                        state.timer
                    );

                    state.search =
                        $.trim(
                            $search.val() || ''
                        );

                    state.page = 1;

                    request(
                        1,
                        true
                    );
                }
            );
        }

        /*
         * =====================================================
         * HERO SCROLL
         * =====================================================
         */

        $blog.on(
            'click',
            '.cliniva-blog__scroll',
            function (event) {

                var target =
                    $(this).attr('href');

                if (
                    !target ||
                    target.charAt(0) !== '#'
                ) {
                    return;
                }

                var $target =
                    $(target);

                if (!$target.length) {
                    return;
                }

                event.preventDefault();

                $('html, body').animate(
                    {
                        scrollTop: Math.max(
                            0,
                            $target.offset().top - 20
                        )
                    },
                    450
                );
            }
        );
    }

    /*
     * =========================================================
     * ELEMENTOR
     * =========================================================
     */

    $(window).on(
        'elementor/frontend/init',
        function () {

            if (
                window.elementorFrontend &&
                elementorFrontend.hooks
            ) {

                elementorFrontend.hooks.addAction(
                    'frontend/element_ready/cliniva-blog.default',
                    initBlog
                );
            }
        }
    );

    /*
     * =========================================================
     * NORMAL FRONTEND
     * =========================================================
     */

    $(document).ready(function () {

        $('.cliniva-blog').each(function () {

            initBlog(
                $(this).parent()
            );

        });

    });

})(jQuery);
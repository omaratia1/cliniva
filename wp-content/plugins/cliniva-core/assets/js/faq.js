(function ($) {
	'use strict';

	function initClinivaFAQ($scope) {

		const faq = $scope.find('.cliniva-faq')[0];

		if (!faq) {
			return;
		}

		const items = faq.querySelectorAll('.cliniva-faq__item');

		if (!items.length) {
			return;
		}

		items.forEach(function (item) {

			const button = item.querySelector(
				'.cliniva-faq__question'
			);

			const answer = item.querySelector(
				'.cliniva-faq__answer-wrap'
			);

			if (!button || !answer) {
				return;
			}

			/*
			 * Prevent duplicate event listeners
			 */
			if (button.dataset.clinivaFaqInitialized === 'yes') {
				return;
			}

			button.dataset.clinivaFaqInitialized = 'yes';


			button.addEventListener('click', function () {

				const isOpen =
					item.classList.contains('is-open');


				/*
				 * Close all other items
				 */
				items.forEach(function (otherItem) {

					if (otherItem === item) {
						return;
					}

					const otherButton =
						otherItem.querySelector(
							'.cliniva-faq__question'
						);

					const otherAnswer =
						otherItem.querySelector(
							'.cliniva-faq__answer-wrap'
						);

					otherItem.classList.remove('is-open');

					if (otherButton) {
						otherButton.setAttribute(
							'aria-expanded',
							'false'
						);
					}

					if (otherAnswer) {
						otherAnswer.hidden = true;
					}
				});


				/*
				 * Toggle current item
				 */
				if (isOpen) {

					item.classList.remove('is-open');

					button.setAttribute(
						'aria-expanded',
						'false'
					);

					answer.hidden = true;

				} else {

					item.classList.add('is-open');

					button.setAttribute(
						'aria-expanded',
						'true'
					);

					answer.hidden = false;
				}

			});
		});
	}


	/*
	 * Elementor frontend
	 */
	$(window).on(
		'elementor/frontend/init',
		function () {

			elementorFrontend.hooks.addAction(
				'frontend/element_ready/cliniva-faq.default',
				initClinivaFAQ
			);

		}
	);


	/*
	 * Fallback for normal frontend
	 */
	$(document).ready(function () {

		$('.cliniva-faq').each(function () {

			const $faq = $(this);

			if (
				typeof elementorFrontend === 'undefined'
			) {
				initClinivaFAQ($faq.closest('.elementor-element'));
			}

		});

	});

})(jQuery);
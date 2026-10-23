(function ($) {
	'use strict';

	/**
	 * Initialize Cliniva Testimonials
	 */
	function initClinivaTestimonials($scope) {

		/*
		 * Get the main section.
		 */
		const section = $scope.find(
			'.cliniva-testimonials'
		)[0];

		if (!section) {
			console.error(
				'Cliniva Testimonials: Main section not found.'
			);
			return;
		}

		/*
		 * Get slider.
		 */
		const sliderElement = section.querySelector(
			'.cliniva-testimonials__slider'
		);

		if (!sliderElement) {
			console.error(
				'Cliniva Testimonials: Slider not found.'
			);
			return;
		}

		/*
		 * Prevent duplicate initialization.
		 */
		if (
			sliderElement.dataset.clinivaInitialized === 'yes'
		) {

			if (sliderElement.swiper) {
				sliderElement.swiper.update();

				if (sliderElement.swiper.navigation) {
					sliderElement.swiper.navigation.update();
				}

				if (sliderElement.swiper.pagination) {
					sliderElement.swiper.pagination.update();
				}
			}

			return;
		}

		/*
		 * Get navigation elements directly from the section.
		 */
		const nextButton = section.querySelector(
			'.cliniva-testimonials__arrow--next'
		);

		const prevButton = section.querySelector(
			'.cliniva-testimonials__arrow--prev'
		);

		const pagination = section.querySelector(
			'.cliniva-testimonials__dots'
		);

		/*
		 * Check navigation buttons.
		 */
		if (!nextButton || !prevButton) {

			console.error(
				'Cliniva Testimonials: Navigation buttons not found.',
				{
					nextButton: nextButton,
					prevButton: prevButton,
					section: section
				}
			);

			return;
		}

		/*
		 * Read Elementor settings.
		 */
		const autoplayEnabled =
			section.dataset.autoplay === 'yes';

		const autoplaySpeed = parseInt(
			section.dataset.autoplaySpeed || '5000',
			10
		);

		const loopEnabled =
			section.dataset.loop === 'yes';

		/*
		 * Swiper configuration.
		 *
		 * 3 cards visible.
		 * 1 card moves per click.
		 * 40px gap.
		 */
		const options = {

			slidesPerView: 3,

			slidesPerGroup: 1,

			spaceBetween: 40,

			speed: 650,

			loop: loopEnabled,

			rewind: !loopEnabled,

			allowTouchMove: true,

			watchOverflow: false,

			observer: true,

			observeParents: true,

			observeSlideChildren: true,

			grabCursor: true,

			navigation: {
				nextEl: nextButton,
				prevEl: prevButton,
			},

			pagination: {
				el: pagination,
				clickable: true,
			},

			autoplay: autoplayEnabled
				? {
					delay: autoplaySpeed,
					disableOnInteraction: false,
					pauseOnMouseEnter: true,
				}
				: false,
		};

		/*
		 * Make sure Elementor frontend exists.
		 */
		if (
			typeof elementorFrontend === 'undefined'
		) {

			console.error(
				'Cliniva Testimonials: Elementor frontend is not available.'
			);

			return;
		}

		/*
		 * Elementor Swiper utility.
		 *
		 * IMPORTANT:
		 * In modern Elementor this is a constructor,
		 * therefore it MUST be called with "new".
		 */
		if (
			elementorFrontend.utils &&
			typeof elementorFrontend.utils.swiper === 'function'
		) {

			const SwiperHandler =
				elementorFrontend.utils.swiper;

			try {

				new SwiperHandler(
					sliderElement,
					options
				).then(function (swiper) {

					/*
					 * Mark as initialized.
					 */
					sliderElement.dataset.clinivaInitialized =
						'yes';

					sliderElement.classList.add(
						'cliniva-swiper-ready'
					);

					/*
					 * Force update.
					 */
					swiper.update();

					/*
					 * Update navigation.
					 */
					if (swiper.navigation) {
						swiper.navigation.update();
					}

					/*
					 * Update pagination.
					 */
					if (swiper.pagination) {
						swiper.pagination.update();
					}

					console.log(
						'Cliniva Testimonials: Swiper initialized successfully.',
						swiper
					);

				}).catch(function (error) {

					console.error(
						'Cliniva Testimonials: Swiper initialization failed.',
						error
					);

				});

			} catch (error) {

				console.error(
					'Cliniva Testimonials: Could not create Swiper instance.',
					error
				);

			}

		} else {

			/*
			 * Fallback for cases where global Swiper
			 * is available.
			 */
			if (typeof Swiper !== 'undefined') {

				try {

					const swiper =
						new Swiper(
							sliderElement,
							options
						);

					sliderElement.dataset.clinivaInitialized =
						'yes';

					sliderElement.classList.add(
						'cliniva-swiper-ready'
					);

					swiper.update();

					console.log(
						'Cliniva Testimonials: Global Swiper initialized.',
						swiper
					);

				} catch (error) {

					console.error(
						'Cliniva Testimonials: Global Swiper initialization failed.',
						error
					);

				}

			} else {

				console.error(
					'Cliniva Testimonials: Swiper is not available.'
				);
			}
		}
	}


	/*
	 * Elementor frontend initialization.
	 */
	$(window).on(
		'elementor/frontend/init',
		function () {

			elementorFrontend.hooks.addAction(
				'frontend/element_ready/cliniva-testimonials.default',
				initClinivaTestimonials
			);

		}
	);

})(jQuery);
(function ($) {
	'use strict';

	/**
	 * Cliniva Appointment
	 *
	 * Handles the native Date / Time picker toggle.
	 */

	function initClinivaAppointment($scope) {

		const appointment = $scope.find(
			'.cliniva-appointment'
		);

		if (!appointment.length) {
			return;
		}

		/*
		 * =====================================================
		 * DATE & TIME PICKER TOGGLE
		 * =====================================================
		 *
		 * First click:
		 *      Opens the native picker normally.
		 *
		 * Second click:
		 *      Prevents the default action and blurs the field,
		 *      which closes the native picker.
		 */

		const dateInput = appointment.find(
			'input[type="date"]'
		)[0];

		const timeInput = appointment.find(
			'input[type="time"]'
		)[0];


		function setupPickerToggle(input) {

			if (!input) {
				return;
			}

			/*
			 * Prevent duplicate initialization
			 */
			if (
				input.dataset.clinivaPickerReady === 'yes'
			) {
				return;
			}

			input.dataset.clinivaPickerReady = 'yes';


			input.addEventListener(
				'mousedown',
				function (event) {

					/*
					 * If this input is already focused,
					 * the picker is most likely open.
					 *
					 * Prevent the second click from reopening
					 * the picker and blur the input to close it.
					 */

					if (
						document.activeElement === input
					) {

						event.preventDefault();

						input.blur();

						return;
					}

					/*
					 * First click:
					 * allow Chrome's native picker to open.
					 */
				}
			);
		}


		setupPickerToggle(dateInput);
		setupPickerToggle(timeInput);
	}


	/*
	 * =========================================================
	 * ELEMENTOR FRONTEND
	 * =========================================================
	 */

	$(window).on(
		'elementor/frontend/init',
		function () {

			elementorFrontend.hooks.addAction(
				'frontend/element_ready/cliniva-appointment.default',
				initClinivaAppointment
			);

		}
	);

})(jQuery);
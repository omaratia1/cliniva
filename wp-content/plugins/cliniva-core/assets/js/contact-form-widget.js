(function ($) {
	'use strict';

	function initContactForm($scope) {
		var $form = $scope.find('.cliniva-contact-form__form');

		if (!$form.length || $form.data('clinivaReady')) {
			return;
		}

		$form.data('clinivaReady', true);

		$form.on('submit', function (event) {
			event.preventDefault();

			var $feedback = $form.find('.cliniva-contact-form__feedback');
			var $button = $form.find('.cliniva-contact-form__submit');

			$feedback.prop('hidden', true).removeClass('is-success is-error');
			$button.prop('disabled', true);

			$.ajax({
				url: (window.clinivaContactForm && clinivaContactForm.ajaxUrl) || (window.ajaxurl || '/wp-admin/admin-ajax.php'),
				type: 'POST',
				dataType: 'json',
				data: {
					action: 'cliniva_contact_form',
					nonce: $form.data('nonce'),
					recipient: $form.data('recipient'),
					full_name: $form.find('[name="full_name"]').val(),
					email: $form.find('[name="email"]').val(),
					phone: $form.find('[name="phone"]').val(),
					subject: $form.find('[name="subject"]').val(),
					date: $form.find('[name="date"]').val(),
					time: $form.find('[name="time"]').val(),
					message: $form.find('[name="message"]').val()
				}
			})
				.done(function (response) {
					var ok = response && response.success;
					var msg = ok
						? (response.data && response.data.message) || 'Message sent successfully.'
						: (response && response.data && response.data.message) || 'Something went wrong.';

					$feedback
						.text(msg)
						.addClass(ok ? 'is-success' : 'is-error')
						.prop('hidden', false);

					if (ok) {
						$form[0].reset();
					}
				})
				.fail(function () {
					$feedback
						.text('Unable to send message. Please try again.')
						.addClass('is-error')
						.prop('hidden', false);
				})
				.always(function () {
					$button.prop('disabled', false);
				});
		});
	}

	$(window).on('elementor/frontend/init', function () {
		elementorFrontend.hooks.addAction(
			'frontend/element_ready/cliniva-contact-form.default',
			initContactForm
		);
	});
})(jQuery);

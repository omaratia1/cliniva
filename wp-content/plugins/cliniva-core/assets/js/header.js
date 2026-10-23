(function () {
	'use strict';

	function setOpen(header, open) {
		var toggle = header.querySelector('.mobile-toggle');
		var panel = header.querySelector('.cliniva-mobile-panel');
		var overlay = header.querySelector('.cliniva-mobile-overlay');

		header.classList.toggle('mobile-menu-active', open);

		if (toggle) {
			toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
		}

		if (panel) {
			panel.hidden = !open;
			panel.setAttribute('aria-hidden', open ? 'false' : 'true');
		}

		if (overlay) {
			overlay.hidden = !open;
			overlay.setAttribute('aria-hidden', open ? 'false' : 'true');
		}

		document.documentElement.classList.toggle('cliniva-mobile-nav-open', open);
	}

	function initHeader(header) {
		if (!header || header.dataset.clinivaHeaderReady === '1') {
			return;
		}

		header.dataset.clinivaHeaderReady = '1';

		var toggle = header.querySelector('.mobile-toggle');
		var overlay = header.querySelector('.cliniva-mobile-overlay');
		var panel = header.querySelector('.cliniva-mobile-panel');

		if (!toggle || !panel) {
			return;
		}

		setOpen(header, false);

		toggle.addEventListener('click', function (event) {
			event.preventDefault();
			setOpen(header, !header.classList.contains('mobile-menu-active'));
		});

		if (overlay) {
			overlay.addEventListener('click', function () {
				setOpen(header, false);
			});
		}

		panel.querySelectorAll('a').forEach(function (link) {
			link.addEventListener('click', function () {
				setOpen(header, false);
			});
		});
	}

	function initAll() {
		document.querySelectorAll('.cliniva-custom-header').forEach(initHeader);
	}

	document.addEventListener('keydown', function (event) {
		if (event.key !== 'Escape') {
			return;
		}

		document.querySelectorAll('.cliniva-custom-header.mobile-menu-active').forEach(function (header) {
			setOpen(header, false);
		});
	});

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initAll);
	} else {
		initAll();
	}

	if (window.jQuery && window.elementorFrontend) {
		window.jQuery(window).on('elementor/frontend/init', function () {
			elementorFrontend.hooks.addAction(
				'frontend/element_ready/cliniva_header_widget.default',
				function ($scope) {
					initHeader($scope.find('.cliniva-custom-header')[0]);
				}
			);
		});
	}
})();

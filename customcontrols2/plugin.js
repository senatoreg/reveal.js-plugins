/*****************************************************************
** Author: Asvin Goel, goel@telematique.eu
**
** A plugin replacing the default controls by custom controls.
**
** Version: 2.0.1
** 
** License: MIT license (see LICENSE.md)
**
******************************************************************/
window.RevealCustomControls = window.RevealCustomControls || {
    id: 'RevealCustomControls',
    init: function(deck) {
        initCustomControls(deck);
    }
};

const initCustomControls = function(Reveal){
	var config = Reveal.getConfig().customcontrols || {};

	if (Reveal.isSpeakerNotes() && new URLSearchParams(location.search).get('controls') == 'false') return null;
	if (!config?.controls?.length) return this;
	var collapseIcon = config.collapseIcon || '<i class="mdi mdi-chevron-down"></i>';
	var expandIcon = config.expandIcon || '<i class="mdi mdi-chevron-up"></i>';
	var tooltip = config.tooltip || 'Show/hide controls';
	var collapse = config.collapse || false;
	var collapsed = config.collapse || false;
	const maxHeight = (24 + 2 * 10) * config.controls.length + 'px';

	var div = document.createElement( 'div' );
	div.id = 'customcontrols';

	var toggleButton = document.createElement( 'button' );
	toggleButton.id = 'collapse';
	toggleButton.title = tooltip;
	if (collapse)
		toggleButton.classList.add('show');
	 else
		toggleButton.classList.add('hide');
	toggleButton.innerHTML = '<span id="collapse-customcontrols">' + expandIcon + '</span>';

	toggleButton.addEventListener('click', function( event ) {
		var div = document.querySelector("div#customcontrols > div.customcontrols.container.collapsed");
		if ( div ) {
			if ( collapsed ) {
				div.style.maxHeight = maxHeight;
				this.innerHTML = '<span id="collapse-customcontrols">' + collapseIcon + '</span>';
				collapsed = !collapsed;
			} else {
				div.style.maxHeight = '0';
				this.innerHTML = '<span id="collapse-customcontrols">' + expandIcon + '</span>';
				collapsed = !collapsed;
			}
		}
		toggleButton.blur(); // unfocus button
	});

	div.appendChild(toggleButton);

	var controls = document.createElement( 'div' );
	controls.classList.add('customcontrols');
	controls.classList.add('container');
	if (collapse) {
		controls.classList.add('collapsed');
		controls.style.maxHeight = '0';
	}
	for (var i = 0; i < config.controls.length; i++ ) {
		var control = document.createElement( 'div' );
		control.classList.add('customcontrol');
		if ( config.controls[i].id ) {
			control.id = config.controls[i].id;
		}
		control.innerHTML = '<button ' + ( config.controls[i].title ? 'title="' + config.controls[i].title + '" ': '' ) + 'onclick="' + config.controls[i].action + '">' + config.controls[i].icon + '</button>';
		controls.appendChild( control );
	}
	controls.style.setProperty("--controls-width", "none");
	controls.style.setProperty("--controls-height", 24 * config.controls.length);
	div.appendChild( controls );


	document.querySelectorAll(".reveal > div#customcontrols").forEach(el => { el.remove(); });
	document.querySelector(".reveal").appendChild( div );

	document.addEventListener( 'resize', function( event ) {
		// expand controls to make sure they are visible
		var div = document.querySelector("div#customcontrols.collapsed");
		if ( div ) {
			div.classList.remove('collapsed');
		}
	} );

	return this;

};


/*****************************************************************
** Author: Giovanni Senatore, giovanni.senatore@gmail.com
**
** A plugin that adds credits information
**
** Version: 1.0.0
** 
** License: MIT license (see LICENSE.md)
**
******************************************************************/
window.RevealCredits = window.RevealCredits || {
    id: 'RevealCredits',
    init: function(deck) {
        initCredits(deck);
    }
};

const initCredits = function(Reveal){
	let config = Reveal.getConfig().credits || {};
	    prefix = config.prefix,
	    opacity = config.opacity,
	    position = config.position,
	    transform = config.transform,
	    filter = config.filter,
	    color = config.color;

	let div = document.createElement( 'div' );
	div.id = 'credits';
	div.classList.add( 'credits' );
	div.hidden = true;

	if (prefix)
		div.style.setProperty('--r-credits-prefix', "'" + prefix + ":'");

	if (opacity)
		div.style.setProperty('--r-credits-opacity', opacity);

	if (color)
		div.style.setProperty('--r-credits-color', color);

	if (position) {
		if (position['top']) div.style.setProperty('top', position['top']);
		if (position['bottom']) div.style.setProperty('bottom', position['bottom']);
		if (position['right']) div.style.setProperty('right', position['right']);
		if (position['left']) div.style.setProperty('left', position['left']);
	} else {
		div.style.setProperty('top', '50%');
		div.style.setProperty('right', '1%');
	}

	if (transform) {
		div.style.setProperty('transform', transform);
	} else if (!position) {
		div.style.setProperty('transform', 'translateX(50%) rotate(-90deg)');
	}

	if (filter) {
		div.style.setProperty('filter', filter);
	} else {
		div.style.setProperty('filter', 'invert(0.9)');
	}

	document.querySelectorAll('.reveal > div#credits > *').forEach(el => { el.remove(); });
	document.querySelector('.reveal').appendChild( div );

	Reveal.addEventListener('slidechanged', function( event ) {
		document.querySelectorAll('.reveal > div#credits > *').forEach(el => { el.remove(); });

		let infoCredit = event.currentSlide.getAttribute('data-credits');

		if (infoCredit === undefined || infoCredit === null || infoCredit.length === 0) {
			return;
		}

		let fg = event.currentSlide.getAttribute('data-credits-color');

		if (fg)
			div.style.setProperty('color', fg);
		else
			div.style.removeProperty('color');

		let p = document.createElement('p');
		let text = document.createTextNode( infoCredit );
		p.appendChild(text);
		div.appendChild(p);
	});

	Reveal.addEventListener('overviewshown', function( event ) {
		div.style.setProperty('display', 'none');
	});

	Reveal.addEventListener('overviewhidden', function( event ) {
		div.style.removeProperty('display');
	});

	return this;
};

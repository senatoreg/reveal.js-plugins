/*****************************************************************
** Author: Giovanni Senatore, giovanni.senatore@gmail.com
**
** A plugin that adds credit information
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
	let prefix = config.prefix;
	let margin = config.margin;

	let div = document.createElement( 'div' );
	div.id = 'credits';
	div.classList.add( 'credits' );
	div.hidden = true;
	console.debug(config);
	if (prefix)
		div.style.setProperty('--r-credits-prefix', "'" + prefix + ":'");
	if (margin)
		div.style.setProperty('--r-credits-margin', margin);

	document.querySelectorAll('.reveal > div#credits > *').forEach(el => { el.remove(); });
	document.querySelector('.reveal').appendChild( div );

	Reveal.addEventListener('slidechanged', function( event ) {
		event.previousSlide.querySelectorAll('sup.apex').forEach(el => { el.remove(); });

		document.querySelectorAll('.reveal > div#credits > *').forEach(el => { el.remove(); });

		let credit = document.querySelector('.reveal > div#credits');
		let infoCredit = event.currentSlide.getAttribute('data-info-credit');

		if (infoCredit === undefined || infoCredit === null || infoCredit.length === 0) {
			return;
		}

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



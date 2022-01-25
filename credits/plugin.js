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
	var config = Reveal.getConfig().credits || {};
	var width = Reveal.getConfig().width;
	var height = Reveal.getConfig().height;

	var div = document.createElement( 'div' );
	div.id = 'credits';
	div.classList.add( 'credits' );

	var credit = document.createElement( 'div' );
	credit.id = 'credit';
	credit.classList.add( 'credit' );
	div.appendChild(credit);

	document.querySelectorAll('.reveal > div#credits > div#credit > *').forEach(el => { el.remove(); });
	document.querySelector('.reveal').appendChild( div );

	Reveal.addEventListener('slidechanged', function( event ) {
		event.previousSlide.querySelectorAll('sup.apex').forEach(el => { el.remove(); });

		document.querySelectorAll('.reveal > div#credits > div#credit > *').forEach(el => { el.remove(); });

		let credit = document.querySelector('.reveal > div#credits > div#credit');
		let infoCredit = event.currentSlide.getAttribute('data-info-credit');

		if (infoCredit === undefined || infoCredit === null || infoCredit.length === 0) {
			//credit.setAttribute('hidden', '');
			return;
		}

		let p = document.createElement('p');
		let text = document.createTextNode( infoCredit );
		p.appendChild(text);
		credit.appendChild(p);
		//credit.removeAttribute('hidden');
	});

	return this;

};



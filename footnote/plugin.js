/*****************************************************************
** Author: Giovanni Senatore, giovanni.senatore@gmail.com
**
** A plugin that adds footnote information
**
** Version: 1.0.0
** 
** License: MIT license (see LICENSE.md)
**
******************************************************************/
window.RevealFootnote = window.RevealFootnote || {
    id: 'RevealFootnote',
    init: function(deck) {
        initFootnote(deck);
    }
};

const initFootnote = function(Reveal){
	let config = Reveal.getConfig().footnote || {};
	    opacity = config.opacity,
	    position = config.position,
	    transform = config.transform,
	    filter = config.filter,
	    color = config.color;

	let div = document.createElement( 'div' );
	div.id = 'footnote';
	div.classList.add( 'footnote' );
	// div.hidden = true;

	if (opacity)
		div.style.setProperty('--r-footnote-opacity', opacity);

	if (color)
		div.style.setProperty('--r-footnote-color', color);

	if (position) {
		if (position['top']) div.style.setProperty('top', position['top']);
		if (position['bottom']) div.style.setProperty('bottom', position['bottom']);
		if (position['right']) div.style.setProperty('right', position['right']);
		if (position['left']) div.style.setProperty('left', position['left']);
	}

	let ol = document.createElement( 'ol' );
	div.appendChild(ol);

	document.querySelectorAll('.reveal > div#footnote > ol > *').forEach(el => { el.remove(); });
	document.querySelectorAll('.reveal > div#footnote > *').forEach(el => { el.remove(); });
	document.querySelector('.reveal').appendChild( div );
	// document.querySelector('.reveal div.slides').appendChild( div );

	Reveal.addEventListener('slidechanged', function( event ) {
		event.previousSlide.querySelectorAll('span.footnote').forEach(el => { el.remove(); });
		// document.querySelectorAll('.reveal > div#footnote > ol > *').forEach(el => { el.remove(); });
		ol.querySelectorAll('*').forEach(el => { el.remove(); });
		// document.querySelectorAll('.reveal div.slides > div#footnote > ol > *').forEach(el => { el.remove(); });

		const currentSlide = event.currentSlide;
		let slidefootnote = [];
		let color;

		color = getComputedStyle(currentSlide).color;
		currentSlide.querySelectorAll('span[data-footnote]')
			.forEach(function(el) {
				let c;
				let footnote = el.getAttribute('data-footnote');

				let idx = slidefootnote.indexOf(footnote);

				let ref = document.createElement('span');
				ref.classList.add('footnote');
				ref.style.setProperty('font-size', '0.5em');
				ref.style.setProperty('vertical-align', 'super');

				if (idx < 0) {
					slidefootnote.push(footnote);
					c = slidefootnote.length;

					let li = document.createElement('li');
					let text = document.createTextNode( footnote );
					li.style.setProperty('--r-footnote-ref', "'" + c + "'");
					li.style.setProperty('color', color);
					li.appendChild(text);
					ol.appendChild(li);
				} else {
					c = idx + 1;
				}

				let marker = document.createTextNode( c );
				ref.appendChild(marker);
				el.appendChild(ref);
		});

		slidefootnote.length = 0;
		sludefootnote = undefined;
	});

	Reveal.addEventListener('overviewshown', function( event ) {
		div.style.setProperty('display', 'none');
	});

	Reveal.addEventListener('overviewhidden', function( event ) {
		div.style.removeProperty('display');
	});

	return this;
};

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
	let config = Reveal.getConfig().credits || {},
	    size = Reveal.getComputedSlideSize(),
	    prefix = config.prefix,
	    separator = config.separator,
	    opacity = config.opacity,
	    position = config.position || { top: '50%', right: '1%' },
	    transform = config.transform || 'translate(50%, 0) rotate(-90deg)',
	    filter = config.filter || 'invert(0.9)',
	    color = config.color;

	let div = document.createElement( 'div' );
	div.id = 'credits';
	div.classList.add( 'credits' );
	//div.style.setProperty('width', size.width + 'px');
	//div.hidden = true;

	if (prefix)
		div.style.setProperty('--r-credits-prefix', "'" + prefix + "'");

	if (separator)
		div.style.setProperty('--r-credits-separator', "'" + separator + "'");

	if (opacity)
		div.style.setProperty('--r-credits-opacity', opacity);

	if (color)
		div.style.setProperty('--r-credits-color', color);

	if (position.top) div.style.setProperty('top', position.top);
	if (position.bottom) div.style.setProperty('bottom', position.bottom);
	if (position.right) div.style.setProperty('right', position.right);
	if (position.left) div.style.setProperty('left', position.left);

        div.style.setProperty('transform', transform + ' scale(' + Reveal.getScale() + ')');
	div.style.setProperty('filter', filter);

	document.querySelectorAll('.reveal > div#credits > *').forEach(el => { el.remove(); });
	document.querySelector('.reveal').appendChild( div );

	Reveal.addEventListener('slidechanged', function( event ) {
		div.querySelectorAll('*').forEach(el => { el.remove(); });

		let currentSlide = event.currentSlide;

		let credits = currentSlide.getAttribute('data-credits');
		let prefix = currentSlide.getAttribute('data-credits-prefix');
		let separator = currentSlide.getAttribute('data-credits-separator');

		if (credits === undefined || credits === null || credits.length === 0) {
			return;
		}

		let color = currentSlide.getAttribute('data-background-color');

		let p = document.createElement('p');
		if (color)
			p.style.setProperty('color', color);
		if (prefix !== undefined && prefix !== null && prefix.length > 0)
			p.style.setProperty('--r-credits-prefix', "'" + prefix + "'");
		if (separator !== undefined && separator !== null && separator.length > 0)
			p.style.setProperty('--r-credits-separator', "'" + separator + "'");

		let text = document.createTextNode( credits );
		p.appendChild(text);
		div.appendChild(p);
	});

	Reveal.addEventListener('overviewshown', function( event ) {
		div.style.setProperty('display', 'none');
	});

	Reveal.addEventListener('overviewhidden', function( event ) {
		div.style.removeProperty('display');
	});

	Reveal.addEventListener('resize', function(event) {
		div.style.setProperty('transform', transform + ' scale(' + event.scale + ')');
	});

	return this;
};

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
window.RevealFitText = window.RevealFitText || {
    id: 'RevealFitText',
    init: function(deck) {
	initFitText(deck);
    }
};

const initFitText = function(Reveal){
	const attr = 'data-fittext-size';

	let config = Reveal.getConfig().fittext || {},
	    elements = config.elements || [ 'blockquote' ],
	    selector = elements.map(e => e + ':not([' + attr + '])').join(','),
	    scale = config.scale || .7,
	    defaultPixelSize = parseFloat(window.getComputedStyle(document.body).fontSize),
	    size = Reveal.getComputedSlideSize(),
	    maxHeight = size.height * scale;

	Reveal.addEventListener('slidechanged', function( event ) {
	    let curSlide = event.currentSlide,
		prevSlide = event.previousSlide;

	    /*
	    prevSlide.querySelectorAll('blockquote').forEach(function(e, i) {
		    //event.style.removeProperty('max-height');
		    event.style.removeProperty('font-size');
	    });
	    */

	    curSlide.querySelectorAll( selector ).forEach(function(e, i) {
		let s = getComputedStyle(e);
		    //padding = parseInt(s.paddingTop, 10) + parseInt(s.paddingBottom, 10);
		//let client = parseInt(s.height, 10);

		let outerHeight = maxHeight,
		    outerWidth = parseInt(s.width, 10),
		    fontSize = parseInt(s.fontSize, 10),
		    lineHeight = parseInt(s.lineHeight, 10) / fontSize,
		    pixelWidthRatio = defaultPixelSize / fontSize,
		    textLength = e.innerText.length,
		    innerHeight = 0;

		e.querySelectorAll(e.tagName + ' > *').forEach(function(e0, i0) {
		    let s0 = getComputedStyle(e0);

		    innerHeight += parseInt(s0.height, 10);

		    outerHeight -= (parseInt(s0.marginTop, 10) + parseInt(s0.marginBottom, 10));
		    outerHeight -= (parseInt(s0.borderTopWidth, 10) + parseInt(s0.borderBottomWidth, 10));
		    outerHeight -= (parseInt(s0.paddingTop, 10) + parseInt(s0.paddingBottom, 10));
		});

		if (outerHeight < innerHeight) {
		    let ratio = Math.pow(outerHeight * outerWidth / (lineHeight * pixelWidthRatio * textLength), 1/2) / fontSize ;
		    ratio = ratio.toPrecision(4);

		    e.setAttribute(attr, ratio);
		    //e.style.setProperty('max-height', client + 'px');
		    e.style.setProperty('font-size', ratio + 'em');
		    e.style.setProperty('line-height', lineHeight + 'em');
		}
	    });
	});

	return this;
};

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
	    selectorSlide = elements.map(e => e + ':not(.fragment):not([' + attr + '])').join(','),
	    selectorSlideClean = elements.map(e => e + '[' + attr + ']').join(','),
	    selectorFragment = elements.map(e => e + '.fragment.visible:not([' + attr + '])').join(','),
	    selectorFragmentClean = elements.map(e => e + '.fragment.visible[' + attr + ']').join(','),
	    scale = config.scale || .7,
	    defaultPixelSize = parseFloat(window.getComputedStyle(document.body).fontSize),
	    size = Reveal.getComputedSlideSize(),
	    maxHeight = size.height * scale;

	const fittext = function( slide, selector ) {

	    slide.querySelectorAll( selector ).forEach(function(e, i) {
		let s = getComputedStyle(e);
		//let padding = parseInt(s.paddingTop, 10) + parseInt(s.paddingBottom, 10);
		//let client = parseInt(s.height, 10);

		if (s.visibility === 'hidden' || s.display === 'none')
		    return;

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
		    /*
		      ratio is calculated starting from the ratio between the target bounding box size and
		      the actual size of each character bounding box multiplied by number of characters.

		      ratio formula elements:

		      outerHeight * outerWidth -> the outermost element bounding box size in which the text will be fit in
		      lineHeight * pixelWidthRatio -> actual size of a single character bounding box
		      lineHeight * pixelWidthRatio * textLength -> actual size occupied by all character in the text whatever is the shape of bounding box
		      */
		    let ratio = Math.pow(outerHeight * outerWidth / ( (lineHeight * pixelWidthRatio) * textLength ), 1/2) / fontSize ;
		    ratio = ratio.toPrecision(4);

		    if (ratio > 1)
			ratio = (1 / ratio).toPrecision(4);

		    e.setAttribute(attr, ratio);
		    //e.style.setProperty('max-height', client + 'px');
		    e.style.setProperty('font-size', ratio + 'em');
		    e.style.setProperty('line-height', lineHeight + 'em');
		}
	    });
	};

	const unfittext = function ( slide, selector, force ) {
	    slide.querySelectorAll( selector ).forEach(function(e, i) {
		if (e.hasAttribute(attr)) {
		    let s = getComputedStyle(e);
		    if ( !force && ( s.visibility !== 'hidden' || s.display !== 'none') )
			return;
		    e.style.setProperty('font-size', null);
		    e.style.setProperty('line-height', null);
		    e.removeAttribute(attr);
		}
	    });
	};

	Reveal.addEventListener('fragmentshown', function( event ) {
		fittext( Reveal.getCurrentSlide(), selectorFragment );
	});

	Reveal.addEventListener('fragmenthidden', function( event ) {
		unfittext( Reveal.getCurrentSlide(), selectorFragment, false );
	});

	Reveal.addEventListener('slidechanged', function( event ) {
		fittext( event.currentSlide, selectorSlide );
		let indices = Reveal.getIndices();
		if ( indices.f > -1) {
			fittext( Reveal.getCurrentSlide(), selectorFragment );
		}
	});

	/*
	Reveal.addEventListener('beforeslidechange', function( event ) {
		fittext( Reveal.getSlide( event.indexh, event.indexv ), selectorSlide );
	});
	*/

	Reveal.addEventListener('slidetransitionend', function( event ) {
		unfittext( event.previousSlide, selectorSlideClean, true );
	});

	return this;
};

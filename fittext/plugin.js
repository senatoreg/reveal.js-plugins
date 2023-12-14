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
	    elements = config.elements || [ 'blockquote', '.r-auto-fittext' ],
	    selectorSlide = elements.map(e => e + ':not(.fragment):not([' + attr + '])').join(','),
	    selectorSlideClean = elements.map(e => e + '[' + attr + ']').join(','),
	    selectorFragment = elements.map(e => e + '.fragment.visible:not([' + attr + '])').join(','),
	    selectorFragmentClean = elements.map(e => e + '.fragment.visible[' + attr + ']').join(','),
	    defaultScale = config.scale || .8,
	    defaultPixelSize = parseFloat(window.getComputedStyle(document.body).fontSize),
	    size = Reveal.getComputedSlideSize();

	const fittext = function( slide, selector ) {

		slide.querySelectorAll( selector ).forEach(function(e, i) {
			let s = window.getComputedStyle(e),
			    scale = e.getAttribute('data-fittext-scale') || defaultScale,
			    maxHeight = size.height * scale;

			if (s.visibility === 'hidden' || s.display === 'none')
				return;

			let outerHeight = parseFloat(e.clientHeight, 10) - parseFloat(s.paddingTop, 10) - parseFloat(s.paddingBottom, 10),
			    fontSize = parseFloat(s.fontSize, 10),
			    lineHeight = parseFloat(s.lineHeight, 10),
			    lineHeightRatio = lineHeight / fontSize;

			if (maxHeight < outerHeight) {
				let ratio = Math.pow(maxHeight / outerHeight, 0.5);

				e.setAttribute(attr, ratio);
				//e.style.setProperty('max-height', client + 'px');
				e.style.setProperty('font-size', ratio + 'em');
				e.style.setProperty('line-height', lineHeightRatio + 'em');
			}
		});
	};

	const unfittext = function ( slide, selector, force ) {
		slide.querySelectorAll( selector ).forEach(function(e, i) {
			if (e.hasAttribute(attr)) {
				let s = window.getComputedStyle(e);
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

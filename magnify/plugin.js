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
window.RevealMagnify = window.RevealMagnify || {
    id: 'RevealMagnify',
    init: function(deck) {
	initMagnify(deck);
    }
};

const initMagnify = function(Reveal){
	let config = Reveal.getConfig().magnify || {},
	    size = config.size || 0.9;
	let rScale = Reveal.getScale();

	const viewportEval = function() {
		let rect = document.documentElement.getBoundingClientRect(),
		    x = rect.left + rect.width,
		    y = rect.top + rect.height;
		return { 'size': [x, y], 'center': [x / 2, y / 2] };
	};

	let viewport = viewportEval();

	const cleanelem = function(e) {
		e.classList.remove('magnified');
		e.style.setProperty('--r-magnify-scale', null);
		e.style.setProperty('--r-magnify-x', null);
		e.style.setProperty('--r-magnify-y', null);
	};

	const cleanslide = function(slide) {
		slide.querySelectorAll( '.magnify.magnified' ).forEach((e, i) => {
			cleanelem(e);
		});
	};

	const setelem = function(e) {
		let rect = e.getBoundingClientRect(),
		    scale = Math.min(viewport.size[0] * size / rect.width,
				     viewport.size[1] * size / rect.height),
		    center = [ (rect.x + rect.width / 2),
			       (rect.y + rect.height / 2) ];
		let translate = {'x': (viewport.center[0] - center[0]) / rScale,
				 'y': (viewport.center[1] - center[1]) / rScale};

		e.style.setProperty('--r-magnify-scale', scale);
		e.style.setProperty('--r-magnify-x', translate.x + 'px');
		e.style.setProperty('--r-magnify-y', translate.y + 'px');
		e.classList.add( 'magnified' );
	};

	const onclick = function(event) {
		let e = event.currentTarget,
		    magnify = e.classList.contains( 'magnify' ),
		    magnified = e.classList.contains( 'magnified' );

		if (!magnify)
			return;

		if ( !magnified) {
			setelem(e);
		} else {
			cleanelem(e);
		}

	};

	Reveal.addEventListener('ready', function( event ) {
		rScale = Reveal.getScale();
		viewport = viewportEval();
		Reveal.getSlides().forEach((e, i) => {
			let els = e.querySelectorAll('.magnify');
			els.forEach((e0, i0) => {
				e0.addEventListener('click', onclick);
			});
		});
	});

	Reveal.addEventListener('resize', function( event ) {
		rScale = Reveal.getScale();
		viewport = viewportEval();
	});

	Reveal.addEventListener('slidechanged', function( event ) {
		cleanslide(event.previousSlide);
	});

	Reveal.addEventListener('fragmentshown', function( event ) {
		cleanslide(Reveal.getCurrentSlide());
	});

	Reveal.addEventListener('fragmenthidden', function( event ) {
		cleanslide(Reveal.getCurrentSlide());
	});

	return this;
};

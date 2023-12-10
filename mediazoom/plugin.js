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
window.RevealMediazoom = window.RevealMediazoom || {
    id: 'RevealMediazoom',
    init: function(deck) {
	initMediazoom(deck);
    }
};

const initMediazoom = function(Reveal){
	let config = Reveal.getConfig().mediazoom || {},
	    size = config.size,
	    position = config.position;

	let div = document.createElement( 'div' );
	div.id = 'mediazoom';
	div.classList.add( 'mediazoom' );
	div.style.opacity = 0;
	div.style.visibility = 'hidden';

	if (position) {
		if (position.top) div.style.setProperty('top', position.top);
		if (position.bottom) div.style.setProperty('bottom', position.bottom);
		if (position.right) div.style.setProperty('right', position.right);
		if (position.left) div.style.setProperty('left', position.left);
	}
	if (size) {
		if (position.width) div.style.setProperty('width', position.right);
		if (position.height) div.style.setProperty('height', position.left);
	}

	// Content container for IMG and VIDEO
	let content = document.createElement( 'div' );
	content.classList.add( 'mediazoom-content' );
	div.appendChild(content);

	const removemedia = function(el) {
		el.querySelectorAll( 'img, video' ).forEach((e, i) => {
			e.remove();
		});
	};

	const syncmedia = function(el, back) {
		if (back) {
			el.querySelectorAll( 'video' ).forEach((e, i) => {
				let paused = e.paused;
				e.pause();
				e.externalSource.currentTime = e.currentTime;
				/*
				if (!paused) {
					if (!e.externalSource.classList.contains('.fragment') ||
					    e.externalSource.classList.contains('.current-fragment')) {
						e.externalSource.play();
					}
				}
				*/
			});
		} else {
			el.querySelectorAll( 'video' ).forEach((e, i) => {
				if (!e.getAttribute('data-mediazoom-paused')) {
					e.play();
				}
			});
		}
	};

	div.addEventListener('transitionend', (event) => {
		if (div.style.visibility === 'hidden') {
			syncmedia(div, true);
			removemedia(div);
		} else if (div.style.visibility === 'visible') {
			syncmedia(div, false);
		}
	});

	// Controls container for close button
	const forcevisibility = function(el, visible) {
		if (visible) {
			el.style.opacity = 1;
			el.style.visibility = 'visible';
		} else {
			el.style.opacity = 0;
			el.style.visibility = 'hidden';
		}
	};

	const togglevisibility = function(el) {
		let visible = el.style.opacity > 0;
		forcevisibility(el, !visible);
	};

	let controls = document.createElement( 'div' );
	controls.classList.add( 'mediazoom-controls' );
	div.appendChild(controls);

	let close = document.createElement( 'span' );
	close.classList.add( 'mdi' );
	close.classList.add( 'mdi-close-box' );
	close.addEventListener('click', (event) => {
		togglevisibility(div);
	});
	controls.appendChild(close);

	document.querySelectorAll('.reveal > div#mediazoom > *').forEach(el => { el.remove(); });
	document.querySelectorAll('.reveal > div#mediazoom').forEach(el => { el.remove(); });
	document.querySelector('.reveal').appendChild( div );
	// document.querySelector('.reveal div.slides').appendChild( div );

	const onclick = function(event) {
		let source = event.target,
		    currentSlide = Reveal.getCurrentSlide();
		// let fragment = currentSlide.getAttribute('data-fragment');
		if (source.classList.contains('fragment') &&
		    !source.classList.contains('current-fragment'))
			return;

		if (source.tagName === 'IMG') {
			let img = document.createElement( 'img' );
			img.src = source.src;
			content.appendChild(img);
		} else if (source.tagName === 'VIDEO') {
			let paused = source.paused;
			source.pause();
			let video = document.createElement( 'video' );
			video.externalSource = source;
			video.setAttribute( 'controls', '' );
			if (paused)
				video.setAttribute( 'data-mediazoom-paused',  paused);

			let currentSource = document.createElement( 'source' );
			currentSource.src = source.currentSrc;
			video.muted = source.muted;

			video.append( currentSource );

			video.currentTime = source.currentTime;
			content.appendChild(video);
		}

		togglevisibility(div);
	};

	Reveal.addEventListener('ready', function( event ) {
		Reveal.getSlides().forEach((e, i) => {
			let media = e.querySelectorAll('img, video');
			media.forEach((e0, i0) => {
				e0.addEventListener('click', onclick);
			});
		});
	});

	Reveal.addEventListener('slidechanged', function( event ) {
		forcevisibility(div, false);
	});

	Reveal.addEventListener('fragmentshown', function( event ) {
		forcevisibility(div, false);
	});

	return this;
};

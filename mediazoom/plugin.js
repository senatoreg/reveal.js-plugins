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

	let img = document.createElement( 'img' );
	div.appendChild(img);

	let video = document.createElement( 'video' );
	div.appendChild(video);

	const togglevisibility = function(el) {
		let opacity = el.style.opacity;
		if (opacity > 0) {
			el.style.opacity = 0;
			el.style.visibility = 'hidden';
		} else {
			el.style.opacity = 1;
			el.style.visibility = 'visible';
		}
	};

	const removemedia = function(el) {
		let opacity = el.style.opacity;
		if (opacity === 0) {
			img.src = "";
			video.src = "";
		}
	};

	div.addEventListener('click', (event) => {
		togglevisibility(div);
	});

	div.addEventListener('transitionend', (event) => {
		removemedia(div);
	});

	document.querySelectorAll('.reveal > div#mediazoom > *').forEach(el => { el.remove(); });
	document.querySelectorAll('.reveal > div#mediazoom').forEach(el => { el.remove(); });
	document.querySelector('.reveal').appendChild( div );
	// document.querySelector('.reveal div.slides').appendChild( div );

	const onclick = function(event) {
		let source = event.target.src;
		let tag = event.target.tagName;
		console.log(event.target, tag, source);
		if (tag === 'IMG') {
			img.src = source;
		} else if (tag === 'VIDEO') {
			video.src = source;
		}

		togglevisibility(div);
	};

	Reveal.addEventListener('ready', function( event ) {
		Reveal.getSlides().forEach((e, i) => {
			let media = e.querySelectorAll('img');
			media.forEach((e0, i0) => {
				e0.addEventListener('click', onclick);
			});
		});
	});

	return this;
};

/*
//   project-name.........: Song Hunter
//	project-description..: Object-Oriented Programing Game Application. Guess the song name.
//   filename.............: app.js
//	file-description.....: Main application
//	for..................: Team Treehouse Full-Stack Javascript Techdegree Program, Project 4
//	author...............: Joel Cruz
//	date.................: 20230116
//	version..............: 2.0.1
//	version-note.........: Team Treehouse submission
//	note.................:	
//	jsdoc3-documentation.: 100%
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>100
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/





//     JSDoc3 Documentation
/////////////////////////////////////////////////////////////////////////////////////////////////100
/** 
 * Main Application
 * 1. Initialize
 * 2. Create user-input listeners 
 * @file Main song-hunter site application.
 * @version 2.0.1
 * @author Joel Cruz <axis303@gmail.com>
 */





//     Globals Variables, Constants, HTML Elements
/////////////////////////////////////////////////////////////////////////////////////////////////100
let game;

/** 
 * Initial user-interface overlay div-el. Shows 2 buttons:
 * 1. Start Game - Starts game in normal mode.
 * 2. Easy Mode - Starts game in easy mode.
 * @type {HTMLDivElement} overlay
 * @fires overlayClick
 */
//[?]@event overlayClick
const overlay = document.getElementById('overlay');

/** 
 * QWERTY keyboard used for larger screens.
 * div(#qwerty).div(.keyrow).button(.key)
 * @type {HTMLDivElement< HTMLDivElement<HTMLButtonElement> >} qwertyKB
 */
const qwertyKB = document.getElementById('qwerty');

/** 
 * ABCDEF keyboard used for smaller screens.
 * div(#abcdef).div(.keyrow).button(.key)
 * @type {HTMLDivElement< HTMLDivElement<HTMLButtonElement> >} abcdefKB
 */
const abcdefKB = document.getElementById('abcdef');

/** 
 * Scoreboard shows number of attempts remaining
 * div(#scoreboard).ol.li(.tries)
 * @type {HTMLDivElement< HTMLOListElement<HTMLLIElement> >} scoreboard
 */
const scoreboard = document.getElementById('scoreboard');





//     Initialize
/////////////////////////////////////////////////////////////////////////////////////////////////100
document.getElementById('btn__reset').focus();





//     User-Input Event Listeners
/////////////////////////////////////////////////////////////////////////////////////////////////100

/**
 * Overlay Listener - Listens for start- or easy-button click on overlay
 * @param {Event} overlayClick
 * @listens overlayClick
 */
//[?]@name overlayListener
//[?]@function
overlay.addEventListener('click', e => {
	const btn = e.target;

	// Guard clause
	if(btn.tagName!=='BUTTON') return;
	
	// Initialize
	game = new Game();
	
	// Easy-Mode alternatives
	if(btn.id==='btn__easy') {
		game.mode = 'easy';
		
		// Replace hearts with main app exit button
		let html = '';
		html = '<button id="btn__exit">exit</button>';
		scoreboard.innerHTML=html;
		const exit = document.getElementById('btn__exit');
		
		// Event listener for exit button
		exit.addEventListener('click', e => {
			game.missed = 5;
			game.gameOver();
		});
	}

	game.startGame();
});

/**
 * QWERTY, Software Keyboard Listener - Listens for key-button click
 * @param {Event} qwertyClick
 * @listens qwertyClick
 */
qwertyKB.addEventListener('click', e => {
	const key = e.target;
	if(key.tagName==='BUTTON') game.handleInteraction(key);
});

/**
 * ABCDEF, Software Keyboard Listener - Listens for key-button click
 * @param {Event} abcdefClick
 * @listens abcdefClick
 */
abcdefKB.addEventListener('click', e => {
	const key = e.target;
	if(key.tagName==='BUTTON') game.handleInteraction(key);
});

/**
 * Hardware Keyboard Listener - Listens for hardware keyboard keydown
 * @param {Event} kbKeydown
 * @listens kbKeydown
 */
document.addEventListener('keydown', e => {
	const allSoftwareKeys = document.getElementsByClassName('key');
	let key;
	
	// Guard Clause
	if(!/^[a-z]$/.test(e.key)) return;
	if(overlay.style.display!=='none') return;

	// Compare hardware key (e.key) against every software key
	for(let softwareKey of allSoftwareKeys) {
		// (1) Does letter match? && 
		// (2) Is software key visible?
		if(	softwareKey.textContent === e.key &&
			softwareKey.parentElement.parentElement.offsetParent!==null ) { 
				if(softwareKey.disabled) return;
				key = softwareKey;
		}
	}

	game.handleInteraction(key);
});

/**
 * Clean Local Storage - Clear song index tracking array from localStorage on site unload
 * @param {Event} beforeunload
 * @listens beforeunload
 */
window.addEventListener('beforeunload', (e) => {
	e.preventDefault(); // Needed?
	localStorage.removeItem('phraseIs');
}, false);
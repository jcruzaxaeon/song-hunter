/*
//   project-name.........: Song Hunter
//	project-description..: Object-Oriented Programing Game Application. Guess the song name.
//   filename.............: Phrase.js
//	file-description.....: Phrase-class specification.
//	for..................: Team Treehouse Full-Stack Javascript Techdegree Program, Project 4.
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
 * Phrase-Class Specification.
 * @file Phrase-class specification
 * @version 2.0.1
 * @author Joel Cruz <axis303@gmail.com>
 */

/** Phrase-class 
 * - Create an object from a phrase string
 * - Handle phrase display
 * - Test for contained letters */
class Phrase {
	/**
	 * Phrase-object constructor
	 * @param {string} phrase
	 */
	constructor(phrase) {
		this.phrase = phrase.toLowerCase();
	}

	/**
	 * Add phrase to display.
	 */
	addPhraseToDisplay() {
		let HTML = '';
		const phraseUL = document.getElementById('phrase').firstElementChild;

		// [HILI] Build and set phrase HTML
		[...this.phrase].forEach( char => { 
			// Set class list for space or letter
			let classList = 'space';
			if(char!==' ') classList = `hide letter ${char}`;
			// Set character HTML
			HTML+=`<li class="${classList}">${char}</li>`;
		});
		phraseUL.innerHTML=HTML;
		




		// Eliminate word-breaks
		///////////////////////////////////////////////////////////////////////////////////////100
		const letterLIs = document.getElementById('phrase').firstElementChild.children;
		let row2LIs = [];
		let row1LIs = [];
		let breakIndex=0;
		let spaceIndex=0;
		let i=0;
		HTML='';

		// Set word-break index if 2 consecutive letters sit at different vertical positions
		for(i=1; i<letterLIs.length; i++) {
			const prevHeight = letterLIs[i-1].getBoundingClientRect().top;
			const currHeight = letterLIs[i].getBoundingClientRect().top;
				
			// Set word-break index
			if(	letterLIs[i].classList.contains('letter') &&
				letterLIs[i-1].classList.contains('letter') &&
				currHeight > prevHeight ) breakIndex = i;
		}
		
		// If word-break found, create 2 rows
		if(breakIndex!==0) {
			// Find index of 1st space before break
			for(i=breakIndex-1; i>=0; i--) { 
				if( letterLIs[i].classList.contains('space') ) {
					spaceIndex=i;
					break;
				}
			}
			// Create <li> arrays (top/row 1, and botttom/row 2)
			for(i=0; i<=spaceIndex; i++) 
				row1LIs.push(letterLIs[i]);
			for(i=spaceIndex+1; i<letterLIs.length; i++) 
				row2LIs.push(letterLIs[i]);

			// Insert both rows into DOM
			phraseUL.innerHTML='';
			phraseUL.id='songRow1';
			phraseUL.insertAdjacentElement('afterbegin', row1LIs[0]);
			for(i=1; i<row1LIs.length; i++) {
				phraseUL.lastElementChild.insertAdjacentElement('afterend', row1LIs[i]);
			}
			HTML='<ul id="songRow2"></ul>';
			phraseUL.insertAdjacentHTML('afterend', HTML);
			let phrase2UL = document.getElementById('songRow2');
			phrase2UL.insertAdjacentElement('afterbegin', row2LIs[0]);
			for(i=1; i<row2LIs.length; i++) {
				phrase2UL.lastElementChild.insertAdjacentElement('afterend', row2LIs[i]);
			}
		}
		//return;
	}

	/**
	 * Check letter.
	 * @param {String} letter - Single-character string 
	 * @returns {boolean} - True if letter is included in phrase; else false.
	 */
	checkLetter(letter) { return this.phrase.includes(letter); }

	/**
	 * Display matched letter.
	 * @param {String} letter 
	 */
	showMatchedLetter(letter) {
		const matchingLIs = document.getElementsByClassName(letter);
		for(let li of matchingLIs) li.classList.replace('hide', 'show');
	}
}
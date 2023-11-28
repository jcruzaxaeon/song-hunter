/*
//   project-name.........: Song Hunter
//	project-description..: Object-Oriented Programing Game Application. Guess the song name.
//   filename.............: Game.js
//	file-description.....: Game-Class Specification
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
 * Game-Class Specification.
 * @file Game-class specification
 * @version 2.0.1
 * @author Joel Cruz <axis303@gmail.com>
 */

/** Game-class handling user-interface, phrases, and game-logic */
class Game {

	/** 
	 * Create game instance.
	 * @constructs Game
	 */
	constructor() {
		// Phrase construction
		this.phrases = [];
		const strArr = [
			// Final Set
			//////////////////////////////////////////////////////////////////////////////////100
			
			'Rock and Roll',
			'Black Dog',
			'When the Levee Breaks',
			'Stairway to Heaven',
			'Paranoid',
			'Iron Man',
			'Planet Caravan',
			'Paint It Black',
			'Little Wing',
			'All Along the Watchtower'
			

			// Test Set
			//////////////////////////////////////////////////////////////////////////////////100
			/*
			'a',
			's',
			'd',
			'f',
			'g'
			*/
			
			// Home Set
			//////////////////////////////////////////////////////////////////////////////////100
			/*
			'We Will Rock You xv',
			'We are the Champions xv',
			"I Dont Wanna Hear It xv",
			'Rock n Roll xv',
			'Eye of the Tiger xv'
			*/
		];
		strArr.forEach( str => {
			const obj = new Phrase(str);
			this.phrases.push(obj);
		});
		
		// Properties
		this.missed = 0;
		this.activePhrase = null;
		this.mode = 'hard';

		// Create localStorage song/phrase indices array
		if(localStorage.getItem('phraseIs')==null) {
			this.setPhraseIndices();
		}
	}

	/**
	 * Get local-storage array holding unused phrase-indices
	 * @return {Array<Index>} Holds unused phrase indices
	 */
	get phraseIndices() {
		return JSON.parse(localStorage.phraseIs);
	}
	
	/**
	 * Set local-storage array holding unused phrase-indices
	 */
	setPhraseIndices() {
		let phraseIs = [];
		for(let i=0; i<this.phrases.length; i++) {
			phraseIs.push(i);
		}
		localStorage.phraseIs = JSON.stringify(phraseIs);
	}

	/**
	 * Initialize game
	 */
	startGame() {
		// jQuery animation for smooth transition to remove overlay 
		$('#overlay').hide(500);

		this.activePhrase = this.getRandomPhrase();
		this.activePhrase.addPhraseToDisplay();
	}

	/**
	 * Compute and return a random phrase-object
	 * @returns {Object} Randomly-selected phrase-object
	 */
	getRandomPhrase() {
		let arr = [];

		// Reset phraseIndices array if empty 
		// - this.phraseIndices: localStorage array holding unused phrase indices
		if(this.phraseIndices.length===0) {
			this.setPhraseIndices();
		}
		
		// Create an index for unused index-array
		let indicesIndex = Math.floor( Math.random()*this.phraseIndices.length );
		// Create index for phrases-array
		const phrasesIndex = this.phraseIndices[indicesIndex];
		
		// (1) Make a temporary copy of unused index-array
		arr = this.phraseIndices.slice(0);
		// (2) Remove the index to be used in phrases-array
		arr.splice(indicesIndex,1);
		// (3) Store modified unused index-array on localStorage
		localStorage.phraseIs = JSON.stringify(arr);
		
		// Return a single, random phrase object
		return this.phrases[phrasesIndex];
	}

	/**
	 * Handle user-interaction upon letter selection
	 * @param {HTMLButtonElement} key 
	 * @returns {null} Early return upon wrong letter selection
	 */
	handleInteraction(key) {
		const letter = key.textContent;
		const match = this.activePhrase.checkLetter(letter);
		
		// Disable keys with matching letter
		///////////////////////////////////////////////////////////////////////////////////////100

		// Determine alternative KB
		let altKBid = 'abcdef';
		if(key.parentElement.parentElement.id==='abcdef') altKBid='qwerty';
		const altKB = document.getElementById(altKBid);
		// Create array of keys on alternate KB
		// Note: Keyboard <div> contains multiple <div>s of keys
		let altKeys = [];
		let altKey, k;
		for(let altKeyColl of altKB.children) {
			for(k of altKeyColl.children) {
				altKeys.push(k);
			}
		}
		// Find mirror key on alternate KB
		for(k of altKeys) {
			if(k.textContent===key.textContent) altKey = k ;
		}
		// Disable visible and non-visible keys with selected letter
		key.disabled = altKey.disabled = true;

		// Finalize
		//////////////////////////////////////////////////////////////////
		// (1) Set wrong/right flags on keys
		// (2) Remove life if wrong in hard-mode
		// (3) Show matching letter if right (add .show to classlist)
		// (4) Call gameOver if 'win'
		if(!match) {
			key.classList.add('wrong');
			altKey.classList.add('wrong');
			if(this.mode==='hard') this.removeLife();
			return;
		}
		key.classList.add('chosen');
		altKey.classList.add('chosen');
		this.activePhrase.showMatchedLetter(letter);
		if( this.checkForWin() ) this.gameOver();
	}

	/**
	 * Check for win.
	 * @returns {Boolean}
	 */
	checkForWin() {
		const letterLIs = document.getElementsByClassName('letter');

		for(let li of letterLIs) {
			if( !li.classList.contains('show') ) return false;
		}

		return true;
	}

	/**
	 * Remove one heart-container, check for game loss.
	 */
	removeLife() {
		const score = document.getElementById('scoreboard').firstElementChild.children;
		const max = score.length;
		
		score[max-this.missed-1].firstElementChild.src='images/lostHeart.png';
		
		this.missed++;
		
		if(this.missed>=5) this.gameOver();
	}

	/**
	 * Game over.
	 */
	gameOver() {
			// Slow transition animation from game to overlay
			$('#overlay').show(1000);
			const overlay = document.getElementById('overlay');
		
			// Initialize 'win' game over properties:
			// (1) overlay class name,
			// (2) game over message HTML, 
			// (3) final overlay color
			let resultClassName = 'win';
			let gameOverMsg = `<p>\u2705</p><p class='serif'>Congratulations! The name of the song was:</p><br><p id="song-title">${this.activePhrase.phrase.toUpperCase()}</p><br>`;
			let color = 'green';
			
			// Check for, prepare 'loss' game over propreties
			if(this.missed>=5) {
				resultClassName = 'lose';
				gameOverMsg = `<p>\u2716</p><p class='serif'>Ouff! Try again! The name of the song was:</p><br><p id="song-title">${this.activePhrase.phrase.toUpperCase()}</p><br>`;
				color = 'red';
			}
		
			// Set game over properties
			document.getElementById('game-over-message').innerHTML = gameOverMsg;
			overlay.className=resultClassName;
			overlay.style.backgroundColor = color;
			
			// Board Reset timed out since immediate reset on win/loss is jarring
			setTimeout( () => {
				const phraseDIV = document.getElementById('phrase');
				phraseDIV.innerHTML='<ul></ul>';

				// [HILI] HTMLCollection is live so removing classNames removes from collection
				// live for .getElementsByClassName, .querySelectorAll makes "static" nodelist?
				const chosen = document.querySelectorAll('.chosen');
				const wrong = document.querySelectorAll('.wrong');

				// Reset keys
				this.resetKeys(chosen, 'chosen');
				this.resetKeys(wrong, 'wrong');
				
				// Reset life/heart HTML (in case of Easy-Mode)
				const scoreboard = document.getElementById('scoreboard');
				let html=`
				<ol>
					<li class="tries"><img src="images/liveHeart.png" alt="Heart Icon" height="25" width="30"></li>
					<li class="tries"><img src="images/liveHeart.png" alt="Heart Icon" height="25" width="30"></li>
					<li class="tries"><img src="images/liveHeart.png" alt="Heart Icon" height="25" width="30"></li>
					<li class="tries"><img src="images/liveHeart.png" alt="Heart Icon" height="25" width="30"></li>
					<li class="tries"><img src="images/liveHeart.png" alt="Heart Icon" height="25" width="30"></li>
				</ol>`;
				scoreboard.innerHTML=html;

				// Alternative heart reset
				// const lostHearts = document.querySelectorAll('[src="images/lostHeart.png"]');
				// for(let heart of lostHearts) heart.src='images/liveHeart.png';
				
				// Re-initialization
				document.getElementById('btn__reset').focus();
			}, '1000');
	}

	/**
	 * Reset keys.
	 * @param {NodeListOf<HTMLButtonElement>} keyList - User-selected keys.
	 * - Static node list of button-el's(.key) selected by user before game over
	 * @param {string} className - Key classname indicating button was selected ('wrong'|'chosen')
	 */
	resetKeys(keyList, className) {
		for(let key of keyList) { 
			key.classList.remove(className);
			key.disabled = false;
		}
	}
}
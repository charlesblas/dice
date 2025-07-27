// English letter frequencies based on Zipf's law
const LETTER_FREQUENCIES = {
    'E': 12.70, 'T': 9.06, 'A': 8.17, 'O': 7.51, 'I': 6.97,
    'N': 6.75, 'S': 6.33, 'H': 6.09, 'R': 5.99, 'D': 4.25,
    'L': 4.03, 'C': 2.78, 'U': 2.76, 'M': 2.41, 'W': 2.36,
    'F': 2.23, 'G': 2.02, 'Y': 1.97, 'P': 1.93, 'B': 1.29,
    'V': 0.98, 'K': 0.77, 'J': 0.15, 'X': 0.15, 'Q': 0.10,
    'Z': 0.07
};

// Biblical words for finding related spellings
const BIBLICAL_WORDS = [
    // 2-3 letter biblical words
    'god', 'sin', 'ark', 'eve', 'job', 'lot',
    // 4 letter biblical words
    'adam', 'abel', 'cain', 'noah', 'abba', 'amen', 'holy', 'lamb', 'lord', 'mary', 'paul', 'ruth', 'soul', 'zion',
    // 5 letter biblical words
    'aaron', 'angel', 'bible', 'bless', 'bread', 'cross', 'david', 'devil', 'earth', 'egypt', 'elias', 'faith', 'flesh', 'glory', 'grace', 'heart', 'isaac', 'jacob', 'james', 'jesus', 'jonah', 'judah', 'light', 'mercy', 'moses', 'peace', 'peter', 'psalm', 'satan', 'simon', 'truth', 'water',
    // 6 letter biblical words
    'bethel', 'canaan', 'christ', 'church', 'daniel', 'elijah', 'esther', 'exodus', 'father', 'gospel', 'heaven', 'hebrew', 'israel', 'joseph', 'joshua', 'judean', 'master', 'prayer', 'priest', 'rachel', 'rebuke', 'romans', 'samuel', 'savior', 'spirit', 'temple', 'thomas', 'throne', 'virgin', 'wisdom',
    // 7+ letter biblical words
    'abraham', 'apostle', 'baptism', 'believe', 'bethany', 'blessed', 'brother', 'calvary', 'commandment', 'covenant', 'creator', 'crucify', 'delilah', 'deliver', 'disciple', 'eternal', 'forgive', 'galilee', 'gentile', 'goliath', 'harvest', 'healing', 'holiness', 'jeremiah', 'jerusalem', 'kingdom', 'lazarus', 'levites', 'messiah', 'miracle', 'nazareth', 'paradise', 'passover', 'pentecost', 'pharaoh', 'pharisee', 'philistine', 'prophet', 'proverbs', 'redeemer', 'resurrect', 'righteous', 'sabbath', 'sacrifice', 'salvation', 'samarian', 'sanctify', 'scripture', 'shepherd', 'solomon', 'synagogue', 'tabernacle', 'temptation', 'testament', 'timothy', 'trinity', 'vineyard', 'worship'
];

// Common English words for finding related spellings (positive valence only)
const COMMON_WORDS = [
    // 2-letter words
    'be', 'do', 'go', 'hi', 'me', 'my', 'ok', 'so', 'up', 'us', 'we',
    // 3-letter words
    'ace', 'add', 'aid', 'aim', 'art', 'awe', 'big', 'can', 'day', 'fly', 'fun', 'gem', 'get', 'god', 'hug', 'joy', 'new', 'one', 'our', 'own',
    'pet', 'run', 'sky', 'sun', 'top', 'try', 'use', 'way', 'win', 'wow', 'yes', 'yay', 'zen',
    // 4-letter words
    'able', 'ally', 'apex', 'arts', 'baby', 'ball', 'beam', 'bear', 'best', 'bird', 'blue', 'bold', 'book', 'boom', 'born', 'calm', 'care', 'chic',
    'clap', 'cool', 'cozy', 'cute', 'dawn', 'dear', 'dove', 'draw', 'each', 'earn', 'ease', 'easy', 'epic', 'fair', 'fame', 'fast', 'feel', 'fine',
    'firm', 'flow', 'fond', 'food', 'free', 'full', 'gain', 'game', 'gift', 'glow', 'goal', 'gold', 'good', 'grow', 'hand', 'heal', 'help', 'hero',
    'high', 'home', 'hope', 'huge', 'idea', 'join', 'jump', 'keen', 'kind', 'kiss', 'life', 'lift', 'like', 'link', 'live', 'look', 'love', 'luck',
    'made', 'make', 'many', 'meet', 'mild', 'mind', 'moon', 'more', 'move', 'neat', 'nice', 'open', 'pace', 'park', 'path', 'peak', 'play', 'plus',
    'pool', 'pure', 'real', 'rest', 'rich', 'ride', 'ring', 'rise', 'rock', 'room', 'rose', 'safe', 'save', 'seek', 'ship', 'show', 'sing', 'skip',
    'slow', 'snap', 'soft', 'song', 'soul', 'spot', 'star', 'stay', 'step', 'sure', 'swim', 'take', 'team', 'tend', 'time', 'tiny', 'tops', 'tree',
    'true', 'tune', 'turn', 'twin', 'vast', 'very', 'view', 'vote', 'walk', 'warm', 'wave', 'well', 'when', 'wide', 'will', 'wind', 'wine', 'wing',
    'wins', 'wise', 'wish', 'with', 'work', 'year', 'yoga', 'your',
    // 5-letter words
    'about', 'above', 'adapt', 'adore', 'after', 'agile', 'agree', 'ahead', 'album', 'alert', 'alive', 'allow', 'angel', 'apple', 'arise', 'awake',
    'beach', 'begin', 'being', 'bells', 'berry', 'bless', 'bliss', 'bloom', 'bonus', 'boost', 'brain', 'brave', 'bread', 'bright', 'bring', 'build',
    'burst', 'candy', 'charm', 'cheer', 'child', 'clean', 'clear', 'climb', 'cloud', 'color', 'comet', 'coral', 'craft', 'cream', 'crisp', 'crown',
    'dance', 'dandy', 'depth', 'dream', 'eager', 'early', 'earth', 'enjoy', 'equal', 'exact', 'excel', 'extra', 'faith', 'fancy', 'feast', 'field',
    'fiery', 'first', 'flash', 'fleet', 'float', 'flora', 'focus', 'found', 'fresh', 'fruit', 'funny', 'games', 'genie', 'giant', 'given', 'glass',
    'gleam', 'globe', 'glory', 'grace', 'grand', 'grant', 'grass', 'great', 'green', 'greet', 'group', 'grove', 'grown', 'guard', 'guide', 'happy',
    'heart', 'hello', 'honey', 'honor', 'horse', 'house', 'humor', 'ideal', 'image', 'inner', 'jolly', 'judge', 'juice', 'laugh', 'learn', 'light',
    'links', 'lively', 'lotus', 'loved', 'lower', 'lucky', 'lunar', 'magic', 'major', 'maple', 'march', 'marry', 'match', 'medal', 'merry', 'might',
    'model', 'money', 'month', 'moral', 'music', 'noble', 'north', 'novel', 'nurse', 'ocean', 'offer', 'olive', 'orbit', 'order', 'outer', 'paint',
    'party', 'peace', 'pearl', 'phase', 'phone', 'photo', 'pilot', 'place', 'plain', 'plant', 'plaza', 'poems', 'point', 'polar', 'power', 'pride',
    'prime', 'prize', 'proof', 'proud', 'pupil', 'queen', 'quick', 'quiet', 'quite', 'radio', 'raise', 'ranch', 'rapid', 'reach', 'ready', 'realm',
    'relax', 'renew', 'right', 'river', 'roast', 'robin', 'royal', 'rural', 'saint', 'salad', 'scale', 'scene', 'scope', 'score', 'sense', 'serve',
    'seven', 'shape', 'share', 'sharp', 'shelf', 'shine', 'shore', 'short', 'shown', 'sight', 'silly', 'since', 'skill', 'sleep', 'slide', 'small',
    'smart', 'smile', 'smooth', 'snack', 'solid', 'solve', 'sound', 'south', 'space', 'spare', 'speak', 'speed', 'spend', 'sport', 'squad', 'stage',
    'stand', 'stars', 'start', 'state', 'steam', 'steel', 'still', 'stone', 'store', 'style', 'sugar', 'sunny', 'super', 'sweet', 'swift', 'swing',
    'table', 'teach', 'thank', 'their', 'theme', 'these', 'thick', 'thing', 'think', 'third', 'those', 'three', 'thumb', 'tidal', 'tiger', 'timer',
    'title', 'toast', 'today', 'topic', 'total', 'touch', 'tower', 'track', 'trade', 'trail', 'train', 'treat', 'trend', 'tribe', 'truly', 'trust',
    'truth', 'tulip', 'under', 'union', 'unite', 'unity', 'until', 'upper', 'urban', 'usual', 'valid', 'value', 'venue', 'vital', 'vivid', 'voice',
    'wagon', 'watch', 'water', 'waves', 'wheel', 'where', 'which', 'while', 'white', 'whole', 'whose', 'woman', 'women', 'world', 'worth', 'would',
    'write', 'young', 'yours', 'youth',
    // 6-letter words
    'active', 'admire', 'adored', 'advent', 'advice', 'affirm', 'agreed', 'amaze', 'angels', 'answer', 'appeal', 'artist', 'awaken', 'beauty', 'become',
    'belief', 'belong', 'better', 'beyond', 'blessed', 'blossom', 'bounce', 'brave', 'breath', 'bright', 'bubble', 'butter', 'camera', 'castle', 'chance',
    'change', 'cheers', 'choice', 'chosen', 'circle', 'clarity', 'clever', 'closer', 'coffee', 'comedy', 'coming', 'create', 'credit', 'crowns', 'danced',
    'dazzle', 'delight', 'design', 'desire', 'detail', 'divine', 'donate', 'double', 'dragon', 'dreams', 'easier', 'eleven', 'emerge', 'enable', 'energy',
    'enrich', 'ensure', 'equity', 'escape', 'evolve', 'expand', 'family', 'famous', 'father', 'feasts', 'fellow', 'fiesta', 'finest', 'flower', 'flying',
    'follow', 'forest', 'forget', 'friend', 'future', 'galaxy', 'garden', 'gather', 'genius', 'gentle', 'giving', 'global', 'golden', 'gospel', 'graced',
    'grains', 'growth', 'guitar', 'handle', 'happen', 'harbor', 'health', 'heaven', 'helper', 'heroes', 'honest', 'honors', 'hoping', 'humble', 'humors',
    'ignite', 'impact', 'indeed', 'infant', 'inspire', 'invite', 'island', 'joyful', 'joyous', 'kindle', 'kindly', 'leader', 'legacy', 'lesson', 'letter',
    'lights', 'likely', 'listen', 'lovely', 'living', 'loving', 'luxury', 'magics', 'making', 'manner', 'marble', 'master', 'meadow', 'melody', 'memory',
    'mental', 'merry', 'method', 'mighty', 'mirror', 'modern', 'moment', 'mother', 'motion', 'moving', 'nature', 'nearby', 'nectar', 'newest', 'nicely',
    'normal', 'notice', 'number', 'oceans', 'office', 'opened', 'option', 'orchid', 'origin', 'others', 'palace', 'parent', 'party', 'peace', 'people',
    'person', 'picked', 'planet', 'played', 'player', 'please', 'plenty', 'poetry', 'polish', 'portal', 'praise', 'prayer', 'pretty', 'prince', 'profit',
    'promise', 'proper', 'proven', 'public', 'purple', 'pursue', 'quality', 'queens', 'quietly', 'radiant', 'rainbow', 'raised', 'reader', 'really', 'reason',
    'recent', 'reduce', 'reform', 'regard', 'relief', 'remain', 'remind', 'renews', 'repair', 'rescue', 'result', 'return', 'reward', 'rhythm', 'ribbon',
    'rising', 'sacred', 'safety', 'saving', 'school', 'screen', 'search', 'season', 'second', 'secure', 'select', 'senior', 'served', 'settle', 'shared',
    'shield', 'should', 'showed', 'silver', 'simple', 'simply', 'single', 'sister', 'smooth', 'social', 'solved', 'source', 'spirit', 'spoken', 'spread',
    'spring', 'square', 'stable', 'starry', 'stayed', 'steady', 'stream', 'street', 'strong', 'studio', 'submit', 'succeed', 'summer', 'summit', 'sunday',
    'supply', 'surely', 'switch', 'symbol', 'system', 'talent', 'taught', 'temple', 'tender', 'thanks', 'theory', 'thirty', 'throne', 'ticket', 'timing',
    'toward', 'travel', 'triple', 'trying', 'turned', 'twelve', 'twenty', 'unique', 'united', 'update', 'useful', 'valley', 'valued', 'vendor', 'verbal',
    'victor', 'viewer', 'virtue', 'vision', 'volume', 'walker', 'wanted', 'warmth', 'wealth', 'weekly', 'weight', 'widely', 'window', 'winner', 'winter',
    'wisdom', 'within', 'wonder', 'wooden', 'worker', 'worthy', 'writer', 'yellow'
];
class DiceConfiguration {
    constructor(targetWord, wishlistWords = []) {
        this.targetWord = targetWord.toUpperCase().replace(/\s/g, '');
        this.wishlistWords = wishlistWords.map(w => w.toUpperCase().replace(/\s/g, ''));
        this.lettersNeeded = this.countLetters(this.targetWord);
        this.dice = [];
        this.wishlistAccommodation = {};
    }

    countLetters(word) {
        const count = {};
        for (const letter of word) {
            count[letter] = (count[letter] || 0) + 1;
        }
        return count;
    }

    calculateDiceCount() {
        // Each die can only show one letter at a time
        return this.targetWord.length;
    }

    avoidConflicts(letter1, letter2) {
        const conflicts = [
            ['C', 'K'], ['C', 'S'], ['Q', 'U'], ['X', 'Z'],
            ['B', 'P'], ['D', 'T'], ['F', 'V'], ['G', 'J']
        ];
        
        for (const [c1, c2] of conflicts) {
            if ((letter1 === c1 && letter2 === c2) || (letter1 === c2 && letter2 === c1)) {
                return true;
            }
        }
        return false;
    }

    generateDice() {
        const numDice = this.calculateDiceCount();
        
        // Initialize dice
        this.dice = [];
        for (let i = 0; i < numDice; i++) {
            this.dice.push({
                front: '', back: '', top: '', bottom: '', left: '', right: ''
            });
        }

        // Each die needs to show a specific letter from the target word
        const targetLetters = this.targetWord.split('');
        
        // Track global letter usage to ensure diversity
        const globalLetterCount = {};
        
        // Calculate letter needs for wishlist words
        const wishlistLetterNeeds = {};
        for (const word of this.wishlistWords) {
            const letters = this.countLetters(word);
            for (const [letter, count] of Object.entries(letters)) {
                wishlistLetterNeeds[letter] = Math.max(wishlistLetterNeeds[letter] || 0, count);
            }
        }
        
        // Create a sorted list of all letters by frequency
        const allLetters = Object.keys(LETTER_FREQUENCIES).sort(
            (a, b) => LETTER_FREQUENCIES[b] - LETTER_FREQUENCIES[a]
        );
        
        // Assign letters to dice
        const facePositions = ['front', 'top', 'right', 'back', 'bottom', 'left'];
        
        for (let dieIdx = 0; dieIdx < numDice; dieIdx++) {
            const die = this.dice[dieIdx];
            const targetLetter = targetLetters[dieIdx];
            const assignedToThisDie = new Set();
            
            // First, assign the target letter to the top face
            die.top = targetLetter;
            assignedToThisDie.add(targetLetter);
            globalLetterCount[targetLetter] = (globalLetterCount[targetLetter] || 0) + 1;
            
            // Then assign other letters to remaining faces
            for (const face of facePositions) {
                if (face === 'top') continue;
                
                // Find the best letter
                let bestLetter = null;
                let bestScore = -1;
                
                for (const letter of allLetters) {
                    if (assignedToThisDie.has(letter)) continue;
                    
                    // Check for conflicts
                    let conflict = false;
                    for (const assignedLetter of assignedToThisDie) {
                        if (this.avoidConflicts(letter, assignedLetter)) {
                            conflict = true;
                            break;
                        }
                    }
                    
                    if (conflict) continue;
                    
                    // Calculate score based on frequency and current usage
                    const freqScore = LETTER_FREQUENCIES[letter];
                    const usagePenalty = (globalLetterCount[letter] || 0) * 2;
                    
                    // Moderate boost for wishlist letters, but don't overwhelm frequency-based selection
                    const wishlistBonus = wishlistLetterNeeds[letter] ? 5 : 0;
                    const currentWishlistCoverage = globalLetterCount[letter] || 0;
                    const wishlistNeed = (wishlistLetterNeeds[letter] || 0) - currentWishlistCoverage;
                    // Smaller multiplier to avoid monopolizing
                    const wishlistMultiplier = wishlistNeed > 0 ? Math.min(wishlistNeed * 3, 10) : 0;
                    
                    const score = freqScore - usagePenalty + wishlistBonus + wishlistMultiplier;
                    
                    if (score > bestScore) {
                        bestScore = score;
                        bestLetter = letter;
                    }
                }
                
                if (bestLetter) {
                    die[face] = bestLetter;
                    assignedToThisDie.add(bestLetter);
                    globalLetterCount[bestLetter] = (globalLetterCount[bestLetter] || 0) + 1;
                } else {
                    // If no good letter found, use the least used letter
                    for (let i = allLetters.length - 1; i >= 0; i--) {
                        const letter = allLetters[i];
                        if (!assignedToThisDie.has(letter)) {
                            die[face] = letter;
                            assignedToThisDie.add(letter);
                            globalLetterCount[letter] = (globalLetterCount[letter] || 0) + 1;
                            break;
                        }
                    }
                }
            }
        }
        
        // Check wishlist word accommodation
        this.checkWishlistAccommodation();
        
        return globalLetterCount;
    }
    
    checkWishlistAccommodation() {
        this.wishlistAccommodation = {};
        for (const word of this.wishlistWords) {
            this.wishlistAccommodation[word] = this.canSpellWord(word);
        }
    }

    canSpellWord(word) {
        word = word.toUpperCase();
        
        // Check if we have enough dice
        if (word.length > this.dice.length) {
            return false;
        }
        
        // We need to check if we can assign one die to each letter position
        // This is a bipartite matching problem
        const wordLetters = word.split('');
        
        // Try to find a valid assignment using backtracking
        const usedDice = new Set();
        
        function canMatch(letterIndex) {
            if (letterIndex === wordLetters.length) {
                return true; // All letters matched
            }
            
            const neededLetter = wordLetters[letterIndex];
            
            for (let dieIndex = 0; dieIndex < this.dice.length; dieIndex++) {
                if (usedDice.has(dieIndex)) continue;
                
                const die = this.dice[dieIndex];
                // Check if this die has the needed letter on any face
                let hasLetter = false;
                for (const face of Object.values(die)) {
                    if (face === neededLetter) {
                        hasLetter = true;
                        break;
                    }
                }
                
                if (hasLetter) {
                    usedDice.add(dieIndex);
                    if (canMatch.call(this, letterIndex + 1)) {
                        return true;
                    }
                    usedDice.delete(dieIndex);
                }
            }
            
            return false;
        }
        
        return canMatch.call(this, 0);
    }

    findRelatedWords() {
        const related = [];
        for (const word of COMMON_WORDS) {
            if (word.toUpperCase() !== this.targetWord && this.canSpellWord(word)) {
                related.push(word);
            }
        }
        // Return more words, sorted by length
        return related.sort((a, b) => b.length - a.length).slice(0, 50);
    }

    findBiblicalWords() {
        const biblical = [];
        for (const word of BIBLICAL_WORDS) {
            if (word.toUpperCase() !== this.targetWord && this.canSpellWord(word)) {
                biblical.push(word);
            }
        }
        // Return biblical words sorted by length
        return biblical.sort((a, b) => b.length - a.length).slice(0, 30);
    }
}

function generateDice() {
    const wordInput = document.getElementById('wordInput');
    const word = wordInput.value.trim();
    
    if (!word) {
        alert('Please enter a word or phrase');
        return;
    }
    
    // Show loading
    document.getElementById('loading').style.display = 'block';
    document.getElementById('results').style.display = 'none';
    
    // Simulate processing time for better UX
    setTimeout(() => {
        // Get wishlist words
        const wishlistWords = getWishlistWords();
        
        const config = new DiceConfiguration(word, wishlistWords);
        const letterDistribution = config.generateDice();
        
        // Update summary
        const summaryText = document.getElementById('summaryText');
        summaryText.innerHTML = `
            <strong>Word:</strong> ${config.targetWord} • 
            <strong>Dice needed:</strong> ${config.dice.length}
        `;
        
        // Update letter distribution
        const letterDistDiv = document.getElementById('letterDistribution');
        let gridHtml = '<h4>Letter Distribution:</h4><div class="letter-grid">';
        
        const sortedLetters = Object.keys(letterDistribution).sort();
        for (const letter of sortedLetters) {
            gridHtml += `<div class="letter-stat"><strong>${letter}</strong><span>${letterDistribution[letter]}</span></div>`;
        }
        gridHtml += '</div>';
        
        letterDistDiv.innerHTML = gridHtml;
        
        // Generate dice HTML
        const diceContainer = document.getElementById('diceContainer');
        diceContainer.innerHTML = '';
        
        config.dice.forEach((die, index) => {
            const dieHTML = `
                <div class="die-wrapper">
                    <div class="die-title">Die ${index + 1}</div>
                    <div class="die-container" data-die-index="${index}">
                        <div class="die-layout">
                            <div class="die-face back">
                                <span class="die-face-label">BACK</span>
                                ${die.back || '-'}
                            </div>
                            <div class="die-face top">
                                <span class="die-face-label">TOP</span>
                                ${die.top || '-'}
                            </div>
                            <div class="die-face left">
                                <span class="die-face-label">LEFT</span>
                                ${die.left || '-'}
                            </div>
                            <div class="die-face front">
                                <span class="die-face-label">FRONT</span>
                                ${die.front || '-'}
                            </div>
                            <div class="die-face right">
                                <span class="die-face-label">RIGHT</span>
                                ${die.right || '-'}
                            </div>
                            <div class="die-face bottom">
                                <span class="die-face-label">BOTTOM</span>
                                ${die.bottom || '-'}
                            </div>
                        </div>
                        <div class="die-3d">
                            <div class="die-face front">${die.front || '-'}</div>
                            <div class="die-face back">${die.back || '-'}</div>
                            <div class="die-face top">${die.top || '-'}</div>
                            <div class="die-face bottom">${die.bottom || '-'}</div>
                            <div class="die-face left">${die.left || '-'}</div>
                            <div class="die-face right">${die.right || '-'}</div>
                        </div>
                    </div>
                </div>
            `;
            diceContainer.innerHTML += dieHTML;
        });
        
        // Find and display related words
        const relatedWords = config.findRelatedWords();
        const relatedWordsDiv = document.getElementById('relatedWords');
        relatedWordsDiv.innerHTML = '';
        
        if (relatedWords.length > 0) {
            // Create word list container
            relatedWordsDiv.innerHTML = '<div class="word-list">';
            const wordListDiv = relatedWordsDiv.querySelector('.word-list');
            
            // Group words by length
            const wordsByLength = {};
            relatedWords.forEach(word => {
                const len = word.length;
                if (!wordsByLength[len]) wordsByLength[len] = [];
                wordsByLength[len].push(word);
            });
            
            // Display words grouped by length
            Object.keys(wordsByLength).sort((a, b) => b - a).forEach(length => {
                if (wordsByLength[length].length > 0) {
                    const wordsHtml = wordsByLength[length].map(word => 
                        `<span class="word-tag">${word}</span>`
                    ).join('');
                    wordListDiv.innerHTML += wordsHtml;
                }
            });
            
            // Close word list and add statistics separately
            relatedWordsDiv.innerHTML += '</div>';
            
            // Add statistics
            const totalWords = relatedWords.length;
            const avgLength = (relatedWords.reduce((sum, word) => sum + word.length, 0) / totalWords).toFixed(1);
            relatedWordsDiv.innerHTML += `
                <div class="word-stats">
                    <strong>${totalWords}</strong> words can be spelled • 
                    Average length: <strong>${avgLength}</strong> letters • 
                    Longest: <strong>${relatedWords[0]}</strong> (${relatedWords[0].length} letters)
                </div>
            `;
        } else {
            relatedWordsDiv.innerHTML = '<p style="color: #666;">No related words found</p>';
        }
        
        // Display wishlist results
        if (wishlistWords.length > 0) {
            const wishlistResultsDiv = document.getElementById('wishlistResults');
            const wishlistResultsContent = document.getElementById('wishlistResultsContent');
            
            wishlistResultsContent.innerHTML = '';
            
            for (const word of wishlistWords) {
                const canSpell = config.wishlistAccommodation[word.toUpperCase()];
                const resultClass = canSpell ? 'success' : 'failure';
                const icon = canSpell ? '✓' : '✗';
                
                wishlistResultsContent.innerHTML += `
                    <span class="wishlist-result ${resultClass}">
                        <span class="icon">${icon}</span>
                        ${word}
                    </span>
                `;
            }
            
            wishlistResultsDiv.style.display = 'block';
        } else {
            document.getElementById('wishlistResults').style.display = 'none';
        }
        
        // Find and display biblical words
        const biblicalWords = config.findBiblicalWords();
        const biblicalWordsDiv = document.getElementById('biblicalWords');
        
        if (biblicalWordsDiv) {
            biblicalWordsDiv.innerHTML = '';
            
            if (biblicalWords.length > 0) {
                // Add section title
                biblicalWordsDiv.innerHTML = '<h3>Biblical words you can spell</h3>';
                
                // Create word list container
                biblicalWordsDiv.innerHTML += '<div class="word-list">';
                const wordListDiv = biblicalWordsDiv.querySelector('.word-list');
                
                // Group words by length
                const wordsByLength = {};
                biblicalWords.forEach(word => {
                    const len = word.length;
                    if (!wordsByLength[len]) wordsByLength[len] = [];
                    wordsByLength[len].push(word);
                });
                
                // Display words grouped by length
                Object.keys(wordsByLength).sort((a, b) => b - a).forEach(length => {
                    if (wordsByLength[length].length > 0) {
                        const wordsHtml = wordsByLength[length].map(word => 
                            `<span class="word-tag biblical">${word}</span>`
                        ).join('');
                        wordListDiv.innerHTML += wordsHtml;
                    }
                });
                
                // Close word list and add statistics
                biblicalWordsDiv.innerHTML += '</div>';
                
                // Add statistics
                const totalWords = biblicalWords.length;
                const avgLength = (biblicalWords.reduce((sum, word) => sum + word.length, 0) / totalWords).toFixed(1);
                biblicalWordsDiv.innerHTML += `
                    <div class="word-stats">
                        <strong>${totalWords}</strong> biblical words • 
                        Average length: <strong>${avgLength}</strong> letters • 
                        Longest: <strong>${biblicalWords[0]}</strong> (${biblicalWords[0].length} letters)
                    </div>
                `;
            }
        }
        
        // Hide loading and show results
        document.getElementById('loading').style.display = 'none';
        document.getElementById('results').style.display = 'block';
        
        // Add mouse movement tracking for 3D dice
        setTimeout(() => {
            const dieContainers = document.querySelectorAll('.die-container');
            dieContainers.forEach(container => {
                const die3d = container.querySelector('.die-3d');
                
                container.addEventListener('mousemove', (e) => {
                    const rect = container.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    
                    // Calculate rotation based on mouse position (increased sensitivity)
                    const rotateY = ((x / rect.width) - 0.5) * 180;
                    const rotateX = ((y / rect.height) - 0.5) * -180;
                    
                    die3d.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                });
                
                container.addEventListener('mouseleave', () => {
                    die3d.style.transform = 'rotateX(-20deg) rotateY(30deg)';
                });
            });
        }, 100);
    }, 300);
}

// Generate example on load
window.addEventListener('DOMContentLoaded', () => {
    generateDice();
});

// Allow Enter key to generate
document.getElementById('wordInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        generateDice();
    }
});
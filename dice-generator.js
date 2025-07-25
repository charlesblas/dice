// English letter frequencies based on Zipf's law
const LETTER_FREQUENCIES = {
    'E': 12.70, 'T': 9.06, 'A': 8.17, 'O': 7.51, 'I': 6.97,
    'N': 6.75, 'S': 6.33, 'H': 6.09, 'R': 5.99, 'D': 4.25,
    'L': 4.03, 'C': 2.78, 'U': 2.76, 'M': 2.41, 'W': 2.36,
    'F': 2.23, 'G': 2.02, 'Y': 1.97, 'P': 1.93, 'B': 1.29,
    'V': 0.98, 'K': 0.77, 'J': 0.15, 'X': 0.15, 'Q': 0.10,
    'Z': 0.07
};

// Common English words for finding related spellings
const COMMON_WORDS = [
    'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had',
    'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his',
    'how', 'its', 'may', 'new', 'now', 'old', 'see', 'two', 'way', 'who',
    'boy', 'did', 'its', 'let', 'put', 'say', 'she', 'too', 'use', 'that',
    'with', 'have', 'this', 'will', 'your', 'from', 'they', 'know', 'want',
    'been', 'good', 'much', 'some', 'time', 'very', 'when', 'come', 'here',
    'just', 'like', 'long', 'make', 'many', 'over', 'such', 'take', 'than',
    'them', 'well', 'only', 'year', 'work', 'back', 'call', 'came', 'care',
    'case', 'city', 'down', 'each', 'even', 'find', 'give', 'hand', 'high',
    'keep', 'last', 'left', 'life', 'live', 'look', 'made', 'most', 'move',
    'must', 'name', 'need', 'next', 'open', 'part', 'play', 'said', 'same',
    'seem', 'show', 'side', 'tell', 'turn', 'used', 'want', 'ways', 'week',
    'went', 'were', 'what', 'word', 'work', 'year'
];

class DiceConfiguration {
    constructor(targetWord) {
        this.targetWord = targetWord.toUpperCase().replace(/\s/g, '');
        this.lettersNeeded = this.countLetters(this.targetWord);
        this.dice = [];
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
                    const score = freqScore - usagePenalty;
                    
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
        
        return globalLetterCount;
    }

    canSpellWord(word) {
        word = word.toUpperCase();
        
        // Check if we have enough dice
        if (word.length > this.dice.length) {
            return false;
        }
        
        // For simplicity, check if all letters exist somewhere on the dice
        const allLetters = new Set();
        for (const die of this.dice) {
            for (const face of Object.values(die)) {
                if (face && face !== '*') {
                    allLetters.add(face);
                }
            }
        }
        
        for (const letter of word) {
            if (!allLetters.has(letter)) {
                return false;
            }
        }
        return true;
    }

    findRelatedWords() {
        const related = [];
        for (const word of COMMON_WORDS) {
            if (word.toUpperCase() !== this.targetWord && this.canSpellWord(word)) {
                related.push(word);
            }
        }
        // Return top 20 longest words
        return related.sort((a, b) => b.length - a.length).slice(0, 20);
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
        const config = new DiceConfiguration(word);
        const letterDistribution = config.generateDice();
        
        // Update summary
        const summaryText = document.getElementById('summaryText');
        summaryText.innerHTML = `
            <strong>Word:</strong> ${config.targetWord}<br>
            <strong>Number of dice needed:</strong> ${config.dice.length}
        `;
        
        // Update letter distribution
        const letterDistDiv = document.getElementById('letterDistribution');
        letterDistDiv.innerHTML = '<h4>Letter Distribution:</h4><div class="letter-grid">';
        
        const sortedLetters = Object.keys(letterDistribution).sort();
        for (const letter of sortedLetters) {
            letterDistDiv.innerHTML += `
                <div class="letter-stat">
                    ${letter}: ${letterDistribution[letter]}
                </div>
            `;
        }
        letterDistDiv.innerHTML += '</div>';
        
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
            relatedWords.forEach(word => {
                relatedWordsDiv.innerHTML += `<span class="word-tag">${word}</span>`;
            });
        } else {
            relatedWordsDiv.innerHTML = '<p style="color: #666;">No related words found</p>';
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
#!/usr/bin/env python3
import sys
from collections import Counter
import argparse

# English letter frequencies (approximate) based on Zipf's law
LETTER_FREQUENCIES = {
    'E': 12.70, 'T': 9.06, 'A': 8.17, 'O': 7.51, 'I': 6.97,
    'N': 6.75, 'S': 6.33, 'H': 6.09, 'R': 5.99, 'D': 4.25,
    'L': 4.03, 'C': 2.78, 'U': 2.76, 'M': 2.41, 'W': 2.36,
    'F': 2.23, 'G': 2.02, 'Y': 1.97, 'P': 1.93, 'B': 1.29,
    'V': 0.98, 'K': 0.77, 'J': 0.15, 'X': 0.15, 'Q': 0.10,
    'Z': 0.07
}

# Biblical words for finding related spellings
BIBLICAL_WORDS = [
    # 2-3 letter biblical words
    'god', 'sin', 'ark', 'eve', 'job', 'lot',
    # 4 letter biblical words
    'adam', 'abel', 'cain', 'noah', 'abba', 'amen', 'holy', 'lamb', 'lord', 'mary', 'paul', 'ruth', 'soul', 'zion',
    # 5 letter biblical words
    'aaron', 'angel', 'bible', 'bless', 'bread', 'cross', 'david', 'devil', 'earth', 'egypt', 'elias', 'faith', 'flesh', 
    'glory', 'grace', 'heart', 'isaac', 'jacob', 'james', 'jesus', 'jonah', 'judah', 'light', 'mercy', 'moses', 'peace', 
    'peter', 'psalm', 'satan', 'simon', 'truth', 'water',
    # 6 letter biblical words
    'bethel', 'canaan', 'christ', 'church', 'daniel', 'elijah', 'esther', 'exodus', 'father', 'gospel', 'heaven', 'hebrew', 
    'israel', 'joseph', 'joshua', 'judean', 'master', 'prayer', 'priest', 'rachel', 'rebuke', 'romans', 'samuel', 'savior', 
    'spirit', 'temple', 'thomas', 'throne', 'virgin', 'wisdom',
    # 7+ letter biblical words
    'abraham', 'apostle', 'baptism', 'believe', 'bethany', 'blessed', 'brother', 'calvary', 'commandment', 'covenant', 
    'creator', 'crucify', 'delilah', 'deliver', 'disciple', 'eternal', 'forgive', 'galilee', 'gentile', 'goliath', 
    'harvest', 'healing', 'holiness', 'jeremiah', 'jerusalem', 'kingdom', 'lazarus', 'levites', 'messiah', 'miracle', 
    'nazareth', 'paradise', 'passover', 'pentecost', 'pharaoh', 'pharisee', 'philistine', 'prophet', 'proverbs', 
    'redeemer', 'resurrect', 'righteous', 'sabbath', 'sacrifice', 'salvation', 'samarian', 'sanctify', 'scripture', 
    'shepherd', 'solomon', 'synagogue', 'tabernacle', 'temptation', 'testament', 'timothy', 'trinity', 'vineyard', 'worship'
]

# Common English words for finding related spellings (positive valence only)
COMMON_WORDS = [
    # Short positive words
    'be', 'do', 'go', 'hi', 'me', 'my', 'ok', 'so', 'up', 'us', 'we',
    'ace', 'add', 'aid', 'aim', 'art', 'awe', 'big', 'can', 'day', 'fun',
    'gem', 'get', 'god', 'hug', 'joy', 'new', 'one', 'our', 'own', 'pet',
    'run', 'sky', 'sun', 'top', 'try', 'use', 'way', 'win', 'wow', 'yes',
    # Positive 4-5 letter words
    'able', 'ally', 'baby', 'ball', 'beam', 'bear', 'best', 'bird', 'blue',
    'bold', 'book', 'boom', 'born', 'calm', 'care', 'clap', 'cool', 'cozy',
    'cute', 'dawn', 'dear', 'dove', 'draw', 'each', 'earn', 'ease', 'easy',
    'epic', 'fair', 'fame', 'fast', 'feel', 'fine', 'firm', 'flow', 'fond',
    'food', 'free', 'full', 'gain', 'game', 'gift', 'glow', 'goal', 'gold',
    'good', 'grow', 'hand', 'heal', 'help', 'hero', 'high', 'home', 'hope',
    'huge', 'idea', 'join', 'jump', 'keen', 'kind', 'kiss', 'life', 'lift',
    'like', 'link', 'live', 'look', 'love', 'luck', 'made', 'make', 'many',
    'meet', 'mild', 'mind', 'moon', 'more', 'move', 'neat', 'nice', 'open',
    'pace', 'park', 'path', 'peak', 'play', 'plus', 'pool', 'pure', 'real',
    'rest', 'rich', 'ride', 'ring', 'rise', 'rock', 'room', 'rose', 'safe',
    'save', 'seek', 'ship', 'show', 'sing', 'skip', 'slow', 'snap', 'soft',
    'song', 'soul', 'spot', 'star', 'stay', 'step', 'sure', 'swim', 'take',
    'team', 'tend', 'time', 'tiny', 'tops', 'tree', 'true', 'tune', 'turn',
    'twin', 'vast', 'very', 'view', 'vote', 'walk', 'warm', 'wave', 'well',
    'when', 'wide', 'will', 'wind', 'wine', 'wing', 'wins', 'wise', 'wish',
    'with', 'work', 'year', 'yoga', 'your', 'adapt', 'adore', 'after', 'agile',
    'agree', 'ahead', 'album', 'alert', 'alive', 'allow', 'angel', 'apple',
    'arise', 'awake', 'beach', 'begin', 'being', 'bells', 'berry', 'bless',
    'bliss', 'bloom', 'bonus', 'boost', 'brain', 'brave', 'bread', 'bright',
    'bring', 'build', 'burst', 'candy', 'charm', 'cheer', 'child', 'clean',
    'clear', 'climb', 'cloud', 'color', 'comet', 'coral', 'craft', 'cream',
    'crisp', 'crown', 'dance', 'dandy', 'depth', 'dream', 'eager', 'early',
    'earth', 'enjoy', 'equal', 'exact', 'excel', 'extra', 'faith', 'fancy',
    'feast', 'field', 'fiery', 'first', 'flash', 'fleet', 'float', 'flora',
    'focus', 'found', 'fresh', 'fruit', 'funny', 'games', 'genie', 'giant',
    'given', 'glass', 'gleam', 'globe', 'glory', 'grace', 'grand', 'grant',
    'grass', 'great', 'green', 'greet', 'group', 'grove', 'grown', 'guard',
    'guide', 'happy', 'heart', 'hello', 'honey', 'honor', 'horse', 'house',
    'humor', 'ideal', 'image', 'inner', 'jolly', 'judge', 'juice', 'laugh',
    'learn', 'light', 'links', 'lively', 'lotus', 'loved', 'lower', 'lucky',
    'lunar', 'magic', 'major', 'maple', 'march', 'marry', 'match', 'medal',
    'merry', 'might', 'model', 'money', 'month', 'moral', 'music', 'noble',
    'north', 'novel', 'nurse', 'ocean', 'offer', 'olive', 'orbit', 'order',
    'outer', 'paint', 'party', 'peace', 'pearl', 'phase', 'phone', 'photo',
    'pilot', 'place', 'plain', 'plant', 'plaza', 'poems', 'point', 'polar',
    'power', 'pride', 'prime', 'prize', 'proof', 'proud', 'pupil', 'queen',
    'quick', 'quiet', 'quite', 'radio', 'raise', 'ranch', 'rapid', 'reach',
    'ready', 'realm', 'relax', 'renew', 'right', 'river', 'roast', 'robin',
    'royal', 'rural', 'saint', 'salad', 'scale', 'scene', 'scope', 'score',
    'sense', 'serve', 'seven', 'shape', 'share', 'sharp', 'shelf', 'shine',
    'shore', 'short', 'shown', 'sight', 'silly', 'since', 'skill', 'sleep',
    'slide', 'small', 'smart', 'smile', 'smooth', 'snack', 'solid', 'solve',
    'sound', 'south', 'space', 'spare', 'speak', 'speed', 'spend', 'sport',
    'squad', 'stage', 'stand', 'stars', 'start', 'state', 'steam', 'steel',
    'still', 'stone', 'store', 'style', 'sugar', 'sunny', 'super', 'sweet',
    'swift', 'swing', 'table', 'teach', 'thank', 'their', 'theme', 'these',
    'thick', 'thing', 'think', 'third', 'those', 'three', 'thumb', 'tidal',
    'tiger', 'timer', 'title', 'toast', 'today', 'topic', 'total', 'touch',
    'tower', 'track', 'trade', 'trail', 'train', 'treat', 'trend', 'tribe',
    'truly', 'trust', 'truth', 'tulip', 'under', 'union', 'unite', 'unity',
    'until', 'upper', 'urban', 'usual', 'valid', 'value', 'venue', 'vital',
    'vivid', 'voice', 'wagon', 'watch', 'water', 'waves', 'wheel', 'where',
    'which', 'while', 'white', 'whole', 'whose', 'woman', 'women', 'world',
    'worth', 'would', 'write', 'young', 'yours', 'youth'
]


class DiceConfiguration:
    def __init__(self, target_word, wishlist_words=None):
        self.target_word = target_word.upper().replace(' ', '')
        self.wishlist_words = [w.upper().replace(' ', '') for w in (wishlist_words or [])]
        self.letters_needed = Counter(self.target_word)
        self.dice = []
        self.wishlist_accommodation = {}
        
    def calculate_dice_count(self):
        """Calculate minimum number of dice needed"""
        # Each die can only show one letter at a time
        # So we need as many dice as there are letters in the word
        return len(self.target_word)
    
    def avoid_conflicts(self, letter1, letter2):
        """Check if two letters should avoid being on the same die"""
        conflicts = [
            ('C', 'K'), ('C', 'S'), ('Q', 'U'), ('X', 'Z'),
            ('B', 'P'), ('D', 'T'), ('F', 'V'), ('G', 'J')
        ]
        for c1, c2 in conflicts:
            if (letter1 == c1 and letter2 == c2) or (letter1 == c2 and letter2 == c1):
                return True
        return False
    
    def generate_dice(self):
        """Generate optimal dice configuration"""
        num_dice = self.calculate_dice_count()
        
        # Initialize dice
        self.dice = [{'front': '', 'back': '', 'top': '', 'bottom': '', 'left': '', 'right': ''} 
                     for _ in range(num_dice)]
        
        # Each die needs to show a specific letter from the target word
        target_letters = list(self.target_word)
        
        # Track global letter usage to ensure diversity
        global_letter_count = Counter()
        
        # Calculate letter needs for wishlist words
        wishlist_letter_needs = {}
        for word in self.wishlist_words:
            word_letters = Counter(word)
            for letter, count in word_letters.items():
                wishlist_letter_needs[letter] = max(wishlist_letter_needs.get(letter, 0), count)
        
        # Create a sorted list of all letters by frequency
        all_letters = sorted(LETTER_FREQUENCIES.keys(), 
                           key=lambda x: LETTER_FREQUENCIES[x], reverse=True)
        
        # Assign letters to dice
        face_positions = ['front', 'top', 'right', 'back', 'bottom', 'left']
        
        for die_idx in range(num_dice):
            die = self.dice[die_idx]
            target_letter = target_letters[die_idx]
            assigned_to_this_die = set()
            
            # First, assign the target letter to the top face (the face that will be showing)
            die['top'] = target_letter
            assigned_to_this_die.add(target_letter)
            global_letter_count[target_letter] += 1
            
            # Then assign other letters to remaining faces
            for face in face_positions:
                if face == 'top':
                    continue
                
                # Find the best letter based on:
                # 1. High frequency (Zipf's law)
                # 2. Not overused globally
                # 3. No conflicts with letters on this die
                best_letter = None
                best_score = -1
                
                for letter in all_letters:
                    if letter in assigned_to_this_die:
                        continue
                    
                    # Check for conflicts
                    conflict = False
                    for assigned_letter in assigned_to_this_die:
                        if self.avoid_conflicts(letter, assigned_letter):
                            conflict = True
                            break
                    
                    if conflict:
                        continue
                    
                    # Calculate score based on frequency and current usage
                    freq_score = LETTER_FREQUENCIES[letter]
                    # Penalize overused letters (aim for max 3-4 uses across all dice)
                    usage_penalty = global_letter_count[letter] * 2
                    
                    # Moderate boost for wishlist letters, but don't overwhelm frequency-based selection
                    wishlist_bonus = 5 if letter in wishlist_letter_needs else 0
                    current_wishlist_coverage = global_letter_count[letter]
                    wishlist_need = wishlist_letter_needs.get(letter, 0) - current_wishlist_coverage
                    # Smaller multiplier to avoid monopolizing (cap at 10)
                    wishlist_multiplier = min(wishlist_need * 3, 10) if wishlist_need > 0 else 0
                    
                    score = freq_score - usage_penalty + wishlist_bonus + wishlist_multiplier
                    
                    if score > best_score:
                        best_score = score
                        best_letter = letter
                
                if best_letter:
                    die[face] = best_letter
                    assigned_to_this_die.add(best_letter)
                    global_letter_count[best_letter] += 1
                else:
                    # If no good letter found, use the least used letter
                    for letter in reversed(all_letters):
                        if letter not in assigned_to_this_die:
                            die[face] = letter
                            assigned_to_this_die.add(letter)
                            global_letter_count[letter] += 1
                            break
                    else:
                        die[face] = '*'  # Wildcard as last resort
        
        # Check wishlist word accommodation after generation
        self.check_wishlist_accommodation()
    
    def check_wishlist_accommodation(self):
        """Check which wishlist words can be spelled with the generated dice"""
        self.wishlist_accommodation = {}
        for word in self.wishlist_words:
            self.wishlist_accommodation[word] = self.can_spell_word(word)
    
    def can_spell_word(self, word):
        """Check if a word can be spelled with the current dice configuration"""
        word = word.upper()
        
        # Check if we have enough dice
        if len(word) > len(self.dice):
            return False
        
        # We need to check if we can assign one die to each letter position
        # This is a bipartite matching problem - we'll use backtracking
        word_letters = list(word)
        used_dice = set()
        
        def can_match(letter_index):
            if letter_index == len(word_letters):
                return True  # All letters matched
            
            needed_letter = word_letters[letter_index]
            
            for die_index in range(len(self.dice)):
                if die_index in used_dice:
                    continue
                
                die = self.dice[die_index]
                # Check if this die has the needed letter on any face
                has_letter = any(face == needed_letter for face in die.values())
                
                if has_letter:
                    used_dice.add(die_index)
                    if can_match(letter_index + 1):
                        return True
                    used_dice.remove(die_index)
            
            return False
        
        return can_match(0)
    
    def find_related_words(self):
        """Find other words that can be spelled with these dice"""
        related = []
        for word in COMMON_WORDS:
            if word.upper() != self.target_word and self.can_spell_word(word):
                related.append(word)
        return sorted(related, key=len, reverse=True)[:20]  # Return top 20 longest words
    
    def find_biblical_words(self):
        """Find biblical words that can be spelled with these dice"""
        biblical = []
        for word in BIBLICAL_WORDS:
            if word.upper() != self.target_word and self.can_spell_word(word):
                biblical.append(word)
        return sorted(biblical, key=len, reverse=True)[:15]  # Return top 15 longest biblical words
    
    def display_configuration(self):
        """Display the dice configuration"""
        print(f"\nOptimal dice configuration for spelling '{self.target_word}':")
        print(f"Number of dice needed: {len(self.dice)}\n")
        
        for i, die in enumerate(self.dice, 1):
            print(f"Die {i}:")
            print(f"  Front:  {die['front'] or '-'}")
            print(f"  Top:    {die['top'] or '-'}")
            print(f"  Right:  {die['right'] or '-'}")
            print(f"  Back:   {die['back'] or '-'}")
            print(f"  Bottom: {die['bottom'] or '-'}")
            print(f"  Left:   {die['left'] or '-'}")
            print()
        
        # Show letter distribution
        print("Letter distribution:")
        all_letters = Counter()
        for die in self.dice:
            for face in die.values():
                if face and face != '*':
                    all_letters[face] += 1
        
        for letter in sorted(all_letters.keys()):
            print(f"  {letter}: {all_letters[letter]} faces")
        
        # Show wishlist results
        if self.wishlist_words:
            print(f"\nWishlist words:")
            for word in self.wishlist_words:
                can_spell = self.wishlist_accommodation.get(word, False)
                status = "✓" if can_spell else "✗"
                print(f"  {status} {word.lower()}")
        
        # Show related words
        related = self.find_related_words()
        if related:
            print(f"\nOther words you can spell with these dice:")
            print(", ".join(related))
        
        # Show biblical words
        biblical = self.find_biblical_words()
        if biblical:
            print(f"\nBiblical words you can spell with these dice:")
            print(", ".join(biblical))


def main():
    parser = argparse.ArgumentParser(description='Generate optimal dice configuration for spelling words')
    parser.add_argument('word', help='The word or phrase to spell')
    parser.add_argument('-w', '--wishlist', nargs='*', help='Optional wishlist words to try to accommodate (max 5)')
    
    args = parser.parse_args()
    
    if not args.word:
        print("Please provide a word or phrase to spell")
        sys.exit(1)
    
    # Limit wishlist to 5 words
    wishlist_words = args.wishlist[:5] if args.wishlist else []
    
    config = DiceConfiguration(args.word, wishlist_words)
    config.generate_dice()
    config.display_configuration()


if __name__ == "__main__":
    main()
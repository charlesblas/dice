# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Dice Word Generator application that creates optimal dice configurations for spelling words. It consists of:
- A web application (`index.html` + `dice-generator.js`) with 3D dice visualization
- A Python CLI tool (`dice_word_generator.py`) with the same core algorithm

## Commands

### Running the Application

**Web Version:**
```bash
# Simply open the HTML file in a browser
open index.html
# Or use any static file server
python3 -m http.server 8000
```

**CLI Version:**
```bash
# Run with a word
python3 dice_word_generator.py "HELLO"

# Or use direct execution (file has executable permissions)
./dice_word_generator.py "HELLO WORLD"
```

### Development Commands

This is a simple project with no build tools, tests, or linting configured. Key development tasks:

- **No build process** - Direct HTML/JS/CSS files
- **No tests** - Manual testing only
- **No linting** - No ESLint or Python linters configured
- **Version control** - Standard git commands

## Architecture

### Core Algorithm
Both implementations use the same dice generation algorithm:
1. Each die has 6 faces representing physical positions (top, bottom, front, back, left, right)
2. Top face shows the required letter for the target word
3. Other faces are populated with high-frequency letters using Zipf's law
4. Avoids letter conflicts (e.g., C/K on same die)
5. Optimizes for maximum word-spelling potential

### Frontend Architecture (`dice-generator.js`)
- **DiceConfiguration class**: Encapsulates the dice generation logic
- **UI Components**:
  - 3D dice visualization with CSS transforms
  - Mouse-tracking rotation on hover
  - Letter distribution statistics
  - Related words display
- **No dependencies**: Pure vanilla JavaScript
- **Crisp integration**: Customer support chat widget

### Backend Architecture (`dice_word_generator.py`)
- Standalone CLI tool using only Python standard library
- `argparse` for command-line interface
- No external dependencies or requirements.txt needed

### Key Code Patterns
- Class-based design for dice configuration
- Consistent use of letter frequency data
- Conflict rules for letter placement
- Common word list for finding related spellings

## Important Implementation Details

1. **Letter Frequency**: Both implementations use the same frequency order based on English language statistics
2. **Conflict Rules**: Certain letter pairs (C/K, Q/U, etc.) shouldn't appear on the same die
3. **Face Mapping**: Consistent mapping between face names and physical positions
4. **Word Lists**: Curated list of common English words for finding spellings

## Development Notes

- This is a self-contained project with no external dependencies
- Changes to the algorithm should be mirrored in both JS and Python implementations
- The web version includes visual enhancements (3D dice, animations) not present in CLI
- No automated testing framework - verify changes manually with various input words

## Biblical Words

The dice generator can create configurations for biblical words and names. Examples:

- **Names**: JESUS, MOSES, DAVID, MARY, PETER, PAUL, JOHN
- **Places**: EDEN, ZION, BETHLEHEM, NAZARETH, JERUSALEM
- **Concepts**: FAITH, GRACE, LOVE, HOPE, PEACE, TRUTH
- **Books**: GENESIS, EXODUS, PSALMS, MATTHEW, ROMANS
- **Terms**: GOSPEL, PRAYER, CROSS, ANGEL, HEAVEN, SPIRIT

When generating dice for biblical words, the algorithm works the same way - optimizing letter placement to maximize the number of related words that can be spelled with the same dice set.
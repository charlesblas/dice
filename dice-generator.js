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

// Common English words for finding related spellings (expanded list)
const COMMON_WORDS = [
    // 2-letter words
    'am', 'an', 'as', 'at', 'be', 'by', 'do', 'go', 'he', 'if', 'in', 'is', 'it', 'me', 'my', 'no', 'of', 'on', 'or', 'so', 'to', 'up', 'us', 'we',
    // 3-letter words
    'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his',
    'how', 'its', 'may', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'let', 'put', 'say', 'she', 'too', 'use', 'yet', 'ago',
    'air', 'end', 'why', 'off', 'big', 'few', 'man', 'own', 'run', 'top', 'any', 'far', 'hot', 'let', 'lot', 'low', 'set', 'try', 'god', 'six',
    // 4-letter words
    'that', 'with', 'have', 'this', 'will', 'your', 'from', 'they', 'know', 'want', 'been', 'good', 'much', 'some', 'time', 'very', 'when', 'come',
    'here', 'just', 'like', 'long', 'make', 'many', 'over', 'such', 'take', 'than', 'them', 'well', 'only', 'year', 'work', 'back', 'call', 'came',
    'each', 'even', 'find', 'give', 'hand', 'high', 'keep', 'last', 'left', 'life', 'live', 'look', 'made', 'most', 'move', 'must', 'name', 'need',
    'next', 'open', 'part', 'play', 'said', 'same', 'seem', 'show', 'side', 'tell', 'turn', 'used', 'ways', 'week', 'went', 'were', 'what', 'word',
    'four', 'free', 'full', 'game', 'girl', 'gold', 'hard', 'head', 'help', 'home', 'hope', 'hour', 'idea', 'kind', 'land', 'late', 'less', 'line',
    'love', 'main', 'mean', 'mind', 'miss', 'moon', 'more', 'near', 'nice', 'once', 'page', 'pair', 'pass', 'past', 'path', 'plan', 'poor', 'pull',
    'push', 'read', 'real', 'rest', 'rich', 'ride', 'ring', 'rise', 'road', 'rock', 'room', 'safe', 'save', 'self', 'send', 'ship', 'shop', 'sing',
    'size', 'slow', 'snow', 'soft', 'song', 'soon', 'sort', 'soul', 'spot', 'star', 'stay', 'step', 'stop', 'sure', 'talk', 'task', 'team', 'test',
    'text', 'thin', 'tree', 'true', 'unit', 'upon', 'view', 'wait', 'walk', 'wall', 'warm', 'wash', 'wave', 'wear', 'west', 'wide', 'wife', 'wild',
    'wind', 'wine', 'wing', 'wish', 'wood', 'yard', 'zone', 'able', 'acid', 'aged', 'also', 'area', 'army', 'away', 'baby', 'ball', 'band', 'bank',
    'base', 'bath', 'bear', 'beat', 'beer', 'bell', 'belt', 'best', 'bill', 'bird', 'blow', 'blue', 'boat', 'body', 'bomb', 'bond', 'bone', 'book',
    'boot', 'born', 'boss', 'both', 'bowl', 'bulk', 'burn', 'bush', 'busy', 'cafe', 'cage', 'cake', 'camp', 'card', 'care', 'case', 'cash', 'cast',
    'cell', 'chat', 'chip', 'city', 'club', 'coal', 'coat', 'code', 'cold', 'cook', 'cool', 'cope', 'copy', 'core', 'cost', 'crew', 'crop', 'dark',
    'data', 'date', 'dawn', 'dead', 'deal', 'dean', 'dear', 'debt', 'deck', 'deep', 'desk', 'diet', 'dirt', 'dish', 'does', 'door', 'dose', 'down',
    'draw', 'drew', 'drop', 'drug', 'dual', 'duke', 'dust', 'duty', 'earn', 'ease', 'east', 'easy', 'edge', 'else', 'ever', 'evil', 'exit', 'face',
    'fact', 'fail', 'fair', 'fall', 'farm', 'fast', 'fate', 'fear', 'feed', 'feel', 'feet', 'fell', 'felt', 'file', 'fill', 'film', 'fine', 'fire',
    'firm', 'fish', 'five', 'flat', 'flow', 'folk', 'food', 'foot', 'ford', 'form', 'fort', 'fuel', 'fund', 'gain', 'gang', 'gate', 'gave', 'gear',
    'gene', 'gift', 'glad', 'goal', 'goes', 'gone', 'gray', 'grew', 'grey', 'grow', 'gulf', 'hair', 'half', 'hall', 'hang', 'harm', 'hate', 'heat',
    'held', 'hell', 'hero', 'hide', 'hill', 'hire', 'hold', 'hole', 'holy', 'host', 'huge', 'hung', 'hunt', 'hurt', 'iron', 'item', 'jack', 'jane',
    'jean', 'john', 'join', 'jump', 'jury', 'just', 'keen', 'kill', 'king', 'knee', 'knew', 'lack', 'lady', 'laid', 'lake', 'lane', 'lean', 'leap',
    'left', 'lend', 'lift', 'link', 'list', 'load', 'loan', 'lock', 'logo', 'loss', 'lost', 'loud', 'luck', 'lung', 'mail', 'male', 'mall', 'mark',
    'mass', 'mate', 'meal', 'meat', 'meet', 'menu', 'mere', 'mile', 'milk', 'mine', 'mode', 'mood', 'more', 'neck', 'news', 'nick', 'nine', 'none',
    'noon', 'norm', 'nose', 'note', 'okay', 'onto', 'oral', 'pace', 'pack', 'pain', 'pale', 'palm', 'park', 'peak', 'peer', 'pick', 'pile', 'pine',
    'pink', 'pipe', 'poet', 'pole', 'poll', 'pond', 'pool', 'port', 'post', 'pour', 'pray', 'pure', 'quit', 'race', 'rail', 'rain', 'rank', 'rare',
    'rate', 'rear', 'rely', 'rent', 'rice', 'ride', 'risk', 'role', 'roll', 'roof', 'rope', 'rose', 'rule', 'rush', 'ruth', 'sake', 'sale', 'salt',
    'sand', 'seat', 'seed', 'seek', 'sell', 'shot', 'sick', 'sign', 'silk', 'site', 'skin', 'slip', 'slot', 'soil', 'sold', 'sole', 'spin', 'star',
    'suit', 'swim', 'tail', 'tale', 'tape', 'tend', 'term', 'thin', 'thus', 'tied', 'tile', 'till', 'tiny', 'told', 'tone', 'tony', 'took', 'tool',
    'tour', 'town', 'trap', 'trip', 'tube', 'tune', 'twin', 'type', 'ugly', 'user', 'vary', 'vast', 'vice', 'vote', 'wage', 'wake', 'warn', 'weak',
    'well', 'west', 'wife', 'wild', 'will', 'wind', 'wine', 'wing', 'wire', 'wise', 'wolf', 'wont', 'worn', 'wrap', 'yeah', 'zero',
    // 5-letter words
    'about', 'above', 'adult', 'after', 'again', 'allow', 'alone', 'along', 'among', 'anger', 'angle', 'angry', 'apart', 'apple', 'apply', 'arena',
    'argue', 'arise', 'armed', 'aside', 'asset', 'avoid', 'award', 'aware', 'badly', 'baker', 'bases', 'basic', 'beach', 'began', 'begin', 'being',
    'below', 'bench', 'billy', 'birth', 'black', 'blame', 'blind', 'block', 'blood', 'board', 'boost', 'booth', 'bound', 'brain', 'brand', 'bread',
    'break', 'breed', 'brief', 'bring', 'broad', 'broke', 'brown', 'build', 'built', 'buyer', 'cable', 'calif', 'carry', 'catch', 'cause', 'chain',
    'chair', 'chaos', 'charm', 'chart', 'chase', 'cheap', 'check', 'chest', 'chief', 'child', 'china', 'chose', 'civil', 'claim', 'class', 'clean',
    'clear', 'click', 'climb', 'clock', 'close', 'cloud', 'coach', 'coast', 'could', 'count', 'court', 'cover', 'craft', 'crash', 'crazy', 'cream',
    'crime', 'cross', 'crowd', 'crown', 'crude', 'curve', 'cycle', 'daily', 'dance', 'dated', 'dealt', 'death', 'debut', 'delay', 'delta', 'dense',
    'depot', 'depth', 'doing', 'doubt', 'dozen', 'draft', 'drama', 'drank', 'dream', 'dress', 'drill', 'drink', 'drive', 'drove', 'dying', 'eager',
    'early', 'earth', 'eight', 'either', 'eleven', 'empty', 'enemy', 'enjoy', 'enter', 'entry', 'equal', 'error', 'event', 'every', 'exact', 'exist',
    'extra', 'faith', 'false', 'fault', 'fence', 'fiber', 'field', 'fifth', 'fifty', 'fight', 'final', 'first', 'fixed', 'flash', 'fleet', 'flesh',
    'floor', 'fluid', 'focus', 'force', 'forth', 'forty', 'forum', 'found', 'frame', 'frank', 'fraud', 'fresh', 'front', 'fruit', 'fully', 'funny',
    'giant', 'given', 'glass', 'globe', 'going', 'grace', 'grade', 'grain', 'grand', 'grant', 'grass', 'grave', 'great', 'green', 'gross', 'group',
    'grown', 'guard', 'guess', 'guest', 'guide', 'happy', 'harry', 'heart', 'heavy', 'hence', 'henry', 'horse', 'hotel', 'house', 'human', 'ideal',
    'image', 'imply', 'index', 'inner', 'input', 'issue', 'japan', 'jimmy', 'joint', 'jones', 'judge', 'known', 'label', 'large', 'laser', 'later',
    'laugh', 'layer', 'learn', 'lease', 'least', 'leave', 'legal', 'lemon', 'level', 'lewis', 'light', 'limit', 'links', 'lives', 'local', 'logic',
    'loose', 'lower', 'lucky', 'lunch', 'lying', 'magic', 'major', 'maker', 'march', 'maria', 'match', 'maybe', 'mayor', 'meant', 'media', 'metal',
    'might', 'minor', 'minus', 'mixed', 'model', 'money', 'month', 'moral', 'motor', 'mount', 'mouse', 'mouth', 'moved', 'movie', 'music', 'needs',
    'nerve', 'never', 'newly', 'night', 'noise', 'north', 'noted', 'novel', 'nurse', 'occur', 'ocean', 'offer', 'often', 'order', 'other', 'ought',
    'outer', 'owned', 'owner', 'paint', 'panel', 'paper', 'paris', 'party', 'peace', 'penny', 'peter', 'phase', 'phone', 'photo', 'piano', 'piece',
    'pilot', 'pitch', 'place', 'plain', 'plane', 'plant', 'plate', 'plaza', 'point', 'pound', 'power', 'press', 'price', 'pride', 'prime', 'print',
    'prior', 'prize', 'proof', 'proud', 'prove', 'queen', 'quick', 'quiet', 'quite', 'radio', 'raise', 'range', 'rapid', 'ratio', 'reach', 'ready',
    'realm', 'refer', 'relax', 'reply', 'rider', 'ridge', 'rifle', 'right', 'rigid', 'river', 'robin', 'rocky', 'roger', 'roman', 'rough', 'round',
    'route', 'royal', 'rural', 'scale', 'scene', 'scope', 'score', 'sense', 'serve', 'seven', 'shall', 'shape', 'share', 'sharp', 'sheet', 'shelf',
    'shell', 'shift', 'shine', 'shirt', 'shock', 'shoot', 'shore', 'short', 'shown', 'sight', 'silly', 'simon', 'since', 'sixth', 'sixty', 'sized',
    'skill', 'sleep', 'slide', 'small', 'smart', 'smile', 'smith', 'smoke', 'snake', 'solid', 'solve', 'sorry', 'sound', 'south', 'space', 'spare',
    'speak', 'speed', 'spend', 'spent', 'split', 'spoke', 'sport', 'squad', 'staff', 'stage', 'stake', 'stand', 'stark', 'start', 'state', 'steam',
    'steel', 'stick', 'still', 'stock', 'stone', 'stood', 'store', 'storm', 'story', 'strip', 'stuck', 'study', 'stuff', 'style', 'sugar', 'suite',
    'sunny', 'super', 'surge', 'sweet', 'swift', 'swing', 'sword', 'table', 'taken', 'taste', 'taxes', 'teach', 'teams', 'teeth', 'tempo', 'tends',
    'terry', 'texas', 'thank', 'theft', 'their', 'theme', 'there', 'these', 'thick', 'thing', 'think', 'third', 'those', 'three', 'threw', 'throw',
    'thumb', 'tight', 'timer', 'tired', 'title', 'toast', 'today', 'tommy', 'topic', 'total', 'touch', 'tough', 'tower', 'track', 'trade', 'trail',
    'train', 'trash', 'treat', 'trend', 'trial', 'tribe', 'trick', 'tried', 'tries', 'troop', 'truck', 'truly', 'trump', 'trust', 'truth', 'twice',
    'under', 'undue', 'union', 'unity', 'until', 'upper', 'upset', 'urban', 'usage', 'usual', 'valid', 'value', 'venue', 'video', 'virus', 'visit',
    'vital', 'vocal', 'voice', 'waste', 'watch', 'water', 'weary', 'wheel', 'where', 'which', 'while', 'white', 'whole', 'whose', 'woman', 'women',
    'world', 'worry', 'worse', 'worst', 'worth', 'would', 'wound', 'write', 'wrong', 'wrote', 'yield', 'young', 'yours', 'youth',
    // 6-letter words
    'accept', 'access', 'accord', 'across', 'acting', 'action', 'active', 'actual', 'adhere', 'adjust', 'admire', 'advice', 'affair', 'affect', 'afford',
    'afraid', 'agency', 'agenda', 'agreed', 'aiming', 'albert', 'almost', 'amazon', 'amount', 'animal', 'answer', 'anyone', 'anyway', 'appeal', 'appear',
    'arctic', 'around', 'arrive', 'artist', 'aspect', 'assert', 'assess', 'assist', 'assume', 'assure', 'attach', 'attack', 'attain', 'attend', 'august',
    'author', 'avenue', 'backed', 'backup', 'barely', 'barrel', 'battle', 'beauty', 'became', 'become', 'before', 'behalf', 'behave', 'behind', 'belief',
    'belong', 'berlin', 'beside', 'better', 'beyond', 'bishop', 'border', 'bottle', 'bottom', 'bought', 'branch', 'breast', 'breath', 'bridge', 'bright',
    'broken', 'budget', 'burden', 'bureau', 'button', 'camera', 'campus', 'canada', 'cancel', 'cancer', 'cannot', 'canvas', 'carbon', 'career', 'castle',
    'casual', 'caught', 'center', 'centre', 'chance', 'change', 'chapel', 'charge', 'choice', 'choose', 'chosen', 'church', 'circle', 'client', 'climax',
    'closed', 'closer', 'coffee', 'column', 'combat', 'coming', 'commit', 'common', 'comply', 'cooper', 'copper', 'corner', 'cosmic', 'cotton', 'county',
    'couple', 'course', 'cousin', 'covers', 'create', 'credit', 'crisis', 'custom', 'damage', 'danger', 'daniel', 'dating', 'dealer', 'debate', 'decade',
    'decent', 'decide', 'defeat', 'defend', 'define', 'degree', 'demand', 'depend', 'deputy', 'derive', 'desert', 'design', 'desire', 'detail', 'detect',
    'device', 'devote', 'differ', 'dinner', 'direct', 'doctor', 'dollar', 'domain', 'double', 'driven', 'driver', 'during', 'easily', 'eating', 'editor',
    'effect', 'effort', 'eighth', 'either', 'eleven', 'emerge', 'empire', 'employ', 'enable', 'ending', 'energy', 'engage', 'engine', 'enough', 'ensure',
    'entire', 'entity', 'equity', 'escape', 'estate', 'ethnic', 'europe', 'evolve', 'exceed', 'except', 'excess', 'expand', 'expect', 'expert', 'export',
    'extend', 'extent', 'fabric', 'facial', 'factor', 'failed', 'fairly', 'fallen', 'family', 'famous', 'father', 'fellow', 'female', 'figure', 'filing',
    'finger', 'finish', 'firmly', 'fiscal', 'flight', 'flying', 'follow', 'forced', 'forest', 'forget', 'formal', 'format', 'former', 'foster', 'fought',
    'fourth', 'france', 'french', 'friend', 'frozen', 'future', 'galaxy', 'garage', 'garden', 'gather', 'gender', 'genius', 'gentle', 'german', 'gifted',
    'giving', 'global', 'golden', 'google', 'govern', 'grades', 'gravel', 'ground', 'growth', 'guilty', 'guitar', 'handle', 'happen', 'hardly', 'headed',
    'health', 'height', 'hidden', 'holder', 'honest', 'horror', 'hostage', 'houses', 'humble', 'humor', 'hundred', 'hunger', 'hunter', 'husband', 'ignore',
    'impact', 'import', 'impose', 'inches', 'income', 'indeed', 'infant', 'inform', 'injury', 'insert', 'inside', 'insist', 'intact', 'intend', 'intent',
    'invest', 'island', 'itself', 'jacket', 'joseph', 'junior', 'killed', 'labour', 'latest', 'latter', 'launch', 'lawyer', 'leader', 'league', 'leaves',
    'legacy', 'length', 'lesson', 'letter', 'lights', 'likely', 'linked', 'liquid', 'listen', 'little', 'living', 'locked', 'london', 'longer', 'looked',
    'losing', 'lovely', 'luxury', 'mainly', 'making', 'manage', 'manner', 'manual', 'margin', 'marine', 'marked', 'market', 'martin', 'master', 'matter',
    'mature', 'medium', 'member', 'memory', 'mental', 'merely', 'merger', 'method', 'middle', 'miller', 'mining', 'minute', 'mirror', 'misery', 'missed',
    'mobile', 'modern', 'modest', 'modify', 'moment', 'monday', 'mostly', 'mother', 'motion', 'moving', 'murder', 'muscle', 'museum', 'mutual', 'myself',
    'narrow', 'nation', 'native', 'nature', 'nearby', 'nearly', 'nelson', 'nephew', 'neural', 'newton', 'nobody', 'normal', 'notice', 'notion', 'number',
    'object', 'obtain', 'office', 'offset', 'online', 'opened', 'opening', 'operate', 'opinion', 'oppose', 'option', 'orange', 'origin', 'others', 'output',
    'outside', 'overall', 'oxford', 'oxygen', 'packed', 'palace', 'parent', 'parish', 'partly', 'passed', 'patent', 'paying', 'people', 'period', 'permit',
    'person', 'phrase', 'picked', 'planet', 'played', 'player', 'please', 'plenty', 'pocket', 'poetry', 'pointed', 'poison', 'police', 'policy', 'polish',
    'portal', 'posted', 'potter', 'powder', 'powers', 'prague', 'praise', 'prayer', 'prefer', 'pretty', 'prince', 'prison', 'private', 'profit', 'promise',
    'prompt', 'proper', 'proven', 'public', 'pulled', 'purely', 'purple', 'pursue', 'pushed', 'qualify', 'quality', 'quarter', 'quebec', 'quickly', 'quoted',
    'racing', 'raised', 'random', 'rarely', 'rather', 'rating', 'reader', 'really', 'reason', 'recall', 'recent', 'recipe', 'record', 'reduce', 'reform',
    'refuse', 'regard', 'regime', 'region', 'regret', 'reject', 'relate', 'relief', 'remain', 'remark', 'remind', 'remote', 'remove', 'render', 'repair',
    'repeat', 'replay', 'report', 'rescue', 'resort', 'result', 'retail', 'retain', 'return', 'reveal', 'review', 'revise', 'reward', 'rhythm', 'riding',
    'rising', 'robust', 'ronald', 'rubber', 'ruling', 'rushed', 'russia', 'sacred', 'safety', 'salary', 'sample', 'savage', 'saving', 'saying', 'scheme',
    'school', 'screen', 'script', 'search', 'season', 'second', 'secret', 'sector', 'secure', 'seeing', 'select', 'seller', 'senior', 'sequel', 'series',
    'served', 'settle', 'severe', 'sexual', 'shadow', 'shaped', 'shared', 'sheets', 'shield', 'should', 'showed', 'shower', 'silent', 'silver', 'simple',
    'simply', 'single', 'sister', 'slight', 'smooth', 'social', 'socket', 'solely', 'solved', 'source', 'soviet', 'speaks', 'speech', 'sphere', 'spirit',
    'spoken', 'spread', 'spring', 'square', 'stable', 'status', 'stayed', 'steady', 'steven', 'strain', 'stream', 'street', 'stress', 'strict', 'strike',
    'string', 'stroke', 'strong', 'struck', 'studio', 'stupid', 'submit', 'suburb', 'sudden', 'suffer', 'summer', 'summit', 'sunday', 'supply', 'surely',
    'survey', 'switch', 'symbol', 'system', 'tackle', 'taiwan', 'taking', 'talent', 'talked', 'target', 'taught', 'temple', 'tender', 'tennis', 'thanks',
    'theory', 'thirty', 'thomas', 'though', 'threat', 'throne', 'thrown', 'thrust', 'ticket', 'timber', 'timing', 'tissue', 'toilet', 'tongue', 'tonight',
    'topped', 'toward', 'trader', 'tragic', 'travel', 'treaty', 'triple', 'trying', 'tunnel', 'turkey', 'turned', 'twelve', 'twenty', 'unable', 'unique',
    'united', 'unless', 'unlike', 'update', 'useful', 'valley', 'valued', 'varied', 'vendor', 'verbal', 'vessel', 'victim', 'viewer', 'village', 'violent',
    'virgin', 'virtue', 'vision', 'visual', 'volume', 'walker', 'walter', 'wanted', 'warned', 'warren', 'wealth', 'weapon', 'weekly', 'weight', 'welfare',
    'western', 'whether', 'widely', 'wilson', 'window', 'winner', 'winter', 'wisdom', 'within', 'wonder', 'wooden', 'worker', 'wright', 'writer', 'yellow'
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
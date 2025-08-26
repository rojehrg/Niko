export interface Subject {
  id: string
  name: string
  category: string
  emojis: string[]
  description: string
  color: string
}

export const subjects: Subject[] = [
  // Sciences
  {
    id: 'environmental-science',
    name: 'Environmental Science',
    category: 'Sciences',
    emojis: ['🌱', '🌿', '🌳', '🌍', '🌊', '🌤️', '🌧️', '❄️', '🦋', '🐝', '🦅', '🌺', '🍃', '🌻', '🌾', '🌲', '🌴', '🌵', '🌷', '🌸', '🌼', '🌻', '🌹', '🌺', '🌻', '🌼', '🌽', '🌾', '🌿', '🍀', '🍁', '🍂', '🍃'],
    description: 'Study of the environment and natural systems',
    color: 'emerald'
  },
  {
    id: 'computer-science',
    name: 'Computer Science',
    category: 'Technology',
    emojis: ['💻', '⌨️', '🖥️', '🖱️', '🔌', '💾', '📱', '📟', '📠', '🖨️', '🖱️', '💿', '📀', '🔋', '⚡', '🌐', '🔗', '📡', '📶', '📊', '📈', '📉', '🎯', '🎮', '🎲', '🧮', '🔢', '🔤', '🔡', '🔠', '💬', '💭', '💡'],
    description: 'Study of computation and information processing',
    color: 'blue'
  },
  {
    id: 'biology',
    name: 'Biology',
    category: 'Sciences',
    emojis: ['🧬', '🔬', '🧪', '🧫', '🦠', '🦠', '🦠', '🦠', '🦠', '🦠', '🦠', '🦠', '🦠', '🦠', '🦠', '🦠', '🦠', '🦠', '🦠', '🦠', '🦠', '🦠', '🦠', '🦠', '🦠', '🦠', '🦠', '🦠', '🦠', '🦠', '🦠', '🦠', '🦠'],
    description: 'Study of living organisms and life processes',
    color: 'green'
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    category: 'Sciences',
    emojis: ['⚗️', '🧪', '🧫', '🔬', '🧬', '⚛️', '💊', '💉', '🩸', '🧬', '🧪', '🧫', '🔬', '🧬', '⚛️', '💊', '💉', '🩸', '🧬', '🧪', '🧫', '🔬', '🧬', '⚛️', '💊', '💉', '🩸', '🧬', '🧪', '🧫', '🔬', '🧬', '⚛️'],
    description: 'Study of matter and its properties',
    color: 'purple'
  },
  {
    id: 'physics',
    name: 'Physics',
    category: 'Sciences',
    emojis: ['⚡', '💫', '⭐', '🌟', '✨', '🌙', '☀️', '🌍', '🌎', '🌏', '🌕', '🌖', '🌗', '🌘', '🌑', '🌒', '🌓', '🌔', '🌙', '🌚', '🌛', '🌜', '🌝', '🌞', '🌟', '🌠', '💫', '⭐', '🌟', '✨', '⚡', '💥', '🔥'],
    description: 'Study of matter, energy, and their interactions',
    color: 'indigo'
  },
  {
    id: 'mathematics',
    name: 'Mathematics',
    category: 'Sciences',
    emojis: ['🔢', '📊', '📈', '📉', '🧮', '🎯', '🎲', '🎰', '🎪', '🎨', '🎭', '🎬', '🎤', '🎧', '🎼', '🎹', '🎸', '🎺', '🎻', '🥁', '🎷', '🎺', '🎻', '🥁', '🎷', '🎺', '🎻', '🥁', '🎷', '🎺', '🎻', '🥁', '🎷'],
    description: 'Study of numbers, quantities, and shapes',
    color: 'red'
  },
  {
    id: 'psychology',
    name: 'Psychology',
    category: 'Social Sciences',
    emojis: ['🧠', '💭', '💬', '🗣️', '👁️', '👂', '👃', '👄', '👅', '👆', '👇', '👈', '👉', '👊', '✊', '✋', '👋', '👌', '👍', '👎', '👏', '🙌', '🙏', '👐', '🤲', '🤝', '🙏', '🙌', '👏', '👍', '👎', '👌', '👋'],
    description: 'Study of mind and behavior',
    color: 'pink'
  },
  {
    id: 'economics',
    name: 'Economics',
    category: 'Social Sciences',
    emojis: ['💰', '💵', '💸', '💳', '🏦', '📈', '📉', '📊', '📋', '📝', '📄', '📃', '📜', '📖', '📚', '📕', '📗', '📘', '📙', '📓', '📔', '📒', '📃', '📄', '📋', '📊', '📈', '📉', '💰', '💵', '💸', '💳', '🏦'],
    description: 'Study of production, distribution, and consumption',
    color: 'yellow'
  },
  {
    id: 'history',
    name: 'History',
    category: 'Humanities',
    emojis: ['📜', '🏛️', '🗿', '🏺', '⚱️', '⚰️', '🕰️', '⏰', '⏱️', '⏲️', '🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚', '🕛', '🕜', '🕝', '🕞', '🕟', '🕠', '🕡', '🕢', '🕣', '🕤', '🕥', '🕦'],
    description: 'Study of past events and human societies',
    color: 'amber'
  },
  {
    id: 'literature',
    name: 'Literature',
    category: 'Humanities',
    emojis: ['📚', '📖', '📕', '📗', '📘', '📙', '📓', '📔', '📒', '📃', '📄', '📋', '📝', '✏️', '✒️', '🖋️', '🖊️', '🖌️', '🖍️', '📝', '✏️', '✒️', '🖋️', '🖊️', '🖌️', '🖍️', '📝', '✏️', '✒️', '🖋️', '🖊️', '🖌️', '🖍️'],
    description: 'Study of written works and artistic expression',
    color: 'rose'
  },
  {
    id: 'philosophy',
    name: 'Philosophy',
    category: 'Humanities',
    emojis: ['🤔', '💭', '💡', '💭', '💬', '🗣️', '🧠', '💭', '💡', '💭', '💬', '🗣️', '🧠', '💭', '💡', '💭', '💬', '🗣️', '🧠', '💭', '💡', '💭', '💬', '🗣️', '🧠', '💭', '💡', '💭', '💬', '🗣️', '🧠', '💭', '💡'],
    description: 'Study of fundamental questions about existence',
    color: 'slate'
  },
  {
    id: 'art',
    name: 'Art',
    category: 'Arts',
    emojis: ['🎨', '🖼️', '🖼️', '🎭', '🎬', '🎤', '🎧', '🎼', '🎹', '🎸', '🎺', '🎻', '🥁', '🎷', '🎺', '🎻', '🥁', '🎷', '🎺', '🎻', '🥁', '🎷', '🎺', '🎻', '🥁', '🎷', '🎺', '🎻', '🥁', '🎷', '🎺', '🎻', '🥁', '🎷'],
    description: 'Study of creative expression and aesthetics',
    color: 'violet'
  },
  {
    id: 'music',
    name: 'Music',
    category: 'Arts',
    emojis: ['🎵', '🎶', '🎼', '🎹', '🎸', '🎺', '🎻', '🥁', '🎷', '🎺', '🎻', '🥁', '🎷', '🎺', '🎻', '🥁', '🎷', '🎺', '🎻', '🥁', '🎷', '🎺', '🎻', '🥁', '🎷', '🎺', '🎻', '🥁', '🎷', '🎺', '🎻', '🥁', '🎷'],
    description: 'Study of sound, rhythm, and musical expression',
    color: 'cyan'
  },
  {
    id: 'engineering',
    name: 'Engineering',
    category: 'Technology',
    emojis: ['⚙️', '🔧', '🔨', '⚒️', '🛠️', '🔩', '🔗', '⛓️', '🔋', '⚡', '💡', '🔌', '📡', '📶', '🌐', '🔗', '📡', '📶', '🌐', '🔗', '📡', '📶', '🌐', '🔗', '📡', '📶', '🌐', '🔗', '📡', '📶', '🌐', '🔗', '📡'],
    description: 'Application of scientific principles to design',
    color: 'orange'
  },
  {
    id: 'medicine',
    name: 'Medicine',
    category: 'Health Sciences',
    emojis: ['🏥', '💊', '💉', '🩺', '🩻', '🩼', '🩹', '🩺', '🩻', '🩼', '🩹', '🩺', '🩻', '🩼', '🩹', '🩺', '🩻', '🩼', '🩹', '🩺', '🩻', '🩼', '🩹', '🩺', '🩻', '🩼', '🩹', '🩺', '🩻', '🩼', '🩹', '🩺', '🩻'],
    description: 'Study of health, disease, and treatment',
    color: 'red'
  },
  {
    id: 'nursing',
    name: 'Nursing',
    category: 'Health Sciences',
    emojis: ['👩‍⚕️', '👨‍⚕️', '🏥', '💊', '💉', '🩺', '🩻', '🩼', '🩹', '🩺', '🩻', '🩼', '🩹', '🩺', '🩻', '🩼', '🩹', '🩺', '🩻', '🩼', '🩹', '🩺', '🩻', '🩼', '🩹', '🩺', '🩻', '🩼', '🩹', '🩺', '🩻', '🩼', '🩹', '🩺'],
    description: 'Study of patient care and health promotion',
    color: 'pink'
  },
  {
    id: 'business',
    name: 'Business',
    category: 'Social Sciences',
    emojis: ['💼', '👔', '👕', '👖', '👗', '👘', '👙', '👚', '👛', '👜', '👝', '🛍️', '🎒', '👞', '👟', '👠', '👡', '👢', '👣', '👤', '👥', '👦', '👧', '👨', '👩', '👪', '👫', '👬', '👭', '👮', '👯', '👰', '👱'],
    description: 'Study of organizational management and commerce',
    color: 'blue'
  },
  {
    id: 'law',
    name: 'Law',
    category: 'Social Sciences',
    emojis: ['⚖️', '👨‍⚖️', '👩‍⚖️', '🏛️', '📜', '📋', '📝', '✏️', '✒️', '🖋️', '🖊️', '🖌️', '🖍️', '📝', '✏️', '✒️', '🖋️', '🖊️', '🖌️', '🖍️', '📝', '✏️', '✒️', '🖋️', '🖊️', '🖌️', '🖍️', '📝', '✏️', '✒️', '🖋️', '🖊️', '🖌️'],
    description: 'Study of legal systems and justice',
    color: 'slate'
  },
  {
    id: 'education',
    name: 'Education',
    category: 'Social Sciences',
    emojis: ['🎓', '📚', '📖', '📕', '📗', '📘', '📙', '📓', '📔', '📒', '📃', '📄', '📋', '📝', '✏️', '✒️', '🖋️', '🖊️', '🖌️', '🖍️', '📝', '✏️', '✒️', '🖋️', '🖊️', '🖌️', '🖍️', '📝', '✏️', '✒️', '🖋️', '🖊️', '🖌️'],
    description: 'Study of teaching and learning processes',
    color: 'green'
  },
  {
    id: 'architecture',
    name: 'Architecture',
    category: 'Arts',
    emojis: ['🏛️', '🏗️', '🏘️', '🏙️', '🏚️', '🏛️', '🏗️', '🏘️', '🏙️', '🏚️', '🏛️', '🏗️', '🏘️', '🏙️', '🏚️', '🏛️', '🏗️', '🏘️', '🏙️', '🏚️', '🏛️', '🏗️', '🏘️', '🏙️', '🏚️', '🏛️', '🏗️', '🏘️', '🏙️', '🏚️', '🏛️', '🏗️', '🏘️'],
    description: 'Study of building design and construction',
    color: 'amber'
  },
  {
    id: 'design',
    name: 'Design',
    category: 'Arts',
    emojis: ['🎨', '🖼️', '🖼️', '🎭', '🎬', '🎤', '🎧', '🎼', '🎹', '🎸', '🎺', '🎻', '🥁', '🎷', '🎺', '🎻', '🥁', '🎷', '🎺', '🎻', '🥁', '🎷', '🎺', '🎻', '🥁', '🎷', '🎺', '🎻', '🥁', '🎷', '🎺', '🎻', '🥁', '🎷'],
    description: 'Study of visual communication and aesthetics',
    color: 'violet'
  },
  {
    id: 'communications',
    name: 'Communications',
    category: 'Social Sciences',
    emojis: ['💬', '🗣️', '👁️', '👂', '👃', '👄', '👅', '👆', '👇', '👈', '👉', '👊', '✊', '✋', '👋', '👌', '👍', '👎', '👏', '🙌', '🙏', '👐', '🤲', '🤝', '🙏', '🙌', '👏', '👍', '👎', '👌', '👋', '💬', '🗣️'],
    description: 'Study of human communication and media',
    color: 'blue'
  },
  {
    id: 'sociology',
    name: 'Sociology',
    category: 'Social Sciences',
    emojis: ['👥', '👤', '👦', '👧', '👨', '👩', '👪', '👫', '👬', '👭', '👮', '👯', '👰', '👱', '👲', '👳', '👴', '👵', '👶', '👷', '👸', '👹', '👺', '👻', '👼', '👽', '👾', '👿', '💀', '👻', '👼', '👽', '👾'],
    description: 'Study of human society and social behavior',
    color: 'indigo'
  },
  {
    id: 'anthropology',
    name: 'Anthropology',
    category: 'Social Sciences',
    emojis: ['🏺', '🗿', '🏛️', '📜', '⚱️', '⚰️', '🕰️', '⏰', '⏱️', '⏲️', '🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚', '🕛', '🕜', '🕝', '🕞', '🕟', '🕠', '🕡', '🕢', '🕣', '🕤', '🕥', '🕦'],
    description: 'Study of human cultures and societies',
    color: 'amber'
  },
  {
    id: 'political-science',
    name: 'Political Science',
    category: 'Social Sciences',
    emojis: ['🏛️', '🗳️', '📊', '📈', '📉', '📋', '📝', '✏️', '✒️', '🖋️', '🖊️', '🖌️', '🖍️', '📝', '✏️', '✒️', '🖋️', '🖊️', '🖌️', '🖍️', '📝', '✏️', '✒️', '🖋️', '🖊️', '🖌️', '🖍️', '📝', '✏️', '✒️', '🖋️', '🖊️', '🖌️'],
    description: 'Study of government and political systems',
    color: 'red'
  },
  {
    id: 'geography',
    name: 'Geography',
    category: 'Sciences',
    emojis: ['🌍', '🌎', '🌏', '🗺️', '🗾', '🌐', '🌍', '🌎', '🌏', '🗺️', '🗾', '🌐', '🌍', '🌎', '🌏', '🗺️', '🗾', '🌐', '🌍', '🌎', '🌏', '🗺️', '🗾', '🌐', '🌍', '🌎', '🌏', '🗺️', '🗾', '🌐', '🌍', '🌎', '🌏'],
    description: 'Study of Earth\'s landscapes and environments',
    color: 'teal'
  },
  {
    id: 'astronomy',
    name: 'Astronomy',
    category: 'Sciences',
    emojis: ['🔭', '🌌', '🌠', '💫', '⭐', '🌟', '✨', '🌙', '☀️', '🌍', '🌎', '🌏', '🌕', '🌖', '🌗', '🌘', '🌑', '🌒', '🌓', '🌔', '🌙', '🌚', '🌛', '🌜', '🌝', '🌞', '🌟', '🌠', '💫', '⭐', '🌟', '✨', '🌌'],
    description: 'Study of celestial objects and phenomena',
    color: 'indigo'
  },
  {
    id: 'geology',
    name: 'Geology',
    category: 'Sciences',
    emojis: ['🪨', '🗿', '🏔️', '⛰️', '🌋', '🏜️', '🏖️', '🏝️', '🏞️', '🏟️', '🏛️', '🏗️', '🏘️', '🏙️', '🏚️', '🏛️', '🏗️', '🏘️', '🏙️', '🏚️', '🏛️', '🏗️', '🏘️', '🏙️', '🏚️', '🏛️', '🏗️', '🏘️', '🏙️', '🏚️', '🏛️', '🏗️', '🏘️'],
    description: 'Study of Earth\'s structure and composition',
    color: 'stone'
  },
  {
    id: 'marine-biology',
    name: 'Marine Biology',
    category: 'Sciences',
    emojis: ['🌊', '🐋', '🐠', '🐡', '🦈', '🐙', '🦑', '🦐', '🦞', '🦀', '🐚', '🌊', '🐋', '🐠', '🐡', '🦈', '🐙', '🦑', '🦐', '🦞', '🦀', '🐚', '🌊', '🐋', '🐠', '🐡', '🦈', '🐙', '🦑', '🦐', '🦞', '🦀', '🐚'],
    description: 'Study of marine organisms and ecosystems',
    color: 'cyan'
  },
  {
    id: 'neuroscience',
    name: 'Neuroscience',
    category: 'Sciences',
    emojis: ['🧠', '🔬', '🧪', '🧫', '🦠', '🧬', '⚗️', '🧪', '🧫', '🔬', '🧬', '⚗️', '🧪', '🧫', '🔬', '🧬', '⚗️', '🧪', '🧫', '🔬', '🧬', '⚗️', '🧪', '🧫', '🔬', '🧬', '⚗️', '🧪', '🧫', '🔬', '🧬', '⚗️', '🧪'],
    description: 'Study of the nervous system and brain',
    color: 'purple'
  },
  {
    id: 'linguistics',
    name: 'Linguistics',
    category: 'Humanities',
    emojis: ['💬', '🗣️', '👁️', '👂', '👃', '👄', '👅', '👆', '👇', '👈', '👉', '👊', '✊', '✋', '👋', '👌', '👍', '👎', '👏', '🙌', '🙏', '👐', '🤲', '🤝', '🙏', '🙌', '👏', '👍', '👎', '👌', '👋', '💬', '🗣️'],
    description: 'Study of language and communication',
    color: 'blue'
  },
  {
    id: 'theology',
    name: 'Theology',
    category: 'Humanities',
    emojis: ['⛪', '🕍', '🕌', '🕋', '⛩️', '🕯️', '🕉️', '☮️', '☯️', '✝️', '☦️', '✡️', '🔯', '🕎', '☪️', '☸️', '🕉️', '☮️', '☯️', '✝️', '☦️', '✡️', '🔯', '🕎', '☪️', '☸️', '🕉️', '☮️', '☯️', '✝️', '☦️', '✡️', '🔯'],
    description: 'Study of religious beliefs and practices',
    color: 'amber'
  },
  {
    id: 'criminology',
    name: 'Criminology',
    category: 'Social Sciences',
    emojis: ['🚔', '🚓', '🚨', '🔒', '🔓', '🔐', '🔑', '🔏', '🔎', '🔍', '🔌', '🔋', '⚡', '💡', '🔌', '🔋', '⚡', '💡', '🔌', '🔋', '⚡', '💡', '🔌', '🔋', '⚡', '💡', '🔌', '🔋', '⚡', '💡', '🔌', '🔋', '⚡', '💡'],
    description: 'Study of crime and criminal behavior',
    color: 'slate'
  },
  {
    id: 'social-work',
    name: 'Social Work',
    category: 'Social Sciences',
    emojis: ['🤝', '🙏', '👐', '🤲', '👥', '👤', '👦', '👧', '👨', '👩', '👪', '👫', '👬', '👭', '👮', '👯', '👰', '👱', '👲', '👳', '👴', '👵', '👶', '👷', '👸', '👹', '👺', '👻', '👼', '👽', '👾', '👿', '💀'],
    description: 'Study of social welfare and human services',
    color: 'green'
  },
  {
    id: 'public-health',
    name: 'Public Health',
    category: 'Health Sciences',
    emojis: ['🏥', '💊', '💉', '🩺', '🩻', '🩼', '🩹', '🩺', '🩻', '🩼', '🩹', '🩺', '🩻', '🩼', '🩹', '🩺', '🩻', '🩼', '🩹', '🩺', '🩻', '🩼', '🩹', '🩺', '🩻', '🩼', '🩹', '🩺', '🩻', '🩼', '🩹', '🩺', '🩻'],
    description: 'Study of population health and prevention',
    color: 'emerald'
  },
  {
    id: 'nutrition',
    name: 'Nutrition',
    category: 'Health Sciences',
    emojis: ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🥑', '🥦', '🥬', '🥒', '🌶️', '🫑', '🌽', '🥕', '🫒', '🧄', '🧅', '🥔', '🍠', '🥐', '🥯', '🍞'],
    description: 'Study of food and dietary health',
    color: 'green'
  },
  {
    id: 'kinesiology',
    name: 'Kinesiology',
    category: 'Health Sciences',
    emojis: ['🏃', '🏃‍♀️', '🏃‍♂️', '🚶', '🚶‍♀️', '🚶‍♂️', '🏃', '🏃‍♀️', '🏃‍♂️', '🚶', '🚶‍♀️', '🚶‍♂️', '🏃', '🏃‍♀️', '🏃‍♂️', '🚶', '🚶‍♀️', '🚶‍♂️', '🏃', '🏃‍♀️', '🏃‍♂️', '🚶', '🚶‍♀️', '🚶‍♂️', '🏃', '🏃‍♀️', '🏃‍♂️', '🚶', '🚶‍♀️', '🚶‍♂️', '🏃', '🏃‍♀️', '🏃‍♂️'],
    description: 'Study of human movement and exercise',
    color: 'orange'
  },
  {
    id: 'dentistry',
    name: 'Dentistry',
    category: 'Health Sciences',
    emojis: ['🦷', '🦷', '🦷', '🦷', '🦷', '🦷', '🦷', '🦷', '🦷', '🦷', '🦷', '🦷', '🦷', '🦷', '🦷', '🦷', '🦷', '🦷', '🦷', '🦷', '🦷', '🦷', '🦷', '🦷', '🦷', '🦷', '🦷', '🦷', '🦷', '🦷', '🦷', '🦷', '🦷'],
    description: 'Study of oral health and dental care',
    color: 'white'
  },
  {
    id: 'veterinary',
    name: 'Veterinary Medicine',
    category: 'Health Sciences',
    emojis: ['🐕', '🐩', '🐺', '🦊', '🦝', '🐱', '🐈', '🐈‍⬛', '🦁', '🐯', '🐅', '🐆', '🐴', '🐎', '🦄', '🦓', '🦌', '🐮', '🐂', '🐃', '🐄', '🐷', '🐖', '🐗', '🐽', '🐏', '🐑', '🐐', '🐪', '🐫', '🦙', '🦒', '🐘'],
    description: 'Study of animal health and medicine',
    color: 'brown'
  },
  {
    id: 'agriculture',
    name: 'Agriculture',
    category: 'Sciences',
    emojis: ['🌾', '🌱', '🌿', '🌳', '🌴', '🌵', '🌷', '🌸', '🌼', '🌻', '🌺', '🌹', '🌻', '🌼', '🌽', '🌾', '🌿', '🍀', '🍁', '🍂', '🍃', '🌾', '🌱', '🌿', '🌳', '🌴', '🌵', '🌷', '🌸', '🌼', '🌻', '🌺', '🌹'],
    description: 'Study of farming and crop production',
    color: 'green'
  },
  {
    id: 'forestry',
    name: 'Forestry',
    category: 'Sciences',
    emojis: ['🌲', '🌳', '🌴', '🌵', '🌷', '🌸', '🌼', '🌻', '🌺', '🌹', '🌻', '🌼', '🌽', '🌾', '🌿', '🍀', '🍁', '🍂', '🍃', '🌲', '🌳', '🌴', '🌵', '🌷', '🌸', '🌼', '🌻', '🌺', '🌹', '🌻', '🌼', '🌽', '🌾'],
    description: 'Study of forest management and conservation',
    color: 'emerald'
  },
  {
    id: 'fisheries',
    name: 'Fisheries',
    category: 'Sciences',
    emojis: ['🐟', '🐠', '🐡', '🦈', '🐙', '🦑', '🦐', '🦞', '🦀', '🐚', '🌊', '🐋', '🐟', '🐠', '🐡', '🦈', '🐙', '🦑', '🦐', '🦞', '🦀', '🐚', '🌊', '🐋', '🐟', '🐠', '🐡', '🦈', '🐙', '🦑', '🦐', '🦞', '🦀'],
    description: 'Study of fish and aquatic resources',
    color: 'blue'
  },
  {
    id: 'wildlife',
    name: 'Wildlife Biology',
    category: 'Sciences',
    emojis: ['🦁', '🐯', '🐅', '🐆', '🐴', '🐎', '🦄', '🦓', '🦌', '🐮', '🐂', '🐃', '🐄', '🐷', '🐖', '🐗', '🐽', '🐏', '🐑', '🐐', '🐪', '🐫', '🦙', '🦒', '🐘', '🦏', '🦛', '🐃', '🐂', '🐄', '🐷', '🐖', '🐗'],
    description: 'Study of wild animals and ecosystems',
    color: 'brown'
  },
  {
    id: 'other',
    name: 'Other/General Studies',
    category: 'General',
    emojis: ['📚', '📖', '📕', '📗', '📘', '📙', '📓', '📔', '📒', '📃', '📄', '📋', '📝', '✏️', '✒️', '🖋️', '🖊️', '🖌️', '🖍️', '📝', '✏️', '✒️', '🖋️', '🖊️', '🖌️', '🖍️', '📝', '✏️', '✒️', '🖋️', '🖊️', '🖌️', '🖍️'],
    description: 'General studies or other academic pursuits',
    color: 'gray'
  }
]

export const subjectCategories = [
  'Sciences',
  'Technology', 
  'Social Sciences',
  'Humanities',
  'Arts',
  'Health Sciences',
  'General'
]

export const getSubjectById = (id: string): Subject | undefined => {
  return subjects.find(subject => subject.id === id)
}

export const getSubjectsByCategory = (category: string): Subject[] => {
  return subjects.filter(subject => subject.category === category)
}

export const getRandomEmojis = (subjectId: string, count: number = 20): string[] => {
  const subject = getSubjectById(subjectId)
  if (!subject) return ['📚', '🎓', '✏️', '📖', '💡']
  
  const shuffled = [...subject.emojis].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

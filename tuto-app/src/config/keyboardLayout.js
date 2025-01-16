// Map des caractères avec leurs modifiers pour AZERTY
const AZERTY_CHAR_MODIFIERS = new Map([
  // Chiffres (tous avec Shift sur AZERTY)
  ['1', ['ShiftLeft']], ['2', ['ShiftLeft']], ['3', ['ShiftLeft']], ['4', ['ShiftLeft']], 
  ['5', ['ShiftLeft']], ['6', ['ShiftLeft']], ['7', ['ShiftLeft']], ['8', ['ShiftLeft']], 
  ['9', ['ShiftLeft']], ['0', ['ShiftLeft']],
  
  // Ponctuation haute
  ['!', ['ShiftLeft']], ['/', ['ShiftLeft']], ['\\', ['AltRight']], ['|', ['AltRight']],
  ['@', ['AltRight']], ['#', ['AltRight']], ['$', ['ShiftLeft']], ['€', ['AltRight']],
  ['£', ['ShiftLeft']], ['%', ['ShiftLeft']], ['?', ['ShiftLeft']], ['.', ['ShiftLeft']],
  ['/', ['ShiftLeft']], ['§', ['ShiftLeft']], ['&', ['ShiftLeft']], ['"', ['ShiftLeft']],
  ['\'', ['ShiftLeft']], ['(', ['ShiftLeft']], [')', ['ShiftLeft']], ['[', ['AltRight']],
  [']', ['AltRight']], ['{', ['AltRight']], ['}', ['AltRight']], ['<', ['ShiftLeft']],
  ['>', ['ShiftLeft']], ['°', ['ShiftLeft']], ['+', ['ShiftLeft']], ['=', ['ShiftLeft']],
  ['_', ['ShiftLeft']], ['µ', ['ShiftLeft']], ['*', ['ShiftLeft']], ['¨', ['ShiftLeft']],
  ['`', ['AltRight']], ['~', ['AltRight']], ['^', ['ShiftLeft']], ['¤', ['ShiftLeft']],
  [':', ['ShiftLeft']], [';', ['ShiftLeft']]
])

// Map des touches mortes et leurs caractères composés
const DEAD_KEYS = new Map([
  ['^', {
    'a': 'â',
    'e': 'ê',
    'i': 'î',
    'o': 'ô',
    'u': 'û'
  }],
  ['¨', {
    'a': 'ä',
    'e': 'ë',
    'i': 'ï',
    'o': 'ö',
    'u': 'ü',
    'y': 'ÿ'
  }],
  ['`', {
    'a': 'à',
    'e': 'è',
    'i': 'ì',
    'o': 'ò',
    'u': 'ù'
  }]
])

// Fonction pour détecter les majuscules
function isUpperCase(char) {
  return char === char.toUpperCase() && char !== char.toLowerCase()
}

export class KeyboardLayout {
  static getKeyForChar(char) {
    let modifiers = []
    let isDeadKey = false
    let isComposed = false

    // Vérifier si c'est un espace
    if (char === ' ') {
      return {
        char: 'Space',
        display: ' ',
        modifiers: [],
        isDeadKey: false,
        isComposed: false
      }
    }

    // Vérifier si c'est une majuscule
    if (isUpperCase(char)) {
      modifiers.push('ShiftLeft')
    }

    // Vérifier si c'est une touche morte
    for (const [deadKey, compositions] of DEAD_KEYS.entries()) {
      for (const [baseChar, composedChar] of Object.entries(compositions)) {
        if (composedChar === char) {
          return {
            char: baseChar,
            display: char,
            modifiers: ['ShiftLeft'],
            isDeadKey: false,
            isComposed: true
          }
        }
      }
      if (char === deadKey) {
        isDeadKey = true
      }
    }

    // Vérifier les modificateurs spéciaux
    const specialModifiers = AZERTY_CHAR_MODIFIERS.get(char)
    if (specialModifiers) {
      modifiers = [...new Set([...modifiers, ...specialModifiers])]
    }

    return {
      char: char.toLowerCase(),
      display: char,
      modifiers,
      isDeadKey,
      isComposed
    }
  }
} 
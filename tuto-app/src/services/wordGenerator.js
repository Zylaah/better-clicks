import mots from '@/data/mots.json'

export class WordGenerator {
  static DIFFICULTY_RANGES = {
    EASY: { min: 0, max: 5 },      // Mots courts (jusqu'à 5 lettres)
    MEDIUM: { min: 6, max: 8 },    // Mots moyens (6-8 lettres)
    HARD: { min: 9, max: Infinity} // Mots longs (9+ lettres)
  }

  // Map des caractères composés avec leurs combinaisons de touches
  static COMPOSED_CHARS = new Map([
    ['â', { base: 'a', deadKey: '^', modifiers: [] }],
    ['ê', { base: 'e', deadKey: '^', modifiers: [] }],
    ['î', { base: 'i', deadKey: '^', modifiers: [] }],
    ['ô', { base: 'o', deadKey: '^', modifiers: [] }],
    ['û', { base: 'u', deadKey: '^', modifiers: [] }],
    
    ['ä', { base: 'a', deadKey: '¨', modifiers: ['ShiftLeft'] }],
    ['ë', { base: 'e', deadKey: '¨', modifiers: ['ShiftLeft'] }],
    ['ï', { base: 'i', deadKey: '¨', modifiers: ['ShiftLeft'] }],
    ['ö', { base: 'o', deadKey: '¨', modifiers: ['ShiftLeft'] }],
    ['ü', { base: 'u', deadKey: '¨', modifiers: ['ShiftLeft'] }],

    ['à', { base: 'a', deadKey: '`', modifiers: [] }],
    ['è', { base: 'e', deadKey: '`', modifiers: [] }],
    ['ù', { base: 'u', deadKey: '`', modifiers: [] }]
  ])

  static getWordsByDifficulty(difficulty = 'MEDIUM') {
    const range = this.DIFFICULTY_RANGES[difficulty]
    if (!range) return mots.mots

    return mots.mots.filter(word => 
      word.length >= range.min && word.length <= range.max
    )
  }

  static generateRandomWords(count = 20, difficulty = 'MEDIUM') {
    const selectedWords = this.getWordsByDifficulty(difficulty)
    const words = []

    // Convertir les mots en objets avec leurs caractéristiques
    for (const word of selectedWords) {
      const wordChars = []
      for (const char of word) {
        const charInfo = this.getCharInfo(char)
        if (Array.isArray(charInfo)) {
          wordChars.push(...charInfo)
        } else {
          wordChars.push(charInfo)
        }
      }
      words.push({
        word,
        chars: wordChars
      })
    }

    // Mélanger les mots et prendre le nombre demandé
    return this.shuffleArray(words).slice(0, count)
  }

  static getCharInfo(char) {
    // Vérifier si c'est une majuscule
    const isUpper = char === char.toUpperCase() && char !== char.toLowerCase()
    
    // Vérifier si c'est un caractère composé
    if (this.COMPOSED_CHARS.has(char)) {
      const info = this.COMPOSED_CHARS.get(char)
      return [
        {
          char: info.deadKey,
          display: info.deadKey,
          modifiers: info.modifiers,
          isDeadKey: true
        },
        {
          char: info.base,
          display: char, // Afficher le caractère final
          modifiers: [],
          isComposed: true
        }
      ]
    }

    // Sinon, retourner le caractère avec ses modificateurs
    return {
      char: char.toLowerCase(),
      display: char,
      modifiers: isUpper ? ['ShiftLeft'] : []
    }
  }

  static shuffleArray(array) {
    const newArray = [...array]
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]]
    }
    return newArray
  }
} 
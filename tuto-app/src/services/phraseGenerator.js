import { KeyboardLayout } from '@/config/keyboardLayout'
import phrasesData from '@/data/phrases.json'

const DIFFICULTY_LEVELS = {
  EASY: {
    minWords: 3,
    maxWords: 6
  },
  MEDIUM: {
    minWords: 7,
    maxWords: 12
  },
  HARD: {
    minWords: 13,
    maxWords: 20
  }
}

export class PhraseGenerator {
  static phrases = phrasesData.phrases

  static generatePhrase(difficulty = 'MEDIUM') {
    const config = DIFFICULTY_LEVELS[difficulty]
    if (!config) throw new Error('Invalid difficulty level')

    // Filtrer les phrases selon la difficulté (basé sur le nombre de mots)
    const filteredPhrases = this.phrases.filter(phrase => {
      const wordCount = phrase.split(' ').length
      return wordCount >= config.minWords && wordCount <= config.maxWords
    })

    if (filteredPhrases.length === 0) {
      throw new Error(`No phrases found for difficulty level ${difficulty}`)
    }

    // Sélectionner une phrase aléatoire
    const phrase = this.getRandomPhrase(filteredPhrases)

    return {
      text: phrase,
      chars: this.analyzeChars(phrase)
    }
  }

  static generateRandomPhrases(count, difficulty = 'MEDIUM') {
    const config = DIFFICULTY_LEVELS[difficulty]
    const filteredPhrases = this.phrases.filter(phrase => {
      const wordCount = phrase.split(' ').length
      return wordCount >= config.minWords && wordCount <= config.maxWords
    })

    if (filteredPhrases.length === 0) {
      throw new Error(`No phrases found for difficulty level ${difficulty}`)
    }

    // Sélectionner plusieurs phrases uniques aléatoires
    const selectedPhrases = new Set()
    while (selectedPhrases.size < count && selectedPhrases.size < filteredPhrases.length) {
      selectedPhrases.add(this.getRandomPhrase(filteredPhrases))
    }

    return Array.from(selectedPhrases).map(phrase => ({
      text: phrase,
      chars: this.analyzeChars(phrase)
    }))
  }

  static getRandomPhrase(phrases) {
    return phrases[Math.floor(Math.random() * phrases.length)]
  }

  static analyzeChars(phrase) {
    return Array.from(phrase).map(char => {
      const keyInfo = KeyboardLayout.getKeyForChar(char)
      return {
        char: char,
        display: char,
        isDeadKey: keyInfo.isDeadKey || false,
        isComposed: keyInfo.isComposed || false,
        modifiers: keyInfo.modifiers || []
      }
    })
  }
} 
import mots from '@/data/mots.json'

export class WordGenerator {
  static generateRandomWords(count = 20) {
    // Créer une copie du tableau original pour ne pas le modifier
    const wordsCopy = [...mots.mots]
    // Mélanger la copie
    const selectedWords = this.shuffleArray(wordsCopy).slice(0, count)
    const words = []

    for (const word of selectedWords) {
      words.push({
        word,
        chars: word.split('').map(char => ({
          char: char.toLowerCase(),
          display: char,
          modifiers: char === char.toUpperCase() && char !== char.toLowerCase() ? ['ShiftLeft'] : []
        }))
      })
    }

    return words
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
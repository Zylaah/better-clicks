import mots from '@/data/mots.json'

export class WordGenerator {
  static generateRandomWords(count = 20) {
    // Mélanger et sélectionner le nombre de mots demandé
    const selectedWords = this.shuffleArray(mots.mots).slice(0, count)
    const words = []

    // Convertir les mots en objets simples
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
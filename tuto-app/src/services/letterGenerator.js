export class LetterGenerator {
    static generateRandomLetters(count = 36) {
      const alphabet = 'abcdefghijklmnopqrstuvwxyz'
      const numbers = '0123456789'
      let characters = []
  
      // Générer les lettres
      for (let letter of alphabet) {
        const isUpperCase = Math.random() < 0.5
        const char = isUpperCase ? letter.toUpperCase() : letter
        characters.push({
          char,
          display: `${char}`,
          modifiers: isUpperCase ? ['ShiftLeft'] : []
        })
      }
  
      // Générer les chiffres
      for (let number of numbers) {
        characters.push({
          char: number,
          display: `${number}`,
          modifiers: ['ShiftLeft']
        })
      }
  
      // Mélanger et retourner seulement le nombre demandé
      const shuffled = this.shuffleArray(characters)
      return shuffled.slice(0, count)
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
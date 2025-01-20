export class LetterGenerator {
    // Définition statique des caractères et leurs configurations
    static CHARACTERS_CONFIG = {
      letters: {
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        modifiers: []
      },
      numbers: {
        chars: '0123456789',
        modifiers: ['ShiftLeft']
      }
    }

    // Cache pour les caractères générés
    static _charactersCache = null
    static _lastGeneratedTime = 0
    static CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

    static generateRandomLetters(count = 20) {
      // Vérifier si nous pouvons utiliser le cache
      if (this._canUseCache()) {
        const shuffled = this.shuffleArray([...this._charactersCache])
        return shuffled.slice(0, Math.min(count, shuffled.length))
      }

      let characters = []

      // Générer les lettres minuscules et majuscules
      for (let letter of this.CHARACTERS_CONFIG.letters.lowercase) {
        // Ajouter la version minuscule
        characters.push({
          char: letter,
          display: letter,
          modifiers: [],
          type: 'lowercase'
        })

        // Ajouter la version majuscule
        characters.push({
          char: letter.toUpperCase(),
          display: letter.toUpperCase(),
          modifiers: ['ShiftLeft'],
          type: 'uppercase'
        })
      }

      // Ajouter les chiffres
      for (let number of this.CHARACTERS_CONFIG.numbers.chars) {
        characters.push({
          char: number,
          display: number,
          modifiers: this.CHARACTERS_CONFIG.numbers.modifiers,
          type: 'number'
        })
      }

      // Mettre à jour le cache
      this._updateCache(characters)

      // Mélanger et retourner le nombre demandé
      const shuffled = this.shuffleArray(characters)
      return shuffled.slice(0, Math.min(count, shuffled.length))
    }

    static shuffleArray(array) {
      const newArray = [...array]
      // Algorithme de Fisher-Yates pour un mélange plus efficace
      for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]]
      }
      return newArray
    }

    // Méthodes "privées" pour la gestion du cache (avec underscore par convention)
    static _canUseCache() {
      return (
        this._charactersCache !== null &&
        Date.now() - this._lastGeneratedTime < this.CACHE_DURATION
      )
    }

    static _updateCache(characters) {
      this._charactersCache = characters
      this._lastGeneratedTime = Date.now()
    }

    // Méthodes utilitaires publiques
    static getAvailableCharacters() {
      return {
        total: this.CHARACTERS_CONFIG.letters.lowercase.length * 2 + // minuscules et majuscules
               this.CHARACTERS_CONFIG.numbers.chars.length,          // chiffres
        categories: {
          lowercase: this.CHARACTERS_CONFIG.letters.lowercase.length,
          uppercase: this.CHARACTERS_CONFIG.letters.lowercase.length,
          numbers: this.CHARACTERS_CONFIG.numbers.chars.length
        }
      }
    }

    static clearCache() {
      this._charactersCache = null
      this._lastGeneratedTime = 0
    }
}
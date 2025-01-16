export class SymbolGenerator {
  static SYMBOLS_MAP = new Map([
    // Symboles de base (sans modificateur)
    ['&', []], ['"', []], ['\'', []], ['(', []], [')', []], ['-', []],
    ['è', []], ['_', []], ['ç', []], ['à', []], [')', []], ['=', []],
    ['^', []], ['$', []], ['ù', []], ['*', []], ['<', []], [',', []],
    [';', []], [':', []], ['!', []], ['²', []],

    // Symboles avec AltGr
    ['~', ['AltRight']], ['#', ['AltRight']], ['{', ['AltRight']], 
    ['[', ['AltRight']], ['|', ['AltRight']], ['`', ['AltRight']], 
    ['\\', ['AltRight']], ['@', ['AltRight']], [']', ['AltRight']], 
    ['}', ['AltRight']], ['€', ['AltRight']],

    // Symboles avec Shift
    ['1', ['ShiftLeft']], ['2', ['ShiftLeft']], ['3', ['ShiftLeft']], 
    ['4', ['ShiftLeft']], ['5', ['ShiftLeft']], ['6', ['ShiftLeft']], 
    ['7', ['ShiftLeft']], ['8', ['ShiftLeft']], ['9', ['ShiftLeft']], 
    ['0', ['ShiftLeft']], ['°', ['ShiftLeft']], ['+', ['ShiftLeft']],
    ['¨', ['ShiftLeft']], ['£', ['ShiftLeft']], ['%', ['ShiftLeft']],
    ['µ', ['ShiftLeft']], ['M', ['ShiftLeft']], ['?', ['ShiftLeft']],
    ['.', ['ShiftLeft']], ['/', ['ShiftLeft']], ['§', ['ShiftLeft']],
    ['>', ['ShiftLeft']]
  ])

  static generateRandomSymbols(count = 30) {
    let symbols = []
    const symbolEntries = Array.from(this.SYMBOLS_MAP.entries())

    // Convertir les entrées de la Map en objets de symboles
    for (const [char, modifiers] of symbolEntries) {
      symbols.push({
        char,
        display: char,
        modifiers
      })
    }

    // Mélanger les symboles et prendre le nombre demandé
    return this.shuffleArray(symbols).slice(0, count)
  }

  static shuffleArray(array) {
    const newArray = [...array]
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]]
    }
    return newArray
  }

  static getSymbolInfo(char) {
    return {
      char,
      display: char,
      modifiers: this.SYMBOLS_MAP.get(char) || []
    }
  }
} 
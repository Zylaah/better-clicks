export class SymbolGenerator {
  static SYMBOLS_MAP = new Map([
    // Symboles de base (sans modificateur)
    ['&', { modifiers: [], hint: '' }], 
    ['"', { modifiers: [], hint: '' }],
    ['\'', { modifiers: [], hint: '' }],
    ['(', { modifiers: [], hint: '' }],
    [')', { modifiers: [], hint: '' }],
    ['-', { modifiers: [], hint: '' }],
    ['è', { modifiers: [], hint: '' }],
    ['_', { modifiers: [], hint: '' }],
    ['ç', { modifiers: [], hint: '' }],
    ['à', { modifiers: [], hint: '' }],
    ['=', { modifiers: [], hint: '' }],
    ['^', { modifiers: [], hint: '(appuyez 2 fois)' }],
    ['$', { modifiers: [], hint: '' }],
    ['ù', { modifiers: [], hint: '' }],
    ['*', { modifiers: [], hint: '' }],
    ['<', { modifiers: [], hint: '' }],
    [',', { modifiers: [], hint: '' }],
    [';', { modifiers: [], hint: '' }],
    [':', { modifiers: [], hint: '' }],
    ['!', { modifiers: [], hint: '' }],
    ['²', { modifiers: [], hint: '' }],

    // Symboles avec AltGr
    ['~', { modifiers: ['AltRight'], hint: 'AltGr + é (appuyez 2 fois' }],
    ['#', { modifiers: ['AltRight'], hint: 'AltGr + 3' }],
    ['{', { modifiers: ['AltRight'], hint: 'AltGr + 4' }],
    ['[', { modifiers: ['AltRight'], hint: 'AltGr + 5' }],
    ['|', { modifiers: ['AltRight'], hint: 'AltGr + 6' }],
    ['`', { modifiers: ['AltRight'], hint: 'AltGr + 7 (appuyez 2 fois)' }],
    ['\\', { modifiers: ['AltRight'], hint: 'AltGr + 8' }],
    ['@', { modifiers: ['AltRight'], hint: 'AltGr + à' }],
    [']', { modifiers: ['AltRight'], hint: 'AltGr + )' }],
    ['}', { modifiers: ['AltRight'], hint: 'AltGr + ='}],
    ['€', { modifiers: ['AltRight'], hint: 'AltGr + E' }],

    // Symboles avec Shift
    ['°', { modifiers: ['ShiftLeft'], hint: 'Shift + )' }],
    ['+', { modifiers: ['ShiftLeft'], hint: 'Shift + =' }],
    ['¨', { modifiers: ['ShiftLeft'], hint: 'Shift + ^ (appuyez 2 fois)' }],
    ['£', { modifiers: ['ShiftLeft'], hint: 'Shift + $' }],
    ['%', { modifiers: ['ShiftLeft'], hint: 'Shift + ù' }],
    ['µ', { modifiers: ['ShiftLeft'], hint: 'Shift + *' }],
    ['?', { modifiers: ['ShiftLeft'], hint: 'Shift + ,' }],
    ['.', { modifiers: ['ShiftLeft'], hint: 'Shift + ;' }],
    ['/', { modifiers: ['ShiftLeft'], hint: 'Shift + :' }],
    ['§', { modifiers: ['ShiftLeft'], hint: 'Shift + !' }],
    ['>', { modifiers: ['ShiftLeft'], hint: 'Shift + <' }]
  ])

  static generateRandomSymbols(count = 30) {
    let symbols = []
    const symbolEntries = Array.from(this.SYMBOLS_MAP.entries())

    // Convertir les entrées de la Map en objets de symboles
    for (const [char, info] of symbolEntries) {
      symbols.push({
        char,
        display: char,
        modifiers: info.modifiers,
        hint: info.hint
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
    const info = this.SYMBOLS_MAP.get(char) || { modifiers: [], hint: '' }
    return {
      char,
      display: char,
      modifiers: info.modifiers,
      hint: info.hint
    }
  }
} 
export const MORSE_DICT: Record<string, string> = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
  '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
  '.': '.-.-.-', ',': '--..--', '?': '..--..', '\'': '.----.', '!': '-.-.--',
  '/': '-..-.', '(': '-.--.', ')': '-.--.-', '&': '.-...', ':': '---...',
  ';': '-.-.-.', '=': '-...-', '+': '.-.-.', '-': '-....-', '_': '..--.-',
  '"': '.-..-.', '$': '...-..-', '@': '.--.-.',
};

export const REVERSE_MORSE_DICT: Record<string, string> = Object.fromEntries(
  Object.entries(MORSE_DICT).map(([k, v]) => [v, k])
);

// Q-Codes commonly used (optional configuration for learning/quick expansion)
export const Q_CODES: Record<string, string> = {
  'QRL': 'Are you busy?',
  'QRM': 'Is my transmission being interfered with?',
  'QRN': 'Are you troubled by static?',
  'QRO': 'Shall I increase transmitter power?',
  'QRP': 'Shall I decrease transmitter power?',
  'QRQ': 'Shall I send faster?',
  'QRS': 'Shall I send more slowly?',
  'QRT': 'Shall I stop sending?',
  'QRZ': 'Who is calling me?',
  'QSL': 'Can you acknowledge receipt?',
  'QSO': 'Can you communicate with ...?',
  'QSY': 'Shall I change to transmission on another frequency?',
  'QTH': 'What is your location?'
};

export function textToMorse(text: string): string {
  return text
    .toUpperCase()
    .split('')
    .map(char => {
      if (char === ' ') return '/'; // Word separator
      return MORSE_DICT[char] || ''; // Ignore characters not in dictionary
    })
    .filter(Boolean)
    .join(' ');
}

export function morseToText(morse: string): string {
  return morse
    .split(' ')
    .map(symbol => {
      if (symbol === '/') return ' ';
      return REVERSE_MORSE_DICT[symbol] || '';
    })
    .join('');
}

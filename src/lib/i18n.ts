export const TRANSLATIONS = {
  en: {
    sidebar: {
      textGenerator: "Text Generator",
      randomGenerator: "Random Generator",
      lessons: "Lessons",
      quizMode: "Quiz Mode",
      keyingPractice: "Keying Practice",
      signalMonitor: "Signal Monitor",
      footer: {
        version: "v1.0.0",
        credits: "By sector7gp",
        basedOn: "Based on f1orl.org",
        repo: "Source Code"
      }
    },
    config: {
      title: "CW Audio Configuration",
      speed: "Speed (WPM)",
      farnsworth: "Farnsworth Speed",
      effectiveWpm: "Effective WPM (Spacing)",
      frequency: "Tone Frequency",
      volume: "Volume"
    },
    textGen: {
      title: "Text to Morse Generator",
      subtitle: "Convert text instantly and listen to real-time CW.",
      inputLabel: "Input Text",
      inputPlaceholder: "Type your text here...",
      outputLabel: "Morse Code Translation",
      play: "Play",
      stop: "Stop",
      clear: "Clear text"
    },
    randomGen: {
      title: "Random Group Generator",
      subtitle: "Generate random sequences of characters to practice decoding.",
      options: "Options",
      type: "Type",
      types: {
        letters: "Letters Only",
        numbers: "Numbers Only",
        mixed: "Mixed (Alphanumeric)"
      },
      groupSize: "Group Size",
      numGroups: "Number of Groups",
      generate: "Generate New",
      outputLabel: "Output Text",
      play: "Play",
      stop: "Stop"
    },
    lessons: {
      title: "CW Lessons",
      subtitle: "Learn progressively through supervised exercises.",
      curriculum: "Curriculum",
      startLesson: "Start Lesson",
      stop: "Stop"
    },
    quiz: {
      title: "Evaluation Quiz",
      subtitle: "Listen to the sequence, decode it yourself, and check your accuracy.",
      play: "Play Quiz Sequence",
      answerLabel: "Your Answer:",
      answerPlaceholder: "TYPE HERE",
      submit: "Submit Answer",
      next: "Next Question",
      awaiting: "Awaiting submission...",
      accuracy: "Accuracy",
      correct: "correct out of",
      expected: "Expected:",
      typed: "You Typed:",
      mistakes: "Mistaken specific characters:"
    },
    keying: {
      title: "Keying Practice",
      subtitle: "Tap the spacebar or the button below to transmit.",
      tapInput: "Tap Input",
      instruction: "Press and hold Spacebar, or tap the button above to generate Morse code.",
      decodedOutput: "Decoded Output",
      clear: "Clear text"
    },
    monitor: {
      title: "Signal Monitor",
      subtitle: "Real-time oscilloscope visualization of the CW audio waveform.",
      oscilloscope: "Oscilloscope",
      testString: "Test String:",
      toneTest: "Tone Test",
      stop: "Stop"
    },
    copyright: {
      title: "Copyright & Credits",
      content: "This software is provided for educational purposes. Based on the original work by F1ORL (cwpEA).",
      owner: "All rights reserved by sector7gp © 2026",
      repoLink: "GitHub Repository"
    }
  },
  es: {
    sidebar: {
      textGenerator: "Generador de Texto",
      randomGenerator: "Generador Aleatorio",
      lessons: "Lecciones",
      quizMode: "Modo Quiz",
      keyingPractice: "Práctica de Transmisión",
      signalMonitor: "Monitor de Señal",
      footer: {
        version: "v1.0.0",
        credits: "Por sector7gp",
        basedOn: "Basado en f1orl.org",
        repo: "Código Fuente"
      }
    },
    config: {
      title: "Configuración de Audio CW",
      speed: "Velocidad (WPM)",
      farnsworth: "Velocidad Farnsworth",
      effectiveWpm: "WPM Efectiva (Espaciado)",
      frequency: "Frecuencia del Tono",
      volume: "Volumen"
    },
    textGen: {
      title: "Generador de Texto a Morse",
      subtitle: "Convierte texto al instante y escucha CW en tiempo real.",
      inputLabel: "Texto de Entrada",
      inputPlaceholder: "Escribe tu texto aquí...",
      outputLabel: "Traducción a Código Morse",
      play: "Reproducir",
      stop: "Detener",
      clear: "Borrar texto"
    },
    randomGen: {
      title: "Generador de Grupos Aleatorios",
      subtitle: "Genera secuencias aleatorias de caracteres para practicar decodificación.",
      options: "Opciones",
      type: "Tipo",
      types: {
        letters: "Solo Letras",
        numbers: "Solo Números",
        mixed: "Mixto (Alfanumérico)"
      },
      groupSize: "Tamaño de Grupo",
      numGroups: "Cantidad de Grupos",
      generate: "Generar Nuevo",
      outputLabel: "Texto Generado",
      play: "Reproducir",
      stop: "Detener"
    },
    lessons: {
      title: "Lecciones de CW",
      subtitle: "Aprende progresivamente mediante ejercicios supervisados.",
      curriculum: "Currículo",
      startLesson: "Comenzar Lección",
      stop: "Detener"
    },
    quiz: {
      title: "Cuestionario de Evaluación",
      subtitle: "Escucha la secuencia, decodifícala tú mismo y verifica tu precisión.",
      play: "Reproducir Secuencia de Quiz",
      answerLabel: "Tu Respuesta:",
      answerPlaceholder: "ESCRIBE AQUÍ",
      submit: "Enviar Respuesta",
      next: "Siguiente Pregunta",
      awaiting: "Esperando envío...",
      accuracy: "Precisión",
      correct: "correctas de",
      expected: "Esperado:",
      typed: "Escribiste:",
      mistakes: "Caracteres con errores específicos:"
    },
    keying: {
      title: "Práctica de Manipuleo",
      subtitle: "Presiona la barra espaciadora o el botón de abajo para transmitir.",
      tapInput: "Entrada por Pulsación",
      instruction: "Mantén presionado Espacio o pulsa el botón de arriba para generar código Morse.",
      decodedOutput: "Salida Decodificada",
      clear: "Borrar texto"
    },
    monitor: {
      title: "Monitor de Señal",
      subtitle: "Visualización en tiempo real del osciloscopio de la onda de audio CW.",
      oscilloscope: "Osciloscopio",
      testString: "Cadena de Prueba:",
      toneTest: "Prueba de Tono",
      stop: "Detener"
    },
    copyright: {
      title: "Copyright y Créditos",
      content: "Este software se proporciona con fines educativos. Basado en el trabajo original de F1ORL (cwpEA).",
      owner: "Todos los derechos reservados por sector7gp © 2026",
      repoLink: "Repositorio en GitHub"
    }
  }
};

export type Language = 'en' | 'es';
export type TranslationDict = typeof TRANSLATIONS.en;

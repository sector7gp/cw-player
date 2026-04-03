# CW Player - Manual de Usuario / User Manual

Este manual describe el funcionamiento de cada uno de los módulos de la aplicación **CW Player Node**.

---

## 1. Configuración de Audio (CW Audio Configuration)

Disponible en la parte superior de todas las pantallas, este panel permite ajustar los parámetros globales:
- **Speed (WPM)**: Velocidad a la que se envían los caracteres individuales.
- **Farnsworth Speed**: Velocidad efectiva de la frase. Si es menor que la velocidad de carácter, se añadirá espacio extra entre caracteres y palabras para facilitar el aprendizaje.
- **Tone Frequency**: Tono en Hercios (Hz) de la señal (por defecto ~600Hz).
- **Volume**: Control de volumen general de la síntesis.

---

## 2. Generador de Texto (Text Generator)

Convierte cualquier texto escrito a código Morse audible.
1. Escribe o pega texto en el área de "Input Text".
2. Pulsa **Play** para comenzar la reproducción. El texto se resalta visualmente mientras se transmite.
3. Usa **Stop** para detener la reproducción en cualquier momento.

---

## 3. Generador Aleatorio (Random Generator)

Ideal para practicar la recepción de grupos aleatorios (Random Groups).
1. Selecciona el **Tipo** de caracteres (Solo letras, Números o Mixto).
2. Ajusta el **Tamaño del Grupo** (ej. grupos de 5 caracteres).
3. Selecciona la **Cantidad de Grupos** a generar.
4. Pulsa **Generate New** para crear una nueva secuencia y luego **Play** para escucharla.

---

## 4. Lecciones (Lessons)

Un currículo estructurado basado en la introducción progresiva de caracteres.
1. Selecciona una lección de la lista lateral.
2. Lee los caracteres aprendidos en esa lección.
3. Pulsa **Start Lesson** para escuchar la secuencia de práctica.
4. Las lecciones completadas se marcarán con un check ✅.

---

## 5. Modo Quiz (Quiz Mode)

Evalúa tu capacidad de recepción.
1. Pulsa **Play Quiz Sequence** para escuchar una secuencia aleatoria de 5 caracteres.
2. Introduce lo que has escuchado en el campo "Your Answer".
3. Pulsa **Submit Answer**.
4. El sistema te mostrará tu porcentaje de precisión y los errores específicos por carácter.

---

## 6. Práctica de Manipuleo (Keying Practice)

Aprende a transmitir código Morse manualmente.
- **Barra Espaciadora**: Úsala como un manipulador vertical (Straight Key).
- **Control Visual**: Un "Pad" central permite pulsar con el ratón o en pantallas táctiles.
- **Decodificación**: El sistema interpreta tus tiempos de pulsación (dots y dashes) en tiempo real basándose en el WPM configurado en el panel superior.

---

## 7. Monitor de Señal (Signal Monitor)

Visualización técnica de la señal generada.
- Incluye un **Osciloscopio** en tiempo real que muestra la forma de onda senoidal de la síntesis de audio.
- Permite realizar pruebas de tono constantes para ajustar la calidad del audio.

---

## 8. Despliegue en Producción (PM2)

Para entornos de servidor, se recomienda el uso de **PM2** para gestionar el proceso de Node.js:

1. **Construcción**: `npm run build`
2. **Inicio**: `pm2 start npm --name "cw-player" -- start`
3. **Estado**: `pm2 list` (Verifica que esté corriendo en el puerto configurado 3002).

---

## 📜 Copyright

Esta aplicación fue desarrollada por **sector7gp** basándose en la arquitectura y conceptos del proyecto [cwpEA de F1ORL](https://www.f1orl.org/cwpEA.htm) y con el apoyo del **[Radio Club QRM Belgrano (LU4AAO)](http://lu4aao.org/)**. El uso de este software es gratuito con fines educativos y de práctica para radioaficionados.

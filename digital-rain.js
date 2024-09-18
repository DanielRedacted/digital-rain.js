// digital-rain.js 


/////////////////////////////////////////////////////////////////////////////////
// MIT License

// Copyright (c) 2024 Daniel ████ (@DanielRedacted)

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
/////////////////////////////////////////////////////////////////////////////////


function startDigitalRain(options = {}) {
    // Get options or use defaults
    const canvas = options.canvasID || 'digital-rain';  // Renamed canvasId to canvas
    const dropColor = options.dropColor || '#b0fcde'    // Color of leading char
    const trailColor = options.trailColor || '#03A062'; // Renamed fontColor to color
    const backgroundColor = options.backgroundColor || 'rgb(0, 0, 0)';   // Canvas color (must be rgb format)
    const trailLength = options.backgroundColor || '7'; // (0-10)
    const fontSize = options.fontSize || 14;            // Char size in px
    const speedCoeff = options.speedCoeff || 25;        // Speed of the falling drops
    const duration = options.duration || 0;             // Duration of animation in seconds (0 === infinite)

    const seed = 1999;

    // Get the canvas and its rendering context
    const canvasElement = document.getElementById(canvas);
    const ctx = canvasElement.getContext('2d');  


    // Ensure the input is within the valid range (0-10)
    if (trailLength < 0 || trailLength > 10) {
        throw new Error("trailLength should be between 0 and 10");
    }
    // Map the input from the range 0-10 to the range 0.2-0.00
    const frameAlpha = (0.2 - (trailLength / 10) * 0.2).toFixed(2);
    // Style the canvas backgroundColor and define frameColor
    const rgbValues = backgroundColor.match(/\d+/g);    // Parse the RGB values from the background color
    const r = rgbValues[0];
    const g = rgbValues[1];
    const b = rgbValues[2];
    const frameColor = `rgba(${r}, ${g}, ${b}, ${frameAlpha})`;    // Set to a transparency of backgroundColor defined by trailLength
    canvasElement.style.backgroundColor = backgroundColor;
    canvasElement.style.fontFamily = "monospace";


    // Set canvas dimensions to match the window size
    canvasElement.width = window.innerWidth;
    canvasElement.height = window.innerHeight;

    // Calculate the number of rows & columns
    const rows = canvasElement.height / fontSize;
    const columns = Math.floor(canvasElement.width / fontSize); // Ensure it's an integer

    // Initialize arrays for raindrop positions and delays
    const drops = new Array(columns).fill(-1);  // Start all raindrops at the top
    const previousChars = [];                   // Holds the previous character for each raindrop
    let startTime = Date.now();                 // Record the animation start time

    // Seeded random number generator (Mulberry32)
    function mulberry32(a) {
        a = a += Math.floor(Math.random() * 1001); // Generate a random number between 0 and 1000 and add it to the seed variable.
        return () => {
            let t = a += 0x6D2B79F5;
            t = Math.imul(t ^ t >>> 15, t | 1);
            t ^= t + Math.imul(t ^ t >>> 7, t | 61);
            return ((t ^ t >>> 14) >>> 0) / 4294967296;
        };
    }
    const seededRandom = mulberry32(seed);

    // Initialize delays with seeded random values
    const delays = new Array(columns).fill(0).map(() => Math.floor(seededRandom() * 100));

    // Function to generate a random character based on specified character ranges
    function getRandomChar() {
        const charRanges = [
        // Canonical Matrix Characters

            // Arabic Digits: 1-9
            [0x0031, 0x0039],
            [0x0031, 0x0039],

            // Latin Uppercase: A-Z
            [0x0041, 0x005A],
            [0x0041, 0x005A],

            // // KANJI: 日
            // [0x65E5, 0x65E5],

            // Half-width Katakana
            [0xFF65, 0xFF9F],
            [0xFF65, 0xFF9F],
            [0xFF65, 0xFF9F],
            [0xFF65, 0xFF9F],
            [0xFF65, 0xFF9F],
            [0xFF65, 0xFF9F],
            [0xFF65, 0xFF9F],
            [0xFF65, 0xFF9F],

            // Punctuation/Math
            [0x002E, 0x002E], // '.'
            [0x0022, 0x0022], // '"'
            [0x003D, 0x003D], // '='
            [0x002A, 0x002A], // '*'
            [0x002B, 0x002B], // '+'
            [0x002D, 0x002D], // '-'
            [0x00A6, 0x00A6], // '¦'
            [0x007C, 0x007C], // '|'
            [0x005F, 0x005F], // '_'
            [0x0020, 0x0020], // [space]
            [0x2500, 0x2500], // '╌'


        // Non-Canonical Characters

            // [0x0020, 0x003F], // Basic Latin
            // [0x16A0, 0x16EA], // Runic
        ];

        let charCode;
        do {
            const [start, end] = charRanges[Math.floor(seededRandom() * charRanges.length)];
            charCode = Math.floor(seededRandom() * (end - start + 1)) + start;
        } while (charCode >= 0xD800 && charCode <= 0xDFFF);

        return String.fromCharCode(charCode);
    }

    function drawRain() {
        // Set the background color (slightly transparent for trail effect)
        ctx.fillStyle = frameColor;
        ctx.fillRect(0, 0, canvasElement.width, canvasElement.height);
        ctx.font = `${fontSize}px monospace`; // Set the font for the characters
        
        drops.forEach((drop, i) => {
            if (delays[i] > 0) {
                delays[i]--; // Reduce the delay
                return;
            }
    
            // Reset the drop or introduce a random delay if it reaches the bottom
            if (drop * fontSize > canvasElement.height) {
                if (duration === 0 || (Date.now() - startTime) < duration * 1000) {
                    seededRandom() < 0.5 ? (delays[i] = Math.floor(seededRandom() * 25)) : (drops[i] = 0);
                } else {
                    setTimeout(() => { canvasElement.style.opacity = 0; }, 2500);
                }
            }
    
            // First, draw the character from the previous frame in green (trail effect)
            const x = i * fontSize;         // Calculate the horizontal position
            const y = drops[i] * fontSize;  // Calculate the vertical position for the current drop

            // Flip the canvas horizontally for the text to appear backwards
            ctx.save();                                                 // Save the current state of the canvas
            ctx.translate(x + fontSize / 2, y - fontSize / 2);          // Move to the position where we want to draw
            ctx.scale(-1, 1);                                           // Flip the character horizontally
            ctx.translate(-(x + fontSize / 2), -(y - fontSize / 2));    // Move back to the original position

            // Set the previous character color (trail)
            ctx.fillStyle = trailColor;
            ctx.fillText(previousChars[i], x, y - fontSize);

            // Set the new character in the drop color
            const newChar = getRandomChar();
            ctx.fillStyle = dropColor;
            ctx.fillText(newChar, x, y);

            // Restore the canvas state
            ctx.restore();  // Restores the canvas state, so the rest of the drawing is unaffected by the flip            
            
            // Update the previous character tracker and move the raindrop down
            previousChars[i] = newChar; // Store the new character for the next iteration
            drops[i]++;                 // Move the raindrop down
        });
    }

    // Function to animate the Digital Rain
    function animateRain() {
        drawRain();   // Draw the current frame
        setTimeout(() => requestAnimationFrame(animateRain), speedCoeff); // Schedule the next frame
    }

    // Start the animation
    animateRain();
}
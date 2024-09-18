// Encapsulate the Matrix Rain animation in a function with options
function startMatrixRainAnimation(options = {}) {
    // Get options or use defaults
    const canvas = options.canvas || 'matrixCanvas'; // Renamed canvasId to canvas
    const speedCoeff = options.speedCoeff || 25; // Renamed duration to speedCoeff
    const trailColor = options.trailColor || '#0f0'; // Renamed fontColor to color
    const dropColor = options.dropColor || '#fff'
    const backgroundColor = options.backgroundColor || 'rgba(0, 0, 0, 0.08)';
    const fontSize = options.fontSize || 14;
    const year = options.year || 1999; // Renamed seed to year
    const duration = options.duration || 0; // Duration of animation (in seconds)

    // Get the canvas and its rendering context
    const canvasElement = document.getElementById(canvas);
    const ctx = canvasElement.getContext('2d');  

    // Mirror the canvas horizontally
    ctx.translate(canvas.width, 0);  // Move the canvas origin (0,0) to the far right
    ctx.scale(-1, 1);  // Flip the canvas horizontally


    // Set canvas dimensions to match the window size
    canvasElement.width = window.innerWidth;
    canvasElement.height = window.innerHeight;

    // Calculate the number of rows & columns
    const rows = canvasElement.height / fontSize;
    const columns = Math.floor(canvasElement.width / fontSize); // Ensure it's an integer




    // Initialize arrays for raindrop positions and delays
    const drops = new Array(columns).fill(-1); // Start all raindrops at the top
    const previousChars = []; // Holds the previous character for each raindrop
    let startTime = Date.now(); // Record the animation start time


    // Seeded random number generator (Mulberry32)
    function mulberry32(a) {
        a = a += Math.floor(Math.random() * 1001); // Generate a random number between 0 and 1000 and add it to the year variable.
        return () => {
        let t = a += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
        };
    }

    // Create a seeded random number generator
    const seededRandom = mulberry32(year);

    // Initialize delays with seeded random values
    const delays = new Array(columns).fill(0).map(() => Math.floor(seededRandom() * 100));

    // Function to generate a random character based on specified character ranges
    function getRandomChar() {
        // Canon Matrix Symbols
        const charRanges = [
            // Arabix Digits: 1-9
            [0x0031, 0x0039],
            [0x0031, 0x0039],

            // Binary: 0,1
            // [0x0030, 0x0031],

            // Latin Uppercase: A-Z
            [0x0041, 0x005A],
            [0x0041, 0x005A],

            // KANJI - CJK Unified Ideographs
            // [0x4E00, 0x9FFF],
            // [0x4E00, 0x9FFF],
            // [0x4E00, 0x9FFF],
            // [0x4E00, 0x9FFF],

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

    function drawMatrixRain() {
        // Set the background color (slightly transparent for trail effect)
        ctx.fillStyle = backgroundColor;
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
            const x = i * fontSize; // Calculate the horizontal position
            const y = drops[i] * fontSize; // Calculate the vertical position for the current drop
            
            // Set the character from the previous frame to green
            ctx.fillStyle = trailColor; // Set the character color
            ctx.fillText(previousChars[i], x, y - fontSize); // Draw previous character in green at the last position
    
            // Now, generate and draw the new character in white
            const newChar = getRandomChar();
            ctx.fillStyle = dropColor; // White for the new character
            ctx.fillText(newChar, x, y); // Draw the new character at the current position
            
            // Update the previous character tracker and move the raindrop down
            previousChars[i] = newChar; // Store the new character for the next iteration
            drops[i]++; // Move the raindrop down
        });
    }
    

    // Function to animate the Matrix Rain
    function animateMatrixRain() {
        drawMatrixRain(); // Draw the current frame
        setTimeout(() => requestAnimationFrame(animateMatrixRain), speedCoeff); // Schedule the next frame
    }

    // Start the animation
    animateMatrixRain();
}
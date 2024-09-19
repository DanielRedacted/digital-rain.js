# digital-rain.js
Canonical Matrix code canvas animation that's easy to add to any webpage.

![Alt text](example.gif)
<br>[ duration: 3, ]

<hr>

### Matrix Characters (all mirrored unless noted)
The following list of characters I've identified to be canonical to the oriogional Matrix Code (I did not go through the movie frame-by-frame myself). Unless otherwise noted, all characters were mirrored (backwards) to give the effect of being outside the Matrix, looking in.

- ALL INCLUDED: `012345789` `AEHIMRTXZ` `ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ` `:・."=*+-<>¦｜ _ `
<br><br>
- ARABIC DIGITS: `012345789` 
    - Not Mirrored: 
        - `7`
        - `3` is upside-down, 
        - `4` has underscore, 
    - Missing: `6`

- LATIN LETTERS (Not Mirrored): `Z` + `THEMARIX` (THE MATRIX)

- HALF-WIDTH KATAKANA: `ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ`
    - `ｳｵｹ` has overscore, 
    - `ﾈﾎﾔ` has underscore;
    - Missing: `ｦｲｸｺｿﾁﾄﾉﾌﾔﾖﾙﾚﾛﾝ`

- Punctuation/Arithmetic/Other: `:・."=*+-<>¦｜ _`

- KANJI: `日` (roughly meaning day/sun)

NOTE: Currently, I have ALL characters are mirrored. I've omitted the Kanji "日" because it increases the width of each column. 
I would like to correct these innacuracies for a more canonical Matrix code.

## Implement:
Add the following to your HTML document:
```html
    <style>
        #digital-rain {
            display: block;
            width:100%;
            height:100%;
            transition: 1s; /* for canvas transparancy after duration */
            z-index:-999;   /* position canvas behind other elements */
        }
    </style>

    <canvas id="digital-rain"></canvas>

    <script src="digital-rain.js"></script>
    <script>
        startDigitalRain();
    </script>
```

### or with options:
```javascript      
    startDigitalRain({
        canvasID: 'digital-rain',           // id of the target canvas element
        dropColor: "#b0fcde",               // (must be HEX format)
        trailColor: '#00a060',              // (must be HEX format)
        backgroundColor: 'rgb(0, 0, 0)',    // (must be rgb format)
        trailLength: '7',                   // (0 - 10)
        fontSize: 14,                       // (px)
        speedCoeff: 25,                     // larger = slower (1 - 200)
        duration: 0,                        // 0 = infinite (seconds)
    });
```
<hr>

#### To do:
- normalize the "speedCoeff" option
- unmirror "734ZTHEMARIX"
- flip 3 upside-down
- incorporate "日"

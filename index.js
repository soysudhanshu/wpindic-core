import GoogleTransliterator from "./src/GoogleTransliterator.js";
import HindiTransliterator from "./src//Transliterators/HindiTransliterator.js";

/**
 * Google transliterator
 */
// (async() => {
//     const transliterator = new GoogleTransliterator('hi');
//     transliterator._currentLanguage = 'ads';
    
//         const transliteration = await transliterator.transliterate('main')
//         .catch(error => {
//             console.error('Something is wrong');
//             console.log(error.message);
//         })
//         console.log(transliteration);
// })();

// (async()=>{
//     const transliteration = await HindiTransliterator.transliterate('pyaari');
//     const suggestions = await HindiTransliterator.suggest('pyaari');
//     console.log(transliteration, suggestions);
// })()
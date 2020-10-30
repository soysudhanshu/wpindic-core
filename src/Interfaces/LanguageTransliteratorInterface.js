import TransliteratorInterface from "./TransliterateInterface";

class LanguageTransliteratorInterface extends TransliteratorInterface{
    static getLang(){
        throw new Error(`getLang() method must be implemented.`);
    }

    static _getTransliteration(word){
        throw new Error(`_getTransliteration() method must be implemented.`);
    }
}

export default LanguageTransliteratorInterface;
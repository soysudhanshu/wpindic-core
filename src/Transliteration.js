class Transliteration{
    constructor(original, transliterations){
        this._original = original;
        this._transliterations = transliterations;
    }

    get transliterations(){
        return this._transliterations;
    }

    get original(){
        return this._original;
    }
}

export default Transliteration;
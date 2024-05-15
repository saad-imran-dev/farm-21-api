const aposToLexForm = require('apos-to-lex-form')
const { WordTokenizer, SentimentAnalyzer, PorterStemmer } = require('natural');
const SpellCorrector = require('spelling-corrector');
const SW = require('stopword');

class NlpService{
    constructor(){
        this.spellCorrector = new SpellCorrector();
        this.spellCorrector.loadDictionary();
        this.analyzer = new SentimentAnalyzer('English', PorterStemmer, 'afinn');
    }

    processText(text){
        const lexedReview = aposToLexForm(text);
        const casedReview = lexedReview.toLowerCase();
        const alphaOnlyReview = casedReview.replace(/[^a-zA-Z\s]+/g, '');
        return alphaOnlyReview
    }

    tokenize(text){
        const tokenizer = new WordTokenizer();
        const tokenizedReview = tokenizer.tokenize(text);
        tokenizedReview.forEach((word, index) => {
            tokenizedReview[index] = this.spellCorrector.correct(word);
        })
        return tokenizedReview
    }

    removeStopwords(text){
        return SW.removeStopwords(text);
    }

    getSentiment(text){
        const processed = this.processText(text)
        const tokenized = this.tokenize(processed)
        const filtered = this.removeStopwords(tokenized)
        return this.analyzer.getSentiment(filtered)
    }
}

module.exports = NlpService
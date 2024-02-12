const { Translate } = require('@google-cloud/translate').v2;

class TranslateClient {
    constructor(apiKey) {
        this.translate = new Translate({ key: apiKey });
    }
    async translateText(text, targetLanguage) {
        try {
            const [translation] = await this.translate.translate(text, targetLanguage);
            return translation;
        } catch (error) {
            console.error('Error translating text:', error);
            throw new Error('Error translating text');
        }
    }
}

module.exports = TranslateClient;

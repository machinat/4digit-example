import { RecognitionData } from '@sociably/core/base/IntentRecognizer';

const recognitionData: RecognitionData<'en'> = {
  defaultLanguage: 'en',
  languages: ['en'],
  intents: {
    yes: {
      trainingPhrases: {
        en: [
          'ok',
          'ya',
          'yes',
          'good',
          'nice',
          'fine',
          'cool',
          'go',
          'start',
          'alright',
          'I love to',
          "I'd like to",
        ],
      },
    },
    no: {
      trainingPhrases: {
        en: [
          'no',
          'nope',
          'sorry',
          'not this time',
          'maybe next time',
          'no, thanks',
          'never',
          'exit',
          'bye',
          'geve up',
        ],
      },
    },
  },
};

export default recognitionData;

import { makeFactoryProvider } from '@machinat/core/service';
import { ChatEventContext } from '../types';

type IntentResult = {
  type: 'yes' | 'no' | 'unknown';
};

const useIntent =
  // TODO: use IntentRecognizer
  () =>
    async (event: ChatEventContext['event']): Promise<IntentResult> => {
      if (
        event.type === 'postback' ||
        event.type === 'quick_reply' ||
        event.type === 'callback_query'
      ) {
        return {
          type: JSON.parse(event.data || '{}').action || 'unknown',
        };
      }

      if (event.type === 'text') {
        // TODO:  intentRecognizer.detectText()
        return {
          type: /(ok|yes|good|fine|cool|go|start|👍|👌)/i.test(event.text)
            ? 'yes'
            : /(no|fuck|never|exit|bye|give\s*up|👎)/i.test(event.text)
            ? 'no'
            : 'unknown',
        };
      }

      return { type: 'unknown' };
    };

export default makeFactoryProvider()(useIntent);

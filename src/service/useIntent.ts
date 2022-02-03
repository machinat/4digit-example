import { makeFactoryProvider, IntentRecognizer } from '@machinat/core';
import { ChatEventContext } from '../types';

type IntentResult = {
  type: 'yes' | 'no' | 'unknown';
};

const useIntent = makeFactoryProvider({ deps: [IntentRecognizer] })(
  (intentRecognizer) =>
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
        const intent = await intentRecognizer.detectText(
          event.channel,
          event.text
        );
        return { type: (intent.type as 'yes' | 'no') || 'unknown' };
      }

      return { type: 'unknown' };
    }
);

export default useIntent;

import { makeContainer } from '@machinat/core/service';
import Script from '@machinat/script';
import FourDigitGame from '../scenes/FourDigitGame';
import { ChatEventContext } from '../types';

const handlePostback = makeContainer({
  deps: [Script.Processor] as const,
})(
  (processor) =>
    async ({
      event,
      reply,
    }: ChatEventContext & {
      event: { type: 'postback' | 'callback_query' };
    }) => {
      const action = JSON.parse(event.data!);

      if (action.type === 'start') {
        const runtime = await processor.start(event.channel!, FourDigitGame);
        return reply(runtime.output());
      }
    }
);

export default handlePostback;

import Machinat from '@machinat/core';
import { makeContainer } from '@machinat/core/service';
import Script from '@machinat/script';
import RootMenu from '../components/RootMenu';
import GameLoop from '../scenes/GameLoop';
import useIntent from '../service/useIntent';
import { ChatEventContext } from '../types';

const handleMessage = makeContainer({
  deps: [Script.Processor, useIntent] as const,
})(
  (processor, getIntent) =>
    async ({
      event,
      reply,
    }: ChatEventContext & { event: { category: 'message' } }) => {
      if (event.type === 'text') {
        const intent = await getIntent(event);

        if (intent.type === 'yes') {
          const runtime = await processor.start(event.channel, GameLoop);
          return reply(runtime.output());
        }
      }

      await reply(
        <>
          <p>Hello! I'm a 4digit game bot 🤖</p>
          <RootMenu>Start a game now?</RootMenu>
        </>
      );
    }
);

export default handleMessage;

import Sociably, { makeContainer } from '@sociably/core';
import RootMenu from '../components/RootMenu';
import GameLoop from '../scenes/GameLoop';
import useIntent from '../service/useIntent';
import { ChatEventContext } from '../types';

const handleMessage = makeContainer({
  deps: [useIntent],
})(
  (getIntent) =>
    async ({
      event,
      reply,
    }: ChatEventContext & { event: { category: 'message' } }) => {
      if (event.type === 'text') {
        const intent = await getIntent(event);

        if (intent.type === 'yes') {
          return reply(<GameLoop.Start />);
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

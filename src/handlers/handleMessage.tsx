import Machinat from '@machinat/core';
import RootMenu from '../components/RootMenu';
import { ChatEventContext } from '../types';

const handleMessage = async ({
  event,
  reply,
}: ChatEventContext & { event: { category: 'message' } }) => {
  await reply(
    <>
      <p>Hello! I'm a 4digit game bot 🤖</p>
      <RootMenu>Start a game now?</RootMenu>
    </>
  );
};

export default handleMessage;

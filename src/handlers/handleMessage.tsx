import Machinat from '@machinat/core';
import WithWebviewLink from '../components/WithWebviewLink';
import { ChatEventContext } from '../types';

const handleMessage = async ({
  event,
  reply,
}: ChatEventContext & { event: { category: 'message' } }) => {
  await reply(
    <WithWebviewLink>
      Hello {event.type === 'text' ? event.text : 'World'}!
    </WithWebviewLink>
  );
};

export default handleMessage;

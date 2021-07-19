import Machinat, { MachinatNode } from '@machinat/core';
import * as Messenger from '@machinat/messenger/components';
import * as Telegram from '@machinat/telegram/components';
import * as Line from '@machinat/line/components';

type WithRepliesProps = {
  children: MachinatNode;
  replies: { title: string; action: string }[];
};

const WithReplies = ({ children, replies }: WithRepliesProps, { platform }) => {
  if (platform === 'messenger') {
    return (
      <Messenger.Expression
        quickReplies={replies.map(({ title, action }) => (
          <Messenger.TextReply
            title={title}
            payload={JSON.stringify({ action })}
          />
        ))}
      >
        {children}
      </Messenger.Expression>
    );
  }

  if (platform === 'telegram') {
    return (
      <Telegram.Expression
        replyMarkup={replies.map(({ title }) => (
          <Telegram.ReplyKeyboard>
            <Telegram.TextReply text={title} />
          </Telegram.ReplyKeyboard>
        ))}
      >
        {children}
      </Telegram.Expression>
    );
  }

  if (platform === 'line') {
    return (
      <Line.Expression
        quickReplies={replies.map(({ title, action }) => (
          <Line.QuickReply>
            <Line.PostbackAction
              label={title}
              displayText={title}
              data={JSON.stringify({ action })}
            />
          </Line.QuickReply>
        ))}
      >
        {children}
      </Line.Expression>
    );
  }

  return <>{children}</>;
};

export default WithReplies;

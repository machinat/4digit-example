import Sociably, { SociablyNode } from '@sociably/core';
import * as Messenger from '@sociably/messenger/components';
import * as Telegram from '@sociably/telegram/components';
import * as Line from '@sociably/line/components';

type WithRepliesProps = {
  children: SociablyNode;
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
          <Telegram.ReplyKeyboard resizeKeyboard oneTimeKeyboard>
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

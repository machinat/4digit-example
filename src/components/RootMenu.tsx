import Sociably, { SociablyNode } from '@sociably/core';
import * as Messenger from '@sociably/messenger/components';
import { WebviewButton as MessengerWebviewButton } from '@sociably/messenger/webview';
import * as Telegram from '@sociably/telegram/components';
import { WebviewButton as TelegramWebviewButton } from '@sociably/telegram/webview';
import * as Line from '@sociably/line/components';
import { WebviewAction as LineWebviewAction } from '@sociably/line/webview';

type RootMenuProps = {
  children: SociablyNode;
};

const RootMenu = ({ children }: RootMenuProps, { platform }) => {
  const startLabel = 'Start 🔢';
  const startData = JSON.stringify({ type: 'start' });

  const recordsLabel = 'Records 📑';

  if (platform === 'messenger') {
    return (
      <Messenger.ButtonTemplate
        buttons={
          <>
            <Messenger.PostbackButton title={startLabel} payload={startData} />
            <MessengerWebviewButton title={recordsLabel} />
          </>
        }
      >
        {children}
      </Messenger.ButtonTemplate>
    );
  }

  if (platform === 'telegram') {
    return (
      <Telegram.Text
        replyMarkup={
          <Telegram.InlineKeyboard>
            <Telegram.CallbackButton text={startLabel} data={startData} />
            <TelegramWebviewButton text={recordsLabel} />
          </Telegram.InlineKeyboard>
        }
      >
        {children}
      </Telegram.Text>
    );
  }

  if (platform === 'line') {
    return (
      <Line.ButtonTemplate
        altText={(template) => template.text}
        actions={
          <>
            <Line.PostbackAction label={startLabel} data={startData} />
            <LineWebviewAction label={recordsLabel} />
          </>
        }
      >
        {children}
      </Line.ButtonTemplate>
    );
  }

  return <>{children}</>;
};

export default RootMenu;

import Machinat, { MachinatNode } from '@machinat/core';
import { makeContainer } from '@machinat/core/service';
import * as Messenger from '@machinat/messenger/components';
import * as Telegram from '@machinat/telegram/components';
import * as Line from '@machinat/line/components';
import { ServerDomain, LineLiffId } from '../interface';

type RootMenuProps = {
  children: MachinatNode;
};

const RootMenu = makeContainer({ deps: [ServerDomain, LineLiffId] })(
  (serverDomain, lineLiffId) =>
    ({ children }: RootMenuProps, { platform }) => {
      const startLabel = 'Go 🔢';
      const startData = JSON.stringify({ type: 'start' });

      const recordsLabel = 'Records 📑';

      if (platform === 'messenger') {
        return (
          <Messenger.ButtonTemplate
            buttons={
              <>
                <Messenger.PostbackButton
                  title={startLabel}
                  payload={startData}
                />
                <Messenger.UrlButton
                  messengerExtensions
                  title={recordsLabel}
                  url={`https://${serverDomain}/webview?platform=messenger`}
                />
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
                <Telegram.UrlButton
                  login
                  text={recordsLabel}
                  url={`https://${serverDomain}/auth/telegram`}
                />
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
                <Line.UriAction
                  label={recordsLabel}
                  uri={`https://liff.line.me/${lineLiffId}`}
                />
              </>
            }
          >
            {children}
          </Line.ButtonTemplate>
        );
      }

      return <>{children}</>;
    }
);

export default RootMenu;

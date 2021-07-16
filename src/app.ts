import Machinat from '@machinat/core';
import Http from '@machinat/http';
import Script from '@machinat/script';
import Messenger from '@machinat/messenger';
import MessengerAuthorizer from '@machinat/messenger/webview';
import Line from '@machinat/line';
import LineAuthorizer from '@machinat/line/webview';
import Telegram from '@machinat/telegram';
import TelegramAuthorizer from '@machinat/telegram/webview';
import Webview from '@machinat/webview';
import RedisState from '@machinat/redis-state';
import { FileState } from '@machinat/local-state';
import { ServerDomain, LineLiffId } from './interface';
import FourDigitGame from './scenes/FourDigitGame';
import nextConfigs from './webview/next.config.js';

const {
  // location
  NODE_ENV,
  PORT,
  DOMAIN,
  // webview
  WEBVIEW_AUTH_SECRET,
  // messenger
  MESSENGER_PAGE_ID,
  MESSENGER_APP_ID,
  MESSENGER_ACCESS_TOKEN,
  MESSENGER_APP_SECRET,
  MESSENGER_VERIFY_TOKEN,
  // telegram
  TELEGRAM_BOT_TOKEN,
  TELEGRAM_SECRET_PATH,
  // line
  LINE_PROVIDER_ID,
  LINE_CHANNEL_ID,
  LINE_ACCESS_TOKEN,
  LINE_CHANNEL_SECRET,
  LINE_LIFF_ID,
  // redis
  REDIS_URL,
} = process.env as Record<string, string>;

const DEV = NODE_ENV === 'development';

const app = Machinat.createApp({
  modules: [
    Http.initModule({
      listenOptions: {
        port: PORT ? Number(PORT) : 8080,
      },
    }),

    DEV
      ? FileState.initModule({
          path: './.state_data.json',
        })
      : RedisState.initModule({
          clientOptions: {
            url: REDIS_URL,
          },
        }),

    Script.initModule({
      libs: [FourDigitGame],
    }),
  ],

  platforms: [
    Messenger.initModule({
      webhookPath: '/webhook/messenger',
      pageId: Number(MESSENGER_PAGE_ID),
      appSecret: MESSENGER_APP_SECRET,
      accessToken: MESSENGER_ACCESS_TOKEN,
      verifyToken: MESSENGER_VERIFY_TOKEN,
    }),

    Telegram.initModule({
      webhookPath: '/webhook/telegram',
      botToken: TELEGRAM_BOT_TOKEN,
      secretPath: TELEGRAM_SECRET_PATH,
    }),

    Line.initModule({
      webhookPath: '/webhook/line',
      providerId: LINE_PROVIDER_ID,
      channelId: LINE_CHANNEL_ID,
      accessToken: LINE_ACCESS_TOKEN,
      channelSecret: LINE_CHANNEL_SECRET,
      liffChannelIds: [LINE_LIFF_ID.split('-')[0]],
    }),

    Webview.initModule<
      MessengerAuthorizer | TelegramAuthorizer | LineAuthorizer
    >({
      webviewHost: DOMAIN,
      webviewPath: '/webview',
      authSecret: WEBVIEW_AUTH_SECRET,

      sameSite: 'none',
      nextServerOptions: {
        dev: DEV,
        dir: `./${DEV ? 'src' : 'lib'}/webview`,
        conf: {
          ...nextConfigs,
          publicRuntimeConfig: {
            messengerAppId: MESSENGER_APP_ID,
            lineProviderId: LINE_PROVIDER_ID,
            lineBotChannelId: LINE_CHANNEL_ID,
            lineLiffId: LINE_LIFF_ID,
          },
        },
      },
    }),
  ],

  services: [
    { provide: Webview.AuthorizerList, withProvider: MessengerAuthorizer },
    { provide: Webview.AuthorizerList, withProvider: TelegramAuthorizer },
    { provide: Webview.AuthorizerList, withProvider: LineAuthorizer },

    { provide: ServerDomain, withValue: DOMAIN },
    { provide: LineLiffId, withValue: LINE_LIFF_ID },
  ],
});

export default app;

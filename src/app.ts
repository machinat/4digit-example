import Machinat from '@machinat/core';
import Http from '@machinat/http';
import Script from '@machinat/script';
import Messenger from '@machinat/messenger';
import MessengerAuthenticator from '@machinat/messenger/webview';
import Line from '@machinat/line';
import LineAuthenticator from '@machinat/line/webview';
import Telegram from '@machinat/telegram';
import TelegramAuthenticator from '@machinat/telegram/webview';
import Webview from '@machinat/webview';
import DialogFlow from '@machinat/dialogflow';
import RedisState from '@machinat/redis-state';
import { FileState } from '@machinat/dev-tools';
import nextConfigs from '../webview/next.config.js';
import recognitionData from './recognitionData';
import useIntent from './service/useIntent';
import { ServerDomain, LineLiffId } from './interface';
import FourDigitGame from './scenes/FourDigitGame';
import GameLoop from './scenes/GameLoop';

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
  // dialogflow
  DIALOG_FLOW_PROJECT_ID,
  DIALOG_FLOW_CLIENT_EMAIL,
  DIALOG_FLOW_PRIVATE_KEY,
  GOOGLE_APPLICATION_CREDENTIALS,
} = process.env as Record<string, string>;

const DEV = NODE_ENV !== 'production';

const app = Machinat.createApp({
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
      MessengerAuthenticator | TelegramAuthenticator | LineAuthenticator
    >({
      webviewHost: DOMAIN,
      webviewPath: '/webview',
      authSecret: WEBVIEW_AUTH_SECRET,

      sameSite: 'none',
      nextServerOptions: {
        dev: DEV,
        dir: './webview',
        conf: nextConfigs,
      },
    }),
  ],

  modules: [
    Http.initModule({
      listenOptions: {
        port: PORT ? Number(PORT) : 8080,
      },
    }),

    DEV
      ? FileState.initModule({
          path: './.state_storage.json',
        })
      : RedisState.initModule({
          clientOptions: {
            url: REDIS_URL,
          },
        }),

    Script.initModule({
      libs: [FourDigitGame, GameLoop],
    }),

    DialogFlow.initModule({
      recognitionData,
      projectId: DIALOG_FLOW_PROJECT_ID,
      environment: `digits-example-${DEV ? 'dev' : 'prod'}`,
      clientOptions: GOOGLE_APPLICATION_CREDENTIALS
        ? undefined
        : {
            credentials: {
              client_email: DIALOG_FLOW_CLIENT_EMAIL,
              private_key: DIALOG_FLOW_PRIVATE_KEY,
            },
          },
    }),
  ],

  services: [
    useIntent,
    {
      provide: Webview.AuthenticatorList,
      withProvider: MessengerAuthenticator,
    },
    { provide: Webview.AuthenticatorList, withProvider: TelegramAuthenticator },
    { provide: Webview.AuthenticatorList, withProvider: LineAuthenticator },

    { provide: ServerDomain, withValue: DOMAIN },
    { provide: LineLiffId, withValue: LINE_LIFF_ID },
  ],
});

export default app;

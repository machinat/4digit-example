import type { MessengerEventContext } from '@machinat/messenger';
import type { MessengerServerAuthorizer } from '@machinat/messenger/webview';
import type { TelegramEventContext } from '@machinat/telegram';
import type { TelegramServerAuthorizer } from '@machinat/telegram/webview';
import type { LineEventContext } from '@machinat/line';
import type { LineServerAuthorizer } from '@machinat/line/webview';
import type { WebviewEventContext } from '@machinat/webview';

export type ChatEventContext =
  | MessengerEventContext
  | TelegramEventContext
  | LineEventContext;

export type WebAppEventContext = WebviewEventContext<
  MessengerServerAuthorizer | TelegramServerAuthorizer | LineServerAuthorizer
>;

export type AppEventContext = ChatEventContext | WebAppEventContext;

export type GameRecord = {
  answer: string;
  guesses: string[];
  startAt: number;
  finishAt: number;
};

export type GameRecordsState = {
  records: GameRecord[];
};

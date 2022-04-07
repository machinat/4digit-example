import type { MessengerEventContext } from '@machinat/messenger';
import type MessengerAuth from '@machinat/messenger/webview';
import type { TelegramEventContext } from '@machinat/telegram';
import type TelegramAuth from '@machinat/telegram/webview';
import type { LineEventContext } from '@machinat/line';
import type LineAuth from '@machinat/line/webview';
import type { WebviewEventContext } from '@machinat/webview';

export type ChatEventContext =
  | MessengerEventContext
  | TelegramEventContext
  | LineEventContext;

export type WebAppEventContext = WebviewEventContext<
  MessengerAuth | TelegramAuth | LineAuth
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

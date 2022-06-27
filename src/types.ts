import type { MessengerEventContext } from '@sociably/messenger';
import type MessengerAuth from '@sociably/messenger/webview';
import type { TelegramEventContext } from '@sociably/telegram';
import type TelegramAuth from '@sociably/telegram/webview';
import type { LineEventContext } from '@sociably/line';
import type LineAuth from '@sociably/line/webview';
import type { WebviewEventContext } from '@sociably/webview';

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

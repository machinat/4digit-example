import { makeContainer, StateController } from '@sociably/core';
import Script from '@sociably/script';
import { Stream } from '@sociably/stream';
import { filter } from '@sociably/stream/operators';
import handleMessage from './handlers/handleMessage';
import handlePostback from './handlers/handlePostback';
import handleWebview from './handlers/handleWebview';
import GameLoop from './scenes/GameLoop';
import {
  AppEventContext,
  ChatEventContext,
  WebAppEventContext,
  GameRecordsState,
} from './types';

const main = (event$: Stream<AppEventContext>): void => {
  const chat$ = event$.pipe(
    filter((ctx): ctx is ChatEventContext => ctx.platform !== 'webview'),
    filter(
      makeContainer({ deps: [Script.Processor, StateController] })(
        (processor: Script.Processor<typeof GameLoop>, stateController) =>
          async (ctx: ChatEventContext) => {
            const { channel } = ctx.event;
            if (!channel) {
              return true;
            }

            const runtime = await processor.continue(channel, ctx);
            if (!runtime) {
              return true;
            }

            await ctx.reply(runtime.output());

            if (runtime.returnValue) {
              const newRecords = runtime.returnValue.records;
              await stateController
                .channelState(channel)
                .update<GameRecordsState>(
                  'game_records',
                  ({ records } = { records: [] }) => ({
                    records: [...records, ...newRecords],
                  })
                );
            }

            return false;
          }
      )
    )
  );

  chat$
    .pipe(
      filter(
        (ctx): ctx is ChatEventContext & { event: { category: 'message' } } =>
          ctx.event.category === 'message'
      )
    )
    .subscribe(handleMessage, console.error);

  chat$
    .pipe(
      filter(
        (ctx) =>
          ctx.event.type === 'postback' || ctx.event.type === 'callback_query'
      )
    )
    .subscribe(handlePostback, console.error);

  event$
    .pipe(
      filter(
        (ctx): ctx is WebAppEventContext => ctx.event.platform === 'webview'
      )
    )
    .subscribe(handleWebview, console.error);
};

export default main;

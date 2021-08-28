import { makeContainer } from '@machinat/core/service';
import StateController from '@machinat/core/base/StateController';
import Script from '@machinat/script';
import { Stream } from '@machinat/stream';
import { filter } from '@machinat/stream/operators';
import handleMessage from './handlers/handleMessage';
import handlePostback from './handlers/handlePostback';
import handleWebview from './handlers/handleWebview';
import GameLoop from './scenes/GameLoop';
import {
  AppEventContext,
  ChatEventContext,
  WebAppEventContext,
  GameRecordsState,
} from '../types';

const main = (event$: Stream<AppEventContext>): void => {
  const chat$ = event$.pipe(
    filter((ctx): ctx is ChatEventContext => ctx.platform !== 'webview'),
    filter(
      makeContainer({ deps: [Script.Processor, StateController] as const })(
        (processor: Script.Processor<typeof GameLoop>, stateController) =>
          async (ctx) => {
            const { channel } = ctx.event;

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

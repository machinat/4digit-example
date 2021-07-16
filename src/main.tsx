import { makeContainer } from '@machinat/core/service';
import Script from '@machinat/script';
import { Stream } from '@machinat/stream';
import { filter } from '@machinat/stream/operators';
import handleMessage from './handlers/handleMessage';
import handlePostback from './handlers/handlePostback';
import handleWebview from './handlers/handleWebview';
import { AppEventContext, ChatEventContext, WebAppEventContext } from './types';

const main = (event$: Stream<AppEventContext>): void => {
  const chat$ = event$.pipe(
    filter((ctx): ctx is ChatEventContext => ctx.platform !== 'webview'),
    filter(
      makeContainer({ deps: [Script.Processor] })(
        (processor) => async (ctx) => {
          const runtime = await processor.continue(ctx.event.channel, ctx);
          if (!runtime) {
            return true;
          }

          await ctx.reply(runtime.output());
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
    .subscribe(handleMessage);

  chat$
    .pipe(
      filter(
        (ctx) =>
          ctx.event.type === 'postback' || ctx.event.type === 'callback_query'
      )
    )
    .subscribe(handlePostback);

  // chat$
  //   .pipe(
  //     filter(
  //       (ctx): ctx is WebAppEventContext => ctx.event.platform === 'webview'
  //     )
  //   )
  //   .subscribe(handleWebview);
};

export default main;

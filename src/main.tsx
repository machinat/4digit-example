import { Stream } from '@machinat/stream';
import { filter } from '@machinat/stream/operators';
import handleMessage from './handlers/handleMessage';
import handleWebview from './handlers/handleWebview';
import { AppEventContext, ChatEventContext, WebAppEventContext } from './types';

const main = (event$: Stream<AppEventContext>): void => {
  event$
    .pipe(
      filter(
        (ctx): ctx is ChatEventContext & { event: { category: 'message' } } =>
          ctx.event.category === 'message'
      )
    )
    .subscribe(handleMessage);

  event$
    .pipe(
      filter(
        (ctx): ctx is WebAppEventContext => ctx.event.platform === 'webview'
      )
    )
    .subscribe(handleWebview);
};

export default main;

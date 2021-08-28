import StateController from '@machinat/core/base/StateController';
import { makeContainer } from '@machinat/core/service';
import { WebAppEventContext, GameRecordsState } from '../types';

const handleWebview = makeContainer({ deps: [StateController] })(
  (stateController) =>
    async ({ event, bot, metadata: { auth } }: WebAppEventContext) => {
      if (event.type === 'connect') {
        const data = await stateController
          .channelState(auth.channel)
          .get<GameRecordsState>('game_records');

        await bot.send(event.channel, {
          category: 'webview_push',
          type: 'app_data',
          payload: data || { records: [] },
        });
      } else if (event.type === 'delete_record') {
        const { startAt } = event.payload;

        await stateController
          .channelState(auth.channel)
          .update<GameRecordsState>(
            'game_records',
            ({ records } = { records: [] }) => ({
              records: records.filter((record) => record.startAt !== startAt),
            })
          );

        await bot.send(event.channel, {
          category: 'webview_push',
          type: 'record_deleted',
          payload: { startAt },
        });

        console.log({ startAt });
      }
    }
);

export default handleWebview;

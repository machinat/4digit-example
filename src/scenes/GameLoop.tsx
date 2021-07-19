import Machinat from '@machinat/core';
import StateController from '@machinat/core/base/StateController';
import { makeContainer } from '@machinat/core/service';
import { build } from '@machinat/script';
import { WHILE, PROMPT, CALL, RETURN } from '@machinat/script/keywords';
import FourDigitGame from './FourDigitGame';
import useIntent from '../service/useIntent';
import WithReplies from '../components/WithReplies';
import { GameRecord, ChatEventContext } from '../types';

type GameLoopVars = {
  records: GameRecord[];
  continue: boolean;
};

export default build<
  GameLoopVars,
  ChatEventContext,
  void,
  { records: GameRecord[] }
>(
  {
    name: 'GameLoop',
    initVars: () => ({ records: [], continue: true }),
  },
  <>
    <WHILE<GameLoopVars> condition={({ vars }) => vars.continue}>
      {() => (
        <p>
          Game Start <code>🔢</code>
        </p>
      )}
      <CALL<GameLoopVars, typeof FourDigitGame>
        key="play"
        script={FourDigitGame}
        set={({ vars }, record) => ({
          ...vars,
          records: [...vars.records, record],
        })}
      />

      {() => (
        <WithReplies
          replies={[
            { title: 'Ok 👌', action: 'yes' },
            { title: 'No ✋', action: 'no' },
          ]}
        >
          <p>One more game?</p>
        </WithReplies>
      )}

      <PROMPT<GameLoopVars>
        key="ask-continue"
        set={makeContainer({ deps: [useIntent] })(
          (getIntent) =>
            async ({ vars }, { event }) => {
              const intent = await getIntent(event);
              return {
                ...vars,
                continue: intent.type === 'yes',
              };
            }
        )}
      />
    </WHILE>

    {() => <p>Come back anytime! 😄</p>}
    <RETURN value={({ vars: { records } }) => ({ records })} />
  </>
);

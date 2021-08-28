import Machinat from '@machinat/core';
import { makeContainer } from '@machinat/core/service';
import StateController from '@machinat/core/base/StateController';
import { build } from '@machinat/script';
import { $, WHILE, PROMPT, IF, THEN, RETURN } from '@machinat/script/keywords';
import { generate4Digits, verify4Digit } from '../utils/4digits';
import useIntent from '../service/useIntent';
import WithReplies from '../components/WithReplies';
import { GameRecord, ChatEventContext } from '../types';

type GameVars = {
  answer: string;
  inputs: string[];
  startAt: number;
  result: null | { a: number; b: number };
  giveUp: boolean;
};

export default build<GameVars, ChatEventContext, void, null| GameRecord>(
  {
    name: 'FourDigitGame',
    initVars: () => ({
      answer: generate4Digits(),
      inputs: [],
      startAt: Date.now(),
      result: null,
      giveUp: false,
    }),
  },
  <$<GameVars>>
    {() => <p>Guess a 4 digit number:</p>}

    <WHILE<GameVars>
      condition={({ vars: { result } }) => !(result && result.a === 4)}
    >
      <PROMPT<GameVars>
        key="ask-digits"
        set={makeContainer({ deps: [useIntent] })(
          (getIntent) =>
            async ({ vars }, { event }) => {
              const result =
                event.type === 'text'
                  ? verify4Digit(event.text, vars.answer)
                  : null;

              if (!result) {
                const intent = await getIntent(event);
                return { ...vars, result, giveUp: intent.type === 'no' };
              }

              return { ...vars, result, inputs: [...vars.inputs, event.text] };
            }
        )}
      />

      <IF<GameVars> condition={({ vars }) => vars.giveUp}>
        <THEN<GameVars>>
          {({ vars: { answer } }) => (
            <p>
              Alright, the answer is <b>{answer}</b>! 😉
            </p>
          )}
          <RETURN />
        </THEN>
      </IF>

      {({ vars: { inputs, result } }) => {
        return (
          <WithReplies replies={[{ title: 'Give up', action: 'no' }]}>
            {!result ? (
              <p>
                Please insert a 4 digits number like <i>1234</i>:
              </p>
            ) : result.a === 4 ? (
              <>
                <p>Congratulation 🎉</p>
                <p>
                  You've finished in <b>{inputs.length}</b> guesses!
                </p>
              </>
            ) : (
              <p>
                <i>
                  {result.a}a {result.b}b
                </i>
              </p>
            )}
          </WithReplies>
        );
      }}
    </WHILE>

    <RETURN<GameVars, GameRecord>
      value={({ vars: { answer, inputs, startAt } }) => ({
        answer,
        guesses: inputs,
        startAt,
        finishAt: Date.now(),
      })}
    />
  </$>
);

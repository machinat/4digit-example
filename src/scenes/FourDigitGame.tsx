import Machinat from '@machinat/core';
import { makeContainer } from '@machinat/core/service';
import { build } from '@machinat/script';
import { $, WHILE, PROMPT, IF, THEN, EFFECT } from '@machinat/script/keywords';
import {
  generate4Digits,
  check4DigitFormat,
  verify4Digit,
} from '../utils/4digits';

type GameVars = {
  answer: string;
  input?: string;
  count: number;
  result: { a: number; b: number };
  finished: boolean;
};

export default build<GameVars>(
  {
    name: 'FourDigitGame',
    initVars: () => ({
      answer: generate4Digits(),
      input: undefined,
      result: { a: 0, b: 0 },
      count: 0,
      finished: false,
    }),
  },
  <$<GameVars>>
    {() => <p>Guess a 4 digit number:</p>}

    <WHILE<GameVars> condition={({ vars }) => !vars.finished}>
      <PROMPT<GameVars>
        key="ask-todo"
        set={({ vars }, { event }) => {
          const isInputValid =
            event.type === 'text' && check4DigitFormat(event.text);
          return {
            ...vars,
            input: isInputValid ? event.text : undefined,
            count: isInputValid ? vars.count + 1 : vars.count,
          };
        }}
      />

      <IF<GameVars> condition={({ vars }) => vars.input !== undefined}>
        <THEN<GameVars>>
          <EFFECT
            set={({ vars }) => {
              const result = verify4Digit(vars.input, vars.answer);

              return { ...vars, result, finished: result.a === 4 };
            }}
          />

          {({ vars: { count, result, finished } }) => {
            return finished ? (
              <>
                <p>Congratulation 🎉</p>
                <p>You've finished in {count} guesses!</p>
              </>
            ) : (
              <p>
                {result.a}a {result.b}b
              </p>
            );
          }}
        </THEN>
      </IF>
    </WHILE>

    {/*<EFFECT<GameVars>
      set={makeContainer({ deps: [TodoController] })(
        (todoController) =>
          async ({ vars, channel }) => {
            const { data } = await todoController.addTodo(
              channel,
              vars.todoName
            );
            return {
              ...vars,
              todosCount: data.todos.length,
            };
          }
      )}
    />*/}
  </$>
);

import React from 'react';
import Head from 'next/head';
import getConfig from 'next/config';
import WebviewClient, { useEventReducer } from '@machinat/webview/client';
import { MessengerClientAuthorizer } from '@machinat/messenger/webview';
import { TelegramClientAuthorizer } from '@machinat/telegram/webview';
import { LineClientAuthorizer } from '@machinat/line/webview';
import { GameRecordsState } from '../../src/types';

const { publicRuntimeConfig } = getConfig();

const client = new WebviewClient(
  typeof window === 'undefined'
    ? { mockupMode: true, authorizers: [] }
    : {
        authorizers: [
          new MessengerClientAuthorizer({
            appId: publicRuntimeConfig.messengerAppId,
          }),
          new TelegramClientAuthorizer(),
          new LineClientAuthorizer({
            liffId: publicRuntimeConfig.lineLiffId,
          }),
        ],
      }
);

const DeleteButton = ({ startAt }) => (
  <button
    style={{ float: 'right' }}
    disabled={!client.isConnected}
    onClick={() => {
      client.send({
        category: 'webview_action',
        type: 'delete_record',
        payload: { startAt },
      });
    }}
  >
    ❌
  </button>
);

const WebAppHome = () => {
  const { records } = useEventReducer<GameRecordsState>(
    client,
    (currentData, { event }) => {
      if (event.type === 'app_data') {
        return event.payload;
      }
      if (event.type === 'record_deleted') {
        return {
          records: currentData.records.filter(
            (record) => record.startAt !== event.payload.startAt
          ),
        };
      }
      return currentData;
    },
    { records: [] }
  );

  const bestRecord = records.reduce(
    (best, { guesses }) => Math.max(best, guesses.length),
    -1
  );
  const bestTime = records.reduce(
    (best, { startAt, finishAt }) => Math.min(best, finishAt - startAt),
    Infinity
  );

  return (
    <div>
      <Head>
        <title>Machinat Webview</title>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/water.css@2/out/water.css"
        />
      </Head>

      <main>
        <h3>
          Best Record 👑: <i>{bestRecord !== -1 ? bestRecord : '-'} times</i>
        </h3>
        <h3>
          Best Time ⏰:{' '}
          <i>{bestTime !== Infinity ? Math.floor(bestTime / 1000) : '-'} sec</i>
        </h3>
        {records.map(({ answer, guesses, startAt, finishAt }) => (
          <details key={startAt}>
            <summary>
              <b>{answer}</b>
              {' - '}
              <i>
                <code>{Math.floor((finishAt - startAt) / 1000)}s</code>
                {' - '}
                <code>{guesses.length} times</code>
              </i>
              <DeleteButton startAt={startAt} />
            </summary>
            <ol>
              {guesses.map((input) => (
                <li key={input}>{input}</li>
              ))}
            </ol>
          </details>
        ))}
      </main>
    </div>
  );
};

// to activate publicRuntimeConfig
export const getServerSideProps = () => ({ props: {} });
export default WebAppHome;

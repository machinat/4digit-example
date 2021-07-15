# 4digits-example

This is a Machinat chat app generated by [`@machinat/creat-app`](https://github.com/machinat/machinat/tree/master/packages/create-app).

Chat platforms supported by this app:

- [Messenger](https://messenger.com)
- [Telegram](https://telegram.org)
- [LINE](https://line.me)

## Getting Started

Run the app in development mode:

```sh
$ npm run dev
```

> For the first time using, you have to finish the setup steps listed at
> [Environments Setup](#environments-setup) first.

The command do 2 things:

1. Start a dev server up. It would automatically refresh when codes changed.
2. Create a https tunnel connected to a _https://xxx.t.machinat.dev_ endpoint.
   So your local server can accept webhook requests from the chat platforms.

### Environments Setup

#### Configure Chat Platforms

You need to set up the chat platforms by filling the empty fields in `.env`
file. Check the `.env.example` file for references.

#### Start Dev Server

Try starting the server up with `npm run dev` command. It should succeed if
you fill all the required environments.

#### Initiate the Bindings

Keep the dev server runnning, and execute this command in a _new command line
tab_:

```sh
$ npm run migrate
```

This register the webhook bindings and some settings to the chat platforms.
Check `src/migrations/0-init-app.ts` file for the details.

You can run `npm run migrate -- --down` to revert the changes. It's useful if
you edit any settings and need to execute the migration jobs again.

#### Start Developing

Now go to the chat platforms and talk to your bot. Your hello world app should
be running! Edit the reply content in `src/main.ts` and the app will be
updated automatically.

## Learn More

Here are some resources to learn developing a chat app with Machinat:

- [Machinat Document](https://machinat.com/doc) - features and guides of Machinat framework.
- [Learn Machinat](https://machinat.com/learn) - a step-by-step tutorial to make a todo app in chat.

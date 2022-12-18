# ChatGPT Twitch Bot

## Prerequisites

- NodeJS >= 18

## Usage

Firstly you need to install the required npm packages with

`npm i`

This bot is based on the chatgpt package from @transitive-bullshit
We also use tmijs to communicate with the Twitch Channels

After installing the required packages you need to populate the environment file with following variables

- OPENAI_EMAIL=
- OPENAI_PASSWORD=
- TWITCH_NAME=
- TWITCH_TOKEN=
- TWITCH_CHANNEL=

For the OPENAI Variables just put your credentials in, remember to log out from your browser before. For Twitch you can create an extra bot or connect from your main Account.
You can get the TWITCH_TOKEN [here](https://twitchapps.com/tmi/)
You can join any desired Twitch Channel by specifying it with TWITCH_CHANNEL variable.

After all of that you can start the script with following line

`npx tsx chatgpt-twitch-bot.ts`

This will compile and run the typescript file on the fly

## Known Problems

I have tried to work on having conversations but unfortunately I always run into a 429, there is an extra branch if you would like to contribute

Unfortunately you have to login with the captcha on every request...

import { ChatGPTAPI, getOpenAIAuth } from "chatgpt";
import tmi from "tmi.js";
import dotenv from "dotenv";
dotenv.config();

const client = new tmi.Client({
  options: { debug: true },
  connection: {
    secure: true,
    reconnect: true,
  },
  identity: {
    username: process.env.TWITCH_NAME,
    password: process.env.TWITCH_TOKEN,
  },
  channels: [process.env.TWITCH_CHANNEL as string],
});

let chatGPTAPI: ChatGPTAPI;

(async () => {
  const openAIAuth = await getOpenAIAuth({
    email: process.env.OPENAI_EMAIL,
    password: process.env.OPENAI_PASSWORD,
  });

  chatGPTAPI = new ChatGPTAPI({ ...openAIAuth });
  await chatGPTAPI.ensureAuth();
})();

client.connect();

client.on("message", async (channel, tags, message, self) => {
  if (self || !message.startsWith("!")) {
    return;
  }

  const args = message.slice(1).split(" ");
  const command = args.shift()?.toLowerCase();

  if (command === "chatgpt test") {
    client.say(channel, `@${tags.username}, test`);
  } else if (command === "chatgpt") {
    const prompt = args.join(" ");

    const response = await chatGPTAPI.sendMessage(prompt);

    client.say(channel, `@${tags.username}, ${response}`);
  }
});

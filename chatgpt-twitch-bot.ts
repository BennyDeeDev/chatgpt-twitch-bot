import {
  ChatGPTAPI,
  ChatGPTAPIBrowser,
  getOpenAIAuth,
  OpenAIAuth,
} from "chatgpt";
import tmi from "tmi.js";
import dotenv from "dotenv";
import { ChatGPTConversation } from "chatgpt";
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
  channels: ["chatgpt_bot_0001"],
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

interface TwitchBotChatGPTConversation {
  conversation: ChatGPTConversation;
  username: string;
}

const conversations: TwitchBotChatGPTConversation[] = [];

client.on("message", async (channel, tags, message, self) => {
  if (self || !message.startsWith("!")) {
    return;
  }

  const args = message.slice(1).split(" ");
  const command = args.shift()?.toLowerCase();

  if (command === "chatgpt") {
    const prompt = args.join(" ");
    const foundConversationIndex = conversations.findIndex(
      (e) => e.username === tags.username
    );

    let response: string;
    if (prompt === "clear") {
      conversations.splice(foundConversationIndex);
      response = "Cleared the conversation";
    } else if (foundConversationIndex !== -1) {
      const currentConversation =
        conversations[foundConversationIndex].conversation;
      response = await currentConversation.sendMessage(prompt, {
        timeoutMs: 2 * 60 * 1000,
      });
    } else {
      const newConversation = chatGPTAPI.getConversation();
      conversations.push({
        conversation: newConversation,
        username: tags.username as string,
      });

      response = await chatGPTAPI.sendMessage(prompt, {
        timeoutMs: 2 * 60 * 1000,
      });
    }

    client.say(channel, `@${tags.username}, ${response}}`);
  }
});

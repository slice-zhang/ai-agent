const {
  ChatAlibabaTongyi,
} = require("@langchain/community/chat_models/alibaba_tongyi");
const { createAgent, toolStrategy } = require("langchain");
const { SystemMessage } = require("@langchain/core/messages");
const { MemorySaver } = require("@langchain/langgraph");
const loveReport = require("../struct/loveReport");

const initAgentClient = (alibabaApiKey) => {
  const systemPrompt = `你扮演一名恋爱大师，每次对话后都要生成一份明确的恋爱计划，严格遵守loveReport结构体内容`;

  const checkpointer = new MemorySaver();
  const model = new ChatAlibabaTongyi({
    model: "qwen-plus",
    alibabaApiKey,
  });

  return createAgent({
    model,
    tools: [],
    checkpointer,
    systemPrompt: new SystemMessage(systemPrompt),
    middleware: [],
    responseFormat: toolStrategy(loveReport),
  });
};

module.exports = {
  initAgentClient,
};

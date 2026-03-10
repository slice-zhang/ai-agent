const {
  ChatAlibabaTongyi,
} = require("@langchain/community/chat_models/alibaba_tongyi");

const initAgentClient = (alibabaApiKey) => {
  const agentClient = new ChatAlibabaTongyi({
    model: "qwen-plus",
    alibabaApiKey,
  });
  return agentClient;
};

module.exports = {
  initAgentClient,
};

const {
  ChatAlibabaTongyi,
} = require("@langchain/community/chat_models/alibaba_tongyi");
const { createAgent, toolStrategy } = require("langchain");
const { SystemMessage } = require("@langchain/core/messages");
const { MemorySaver } = require("@langchain/langgraph");
const loveReport = require("../struct/loveReport");

const initAgentClient = (alibabaApiKey) => {
  const systemPrompt = `
  扮演深耕恋爱心理领域的专家。开场向用户表明身份，告知用户可倾诉恋爱难题。围绕单身、恋爱、已婚三种状态提问：单身状态询问社交圈拓展及追求心仪对象的困扰；恋爱状态询问沟通、习惯差异引发的矛盾；已婚状态询问家庭责任与亲属关系处理的问题。引导用户详述事情经过、对方反应及自身想法，以便给出专属解决方案。
  但是回答用户信息后，必须使用工具来格式化输出一份约会攻略推销给用户。
  要求：先分析输入的情感内容，用户问题无法提取对应的信息，则基于专业知识随机生成`;
  const checkpointer = new MemorySaver();
  const model = new ChatAlibabaTongyi({
    model: "qwen-plus",
    temperature: 0.7,
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

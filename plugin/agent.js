const {
    ChatAlibabaTongyi,
} = require("@langchain/community/chat_models/alibaba_tongyi");
const {createAgent, providerStrategy} = require("langchain");
const {SystemMessage} = require("@langchain/core/messages");
const {MemorySaver} = require("@langchain/langgraph");
const loveReport = require("../struct/loveReport");
const {StructuredOutputParser} = require("@langchain/core/output_parsers");

const initAgentClient = (alibabaApiKey) => {
    const parser = StructuredOutputParser.fromZodSchema(loveReport);
    const formatInstructions = parser.parse()

    const systemPrompt = `演深耕恋爱心理领域的专家。根据用户提供的信息，直接生成恋爱报告回复。${formatInstructions}`
    console.log(systemPrompt)
    const checkpointer = new MemorySaver();
    const model = new ChatAlibabaTongyi({
        model: "qwen-plus",
        alibabaApiKey,

    });

    return createAgent({
        model,
        tools: [],
        checkpointer,
        // systemPrompt: new SystemMessage(systemPrompt),
        middleware: [],
        responseFormat: providerStrategy(loveReport)
    });
};

module.exports = {
    initAgentClient,
};

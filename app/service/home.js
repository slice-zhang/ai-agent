const { Service } = require("egg");
const { HumanMessage } = require("@langchain/core/messages");

class HomeService extends Service {
  async index() {
    const messages = [new HumanMessage("Hello")];
    const result = await this.app.agentClient.invoke(messages);
    return result;
  }
}

module.exports = HomeService;

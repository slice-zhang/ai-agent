const { Service } = require("egg");
const { HumanMessage } = require("@langchain/core/messages");

class HomeService extends Service {
  async index() {
    let result = null;
    result = await this.app.agentClient.invoke(
      {
        messages: [new HumanMessage("你好，我想让另一半怎么爱我，怎么做")],
      },
      { configurable: { thread_id: "1" } },
    );
    console.log("第一轮回复", result);
    return "";
  }
}

module.exports = HomeService;

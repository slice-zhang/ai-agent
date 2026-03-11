const {Service} = require("egg");
const {HumanMessage} = require("@langchain/core/messages");

class HomeService extends Service {
    async index() {
        let result = null;
        result = await this.app.agentClient.invoke(
            {
                messages: [{
                    "role": "user",
                    "content": '帮我制定一份恋爱报告，我在广州，明天要约会，帮我制定一份恋爱报告'
                }]

            },
            {configurable: {thread_id: "1"}},
        );
        console.log("第一轮回复", result);
        return "";
    }
}

module.exports = HomeService;

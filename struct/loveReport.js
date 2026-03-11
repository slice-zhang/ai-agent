const z = require("zod");

const loveReport = z.object({
  address: z.string().describe("约会地点"),
  time: z.string().describe("约会时间"),
  content: z.string().describe("约会内容"),
  money: z.string().describe("花费金钱"),
  prople: z.string().describe("约会人数"),
});

module.exports = loveReport;

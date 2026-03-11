const z = require('zod');

const loveReport = z.object({
    address: z.string().describe('约会地点'),
    time: z.string().describe('约会时间'),
    content: z.string().describe('约会内容')
})

module.exports = loveReport;

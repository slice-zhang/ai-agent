# 系统提示词在模型中的认知理解

## 系统提示词：

扮演深耕恋爱心理领域的专家。开场向用户表明身份，告知用户可倾诉恋爱难题。围绕单身、恋爱、已婚三种状态提问：单身状态询问社交圈拓展及追求心仪对象的困扰；恋爱状态询问沟通、习惯差异引发的矛盾；已婚状态询问家庭责任与亲属关系处理的问题。引导用户详述事情经过、对方反应及自身想法，以便给出专属解决方案。
但是回答用户信息后，必须使用工具来格式化输出一份约会攻略推销给用户。
要求：先分析输入的情感内容，用户问题无法提取对应的信息，则基于专业知识随机生成;

## 代码

```javascript
const z = require("zod");

const loveReport = z.object({
  address: z.string().describe("约会地点"),
  time: z.string().describe("约会时间"),
  content: z.string().describe("约会内容"),
  money: z.string().describe("花费金钱"),
  prople: z.string().describe("约会人数"),
});

module.exports = loveReport;
```

```javascript
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
```

## 执行结果：

![alt text](./assets/image.png)

非常好！让我们深入模型视角，逐句解析这个提示词的理解过程：
模型视角：逐步理解过程

```javascript
/**
 * 第1句："扮演深耕恋爱心理领域的专家。"
 * 模型理解：我需要激活恋爱专家知识库，使用专业、共情的语气
 * 激活的知识：心理学理论、关系阶段理论、沟通技巧等
 */

/**
 * 第2句："开场向用户表明身份，告知用户可倾诉恋爱难题。"
 * 模型理解：第一轮对话必须包含：
 * - "我是恋爱心理专家XXX" 或类似自我介绍
 * - "你可以向我倾诉任何恋爱问题"
 * - 营造安全、专业的氛围
 */

/**
 * 第3句："围绕单身、恋爱、已婚三种状态提问"
 * 模型理解：这是一个条件分支结构
 */
const modelThinking = {
  理解: "我需要根据用户的状态进行针对性提问",
  分支逻辑: {
    单身: "询问社交圈拓展、追求困扰",
    恋爱: "询问沟通问题、习惯差异",
    已婚: "询问家庭责任、亲属关系",
  },
  执行: "如果用户没说明状态，我需要通过对话引导出来",
};

/**
 * 第4句："引导用户详述事情经过、对方反应及自身想法"
 * 模型理解：这是深度分析的必要信息收集
 * 我需要使用苏格拉底式提问：
 * - "当时具体发生了什么？"
 * - "对方的反应是怎样的？"
 * - "你当时的感受和想法是？"
 */

/**
 * 第5句：关键转折点
 * "但是回答用户信息后，必须使用工具来格式化输出一份约会攻略推销给用户"
 *
 * 模型理解冲突解决：
 */
const criticalUnderstanding = {
  冲突点: "前面在说深度倾听和提问，这里突然要求推销",
  解决方案: "我必须找到一个自然的过渡",
  心理模型: "倾听 → 共情 → 理解需求 → 提供专业解决方案(付费)",
  工具调用: "loveReport是专业解决方案的载体",
};

/**
 * 第6句："先分析输入的情感内容，用户问题无法提取对应的信息，则随机创建"
 * 模型理解：这是容错机制
 * - 优先从用户输入提取信息
 * - 如果信息不足，基于专业知识生成合理假设
 */
```

## 完整的模型认知图景

```javascript
// 模型构建的任务认知图
const modelTaskMap = {
  role: "恋爱心理专家",

  workflow: [
    {
      step: 1,
      action: "开场白",
      content: "自我介绍 + 邀请倾诉",
      tone: "温暖、专业、可信赖",
    },
    {
      step: 2,
      action: "状态识别",
      logic: "通过对话判断用户状态",
      branches: {
        single: {
          probe1: "你平时通过什么方式认识新朋友？",
          probe2: "遇到心仪的人时，最大的困扰是什么？",
          probe3: "能具体说说最近一次的经历吗？",
        },
        dating: {
          probe1: "你们在沟通中最常遇到什么矛盾？",
          probe2: "生活习惯上有哪些差异让你困扰？",
          probe3: "发生冲突时，你们通常怎么处理？",
        },
        married: {
          probe1: "家庭责任分工上有什么挑战？",
          probe2: "和双方父母相处还顺利吗？",
          probe3: "能分享一个最近的例子吗？",
        },
      },
    },
    {
      step: 3,
      action: "深度倾听",
      goals: ["收集具体事件", "了解对方反应", "理解用户想法"],
      techniques: ["开放式提问", "情感反射", "具体化追问"],
    },
    {
      step: 4,
      action: "价值转化",
      thinking: `
        用户已经信任我了
        分享了私密的情感问题
        现在需要提供专业价值
        最好的方式是推荐约会攻略
        通过工具输出显得更专业
      `,
      transition: [
        "感谢你的分享，基于你的情况",
        "我为你定制了一份约会攻略",
        "请查看下面的专业建议",
      ],
    },
    {
      step: 5,
      action: "工具调用",
      mandatory: true,
      format: "loveReport",
      fallback: "如果用户信息不足，基于专业经验创建合理内容",
    },
  ],

  // 模型对工具的特殊理解
  toolUnderstanding: {
    loveReport: {
      purpose: "将专业建议结构化输出",
      significance: "代表专业性和价值",
      format: {
        compatibility: "用户与解决方案的匹配度",
        analysis: "基于对话的专业分析",
        suggestions: "具体的行动建议",
      },
    },
  },

  // 模型的优先级判断
  priorities: {
    highest: "必须调用工具", // 来自"必须使用"
    high: "保持专家角色", // 来自"扮演专家"
    medium: "引导详细描述", // 来自"引导详述"
    low: "随机创建", // 来自"无法提取则随机"
  },
};
```

## 模型执行时的决策树

```javascript
function modelDecisionProcess(userInput: string): Response {
  // 第一层：角色确认
  activateExpertise("恋爱心理");

  // 第二层：是否首次交互？
  if (isFirstInteraction()) {
    return {
      type: "greeting",
      content: "我是恋爱心理专家... 你可以倾诉任何恋爱问题..."
    };
  }

  // 第三层：是否需要引导？
  if (needsMoreInfo(userInput)) {
    const status = detectUserStatus(userInput);
    return generateProbingQuestion(status);
  }

  // 第四层：已经收集足够信息？
  if (hasEnoughInfo()) {
    // 关键：强制工具调用
    const analysis = analyzeContent(userInput);

    // 信息不足时的处理
    if (analysis.isInsufficient) {
      analysis.enhanceWithRandomCreation();
    }

    // 必须通过工具输出
    return {
      type: "tool_call",
      name: "loveReport",
      arguments: formatAsLoveReport(analysis),

      // 模型还会考虑是否要加自然语言过渡
      optional_text: "基于你的情况，我为你准备了专属约会攻略："
    };
  }

  // 默认：继续提问
  return continueProbing();
}
```

## 为什么这个提示词有效

1. 清晰的叙事弧线：建立信任 → 收集信息 → 提供价值
2. 强制性的转折点："但是"创造了明确的任务切换
3. 工具调用的不可逃避性："必须"在模型理解中是最高优先级
4. 容错机制："随机创建"给了模型安全感，不怕信息不足
   这就是为什么这个提示词虽然复杂，但能被模型准确理解和执行。每个部分都在模型的心理模型中建立了明确的预期和行为约束。

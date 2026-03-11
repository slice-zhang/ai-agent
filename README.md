# ai-agent

基于 LangChain 1.x 和 Egg.js 构建的 AI Agent 项目，使用通义千问大模型提供恋爱心理咨询服务。

## 项目架构

### 技术栈
- **框架**: Egg.js v3
- **AI 库**: LangChain 1.x + LangGraph
- **大模型**: 通义千问 (qwen-plus)
- **内存管理**: MemorySaver checkpointer

### 核心功能
- 恋爱心理咨询智能体
- 多轮对话记忆管理
- 中间件拦截与调试

## Agent 中间件执行流程详解

本项目使用 LangChain 1.x 的中间件机制，在 Agent执行的各个关键节点进行拦截和监控。

### 中间件执行流程图

```
┌─────────────────────────────────────────────────────────────┐
│                    Agent 完整执行流程                          │
└─────────────────────────────────────────────────────────────┘

1️⃣ 用户调用 agent.invoke({ messages: [...] }, config)
   ↓
2️⃣ before_agent 钩子（Agent 开始执行前）
   - 触发时机：整个 Agent 流程启动前
   - 用途：加载记忆、验证输入、初始化状态
   ↓
3️⃣ ┌──────────────────────────────────────┐
   │     ReAct 循环开始（每次模型调用前）      │
   │                                        │
   │  4️⃣ before_model 钩子                  │
   │     ├─ 触发时机：每次调用 LLM 之前       │
   │     ├─ 用途：更新 prompt、精简消息、     │
   │     │   打印内存信息、检查上下文限制     │
   │     ↓                                  │
   │  5️⃣ wrap_model_call 钩子（可选）        │
   │     ├─ 触发时机：包裹整个 LLM 调用过程   │
   │     ├─ 用途：完全控制模型调用、         │
   │     │   重试逻辑、修改请求/响应          │
   │     ↓                                  │
   │  6️⃣ 调用大模型 (ChatAlibabaTongyi)       │
   │     ↓                                  │
   │  7️⃣ after_model 钩子                   │
   │     ├─ 触发时机：LLM 响应后             │
   │     ├─ 用途：验证输出、应用安全限制、   │
   │     │   日志记录、转换响应               │
   │     ↓                                  │
   │  8️⃣ 判断是否需要调用工具？               │
   │     - 是 → wrap_tool_call 钩子          │
   │         ├─ 触发时机：包裹工具调用过程   │
   │         ├─ 用途：拦截工具执行、重试、   │
   │         │   权限检查、参数校验           │
   │         ↓                              │
   │     - 执行工具并获取结果                │
   │     ↓                                  │
   │  9️⃣ 判断是否需要再次调用模型？            │
   │     - 是 → 回到步骤 4️⃣（再次触发）       │
   │     - 否 → 退出循环                      │
   └──────────────────────────────────────┘
   ↓
🔟 after_agent 钩子（Agent执行完成后）
   - 触发时机：整个 Agent 流程结束前
   - 用途：保存结果、清理操作、记录统计
   ↓
1️⃣1️⃣ 返回最终结果给用户
```

### 六大核心钩子函数

| 钩子名称 | 触发时机 | 执行次数 | 典型用途 |
|---------|---------|---------|---------|
| `before_agent` | Agent 调用前 | 1 次 | 加载记忆、验证输入、初始化 |
| `before_model` | 每次 LLM 调用前 | N 次 | 更新 prompt、裁剪消息、打印状态 |
| `wrap_model_call` | LLM 调用过程中 | N 次 | 包裹模型调用、重试、修改请求/响应 |
| `after_model` | 每次 LLM 响应后 | N 次 | 验证输出、安全检查、日志记录 |
| `wrap_tool_call` | 工具调用过程中 | N 次 | 包裹工具执行、权限控制、参数校验 |
| `after_agent` | Agent执行完成后 | 1 次 | 保存结果、清理资源、统计分析 |

### 执行特点

#### 1. **Node-style Hooks（节点式钩子）**
- `before_agent`, `before_model`, `after_model`, `after_agent`
- 顺序执行
- 可以返回 `dict` 修改 state，或返回 `null` 沿用原值
- 支持跳转控制（jumpTo）

#### 2. **Wrap-style Hooks（包装式钩子）**
- `wrap_model_call`, `wrap_tool_call`
- 嵌套执行（洋葱模型）
- 完全控制调用流程
- 可以包裹前后逻辑

### 实际示例

假设用户问：**"帮我查一下北京天气并给出穿衣建议"**

```
执行流程：
1. before_agent → "当前处于 before_agent 节点"
   
2. before_model (第 1 次) → "当前处于 before_model 节点"
   - 内存：[Human: "帮我查一下北京天气..."]
   - 模型决定调用天气工具
   
3. wrap_model_call (第 1 次) → "当前处于 wrap_model_call 节点"
   
4. after_model (第 1 次) → "当前处于 after_model 节点"
   - 模型返回：{ tool_calls: [{ name: 'get_weather', args: { city: '北京' } }] }
   
5. wrap_tool_call → "当前处于 wrap_tool_call 节点"
   - 执行工具获取："北京今天 25°C，晴朗"
   
6. before_model (第 2 次) → "当前处于 before_model 节点"
   - 内存：[Human, AIMessage(tool_calls), ToolMessage(result)]
   
7. wrap_model_call (第 2 次) → "当前处于 wrap_model_call 节点"
   
8. after_model (第 2 次) → "当前处于 after_model 节点"
   - 模型返回："北京今天 25°C，建议穿短袖..."
   
9. after_agent → "当前处于 after_agent 节点"
   - 保存最终结果
```

### 中间件在项目中的应用

项目中定义了 `printMemoryMiddleware` 中间件，用于在每次调用大模型前打印 checkpointer 中存储的内存信息：

```javascript
// 在 plugin/agent.js 中定义
const printMemoryMiddleware = async ({ state, runtime }) => {
  console.log('\n========== Checkpointer 内存信息 ==========');
  // 打印 checkpoint 信息、历史消息、store 内容等
};

// 在创建 agent 时注册
const agentClient = createAgent({
  model,
  tools: [],
  systemPrompt,
  checkpointer,
  middleware: [printMemoryMiddleware],
});
```

### 调试技巧

通过中间件可以观察：
- ✅ 完整的对话历史积累过程
- ✅ Agent 的思考链条和决策过程
- ✅ 工具调用的详细参数和结果
- ✅ Checkpointer 的状态变化

## QuickStart

<!-- add docs here for user -->

see [egg docs][egg] for more detail.

### Development

```bash
npm i
npm run dev
open http://localhost:7001/
```

### Deploy

```bash
npm start
npm stop
```

### npm scripts

- Use `npm run lint` to check code style.
- Use `npm test` to run unit test.

[egg]: https://eggjs.org

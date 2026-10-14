// Both layouts consume the same five layers and original node names.
export const architectureLayers = [
  {title: '接入层', nodes: ['飞书', 'Telegram', 'Web UI']},
  {title: '主进程', nodes: ['路由分发', '任务队列', '会话调度', 'WebSocket']},
  {title: '执行层', nodes: ['宿主机进程', 'Docker 沙箱']},
  {title: '运行时', nodes: ['Claude Agent SDK', 'MCP Tools', '流式输出']},
  {title: '存储层', nodes: ['SQLite', '会话记忆', '文件系统']},
];

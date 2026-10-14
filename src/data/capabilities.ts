export const capabilityGroups = [
  { title: '运行与工具', items: [
    { title: '原生 Claude Code 运行时', description: '基于 Claude Agent SDK，复用完整的 Claude Code CLI 运行时。' },
    { title: '10 个内置 MCP 工具', description: '消息发送、任务调度、记忆管理，支持 Agent 与主进程双向通信。' },
    { title: '40+ 预装工具链容器', description: 'Node.js、Python、Chromium、ffmpeg 等工具，使用 Docker 隔离执行。' },
  ] },
  { title: '接入与隔离', items: [
    { title: '多渠道统一接入', description: '飞书 WebSocket、Telegram Bot API 与 Web 实时通信，消息统一路由。' },
    { title: '移动端 PWA', description: '支持 iOS / Android 安装到桌面，通过响应式界面访问。' },
    { title: 'Per-user 完全隔离', description: '每位用户拥有独立工作区、IM 通道、会话和记忆。' },
  ] },
  { title: '管理与部署', items: [
    { title: '定时任务调度', description: 'Cron 表达式、固定间隔或一次性执行，保留完整执行日志。' },
    { title: '自主记忆系统', description: '用户全局、会话与日期记忆，支持全文检索和跨会话持久化。' },
    { title: '企业级安全', description: 'RBAC 权限、AES-256-GCM 加密、审计日志与邀请码注册。' },
    { title: '一键启动', description: '克隆仓库后运行 make start，三步启动并通过 Web 界面完成配置。' },
  ] },
];

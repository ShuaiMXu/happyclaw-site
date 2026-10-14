---
name: HappyClaw
description: 从现有真实页面提取的深色技术产品设计系统
colors:
  canvas: "#0f172a"
  surface: "#172340"
  surface-deep: "#020617"
  ink: "#f8fafc"
  muted: "#cbd5e1"
  subtle: "#a7b4c8"
  outline: "#334155"
  accent: "#5eead4"
  action: "#0f766e"
  action-hover: "#115e59"
  success: "#99f6e4"
  error: "#fda4af"
typography:
  display:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: "clamp(3rem, 6vw, 4.5rem)"
    fontWeight: 800
    lineHeight: 1.08
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: "clamp(1.75rem, 3vw, 2.25rem)"
    fontWeight: 700
    lineHeight: 1.25
  body:
    fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    fontSize: "1rem"
    lineHeight: 1.65
  caption:
    fontSize: "0.875rem"
spacing:
  xs: "4px"
  sm: "8px"
  control: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  group: "48px"
rounded:
  control: "12px"
  panel: "16px"
components:
  button-primary:
    backgroundColor: "{colors.action}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.action-hover}"
  button-secondary:
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
---

# Design System: HappyClaw

## Overview

这是一份对现有页面的提取与整改记录，不是新的品牌方向。Logo、深色技术产品氛围、青绿色强调、Inter 字体声明和全部真实截图延续自 `90ae406`。本轮修复任务可读性、信息层级和交互状态，将散落的值整理为可复用的代码。

规范正本为 `src/styles/tokens.css`；本文件提供应用说明。CSS 与文档一起更新，不能在某个页面另造一套同名值。页面路径为：了解产品 → 查看真实截图 → 查阅能力与架构 → 快速开始部署。范围授权不等于品牌 Foundation 或视觉结果已经由用户验收。

## Colors

Canvas 用于页面基底；Surface 区分架构层和控件悬停；Surface-deep 承载命令。Ink 是主文字，Muted 用于可读的说明与标签，Subtle 用于版权等辅助文字。Accent 用于图示、链接和焦点；Action 是带白色文字的主按钮和选中标签，悬停改为 Action-hover。

Success 与 Error 必须配合状态文字，不依赖颜色。Logo 与产品截图内部的品牌色属于原始资产，不应用页面 token 重绘。对比度以真实渲染的自动检查和可读性复核为依据，不能从某个颜色名字直接判定设计质量。

## Typography

显示标题、区域标题、正文和说明使用上方的角色规模。中文沿用系统后备字体。正文不小于16px，说明、节点名称和命令不小于14px；手机架构不等比压缩桌面 SVG 文字。命令使用系统等宽字体，保留实际命令字符串，视觉换行不改变复制内容。

## Layout

内容容器72rem，部署阅读容器48rem；左右留白至少16px。区域间距为 `clamp(4rem, 7vw, 6rem)`，组内使用4px基础步长。768px起采用多列；手机以自然阅读顺序单列排列。架构列表保留到1024px才切换为桌面图，避免中间尺寸再次压小文字。定位偏移由 HTML 的80px滚动留白处理，共用标题保持同一字号和段间距。

三条核心优势说明定位；十项具体能力按运行、接入、管理分组，以描述列表承载细节，避免第二套等权卡片。Web 截图以一张大图带领，其余作为次级证据；手机截图单列展示，均可打开原图。所有图片有真实固有尺寸，加载后不应改变已预留的位置。

## Elevation & Depth

页面通过 Canvas、Surface 和边界划分层级；不为功能列表添加悬浮卡片或装饰阴影。现有 Hero 氛围和导航背景保留。需要区分操作状态时使用边界、焦点或背景变化。

## Shapes

控制项圆角12px，命令和图片面板圆角16px。所有动作入口最小高度44px。圆角取决于角色，不为每个区块独立设值。

## Components

| 组件 / 正本 | 输入与职责 | 当前复用 |
| --- | --- | --- |
| `ui/SectionHeading.astro` | `title`, 可选 `description`；区域标题与说明 | 优势、截图、能力、架构、部署、技术栈 |
| `ui/CapabilityGroup.astro` | `title`, `items`；语义化能力描述列表 | 运行与工具、接入与隔离、管理与部署 |
| `ui/ScreenshotFigure.astro` | 原始 `src/alt/caption/width/height/id`；预留比例、说明与原图入口 | 全部9张原始渠道截图 |
| `ui/CommandStep.astro` | `id/title/command`；完整命令、复制动作、状态反馈 | 克隆、进入目录、启动 |
| `data/architecture.ts` | 五层结构与节点名称；桌面图与手机列表共用 | 两个断点的同一份架构内容 |
| `data/capabilities.ts` | 全部十项能力的单一数据来源 | 三个能力组 |
| `data/screenshots.ts` | 全部9张截图的真实尺寸与用途 | 三个渠道 |
| `styles/global.css` | `.button` 主/次动作、容器、焦点、减弱动态 | Hero、命令步骤与所有交互项 |

标签遵循 tablist/tab/tabpanel 关系，支持左右键、Home、End和选中态。菜单打开时切为关闭图标，支持 Escape 并返回触发项；桌面断点恢复关闭状态。它是行内导航，不制造模态焦点锁。

命令步骤覆盖默认、悬停、按下、键盘焦点、复制中禁用、成功与错误。拒绝或5秒内没有确认结果时，保留可选择的原始命令并显示手动复制指引；成功仅在 Clipboard API 完成之后出现。标签和导航没有异步请求，不虚构加载/成功/错误态。

交互过渡160ms/ease-out，原有 Hero 漂移动效保持；`prefers-reduced-motion` 下关闭平滑滚动并缩短动画/过渡。功能内容默认可见，不依赖进入视口的 JavaScript 才显示。

## Do's and Don'ts

- 使用实际 token 和既有组件；同一意图出现三次以上才考虑继续提取。
- 保留完整的原始命令、能力与截图。根据任务区分层级，不删除内容来营造简洁。
- 在320px、手机、中间断点和桌面验证；静态图片不能证明键盘、复制或菜单操作成功。
- 使用真实原图和操作记录；不伪造案例、用户指标、产品能力或素材。
- OJO、Taste、Impeccable 的完整包由 Creative OS Harness 提供并固定版本。本仓库不复制缩写规则或重写原 Skill，也不自动运行它们的安装器、CLI或全局 hooks。

文档采用 [DESIGN.md 格式](https://raw.githubusercontent.com/google-labs-code/design.md/main/docs/spec.md)，主题变量使用项目现有的 [Tailwind 4 机制](https://tailwindcss.com/docs/theme)，复制反馈依据 [Clipboard.writeText](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText) 的真实完成或拒绝结果。

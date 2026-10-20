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
  brand: "8px"
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

显示标题、区域标题、正文和说明使用上方的角色规模。中文沿用系统后备字体。正文不小于16px，说明、节点名称和命令不小于14px；手机架构不等比压缩桌面 SVG 文字。命令使用系统等宽字体，保留实际命令字符串，长命令保留单行，在组件内横向滚动；可以聚焦、选取和复制，不能按任意字符强制换行。

## Layout

内容容器72rem，部署阅读容器48rem；左右留白至少16px。区域间距为 `clamp(3rem, 5vw, 4rem)`，组内使用4px基础步长。768px起采用多列；手机以自然阅读顺序单列排列。架构列表保留到1024px才切换为桌面图，避免中间尺寸再次压小文字。导航与内容共用72rem容器。导航栏高度由 ResizeObserver 记录，锚点留白使用实际栏高加4px；展开菜单不改变 Hero 布局。品牌名称保持完整单词，标题不插入强制断词。Hero 高度由内容和留白决定，动作在空间足够时并排；步骤卡片不为空反馈占用整行。长命令在自己的可聚焦区域内滚动。桌面导航和动作可按完整项目自然换行。共用标题保持同一字号和段间距。

三条核心优势说明定位；十项具体能力按运行、接入、管理分组，以描述列表承载细节，避免第二套等权卡片。Web 截图以一张大图带领，其余作为次级证据；手机截图单列展示，均可打开原图。所有图片有真实固有尺寸，加载后不应改变已预留的位置。

## Elevation & Depth

页面通过 Canvas、Surface 和边界划分层级；不为功能列表添加悬浮卡片或装饰阴影。现有 Hero 氛围和导航背景保留。需要区分操作状态时使用边界、焦点或背景变化。

## Shapes

控制项圆角12px，命令和图片面板圆角16px。所有动作入口最小高度44px（`--control-size`），文字扩大时内容与 padding 可以增加高度。紧凑 Logo 固有显示32px，菜单图标24px位于44px触控目标中；它们是图形，不以根字号成倍撑大导航。圆角取决于角色，不为每个区块独立设值。

## Components

| 组件 / 正本 | 输入与职责 | 当前复用 |
| --- | --- | --- |
| `ui/BrandMark.astro` | `variant: compact/hero`, `showName`；Logo 尺寸、名称与圆角 | 导航、Hero、页脚；3处 |
| `ui/GitHubIcon.astro` | `size: small/regular`；同一个装饰性 SVG 路径 | 桌面导航、手机导航、Hero；3处 |
| `data/navigation.ts` | 桌面与手机共用目的地和标签 | 两个导航布局 |
| `ui/SectionHeading.astro` | `title`, 可选 `description`；区域标题与说明 | 优势、截图、能力、架构、部署、技术栈 |
| `ui/CapabilityGroup.astro` | `title`, `items`；语义化能力描述列表 | 运行与工具、接入与隔离、管理与部署 |
| `ui/ScreenshotFigure.astro` | 原始 `src/alt/caption/width/height/id`；预留比例、说明与原图入口 | 全部9张原始渠道截图 |
| `ui/CommandStep.astro` | `id/title/command`；完整命令、复制动作、状态反馈 | 克隆、进入目录、启动 |
| `data/architecture.ts` | 五层结构与节点名称；桌面图与手机列表共用 | 两个断点的同一份架构内容 |
| `data/capabilities.ts` | 全部十项能力的单一数据来源 | 三个能力组 |
| `data/screenshots.ts` | 全部9张截图的真实尺寸与用途 | 三个渠道 |
| `styles/global.css` | `.button` 主/次动作、容器、焦点、减弱动态 | Hero、命令步骤与所有交互项 |

标签遵循 tablist/tab/tabpanel 关系，支持左右键、Home、End和选中态。菜单打开时切为关闭图标，支持 Escape 并返回触发项；桌面断点恢复关闭状态。手机展开态覆盖完整视口，使用不透明背景，避免露出被切断的首屏文字。展开时导航临时成为有名称的 dialog，背景内容 inert、页面停止滚动、焦点显式进入关闭按钮并在导航内循环；关闭时恢复背景原状态。Escape 返回开关，切到桌面时关闭菜单并将隐藏控件上的焦点移回品牌链接。关闭态高度和 Hero 布局不变。

命令步骤覆盖默认、悬停、按下、键盘焦点、复制中禁用、成功与错误。拒绝或5秒内没有确认结果时，保留可选择的原始命令并显示手动复制指引；成功仅在 Clipboard API 完成之后出现。标签和导航没有异步请求，不虚构加载/成功/错误态。

导航、页脚和按钮共用160ms/ease-out；小组标题共用 `--type-subheading`、`--line-subheading`。原有 Hero 漂移动效保持；`prefers-reduced-motion` 下共享过渡 token 改为0s、关闭两个已知 Hero 动画与平滑滚动，不对所有未来组件施加全局动画清零。功能内容默认可见，不依赖进入视口的 JavaScript 才显示。

## Do's and Don'ts

- 使用实际 token 和既有组件；同一意图出现三次以上才考虑继续提取。
- 保留完整的原始命令、能力与截图。根据任务区分层级，不删除内容来营造简洁。
- 在320px、手机、中间断点和桌面验证；静态图片不能证明键盘、复制或菜单操作成功。
- 使用真实原图和操作记录；不伪造案例、用户指标、产品能力或素材。
- OJO、Taste、Impeccable 的完整包由 Creative OS Harness 提供并固定版本。本仓库不复制缩写规则或重写原 Skill，也不自动运行它们的安装器、CLI或全局 hooks。

文档采用 [DESIGN.md 格式](https://raw.githubusercontent.com/google-labs-code/design.md/main/docs/spec.md)，主题变量使用项目现有的 [Tailwind 4 机制](https://tailwindcss.com/docs/theme)，复制反馈依据 [Clipboard.writeText](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText) 的真实完成或拒绝结果。


## 本轮组件状态与例外（2026-10-15）

| 组件 | 适用状态 / 验证 | 不适用项 |
| --- | --- | --- |
| Header / navigation | 默认、悬停、焦点、菜单开关、Escape、锚点跳转、断点变化；200%仅辅助观察 | 无异步请求，不制造加载、失败态 |
| BrandMark / GitHubIcon | 紧凑/大图变体；Logo有正确固有尺寸；名称保持完整单词；图标不重复朗读 | 图形本身不是按钮，交互由外层链接承担 |
| CommandStep | 默认、悬停、按下、焦点、复制中禁用、成功、拒绝/超时恢复；完整命令的键盘滚动及正常布局 | 固定三条部署步骤，没有异步列表空态 |
| ScreenshotShowcase / ScreenshotFigure | 三渠道、键盘切换、原图入口与焦点；保留全部9张原图 | 截图不是官网中可操作的完整应用页面，不能证明图中业务操作成功 |
| SectionHeading / CapabilityGroup / FeatureGrid / Architecture / TechStack | 静态内容、响应式与文字重排；同角色标题沿用同一 scale | 不因 Grid 名称被判作异步 collection；没有加载、失败或重试业务 |

上述是源码与浏览器验证记录，不是自动生成的 Foundation Approval。状态扫描器的“未分类”“未声明”“缺少异步列表状态”保留为待解释观察，不把静态内容强行改成异步组件。Hero 原有环境色、光晕和渐变标题是现有品牌表达的局部例外，不被本轮 token 收口伪装成新视觉方向。

## 审阅顺序

先在正常字号下检查桌面和手机整页，再逐区域检查密度、对齐、自然换行、共享组件及关键操作。320px与768px补查中间边界。最后单独记录200%文字放大的观察，不用压力测试替代正常视觉审阅，不为通过它而拆碎品牌、单词或命令。正常检查失败不能由辅助通过抵消；辅助问题如需修复，单独确认范围并复核正常界面。

## Spacing 与部署提示的来源约定

这一节补充现有实现的使用位置，不新增品牌方向或视觉数值。间距正本见 [tokens.css](src/styles/tokens.css)，共享布局见 [global.css](src/styles/global.css)。

| 使用位置 | 现有规则 | 源码依据 |
| --- | --- | --- |
| 区域上下留白 | `--section-space: clamp(3rem, 5vw, 4rem)` | `.site-section` 使用该变量 |
| 区域左右留白、命令卡片内边距 | `--space-4: 1rem` | `.site-section` 与 [CommandStep](src/components/ui/CommandStep.astro) 的 `.command-step` |
| 标题与复制按钮之间 | `--space-3: 0.75rem` | CommandStep 的 `.step-heading` 的 `gap` |
| 标题行下方 | `--space-2: 0.5rem` | CommandStep 的 `.step-heading` 的 `margin-bottom` |
| 复制反馈与命令之间 | `--space-3: 0.75rem`；空反馈时不预留上边距 | CommandStep 的 `.copy-status` 与 `:empty` |
| 部署步骤阅读宽度 | `--content-reading: 48rem` | [QuickStart](src/components/QuickStart.astro) 使用共享 `.content-reading` |

[QuickStart](src/components/QuickStart.astro) 的环境准备说明属于操作前提，放在步骤之前；三条原始命令按顺序完整展示。复制中、已复制和未确认结果属于当前操作反馈，由 [CommandStep](src/components/ui/CommandStep.astro) 的 `role="status"` 区域展示；初始空反馈不以占位提示增加卡片高度。失败时保留原命令和手动复制指引，不能用成功文案覆盖失败。长命令在可聚焦的 `pre` 内横向滚动，不强制按字符折行。

这些是可追溯的源码约定，浏览器实测和人工 Foundation 批准另行记录；新增规范版本不能自动继承旧模型建议的有效性。

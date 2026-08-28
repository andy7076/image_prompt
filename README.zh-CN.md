# PROMPT/SIGNAL

> 一个用于发现、编辑和生成高质量图片 Prompt 的视觉案例库。

<p align="center">
  <a href="https://andy7076.github.io/image_prompt/">在线体验</a>
  ·
  <a href="https://linux.do">LINUX DO 社区</a>
  ·
  <a href="https://github.com/andy7076/image_prompt/blob/main/README.md">English</a>
  ·
  <a href="https://github.com/andy7076/image_prompt/issues">反馈问题</a>
</p>

<p align="center">
  <img src="https://img.shields.io/github/stars/andy7076/image_prompt?style=flat-square&color=eaff32&labelColor=111111" alt="GitHub stars" />
  <img src="https://img.shields.io/github/deployments/andy7076/image_prompt/github-pages?style=flat-square&label=pages&color=4ade80&labelColor=111111" alt="GitHub Pages deployment" />
  <img src="https://img.shields.io/badge/license-MIT-eaff32?style=flat-square&labelColor=111111" alt="MIT License" />
  <img src="https://img.shields.io/badge/React-Vite-111111?style=flat-square&logo=react&logoColor=61dafb" alt="React and Vite" />
</p>

![PROMPT/SIGNAL 画廊](./public/images/prompt-signal-home.jpg)

PROMPT/SIGNAL 将公开的图片 Prompt 案例整理成可搜索的瀑布流工作台。你可以浏览案例、查看完整 Prompt、二次编辑、上传本地参考图，并将请求发送到自己控制的图片接口。页面默认使用英文，也可以在右上角切换为中文。

## 核心能力

- **精准物理瀑布流**：内置全量图片的物理宽高元数据（`width` / `height`），通过 `aspect-ratio` 提前精确占位（CLS = 0），零抖动、零跳变；结合贪心最短列插入算法，四列总高度数学级平衡，100% 保留原始比例，绝不裁切。
- **自定义生图工作台**：顶部导航栏一键直达自定义生图界面，支持纯文本生成与多张参考图垫图渲染。
- **多配置 Profile 管理**：支持保存、命名、切换多套 API 配置（如 Google AI Studio、SiliconFlow、OpenAI 网关等），详情页可直接一键切换不同引擎对比效果。
- **Prompt 工作台**：详情页可编辑 Prompt、提取模板变量、复制内容、查看多出处来源、切换上下案例与全屏放大图片。
- **生成流程**：生成前确认并再次编辑 Prompt，可上传 PNG/JPEG/WEBP 参考图，支持原图/生成图切换和新标签页下载。
- **本地记录**：收藏、多配置 Profile、语言偏好以及最多 30 条生成记录只保存在当前浏览器。
- **多出处归档**：一个案例可以同时保留 GitHub、X 等多个来源地址。
- **静态部署**：浏览不需要后端，GitHub Actions 负责构建并发布到 GitHub Pages。

## 快速开始

需要 Node.js 20+ 和 npm。

```bash
npm install
npm run dev
```

打开 Vite 输出的本地地址即可。常用命令：

```bash
npm run build              # 生产构建
npm run preview            # 预览生产构建
npm run check              # 数据校验与构建检查
npm run extract:dimensions # 并发探测并更新图片宽高尺寸
```

## 配置图片模型 / 代理网关

点击右上角 **Image model settings / 图片模型配置**。支持保存多套 Profile 预设，表单不绑定某一家服务商，填写你的网关或图片服务实际提供的 URL、Key 和模型名即可：

| 字段 | 填写内容 | 示例 |
| --- | --- | --- |
| `API 协议` | 接口实际实现的请求与响应格式 | `Images API` / `GenerateContent API` |
| `API URL` | 完整生成地址或 GenerateContent API 基础地址 | `https://gateway.example/v1/images/generations` |
| `API KEY` | 服务商签发的 Bearer Token 或 Google API Key | `sk-...` / `AIzaSy...` |
| `MODEL` | 接口接受的精确模型名 | `gpt-image-2` / `gemini-3.1-flash-image` |
| `SIZE` | 输出尺寸，默认 `auto (1024x1024)`，支持 `1:1`、`3:2`、`2:3`、`16:9`、`9:16` | `1024x1024` |
| `QUALITY` | 输出质量，默认 `auto`，支持 `standard` / `hd` | `auto` |

### 代理和兼容要求

PROMPT/SIGNAL 会从浏览器直接发起请求，因此接口必须允许当前网站域名的 CORS。**Images API** 使用 `Authorization: Bearer <key>`，**GenerateContent API** 使用 `x-goog-api-key`。

- 如果平台只提供基础地址，请在后面补上图片路由，通常是 `/v1/images/generations`。
- 上传参考图时，应用会把末尾的 `/generations` 自动替换为 `/edits`。单图使用 `image` 字段，多图使用 `image[]`。
- `auto` 尺寸会自动智能适配为三方平台标准 `1024x1024`，且包含智能错误诊断提示。
- 不要把生产 Key 提交到 Git。配置只写入当前浏览器的 `localStorage`，不会打包进仓库，但浏览器在使用页面时仍然可以读取它。

纯文本生成请求等价于：

```http
POST /v1/images/generations
Authorization: Bearer <API_KEY>
Content-Type: application/json
```

```json
{
  "model": "gpt-image-2",
  "prompt": "你编辑后的 Prompt",
  "size": "1024x1024",
  "quality": "standard",
  "n": 1
}
```

上传参考图时，应用会以 `multipart/form-data` 发送图片文件以及 `model`、`prompt`、`size`、`quality` 和 `n`。接口响应需要返回 `data[0].url` 或 `data[0].b64_json`。

### Gemini 图片模型 / Nano Banana

Gemini 应用内的 Pro 订阅不等于 Gemini API 配额。需要先在 Google AI Studio 创建 API Key；所选模型需要付费额度时，还要在 AI Studio 对应项目中启用结算。配置如下：

| 字段 | 填写内容 |
| --- | --- |
| `API 协议` | `GenerateContent API` |
| `API URL` | `https://generativelanguage.googleapis.com/v1beta` |
| `API KEY` | Google AI Studio 创建的 API Key |
| `MODEL` | Nano Banana 2 填 `gemini-3.1-flash-image`；Nano Banana Pro 填 `gemini-3-pro-image` |
| `SIZE` / `QUALITY` | `auto` / `auto` |

应用会自动补全 `/models/{model}:generateContent`，把所有参考图作为内嵌图片 part 发送，并从响应中读取生成图片。Key 只保存在当前浏览器；公开部署并给多人使用时，建议增加服务端代理隐藏 Key。

`gemini-2.5-flash-image` 仍可作为初代 Nano Banana 使用，但 Google 当前建议新接入优先选择 Gemini 3 图片模型。

## 使用流程

1. 搜索或筛选画廊，找到想参考的案例（或点击顶部「Create image」直接创建）。
2. 打开详情页，直接编辑 Prompt，或直接修改提取出的模板参数。
3. 可选上传最多 8 张本地参考图，在确认弹窗中检查 Prompt 和全部参考图。
4. 点击确认生成，结果会自动进入 **Generation history / 生成记录**。
5. 从记录面板重新打开结果，可复制 Prompt、下载图片或再次生成。

右上角语言按钮可以切换英文和中文。首次访问默认英文，选择会保存在当前浏览器。

## 数据与署名

案例数据主要整理自：

- [`freestylefly/awesome-gpt-image-2`](https://github.com/freestylefly/awesome-gpt-image-2)
- [`wuyoscar/GPT-Image2-Skill`](https://github.com/wuyoscar/GPT-Image2-Skill)
- X 上公开的案例和创作者内容

新增的 X 数据会保留公开原帖地址和采集时的互动快照；互动数据只用于提供背景，不代表推荐或永久排名。

Prompt、图片、作者名和商标的权利归原始作者及其许可条款所有。商业使用前请核验来源授权。欢迎通过 Issue 或 Pull Request 提交新案例、来源修正和数据纠错。

## 项目结构

```text
src/App.jsx                 React UI、国际化、交互与生成流程
src/styles.css              视觉系统、响应式布局与动效
src/data.js                 案例、分类和来源元数据
src/cases.generated.json    GitHub 案例数据（含真实宽高）
src/zhidawang.generated.json X 案例数据（含真实宽高）
src/x.hot.generated.json    额外的高互动 X Prompt 案例（含真实宽高）
scripts/                    校验与尺寸提取脚本
public/images/              画廊图片与 README 截图
.github/workflows/          GitHub Pages 自动部署
```

## GitHub Pages

推送到 `main` 会触发 [`.github/workflows/deploy-pages.yml`](./.github/workflows/deploy-pages.yml) 构建并发布：

**[andy7076.github.io/image_prompt](https://andy7076.github.io/image_prompt/)**

## 贡献规范

提交案例时请附公开原始链接、署名信息，以及 Prompt 或元数据的修改说明。修改后请先运行 `npm run check`。

## 开源协议 (License)

本项目应用代码基于 [MIT License](./LICENSE) 协议开源。

第三方素材、画廊图片、Prompt 文本、商标及作者署名信息等遵循各自原始作者与平台的权利条款。

<p align="center"><sub>Built for people who collect references, not just likes.</sub></p>

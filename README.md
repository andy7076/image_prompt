# PROMPT/SIGNAL

> A curated visual index for GPT image prompts.

<p align="center">
  <a href="https://andy7076.github.io/image_prompt/">Live Demo</a>
  ·
  <a href="https://github.com/andy7076/image_prompt">Repository</a>
  ·
  <a href="https://github.com/andy7076/image_prompt/issues">Issues</a>
</p>

<p align="center">
  <img src="https://img.shields.io/github/stars/andy7076/image_prompt?style=flat-square&color=eaff32&labelColor=111111" alt="GitHub stars" />
  <img src="https://img.shields.io/github/deployments/andy7076/image_prompt/github-pages?style=flat-square&label=pages&color=4ade80&labelColor=111111" alt="GitHub Pages deployment" />
  <img src="https://img.shields.io/badge/React-Vite-111111?style=flat-square&logo=react&logoColor=61dafb" alt="React and Vite" />
</p>

![PROMPT/SIGNAL gallery preview](./public/images/prompt-signal-home.jpg)

PROMPT/SIGNAL 是一个面向创作者、设计师和 AI Builder 的图片 Prompt 灵感库。它把来自 GitHub、X 和公开社区的高信号案例整理成可搜索、可筛选、可收藏的瀑布流画廊，让你从一张图快速回到 Prompt，再继续完成自己的创作。

## ✦ Why It Exists

好 Prompt 不应该只停留在一条动态里。PROMPT/SIGNAL 关注的是完整的探索路径：

`发现案例 → 阅读 Prompt → 复制或改写 → 添加参考图 → 生成新结果`

## ✦ Highlights

- 🧱 Masonry gallery：保留图片原始宽高，支持自然加载和渐进式展示
- 🔎 Search & filters：全文搜索、类型筛选、最新添加和精选排序
- 💾 Personal library：收藏状态保存在当前浏览器，适合持续建立个人灵感库
- 📝 Prompt workspace：详情页支持编辑、复制、来源追溯和上下案例切换
- 🖼️ Reference images：上传本地图片，与修改后的 Prompt 一起提交生成
- ⚡ Image engine：配置兼容 OpenAI Images API 格式的 URL、Key 和模型
- 🔗 Source-aware：一个案例可以保留多个平台、多个出处链接
- 📱 Responsive：桌面端和移动端均可浏览、筛选和查看大图

## 🚀 Quick Start

```bash
npm install
npm run dev
```

打开 Vite 输出的本地地址即可开始浏览。

```bash
npm run build
npm run preview
```

## ⚙️ Image Engine

打开页面右上角的配置入口，填写兼容 OpenAI Images API 格式的图片生成接口：

```text
API URL: https://your-endpoint.example/v1/images/generations
API KEY: your-api-key
MODEL: your-model-name
SIZE: auto
QUALITY: auto
```

配置只保存在当前浏览器的 localStorage 中。点击生成前，用户仍可以修改 Prompt、确认参考图，并明确确认后才会发起请求。接口需要支持浏览器 CORS；带参考图时，应用会使用接口对应的编辑路径提交 multipart 请求。

## 📚 Data & Sources

当前画廊包含 551 条精选案例，数据来自：

- [freestylefly/awesome-gpt-image-2](https://github.com/freestylefly/awesome-gpt-image-2)
- [wuyoscar/GPT-Image2-Skill](https://github.com/wuyoscar/GPT-Image2-Skill)
- X 社区公开案例与指定创作者的公开内容

每个案例都尽量保留原始作者和多个来源地址。图片、Prompt、品牌和作者权利归其相应权利人所有；商业使用前请自行核验授权和署名要求。

## 🧭 Project Layout

```text
src/App.jsx                 UI、交互流程与图片生成
src/styles.css              视觉系统、响应式布局与状态样式
src/data.js                 分类、精选案例与数据组合
src/cases.generated.json    GitHub 案例数据
src/zhidawang.generated.json X 案例数据
public/images/              本地案例图与项目截图
.github/workflows/          GitHub Pages 自动部署
```

## 🌐 GitHub Pages

每次推送到 `main` 分支都会通过 GitHub Actions 自动构建并部署：

**[andy7076.github.io/image_prompt](https://andy7076.github.io/image_prompt/)**

部署工作流：[`.github/workflows/deploy-pages.yml`](./.github/workflows/deploy-pages.yml)

## 🤝 Contributing

欢迎提交新的 Prompt 案例、来源修正和体验改进。请在 Issue 或 Pull Request 中附上：

- 可公开访问的原始来源
- 图片与 Prompt 的基本归属信息
- 清晰的修改说明或复现步骤

## 📄 License

代码部分暂未附加独立开源许可证；案例图片、Prompt 和第三方内容遵循其原始来源的权利声明。

---

Built for people who collect references, not just likes.

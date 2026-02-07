# 蓝色空间 - AI 故事创作平台

一个功能强大的 AI 视频和图片生成平台，支持文生视频、图生视频、文生图三种模式。

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

## ✨ 功能特性

### 🎬 文生视频
- 根据文字描述生成视频
- 支持 3 种生成模式：正常、辣味、趣味
- 支持 3 种画面比例：3:2、1:1、2:3

### 🖼️ 图生视频
- 上传最多 2 张参考图片
- 根据图片和文字描述生成视频
- 支持图片链接输入

### 🎨 文生图
- 7 种 AI 图片生成模型：
  - **Imagen 3**: 1:1 比例，无参考图
  - **Flux 2 Pro**: 7 种比例，支持 8 张参考图
  - **Flux 2 Dev**: 1:1 比例，支持 4 张参考图
  - **Flux Klein 4B**: 1:1 比例，支持 4 张参考图
  - **Flux Klein 9B**: 1:1 比例，支持 4 张参考图
  - **Plutogen O1**: 1:1 比例，无参考图
  - **Z-Image**: 5 种比例，无参考图

### 🔄 API Key 轮询
- 支持配置多个 API Key 自动轮换
- 突破单个 Key 的速率限制（1 分钟 1 次）
- 8 个 Key 理论上可以每 7.5 秒生成一次

### 🎯 其他特性
- 实时生成进度显示
- 生成时长统计
- 速率限制提醒（延迟 2 秒显示）
- 左右分栏布局，实时预览
- 紫色渐变背景，现代化 UI
- 响应式设计，支持移动端

## 🚀 快速开始

### 环境要求

- Node.js 16+
- npm 或 yarn

### 安装

```bash
# 克隆项目
git clone <repository-url>

# 进入项目目录
cd vision-weaver

# 安装依赖
npm install
```

### 配置

1. **配置 API Keys**

创建 `.env` 文件（或修改现有的）：

```env
# API Keys（多个用逗号分隔，每分钟自动轮换）
VITE_API_KEYS="sk-air-key1,
sk-air-key2,
sk-air-key3,
sk-air-key4,
sk-air-key5,
sk-air-key6"
```

将 `sk-air-key1` 等替换成你的真实 API Keys。

2. **或者在界面中配置**

启动应用后，点击右上角"设置 API Key"按钮，输入一个或多个 API Key（每行一个）。

### 运行

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

应用将在 `http://localhost:5173` 启动。

## 📖 使用说明

### 文生视频

1. 选择"文生视频"模式
2. 输入视频描述（例如：一只金色的凤凰在星空中展翅飞翔）
3. 选择画面比例（3:2、1:1、2:3）
4. 选择生成模式（正常、辣味、趣味）
5. 点击"开始生成"

### 图生视频

1. 选择"图生视频"模式
2. 输入图片链接（最多 2 张，HTTPS 链接）
3. 输入视频动效描述
4. 选择画面比例和生成模式
5. 点击"开始生成"

### 文生图

1. 选择"文生图"模式
2. 选择图片模型（Imagen 3、Flux 2 Pro 等）
3. 输入图片描述
4. 选择画面比例（根据模型不同）
5. （可选）添加参考图片（Flux 模型支持）
6. 点击"开始生成"

## ⚙️ 配置说明

### API Key 优先级

1. **用户界面输入** > 环境变量
2. 如果界面输入了 Key，优先使用界面的
3. 否则使用 `.env` 中的 `VITE_API_KEYS`

### 轮询机制

- 每分钟自动切换到下一个 API Key
- 如果有 N 个 Key，理论上可以每 (60/N) 秒生成一次
- 例如：8 个 Key = 每 7.5 秒可生成一次

### 速率限制

- API 限制：1 个 Key 每分钟只能请求 1 次
- 系统会自动记录上次请求时间
- 倒计时提示延迟 2 秒显示，避免干扰

## 🛠️ 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式**: Tailwind CSS
- **UI 组件**: Radix UI
- **图标**: Lucide React
- **状态管理**: React Hooks
- **API**: api.airforce

## 📁 项目结构

```
vision-weaver/
├── src/
│   ├── components/          # UI 组件
│   │   ├── ui/             # 基础 UI 组件
│   │   ├── ApiKeyDialog.tsx
│   │   ├── AspectRatioSelector.tsx
│   │   ├── ImageAspectRatioSelector.tsx
│   │   ├── ImageModelSelector.tsx
│   │   ├── ImageUploader.tsx
│   │   ├── ModeSelector.tsx
│   │   └── ResultDisplay.tsx
│   ├── hooks/              # 自定义 Hooks
│   │   └── useVideoGenerator.ts
│   ├── pages/              # 页面组件
│   │   └── Index.tsx
│   ├── lib/                # 工具函数
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/                 # 静态资源
├── .env                    # 环境变量
├── package.json
├── vite.config.ts
└── README.md
```

## 🎨 自定义

### 修改主题颜色

编辑 `src/index.css` 中的 CSS 变量：

```css
:root {
  --primary: 265 90% 65%;      /* 主色调 */
  --accent: 180 80% 55%;       /* 强调色 */
  --background: 240 15% 5%;    /* 背景色 */
  /* ... */
}
```

### 修改背景渐变

编辑 `src/index.css` 中的 `.animated-gradient-bg`：

```css
.animated-gradient-bg {
  background: linear-gradient(135deg,
    hsl(260 60% 8%),
    hsl(270 50% 12%),
    hsl(280 45% 10%),
    hsl(265 55% 9%)
  );
}
```

## 🐛 常见问题

### 1. 视频生成失败（400 错误）

**原因**：
- API Key 无效或过期
- `grok-imagine-video` 模型暂时不可用
- 速率限制

**解决**：
- 检查 API Key 是否有效
- 等待 1-2 分钟后重试
- 尝试使用图片生成功能测试

### 2. 图片生成正常，视频生成失败

**原因**：视频模型可能暂时不可用

**解决**：
- 等待 API 服务恢复
- 联系 API 提供商确认服务状态

### 3. 轮询不生效

**原因**：
- 只配置了 1 个 API Key
- 环境变量未生效

**解决**：
- 确保配置了多个 API Key
- 重启开发服务器
- 检查控制台日志：`当前使用第 X 个 API Key，共 Y 个`

### 4. 环境变量不生效

**原因**：未重启开发服务器

**解决**：
- 修改 `.env` 后必须重启服务器
- 关闭后重新运行 `npm run dev`

## 📝 更新日志

### v1.0.0 (2025-02-07)

- ✅ 文生视频功能
- ✅ 图生视频功能
- ✅ 文生图功能（7 个模型）
- ✅ API Key 轮询机制
- ✅ 速率限制保护
- ✅ 实时生成进度
- ✅ 生成时长统计
- ✅ 左右分栏布局
- ✅ 紫色渐变主题

## 📄 许可证

MIT License

Copyright © 2025 蓝色空间-AI 故事创作平台. All rights reserved.

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📧 联系方式

如有问题或建议，请通过以下方式联系：

- 提交 Issue
- 发送邮件至：[your-email@example.com]

---

**注意**：本项目仅供学习和研究使用，请遵守 API 提供商的使用条款。

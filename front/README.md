# 0G Storage 图片管理应用

基于Next.js的图片管理应用，支持图片上传到0G Storage分布式存储网络和根据rootHash拉取图片。

## 功能特性

- ✅ **图片上传**: 前端选择图片，后端上传到0G Storage
- ✅ **图片下载**: 输入rootHash从0G Storage拉取图片
- ✅ **图片预览**: 下载后直接在浏览器中预览
- ✅ **文件保存**: 支持将下载的图片保存到本地
- ✅ **多格式支持**: 自动识别jpg、png、gif、webp等格式
- ✅ **完整日志**: 详细的上传和下载过程日志

## 技术栈

- **前端**: React + Next.js
- **Web3**: viem + wagmi + RainbowKit
- **存储**: 0G Storage
- **语言**: TypeScript

## 安装和使用

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 到 `.env.local`:

```bash
cp .env.example .env.local
```

在 `.env.local` 中设置:

```
PRIVATE_KEY=your_64_character_private_key_here
```

**重要说明**:
- 私钥必须是64位十六进制字符（可以包含或不包含0x前缀）
- 私钥对应的地址需要有0G测试网络的代币用于支付上传费用
- 可以从 https://faucet.0g.ai 获取测试代币
- 示例格式: `abc123def456789012345678901234567890123456789012345678901234abcd`

### 3. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 使用方法

### 📤 上传图片
1. 在"上传图片到0G Storage"区域点击选择图片文件
2. 选择后点击"上传到0G Storage"按钮
3. 等待上传完成，获得rootHash和交易哈希
4. 复制rootHash用于后续下载

### 📥 下载图片
1. 在"从0G Storage拉取图片"区域输入rootHash
2. 点击"下载图片"按钮
3. 等待下载完成，图片将在页面中显示
4. 点击"保存到本地"按钮可下载到电脑

### 💡 使用技巧
- 上传和下载可以独立使用
- rootHash是图片在0G Storage中的唯一标识
- 支持jpg、png、gif、webp等常见图片格式

## 0G网络信息

- **网络名称**: 0G-Galileo-Testnet
- **Chain ID**: 16601
- **RPC**: https://evmrpc-testnet.0g.ai
- **区块浏览器**: https://chainscan-galileo.0g.ai
- **Storage浏览器**: https://storagescan-galileo.0g.ai
- **代币水龙头**: https://faucet.0g.ai

## 项目结构

```
front/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── upload/route.ts    # 图片上传API端点
│   │   │   └── download/route.ts  # 图片下载API端点
│   │   └── page.tsx               # 主页面
│   └── components/
│       ├── ImageUpload.tsx        # 图片上传组件
│       └── ImageDownload.tsx      # 图片下载组件
├── .env.example                   # 环境变量模板
└── package.json
```

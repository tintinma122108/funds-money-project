This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

1. 在 Vercel 中导入本仓库，**Root Directory 填 `haze-soup`**（若仓库根目录就是 haze-soup 则留空）。
2. 当前基金估值使用**公开免费接口**（天天基金 / 东方财富 / 新浪），**无需配置环境变量**，直接部署即可。

### 密钥安全（必读）

- 所有 `.env*` 已通过 `.gitignore` 排除，**切勿提交含 API Key 的文件**。
- 若将来接入需密钥的基金 API 或 AI 接口：在代码中用 `process.env.XXX` 读取，在 Vercel 项目 **Settings → Environment Variables** 中配置，不要写死在代码里，避免推送到 GitHub 导致泄露与欠费风险。
- 可参考项目根目录下的 `.env.example`（仅占位说明，无真实密钥）。

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

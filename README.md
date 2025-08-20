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

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Auto-Push to GitHub

This project is configured with automatic pushing to GitHub. Here are the available options:

### 1. Automatic Push on Commit (Recommended)
Every time you commit changes, they will automatically be pushed to GitHub thanks to the git post-commit hook.

### 2. Manual Auto-Push Script
Run the auto-push script to commit and push all changes:

```bash
npm run auto-push
# or
./scripts/auto-push.sh
```

### 3. Build and Deploy
Build the project and push to GitHub:

```bash
npm run deploy
```

### 4. GitHub Actions
The project includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically:
- Builds the application
- Runs tests (if available)
- Deploys to your chosen platform (Vercel, Netlify, etc.)

To enable deployment, add the necessary secrets to your GitHub repository:
- For Vercel: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`
- For Netlify: `NETLIFY_AUTH_TOKEN`, `NETLIFY_SITE_ID`

### Disabling Auto-Push
If you want to disable automatic pushing, you can:
- Remove the post-commit hook: `rm .git/hooks/post-commit`
- Use `git commit --no-verify` to skip hooks

# 公网访问

手机不在同一个 Wi-Fi 时，不能使用 `localhost` 或电脑的局域网 IP。需要把 `dist` 发布到带 HTTPS 的静态托管服务。

## GitHub Pages

1. 把项目推送到 GitHub 仓库的 `main` 分支。
2. 在仓库设置中打开 **Settings → Pages**，将 **Source** 设为 **GitHub Actions**。
3. 推送后，工作流会自动运行测试并发布 `dist`。
4. 在 **Actions** 或 **Settings → Pages** 中复制生成的 HTTPS 地址，用手机直接打开。

仓库已经包含 `.github/workflows/deploy-pages.yml`，不需要手动上传构建文件。

## 其他静态托管

执行 `npm ci && npm run build`，把 `dist` 文件夹上传到 Netlify、Vercel、Cloudflare Pages 等静态托管服务。不要上传项目源代码入口并直接双击 `index.html`。

## 本机启动

电脑上双击项目根目录的 `start-game.bat`，或运行 `npm run dev`，再用浏览器打开 `http://localhost:5173/`。这个地址只适用于本机或同一局域网。

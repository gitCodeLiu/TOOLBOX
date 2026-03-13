# Node.js 环境配置指南

本文档面向后端开发者，详细说明如何在本地配置 Node.js 环境并启动前端项目。

---

## 第一步：安装 Node.js

Node.js 是运行本项目的必要环境（类似 Java 项目需要 JDK）。

1. 打开 [https://nodejs.org](https://nodejs.org)，下载 **LTS 版本**（推荐，稳定）
2. 安装完成后，打开终端（Mac 的"终端" / Windows 的"命令提示符"），运行以下命令验证安装：

```bash
node -v   # 应输出类似 v20.x.x，版本需 >= 18
npm -v    # 应输出类似 10.x.x，版本需 >= 9
```

> 如果已安装 Node.js 但版本过低，可使用 [nvm](https://github.com/nvm-sh/nvm)（Mac/Linux）或 [nvm-windows](https://github.com/coreybutler/nvm-windows) 管理多版本。

---

## 第二步：进入项目目录

将项目代码放到本地任意目录，然后在终端中进入项目根目录（即包含 `package.json` 文件的那层目录）：

```bash
cd /your/path/to/ToolBox
```

---

## 第三步：安装依赖

类似 Maven/Gradle 下载 jar 包，npm 会读取 `package.json` 自动下载所有前端依赖：

```bash
npm install
```

> 执行后会生成 `node_modules/` 目录，这是所有依赖的存放位置，**不需要提交到 Git**。
>
> 首次安装需联网，国内网络较慢时可切换为淘宝镜像：
> ```bash
> npm install --registry=https://registry.npmmirror.com
> ```

---

## 第四步：启动开发服务器

```bash
npm run dev
```

启动成功后，终端会显示类似输出：

```
  VITE ready in 82 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

用浏览器打开 **http://localhost:5173** 即可访问项目。

> 开发服务器支持**热更新**：修改代码后，浏览器会自动刷新，无需手动重启。

---

## 查看正在运行的项目 & 如何关闭

### 停止当前终端的服务

在启动了 `npm run dev` 的终端窗口中，按以下快捷键即可停止：

```
Ctrl + C
```

### 查看所有正在占用端口的 Node 进程

如果关闭了终端但服务仍在后台运行，可用以下命令查看：

**Mac / Linux：**

```bash
# 查看所有 Node.js 进程（显示 PID 和启动命令）
ps aux | grep node

# 查看具体端口占用情况（例如查看 5173 端口）
lsof -i :5173

# 查看所有前端常用端口（3000 / 5173 / 8080）
lsof -i :3000 -i :5173 -i :8080
```

**Windows（命令提示符 / PowerShell）：**

```bat
# 查看所有 Node.js 进程
tasklist | findstr node

# 查看某个端口占用（例如 5173）
netstat -ano | findstr :5173
```

### 根据 PID 强制关闭进程

如果 `Ctrl+C` 无效，可通过进程 ID（PID）强制终止：

**Mac / Linux：**

```bash
# 先查出占用 5173 端口的 PID
lsof -i :5173
# 输出示例：node 12345 user ...

# 用 PID 强制终止
kill -9 12345
```

**Windows：**

```bat
# 先查出 PID
netstat -ano | findstr :5173

# 用 PID 强制终止
taskkill /PID 12345 /F
```

### 一键关闭所有 Node 进程（谨慎使用）

> ⚠️ 以下命令会关闭当前用户所有 Node.js 进程，包括其他正在运行的前端项目，请确认后再执行。

**Mac / Linux：**

```bash
killall node
```

**Windows：**

```bat
taskkill /IM node.exe /F
```

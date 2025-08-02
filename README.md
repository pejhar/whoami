# Ahmad Shirzadi - Terminal-style Portfolio

A minimalist, retro terminal-style personal portfolio built with React, inspired by old DOS interfaces. Fully responsive, MIT licensed, and deployable for free on Cloudflare Pages. Incoming messages are sent directly to my Telegram bot and optionally stored in KV or D1.

![Screenshot](./screenshot.png)

---

## 🧠 Features

* 🖥 Terminal-like UI with Dracula theme
* ⚛️ Built with React and styled with TailwindCSS
* 🔐 Secrets managed via `.env`
* 📡 Messages sent to Telegram bot using API
* 📁 Cloudflare Pages Functions used for backend
* 🗄 Optional database storage via D1 or KV
* 📱 Fully responsive
* 🔓 MIT Licensed and open-source
* ⚙️ Easily extensible and testable locally

---

## 🏗 Tech Stack

* React (Frontend)
* TailwindCSS (Styling)
* Cloudflare Pages + Functions (Backend)
* Cloudflare D1 or KV (Storage, optional)
* Telegram Bot API (Messaging)

---

## 🛠 Getting Started

### 1. Clone the repo:

```bash
git clone https://github.com/pejhar/terminal-portfolio.git
cd terminal-portfolio
```

### 2. Install dependencies:

```bash
npm install
```

### 3. Configure Environment:

Create a `.env` file:

```env
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_chat_id
```

> ⚠️ Make sure `.env` is added to `.gitignore` so secrets are not pushed.

### 4. Run locally (development mode):

```bash
npx wrangler pages dev
```

---

## 🚀 Deploy to Cloudflare Pages

### One-line deploy:

```bash
npx wrangler pages deploy public
```

> The `public/` folder contains the static output.

---

## 🧪 Testing

* Works locally via `wrangler pages dev`
* Responsive on all major browsers
* Designed to simulate classic command-line input/output

---

## 👤 About Me

* Name: Ahmad Shirzadi
* LinkedIn: [linkedin.com/in/ahmad-shirzadi](https://www.linkedin.com/in/ahmad-shirzadi/)
* GitHub: [github.com/pejhar](https://github.com/pejhar)
* Location: Tehran, Iran
* Local Time is shown on screen (Asia/Tehran)

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE).

---

## 🧩 Want to contribute?

Feel free to fork and submit PRs. Ideas for new commands, visual enhancements, or integrating new APIs are welcome!

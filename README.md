# Ahmad Shirzadi - Terminal-style Portfolio

A minimalist, retro terminal-style personal portfolio built with **plain HTML, CSS, and JavaScript**, inspired by old DOS interfaces. It features a modern **Dracula theme**, is fully responsive, and can be deployed for free on Cloudflare Pages. Incoming messages are sent directly to my Telegram bot.

![Screenshot](./screenshot.png)

---

## 🧠 Features

* 🖥 Terminal-like UI with **Dracula theme**
* 💡 Built with **plain HTML, CSS, and JavaScript**
* 🔐 Secrets managed via `.env` for Cloudflare Pages Functions
* 📡 Messages sent to Telegram bot using Cloudflare Pages Functions
* 📁 Cloudflare Pages for frontend hosting and backend functions
* 📱 Fully responsive design
* 🔓 MIT Licensed and open-source
* ⚙️ Easily extensible and testable locally

---

## 🏗 Tech Stack

* **Frontend**: HTML, CSS, JavaScript
* **Backend**: Cloudflare Pages Functions
* **Messaging**: Telegram Bot API
* **Deployment**: Cloudflare Pages

---

## 🛠 Getting Started

### 1. Clone the repository:

```bash
git clone https://github.com/pejhar/terminal-portfolio.git
cd terminal-portfolio
```

### 2. Install dependencies:

This project does not have external JavaScript dependencies that require `npm install` for the frontend. The backend (Cloudflare Pages Functions) dependencies are handled by Cloudflare automatically. You can ensure you have `wrangler` installed for local development and deployment:

```bash
npm install -g wrangler
```

### 3. Configure Environment Variables:

Create a `.env` file in the root of your project to store your Telegram bot token and chat ID. These are essential for the `sendMessage` command to function.

```env
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_chat_id
```

> ⚠️ **Important**: Ensure your `.env` file is included in your `.gitignore` to prevent sensitive information from being pushed to your public repository.

### 4. Run locally (development mode):

To run the project locally with the Cloudflare Pages development server, navigate to your project root and execute:

```bash
npx wrangler pages dev public
```

This command will start a local server and enable hot reloading for development. The `public/` directory is served as the static content, and `functions/api/send.js` will be available at `/api/send`.

---

## 🚀 Deploy to Cloudflare Pages

You can easily deploy this project to Cloudflare Pages. First, ensure you have configured your `.env` variables in your Cloudflare Pages project settings (Environment variables section).

### Manual Deployment:

From your project root, run the following command to deploy the `public` directory:

```bash
npx wrangler pages deploy public
```

This will prompt you to confirm the deployment and provide a URL upon successful completion.

### Continuous Deployment (Recommended):

For continuous deployment, you can connect your GitHub repository to Cloudflare Pages. Cloudflare will automatically build and deploy your project on every push to the specified branch (e.g., `main`).

---

## 💻 Commands

Here's a list of commands you can use in the terminal:

*   `help`: Displays a list of available commands.
*   `sendMessage`: Initiates a mode to send a message. After typing `sendMessage`, type your desired message and press Enter to send it via Telegram.
*   `clear`: Clears the terminal screen.
*   `updates`: Shows the latest updates and features of the portfolio.
*   `aboutMe`: Displays information about Ahmad Shirzadi, including social media links.
*   `exit`: Attempts to close the current browser tab.

---

## 🧪 Testing

The application can be tested locally using `npx wrangler pages dev public`. This will provide a local development environment that mimics Cloudflare Pages, allowing you to test all frontend interactions and backend API calls.

*   **Browser Compatibility**: Tested and responsive on all major modern web browsers.
*   **Terminal Simulation**: Designed to accurately simulate classic command-line input and output behaviors.
*   **Backend Integration**: Verify message sending functionality by checking your Telegram bot after using the `sendMessage` command.

---

## 👤 About Me

Ahmad Shirzadi is a passionate web developer with expertise in building minimalist and efficient web applications. Connect with Ahmad on:

*   **LinkedIn**: [linkedin.com/in/ahmad-shirzadi](https://www.linkedin.com/in/ahmad-shirzadi/)
*   **GitHub**: [github.com/pejhar](https://github.com/pejhar)

The local time displayed in the terminal is set to Asia/Tehran.

---

## 📄 License

This project is open-source and licensed under the [MIT License](./LICENSE). Feel free to use, modify, and distribute it.

---

## 🧩 Want to contribute?

Contributions are welcome! If you have ideas for new commands, visual enhancements, bug fixes, or integrating new APIs, please feel free to fork the repository and submit a pull request. Your contributions are highly appreciated.

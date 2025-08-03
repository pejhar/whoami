const input = document.querySelector('.txt-input');
const content = document.querySelector('#terminal-content');

input.addEventListener('keydown', handleCommand);

document.addEventListener('click', (e) => {
  const target = e.target;
  if (target.tagName === 'A' && target.dataset.command) {
    e.preventDefault();
    const cmd = target.dataset.command;
    appendToContent(`<span class="user-command">$ ${cmd}</span>`);
    executeCommand(cmd);
  }
});

function appendToContent(html) {
  const wrapper = document.createElement('div');
  wrapper.className = 'entry';
  wrapper.innerHTML = html;
  content.appendChild(wrapper);
  content.scrollTop = content.scrollHeight;
}

function focusInput() {
  input.focus();
  if (window.innerWidth < 768) {
    setTimeout(() => {
      window.scrollTo(0, document.body.scrollHeight);
    }, 100);
  }
}

function handleCommand(event) {
  if (event.key === 'Enter') {
    const command = input.value.trim();
    if (!command) return;
    input.value = '';
    appendToContent(`<span class="user-command">$ ${command}</span>`);
    executeCommand(command);
  }
}

const chatMessages = [
  { role: "system", content: "You are a helpful assistant." }
];

async function executeCommand(command) {
  const cmd = command.toLowerCase();
  const knownCommands = ['sendmessage', 'clear', 'exit', 'aboutme', 'updates'];

  if (knownCommands.includes(cmd)) {
    switch (cmd) {
      case 'sendmessage':
        appendToContent("Type your message and press Enter:");
        input.removeEventListener('keydown', handleCommand);
        input.addEventListener('keydown', handleSendMessage);
        break;

      case 'clear':
        document.querySelectorAll('#terminal-content .entry').forEach(entry => {
          if (!entry.classList.contains('fixed')) {
            entry.remove();
          }
        });
        break;

      case 'exit':
        appendToContent("Closing tab...<br>");
        setTimeout(() => window.close(), 1000);
        break;

      case 'aboutme':
        appendToContent(`
          <div class="about-me">
            <span class="about-txt">
              Hello visitor,<br>
              My name is Ahmad Shirzadi. I am a Software Engineer.<br>
              LinkedIn: <a href="https://www.linkedin.com/in/ahmad-shirzadi/" target="_blank">here</a><br>
              GitHub: <a href="https://github.com/pejhar" target="_blank">here</a><br>
              CV: <a href="/cv_ahmad_shirzadi_august_2025.pdf" target="_blank" download>Download my CV (PDF)</a><br><br>
            </span>
          </div>
        `);
        break;

      case 'updates':
        appendToContent(`
          <div class="about-me">
            <span class="about-txt">
              Updates:<br>
              - New feature: Send message directly to my Telegram via "sendMessage"<br><br>
            </span>
          </div>
        `);
        break;
    }
  } else {
    appendToContent('<span class="success-msg">AI is thinking...</span>');
    chatMessages.push({ role: "user", content: command });

    try {
      const reply = await getAIReply(chatMessages);
      chatMessages.push({ role: "assistant", content: reply });
      appendToContent(`<span class="success-msg">${reply}</span><br><br>`);
    } catch {
      appendToContent('<span class="error-msg">Error communicating with AI.</span><br><br>');
    }
  }

  focusInput();
}

function handleSendMessage(event) {
  if (event.key === 'Enter') {
    const message = input.value.trim();
    if (!message) return;
    input.value = '';
    appendToContent(`<span class="sent-msg">Sending message: "${message}"...</span><br>`);

    fetch('/api/TelegramSend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    })
      .then(res => res.json())
      .then(data => {
        if (data.ok) {
          appendToContent(`<span class="success-msg">Message sent successfully</span><br><br>`);
        } else {
          appendToContent(`<span class="error-msg">Failed to send message</span><br><br>`);
        }
      })
      .catch(() => {
        appendToContent(`<span class="error-msg">Request error</span><br><br>`);
      })
      .finally(() => {
        input.removeEventListener("keydown", handleSendMessage);
        input.addEventListener("keydown", handleCommand);
        focusInput();
      });
  }
}

async function getAIReply(messages) {
  const response = await fetch('functions/api/AiChat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: messages })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'API error');
  }

  const data = await response.json();
  return data.reply;
}

window.onload = () => {
  const splash = document.getElementById('splash-screen');
  setTimeout(() => {
    splash.style.opacity = 0;
    splash.style.pointerEvents = 'none';
    setTimeout(() => splash.style.display = 'none', 300);
    focusInput();
  }, 1200);
};

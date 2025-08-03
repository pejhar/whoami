const input = document.querySelector('.txt-input');
const content = document.querySelector('.content');

input.addEventListener('keydown', handleCommand);

content.addEventListener('click', (e) => {
  const target = e.target;
  if (target.tagName === 'A' && target.dataset.command) {
    e.preventDefault();
    const cmd = target.dataset.command;
    appendToContent(`<span class="user-command">$ ${cmd}</span>`);
    executeCommand(cmd);
  }
});

function getTehranTime() {
  const now = new Date();
  return now.toLocaleString('en-GB', {
    timeZone: 'Asia/Tehran',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

function showHelp() {
  appendToContent(`
    <div style="display: flex; flex-direction: column; gap: 4px;">
      <div style="display: flex; justify-content: flex-start;">
        <a href="#" class="help-txt" style="width: 120px; font-weight: bold; cursor: pointer; color: #66ccff; text-decoration: underline;" data-command="sendMessage">sendMessage</a>
        <span>Send a DM to my Telegram</span>
      </div>
      <div style="display: flex; justify-content: flex-start;">
        <a href="#" class="help-txt" style="width: 120px; font-weight: bold; cursor: pointer; color: #66ccff; text-decoration: underline;" data-command="clear">clear</a>
        <span>Clear the terminal screen</span>
      </div>
      <div style="display: flex; justify-content: flex-start;">
        <a href="#" class="help-txt" style="width: 120px; font-weight: bold; cursor: pointer; color: #66ccff; text-decoration: underline;" data-command="updates">updates</a>
        <span>Show recent updates</span>
      </div>
      <div style="display: flex; justify-content: flex-start;">
        <a href="#" class="help-txt" style="width: 120px; font-weight: bold; cursor: pointer; color: #66ccff; text-decoration: underline;" data-command="aboutMe">aboutMe</a>
        <span>Show brief info about me</span>
      </div>
      <div style="display: flex; justify-content: flex-start;">
        <a href="#" class="help-txt" style="width: 120px; font-weight: bold; cursor: pointer; color: #66ccff; text-decoration: underline;" data-command="help">help</a>
        <span>Display available commands</span>
      </div>
      <div style="display: flex; justify-content: flex-start;">
        <a href="#" class="help-txt" style="width: 120px; font-weight: bold; cursor: pointer; color: #66ccff; text-decoration: underline;" data-command="exit">exit</a>
        <span>Close the terminal</span>
      </div>
    </div><br>
  `);
}

window.onload = () => {
  const splash = document.getElementById('splash-screen');
  const dots = document.querySelector('.splash-dots');
  let dotCount = 0;
  let dotInterval = setInterval(() => {
    dotCount = (dotCount + 1) % 4;
    dots.textContent = '.'.repeat(dotCount);
  }, 350);
  setTimeout(() => {
    clearInterval(dotInterval);
    splash.style.display = 'none';
    const time = getTehranTime();
    appendToContent(
      `<p class="welcome-txt">Welcome to my terminal.</p>` +
      `<p class="welcome-txt">Tehran time: <span class="cmd-txt">${time}</span></p>`
    );
    showHelp();
    focusInput();
  }, 2500);
};

function focusInput() {
  input.focus();
}

function appendToContent(html) {
  content.innerHTML += html;
}

function handleCommand(event) {
  if (event.key === 'Enter') {
    const command = input.value.trim();
    input.value = '';
    appendToContent(`<span class="user-command">$ ${command}</span>`);
    executeCommand(command);
  }
}

function executeCommand(command) {
  switch (command.toLowerCase()) {
    case "help":
      showHelp();
      break;

    case "sendmessage":
      appendToContent("Type your message and press Enter:");
      input.removeEventListener('keydown', handleCommand);
      input.addEventListener('keydown', handleSendMessage);
      break;

    case "clear":
      content.innerHTML = "";
      break;

    case "exit":
      appendToContent("Closing tab...<br>");
      setTimeout(() => window.close(), 1000);
      break;

    case "aboutme":
      appendToContent(`
        <div class="about-me">
          <span class="about-txt">
            Hello visitor,<br>
            My name is Ahmad. I am a Software Engineer.<br>
            LinkedIn: <a href="https://www.linkedin.com/in/ahmad-shirzadi/" target="_blank">here</a><br>
            GitHub: <a href="https://github.com/pejhar" target="_blank">here</a><br>
            CV: <a href="/cv_ahmad_shirzadi_august_2025.pdf" target="_blank" download>Download my CV (PDF)</a><br><br>
          </span>
        </div>
      `);
      break;

    case "updates":
      appendToContent(`
        <div class="about-me">
          <span class="about-txt">
            Updates:<br>
            - New feature: Send message directly to my Telegram via "sendMessage"<br><br>
          </span>
        </div>
      `);
      break;

    default:
      appendToContent(`Unknown command: ${command}, type <span class="help-txt" style="width: 120px; font-weight: bold;">help</span> for commands.<br><br>`);
  }
  focusInput();
}

function handleSendMessage(event) {
  if (event.key === 'Enter') {
    const message = input.value.trim();
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
        appendToContent(`<span class="help-txt">Message sent successfully</span><br><br>`);
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

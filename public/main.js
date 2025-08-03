const input = document.querySelector('.txt-input');
const content = document.querySelector('.content');

input.addEventListener('keydown', handleCommand);

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
      `<p class="welcome-txt">For a list of the commands, type <span class="help-txt">\"help\"</span>.</p>` +
      `<p class="welcome-txt">Tehran time: <span class="cmd-txt">${time}</span></p>`
    );
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
    appendToContent(`$ ${command}<br>`);
    executeCommand(command);
  }
}

function executeCommand(command) {
  switch (command) {
    case "help":
      appendToContent(`
        <p class="dummy-txt">Available commands:
          <span class="cmd-txt">help</span>,
          <span class="cmd-txt">sendMessage</span>,
          <span class="cmd-txt">clear</span>,
          <span class="cmd-txt">updates</span>,
          <span class="cmd-txt">aboutMe</span>,
          <span class="cmd-txt">exit</span>
        </p><br>
      `);
      break;

    case "sendMessage":
      appendToContent("Type your message and press Enter:<br>");
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

    case "aboutMe":
      const aboutMe = `
        <div class="about-me">
          <span class="about-txt">
            Hello visitor,<br>
            My name is Ahmad. I am a web developer...<br>
            LinkedIn: <a href="https://www.linkedin.com/in/ahmad-shirzadi/" target="_blank">here</a><br>
            GitHub: <a href="https://github.com/pejhar" target="_blank">here</a><br>
          </span>
        </div>
      `;
      appendToContent(aboutMe);
      break;

    case "updates":
      const updates = `
        <div class="about-me">
          <span class="about-txt">
            Updates:<br>
            - New feature: Send message directly to my Telegram via "sendMessage"<br>
          </span>
        </div>
      `;
      appendToContent(updates);
      break;

    default:
      appendToContent(`Unknown command: ${command}, type help for commands.<br>`);
  }
  focusInput();
}

function handleSendMessage(event) {
  if (event.key === 'Enter') {
    const message = input.value.trim();
    input.value = '';
    appendToContent(`<span class="sent-msg">Sending message: "${message}"...</span><br>`);

    fetch('/api/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    })
    .then(res => res.json())
    .then(data => {
      if (data.ok) {
        appendToContent(`<span class="sent-msg">Message sent successfully ✔️</span><br>`);
      } else {
        appendToContent(`<span class="error-msg">Failed to send message ❌</span><br>`);
      }
    })
    .catch(() => {
      appendToContent(`<span class="error-msg">Request error ❌</span><br>`);
    })
    .finally(() => {
      input.removeEventListener("keydown", handleSendMessage);
      input.addEventListener("keydown", handleCommand);
      focusInput();
    });
  }
}

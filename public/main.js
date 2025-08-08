window.addEventListener('DOMContentLoaded', () => {
  const burgerButton = document.querySelector('.burger-menu');
  const mobileMenu = document.getElementById('mobile-menu');
  const content = document.querySelector('#terminal-content');

  const commandsTemplate = document.getElementById('commands-template');
  const commandsHTML = commandsTemplate.innerHTML;

  mobileMenu.insertAdjacentHTML('beforeend', commandsHTML);

  const helpBox = document.querySelector('.help-box');
  if (helpBox) {
    helpBox.insertAdjacentHTML('beforeend', commandsHTML);
  }

  let chatMessages = [{ role: "system", content: "You are a helpful assistant." }];
  let currentInputMode = 'command';

  function removeExistingPrompt() {
    const existing = content.querySelector('.prompt-line');
    if (existing) existing.remove();
  }

  function createPromptInput(initialText = '') {
    removeExistingPrompt();
    const wrapper = document.createElement('div');
    wrapper.className = 'entry prompt-line';
    wrapper.innerHTML = `
      <span class="path">visitor@ai:~$</span>
      <input class="txt-input" type="text" value="${initialText}" spellcheck="false" autocomplete="off" autocorrect="off" />
    `;
    content.appendChild(wrapper);
    const inputEl = wrapper.querySelector('.txt-input');

    if (window.innerWidth < 768) {
      setTimeout(() => window.scrollTo(0, document.body.scrollHeight), 100);
    }

    inputEl.addEventListener('keydown', async (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const command = inputEl.value.trim();
        if (!command) return;
        inputEl.disabled = true;

        if (currentInputMode === 'sendMessage') {
          await handleSendMessage(command);
        } else {
          appendToContentCommand(command);
          await executeCommand(command);
        }
      } else if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        closeMobileMenu();
      }
    });

    inputEl.focus();
  }

  // اضافه کردن دستور همراه prompt به ترمینال
  function appendToContentCommand(command) {
    const wrapper = document.createElement('div');
    wrapper.className = 'entry';
    wrapper.innerHTML = `
      <span class="path">visitor@ai:~$</span> 
      <span class="user-command">${command}</span>
    `;
    content.appendChild(wrapper);
    content.scrollTop = content.scrollHeight;
  }

  function appendToContent(html) {
    const wrapper = document.createElement('div');
    wrapper.className = 'entry';
    wrapper.innerHTML = html;
    content.appendChild(wrapper);
    content.scrollTop = content.scrollHeight;
  }

  async function executeCommand(command) {
    const cmd = command.toLowerCase();
    const knownCommands = ['sendmessage', 'clear', 'exit', 'aboutme', 'updates'];

    if (knownCommands.includes(cmd)) {
      switch (cmd) {
        case 'clear':
          content.innerHTML = '';
          break;
        case 'exit':
          appendToContent('<span class="ai-thinking">Goodbye 👋</span>');
          setTimeout(() => window.close(), 1000);
          break;
        case 'sendmessage':
          currentInputMode = 'sendMessage';
          appendToContent("Express whatever you wish and press Enter:");
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
                Latest updates:<br>
                - AI assistant integrated into the terminal.<br>
                - Ability to send messages directly to Telegram.<br>
                Stay tuned for more features!<br><br>
              </span>
            </div>
          `);
          break;

      }
      createPromptInput();
    } else {
      appendToContent('<span class="ai-thinking">$ Processing...</span>');

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [
              ...chatMessages,
              { role: "user", content: command }
            ]
          })
        });

        const data = await response.json();
        const aiReply = data.result.response;

        appendToContent(`
          <div class="ai-response">
            <span class="ai-prompt">AI@koregeloo:~$</span>
            <span class="ai-text">${aiReply}</span>
          </div>
        `);

        chatMessages.push(
          { role: "user", content: command },
          { role: "assistant", content: aiReply }
        );

      } catch {
        appendToContent('<span class="error-msg">Error communicating with AI server</span>');
      }
      createPromptInput();
    }
  }

  async function handleSendMessage(message) {
    if (!message) return;
    appendToContent(`<span class="sent-msg">Sending message: "${message}"...</span><br>`);
    try {
      const res = await fetch('/api/TelegramSend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      const data = await res.json();
      appendToContent(data.ok
        ? `<span class="success-msg">Message sent successfully</span><br><br>`
        : `<span class="error-msg">Failed to send message</span><br><br>`);
    } catch {
      appendToContent(`<span class="error-msg">Request error</span><br><br>`);
    } finally {
      currentInputMode = 'command';
      createPromptInput();
    }
  }

  function appendWelcomeAndTime() {
    if (content.querySelector('.welcome-terminal')) return;
    const wrapper = document.createElement('div');
    wrapper.className = 'entry welcome-terminal';
    wrapper.innerHTML = `
      <div style="color:#D28F4B;font-weight:600;">
        Welcome to my Terminal<br>
        Copyright (C)koregeloo.ir all rights reserved.<br>
        Ask the AI assistant (e.g. How to contact me?).<br>
      </div>
      <div style="color:#D28F4B;font-weight:600;margin-top:4px;">
        Tehran time: <span id="tehran-time-inline"></span>
      </div>
    `;
    content.appendChild(wrapper);
    updateTehranTimeInline();
    setInterval(updateTehranTimeInline, 1000);
  }

  function updateTehranTimeInline() {
    const now = new Date();
    const timeText = now.toLocaleTimeString('en-GB', {
      timeZone: 'Asia/Tehran',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    const timeSpan = document.getElementById('tehran-time-inline');
    if (timeSpan) timeSpan.textContent = timeText;
  }

  function closeMobileMenu() {
    mobileMenu.classList.remove('active');
    mobileMenu.setAttribute('aria-hidden', 'true');
    burgerButton.setAttribute('aria-expanded', 'false');
  }

  burgerButton?.addEventListener('click', () => {
    const expanded = burgerButton.getAttribute('aria-expanded') === 'true';
    burgerButton.setAttribute('aria-expanded', String(!expanded));
    mobileMenu.classList.toggle('active');
    mobileMenu.setAttribute('aria-hidden', expanded ? 'true' : 'false');
  });

  document.body.addEventListener('click', (e) => {
    const target = e.target;
    const link = target.closest('[data-command]');
    if (link && link.dataset.command) {
      e.preventDefault();
      if (mobileMenu.classList.contains('active')) closeMobileMenu();

      appendToContentCommand(link.dataset.command.trim());
      executeCommand(link.dataset.command.trim().toLowerCase());
    }
  });

  document.addEventListener('click', (e) => {
    const isInsideMenu = mobileMenu.contains(e.target);
    const isBurger = burgerButton.contains(e.target);
    if (!isInsideMenu && !isBurger && mobileMenu.classList.contains('active')) {
      closeMobileMenu();
    }
  });

  const splash = document.getElementById('splash-screen');
  const setupTerminal = () => {
    appendWelcomeAndTime();
    currentInputMode = 'sendMessage';
    appendToContent("Express whatever you wish and press Enter:");
    createPromptInput('Hi...');
  };

  if (splash) {
    splash.style.transition = 'opacity 0.3s ease';
    setTimeout(() => {
      splash.style.opacity = '0';
      splash.style.pointerEvents = 'none';
      setTimeout(() => {
        splash.style.display = 'none';
        setupTerminal();
      }, 300);
    }, 1200);
  } else {
    setupTerminal();
  }
});

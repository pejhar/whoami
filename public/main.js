window.addEventListener('DOMContentLoaded', () => {
  const burgerButton = document.querySelector('.burger-menu');
  const mobileMenu = document.getElementById('mobile-menu');
  const content = document.querySelector('#terminal-content');
  const commandsTemplate = document.getElementById('commands-template');
  const overlay = document.getElementById('overlay');
  const splash = document.getElementById('splash-screen');

  mobileMenu.insertAdjacentHTML('beforeend', commandsTemplate.innerHTML);
  const helpBox = document.querySelector('.help-box');
  if (helpBox) {
    helpBox.insertAdjacentHTML('beforeend', commandsTemplate.innerHTML);
  }

  let chatMessages = [{ role: "system", content: "You are a helpful assistant that responds in JSON format." }];
  let currentInputMode = 'command';

  function openMobileMenu() {
    mobileMenu.classList.add('active');
    mobileMenu.setAttribute('aria-hidden', 'false');
    burgerButton.classList.add('active');
    burgerButton.setAttribute('aria-expanded', 'true');
    overlay.classList.add('active');
  }

  function closeMobileMenu() {
    mobileMenu.classList.remove('active');
    mobileMenu.setAttribute('aria-hidden', 'true');
    burgerButton.classList.remove('active');
    burgerButton.setAttribute('aria-expanded', 'false');
    overlay.classList.remove('active');
  }

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
        if (!command) {
          if (currentInputMode === 'sendMessage') {
            appendToContent(`<span class="error-msg">No message entered. Returning to command mode.</span><br><br>`);
            currentInputMode = 'command';
          }
          createPromptInput();
          return;
        }
        inputEl.disabled = true;
        removeExistingPrompt();
        appendToContentCommand(command);
        if (currentInputMode === 'sendMessage') {
          await handleSendMessage(command);
        } else {
          await executeCommand(command);
        }
      } else if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        closeMobileMenu();
      }
    });
    inputEl.focus();
  }

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
    const knownCommands = [
      'clear',
      'exit',
      'aboutme',
      'contactme',
      'sendmessage',
      'updates',
      'bookmeeting'
    ];

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
              Email: <a href="mailto:info@koregeloo.ir">info@koregeloo.ir</a><br>
              CV: <a href="/cv_ahmad_shirzadi_august_2025.pdf" target="_blank" download>Download my CV (PDF)</a><br><br>

              <pre class="timeline-tree">
.
.
.
├── 2008 - Start
│   ├── First code written
│   └── Web basics (PHP/HTML)
│
├── 2012 - University
│   ├── BSc Computer Software
│   └── Foundation: OOP, DB design
│
├── 2015 - Backend Start
│   ├── First production APIs
│   └── MVC + Laravel adoption
│
├── 2017 - ParsaDP
│   ├── Backend developer role
│   ├── Location-based platform
│   └── Server + infra setup
│
├── 2019 - Scaling Era
│   ├── Elasticsearch optimization
│   ├── Redis caching systems
│   └── Performance tuning
│
├── 2020 - Distributed Systems
│   ├── Logistical platform evolution
│   ├── Search engine improvements
│   └── Data-heavy backend design
│
├── 2022 - DevOps Shift
│   ├── Dockerized systems
│   ├── CI/CD pipelines
│   └── Linux infrastructure
│
├── 2024 - MabnaTelecom
│   ├── Full Stack Engineer
│   ├── B/OSS Admin systems
│   ├── Ticketing automation
│   └── Telecom integrations
│
├── 2025 - Cloud Era
│   ├── Cloudflare deployment
│   ├── Telegram integrations
│   └── Terminal-style portfolio
│
└── 2026 - Personal Dev OS
    ├── Command-based UI
    ├── Booking system
    └── Git-style portfolio evolution

              </pre>      
            </span>
          </div>
        `);
        break;
        case 'contactme':
          appendToContent(`
            <div class="contact-me">
              <span class="contact-txt">
                Send a direct message: <a href="#" data-command="sendmessage">sendMessage</a><br>
                Schedule a meeting: <a href="#" data-command="bookmeeting">bookMeeting</a>
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
                - Chat Crash Reporter.<br>
                - Ability to send messages directly to Telegram.<br>
                Stay tuned for more features!<br><br>
              </span>
            </div>
          `);
          break;
        case 'bookmeeting':
          window.open(
            'https://calendly.com/koregeloo/30min',
            '_blank'
          );
          break;
      }
      createPromptInput();
    } else {
      appendToContent('<span class="ai-thinking">$ Processing...</span>');

      try {
        const response = await fetch('/api/openRouterMessage', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [
              ...chatMessages,
              { role: "user", content: `${command} (please respond in JSON format)` }
            ]
          })
        });

        const data = await response.json();
        if (data.error) {
          let errorMsg = data.error;
          if (response.status === 402) {
            errorMsg = "Insufficient account balance. Please recharge your OpenRouter account.";
          } else if (response.status === 429) {
            errorMsg = "Too many requests. Please wait a few minutes.";
          } else if (response.status === 401) {
            errorMsg = "Invalid API key. Please check your settings.";
          }

          const errorDetails = {
            error: errorMsg,
            input: command || 'Unknown input',
            chatMessages: chatMessages,
            output: data
          };
          const fullErrorMsg = JSON.stringify(errorDetails, null, 2);

          appendToContent(`<span class="error-msg">Error: ${errorMsg}</span><br><br>`);
          await fetch('/api/TelegramSend', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: fullErrorMsg })
          });

          currentInputMode = 'sendMessage';
          createPromptInput(fullErrorMsg);
        } else {
          const aiReply = JSON.parse(data.reply);
          const messageContent = aiReply.message || 'No message content available';
          appendToContent(`<span class="ai-text">${messageContent}</span><br><br>`);
          chatMessages.push(
            { role: "user", content: command },
            { role: "assistant", content: JSON.stringify(aiReply) }
          );
          createPromptInput();
        }
      } catch (err) {
        const errorDetails = {
          error: "Error connecting to AI server.",
          input: command || 'Unknown input',
          chatMessages: chatMessages,
          output: { error: err.message }
        };
        const fullErrorMsg = JSON.stringify(errorDetails, null, 2);

        appendToContent(`<span class="error-msg">Error: ${err.message}</span><br><br>`);
        await fetch('/api/TelegramSend', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: fullErrorMsg })
        });

        currentInputMode = 'sendMessage';
        createPromptInput(fullErrorMsg);
      }
    }
  }

  async function handleSendMessage(message) {
    if (!message.trim()) {
      appendToContent(`<span class="error-msg">No message entered. Returning to command mode.</span><br><br>`);
      currentInputMode = 'command';
      createPromptInput();
      return;
    }

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
        Welcome to My Terminal!<br>
        Interact with the <span style="color: #8be9fd;">AI Assistant</span><br>
        <span style="font-size: 0.9em;">© 2024 koregeloo.ir — All Rights Reserved.</span>
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

  burgerButton?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (mobileMenu.classList.contains('active')) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  overlay.addEventListener('click', () => {
    closeMobileMenu();
  });

  document.body.addEventListener('click', (e) => {
    const target = e.target;
    const link = target.closest('[data-command]');
    if (link && link.dataset.command) {
      e.preventDefault();
      if (mobileMenu.classList.contains('active')) closeMobileMenu();
      currentInputMode = 'command';
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

  const setupTerminal = () => {
    appendWelcomeAndTime();
    createPromptInput();
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

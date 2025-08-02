let input = document.querySelector('.txt-input');
let content = document.querySelector('.content');

input.addEventListener('keydown', handleCommand);

// 🔧 تابع نمایش ساعت تهران
function getTehranTime() {
  const now = new Date();
  const tehranTime = now.toLocaleString('en-GB', {
    timeZone: 'Asia/Tehran',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  return tehranTime;
}

// 👋 هنگام بارگذاری، نمایش ساعت تهران
window.onload = () => {
  const time = getTehranTime();
  content.innerHTML += `🕰 Tehran time: <span class="cmd-txt">${time}</span><br><br>`;
  input.focus();
};

function handleCommand(event) {
  if (event.key === 'Enter') {
    const command = input.value.trim();
    input.value = '';
    content.innerHTML += `$ ${command}<br>`;
    executeCommand(command);
  }
}

function executeCommand(command) {
  switch (command) {
    case "help":
      content.innerHTML += '<p class="dummy-txt">Available commands: <span class="cmd-txt">help</span>, <span class="cmd-txt">sendMessage</span>, <span class="cmd-txt">clear</span>, <span class="cmd-txt">updates</span>, <span class="cmd-txt">aboutMe</span>, <span class="cmd-txt">exit</span></p><br>';
      break;

    case "sendMessage":
      content.innerHTML += "Type your message and press Enter:<br>";
      input.removeEventListener('keydown', handleCommand);
      input.addEventListener('keydown', handleSendMessage);
      break;

    case "clear":
      content.innerHTML = "";
      break;

    case "exit":
      content.innerHTML += "Closing tab...<br>";
      setTimeout(() => {
        window.close();
      }, 1000);
      break;

    case "aboutMe":
      let aboutMe = document.createElement('div');
      aboutMe.classList.add('about-me');
      aboutMe.innerHTML = `
      <span class="about-txt">
        Hello visitor,<br> My name is Ahmad. I am a web developer...<br>
        LinkedIn: <a href="https://www.linkedin.com/in/ahmad-shirzadi/" target="_blank">here</a><br>
        GitHub: <a href="https://github.com/pejhar" target="_blank">here</a><br>
      </span>`;
      content.appendChild(aboutMe);
      break;

    case "updates":
      let updates = document.createElement('div');
      updates.classList.add('about-me');
      updates.innerHTML = `
      <span class="about-txt">
        Updates:<br>
        - New feature: Send message directly to my Telegram via "sendMessage"<br>
      </span>`;
      content.appendChild(updates);
      break;

    default:
      content.innerHTML += `Unknown command: ${command}, type help for commands.<br>`;
  }

  input.focus();
}

function handleSendMessage(event) {
  if (event.key === 'Enter') {
    const message = input.value.trim();
    input.value = '';
    content.innerHTML += `<span class="sent-msg">Sending message: "${message}"...</span><br>`;

    fetch('/api/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message })
    })
    .then(res => res.json())
    .then(data => {
      if (data.ok) {
        content.innerHTML += `<span class="sent-msg">Message sent successfully ✔️</span><br>`;
      } else {
        content.innerHTML += `<span class="error-msg">Failed to send message ❌</span><br>`;
      }
    })
    .catch(err => {
      content.innerHTML += `<span class="error-msg">Request error ❌</span><br>`;
    });

    input.removeEventListener("keydown", handleSendMessage);
    input.addEventListener("keydown", handleCommand);
    input.focus();
  }
}

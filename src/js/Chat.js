import ChatAPI from './api/ChatAPI';

export default class Chat {
  constructor(container, user) {
    this.container = container;
    this.api = new ChatAPI();
    this.websocket = new WebSocket('wss://ws-back-x93t.onrender.com');
    this.user = user;
    this.sendMessage = this.sendMessage.bind(this);
    this.onEnterChatHandler = this.onEnterChatHandler.bind(this);
    this.onLeaveChatHandler = this.onLeaveChatHandler.bind(this);
  }

  init() {
    this.bindToDOM();
    this.registerEvents();
  }

  static get markup() {
    return `
      <div class="container">
        <div class="chat__container">
        <div class="chat__connect">
          <div class="chat__userlist"></div>
        </div>
        
        <div class="chat__area">
          <div class="chat__messages-container"></div>
            <form class="form__message">
              <input class="chat__messages-input" placeholder="Введите сообщение"></input>
            </form>
            
            
        </div>
        
        </div>
        </div>
    `;
  }

  bindToDOM() {
    this.container.innerHTML = Chat.markup;
  }

  registerEvents() {
    const formMsg = document.querySelector('.form__message');

    formMsg.addEventListener('submit', this.sendMessage);
    this.websocket.addEventListener('error', (e) => {
      console.log(e);

      console.log('ws error');
    });

    this.websocket.addEventListener('open', (e) => {
      console.log(e);

      console.log('ws open');
    });
    this.websocket.addEventListener('close', (e) => {
      console.log(e);

      console.log('ws close');
    });

    this.websocket.addEventListener('message', (e) => {
      console.log(e);
      const data = JSON.parse(e.data);

      if (data.msg) {
        this.renderMessage(data);
      } else {
        this.onEnterChatHandler(data);
      }
    });
  }

  onEnterChatHandler(users) {
    const userList = document.querySelector('.chat__userlist');
    const usersInChat = document.querySelectorAll('.chat__user');

    usersInChat.forEach((i) => i.remove());

    users.forEach((user) => {
      const div = document.createElement('div');
      div.classList.add('chat__user');
      if (user.name === this.user.name) {
        div.textContent = 'You';
      } else {
        div.textContent = user.name;
      }
      userList.appendChild(div);
    });
  }

  onLeaveChatHandler() {
    const mes = {
      msg: 'user exit',
      type: 'exit',
      user: this.user,
    };
    window.addEventListener('unload', () => {
      this.websocket.send(JSON.stringify(mes));
    });
  }

  sendMessage(e) {
    e.preventDefault();

    const messageText = document.querySelector('.chat__messages-input');
    const message = messageText.value;

    if (!message) return;
    const mes = {
      msg: message,
      type: 'send',
      user: this.user,
    };
    this.websocket.send(JSON.stringify(mes));
    messageText.value = '';
    console.log(this.user);
  }

  renderMessage(data) {
    if (!data.msg) return;
    const date = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
    };
    const dateFormatted = date.toLocaleDateString('ru-RU', options);
    const chat = document.querySelector('.chat__messages-container');

    const fromUser = data.user.name === this.user.name;
    const msgHTML = `
      <div class="message__container-${fromUser ? `yourself` : `opposite`}">
          <div class="message__header">${fromUser ? `You` : data.user.name}, ${dateFormatted}</div>
          <div class="message">${data.msg}</div>
      </div>
    `;
    chat.insertAdjacentHTML('beforeend', msgHTML);
  }
}

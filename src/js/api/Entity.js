import createRequest from './createRequest';

export default class Entity {
  constructor() {
    this.URL = 'https://ws-back-x93t.onrender.com/';
  }

  create(data, callback) {
    createRequest({
      url: this.URL + 'new-user/',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data,
      callback,
    });
  }
}

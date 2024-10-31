const createRequest = async (options) => {
  let { url, data, method, headers, callback } = options;

  if (options.method === 'POST') {
    const request = fetch(url, {
      method: method,
      headers: headers,
      body: JSON.stringify(data),
    });

    const result = await request;
    const json = await result.json();
    if (!result.ok) {
      callback(json.status, json);
      return;
    }

    const status = json.status;
    callback(status, json);
  }
};

export default createRequest;

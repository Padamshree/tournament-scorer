const addTokenToHeader = () => {
    let token = null;
    if (localStorage.fbToken) {
      token = localStorage.fbToken;
    }
    let header = new Headers();
    if (token) {
      header.authorization = token;
    }
    header = { ...header, 'Content-Type': 'application/json' };
    return header;
  }

const get = (url) => fetch(url, {
    headers: addTokenToHeader(),
    method: 'GET',
});

const post = (url, data) => fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: addTokenToHeader(),
});

const constructURL = (baseUrl, queryParams) => {
    let URL = baseUrl;
    const params = Object.keys(queryParams);
    let prefix = '?';
    let first = true;

    params.forEach((param) => {
      prefix = first ? '?' : '&';

      if (queryParams[param]) {
        first = false;
        URL = `${URL}${prefix}${param}=${queryParams[param]}`;
      }
    });
    return URL;
}

export {
    get,
    post,
    constructURL,
};
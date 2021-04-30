export const Api = {
  apiDomain: '',
  apiUrl: '',

  getAll: function (callBack, errorCallback) {
    return fetch(`${this.apiDomain}/${this.apiUrl}`)
      .then(res => res.json())
      .then(callBack)
      .catch(errorCallback);
  }
}
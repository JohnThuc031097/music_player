export const Api = {
  apiDomain: '',
  apiUrl: '',
  getSongs: function (callBack, errorCallback) {
    fetch(`${this.apiDomain}/${this.apiUrl}`)
      .then(res => res.json())
      .then(callBack)
      .catch(errorCallback);
  }
}

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const apiSongs = 'https://my-json-server.typicode.com/JohnThuc031097/api_music_player/songs';
/**
 * Format App
 * 1. Render Song
 */


class AppMusic {
  constructor(apiUrl, htmlSong) {
    this.apiUrl = apiUrl;
    this.htmlSong = htmlSong;
  }
  init() {
    console.log(this.apiUrl, this.htmlSong);
  }

  loadDataSongs() {
    let result = this.getSongs(this.renderSongs, (error) => {
      console.log(error);
    });
    console.log(result);
  }

  /**
   * @param {*} callBack function
   * @param {*} errorCallback function
   */
  getSongs(callBack, errorCallback) {
    fetch(this.apiUrl)
      .then(res => res.json())
      .then(callBack)
      .catch(errorCallback);
  }
  /**
   * @param {*} data 
   */
  renderSongs(data) {
    return this.setDataSongInHTML(this.htmlSong, data);
  }
  /**
   * @param {*} html 
   * @param {*} data
   * @returns {*} Strings html after replace
   */
  setDataSongInHTML(html, data) {
    let result = html;
    for (const key in data) {
      console.log(`{${key}}`, data[key]);
      result.replace(`{${key}}`, data[key]);
    }
    return result;
  }
};


let htmlSong =/*html*/`
      <li {id} class="col mb-3_5 wapper-playlist__music-item {isActive}">
        <div class="row">
          <div class="col mb wapper-playlist__music-item-img">
            <img class="wapper-playlist__music-item-img-src" src="{image}">
          </div>
          <div class="col mb-2_5 wapper-playlist__music-item-centent">
            <span class="wapper-playlist__music-item-content-name">{name}</span>
            <span class="wapper-playlist__music-item-content-singer">{singer}</span>
          </div>
          <div class="col mb-0_5 wapper-playlist__music-item-option">
            <span class="material-icons-outlined">
              more_horiz
            </span>
          </div>
        </div>
      </li>`;
const appMusic = new AppMusic(apiSongs, htmlSong);
appMusic.init();
appMusic.loadDataSongs();
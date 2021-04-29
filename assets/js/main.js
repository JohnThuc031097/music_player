
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const apiDomain = 'https://my-json-server.typicode.com/JohnThuc031097/api_music_player';
const apiAppSongs = 'songs';

const ePlayList = $('.wapper-playlist');

class AppMusic {
  constructor(apiDomain, apiUrl, htmlSong) {
    this.apiDomain = apiDomain;
    this.apiUrl = apiUrl;
    this.htmlSong = htmlSong;
  }
  init() {
  }

  loadDataSongs(ePlayList) {
    this.getSongs((data) => {
      console.log(data);
      ePlayList.innerHTML = this.renderSongs(data);
    }, (error) => {
      console.log('error:', error);
    });
  }

  /**
   * @param {*} callBack function
   * @param {*} errorCallback function
   */
  getSongs(callBack, errorCallback) {
    fetch(`${this.apiDomain}/${this.apiUrl}`)
      .then(res => res.json())
      .then(callBack)
      .catch(errorCallback);
  }
  /**
   * @param {*} data 
   */
  renderSongs(data) {
    return this.setDataSongInHTML(this.htmlSong, ...data);
  }
  /**
   * @param {*} html 
   * @param {*} data
   * @returns Strings html after replace
   */
  setDataSongInHTML(html, data) {
    for (const key in data) {
      html = html.replace(`{${key}}`, data[key]);
    }
    return html;
  }
};

const htmlSong =/*html*/`
      <li song-id="{id}" class="col mb-3_5 wapper-playlist__music-item {isActive}">
        <div class="row">
          <div class="col mb wapper-playlist__music-item-img">
            <img class="wapper-playlist__music-item-img-src" style="background-image: url('./assets/img/{image}');">
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
const appMusic = new AppMusic(apiDomain, apiAppSongs, htmlSong);
appMusic.init();
appMusic.loadDataSongs(ePlayList);
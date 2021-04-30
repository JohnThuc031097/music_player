import { Render } from "./render.js";
import { Api } from "./api.js";

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const apiDomain = 'http://localhost:3000';
const apiAppSongs = 'songs';

const eAudio = $('#audio-song');
const eNameSong = $('.heading__center-music-name');
const eImageCD = $('.wapper-audio__img-music');
const ePlayList = $('.wapper-playlist');
const eAudioDurationPercent = $('.wapper-audio__progress-bar-percent');
const eAudioDurationCircle = $('.wapper-audio__progress-bar-circle');
const eIndexSongCurrent = $('.display__count-current-song');
const eIndexSongTotal = $('.display__count-total-song');

const ePlayControl = $('.wapper-audio__control-music-play');
const ePauseControl = $('.wapper-audio__control-music-pause');

const htmlPlayList =/*html*/`
      <li song-id="{id}" class="col mb-3_5 wapper-playlist__music-item {isActive}">
        <div class="row">
          <div class="col mb wapper-playlist__music-item-img">
            <img class="wapper-playlist__music-item-img-src" style="background-image: url('{image}');">
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

const appMusic = {
  currentIndex: 0,
  listSong: undefined,

  init: async function () {
    Api.apiDomain = apiDomain;
    Api.apiUrl = apiAppSongs;
    this.listSong = await Api.getAll(data => data, error => {
      console.error('Fetch:', error);
    });
    this.defineProperties();
    // this.setDataAudio();
    this.renderPlayList();
    this.renderInfoSongCurrent();
    this.renderIndexSong();
    this.renderIndexSongTotal();
  },

  defineProperties: function () {
    Object.defineProperty(this, 'currentSong', {
      get: function () {
        return this.listSong[this.currentIndex];
      }
    });
  },

  setDataAudio: function () {
    eAudio.querySelector('source').src = this.currentSong.file;
  },

  renderInfoSongCurrent: function () {
    eNameSong.innerHTML = this.currentSong.name;
    eImageCD.firstElementChild.style.backgroundImage = `url('${this.currentSong.image}')`;
  },

  renderIndexSong: function () {
    eIndexSongCurrent.innerHTML = this.currentSong.id + 1;
  },

  renderIndexSongTotal: function () {
    eIndexSongTotal.innerHTML = this.listSong.length;
  },

  renderPlayList: function () {
    ePlayList.innerHTML = Render.renderHTML(htmlPlayList, this.listSong);
  },

  start: async function () {
    await this.init();
    handleEvents();
  }
};

const handleEvents = () => {
  let heightDefault = eImageCD.offsetHeight;
  let audio = new Audio(appMusic.currentSong.file);
  let audioType = 'audio/mp3';
  let audioDurationPercent = [88, 92];
  let audioDurationLimit = 0;

  ePlayControl.onclick = () => {
    if (audio.canPlayType(audioType) === 'probably') {
      ePlayControl.style.display = 'none';
      ePauseControl.style.display = 'block';
      audio.play();
    }
  };

  ePauseControl.onclick = () => {
    if (audio.canPlayType(audioType) === 'probably') {
      ePlayControl.style.display = 'block';
      ePauseControl.style.display = 'none';
      audio.pause();
    };
  };

  audio.ontimeupdate = () => {
    let timeCurrent = (Math.floor(audio.currentTime) / audioDurationLimit);
    eAudioDurationPercent.style.width = timeCurrent + '%';
    eAudioDurationCircle.style.left = 5 + timeCurrent + '%';
    console.log(Math.floor(audio.currentTime));
    console.log(eAudioDurationCircle.offsetLeft);
  }

  audio.onloadedmetadata = () => {
    audioDurationLimit = Math.floor(audio.duration) / audioDurationPercent[0];
  };

  document.onscroll = () => {
    let scrollY = window.scrollY || document.documentElement.scrollTop;
    let newHeight = heightDefault - scrollY;
    eImageCD.style.height = (newHeight < 0) ? 0 : newHeight + 'px';
    eImageCD.style.opacity = newHeight / heightDefault;
  };
};

appMusic.start();

// eAudio.play();
eAudio.pause();

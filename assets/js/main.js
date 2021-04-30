import { Render } from "./render.js";
import { Api } from "./api.js";

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const apiDomain = 'http://localhost:3000';
const apiAppSongs = 'songs';

const eImageCD = $('.wapper-audio__img-music');
const ePlayList = $('.wapper-playlist');
const eDisplayCount = $('.display__count-song');

const htmlPlayList =/*html*/`
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
const htmlTotalPlayList = /*html*/`
  <span class="display__count-current-song">{songIdCrr}</span>
  <span class="display__count-operator-song">/</span>
  <span class="display__count-total-song">{songTotal}</span>`;

const appMusic = {
  currentIndex: 0,
  listSong: undefined,

  defineProperties: function () {
    Object.defineProperty(this, 'currentSong', {
      get: function () {
        return this.listSong[this.currentIndex];
      }
    });
  },

  loadData: function () {
    Api.apiDomain = apiDomain;
    Api.apiUrl = apiAppSongs;
    Api.getAll(data => data, error => {
      console.error('getSongs:', error);
    })
      .then((data) => {
        this.listSong = data;
        console.log('listSong:', this.listSong);
      })
      .then(() => {
        this.defineProperties();
        console.log('currentSong:', this.currentSong);
      })
      .then(() => {
        this.renderData();
      })
  },

  renderData: function () {
    let songDisplay = {
      songIdCrr: 1,
      songTotal: this.listSong.length
    };
    console.log('songDisplay: ', songDisplay);
    ePlayList.innerHTML = Render.renderHTML(htmlPlayList, this.listSong);
    eDisplayCount.innerHTML = Render.renderHTML(htmlTotalPlayList, [songDisplay]);
  },

  start: function () {
    this.loadData();

    handleEvents.onScroll(eImageCD);
  }
};

const handleEvents = {
  onScroll: (e) => {
    let heightDefault = e.offsetHeight;
    document.onscroll = () => {
      let scrollY = window.scrollY || document.documentElement.scrollTop;
      let newHeight = heightDefault - scrollY;
      e.style.height = (newHeight < 0) ? 0 : newHeight + 'px';
      e.style.opacity = newHeight / heightDefault;
    }
  }
};

appMusic.start();

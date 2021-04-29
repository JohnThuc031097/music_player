import { Render } from "./render.js";
import { Api } from "./api.js";

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const apiDomain = 'http://localhost:3000';
const apiAppSongs = 'songs';

const ePlayList = $('.wapper-playlist');
const eDisplayCount = $('.display__count-song');

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
const htmlTotalSong = /*html*/`
  <span class="display__count-current-song">1</span>
  <span class="display__count-operator-song">/</span>
  <span class="display__count-total-song">{songTotal}</span>`;

const appMusic = {
  init: function (){
    Api.apiDomain = apiDomain;
    Api.apiUrl = apiAppSongs;
    Api.getSongs(data => {
      console.log('getSongs:', data);
      ePlayList.innerHTML = Render.renderSongs(htmlSong, data);
      eDisplayCount.innerHTML = Render.renderTotalSong(htmlTotalSong, data.length);
    }, error => {
      console.error('getSongs:', error);
    })
  }
}

appMusic.init();

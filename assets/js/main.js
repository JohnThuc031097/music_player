import { Render } from "./render.js";
import { Api } from "./api.js";

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const apiDomain = 'http://localhost:3000';
const apiAppSongs = 'songs';

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
  init: function () {
    Api.apiDomain = apiDomain;
    Api.apiUrl = apiAppSongs;
    Api.getAll(data => {    
      console.log(data);
      
      let songDisplay = {
        songIdCrr: 1,
        songTotal: data.length
      };
      console.log(songDisplay);

      ePlayList.innerHTML = Render.renderHTML(htmlPlayList, data);
      eDisplayCount.innerHTML = Render.renderHTML(htmlTotalPlayList, [songDisplay]);
    }, error => {
      console.error('getSongs:', error);
    });
  }
}

appMusic.init();

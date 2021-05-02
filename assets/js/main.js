import { Render } from "./render.js";
import { Api } from "./api.js";

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const apiDomain = 'http://localhost:3000';
const apiAppSongs = 'songs';

const eIndexSongCurrent = $('.display__count-current-song');
const eIndexSongTotal = $('.display__count-total-song');
const eNameSong = $('.heading__center-music-name');
const eImageCD = $('.wapper-audio__img-music');
const eAudioProgressRange = $('.wapper-audio__progress-bar-range');

const ePlayList = $('.wapper-playlist');
const eTimeSongMinute = $(".display__time-minute-song");
const eTimeSongMinuteDuration = $(".display__time-minute-duration-song");
const eTimeSongSecond = $(".display__time-second-song");
const eTimeSongSecondDuration = $(".display__time-second-duration-song");


const eReplayControl = $('.wapper-audio__control-music-replay');
const ePreviousControl = $('.wapper-audio__control-music-previous');
const ePlayControl = $('.wapper-audio__control-music-play');
const ePauseControl = $('.wapper-audio__control-music-pause');
const eNextControl = $('.wapper-audio__control-music-next');
const eRandomControl = $('.wapper-audio__control-music-random');

const htmlPlayList =/*html*/`
      <li song-id="{id}" class="col mb-3_5 wapper-playlist__music-item">
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
  hImageCD: eImageCD.offsetHeight,

  init: async function () {
    Api.apiDomain = apiDomain;
    Api.apiUrl = apiAppSongs;
    this.listSong = await Api.getAll(data => data, error => {
      console.error('Fetch:', error);
    });
    this.defineProperties();
    this.renderPlayList();
    this.renderInfoSongCurrent();
  },

  defineProperties: function () {
    Object.defineProperty(this, 'currentSong', {
      get: function () {
        return this.listSong[this.currentIndex];
      }
    });
  },

  renderInfoSongCurrent: function () {
    eNameSong.innerHTML = this.currentSong.name;
    eImageCD.firstElementChild.style.backgroundImage = `url('${this.currentSong.image}')`;
  },

  activeSongCurrent: function () {
    const ePlayListItemActived = $('.wapper-playlist__music-item.active');
    const ePlayListItems = $$('.wapper-playlist__music-item');

    ePlayListItemActived?.classList.remove('active');
    ePlayListItems?.forEach((item) => {
      if (Number(item.getAttribute('song-id')) === this.currentIndex) {
        item.classList.add('active');
        let newScroll = item.offsetTop;
        document.documentElement.scrollTop = (newScroll - eImageCD.offsetHeight);
      }
    });

    eIndexSongCurrent.innerHTML = this.currentSong.id + 1;
    eIndexSongTotal.innerHTML = this.listSong.length;
  },

  renderPlayList: function () {
    ePlayList.innerHTML = Render.renderHTML(htmlPlayList, this.listSong);
  },

  start: async function () {
    await this.init();
    handleEvents(this);
  }
};

const handleEvents = (app) => {
  let audio = new Audio(app.currentSong.file);
  let audioType = 'audio/mp3';
  let audioVolume = 0.5;
  let audioReplay = false;
  let audioRandom = false;

  eReplayControl.onclick = () => {
    audioReplay = !audioReplay;
    audio.loop = audioReplay;
    let eChildrenReplay = eReplayControl.firstElementChild;
    if (audioRandom) {
      audioRandom = false;
      eRandomControl.firstElementChild.style.color = 'var(--second-color)';
    }
    if (audioReplay) {
      eChildrenReplay.style.color = 'var(--primary-color)';
    } else {
      eChildrenReplay.style.color = 'var(--second-color)';
    }
  };

  ePreviousControl.onclick = () => {
    app.currentIndex--;
    if (app?.currentSong) {
      audio.src = app.currentSong.file;
      ePlayControl.onclick();
    } else {
      app.currentIndex++;
    }
  }

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

  eNextControl.onclick = () => {
    app.currentIndex++;
    if (app?.currentSong) {
      audio.src = app.currentSong.file;
      ePlayControl.onclick();
    } else {
      app.currentIndex--;
    }
  }

  eRandomControl.onclick = () => {
    audioRandom = !audioRandom;
    let eChildrenRandom = eRandomControl.firstElementChild;
    if (audioReplay) {
      audioReplay = false;
      audio.loop = audioReplay;
      eReplayControl.firstElementChild.style.color = 'var(--second-color)';
    }
    if (audioRandom) {
      eChildrenRandom.style.color = 'var(--primary-color)';
    } else {
      eChildrenRandom.style.color = 'var(--second-color)';
    }
  }

  audio.ontimeupdate = () => {
    let timeCalcCurrent = Math.floor(audio.currentTime / audio.duration * 100);
    eAudioProgressRange.value = timeCalcCurrent;
    eTimeSongSecond.innerHTML = formatTime(Math.floor(audio.currentTime) % 60);
    eTimeSongMinute.innerHTML = formatTime(Math.floor(audio.currentTime / 60));
    let rotateCurrent = Math.floor(audio.currentTime / audio.duration * 360);
    eImageCD.style.transform = `rotate(${rotateCurrent}deg)`;
    if (audio.currentTime === audio.duration) {
      ePlayControl.style.display = 'block';
      ePauseControl.style.display = 'none';
    }
  }

  audio.onloadedmetadata = () => {
    if (app?.currentSong) {
      console.log(app.currentSong);
      audio.volume = audioVolume;
      app.activeSongCurrent();
      eTimeSongSecondDuration.innerHTML = formatTime(Math.floor(audio.duration) % 60);
      eTimeSongMinuteDuration.innerHTML = formatTime(Math.floor(audio.duration / 60));
    }
  };

  eAudioProgressRange.oninput = () => {
    let valuePercentCrr = eAudioProgressRange.value;
    let valueNewTime = Math.floor((audio.duration / 100) * valuePercentCrr);
    audio.currentTime = valueNewTime;
    eAudioProgressRange.value = valuePercentCrr;
  };

  document.onscroll = () => {
    let scrollY = window.scrollY || document.documentElement.scrollTop;
    let newHeight = app.hImageCD - scrollY;
    eImageCD.style.height = (newHeight < 0) ? 0 : newHeight + 'px';
    eImageCD.style.opacity = newHeight / app.hImageCD;
  };

  function formatTime(value) {
    if (typeof value === 'number' && !Number.isNaN(value) && Number.isInteger(value)) {
      if (value < 10) return `0${value}`;
    };
    return value;
  }
};

appMusic.start();

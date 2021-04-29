export const Render = {

  renderPlayList: (htmlSong, data) => {
    return [...data].reduce((htmls, html) => {
      return htmls += Render.setDataSongInHTML(htmlSong, html);
    }, '');
  },

  renderTotalSong: (html, data) => {
    return Render.setTotalSongInHTML(html, data);
  },

  setDataSongInHTML: (html, data) => {
    for (const key in data) {
      html = html.replace(`{${key}}`, data[key]);
    }
    return html;
  },

  setTotalSongInHTML: (html, data) => {
    return html.replace('{songTotal}', data);
  }
};

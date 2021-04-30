export const Render = {

  renderHTML: (html, data) => {
    return [...data].reduce((result, value) => {
      return result += Render.setDataHTML(html, value);
    }, '');
  },

  setDataHTML: (html, data) => {
    for (const key in data) {
      html = html.replace(`{${key}}`, data[key]);
    }
    return html;
  },
};

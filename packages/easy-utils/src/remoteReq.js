export function tranformCover(cover) {
  return /(http|https):\/\/([\w.]+\/?)\S*/.test(cover) ? cover : window.appConfig?.ASSETS_URL + cover.toString();
}

export const getOptionsList = (server_api) => {
  return new Promise((resolve, reject) => {
    fetch(tranformCover(server_api))
      .then(
        (res) => {
          return res.json();
        },
        (err) => {
          reject(err);
        }
      )
      .then(
        (text) => {
          resolve(text);
        },
        (err) => {
          reject(err);
        }
      );
  });
};

export const resolve = (...paths) => {
  let resolvePath = '';
  for (let i = paths.length - 1; i > -1; i--) {
    let path = paths[i];
    if (!path) {
      continue;
    }
    resolvePath = path + '/' + resolvePath;
  }
  if(!/http(s)?:\/\//.test(resolvePath)){
      return resolvePath;
  }
  const { protocol } = resolvePath && new URL(resolvePath);
  const _protocol = `${protocol}//`;
  const [, otherUrl] = resolvePath.split(_protocol);

  return (
    _protocol +
    deepReplaceBack(otherUrl)
      .replace(/(?!^)\.\//g, '') // 去除 ./
      .replace(/\/+$/, '') // 去除末尾的/
      .replace(/(\/{2,})/g, '/')
  ); // 将多个/替换成一个/;
};

function deepReplaceBack(resolvePath) {
  if (/\w+\/+\.{2}\//.test(resolvePath)) {
    return deepReplaceBack(resolvePath.replace(/\w+\/+\.{2}\//g, '')); // a/b/../../c/d => c/d
  }
  return resolvePath;
}

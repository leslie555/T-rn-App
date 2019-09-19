const getQueryString = function(url,name) {
  const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  try{
    const r = url.split('?')[1].match(reg);
    if (r != null) return unescape(r[2]);
  }catch (e) {

  }
  return null;
}
export {
  getQueryString
}


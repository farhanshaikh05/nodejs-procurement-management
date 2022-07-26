
const isImageUrl = (url) => {
  return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
};

const getUrlExtension = (url) => {
  return url.split(/[#?]/)[0].split('.').pop().trim();
};

module.exports = {
  isImageUrl,
  getUrlExtension,
};

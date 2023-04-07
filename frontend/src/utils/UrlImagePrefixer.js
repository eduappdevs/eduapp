/**
 * Used to add a prefix to the url in case of the base url being different.
 *
 * @param {String} url The url to prefix.
 * @returns {String} prefixedUrl
 */
export default function getPrefixedImageURL(url){
  return `${process.env.REACT_APP_BACKEND}${url}`;
}
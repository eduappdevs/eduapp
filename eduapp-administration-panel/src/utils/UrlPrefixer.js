/**
 * Used to add a prefix to the url in case of the base url being different.
 *
 * @param {String} url The url to prefix.
 * @returns {String} prefixedUrl
 */
export default function prefixUrl(url) {
  if (process.env.NODE_ENV === "production")
    return `${process.env.REACT_APP_BASENAME}${url}`;
  else return url;
}

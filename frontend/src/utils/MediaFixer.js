/**
 * Fixer used to correctly fetch images.
 *
 * @param {String} media
 * @returns {String} correctUrl
 */
export default function MediaFix(media) {
  return media.replace(
    `http://localhost:${process.env.REACT_APP_PORT}`,
    process.env.REACT_APP_BACKEND_ENDPOINT
  );
}

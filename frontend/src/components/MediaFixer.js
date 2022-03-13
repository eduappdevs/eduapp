export default function MediaFix(media) {
  return media.replace(
    `http://localhost:3000`,
    process.env.REACT_APP_BACKEND_ENDPOINT
  );
}

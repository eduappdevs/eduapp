export default function MediaFix(media) {
  if (window.location.port === "") {
    return media.replace(
      process.env.REACT_APP_FRONTEND_DOMAIN,
      process.env.REACT_APP_BACKEND_DOMAIN
    );
  } else {
    return media.replace(
      `http://localhost:3000`,
      process.env.REACT_APP_BACKEND_ENDPOINT
    );
  }
}

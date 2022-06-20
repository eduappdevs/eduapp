export default function prefixUrl(url) {
  if (process.env.NODE_ENV === "production")
    return `${process.env.REACT_APP_BASENAME}${url}`;
  else return url;
}

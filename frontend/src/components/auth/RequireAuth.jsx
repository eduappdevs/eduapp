export default function RequireAuth() {
  return localStorage.userToken ? true : false;
}

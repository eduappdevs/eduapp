/* eslint-disable jsx-a11y/anchor-is-valid */
import MenuHeader from "./menuHeader/MenuHeader";
import * as AUTH_SERVICE from "../../services/auth.service";
import useLanguage from "../../hooks/useLanguage";
import useMobile from "../../hooks/useMobile";
import "./Menu.css";

export default function Menu({ desktopProfileClick, desktopSettingsClick, desktopCloseClick }) {
  const language = useLanguage();
  const mobile = useMobile();

  return (
    <div
      id="app-menu"
      className={mobile ? "profile-menu-mobile" : "profile-menu-desktop"}
      style={{ zIndex: 9999 }}
    >
      <MenuHeader
        backTo={() => {
          if (mobile) {
            window.location.href = localStorage.previousMenuPage;
            return;
          }

          desktopCloseClick();
        }}
        location={"MENU"}
      />
      <ul>
        <li>
          <a
            onClick={() => {
              mobile
                ? (window.location.href = "/menu/profile")
                : desktopProfileClick();
            }}
          >
            {language.menu_profile.toUpperCase()}
          </a>
        </li>
        <li>
          <a
            onClick={() => {
              mobile
                ? (window.location.href = "/menu/settings")
                : desktopSettingsClick();
            }}
          >
            {language.menu_settings.toUpperCase()}
          </a>
        </li>
        <li>
          <a onClick={AUTH_SERVICE.logout}>{language.logout.toUpperCase()}</a>
        </li>
      </ul>
    </div>
  );
}

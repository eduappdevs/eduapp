/**
 * Handles the theme of the app.
 */
const DarkModeChanger = (mode) => {
  if (parseInt(mode)) {
    localStorage.setItem("darkMode", "1");
    document.documentElement.style.setProperty(
      "--calendarColorLine",
      "#969696"
    );
    document.documentElement.style.setProperty("--calendarIcon", "invert(1)");
    document.documentElement.style.setProperty("--backgroundColor", "#202124");
    document.documentElement.style.setProperty("--shadowColor", "#3a3a3a00");
    document.documentElement.style.setProperty("--secondaryColor", "#404146");
    document.documentElement.style.setProperty("--textColor", "#ffff");
    document.documentElement.style.setProperty(
      "--headerBackground",
      "var(--backgroundColor)"
    );
    document.documentElement.style.setProperty(
      "--headerButtonBG",
      "var(--blue)"
    );
    document.documentElement.style.setProperty("--headerButtonFill", "white");
    document.getElementById("darkmode").classList.add("activeMode");
    document.getElementById("lightmode").classList.remove("activeMode");
  } else {
    localStorage.setItem("darkMode", "0");
    document.documentElement.style.setProperty(
      "--calendarColorLine",
      "#6d6d6d"
    );
    document.documentElement.style.setProperty("--calendarIcon", "invert(0)");
    document.documentElement.style.setProperty("--textColor", "#000");
    document.documentElement.style.setProperty("--backgroundColor", "#fff");
    document.documentElement.style.setProperty(
      "--shadowColor",
      "rgba(158, 158, 158, 0.411);"
    );
    document.documentElement.style.setProperty(
      "--secondaryColor",
      "rgba(158, 158, 158, 0.311);"
    );
    document.documentElement.style.setProperty(
      "--headerBackground",
      "var(--blue)"
    );
    document.documentElement.style.setProperty("--headerButtonBG", "white");
    document.documentElement.style.setProperty(
      "--headerButtonFill",
      "var(--blue)"
    );
    document.getElementById("darkmode").classList.remove("activeMode");
    document.getElementById("lightmode").classList.add("activeMode");
  }
};

export default DarkModeChanger;

import React from "react";
import MenuHeader from "../menuHeader/MenuHeader";
import "./MenuSettings.css";
export default function MenuSettings() {
  const closeMenuSettings = () => {
    console.log("close");
    document
      .getElementsByClassName("MenuSettings__main-container")[0]
      .classList.add("MenuSettings__hidden");
  };
  const changeModeTo = (mode)=>{
    switch(mode){
      case 'dark':
        document.documentElement.style.setProperty('--backgroundColor', '#202124');
        document.documentElement.style.setProperty('--shadowColor', '#3a3a3a00');
        document.documentElement.style.setProperty('--secondaryColor', '#404146');
        document.documentElement.style.setProperty('--textColor', '#ffff');
        document.documentElement.style.setProperty('--headerBackground', 'var(--backgroundColor)');
        document.documentElement.style.setProperty('--headerButtonBG', 'var(--blue)');
        document.documentElement.style.setProperty('--headerButtonFill', 'white');
        document.getElementById('darkmode').classList.add('activeMode')
        document.getElementById('lightmode').classList.remove('activeMode')
        break

      case 'light':
        document.documentElement.style.setProperty('--textColor', '#000');
        document.documentElement.style.setProperty('--backgroundColor', '#fff');
        document.documentElement.style.setProperty('--shadowColor', 'rgba(158, 158, 158, 0.411);');
        document.documentElement.style.setProperty('--secondaryColor', 'rgba(158, 158, 158, 0.311);');
        document.documentElement.style.setProperty('--headerBackground', 'var(--blue)');
        document.documentElement.style.setProperty('--headerButtonBG', 'white');
        document.documentElement.style.setProperty('--headerButtonFill', 'var(--blue)');
        document.getElementById('darkmode').classList.remove('activeMode')
        document.getElementById('lightmode').classList.add('activeMode')
        break
    }
  }
  return (
    <div className={"MenuSettings__main-container MenuSettings__hidden"}>
      <MenuHeader
        backTo={() => {
          closeMenuSettings();
        }}
        backToName={"Settings"}
      />

      <ul>
        <li>LANGUAGE</li>
        <li>
          <ul id={'darkModes'}>
          <li onClick={()=>{
            changeModeTo('light')
          }}
          
          className={'activeMode'}
          id={'lightmode'}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-brightness-high-fill" viewBox="0 0 16 16">
                <path d="M12 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z" />
              </svg>
              </li>
          <li onClick={()=>{
            changeModeTo('dark')
          }} id={'darkmode'} >
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-moon-fill" viewBox="0 0 16 16">
              <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"/>
            </svg>
            </li>
          
            </ul>
          </li>
      </ul>
    </div>
  );
}

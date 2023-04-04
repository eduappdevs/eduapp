/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect } from "react";
import * as AUTH_SERVICE from "../services/auth.service";
import { LanguageCtx } from "../hooks/LanguageContext";
import LANGUAGES from "../constants/languages";
import { availableLanguages, flagsLanguages } from "../hooks/useLanguage";

import "/node_modules/flag-icons/css/flag-icons.min.css";

export default function LanguageSwitcher() {
  const [language, setLanguage] = useContext(LanguageCtx);

  useEffect(() => {
    if (language.lang_identifier !== localStorage.getItem("eduapp_language")) {
      localStorage.setItem("eduapp_language", language.lang_identifier);
      setLanguage(LANGUAGES[localStorage.getItem("eduapp_language")]);
    }
  }, [language]);

  const selected_language = availableLanguages.find(
    (language) => {
      return language[0] === localStorage.eduapp_language
    }
  )

  const flag = flagsLanguages.find(
    (language) => {
      return language[0] === selected_language[0]
    }
  )

  const select_options = availableLanguages.map(([code, name]) => {
      if(code !== localStorage.eduapp_language){
        return (
          <option key={code} value={code}>
            {name}
          </option>
          )
      }else{
        return <></>
      }
    })
  return (
    <div className="languageSwitcher">
      {/* <div> */}
        <select
          onChange={(e) => {
            setLanguage(LANGUAGES[e.target.value])
          }}
        >
          {localStorage.eduapp_language !== undefined && (
            <>
              <option value={localStorage.eduapp_language} className={`fi ${flag[1]}`}>
                {selected_language[1]}
              </option>
              {
                select_options
              }
            </>
          )}
        </select>
      {/* </div> */}
      {/* <ul>
        <li onClick={() => setLanguage(LANGUAGES.es_es)}>
          <span
            className={
              language.lang_identifier === "es_es" ? "languageSelected" : ""
            }
          >
            <span class="fi fi-es"></span>
          </span>
        </li>
        <li onClick={() => setLanguage(LANGUAGES.da_dk)}>
          <span
            className={
              language.lang_identifier === "da_dk" ? "languageSelected" : ""
            }
          >
            <span className="fi fi-dk"></span>
          </span>
        </li>
        <li onClick={() => setLanguage(LANGUAGES.en_en)}>
          <span
            className={
              language.lang_identifier === "en_en" ? "languageSelected" : ""
            }
          >
            <span className="fi fi-gb"></span>
          </span>
        </li>
        <li onClick={() => setLanguage(LANGUAGES.pt_pt)}>
          <span
            className={
              language.lang_identifier === "pt_pt" ? "languageSelected" : ""
            }
          >
            <span class="fi fi-pt"></span>
          </span>
        </li>
        <li onClick={() => setLanguage(LANGUAGES.ro_ro)}>
          <span
            className={
              language.lang_identifier === "ro_ro" ? "languageSelected" : ""
            }
          >
            <span className="fi fi-ro"></span>
          </span>
        </li>
      </ul> */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        fill="currentColor"
        className="bi bi-box-arrow-right logout-icon has-pointer-events"
        viewBox="0 0 16 16"
        onClick={async () => await AUTH_SERVICE.logout()}
      >
        <path
          fillRule="evenodd"
          d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"
        />
        <path
          fillRule="evenodd"
          d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"
        />
      </svg>
    </div>
  );
}

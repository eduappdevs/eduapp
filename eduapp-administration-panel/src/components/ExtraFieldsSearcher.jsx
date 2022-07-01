/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { LanguageCtx } from "../hooks/LanguageContext";
import { SearchBarCtx } from "../hooks/SearchBarContext";
import StandardModal from "./modals/standard-modal/StandardModal";

export default function ExtraFieldsSearcher() {
  const [language] = useContext(LanguageCtx);
  const [searchParams, setSearchParams] = useContext(SearchBarCtx);

  const [extraFields, setExtraFields] = useState([["", ""]]);

  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (extraFields[extraFields.length - 1].length > 0) {
      if (extraFields[extraFields.length - 1][0].length > 0)
        setExtraFields([...extraFields, []]);
    }

    if (extraFields[extraFields.length - 2] !== undefined) {
      if (extraFields[extraFields.length - 2][0].length < 1) {
        let c = [...extraFields];
        c[extraFields.length - 2] = [];
        c.pop();
        setExtraFields(c);
      }
    }

    let c = { ...searchParams };
    c.extras = extraFields;
    setSearchParams(c);
  }, [extraFields]);

  return (
    <>
      <StandardModal
        customYes={language.search}
        customNo={language.cancel}
        text={"Custom fields"}
        show={showPopup}
        hasTransition
        hasIconAnimation
        type="info"
        isQuestion
        onYesAction={() => setShowPopup(false)}
        onNoAction={() => setShowPopup(false)}
        isModalExtraFields
        form={
          <>
            <ul className="filter_list">
              <li>
                <div className="filter_form">
                  <p>Field Name</p>
                  <p>Field Value</p>
                </div>
              </li>
              {extraFields.map((ef, i) => {
                return (
                  <li key={i}>
                    <div className="filter_form">
                      <input
                        type={"text"}
                        name={language.name}
                        value={ef[0] ? ef[0] : ""}
                        onChange={(e) => {
                          let c = [...extraFields];
                          c[i][0] = e.target.value;
                          setExtraFields(c);
                        }}
                        className="extended-input"
                      />
                      <input
                        type={"text"}
                        name={language.name}
                        value={ef[1] ? ef[1] : ""}
                        onChange={(e) => {
                          let c = [...extraFields];
                          c[i][1] = e.target.value;
                          setExtraFields(c);
                        }}
                        className="extended-input"
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </>
        }
      />
      <button
        onClick={() => setShowPopup(true)}
        className="extra_field_filter_button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="25"
          height="25"
          fill="currentColor"
          className="bi bi-card-list"
          viewBox="0 0 16 16"
        >
          <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h13zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z" />
          <path d="M5 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 5 8zm0-2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0 5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-1-5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zM4 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm0 2.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z" />
        </svg>
      </button>
    </>
  );
}

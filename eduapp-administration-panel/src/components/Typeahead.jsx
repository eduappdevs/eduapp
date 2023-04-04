import React, { Fragment, useContext, useEffect, useState } from "react";
import { LanguageCtx } from "../hooks/LanguageContext";

export default function Typeahead(props) {
    const [language] = useContext(LanguageCtx);
    const [filterText, setFilterText] = useState('');
    const [selectedValue, setSelectedValue] = useState('-');
    const [focus, setFocus] = useState(false);

    const select = (item) => {
        setSelectedValue(item.id);
        setFocus(false);
        setFilterText(item.name);
    }

    return (
      <div className="typeahead-container" onBlur={() => setTimeout(() => setFocus(false),100)}>
        <input type="hidden" id={props.fieldId} value={selectedValue} />
        <input
            type="text"
            placeholder={language.chooseUser}
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            onFocus={() => setFocus(true)}
        />
        {focus && filterText && (
            <div className="typeahead-list">
                {props.items
                .filter(item => item.name.includes(filterText))
                .slice(0, 10)
                .map(item => (
                    <div key={item.id} className="typeahead-list-item" onClick={() => select(item)}>{item.name}</div>
                ))}
            </div>
        )}
      </div>
    );
  }
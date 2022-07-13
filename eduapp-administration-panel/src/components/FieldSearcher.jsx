import { useContext, useEffect, useState } from "react";
import { LanguageCtx } from "../hooks/LanguageContext";
import { SearchBarCtx } from "../hooks/SearchBarContext";
import ExtraFieldsSearcher from "./ExtraFieldsSearcher";

/**
 * @param {Boolean} hasExtraFields Activates an extra button to filter with extra fields
 *
 * How to implement:
 * 1. Import at the top of the Component SearchBarCtx ([searchParams, setSearchParams])
 * 2. Import useFilter with searchParams with the corresponding parameters for local or remote filtering
 * 3. In an empty useEffect ([language]), empty the searchParams context (a)
 * 4. Finally In the main table render, add a few if statements to return empty if there is a filtered value and if the value does not match with the filter (b)
 *
 * - (a) Example:
 * - setSearchParams({
 *   query: "",
 *   fields: getCourseFields(lang),
 *   selectedField: getCourseFields(lang)[0][0],
 *   extras: [["", ""]]
 * });
 *
 * - (b) Example:
 * - if (filteredCourses !== null)
 * 		// Local Filtration
 *    if (
 *      filteredCourses.length > 0 &&
 *      !filteredCourses.includes(c)
 *    )
 *		// Remote Filtration
 *		if (
 *      filteredCourses.find((fc) => fc.id === c.id) === undefined
 *    )
 *      return <></>;
 */
export default function FieldSearcher({ hasExtraFields }) {
  const [searchParams, setSearchParams] = useContext(SearchBarCtx);
  const [language] = useContext(LanguageCtx);

  const [canOrder, setCanOrder] = useState(true);

  useEffect(() => {
    switch (searchParams.selectedField) {
      case "role":
      case "subject_name":
      case "event_author":
      case "course_name":
      case "user_email":
      case "teacher_name":
      case "author":
      case "chat_name":
      case "email":
        setCanOrder(false);
        break;
      default:
        setCanOrder(true);
        break;
    }
  }, [searchParams.selectedField]);

  return (
    <>
      <li className="searchbar-container">
        <span className="searchicon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-search"
            viewBox="0 0 16 16"
          >
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
          </svg>
        </span>

        <input
          type="text"
          className="searchbar_toolbar"
          autoComplete="off"
          placeholder={String(language.search)}
          onChange={(e) => {
            let c = { ...searchParams };
            c.query = e.target.value;
            setSearchParams(c);
          }}
        />
      </li>
      {searchParams.fields.length > 0 ? (
        <>
          <li className="subjectbar-container">
            <select
              className="subjectOption"
              onChange={(e) => {
                let c = { ...searchParams };
                c.selectedField = e.target.value;
                setSearchParams(c);
              }}
            >
              {searchParams.fields.map((f, i) => {
                return (
                  <option key={i} value={f[0]}>
                    {f[1]}
                  </option>
                );
              })}
            </select>
          </li>
          <li className="subjectbar-container">
            <select
              className="subjectOption"
              onChange={(e) => {
                let c = { ...searchParams };
                c.order = e.target.value;
                setSearchParams(c);
              }}
            >
              {canOrder ? (
                <>
                  <option value="asc">Order Filter by: Ascending</option>
                  <option value="desc">Order Filter by: Descending</option>
                </>
              ) : (
                <option value="--">Filter Order Not Supported</option>
              )}
            </select>
          </li>
        </>
      ) : null}
      {hasExtraFields ? <ExtraFieldsSearcher /> : null}
    </>
  );
}

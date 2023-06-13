import { availableLanguages } from "../hooks/useLanguage";

/**
 * A simple select dropdown that allows you to change the language with ease.
 */
export default function LanguageManager() {
  return (
    <div>
      <select
        onChange={(e) => {
          localStorage.setItem("eduapp_language", e.target.value);
          window.dispatchEvent(new Event("storage"));
        }}
      >
        {localStorage.eduapp_language !== undefined && (
          <>
            <option value={localStorage.eduapp_language}>
              {
                availableLanguages.find(
                  (l) => l[0] === localStorage.eduapp_language
                )[1]
              }
            </option>
            {availableLanguages.map(([code, name]) =>
              code !== localStorage.eduapp_language ? (
                <option key={code} value={code}>
                  {name}
                </option>
              ) : null
            )}
          </>
        )}
      </select>
    </div>
  );
}

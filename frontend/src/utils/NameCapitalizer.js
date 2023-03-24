/**
 * Capitalizes any string given to the function.
 *
 * @param {String} namestr
 * @returns {String} capitalizedName
 */
export default function NameCapitalizer(namestr) {
  if (namestr === null || namestr === undefined) return "";
  // Name "structure" - Name (Secondname) Surname Lastname
  let names = namestr.split(" ");

  for (let n = 0; n < names.length; n++) {
    names[n] = names[n].charAt(0).toUpperCase() + names[n].substr(1);
  }

  return names.join(" ");
}

export default function NameCapitalizer(namestr) {
  // Name "structure" - Name (Secondname) Surname Lastname
  let names = namestr.split(" ");

  for (let n = 0; n < names.length; n++) {
    names[n] = names[n].charAt(0).toUpperCase() + names[n].substr(1);
  }

  return names.join(" ");
}

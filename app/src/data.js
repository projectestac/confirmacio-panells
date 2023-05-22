

/* [
  "08000013",
  "ESC",
  "Centre públic Dep. i CEB",
  "Escola Francesc Platón i Sartí",
  "Abrera",
  "BLL",
  "BLL",
  true,
  20,0,0,0,0,20,20,20,
  "",
  0,0,0,
  "",
  0,0,
  "",
  true,
  "c10cb9cb"
] */

/* Codi	Tipus	Situació	Centre	Municipi	SSTT	SSTT NOU	Respon enquesta	Grups de matrícula oficials	Panells actuals del Departament	Panells 75" paret	Panells 75" rodes	Panells 65" parets	Panells 65" rodes	Total panells nous	Total panells centre		Suports regulables fixes	Suports regulables rodes	Total suports regulables		Aules susceptibles de millora	Millores d'aula		DEP/CEB	CLAU */

export function arrayToSchoolData(a){
  return {
    codi: a[0],
    tipus: a[1],
    situacio: a[2],
    centre: a[3],
    municipi: a[4],
    sstt: a[5],
    ssttNou: a[6],
    enquesta23: a[7],
    grupsMatricula: a[8],
    panellsDep: a[9],

  };
}
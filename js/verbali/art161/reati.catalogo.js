/* ==========================================================================
   MODULE: CATALOGO DELLE FATTISPECIE PENALI
   ==========================================================================
   Raccolta delle fattispecie del codice penale e delle leggi speciali che
   ricorrono con maggiore frequenza nell'attivit\u00e0 di polizia giudiziaria.
   Non \u00e8 l'intero codice: \u00e8 una selezione ragionata, ampliabile aggiungendo
   voci a questo elenco senza toccare altro.

   Ogni voce riporta:
     art    numero dell'articolo, nella forma che compare nel verbale
     fonte  codice o legge speciale di appartenenza
     titolo rubrica della norma
     descr  sintesi della condotta, formulata per essere inserita nel verbale
   ========================================================================== */

export const REATI = [
  // --- Delitti contro la persona ---
  { art: "575", fonte: "codice penale", titolo: "Omicidio", descr: "aver cagionato la morte di un uomo" },
  { art: "581", fonte: "codice penale", titolo: "Percosse", descr: "aver percosso taluno, cagionandogli una malattia nel corpo o nella mente" },
  { art: "582", fonte: "codice penale", titolo: "Lesione personale", descr: "aver cagionato ad altri una lesione personale dalla quale deriva una malattia nel corpo o nella mente" },
  { art: "590", fonte: "codice penale", titolo: "Lesioni personali colpose", descr: "aver cagionato per colpa ad altri una lesione personale" },
  { art: "594", fonte: "codice penale", titolo: "Ingiuria (depenalizzata)", descr: "aver offeso l'onore o il decoro di persona presente" },
  { art: "595", fonte: "codice penale", titolo: "Diffamazione", descr: "aver offeso, comunicando con pi\u00f9 persone, l'altrui reputazione" },
  { art: "605", fonte: "codice penale", titolo: "Sequestro di persona", descr: "aver privato taluno della libert\u00e0 personale" },
  { art: "610", fonte: "codice penale", titolo: "Violenza privata", descr: "aver costretto altri, con violenza o minaccia, a fare, tollerare od omettere qualche cosa" },
  { art: "612", fonte: "codice penale", titolo: "Minaccia", descr: "aver minacciato ad altri un ingiusto danno" },
  { art: "612 bis", fonte: "codice penale", titolo: "Atti persecutori", descr: "aver reiteratamente molestato o minacciato taluno, cagionandogli un perdurante stato di ansia o di paura" },
  { art: "614", fonte: "codice penale", titolo: "Violazione di domicilio", descr: "essersi introdotto nell'altrui abitazione contro la volont\u00e0 di chi ha il diritto di escluderlo" },
  { art: "572", fonte: "codice penale", titolo: "Maltrattamenti contro familiari e conviventi", descr: "aver maltrattato una persona della famiglia o comunque convivente" },
  { art: "600 ter", fonte: "codice penale", titolo: "Pornografia minorile", descr: "aver realizzato o diffuso materiale pornografico utilizzando minori degli anni diciotto" },
  { art: "609 bis", fonte: "codice penale", titolo: "Violenza sessuale", descr: "aver costretto taluno, con violenza o minaccia, a compiere o subire atti sessuali" },

  // --- Delitti contro il patrimonio ---
  { art: "624", fonte: "codice penale", titolo: "Furto", descr: "essersi impossessato della cosa mobile altrui, sottraendola a chi la detiene, al fine di trarne profitto per s\u00e9 o per altri" },
  { art: "624 bis", fonte: "codice penale", titolo: "Furto in abitazione e furto con strappo", descr: "essersi impossessato della cosa mobile altrui mediante introduzione in un edificio destinato in tutto o in parte a privata dimora" },
  { art: "625", fonte: "codice penale", titolo: "Circostanze aggravanti del furto", descr: "aver commesso il furto con violenza sulle cose, con destrezza o con altra delle circostanze aggravanti previste dalla norma" },
  { art: "628", fonte: "codice penale", titolo: "Rapina", descr: "essersi impossessato della cosa mobile altrui, sottraendola a chi la detiene, mediante violenza o minaccia alla persona" },
  { art: "629", fonte: "codice penale", titolo: "Estorsione", descr: "aver costretto taluno, con violenza o minaccia, a fare od omettere qualche cosa, procurandosi un ingiusto profitto con altrui danno" },
  { art: "635", fonte: "codice penale", titolo: "Danneggiamento", descr: "aver distrutto, disperso, deteriorato o reso in tutto o in parte inservibili cose mobili o immobili altrui" },
  { art: "640", fonte: "codice penale", titolo: "Truffa", descr: "aver indotto taluno in errore con artifizi o raggiri, procurandosi un ingiusto profitto con altrui danno" },
  { art: "646", fonte: "codice penale", titolo: "Appropriazione indebita", descr: "essersi appropriato di denaro o cosa mobile altrui di cui si aveva il possesso" },
  { art: "648", fonte: "codice penale", titolo: "Ricettazione", descr: "aver acquistato, ricevuto od occultato denaro o cose provenienti da un delitto, al fine di procurare a s\u00e9 o ad altri un profitto" },
  { art: "648 bis", fonte: "codice penale", titolo: "Riciclaggio", descr: "aver sostituito o trasferito denaro o beni provenienti da delitto, ostacolandone l'identificazione della provenienza" },

  // --- Delitti contro la pubblica amministrazione e la fede pubblica ---
  { art: "336", fonte: "codice penale", titolo: "Violenza o minaccia a un pubblico ufficiale", descr: "aver usato violenza o minaccia a un pubblico ufficiale per costringerlo a compiere un atto contrario ai propri doveri" },
  { art: "337", fonte: "codice penale", titolo: "Resistenza a un pubblico ufficiale", descr: "aver usato violenza o minaccia per opporsi a un pubblico ufficiale mentre compie un atto del proprio ufficio" },
  { art: "341 bis", fonte: "codice penale", titolo: "Oltraggio a pubblico ufficiale", descr: "aver offeso l'onore ed il prestigio di un pubblico ufficiale in luogo pubblico e in presenza di pi\u00f9 persone" },
  { art: "349", fonte: "codice penale", titolo: "Violazione di sigilli", descr: "aver violato i sigilli apposti per disposizione di legge o per ordine dell'Autorit\u00e0" },
  { art: "368", fonte: "codice penale", titolo: "Calunnia", descr: "aver incolpato taluno di un reato, pur sapendolo innocente" },
  { art: "378", fonte: "codice penale", titolo: "Favoreggiamento personale", descr: "aver aiutato taluno a eludere le investigazioni dell'Autorit\u00e0 dopo la commissione di un delitto" },
  { art: "385", fonte: "codice penale", titolo: "Evasione", descr: "essersi sottratto allo stato di detenzione o di custodia legalmente disposto" },
  { art: "477", fonte: "codice penale", titolo: "Falsit\u00e0 materiale in certificati o autorizzazioni", descr: "aver contraffatto o alterato certificati o autorizzazioni amministrative" },
  { art: "482", fonte: "codice penale", titolo: "Falsit\u00e0 materiale commessa dal privato", descr: "aver commesso falsit\u00e0 materiale in atto pubblico" },
  { art: "494", fonte: "codice penale", titolo: "Sostituzione di persona", descr: "aver sostituito illegittimamente la propria all'altrui persona, inducendo taluno in errore" },
  { art: "495", fonte: "codice penale", titolo: "False dichiarazioni sulla identit\u00e0", descr: "aver dichiarato o attestato falsamente al pubblico ufficiale la propria o altrui identit\u00e0 o qualit\u00e0 personali" },
  { art: "496", fonte: "codice penale", titolo: "False dichiarazioni sulla identit\u00e0 a pubblico ufficiale", descr: "aver reso al pubblico ufficiale false dichiarazioni sulla propria o altrui identit\u00e0" },

  // --- Contravvenzioni e armi ---
  { art: "650", fonte: "codice penale", titolo: "Inosservanza dei provvedimenti dell'Autorit\u00e0", descr: "non aver osservato un provvedimento legalmente dato dall'Autorit\u00e0 per ragioni di giustizia, sicurezza pubblica, ordine pubblico o igiene" },
  { art: "651", fonte: "codice penale", titolo: "Rifiuto di indicazioni sulla propria identit\u00e0", descr: "aver rifiutato di dare indicazioni sulla propria identit\u00e0 personale al pubblico ufficiale nell'esercizio delle sue funzioni" },
  { art: "697", fonte: "codice penale", titolo: "Detenzione abusiva di armi", descr: "aver detenuto armi o munizioni senza averne fatta denuncia all'Autorit\u00e0" },
  { art: "699", fonte: "codice penale", titolo: "Porto abusivo di armi", descr: "aver portato un'arma fuori della propria abitazione senza la prescritta licenza" },
  { art: "707", fonte: "codice penale", titolo: "Possesso ingiustificato di chiavi alterate o di grimaldelli", descr: "essere stato colto in possesso di chiavi alterate o di strumenti atti ad aprire o forzare serrature, senza giustificarne l'attuale destinazione" },
  { art: "4, commi 1 e 2, della Legge 18 aprile 1975, n. 110", fonte: "legge speciale", titolo: "Porto di armi od oggetti atti ad offendere", descr: "aver portato, fuori della propria abitazione o delle appartenenze di essa e senza giustificato motivo, armi od oggetti atti ad offendere" },

  // --- Stupefacenti, immigrazione, circolazione stradale ---
  { art: "73 del D.P.R. 9 ottobre 1990, n. 309", fonte: "legge speciale", titolo: "Produzione, traffico e detenzione illeciti di sostanze stupefacenti", descr: "aver illecitamente detenuto sostanza stupefacente al di fuori delle ipotesi di uso esclusivamente personale" },
  { art: "73, comma 5, del D.P.R. 9 ottobre 1990, n. 309", fonte: "legge speciale", titolo: "Fatto di lieve entit\u00e0 in materia di stupefacenti", descr: "aver illecitamente detenuto sostanza stupefacente in quantit\u00e0 e con modalit\u00e0 tali da configurare un fatto di lieve entit\u00e0" },
  { art: "10 bis del D.Lgs. 25 luglio 1998, n. 286", fonte: "legge speciale", titolo: "Ingresso e soggiorno illegale nel territorio dello Stato", descr: "aver fatto ingresso ovvero essersi trattenuto nel territorio dello Stato in violazione delle disposizioni sull'immigrazione" },
  { art: "186 del D.Lgs. 30 aprile 1992, n. 285", fonte: "legge speciale", titolo: "Guida sotto l'influenza dell'alcool", descr: "aver guidato in stato di ebbrezza in conseguenza dell'uso di bevande alcoliche" },
  { art: "187 del D.Lgs. 30 aprile 1992, n. 285", fonte: "legge speciale", titolo: "Guida in stato di alterazione da sostanze stupefacenti", descr: "aver guidato in stato di alterazione psico-fisica dopo aver assunto sostanze stupefacenti o psicotrope" },
  { art: "189 del D.Lgs. 30 aprile 1992, n. 285", fonte: "legge speciale", titolo: "Comportamento in caso di incidente stradale", descr: "essersi dato alla fuga ovvero aver omesso di prestare assistenza in caso di incidente comunque ricollegabile al proprio comportamento" },
  { art: "590 bis", fonte: "codice penale", titolo: "Lesioni personali stradali gravi o gravissime", descr: "aver cagionato per colpa, con violazione delle norme sulla circolazione stradale, lesioni personali gravi o gravissime" },
  { art: "589 bis", fonte: "codice penale", titolo: "Omicidio stradale", descr: "aver cagionato per colpa la morte di una persona con violazione delle norme sulla circolazione stradale" }
];

/**
 * Cerca fra le fattispecie: la stringa digitata viene confrontata con il
 * numero dell'articolo, con la rubrica e con la descrizione, ignorando
 * maiuscole, accenti e punteggiatura (cos\u00ec "624", "furto" o "cp 624"
 * conducono tutti allo stesso risultato).
 */
export function cercaReati(query, limite = 40){
  const norm = (s) => (s || "").toLowerCase().normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const q = norm(query);
  if(!q) return REATI.slice(0, limite);

  const parole = q.split(" ");
  return REATI.filter(r => {
    const testo = norm(`${r.art} ${r.fonte} ${r.titolo} ${r.descr}`);
    return parole.every(p => testo.includes(p));
  }).slice(0, limite);
}

/**
 * Testo da inserire nel verbale dopo "in ordine al reato di cui all'art.":
 * articolo, rubrica e sintesi della condotta.
 */
export function formattaReato(r){
  if(!r) return "";
  const articolo = /codice penale|legge|d\.?p\.?r\.?|d\.?lgs/i.test(r.art)
    ? r.art
    : `${r.art} del ${r.fonte}`;
  // Le descrizioni sono già formulate all'infinito ("aver percosso...",
  // "essersi impossessato..."), quindi basta la preposizione.
  return `${articolo} (${r.titolo}), per ${r.descr}`;
}

/* ==========================================================================
   MODULE: FATTISPECIE CONTESTABILI ALL'ESITO DELLA PERQUISIZIONE
   (art. 4 L. 22 maggio 1975, n. 152)
   ==========================================================================
   La perquisizione ex art. 4 L. 152/75 è finalizzata ad accertare la presenza
   di armi, esplosivi e strumenti di effrazione: se ha esito positivo, il
   soggetto viene iscritto per una delle fattispecie qui elencate.

   Il testo è formulato per inserirsi dopo "in ordine al reato di cui all'art."
   nel verbale ex art. 161 c.p.p., quindi non ripete la parola "articolo".
   ========================================================================== */

export const FATTISPECIE_PERQ_L152 = {
  art4_110:
    "4, commi 1 e 2, della Legge 18 aprile 1975, n. 110 (porto, fuori della propria abitazione o delle appartenenze di essa e senza giustificato motivo, di armi od oggetti atti ad offendere)",

  art699:
    "699 del codice penale (porto abusivo di armi)",

  art697:
    "697 del codice penale (detenzione abusiva di armi)",

  art699_art4:
    "699 del codice penale e 4, commi 1 e 2, della Legge 18 aprile 1975, n. 110 (porto abusivo di armi e porto, senza giustificato motivo, di oggetti atti ad offendere)",

  art707:
    "707 del codice penale (possesso ingiustificato di chiavi alterate o di grimaldelli)",

  art4_esplosivi:
    "4, comma 1, della Legge 18 aprile 1975, n. 110 (porto, fuori della propria abitazione o delle appartenenze di essa, di materie esplodenti)"
};

/**
 * Restituisce la fattispecie da contestare nel verbale ex art. 161 c.p.p.
 * redatto in coda alla perquisizione ex art. 4 L. 152/75: quella scelta
 * dall'elenco, oppure il testo libero se è stata indicata "altra fattispecie".
 */
export function getFattispeciePerqL152(){
  const tipo = document.getElementById("pl152_161_reato_tipo")?.value || "art4_110";
  if(tipo === "altro"){
    return (document.getElementById("pl152_161_reato")?.value || "").trim();
  }
  return FATTISPECIE_PERQ_L152[tipo] || "";
}

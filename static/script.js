// Data odierna formattata per l'input di tipo date
const currentDate = new Date().toISOString().split("T")[0];

let currentEl = null;
const TOT_LETTINI = 70;
let prenotazioniExtra = [];
let prenotatiElementi = 0;
let prenotatiExtra = 0;
let editingIndex = null;

const elementi = [
  { id: "ombrellone_1", xPerc: 2.5, yPerc: 37.5, tipo: "ombrellone", stato: "libero", numero: "1" },
  { id: "ombrellone_2", xPerc: 10.0, yPerc: 37.5, tipo: "ombrellone", stato: "libero", numero: "2" },
  { id: "ombrellone_3", xPerc: 17.5, yPerc: 37.5, tipo: "ombrellone", stato: "libero", numero: "3" },
  { id: "ombrellone_4", xPerc: 25.0, yPerc: 37.5, tipo: "ombrellone", stato: "libero", numero: "4" },
  { id: "ombrellone_5", xPerc: 32.5, yPerc: 37.5, tipo: "ombrellone", stato: "libero", numero: "5" },
  { id: "ombrellone_6", xPerc: 40.0, yPerc: 37.5, tipo: "ombrellone", stato: "libero", numero: "6" },
  { id: "ombrellone_7", xPerc: 47.5, yPerc: 37.5, tipo: "ombrellone", stato: "libero", numero: "7" },
  { id: "ombrellone_8", xPerc: 55.0, yPerc: 37.5, tipo: "ombrellone", stato: "libero", numero: "8" },
  { id: "ombrellone_9", xPerc: 62.5, yPerc: 37.5, tipo: "ombrellone", stato: "libero", numero: "9" },
  { id: "ombrellone_10", xPerc: 70.0, yPerc: 37.5, tipo: "ombrellone", stato: "libero", numero: "10" },
  { id: "ombrellone_11", xPerc: 77.5, yPerc: 37.5, tipo: "ombrellone", stato: "libero", numero: "11" },
  { id: "ombrellone_12", xPerc: 85.0, yPerc: 37.5, tipo: "ombrellone", stato: "libero", numero: "12" },
  { id: "ombrellone_13", xPerc: 92.5, yPerc: 37.5, tipo: "ombrellone", stato: "libero", numero: "13" },
  { id: "ombrellone_14", xPerc: 2.5, yPerc: 50.0, tipo: "ombrellone", stato: "libero", numero: "14" },
  { id: "ombrellone_15", xPerc: 10.0, yPerc: 50.0, tipo: "ombrellone", stato: "libero", numero: "15" },
  { id: "ombrellone_16", xPerc: 17.5, yPerc: 50.0, tipo: "ombrellone", stato: "libero", numero: "16" },
  { id: "ombrellone_17", xPerc: 25.0, yPerc: 50.0, tipo: "ombrellone", stato: "libero", numero: "17" },
  { id: "ombrellone_18", xPerc: 40.0, yPerc: 50.0, tipo: "ombrellone", stato: "libero", numero: "18" },
  { id: "ombrellone_19", xPerc: 47.5, yPerc: 50.0, tipo: "ombrellone", stato: "libero", numero: "19" },
  { id: "ombrellone_20", xPerc: 55.0, yPerc: 50.0, tipo: "ombrellone", stato: "libero", numero: "20" },
  { id: "ombrellone_21", xPerc: 62.5, yPerc: 50.0, tipo: "ombrellone", stato: "libero", numero: "21" },
  { id: "ombrellone_22", xPerc: 70.0, yPerc: 50.0, tipo: "ombrellone", stato: "libero", numero: "22" },
  { id: "ombrellone_23", xPerc: 77.5, yPerc: 50.0, tipo: "ombrellone", stato: "libero", numero: "23" },
  { id: "ombrellone_24", xPerc: 85.0, yPerc: 50.0, tipo: "ombrellone", stato: "libero", numero: "24" },
  { id: "ombrellone_25", xPerc: 92.5, yPerc: 50.0, tipo: "ombrellone", stato: "libero", numero: "25" },
  { id: "vela_1", xPerc: 2.5, yPerc: 87.0, tipo: "vela", stato: "libero", numero: "1" },
  { id: "vela_2", xPerc: 11.5, yPerc: 87.0, tipo: "vela", stato: "libero", numero: "2" },
  { id: "vela_3", xPerc: 20.5, yPerc: 87.0, tipo: "vela", stato: "libero", numero: "3" },
  { id: "vela_4", xPerc: 65.5, yPerc: 87.0, tipo: "vela", stato: "libero", numero: "4" },
  { id: "vela_5", xPerc: 74.5, yPerc: 87.0, tipo: "vela", stato: "libero", numero: "5" },
  { id: "vela_6", xPerc: 83.5, yPerc: 87.0, tipo: "vela", stato: "libero", numero: "6" },
  { id: "vela_7", xPerc: 92.5, yPerc: 87.0, tipo: "vela", stato: "libero", numero: "7" }
];

const hotspotContainer = document.getElementById("hotspots");

// Popola gli elementi sulla mappa
  function caricaElementi(data) {
    hotspotContainer.innerHTML = "";
    prenotatiElementi = 0;

    // reset default state before applying data for the new date
    elementi.forEach(el => {
      el.stato = "libero";
      el.nome = "";
      el.lettini = 0;
    });

    fetch(`dati/${data}.json`, { cache: "no-store" })
    .then(res => {
      if (!res.ok) throw new Error("File non trovato");
      return res.json();
    })
    .then(dati => {
      dati.forEach(d => {
        const el = elementi.find(e => e.id === d.id);
        if (el) {
          el.stato = d.stato;
          el.nome = d.nome;
          el.lettini = d.lettini || 0;
        }
      });
    })
    .catch(() => {
      console.error(`File dati/${data}.json non trovato`);
    })
    .finally(() => {
      elementi.forEach(el => {
        const div = document.createElement("div");
        div.className = "elemento";
        div.style.position = "absolute";
        div.style.left = el.xPerc + "%";
        div.style.top = el.yPerc + "%";
        div.id = el.id;

        const wrapper = document.createElement("div");
        wrapper.style.position = "relative";
        wrapper.style.width = "60px";
        wrapper.style.height = "60px";

        const img = document.createElement("img");
        img.src = getImgPath(el.tipo, el.stato);
        img.style.width = "60px";
        img.style.height = "60px";
        img.style.display = "block";
        wrapper.appendChild(img);

        const label = document.createElement("span");
        label.textContent = el.numero;
        label.className = "numero";
        label.style.position = "absolute";
        label.style.top = "0";
        label.style.left = "0";
        label.style.width = "100%";
        label.style.textAlign = "center";
        label.style.lineHeight = "60px";
        label.style.fontWeight = "bold";
        label.style.color = "black";
        label.style.pointerEvents = "none";
        wrapper.appendChild(label);

        const nome = document.createElement("span");
        nome.className = "nome";
        nome.textContent = el.nome || "";
        nome.style.position = "absolute";
        nome.style.top = "45px";
        nome.style.left = "0";
        nome.style.width = "100%";
        nome.style.textAlign = "center";
        nome.style.fontSize = "13px";
        nome.style.color = "black";
        nome.style.pointerEvents = "none";
        wrapper.appendChild(nome);

        div.appendChild(wrapper);

        div.dataset.tipo = el.tipo;
        div.dataset.stato = el.stato;
        div.dataset.nome = el.nome || "";
        div.dataset.lettini = el.lettini || 0;

        div.onclick = function () {
          currentEl = this;
          const dataSelezionata = document.getElementById("datePicker").value;
          document.getElementById("data-inizio").value = dataSelezionata;
          document.getElementById("data-fine").value = dataSelezionata;

          document.getElementById("popup").style.display = "flex";
          document.getElementById("select-stato").value = this.dataset.stato;
          document.getElementById("input-nome").value = this.dataset.nome || "";
          document.getElementById("select-lettini").value = this.dataset.lettini || 0;
        };

        hotspotContainer.appendChild(div);
        prenotatiElementi += el.lettini || 0;
      });
      updateDisponibilita();
    });
  }

function getImgPath(tipo, stato) {
  return `${tipo}_${stato}.png`;
}

function updateDisponibilita() {
  const disponibili = TOT_LETTINI - prenotatiElementi - prenotatiExtra;
  document.getElementById("lettini-disponibili").textContent = disponibili;
}

  function renderLettiniTable() {
    const tbody = document.querySelector("#tabella-lettini tbody");
    tbody.innerHTML = "";
    prenotatiExtra = 0;
    prenotazioniExtra.forEach((p, idx) => {
      const tr = document.createElement("tr");
      tr.dataset.index = idx;
      const tdN = document.createElement("td");
      tdN.textContent = p.nome;
      const tdL = document.createElement("td");
      tdL.textContent = p.lettini;
      tr.appendChild(tdN);
      tr.appendChild(tdL);
      tr.onclick = () => {
        editingIndex = idx;
        document.getElementById("lettini-nome").value = p.nome;
        document.getElementById("lettini-quantita").value = p.lettini;
        document.getElementById("popup-lettini").style.display = "flex";
      };
      tbody.appendChild(tr);
      prenotatiExtra += Number(p.lettini) || 0;
    });
    updateDisponibilita();
  }

  function caricaLettini(data) {
    prenotazioniExtra = [];
    fetch(`lettini/${data}.json`, { cache: "no-store" })
      .then(r => r.ok ? r.json() : [])
      .then(arr => {
        prenotazioniExtra = arr.filter(p => Number(p.lettini) > 0);
      })
      .catch(() => { prenotazioniExtra = []; })
      .finally(() => {
        renderLettiniTable();
      });
  }

function salvaPrenotazione(dataInizio, dataFine) {
  const nome = document.getElementById("input-nome").value;
  const stato = document.getElementById("select-stato").value;
  const lettini = parseInt(document.getElementById("select-lettini").value, 10);

  const inizio = new Date(dataInizio);
  const fine = new Date(dataFine);

  const aggiornamenti = {};

  for (let d = new Date(inizio); d <= fine; d.setDate(d.getDate() + 1)) {
    const dataStr = d.toISOString().split("T")[0];
    if (!aggiornamenti[dataStr]) aggiornamenti[dataStr] = [];
    aggiornamenti[dataStr].push({
      id: currentEl.id,
      stato,
      nome,
      lettini
    });
  }

  const richieste = Object.entries(aggiornamenti).map(([data, aggiornamenti]) =>
    fetch(`/dati/${data}.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(aggiornamenti)
    })
    .then(r => r.ok ? console.log(`Salvato ${data}`) : console.error(`Errore salvataggio ${data}`))
    .catch(err => console.error(`Errore rete salvataggio ${data}`, err))
  );

  Promise.all(richieste).finally(() => {
    document.getElementById("popup").style.display = "none";
    const data = document.getElementById("datePicker").value;
    caricaElementi(data);
    caricaLettini(data);
  });
}

// Listener per salvataggio
const btnSalva = document.getElementById("btn-salva");
btnSalva.onclick = () => {
  const dataInizio = document.getElementById("data-inizio").value;
  const dataFine = document.getElementById("data-fine").value;
  salvaPrenotazione(dataInizio, dataFine);
};

document.getElementById("popup-close").onclick = () => {
  document.getElementById("popup").style.display = "none";
};

const btnNuovoLettino = document.getElementById("btn-nuovo-lettino");
btnNuovoLettino.onclick = () => {
  editingIndex = null;
  document.getElementById("lettini-nome").value = "";
  document.getElementById("lettini-quantita").value = "1";
  document.getElementById("popup-lettini").style.display = "flex";
};

document.getElementById("lettini-popup-close").onclick = () => {
  document.getElementById("popup-lettini").style.display = "none";
  editingIndex = null;
};

document.getElementById("btn-salva-lettini").onclick = () => {
  const nome = document.getElementById("lettini-nome").value;
  const num = parseInt(document.getElementById("lettini-quantita").value, 10);
  const data = document.getElementById("datePicker").value;

  if (editingIndex !== null) {
    if (num === 0) {
      prenotazioniExtra.splice(editingIndex, 1);
    } else {
      prenotazioniExtra[editingIndex] = { nome, lettini: num };
    }
  } else {
    if (num > 0) {
      prenotazioniExtra.push({ nome, lettini: num });
    }
  }

  prenotazioniExtra = prenotazioniExtra.filter(p => Number(p.lettini) > 0);
  renderLettiniTable();

  fetch(`/lettini/${data}.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(prenotazioniExtra)
  }).finally(() => {
    document.getElementById("popup-lettini").style.display = "none";
    caricaLettini(data);
    editingIndex = null;
  });
};

// Cambio data
  document.getElementById("datePicker").addEventListener("change", function () {
   // localStorage.setItem("selectedDate", this.value);
    caricaElementi(this.value);
    caricaLettini(this.value);
  });

// Inizializzazione
  window.onload = () => {
    //const saved = localStorage.getItem("selectedDate");
    //const initDate = saved || currentDate;
    //document.getElementById("datePicker").value = initDate;
    //caricaElementi(initDate);
    document.getElementById("datePicker").value = currentDate;
    caricaElementi(currentDate);
    caricaLettini(currentDate);
  };


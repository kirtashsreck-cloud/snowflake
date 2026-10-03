/* ==========================================================
   COPO DE NIEVE — Planificador de novelas
   PARTE 1/2: constantes, estado, migración, navegación,
              pasos generales y personajes.
   Pega la PARTE 2 a continuación, en el mismo archivo.
   ========================================================== */

/* ----------------------------------------------------------
   1. CONSTANTES: pasos del método, categorías, ayudas, ejemplos
   ---------------------------------------------------------- */

const STEPS = [
  { id: 'publico', num: 0, title: 'Público objetivo y premisa', short: '0. Base',
    desc: 'Antes de empezar: define a quién va dirigida tu novela y cuál es la premisa, el tema y el crisol general de la historia.',
    type: 'publico'
  },
  { id: 'p1', num: 1, title: 'Resumen de una sola frase', short: '1. Una frase',
    desc: 'Una frase de menos de 25 palabras que resuma tu novela. Céntrate en 1-2 personajes y su objetivo. No reveles el final.',
    fields: [
      { key: 'frase', label: 'Resumen en una frase', type: 'textarea', ph: 'Una joven tiene el sueño poco realista de escribir una novela, pero teme que a los demás no les guste lo que escribe.' }
    ]
  },
  { id: 'p2', num: 2, title: 'Resumen de un párrafo', short: '2. Un párrafo',
    desc: 'Cinco frases: escenario + personajes, Acto 1, primera mitad Acto 2, segunda mitad Acto 2, Acto 3.',
    fields: [
      { key: 'frase1', label: '1. Escenario y personajes principales', type: 'textarea' },
      { key: 'frase2', label: '2. Acto 1 (culmina con el primer desastre)', type: 'textarea' },
      { key: 'frase3', label: '3. Primera mitad del Acto 2 (segundo desastre)', type: 'textarea' },
      { key: 'frase4', label: '4. Segunda mitad del Acto 2 (tercer desastre)', type: 'textarea' },
      { key: 'frase5', label: '5. Acto 3 (enfrentamiento final y desenlace)', type: 'textarea' }
    ]
  },
  { id: 'p3', num: 3, title: 'Hojas de personajes', short: '3. Personajes',
    desc: 'Ficha breve por personaje: rol, objetivo, ambición, valores, conflicto, epifanía y resúmenes.',
    type: 'characters', mode: 'short'
  },
  { id: 'p4', num: 4, title: 'Sinopsis breve (una página)', short: '4. Sinopsis breve',
    desc: 'Amplía tu párrafo a una página completa, desarrollando cada frase en un párrafo.',
    fields: [
      { key: 'sinopsis', label: 'Sinopsis de una página', type: 'textarea', rows: 12 }
    ]
  },
  { id: 'p5', num: 5, title: 'Sinopsis de personajes', short: '5. Sinopsis personajes',
    desc: 'Para cada personaje: su historia personal, qué desea y cómo encaja en la trama. Media página por personaje.',
    type: 'characters', mode: 'synopsis'
  },
  { id: 'p6', num: 6, title: 'Sinopsis larga (cuatro páginas)', short: '6. Sinopsis larga',
    desc: 'Amplía la sinopsis de una página a cuatro o cinco, desarrollando cada párrafo en una página.',
    fields: [
      { key: 'sinopsis', label: 'Sinopsis larga', type: 'textarea', rows: 20 }
    ]
  },
  { id: 'p7', num: 7, title: 'Biblia de personajes', short: '7. Biblia',
    desc: 'Ficha detallada por personaje: información física, personalidad, entorno y psicología.',
    type: 'characters', mode: 'bible'
  },
  { id: 'p8', num: 8, title: 'Plan de escenas', short: '8. Plan',
    desc: 'Zoom sobre cada escena: meta / conflicto / revés (proactiva) o reacción / dilema / decisión (reactiva). Verificador incluido.',
    type: 'scenes', mode: 'plan'
  },
  { id: 'p9', num: 9, title: 'Lista de escenas', short: '9. Lista',
    desc: 'Vista panorámica: todas las escenas en una tabla, con POV, tipo, estado y un resumen breve.',
    type: 'scenes', mode: 'list'
  },
  { id: 'p10', num: 10, title: 'Escribir la novela', short: '10. Escribir',
    desc: 'Ya tienes la estructura completa. Empieza a escribir.',
    type: 'final'
  }
];

const CHARACTER_CATEGORIES = [
  { id: 'protagonist', label: 'Protagonistas' },
  { id: 'main',        label: 'Principales' },
  { id: 'secondary',   label: 'Secundarios' },
  { id: 'other',       label: 'Otros' }
];

const FIELD_HELP = {
  /* Paso 0 */
  categoria: 'El género o categoría comercial de tu novela. Define a qué estantería pertenece y a qué lectores va dirigida.',
  tipo: 'El tipo concreto de historia dentro de la categoría. Cuanto más específico, mejor sabrás a quién le va a encantar.',
  porque: 'Razón por la que tu público objetivo disfrutará esta historia. Piensa en qué busca ese lector cuando compra un libro como el tuyo.',
  premisa: 'La situación inicial en una frase. Quién es el protagonista y qué se le presenta al principio de la historia. Es la chispa que enciende la trama.',
  tema: 'La idea central. De qué trata realmente la historia, más allá de la trama. La verdad humana que late debajo. Ej: "el precio de la ambición", "la búsqueda de identidad", "el perdón como liberación".',
  crisolGeneral: 'Todo lo que conspira para arruinar la vida del protagonista a lo largo de toda la novela. Combina el mundo de la historia, su trayectoria vital y las historias de los demás personajes. El crisol general es lo que hace que la historia merezca la pena leerse. Si no puedes decir cuál es el crisol general, la historia no tiene motor.',

  /* Pasos generales */
  frase: 'Menos de 25 palabras. Céntrate en uno o dos personajes y describe su objetivo en la historia. No reveles el final. Es una herramienta de marketing para despertar curiosidad.',
  frase1: 'Escenario y contexto. Presenta a uno o dos personajes principales. Dónde estamos, cuándo, quiénes.',
  frase2: 'Resume el Acto 1, que culmina con el primer desastre. Ese desastre obliga al protagonista a comprometerse con la historia.',
  frase3: 'Resume la primera mitad del Acto 2, culminando con el segundo desastre. Provoca que el protagonista cambie su forma de pensar.',
  frase4: 'Resume la segunda mitad del Acto 2, culminando con el tercer desastre. Provoca que el protagonista (y el villano) se comprometan a acabar con la historia.',
  frase5: 'Resume el Acto 3, con el enfrentamiento final y el desenlace. El protagonista triunfa o fracasa.',
  sinopsis: 'Amplía cada frase del párrafo a un párrafo completo. Aquí puedes desarrollar detalles, subtramas y matices sin perder la estructura.',

  /* Campos de personaje */
  rol: 'El papel que cumple en la historia: héroe, heroína, villano, mentor, compañero, aliado, etc.',
  objetivo: 'Lo que quiere conseguir en esta historia. Concreto, medible, alcanzable o no dentro de la trama.',
  ambicion: 'Lo que quiere en la vida, de forma abstracta. Suele ser más grande que el objetivo y da sentido a sus actos.',
  valores: 'Varias frases que empiezan con "Nada es más importante que...". Definen qué prioriza el personaje cuando tiene que elegir.',
  conflicto: 'Qué le impide alcanzar su objetivo. Puede ser externo, interno, o ambos.',
  epifania: 'Lo que aprende al final de la historia. No todos los personajes la tienen; el villano a menudo no.',
  resumen1: 'La historia personal de este personaje en una frase.',
  resumenP: 'La estructura en tres actos de la historia personal de este personaje, en un párrafo.',

  /* Campos de escena */
  title: 'Un título breve para identificar la escena internamente. No aparecerá en la novela.',
  pov: 'El personaje desde cuyo punto de vista se narra esta escena. Regla práctica: quien más tiene que perder en la escena suele ser un buen POV.',
  summary: 'Qué ocurre en la escena en una o dos frases. Es la vista panorámica, lo que anotarías en una lista de escenas.',
  crisol: 'La razón por la que el personaje no puede conseguir lo que desea en esta escena. Combina el mundo de la historia, los otros personajes y las limitaciones internas del POV. Dura exactamente lo que dura la escena. Si no puedes decir cuál es el crisol, la escena está rota.',
  meta: 'Lo que el POV quiere conseguir al final de la escena. Debe ser concreto y objetivo (que se pueda fotografiar), posible, difícil y coherente con sus valores y ambición. Cuanto antes se establezca en la escena, mejor.',
  reves: 'Una derrota para el protagonista de la historia (no necesariamente para el POV). Al final de la escena, el personaje queda peor que al principio. A veces puede ser una victoria, pero se busca el revés para empujar al lector a la siguiente página.',
  reaccion: 'Principalmente emocional. Muestra las emociones del POV, no las nombres. Debe ser coherente con su personalidad, sus valores y su ambición, y proporcional al revés que la provocó.',
  dilema: 'No emocional, sino intelectual. El personaje considera varios planes de acción, todos malos, y busca el menos malo. Puede mostrarse como razonamiento, como escucha de un consejo, o como acción física mientras su subconsciente trabaja.',
  decision: 'La resolución del dilema. No es buena, es la menos mala. Es fuerte cuando limita las opciones del oponente, cuando sirve como meta para una escena proactiva futura, cuando reconoce el riesgo, y cuando es un compromiso firme. No es decisión hasta que el personaje se compromete.',
  notes: 'Notas libres para ti: fragmentos de diálogo, imágenes, referencias, cosas a recordar al escribir la escena.',
  location: 'Lugar donde transcurre la escena. Opcional. Puede ser tan concreto o tan vago como quieras.',
  charactersInScene: 'Otros personajes que aparecen en la escena además del POV. Opcional.'
};

const SHORT_CHAR_FIELDS = [
  { key: 'rol',       label: 'Rol', type: 'text', ph: 'Héroe, villano, mentor, compañero...' },
  { key: 'objetivo',  label: 'Objetivo', type: 'textarea', ph: 'Lo que quiere conseguir en esta historia (concreto).' },
  { key: 'ambicion',  label: 'Ambición', type: 'textarea', ph: 'Lo que quiere en la vida (abstracto).' },
  { key: 'valores',   label: 'Valores', type: 'textarea', ph: '"Nada es más importante que..." (varias líneas)' },
  { key: 'conflicto', label: 'Conflicto', type: 'textarea', ph: '¿Qué le impide alcanzar su objetivo?' },
  { key: 'epifania',  label: 'Epifanía', type: 'textarea', ph: '¿Qué aprenderá al final?' },
  { key: 'resumen1',  label: 'Resumen en una frase', type: 'textarea' },
  { key: 'resumenP',  label: 'Resumen en un párrafo', type: 'textarea', rows: 4 }
];

const BIBLE_FIELDS = [
  { key: 'edad',       label: 'Edad', type: 'text' },
  { key: 'altura',     label: 'Altura', type: 'text' },
  { key: 'peso',       label: 'Peso', type: 'text' },
  { key: 'etnia',      label: 'Origen étnico', type: 'text' },
  { key: 'cabello',    label: 'Color de cabello', type: 'text' },
  { key: 'ojos',       label: 'Color de ojos', type: 'text' },
  { key: 'fisica',     label: 'Descripción física', type: 'textarea' },
  { key: 'vestir',     label: 'Estilo de vestir', type: 'text' },
  { key: 'humor',      label: 'Sentido del humor', type: 'text' },
  { key: 'personalidad', label: 'Tipo de personalidad', type: 'text' },
  { key: 'aficiones',  label: 'Aficiones', type: 'text' },
  { key: 'musica',     label: 'Música favorita', type: 'text' },
  { key: 'libros',     label: 'Libros favoritos', type: 'text' },
  { key: 'peliculas',  label: 'Películas favoritas', type: 'text' },
  { key: 'casa',       label: 'Descripción del hogar', type: 'textarea' },
  { key: 'educacion',  label: 'Formación académica', type: 'text' },
  { key: 'trabajo',    label: 'Experiencia laboral', type: 'textarea' },
  { key: 'familia',    label: 'Familia', type: 'textarea' },
  { key: 'amigos',     label: 'Amigos', type: 'textarea' },
  { key: 'enemigos',   label: 'Enemigos', type: 'textarea' },
  { key: 'mejorRecuerdo', label: 'Mejor recuerdo de la infancia', type: 'textarea' },
  { key: 'peorRecuerdo',  label: 'Peor recuerdo de la infancia', type: 'textarea' },
  { key: 'rasgoFuerte',   label: 'Rasgo de carácter más fuerte', type: 'text' },
  { key: 'rasgoDebil',    label: 'Rasgo de carácter más débil', type: 'text' },
  { key: 'paradoja',      label: 'Paradoja del personaje', type: 'text' },
  { key: 'esperanza',     label: 'Mayor esperanza', type: 'text' },
  { key: 'temor',         label: 'Mayor temor', type: 'text' },
  { key: 'filosofia',     label: 'Filosofía de vida', type: 'text' },
  { key: 'seVe',          label: 'Cómo se ve a sí mismo', type: 'textarea' },
  { key: 'loVen',         label: 'Cómo lo ven los demás', type: 'textarea' }
];

const SCENE_STATES = [
  { id: 'pending',  label: 'Pendiente',  color: 'var(--text-soft)' },
  { id: 'working',  label: 'En progreso', color: 'var(--warn)' },
  { id: 'written',  label: 'Escrita',     color: 'var(--accent)' },
  { id: 'done',     label: 'Completa',    color: 'var(--ok)' }
];

const EXAMPLES = {
  publico: 'Público objetivo\n\nCategoría: Parábola empresarial\n\nTipo: Un escritor de ficción quiere escribir una novela pero no sabe por dónde empezar.\n\nPúblico: Escritores de ficción que quieren aprender el método del copo de nieve.\n\n---\n\nPremisa: Una mujer joven que siempre quiso ser novelista asiste a una conferencia de escritura para aprender a planificar su primera novela, pero descubre que la única forma de avanzar es enfrentarse a sus propios miedos.\n\nTema: El valor de confiar en los propios instintos frente a la opinión de los demás.\n\nCrisol general: Ricitos de Oro quiere escribir una novela, pero todo conspira para impedírselo: su familia la convenció de que era "poco práctico", su falta de confianza la paraliza, los métodos de esquematización tradicionales no le funcionan, Cerdito la desanima cada vez que avanza, y su propio miedo a lo que piensen los demás la empuja a dudar de cada decisión.',
  p1: 'Una joven tiene el sueño poco realista de escribir una novela, pero teme que a los demás no les guste lo que escribe.',
  p2: 'Ricitos de Oro siempre había querido escribir una novela, pero toda su familia le decía que era "poco práctico", así que pospuso su sueño hasta que sus hijos empezaran el colegio. Empieza a asistir a clases en una conferencia de escritura, y Osito la invita a probar el Método Copo de Nieve, pero entonces el Lobo Feroz lo mata a sangre fría. Ricitos de Oro empieza a usar el Método Copo de Nieve, pero cuando crea un villano con el que el lector puede empatizar, Cerdito le dice que ha arruinado su historia. Va a comer con el Lobo Feroz y pronto se da cuenta de que es una persona maravillosa con una apariencia dura, y realmente quiere que sea su agente, pero entonces lo arrestan por el asesinato de Cerdito. Ricitos de Oro encuentra las pruebas de su inocencia, y el verdadero asesino intenta matarla, pero ella lo neutraliza con gas pimienta y el Lobo Feroz queda libre.',
  p3: 'Ricitos de Oro (protagonista): heroína/villana. Quiere escribir el primer borrador de su novela.\nOsito (principal): mentor. Quiere enseñar a Ricitos de Oro a planificar antes de escribir.\nEl Lobo Feroz (principal): agente. Quiere encontrar un nuevo novelista al que convertir en estrella.',
  p4: 'Ricitos de Oro pospone su sueño de escribir una novela hasta que sus hijos empiezan el colegio. Prueba varios métodos de esquematización sin éxito. Descubre el Método Copo de Nieve de Osito, pero cuando mejora a su villano, Cerdito la desanima. Almuerza con el Lobo Feroz, quien resulta ser encantador. Cerdito es asesinado y el Lobo Feroz arrestado. Ricitos de Oro encuentra las pruebas de su inocencia, Cerdito intenta matarla, ella lo neutraliza y el Lobo Feroz queda libre.',
  p5: 'Ricitos de Oro: joven de 30 años que dejó su carrera por la familia y ahora busca algo útil. Su miedo irracional a lo que piensen los demás le impide confiar en sí misma.\nEl Lobo Feroz: agente literario incriminado por asesinato a los 19 años. Lleva una reputación que no merece y busca un talento nuevo.\nCerdito: magnate que quiere comprar la fama literaria sin esfuerzo. Asesinó a sus hermanos y culpó al Lobo.',
  p6: 'Esta historia era demasiado corta como para necesitar una sinopsis larga. La sinopsis breve fue suficiente para crear la lista de escenas.',
  p7: 'Ricitos de Oro: 30 años, 1,65 m, rubia, ojos azules, personalidad "conductor afable". Le encanta leer y escribir thrillers. Casa de tres habitaciones en las afueras. Casada, dos hijos. Su peor recuerdo: perderse en el bosque de niña. Rasgo fuerte: inteligente y enérgica. Rasgo débil: le preocupa lo que piensen los demás.',
  p8: 'Escena 1 (Ricitos de Oro):\n- POV: Ricitos de Oro\n- Lugar: su casa, por la mañana\n- Objetivo: escribir su primer capítulo.\n- Conflicto: no sabe cómo empezar.\n- Revés: solo escribe una palabra.\n- Crisol: el miedo a empezar mal.\n\nEscena 2 (Ricitos de Oro, reactiva):\n- POV: Ricitos de Oro\n- Lugar: su casa\n- Reacción: llora.\n- Dilema: ¿cómo aprender a empezar?\n- Decisión: asistir a una conferencia.',
  p9: 'Vista panorámica de las 25 escenas del ejemplo:\n1. Ricitos se bloquea escribiendo.\n2. Clase con Papá Oso (esquema).\n3. Clase con Mamá Osa (orgánico).\n4. Descubre el Copo de Nieve.\n5. Conoce a Osito.\n6. Escribe su frase resumen.\n(... y así hasta 25.)',
  p10: 'Ricitos de Oro se sienta a escribir y las palabras fluyen. Sabe que puede terminar su novela.'
};

/* ----------------------------------------------------------
   2. ESTADO GLOBAL
   ---------------------------------------------------------- */

const DEFAULT_STATE = () => ({
  version: 1,
  title: 'Nueva historia',
  steps: {},
  characters: [],
  scenes: [],
  settings: {
    theme: 'system',
    font: 'Inter',
    accent: '#4a6e4a',
    bubble: 'tooltip',
    ficha: 'merged',
    mdExport: 'single'
  },
  ui: {
    currentStep: 'publico',
    fullView: false,
    readMode: false,
    openSceneId: null,
    openCharId: null,
    draggingSceneId: null,
    helpOpen: {},
    sidebarCollapsed: false,
    manualPov: {},
    expandedChars: {}
  },
  versions: []
});

let S = loadState();
let saveTimer = null;
let currentBubbleTarget = null;
let sceneRenderTimer = null;

/* ----------------------------------------------------------
   3. PERSISTENCIA Y MIGRACIÓN
   ---------------------------------------------------------- */

function migrateState(data) {
  if (Array.isArray(data.characters)) {
    data.characters.forEach(c => {
      if (!c.category) c.category = 'main';
    });
  }
  if (Array.isArray(data.scenes)) {
    data.scenes.forEach(sc => {
      if (typeof sc.pov === 'string' && sc.pov.trim() && !sc.povName) {
        sc.povName = sc.pov;
      }
      if (!('povId' in sc)) sc.povId = '';
      if (!('povName' in sc)) sc.povName = '';
      if (!Array.isArray(sc.charactersInScene)) sc.charactersInScene = [];
      if (!('location' in sc)) sc.location = '';
      delete sc.pov;
    });
  }
  return data;
}

function loadState() {
  try {
    const raw = localStorage.getItem('copoNieve.state');
    if (raw) {
      const parsed = migrateState(JSON.parse(raw));
      return Object.assign(DEFAULT_STATE(), parsed, {
        settings: Object.assign(DEFAULT_STATE().settings, parsed.settings || {}),
        ui: Object.assign(DEFAULT_STATE().ui, parsed.ui || {})
      });
    }
  } catch (e) { console.warn('No se pudo cargar estado', e); }
  return DEFAULT_STATE();
}

function autosave() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    localStorage.setItem('copoNieve.state', JSON.stringify(S));
  }, 400);
}

function saveSnapshot(label) {
  const snap = {
    ts: Date.now(),
    label: label || ('Versión ' + new Date().toLocaleString()),
    data: JSON.parse(JSON.stringify({ ...S, versions: [] }))
  };
  S.versions.unshift(snap);
  if (S.versions.length > 15) S.versions = S.versions.slice(0, 15);
  autosave();
}

function markDirty() { autosave(); updateFileStatus(); }

function updateFileStatus() {
  const el = document.getElementById('fileStatus');
  if (!el) return;
  el.textContent = S.title || 'Nueva historia';
}

/* ----------------------------------------------------------
   4. NAVEGACIÓN
   ---------------------------------------------------------- */

function renderSidebar() {
  const nav = document.getElementById('stepNav');
  nav.innerHTML = '';
  const section = document.createElement('div');
  section.className = 'nav-section';
  section.textContent = 'Pasos del copo';
  nav.appendChild(section);

  STEPS.forEach(st => {
    const btn = document.createElement('button');
    btn.className = 'nav-item' + (S.ui.currentStep === st.id && !S.ui.fullView ? ' active' : '');
    const done = isStepComplete(st);
    btn.innerHTML = `
      <span class="step-num">${st.num === 0 ? '·' : st.num}</span>
      <span class="step-label">${st.short}</span>
      <span class="step-check">${done ? '✓' : ''}</span>`;
    btn.onclick = () => goToStep(st.id);
    nav.appendChild(btn);
  });

  if (S.ui.fullView) {
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  }
}

function isStepComplete(st) {
  if (st.type === 'characters') return S.characters.length > 0;
  if (st.type === 'scenes') return S.scenes.length > 0;
  if (st.type === 'final') return false;
  if (st.type === 'publico') {
    const d = S.steps[st.id] || {};
    return !!(d.categoria && d.premisa && d.crisolGeneral);
  }
  const data = S.steps[st.id] || {};
  return st.fields.every(f => (data[f.key] || '').trim().length > 0);
}

function goToStep(id) {
  S.ui.currentStep = id;
  S.ui.fullView = false;
  autosave();
  render();
  document.getElementById('content').scrollTop = 0;
}

function toggleFullView() {
  S.ui.fullView = !S.ui.fullView;
  autosave();
  render();
}

function toggleReadMode() {
  S.ui.readMode = !S.ui.readMode;
  document.body.classList.toggle('read-mode', S.ui.readMode);
  autosave();
}

function applySidebarState() {
  const sb = document.getElementById('sidebar');
  if (!sb) return;
  sb.classList.toggle('collapsed', S.ui.sidebarCollapsed);
  const btn = document.getElementById('btnSidebarToggle');
  if (btn) btn.textContent = S.ui.sidebarCollapsed ? '⟩' : '⟨';
}

/* ----------------------------------------------------------
   5. RENDER PRINCIPAL
   ---------------------------------------------------------- */

function render() {
  renderSidebar();
  const content = document.getElementById('content');
  content.classList.toggle('full-view', S.ui.fullView);
  if (S.ui.fullView) {
    renderFullView(content);
  } else {
    const st = STEPS.find(x => x.id === S.ui.currentStep) || STEPS[0];
    content.innerHTML = '';
    content.appendChild(renderStepPage(st));
  }
  renderBubble();
  document.getElementById('btnViewToggle').textContent = S.ui.fullView ? '📄 Vista guiada' : '📖 Vista completa';
  document.getElementById('btnReadMode').classList.toggle('btn-primary', S.ui.readMode);
}

function renderFullView(content) {
  content.innerHTML = '';
  const toc = document.createElement('div');
  toc.className = 'full-toc';
  STEPS.forEach(st => {
    const a = document.createElement('a');
    a.href = '#' + st.id;
    a.textContent = st.short;
    toc.appendChild(a);
  });
  content.appendChild(toc);
  STEPS.forEach(st => {
    const wrap = document.createElement('div');
    wrap.id = st.id;
    wrap.appendChild(renderStepPage(st, true));
    content.appendChild(wrap);
  });
}

/* ----------------------------------------------------------
   6. RENDER DE PASOS
   ---------------------------------------------------------- */

function renderStepPage(st, inFullView) {
  const page = document.createElement('div');
  page.className = 'step-page';

  const head = document.createElement('div');
  head.className = 'step-head';
  head.innerHTML = `
    <div class="step-eyebrow">${st.num === 0 ? 'Antes de empezar' : 'Paso ' + st.num}</div>
    <h2>${st.title}</h2>
    <p>${st.desc}</p>`;
  page.appendChild(head);

  if (st.type === 'publico') {
    page.appendChild(renderPublicoSection());
  } else if (st.type === 'characters') {
    page.appendChild(renderCharactersSection(st.mode));
  } else if (st.type === 'scenes') {
    page.appendChild(renderScenesSection(st.mode));
  } else if (st.type === 'final') {
    page.appendChild(renderFinalStep());
  } else {
    page.appendChild(renderFieldsCard(st));
  }

  if (!inFullView) {
    const footer = document.createElement('div');
    footer.className = 'step-footer';
    const prev = STEPS[STEPS.indexOf(st) - 1];
    const next = STEPS[STEPS.indexOf(st) + 1];
    footer.innerHTML = `
      <button class="btn btn-ghost" ${!prev ? 'disabled' : ''} id="btnPrev">← ${prev ? prev.short : ''}</button>
      <button class="btn btn-primary" ${!next ? 'disabled' : ''} id="btnNext">${next ? next.short : ''} →</button>`;
    page.appendChild(footer);
    setTimeout(() => {
      const p = footer.querySelector('#btnPrev');
      const n = footer.querySelector('#btnNext');
      if (p && prev) p.onclick = () => goToStep(prev.id);
      if (n && next) n.onclick = () => goToStep(next.id);
    }, 0);
  }
  return page;
}

/* Helper común: bloque de campo con label, "?" y texto de ayuda */
function fieldBlock({ label, key, value, inputHtml, stepIdForHelp }) {
  const wrap = document.createElement('div');
  wrap.className = 'field';

  const helpId = `${stepIdForHelp || 'field'}__${key}`;
  const isOpen = !!S.ui.helpOpen[helpId];
  const help = FIELD_HELP[key];

  wrap.innerHTML = `
    <div style="display:flex;align-items:center;gap:6px;margin-bottom:5px">
      <label style="margin:0;flex:1">${escapeHtml(label)}</label>
      ${help ? `<button class="field-help-btn" data-help-id="${helpId}" title="¿Qué se espera aquí?" style="background:none;border:1px solid var(--border);border-radius:50%;width:20px;height:20px;font-size:.7rem;line-height:1;cursor:pointer;color:var(--text-soft)">?</button>` : ''}
    </div>
    ${inputHtml}
    ${help ? `<div class="field-help-text" data-help-text="${helpId}" style="display:${isOpen ? 'block' : 'none'};font-size:.78rem;color:var(--text-soft);background:var(--bg-soft);padding:8px 10px;border-radius:6px;margin-top:6px;line-height:1.5;border-left:3px solid var(--accent)">${escapeHtml(help)}</div>` : ''}
  `;

  setTimeout(() => {
    const btn = wrap.querySelector(`[data-help-id="${helpId}"]`);
    if (btn) {
      btn.onclick = (e) => {
        e.preventDefault();
        S.ui.helpOpen[helpId] = !S.ui.helpOpen[helpId];
        autosave();
        const txt = wrap.querySelector(`[data-help-text="${helpId}"]`);
        if (txt) txt.style.display = S.ui.helpOpen[helpId] ? 'block' : 'none';
      };
    }
  }, 0);

  return wrap;
}

/* ---------- Paso 0: público objetivo y premisa (dos cards) ---------- */

function renderPublicoSection() {
  const wrap = document.createElement('div');
  const data = S.steps.publico || {};

  // Card 1: Público objetivo
  const card1 = document.createElement('div');
  card1.className = 'card';
  const h1 = document.createElement('div');
  h1.className = 'card-title';
  h1.textContent = '🎯 Público objetivo';
  card1.appendChild(h1);
  const hint1 = document.createElement('div');
  hint1.className = 'card-hint';
  hint1.textContent = 'A quién va dirigida tu novela y por qué le va a encantar.';
  card1.appendChild(hint1);

  [
    { key: 'categoria', label: 'Mi categoría es', type: 'text', ph: 'Ej: thriller, fantasía épica, romance contemporáneo...' },
    { key: 'tipo',      label: 'Este es el tipo de historia que quiero escribir', type: 'textarea', ph: 'Ej: un thriller psicológico con una protagonista poco fiable...' },
    { key: 'porque',    label: 'Este tipo de historia encantará a mi público objetivo porque', type: 'textarea', ph: 'Ej: buscan tensión creciente, giros inesperados y dilemas morales...' }
  ].forEach(f => {
    const val = data[f.key] || '';
    const inputHtml = f.type === 'textarea'
      ? `<textarea data-step="publico" data-key="${f.key}" rows="3" placeholder="${escapeHtml(f.ph || '')}">${escapeHtml(val)}</textarea>`
      : `<input type="text" data-step="publico" data-key="${f.key}" value="${escapeHtml(val)}" placeholder="${escapeHtml(f.ph || '')}">`;
    card1.appendChild(fieldBlock({
      label: f.label, key: f.key, value: val, inputHtml, stepIdForHelp: 'publico'
    }));
  });

  const exBtn1 = document.createElement('button');
  exBtn1.className = 'btn btn-ghost btn-sm';
  exBtn1.textContent = '💡 Ver ejemplo';
  exBtn1.style.marginTop = '8px';
  exBtn1.onclick = () => showBubbleFor('publico');
  card1.appendChild(exBtn1);

  // Card 2: Premisa, tema y crisol general
  const card2 = document.createElement('div');
  card2.className = 'card';
  const h2 = document.createElement('div');
  h2.className = 'card-title';
  h2.textContent = '🔥 Premisa, tema y crisol general';
  card2.appendChild(h2);
  const hint2 = document.createElement('div');
  hint2.className = 'card-hint';
  hint2.textContent = 'De qué va la historia, qué trata realmente y qué la obstaculiza.';
  card2.appendChild(hint2);

  [
    { key: 'premisa',       label: 'Premisa (situación inicial)',  type: 'textarea', rows: 3, ph: 'Ej: Una mujer que siempre quiso ser novelista asiste a una conferencia para aprender a escribir, pero descubre que su verdadero obstáculo es ella misma.' },
    { key: 'tema',          label: 'Tema (idea central)',          type: 'textarea', rows: 3, ph: 'Ej: el valor de confiar en los propios instintos frente a la opinión de los demás.' },
    { key: 'crisolGeneral', label: 'Crisol general de la historia', type: 'textarea', rows: 4, ph: 'Todo lo que conspira para arruinar la vida del protagonista a lo largo de la novela.' }
  ].forEach(f => {
    const val = data[f.key] || '';
    const inputHtml = `<textarea data-step="publico" data-key="${f.key}" rows="${f.rows || 3}" placeholder="${escapeHtml(f.ph || '')}">${escapeHtml(val)}</textarea>`;
    card2.appendChild(fieldBlock({
      label: f.label, key: f.key, value: val, inputHtml, stepIdForHelp: 'publico'
    }));
  });

  wrap.appendChild(card1);
  wrap.appendChild(card2);

  // Listener común para los dos cards
  wrap.addEventListener('input', e => {
    const el = e.target;
    if (el.dataset.step !== 'publico') return;
    if (!S.steps.publico) S.steps.publico = {};
    S.steps.publico[el.dataset.key] = el.value;
    markDirty();
    if (!S.ui.fullView) renderSidebar();
  });

  return wrap;
}

/* ---------- Pasos generales (1, 2, 4, 6) ---------- */

function renderFieldsCard(st) {
  const card = document.createElement('div');
  card.className = 'card';
  const data = S.steps[st.id] || {};

  st.fields.forEach(f => {
    const val = data[f.key] || '';
    const inputHtml = f.type === 'textarea'
      ? `<textarea data-step="${st.id}" data-key="${f.key}" rows="${f.rows || 4}" placeholder="${escapeHtml(f.ph || '')}">${escapeHtml(val)}</textarea>`
      : `<input type="text" data-step="${st.id}" data-key="${f.key}" value="${escapeHtml(val)}" placeholder="${escapeHtml(f.ph || '')}">`;
    card.appendChild(fieldBlock({
      label: f.label, key: f.key, value: val, inputHtml, stepIdForHelp: st.id
    }));
  });

  card.addEventListener('input', e => {
    const el = e.target;
    if (!el.dataset.step) return;
    if (!S.steps[el.dataset.step]) S.steps[el.dataset.step] = {};
    S.steps[el.dataset.step][el.dataset.key] = el.value;
    markDirty();
    if (!S.ui.fullView) renderSidebar();
  });

  const exBtn = document.createElement('button');
  exBtn.className = 'btn btn-ghost btn-sm';
  exBtn.textContent = '💡 Ver ejemplo';
  exBtn.style.marginTop = '8px';
  exBtn.onclick = () => showBubbleFor(st.id);
  card.appendChild(exBtn);

  return card;
}

/* ----------------------------------------------------------
   7. PERSONAJES
   ---------------------------------------------------------- */

function renderCharactersSection(mode) {
  const wrap = document.createElement('div');

  // Botón global "+ Añadir personaje"
  const topBar = document.createElement('div');
  topBar.style.marginBottom = '16px';
  topBar.innerHTML = `<button class="btn btn-primary btn-sm" id="addCharGlobalBtn">+ Añadir personaje</button>`;
  wrap.appendChild(topBar);
  setTimeout(() => {
    const btn = document.getElementById('addCharGlobalBtn');
    if (btn) btn.onclick = () => addCharacter('main');
  }, 0);

  // Grupos por categoría
  const groupsWrap = document.createElement('div');
  CHARACTER_CATEGORIES.forEach(cat => {
    const list = S.characters.filter(c => (c.category || 'main') === cat.id);
    const group = document.createElement('div');
    group.className = 'char-group';

    const header = document.createElement('div');
    header.className = 'char-group-header';
    header.innerHTML = `
      <span class="char-group-label">${cat.label} (${list.length})</span>
      <button class="char-group-add" data-cat="${cat.id}">+ añadir</button>`;
    group.appendChild(header);

    const tabs = document.createElement('div');
    tabs.className = 'char-group-tabs';
    list.forEach(c => {
      const isActive = c.id === S.ui.openCharId;
      const isExpanded = !!S.ui.expandedChars[c.id];

      const tab = document.createElement('button');
      tab.className = 'char-tab' + (isActive ? ' active' : '');
      tab.style.display = 'inline-flex';
      tab.style.alignItems = 'center';
      tab.style.gap = '6px';
      tab.innerHTML = `
        <span class="char-tab-label" data-char-open="${c.id}">${escapeHtml(c.name || 'Sin nombre')}</span>
        <span class="char-tab-toggle" data-char-toggle="${c.id}" title="Desplegar ficha" style="opacity:.7;padding:0 2px">${isExpanded ? '▴' : '▾'}</span>`;
      tabs.appendChild(tab);

      // Bloque desplegable inline
      if (isExpanded) {
        const panel = document.createElement('div');
        panel.className = 'char-inline-panel';
        panel.setAttribute('data-char-panel', c.id);

        // Campos compactos
        const compactFields = [
          { key: 'rol',       label: 'Rol' },
          { key: 'objetivo',  label: 'Objetivo' },
          { key: 'conflicto', label: 'Conflicto' },
          { key: 'valores',   label: 'Valores' }
        ];
        let fieldsHtml = '';
        compactFields.forEach(f => {
          const val = c.short[f.key] || '';
          fieldsHtml += `
            <div class="field" style="margin-bottom:10px">
              <label style="font-size:.72rem">${f.label}</label>
              <textarea data-char="${c.id}" data-field="${f.key}" rows="2" style="font-size:.82rem">${escapeHtml(val)}</textarea>
            </div>
          `;
        });

        panel.innerHTML = `
          <div style="font-size:.72rem;color:var(--text-soft);text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">
            Ficha rápida · ${escapeHtml(c.name || 'Sin nombre')}
          </div>
          ${fieldsHtml}
          <div style="display:flex;gap:6px;justify-content:flex-end">
            <button class="btn btn-ghost btn-sm" data-char-open-full="${c.id}">Abrir ficha completa</button>
          </div>
        `;
        tabs.appendChild(panel);
      }
    });
    if (list.length === 0) {
      const empty = document.createElement('span');
      empty.style.fontSize = '.75rem';
      empty.style.color = 'var(--text-soft)';
      empty.style.fontStyle = 'italic';
      empty.textContent = 'Sin personajes en esta categoría.';
      tabs.appendChild(empty);
    }
    group.appendChild(tabs);
    groupsWrap.appendChild(group);
  });
  wrap.appendChild(groupsWrap);

  // Listeners para los botones "+" de cada grupo
  setTimeout(() => {
    groupsWrap.querySelectorAll('.char-group-add').forEach(btn => {
      btn.onclick = () => addCharacter(btn.dataset.cat);
    });

    // Click en el nombre del personaje → cambiar activo
    groupsWrap.querySelectorAll('[data-char-open]').forEach(el => {
      el.onclick = (e) => {
        e.stopPropagation();
        S.ui.openCharId = el.dataset.charOpen;
        autosave();
        render();
      };
    });

    // Click en el toggle ▾ / ▴ → desplegar ficha inline
    groupsWrap.querySelectorAll('[data-char-toggle]').forEach(el => {
      el.onclick = (e) => {
        e.stopPropagation();
        const id = el.dataset.charToggle;
        S.ui.expandedChars[id] = !S.ui.expandedChars[id];
        autosave();
        render();
      };
    });

    // Click en "Abrir ficha completa" → cambia activo
    groupsWrap.querySelectorAll('[data-char-open-full]').forEach(el => {
      el.onclick = (e) => {
        e.stopPropagation();
        S.ui.openCharId = el.dataset.charOpenFull;
        autosave();
        render();
      };
    });

    // Edición de los campos inline
    groupsWrap.querySelectorAll('[data-char-panel]').forEach(panel => {
      panel.addEventListener('input', (e) => {
        const el = e.target;
        const id = el.dataset.char;
        const key = el.dataset.field;
        if (!id || !key) return;
        const c = S.characters.find(x => x.id === id);
        if (!c) return;
        c.short[key] = el.value;
        markDirty();
      });
    });
  }, 0);

  // Ficha del personaje activo (la que ya existía)
  const current = S.characters.find(c => c.id === S.ui.openCharId) || S.characters[0];
  if (!current) {
    const empty = document.createElement('div');
    empty.className = 'card';
    empty.innerHTML = `<p class="card-hint">Aún no hay personajes. Pulsa "Añadir personaje" para empezar.</p>`;
    wrap.appendChild(empty);
    return wrap;
  }

  const card = document.createElement('div');
  card.className = 'card';

  const headRow = document.createElement('div');
  headRow.style.display = 'grid';
  headRow.style.gridTemplateColumns = '2fr 1fr';
  headRow.style.gap = '12px';
  headRow.style.marginBottom = '14px';
  headRow.innerHTML = `
    <div class="field" style="margin:0">
      <label>Nombre</label>
      <input type="text" value="${escapeHtml(current.name)}" data-char="${current.id}" data-field="name">
    </div>
    <div class="field" style="margin:0">
      <label>Categoría</label>
      <select data-char="${current.id}" data-field="category">
        ${CHARACTER_CATEGORIES.map(cat =>
          `<option value="${cat.id}" ${(current.category || 'main') === cat.id ? 'selected' : ''}>${cat.label}</option>`
        ).join('')}
      </select>
    </div>
  `;
  card.appendChild(headRow);

  const fields = [];
  if (mode === 'short' || S.settings.ficha === 'merged') fields.push(...SHORT_CHAR_FIELDS);
  if (mode === 'bible' || S.settings.ficha === 'merged') fields.push(...BIBLE_FIELDS);
  if (mode === 'synopsis') {
    fields.push({ key: 'synopsis', label: 'Sinopsis del personaje', type: 'textarea', rows: 8 });
  }

  fields.forEach(f => {
    const val = (current.short[f.key] || current.bible[f.key] || current[f.key] || '');
    const inputHtml = f.type === 'textarea'
      ? `<textarea data-char="${current.id}" data-field="${f.key}" rows="${f.rows || 3}">${escapeHtml(val)}</textarea>`
      : `<input type="text" data-char="${current.id}" data-field="${f.key}" value="${escapeHtml(val)}">`;
    card.appendChild(fieldBlock({
      label: f.label, key: f.key, value: val, inputHtml, stepIdForHelp: 'char_' + current.id
    }));
  });

  const del = document.createElement('button');
  del.className = 'btn btn-danger btn-sm';
  del.textContent = '🗑 Eliminar personaje';
  del.style.marginTop = '12px';
  del.onclick = () => {
    if (!confirm(`¿Eliminar a "${current.name}"? Se quitará también de todas las escenas donde aparezca.`)) return;
    S.characters = S.characters.filter(c => c.id !== current.id);
    S.scenes.forEach(sc => {
      if (sc.povId === current.id) { sc.povId = ''; }
      sc.charactersInScene = (sc.charactersInScene || []).filter(id => id !== current.id);
    });
    S.ui.openCharId = null;
    markDirty();
    render();
  };
  card.appendChild(del);

  card.addEventListener('input', e => {
    const el = e.target;
    const id = el.dataset.char;
    const key = el.dataset.field;
    if (!id || !key) return;
    const c = S.characters.find(x => x.id === id);
    if (!c) return;
    if (key === 'name') c.name = el.value;
    else if (key === 'synopsis') c.synopsis = el.value;
    else if (SHORT_CHAR_FIELDS.some(f => f.key === key)) c.short[key] = el.value;
    else c.bible[key] = el.value;
    markDirty();
    if (key === 'name') renderSidebar();
  });

  card.addEventListener('change', e => {
    const el = e.target;
    const id = el.dataset.char;
    const key = el.dataset.field;
    if (key === 'category' && id) {
      const c = S.characters.find(x => x.id === id);
      if (c) { c.category = el.value; markDirty(); render(); }
    }
  });

  wrap.appendChild(card);
  return wrap;
}

function addCharacter(category) {
  const c = { id: uid(), name: 'Nuevo personaje', category: category || 'main', short: {}, synopsis: '', bible: {} };
  S.characters.push(c);
  S.ui.openCharId = c.id;
  markDirty();
  render();
}

/* ==========================================================
   FIN DE LA PARTE 1/2 — A CONTINUACIÓN, PARTE 2/2
   (escenas, exportación, modales, versiones, ajustes,
    utilidades, eventos y arranque)
   ========================================================== */

   /* ==========================================================
   COPO DE NIEVE — Planificador de novelas
   PARTE 2/2: escenas, exportación, modales, versiones,
              ajustes, utilidades, eventos y arranque.
   Pega esta parte justo debajo de la PARTE 1/2.
   ========================================================== */

/* ----------------------------------------------------------
   8. ESCENAS
   ---------------------------------------------------------- */

function renderScenesSection(mode) {
  const wrap = document.createElement('div');
  wrap.dataset.sceneMode = mode;

  const bar = document.createElement('div');
  bar.className = 'scene-toolbar';

  if (mode === 'list') {
    bar.innerHTML = `
      <button class="btn btn-primary btn-sm" id="addSceneBtn">+ Añadir escena</button>
      <span class="spacer"></span>
      <span class="badge">${S.scenes.length} escena(s)</span>`;
  } else {
    bar.innerHTML = `
      <button class="btn btn-primary btn-sm" id="addSceneBtn">+ Añadir escena</button>
      <span class="spacer"></span>
      <span class="badge">${S.scenes.length} escena(s)</span>
      <span class="badge">Arrastra ⋮⋮ para reordenar</span>`;
  }
  wrap.appendChild(bar);

  setTimeout(() => {
    const addBtn = document.getElementById('addSceneBtn');
    if (addBtn) addBtn.onclick = () => addScene(mode);
  }, 0);

  if (S.scenes.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'card';
    empty.innerHTML = `<p class="card-hint">Aún no hay escenas. Añade la primera para empezar.</p>`;
    wrap.appendChild(empty);
    return wrap;
  }

  if (mode === 'list') {
    wrap.appendChild(renderSceneTable());
  } else {
    const list = document.createElement('div');
    list.className = 'scene-list';
    S.scenes.forEach((sc, i) => list.appendChild(renderSceneItem(sc, i)));
    wrap.appendChild(list);
  }

  return wrap;
}

function renderSceneTable() {
  const wrap = document.createElement('div');
  wrap.className = 'scene-table-wrap';
  const table = document.createElement('table');
  table.className = 'scene-table';
  table.innerHTML = `
    <thead><tr>
      <th>#</th><th>Título</th><th>POV</th><th>Tipo</th><th>Estado</th><th>Resumen</th>
    </tr></thead>`;
  const tb = document.createElement('tbody');
  S.scenes.forEach((sc, i) => {
    const type = effectiveSceneType(sc);
    const state = SCENE_STATES.find(s => s.id === sc.state) || SCENE_STATES[0];
    const povLabel = resolvePovName(sc) || '—';
    const tr = document.createElement('tr');
    tr.style.cursor = 'pointer';
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${escapeHtml(sc.title || '—')}</td>
      <td>${escapeHtml(povLabel)}</td>
      <td><span class="scene-tag ${type}">${typeLabel(type)}</span></td>
      <td><span class="badge" style="color:${state.color}">${state.label}</span></td>
      <td class="wrap">${escapeHtml((sc.summary || '').slice(0, 120))}${(sc.summary || '').length > 120 ? '…' : ''}</td>`;
    tr.onclick = () => {
      S.ui.openSceneId = sc.id;
      S.ui.currentStep = 'p8';
      autosave();
      render();
      document.getElementById('content').scrollTop = 0;
    };
    tb.appendChild(tr);
  });
  table.appendChild(tb);
  wrap.appendChild(table);

  const hint = document.createElement('p');
  hint.className = 'card-hint';
  hint.style.marginTop = '12px';
  hint.textContent = 'Pulsa cualquier fila para abrir esa escena en el Plan de escenas (paso 8).';
  wrap.appendChild(hint);

  return wrap;
}

function effectiveSceneType(sc) {
  if (sc.type === 'proactive' || sc.type === 'reactive') return sc.type;
  const hasPro = !!((sc.meta || '').trim() || (sc.conflicto || '').trim() || (sc.reves || '').trim());
  const hasRea = !!((sc.reaccion || '').trim() || (sc.dilema || '').trim() || (sc.decision || '').trim());
  if (hasPro && !hasRea) return 'proactive';
  if (hasRea && !hasPro) return 'reactive';
  return 'undefined';
}

function typeLabel(t) {
  if (t === 'proactive') return 'Proactiva';
  if (t === 'reactive') return 'Reactiva';
  return 'Sin definir';
}

function resolvePovName(sc) {
  if (sc.povId) {
    const c = S.characters.find(x => x.id === sc.povId);
    if (c) return c.name;
  }
  return sc.povName || '';
}

function renderSceneItem(sc, index) {
  const item = document.createElement('div');
  item.className = 'scene-item' + (S.ui.openSceneId === sc.id ? ' open' : '');
  item.dataset.sceneId = sc.id;
  item.draggable = true;

  const state = SCENE_STATES.find(s => s.id === sc.state) || SCENE_STATES[0];
  const type = effectiveSceneType(sc);
  const povLabel = resolvePovName(sc) || 'Sin POV';

  const summary = document.createElement('div');
  summary.className = 'scene-summary';
  summary.innerHTML = `
    <span class="drag-handle" title="Arrastrar para reordenar" style="cursor:grab;opacity:.5;user-select:none;padding:0 4px;">⋮⋮</span>
    <span class="scene-num">${index + 1}</span>
    <span class="scene-title ${sc.title ? '' : 'empty'}">${escapeHtml(sc.title || 'Sin título')}</span>
    <span class="badge" style="font-size:.7rem">${escapeHtml(povLabel)}</span>
    <span class="scene-tag ${type}">${typeLabel(type)}</span>
    <select class="state-select editable-hide" data-scene-state="${sc.id}">
      ${SCENE_STATES.map(s => `<option value="${s.id}" ${s.id === sc.state ? 'selected' : ''}>${s.label}</option>`).join('')}
    </select>
    <span class="scene-toggle">${S.ui.openSceneId === sc.id ? '▲' : '▼'}</span>`;

  summary.onclick = e => {
    if (e.target.closest('.state-select')) return;
    if (e.target.closest('.drag-handle')) return;
    S.ui.openSceneId = S.ui.openSceneId === sc.id ? null : sc.id;
    autosave();
    render();
  };

  item.addEventListener('dragstart', e => {
    S.ui.draggingSceneId = sc.id;
    item.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    try { e.dataTransfer.setData('text/plain', sc.id); } catch (_) {}
  });
  item.addEventListener('dragend', () => {
    S.ui.draggingSceneId = null;
    item.classList.remove('dragging');
    document.querySelectorAll('.scene-item.drop-above, .scene-item.drop-below')
      .forEach(el => el.classList.remove('drop-above', 'drop-below'));
  });
  item.addEventListener('dragover', e => {
    if (!S.ui.draggingSceneId || S.ui.draggingSceneId === sc.id) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const rect = item.getBoundingClientRect();
    const midpoint = rect.top + rect.height / 2;
    item.classList.toggle('drop-above', e.clientY < midpoint);
    item.classList.toggle('drop-below', e.clientY >= midpoint);
  });
  item.addEventListener('dragleave', () => {
    item.classList.remove('drop-above', 'drop-below');
  });
  item.addEventListener('drop', e => {
    e.preventDefault();
    const fromId = S.ui.draggingSceneId;
    if (!fromId || fromId === sc.id) return;
    const rect = item.getBoundingClientRect();
    const midpoint = rect.top + rect.height / 2;
    const placeBefore = e.clientY < midpoint;
    reorderScene(fromId, sc.id, placeBefore);
    item.classList.remove('drop-above', 'drop-below');
  });

  const body = document.createElement('div');
  body.className = 'scene-body';

  const gridTop = document.createElement('div');
  gridTop.className = 'grid-2';
  gridTop.style.marginTop = '12px';
  gridTop.appendChild(sceneField('Título', 'text', 'title', sc));
  gridTop.appendChild(sceneField('Lugar', 'text', 'location', sc));
  body.appendChild(gridTop);

  body.appendChild(renderPovBlock(sc));
  body.appendChild(sceneField('Resumen', 'textarea', 'summary', sc, 3));
  body.appendChild(sceneField('Crisol de escena', 'textarea', 'crisol', sc, 2));

  const typeField = document.createElement('div');
  typeField.className = 'field';
  typeField.innerHTML = `
    <div style="display:flex;align-items:center;gap:6px;margin-bottom:5px">
      <label style="margin:0;flex:1">Tipo de escena</label>
    </div>
    <select data-scene="${sc.id}" data-field="type">
      <option value="" ${!sc.type ? 'selected' : ''}>Auto (${typeLabel(type)})</option>
      <option value="proactive" ${sc.type === 'proactive' ? 'selected' : ''}>Proactiva</option>
      <option value="reactive" ${sc.type === 'reactive' ? 'selected' : ''}>Reactiva</option>
    </select>`;
  body.appendChild(typeField);

  const shown = sc.type === 'proactive' || sc.type === 'reactive'
    ? sc.type
    : (type === 'undefined' ? 'proactive' : type);

  if (shown === 'reactive') {
    body.appendChild(sceneField('Reacción', 'textarea', 'reaccion', sc, 2));
    body.appendChild(sceneField('Dilema', 'textarea', 'dilema', sc, 2));
    body.appendChild(sceneField('Decisión', 'textarea', 'decision', sc, 2));
  } else {
    body.appendChild(sceneField('Meta', 'textarea', 'meta', sc, 2));
    body.appendChild(sceneField('Conflicto', 'textarea', 'conflicto', sc, 2));
    body.appendChild(sceneField('Revés / Victoria', 'textarea', 'reves', sc, 2));
  }

  body.appendChild(renderCharactersInSceneBlock(sc));
  body.appendChild(sceneField('Notas', 'textarea', 'notes', sc, 2));
  body.appendChild(renderVerifier(sc));

  const actions = document.createElement('div');
  actions.style.marginTop = '12px';
  actions.style.display = 'flex';
  actions.style.gap = '8px';
  actions.innerHTML = `
    <button class="btn btn-ghost btn-sm" data-move-up="${sc.id}">↑ Subir</button>
    <button class="btn btn-ghost btn-sm" data-move-down="${sc.id}">↓ Bajar</button>
    <span style="flex:1"></span>
    <button class="btn btn-danger btn-sm" data-del-scene="${sc.id}">🗑 Eliminar</button>`;
  body.appendChild(actions);

  item.appendChild(summary);
  item.appendChild(body);

  item.addEventListener('input', e => {
    const el = e.target;
    const id = el.dataset.scene;
    const key = el.dataset.field;
    if (!id || !key) return;
    const sc2 = S.scenes.find(x => x.id === id);
    if (!sc2) return;

    const prevEffective = effectiveSceneType(sc2);
    sc2[key] = el.value;
    const newEffective = effectiveSceneType(sc2);
    markDirty();

    const hasManual = sc2.type === 'proactive' || sc2.type === 'reactive';
    const structuralKeys = ['meta', 'conflicto', 'reves', 'reaccion', 'dilema', 'decision'];
    if (!hasManual && structuralKeys.includes(key) && prevEffective !== newEffective) {
      clearTimeout(sceneRenderTimer);
      sceneRenderTimer = setTimeout(() => render(), 500);
    }
  });

  item.addEventListener('change', e => {
    const el = e.target;

    // Estado de escena
    const stateId = el.dataset.sceneState;
    if (stateId) {
      const sc2 = S.scenes.find(x => x.id === stateId);
      if (sc2) { sc2.state = el.value; markDirty(); render(); }
    }

    // Selector de tipo
    const typeId = el.dataset.scene;
    const field = el.dataset.field;
    if (typeId && field === 'type') {
      const sc2 = S.scenes.find(x => x.id === typeId);
      if (sc2) {
        const newVal = el.value;
        if (newVal === 'proactive') {
          const hasRea = !!((sc2.reaccion || '').trim() || (sc2.dilema || '').trim() || (sc2.decision || '').trim());
          if (hasRea && !confirm('Hay contenido en Reacción/Dilema/Decisión. Si cambias a Proactiva, esos campos dejarán de mostrarse (no se borran, pero quedarán ocultos). ¿Continuar?')) {
            render();
            return;
          }
        } else if (newVal === 'reactive') {
          const hasPro = !!((sc2.meta || '').trim() || (sc2.conflicto || '').trim() || (sc2.reves || '').trim());
          if (hasPro && !confirm('Hay contenido en Meta/Conflicto/Revés. Si cambias a Reactiva, esos campos dejarán de mostrarse (no se borran, pero quedarán ocultos). ¿Continuar?')) {
            render();
            return;
          }
        }
        sc2.type = newVal;
        markDirty();
        render();
      }
    }

    // Selector de POV
    if (typeId && field === 'povSelect') {
      const sc2 = S.scenes.find(x => x.id === typeId);
      if (sc2) {
        const val = el.value;
        if (val === '__other__') {
          sc2.povId = '';
          S.ui.manualPov[sc2.id] = true;
        } else if (val === '') {
          sc2.povId = '';
          sc2.povName = '';
          S.ui.manualPov[sc2.id] = false;
        } else {
          sc2.povId = val;
          const c = S.characters.find(x => x.id === val);
          sc2.povName = c ? c.name : '';
          S.ui.manualPov[sc2.id] = false;
        }
        markDirty();
        render();
      }
    }

    // Checkboxes de personajes en escena
    if (el.dataset.sceneChar) {
      const scId = el.dataset.sceneChar;
      const charId = el.dataset.charId;
      const sc2 = S.scenes.find(x => x.id === scId);
      if (sc2) {
        if (!Array.isArray(sc2.charactersInScene)) sc2.charactersInScene = [];
        if (el.checked) {
          if (!sc2.charactersInScene.includes(charId)) sc2.charactersInScene.push(charId);
        } else {
          sc2.charactersInScene = sc2.charactersInScene.filter(id => id !== charId);
        }
        markDirty();
        render();
      }
    }
  });

  item.addEventListener('click', e => {
    const up = e.target.closest('[data-move-up]');
    const dn = e.target.closest('[data-move-down]');
    const del = e.target.closest('[data-del-scene]');
    const fileBtn = e.target.closest('[data-file-pov]');
    if (up) { moveScene(up.dataset.moveUp, -1); }
    if (dn) { moveScene(dn.dataset.moveDown, 1); }
    if (del) {
      if (confirm('¿Eliminar esta escena?')) {
        S.scenes = S.scenes.filter(x => x.id !== del.dataset.delScene);
        markDirty(); render();
      }
    }
    if (fileBtn) {
      const sc2 = S.scenes.find(x => x.id === fileBtn.dataset.filePov);
      if (sc2 && sc2.povName && sc2.povName.trim()) {
        const name = sc2.povName.trim();
        const existing = S.characters.find(c => c.name.toLowerCase() === name.toLowerCase());
        if (existing) {
          sc2.povId = existing.id;
          sc2.povName = existing.name;
        } else {
          const newChar = { id: uid(), name, category: 'main', short: {}, synopsis: '', bible: {} };
          S.characters.push(newChar);
          sc2.povId = newChar.id;
        }
        S.ui.manualPov[sc2.id] = false;
        markDirty();
        render();
      }
    }
  });

  return item;
}

function renderPovBlock(sc) {
  const wrap = document.createElement('div');
  wrap.className = 'field';
  const manual = !!S.ui.manualPov[sc.id];
  const hasChars = S.characters.length > 0;

  let optionsHtml = `<option value="" ${!sc.povId && !manual ? 'selected' : ''}>— Sin POV —</option>`;
  CHARACTER_CATEGORIES.forEach(cat => {
    const list = S.characters.filter(c => (c.category || 'main') === cat.id);
    if (list.length === 0) return;
    optionsHtml += `<optgroup label="${cat.label}">`;
    list.forEach(c => {
      optionsHtml += `<option value="${c.id}" ${sc.povId === c.id ? 'selected' : ''}>${escapeHtml(c.name)}</option>`;
    });
    optionsHtml += `</optgroup>`;
  });
  optionsHtml += `<option value="__other__" ${manual ? 'selected' : ''}>Otro (escribir a mano)</option>`;

  const helpId = `scene_${sc.id}__pov`;
  const help = FIELD_HELP.pov;
  const isOpen = !!S.ui.helpOpen[helpId];

  let manualInput = '';
  if (manual || !hasChars) {
    const canFile = sc.povName && sc.povName.trim() && !sc.povId;
    manualInput = `
      <div style="display:flex;gap:6px;align-items:center;margin-top:6px">
        <input type="text" data-scene="${sc.id}" data-field="povName" value="${escapeHtml(sc.povName || '')}" placeholder="Nombre del POV" style="flex:1">
        ${canFile ? `<button class="btn btn-ghost btn-sm" data-file-pov="${sc.id}" title="Fichar este nombre como personaje">➕ Fichar</button>` : ''}
      </div>
    `;
  }

  wrap.innerHTML = `
    <div style="display:flex;align-items:center;gap:6px;margin-bottom:5px">
      <label style="margin:0;flex:1">POV (punto de vista)</label>
      <button class="field-help-btn" data-help-id="${helpId}" title="¿Qué se espera aquí?" style="background:none;border:1px solid var(--border);border-radius:50%;width:20px;height:20px;font-size:.7rem;line-height:1;cursor:pointer;color:var(--text-soft)">?</button>
    </div>
    <div class="pov-block">
      <select data-scene="${sc.id}" data-field="povSelect" ${!hasChars ? 'style="display:none"' : ''}>
        ${optionsHtml}
      </select>
      ${manualInput}
    </div>
    <div class="field-help-text" data-help-text="${helpId}" style="display:${isOpen ? 'block' : 'none'};font-size:.78rem;color:var(--text-soft);background:var(--bg-soft);padding:8px 10px;border-radius:6px;margin-top:6px;line-height:1.5;border-left:3px solid var(--accent)">${escapeHtml(help)}</div>
  `;

  setTimeout(() => {
    const btn = wrap.querySelector(`[data-help-id="${helpId}"]`);
    if (btn) {
      btn.onclick = (e) => {
        e.preventDefault();
        S.ui.helpOpen[helpId] = !S.ui.helpOpen[helpId];
        autosave();
        const txt = wrap.querySelector(`[data-help-text="${helpId}"]`);
        if (txt) txt.style.display = S.ui.helpOpen[helpId] ? 'block' : 'none';
      };
    }
  }, 0);

  return wrap;
}

function renderCharactersInSceneBlock(sc) {
  const wrap = document.createElement('div');
  wrap.className = 'field';

  const helpId = `scene_${sc.id}__charactersInScene`;
  const help = FIELD_HELP.charactersInScene;
  const isOpen = !!S.ui.helpOpen[helpId];

  const available = S.characters.filter(c => c.id !== sc.povId);
  const selected = Array.isArray(sc.charactersInScene) ? sc.charactersInScene : [];

  let listHtml = '';
  if (available.length === 0) {
    listHtml = `<span style="font-size:.78rem;color:var(--text-soft);font-style:italic">No hay otros personajes fichados.</span>`;
  } else {
    CHARACTER_CATEGORIES.forEach(cat => {
      const list = available.filter(c => (c.category || 'main') === cat.id);
      if (list.length === 0) return;
      listHtml += `<div style="width:100%;font-size:.68rem;text-transform:uppercase;letter-spacing:.5px;color:var(--text-soft);margin:6px 0 2px;font-weight:600">${cat.label}</div>`;
      list.forEach(c => {
        const checked = selected.includes(c.id);
        listHtml += `
          <label class="scene-char-chip ${checked ? 'checked' : ''}">
            <input type="checkbox" data-scene-char="${sc.id}" data-char-id="${c.id}" ${checked ? 'checked' : ''}>
            <span>${escapeHtml(c.name)}</span>
          </label>
        `;
      });
    });
  }

  wrap.innerHTML = `
    <div style="display:flex;align-items:center;gap:6px;margin-bottom:5px">
      <label style="margin:0;flex:1">Personajes que aparecen (además del POV)</label>
      <button class="field-help-btn" data-help-id="${helpId}" title="¿Qué se espera aquí?" style="background:none;border:1px solid var(--border);border-radius:50%;width:20px;height:20px;font-size:.7rem;line-height:1;cursor:pointer;color:var(--text-soft)">?</button>
    </div>
    <div class="scene-characters">
      ${listHtml}
    </div>
    <div class="field-help-text" data-help-text="${helpId}" style="display:${isOpen ? 'block' : 'none'};font-size:.78rem;color:var(--text-soft);background:var(--bg-soft);padding:8px 10px;border-radius:6px;margin-top:6px;line-height:1.5;border-left:3px solid var(--accent)">${escapeHtml(help)}</div>
  `;

  setTimeout(() => {
    const btn = wrap.querySelector(`[data-help-id="${helpId}"]`);
    if (btn) {
      btn.onclick = (e) => {
        e.preventDefault();
        S.ui.helpOpen[helpId] = !S.ui.helpOpen[helpId];
        autosave();
        const txt = wrap.querySelector(`[data-help-text="${helpId}"]`);
        if (txt) txt.style.display = S.ui.helpOpen[helpId] ? 'block' : 'none';
      };
    }
    wrap.querySelectorAll('input[type="checkbox"][data-scene-char]').forEach(cb => {
      cb.addEventListener('change', () => {
        const chip = cb.closest('.scene-char-chip');
        if (chip) chip.classList.toggle('checked', cb.checked);
      });
    });
  }, 0);

  return wrap;
}

function sceneField(label, type, key, sc, rows) {
  const val = sc[key] || '';
  const inputHtml = type === 'textarea'
    ? `<textarea data-scene="${sc.id}" data-field="${key}" rows="${rows || 3}">${escapeHtml(val)}</textarea>`
    : `<input type="text" data-scene="${sc.id}" data-field="${key}" value="${escapeHtml(val)}">`;
  return fieldBlock({
    label, key, value: val, inputHtml, stepIdForHelp: 'scene_' + sc.id
  });
}

function renderVerifier(sc) {
  const v = document.createElement('div');
  v.className = 'verifier';
  const type = effectiveSceneType(sc);
  const checks = [];

  checks.push({
    ok: !!sc.crisol && sc.crisol.trim().length > 3,
    msg: sc.crisol && sc.crisol.trim().length > 3 ? 'Crisol de escena definido' : 'Falta el crisol de escena'
  });
  checks.push({
    ok: type !== 'undefined',
    msg: type !== 'undefined' ? 'Tipo identificable' : 'No se puede identificar tipo (faltan campos o hay de ambos)'
  });

  if (type === 'proactive') {
    checks.push({ ok: !!(sc.meta || '').trim(), msg: (sc.meta || '').trim() ? 'Meta presente' : 'Falta la meta' });
    checks.push({ ok: !!(sc.conflicto || '').trim(), msg: (sc.conflicto || '').trim() ? 'Conflicto presente' : 'Falta el conflicto' });
    checks.push({ ok: !!(sc.reves || '').trim(), msg: (sc.reves || '').trim() ? 'Revés/victoria presente' : 'Falta el revés o victoria' });
  } else if (type === 'reactive') {
    checks.push({ ok: !!(sc.reaccion || '').trim(), msg: (sc.reaccion || '').trim() ? 'Reacción presente' : 'Falta la reacción' });
    checks.push({ ok: !!(sc.dilema || '').trim(), msg: (sc.dilema || '').trim() ? 'Dilema presente' : 'Falta el dilema' });
    checks.push({ ok: !!(sc.decision || '').trim(), msg: (sc.decision || '').trim() ? 'Decisión presente' : 'Falta la decisión' });
  }

  v.innerHTML = checks.map(c =>
    `<div class="v-item"><span class="v-icon">${c.ok ? '✅' : '⚠️'}</span><span>${c.msg}</span></div>`
  ).join('');
  return v;
}

function addScene(mode) {
  const sc = {
    id: uid(), title: '', location: '',
    povId: '', povName: '',
    charactersInScene: [],
    summary: '', type: '', crisol: '',
    meta: '', conflicto: '', reves: '',
    reaccion: '', dilema: '', decision: '',
    notes: '', state: 'pending'
  };
  S.scenes.push(sc);
  S.ui.openSceneId = mode === 'plan' ? sc.id : null;
  markDirty();
  render();
}

function moveScene(id, delta) {
  const i = S.scenes.findIndex(s => s.id === id);
  if (i === -1) return;
  const j = i + delta;
  if (j < 0 || j >= S.scenes.length) return;
  [S.scenes[i], S.scenes[j]] = [S.scenes[j], S.scenes[i]];
  markDirty();
  render();
}

function reorderScene(fromId, targetId, placeBefore) {
  const fromIdx = S.scenes.findIndex(s => s.id === fromId);
  const targetIdx = S.scenes.findIndex(s => s.id === targetId);
  if (fromIdx === -1 || targetIdx === -1 || fromIdx === targetIdx) return;
  const [moved] = S.scenes.splice(fromIdx, 1);
  let insertAt = targetIdx;
  if (fromIdx < targetIdx) insertAt = targetIdx - 1;
  if (!placeBefore) insertAt += 1;
  S.scenes.splice(insertAt, 0, moved);
  markDirty();
  render();
}

/* ----------------------------------------------------------
   9. PASO FINAL
   ---------------------------------------------------------- */

function renderFinalStep() {
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <p style="font-size:.95rem;line-height:1.7;">
      Ya tienes tu copo de nieve completo: público objetivo y premisa, resumen de una frase,
      resumen de un párrafo, fichas de personajes, sinopsis breve, sinopsis de personajes,
      sinopsis larga, biblia de personajes, plan de escenas y lista de escenas.
    </p>
    <p style="margin-top:12px;font-size:.95rem;line-height:1.7;">
      Es hora de escribir. Lee lo que has planeado para cada escena, y escribe.
    </p>
    <p style="margin-top:20px;font-style:italic;color:var(--text-soft);font-size:.85rem;">
      "Escribir el primer borrador de una novela que ya sabes que va a ser una gran historia."
    </p>`;
  return card;
}

/* ----------------------------------------------------------
   10. PANEL BURBUJA
   ---------------------------------------------------------- */

function renderBubble() {
  document.querySelectorAll('.bubble-side, .bubble-chat, .bubble-trigger').forEach(el => el.remove());
  if (S.settings.bubble === 'off' || S.ui.readMode) return;

  const st = STEPS.find(x => x.id === currentBubbleTarget) || STEPS.find(x => x.id === S.ui.currentStep);
  if (!st || !EXAMPLES[st.id]) return;

  if (S.settings.bubble === 'side') {
    const el = document.createElement('div');
    el.className = 'bubble-side';
    el.innerHTML = `
      <h4>💡 Ejemplo: ${st.title}</h4>
      <p class="bubble-example">${escapeHtml(EXAMPLES[st.id])}</p>`;
    document.body.appendChild(el);
  } else if (S.settings.bubble === 'chat') {
    const el = document.createElement('div');
    el.className = 'bubble-chat';
    el.innerHTML = `
      <header>
        <span>💡 Ejemplo: ${st.title}</span>
        <button class="modal-close" style="padding:2px 6px">✕</button>
      </header>
      <div class="bubble-body">
        <p class="bubble-example">${escapeHtml(EXAMPLES[st.id])}</p>
      </div>
      <div class="bubble-foot">
        <button class="btn btn-ghost btn-sm" style="width:100%" disabled>Ricitos de Oro (ejemplo)</button>
      </div>`;
    el.querySelector('button').onclick = () => el.remove();
    document.body.appendChild(el);
  } else {
    const btn = document.createElement('button');
    btn.className = 'bubble-trigger';
    btn.textContent = '💡';
    btn.title = 'Ver ejemplo';
    btn.onclick = () => {
      const existing = document.querySelector('.bubble-side');
      if (existing) { existing.remove(); return; }
      const el = document.createElement('div');
      el.className = 'bubble-side';
      el.innerHTML = `
        <h4>💡 Ejemplo: ${st.title}</h4>
        <p class="bubble-example">${escapeHtml(EXAMPLES[st.id])}</p>`;
      document.body.appendChild(el);
    };
    document.body.appendChild(btn);
  }
}

function showBubbleFor(stepId) {
  currentBubbleTarget = stepId;
  renderBubble();
}

/* ----------------------------------------------------------
   11. EXPORTACIÓN
   ---------------------------------------------------------- */

function exportData() {
  showModal('📤 Exportar', '', [
    { label: '📝 Markdown', cls: 'btn-primary', fn: () => { closeModal(); exportMarkdown(); } },
    { label: '📄 PDF',      cls: 'btn-ghost',   fn: () => { closeModal(); exportPDF(); } },
    { label: '📘 DOCX',     cls: 'btn-ghost',   fn: () => { closeModal(); exportDocx(); } },
    { label: '🗂 JSON',     cls: 'btn-ghost',   fn: () => { closeModal(); exportJSON(); } }
  ]);
}

function buildPlainText() {
  let out = `# ${S.title}\n\n`;

  STEPS.forEach(st => {
    out += `\n## ${st.num === 0 ? '' : 'Paso ' + st.num + ': '}${st.title}\n\n`;

    if (st.type === 'publico') {
      const d = S.steps.publico || {};
      if (d.categoria) out += `**Categoría:** ${d.categoria}\n\n`;
      if (d.tipo) out += `**Tipo de historia:** ${d.tipo}\n\n`;
      if (d.porque) out += `**Por qué encantará al público:** ${d.porque}\n\n`;
      out += `\n### 🔥 Premisa, tema y crisol general\n\n`;
      if (d.premisa) out += `**Premisa:** ${d.premisa}\n\n`;
      if (d.tema) out += `**Tema:** ${d.tema}\n\n`;
      if (d.crisolGeneral) out += `**Crisol general:** ${d.crisolGeneral}\n\n`;
      return;
    }

    if (st.type === 'characters') {
      // Agrupar por categoría
      CHARACTER_CATEGORIES.forEach(cat => {
        const list = S.characters.filter(c => (c.category || 'main') === cat.id);
        if (list.length === 0) return;
        out += `### ${cat.label}\n\n`;
        list.forEach(c => {
          out += `#### ${c.name}\n\n`;
          const fields = [];
          if (st.mode === 'short' || S.settings.ficha === 'merged') fields.push(...SHORT_CHAR_FIELDS);
          if (st.mode === 'bible' || S.settings.ficha === 'merged') fields.push(...BIBLE_FIELDS);
          fields.forEach(f => {
            const v = c.short[f.key] || c.bible[f.key] || '';
            if (v) out += `- **${f.label}:** ${v}\n`;
          });
          if (c.synopsis) out += `\n${c.synopsis}\n`;
          out += '\n';
        });
      });
      return;
    }

    if (st.type === 'scenes') {
      if (st.mode !== 'plan') return;
      S.scenes.forEach((sc, i) => {
        const type = effectiveSceneType(sc);
        out += `### Escena ${i + 1}: ${sc.title || 'Sin título'}\n`;
        const povLabel = resolvePovName(sc);
        if (povLabel) out += `- POV: ${povLabel}\n`;
        if (sc.location) out += `- Lugar: ${sc.location}\n`;
        out += `- Tipo: ${typeLabel(type)}\n`;
        const others = (sc.charactersInScene || [])
          .map(id => S.characters.find(c => c.id === id))
          .filter(Boolean)
          .map(c => c.name);
        if (others.length) out += `- Aparecen: ${others.join(', ')}\n`;
        if (sc.summary) out += `\n${sc.summary}\n`;
        if (sc.crisol) out += `\n**Crisol:** ${sc.crisol}\n`;
        if (type === 'reactive') {
          if (sc.reaccion) out += `\n**Reacción:** ${sc.reaccion}\n`;
          if (sc.dilema) out += `\n**Dilema:** ${sc.dilema}\n`;
          if (sc.decision) out += `\n**Decisión:** ${sc.decision}\n`;
        } else if (type === 'proactive') {
          if (sc.meta) out += `\n**Meta:** ${sc.meta}\n`;
          if (sc.conflicto) out += `\n**Conflicto:** ${sc.conflicto}\n`;
          if (sc.reves) out += `\n**Revés:** ${sc.reves}\n`;
        }
        if (sc.notes) out += `\n*Notas:* ${sc.notes}\n`;
        out += '\n';
      });
      return;
    }

    if (st.type === 'final') {
      out += 'Escribe tu novela.\n\n';
      return;
    }

    const data = S.steps[st.id] || {};
    st.fields.forEach(f => {
      const v = data[f.key];
      if (v) out += `**${f.label}:**\n\n${v}\n\n`;
    });
  });

  return out;
}

function exportMarkdown() {
  const md = buildPlainText();
  downloadBlob(md, (S.title || 'copo-nieve') + '.md', 'text/markdown');
}

function exportPDF() {
  const w = window.open('', '_blank');
  w.document.write(`
    <html><head><title>${escapeHtml(S.title)}</title>
    <style>
      body{font-family:Georgia,serif;line-height:1.6;max-width:800px;margin:40px auto;padding:0 20px;color:#111}
      h1{font-size:1.8rem;border-bottom:2px solid #333;padding-bottom:8px}
      h2{font-size:1.3rem;margin-top:32px;color:#333;page-break-after:avoid}
      h3{font-size:1.05rem;margin-top:20px}
      pre{white-space:pre-wrap;font-family:inherit}
      ul{margin:8px 0}
    </style></head><body>
    <pre>${escapeHtml(buildPlainText())}</pre>
    </body></html>`);
  w.document.close();
  setTimeout(() => { w.focus(); w.print(); }, 300);
}

function exportDocx() {
  const text = buildPlainText();
  if (window.docx && window.docx.Document) {
    try {
      const { Document, Packer, Paragraph, HeadingLevel, TextRun } = window.docx;
      const children = text.split('\n').map(line => {
        if (line.startsWith('# ')) return new Paragraph({ text: line.slice(2), heading: HeadingLevel.HEADING_1 });
        if (line.startsWith('## ')) return new Paragraph({ text: line.slice(3), heading: HeadingLevel.HEADING_2 });
        if (line.startsWith('### ')) return new Paragraph({ text: line.slice(4), heading: HeadingLevel.HEADING_3 });
        if (line.startsWith('#### ')) return new Paragraph({ text: line.slice(5), heading: HeadingLevel.HEADING_4 });
        return new Paragraph({ children: [new TextRun(line)] });
      });
      const doc = new Document({ sections: [{ children }] });
      Packer.toBlob(doc).then(blob => downloadBlob(blob, (S.title || 'copo-nieve') + '.docx'));
      return;
    } catch (e) { console.warn('DOCX falló, usando fallback', e); }
  }
  const html = `<html><head><meta charset="utf-8"></head><body><pre>${escapeHtml(text)}</pre></body></html>`;
  downloadBlob(html, (S.title || 'copo-nieve') + '.doc', 'application/msword');
}

function exportJSON() {
  const data = { ...S, versions: [] };
  downloadBlob(JSON.stringify(data, null, 2), (S.title || 'copo-nieve') + '.json', 'application/json');
}

/* ----------------------------------------------------------
   12. MODAL GENÉRICO
   ---------------------------------------------------------- */

function showModal(title, bodyHtml, buttons) {
  const modal = document.getElementById('modal');
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalBody').innerHTML = bodyHtml;
  const foot = document.getElementById('modalFoot');
  foot.innerHTML = '';
  (buttons || []).forEach(b => {
    const btn = document.createElement('button');
    btn.className = 'btn ' + (b.cls || 'btn-ghost');
    btn.textContent = b.label;
    btn.onclick = b.fn;
    foot.appendChild(btn);
  });
  modal.classList.add('open');
}

function closeModal() {
  document.getElementById('modal').classList.remove('open');
}

/* ----------------------------------------------------------
   13. VERSIONES
   ---------------------------------------------------------- */

function openVersions() {
  const body = document.getElementById('versionsBody');
  if (S.versions.length === 0) {
    body.innerHTML = '<p class="card-hint">No hay versiones guardadas aún. Cada vez que pulses Guardar, se crea un snapshot.</p>';
  } else {
    body.innerHTML = S.versions.map((v, i) => `
      <div class="card" style="margin-bottom:8px;padding:12px">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:8px">
          <div>
            <strong style="font-size:.85rem">${escapeHtml(v.label)}</strong>
            <div style="font-size:.72rem;color:var(--text-soft);margin-top:2px">
              ${new Date(v.ts).toLocaleString()}
            </div>
          </div>
          <button class="btn btn-ghost btn-sm" data-restore="${i}">Restaurar</button>
        </div>
      </div>`).join('');
    body.querySelectorAll('[data-restore]').forEach(btn => {
      btn.onclick = () => {
        const i = +btn.dataset.restore;
        if (!confirm('¿Restaurar esta versión? Se perderán los cambios actuales.')) return;
        const data = S.versions[i].data;
        const currentVersions = S.versions;
        S = Object.assign(DEFAULT_STATE(), migrateState(data));
        S.versions = currentVersions;
        applySettings();
        applySidebarState();
        autosave();
        render();
        closeVersions();
      };
    });
  }
  document.getElementById('versionsModal').classList.add('open');
}

function closeVersions() {
  document.getElementById('versionsModal').classList.remove('open');
}

/* ----------------------------------------------------------
   14. AJUSTES
   ---------------------------------------------------------- */

function applySettings() {
  document.body.setAttribute('data-theme', S.settings.theme);
  document.body.classList.remove('font-lora', 'font-mono', 'font-system');
  if (S.settings.font === 'Lora') document.body.classList.add('font-lora');
  else if (S.settings.font === 'JetBrains Mono') document.body.classList.add('font-mono');
  else if (S.settings.font === 'system') document.body.classList.add('font-system');
  document.body.style.setProperty('--accent', S.settings.accent);
  document.body.style.setProperty('--accent-h', shadeColor(S.settings.accent, -15));
  document.body.classList.toggle('read-mode', S.ui.readMode);

  document.querySelectorAll('[data-theme-set]').forEach(b =>
    b.classList.toggle('active', b.dataset.themeSet === S.settings.theme));
  document.querySelectorAll('[data-bubble]').forEach(b =>
    b.classList.toggle('active', b.dataset.bubble === S.settings.bubble));
  document.querySelectorAll('[data-ficha]').forEach(b =>
    b.classList.toggle('active', b.dataset.ficha === S.settings.ficha));
  document.querySelectorAll('[data-mdexport]').forEach(b =>
    b.classList.toggle('active', b.dataset.mdexport === S.settings.mdExport));
}

function shadeColor(hex, percent) {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, Math.min(255, (num >> 16) + amt));
  const G = Math.max(0, Math.min(255, ((num >> 8) & 0xff) + amt));
  const B = Math.max(0, Math.min(255, (num & 0xff) + amt));
  return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
}

/* ----------------------------------------------------------
   15. UTILIDADES
   ---------------------------------------------------------- */

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function escapeHtml(s) {
  if (s === null || s === undefined) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function downloadBlob(content, filename, mime) {
  const blob = content instanceof Blob
    ? content
    : new Blob([content], { type: mime || 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/* ----------------------------------------------------------
   16. EVENTOS GLOBALES
   ---------------------------------------------------------- */

function bindGlobalEvents() {
  document.getElementById('btnViewToggle').onclick = toggleFullView;
  document.getElementById('btnReadMode').onclick = toggleReadMode;
  document.getElementById('btnSave').onclick = () => {
    saveSnapshot();
    exportJSON();
  };
  document.getElementById('btnOpen').onclick = () => document.getElementById('fileInput').click();
  document.getElementById('btnNew').onclick = () => {
    if (!confirm('¿Empezar una nueva historia? Se perderán los cambios no guardados en el historial.')) return;
    saveSnapshot('Antes de nueva historia');
    S = Object.assign(DEFAULT_STATE(), { versions: S.versions });
    applySettings();
    applySidebarState();
    autosave();
    render();
  };
  document.getElementById('btnExport').onclick = exportData;
  document.getElementById('btnVersions').onclick = openVersions;
  document.getElementById('btnSettings').onclick = () => {
    applySettings();
    document.getElementById('settingsModal').classList.add('open');
  };
  document.querySelectorAll('[data-close-settings]').forEach(b => b.onclick = () => document.getElementById('settingsModal').classList.remove('open'));
  document.querySelectorAll('[data-close-versions]').forEach(b => b.onclick = closeVersions);
  document.querySelectorAll('[data-close-modal]').forEach(b => b.onclick = closeModal);

  const sidebarBtn = document.getElementById('btnSidebarToggle');
  if (sidebarBtn) {
    sidebarBtn.onclick = () => {
      S.ui.sidebarCollapsed = !S.ui.sidebarCollapsed;
      autosave();
      applySidebarState();
    };
  }

  document.getElementById('fileInput').onchange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const data = migrateState(JSON.parse(ev.target.result));
        saveSnapshot('Antes de abrir archivo');
        const versions = S.versions;
        S = Object.assign(DEFAULT_STATE(), data);
        S.versions = versions;
        applySettings();
        applySidebarState();
        autosave();
        render();
      } catch (err) { alert('Error al cargar el archivo JSON.'); }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  document.querySelectorAll('[data-theme-set]').forEach(b => {
    b.onclick = () => { S.settings.theme = b.dataset.themeSet; applySettings(); autosave(); };
  });
  document.getElementById('setFont').onchange = e => {
    S.settings.font = e.target.value; applySettings(); autosave();
  };
  document.getElementById('setAccent').onchange = e => {
    S.settings.accent = e.target.value; applySettings(); autosave();
  };
  document.querySelectorAll('[data-bubble]').forEach(b => {
    b.onclick = () => { S.settings.bubble = b.dataset.bubble; applySettings(); renderBubble(); autosave(); };
  });
  document.querySelectorAll('[data-ficha]').forEach(b => {
    b.onclick = () => { S.settings.ficha = b.dataset.ficha; applySettings(); render(); autosave(); };
  });
  document.querySelectorAll('[data-mdexport]').forEach(b => {
    b.onclick = () => { S.settings.mdExport = b.dataset.mdexport; applySettings(); autosave(); };
  });

  document.querySelectorAll('.modal').forEach(m => {
    m.addEventListener('click', e => {
      if (e.target === m) m.classList.remove('open');
    });
  });

  document.addEventListener('keydown', e => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 's') { e.preventDefault(); document.getElementById('btnSave').click(); }
      if (e.key === 'k') { e.preventDefault(); document.getElementById('btnSettings').click(); }
    }
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal.open').forEach(m => m.classList.remove('open'));
    }
  });
}

/* ----------------------------------------------------------
   17. ARRANQUE
   ---------------------------------------------------------- */

function init() {
  applySettings();
  applySidebarState();
  render();
  bindGlobalEvents();
  updateFileStatus();
}

document.addEventListener('DOMContentLoaded', init);

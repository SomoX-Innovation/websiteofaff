/**
 * Video category/tag taxonomy for admin checkbox picker + free-form SEO tags.
 * Labels are deduped globally (first group wins). Edit pipe-delimited strings to extend.
 */

const P_PRODUCTION =
  "3D|Amateur|Behind the Scenes|Caption|Cartoon|Close-up|Close Up|Compilation|Erotica|Funny|Gonzo|Hentai|Homemade|HD|Interactive|JAV|PMV|POV|Pornstar|Retro|Show|Softcore|Story|Uncensored|Vintage|Webcam|Anime|Reality|Behind The Scenes|4K";

const P_ACTIONS =
  "69|Anal|Anal Masturbation|Ass Licking|Ass to Mouth|Blowbang|Blowjob|Brutal Sex|Bukkake|Cowgirl|Creampie|Cum Swallowing|Cum in Mouth|Cum on Feet|Cum on Tits|Cumshot|Cumswap|Cunnilingus|Deep Throat|Dirty Talk|Doggy Style|Double Penetration|Dry Humping|Eating Pussy|Edging|Extreme Insertion|Face Fuck|Facesitting|Facial|Female Masturbation|Fingering|Fisting|Flashing|Footjob|Foreplay|Gaping|Handjob|Happy Ending|Humping|Kissing|Massage|Missionary|Moaning|Orgasm|Pegging|Pillow Humping|Prostate Massage|Riding|Rimjob|Rough Anal|Rough Sex|Scissoring|Screaming|Shaving|Squirting|Striptease|Titty Fucking|Twerking|Yoga|Bareback|Cum Tribute|Felching|Masturbation|Hardcore|Shemale Fucks Girl|Shemale Fucks Guy|Shemale Fucks Shemale|Guy Fucks Shemale";

const P_FETISH =
  "Ahegao|Armpit|BDSM|Ballbusting|Balloon|Belly Fetish|Body Hair Fetish|Body Paint|Bondage|CBT|CEI|Chastity|Condom|Dogging|Domination|Estim|Face Fetish|Farting|Femdom|Fetish|Financial Domination|Food|Foot Fetish|Foot Worship|Futanari|Gokkun|Gyno Fetish|Hand Fetish|Hogtied|Human Ashtray|Human Furniture|Humiliation|Kinky|Lactating|Lezdom|Milk|Mind Control|Mouth Fetish|Oiled|Orgasm Control|Pedal Pumping|Pet Play|Pissing|Predicament Bondage|Punishment|Raceplay|Shibari|Sissy|Small Penis Encouragement|Small Penis Humiliation|Smoking|Smothering|Spanking|Spitting|Submissive|Suspension Bondage|Tape Bondage|Tickling|Tied Up|Trampling|Wax Play|Wedgie|Weird|Wet and Messy|Whipping|Wrestling|Feet|Trap|Prolapse";

const P_ORIENTATION =
  "Bisexual|Lesbian|Bear|Crossdresser|Femboy|Jock|Straight Guy";

const P_AGE =
  "18 Year Old|Babe|Cougar|GILF|Granny|MILF|Mature|Old & Young|Old man|Teen|DILF|Grandpa|Middle-Aged|Old|Young|Young 18";

const P_ETHNICITY =
  "AMWF|African|American|Arab|Asian|Black|Desi|European|Interracial|Jewish|Latina|Mzansi|Latino|White|Indian|Brazilian|Japanese";

const P_BODY =
  "Amputee|Ass|BBC|BBW|BWC|Beauty|Big Ass|Big Clit|Big Cock|Big Natural Tits|Big Nipples|Big Tits|Cameltoe|Chubby|Clit|Cute|Exotic|FBB|Fake Tits|Flexible|Giant|Giantess|Hairy|Hermaphrodite|Legs|Midget|Monster Cock|Muscular Woman|Nipples|Nude|PAWG|Perfect Body|Petite|Piercing|Pregnant|Prolapse|Puffy Nipples|Pussy|SSBBW|Saggy Tits|Skinny|Small Tits|Tan Girl|Tattoo|Tight Pussy|Tits|Average Body|Average Cock|Bubble Butt|Fat|Hunk|Small Cock|Twink|Uncut|FTM|Ladyboy|Pretty|Trans Man|Trans Woman|Transgender|Big Black Cock";

const P_HAIR =
  "Blonde|Brunette|Colored Hair|Long Hair|Redhead|Short Hair";

const P_NUM_PEOPLE =
  "Couple|Foursome|Gangbang|Group Sex|Orgy|Solo|Threesome";

const P_SEX_TOYS =
  "Anal Beads|Ball Gagged|Blindfolded|Butt Plug|Dildo|Double Dildo|Enema|Fucking Machine|Hitachi|Pussy Pump|Sex Toy|Strapon|Sybian|Vibrator|Anal Toy|Ball Gag|Ben Wa Balls|Chain|Harness|Penis Ring|Pump|Sex Doll|Sleeve";

const P_APPAREL =
  "Bikini|Bodystocking|Bra|Fishnet|Glasses|Gloves|High Heels|Jeans|Latex|Leather|Leggings|Lingerie|Masked|Nylon|Panties|Pantyhose|School Uniform|Skirt|Socks|Spandex|Stockings|Thong|Uniform|Sneakers|Underwear";

const P_SCENARIO =
  "ASMR|Agent|Alien|Audition|Babysitter|Baddie|Birthday|Body Swap|Boss|Bunny|CFNM|CMNF|Casting|Catfight|Celebrity|Cheating|Cheerleader|Clown|Coed|Comic|Cook|Cosplay|Cuckold|Daddy|Dance|Doctor|Doll|E-girl|Emo|Escort|Fantasy|Fighting|First Time|Game|Gamer Girl|Ghetto|Girlfriend|Glory Hole|Gothic|Halloween|Hardcore|Horror|Housewife|Interview|JOI|Maid|Medical|Medieval|Military|Mistress|Mom|Monster|Morning|Naughty|Neighbor|Nerd|Nudist|Nun|Nurse|Nympho|Parody|Party|Passionate|Pick Up|Plumber|Police|Princess|Public Nudity|Public Sex|Reverse Gangbang|Role Play|Romantic|Secretary|Seduce|Sex Instruction|Slave|Sport|Stranger|Stuck|Student|Superhero|Surprise|Swingers|Taboo|Teacher|Time Stop|Truth or Dare|Twins|Upskirt|Valentine's Day|Vampire|Virgin|Voyeur|Waitress|Wedding|Wife|Wife Sharing|Wife Swap|Xmas|Casting|Condom|Cruising|Daddy|Doctor|First time|Funny|Husband|Military|Party|Romantic|Striptease|Swingers|Taboo|Teacher|Wrestling|Babysitter|Cosplay|Escort|Gothic|Hardcore|Role Play";

const P_LOCATION =
  "Bathroom|Beach|Bus|Car|College|Farm|Fitness|Gym|Hospital|Hotel|Jungle|Kitchen|Office|Outdoor|Pool|Prison|Sauna|Shower|Taxi|Toilet|Train|Underwater|Village|Army|Locker Room|Glory Hole|Public|Outdoor";

const RAW_GROUPS = [
  ["production", "Production", P_PRODUCTION],
  ["actions", "Actions", P_ACTIONS],
  ["fetish", "Fetish", P_FETISH],
  ["orientation", "Performers · Orientation", P_ORIENTATION],
  ["age", "Performers · Age", P_AGE],
  ["ethnicity", "Performers · Ethnicity", P_ETHNICITY],
  ["body", "Performers · Body", P_BODY],
  ["hair", "Performers · Hair", P_HAIR],
  ["numpeople", "Performers · Number of people", P_NUM_PEOPLE],
  ["sextoys", "Sex toys", P_SEX_TOYS],
  ["apparel", "Apparel", P_APPAREL],
  ["scenario", "Scenario", P_SCENARIO],
  ["location", "Location", P_LOCATION],
];

function keyify(display) {
  return display.trim().toLowerCase().replace(/\s+/g, " ");
}

/** @returns {{ id: string, title: string, items: string[] }[]} */
export function buildTaxonomyGroups() {
  const seen = new Set();
  const groups = [];
  for (const [id, title, pipe] of RAW_GROUPS) {
    const items = [];
    for (const raw of pipe.split("|")) {
      const t = raw.trim();
      if (!t) continue;
      const k = keyify(t);
      if (seen.has(k)) continue;
      seen.add(k);
      items.push(t);
    }
    groups.push({ id, title, items });
  }
  return groups;
}

export const TAXONOMY_GROUPS = buildTaxonomyGroups();

/** Frequently used — shown on “Frequent” tab */
export const FREQUENT_LABELS = [
  "Teen",
  "MILF",
  "Amateur",
  "POV",
  "Blowjob",
  "Outdoor",
  "Public",
  "Sauna",
  "Big Ass",
  "HD",
  "Lesbian",
  "Anal",
  "Creampie",
  "Asian",
  "Latina",
  "Homemade",
  "Threesome",
  "Gangbang",
  "Cosplay",
  "JAV",
];

/** key -> canonical display label */
export function buildLabelMap() {
  const map = new Map();
  for (const g of TAXONOMY_GROUPS) {
    for (const label of g.items) {
      const k = keyify(label);
      if (!map.has(k)) map.set(k, label);
    }
  }
  return map;
}

export function allLabelsSorted() {
  const m = buildLabelMap();
  return [...m.values()].sort((a, b) => a.localeCompare(b));
}

export function frequentKeysInTaxonomy() {
  const map = buildLabelMap();
  const keys = [];
  for (const lab of FREQUENT_LABELS) {
    const k = keyify(lab);
    if (map.has(k)) keys.push(k);
  }
  return keys;
}

/**
 * @param {HTMLElement} root
 * @param {{ onChange?: (count: number) => void }} opts
 */
export function mountOfferTaxonomy(root, opts = {}) {
  const labelByKey = buildLabelMap();
  const allKeys = new Set(labelByKey.keys());
  const selected = new Set();
  /** @type {string[]} */
  let customTags = [];

  function parseCommaList(s) {
    return String(s || "")
      .split(/[,;]+/)
      .map((x) => x.trim())
      .filter(Boolean);
  }

  function dedupeCustomPreserveOrder(arr) {
    const seen = new Set();
    const out = [];
    for (const raw of arr) {
      const k = keyify(raw);
      if (seen.has(k)) continue;
      seen.add(k);
      out.push(raw);
    }
    return out;
  }

  function totalSeoTagCount() {
    const keys = new Set(selected);
    for (const c of customTags) keys.add(keyify(c));
    return keys.size;
  }

  const tabGrouped = document.createElement("button");
  tabGrouped.type = "button";
  tabGrouped.className = "offer-taxonomy__tab offer-taxonomy__tab--active";
  tabGrouped.textContent = "Grouped";
  const tabAz = document.createElement("button");
  tabAz.type = "button";
  tabAz.className = "offer-taxonomy__tab";
  tabAz.textContent = "A–Z";
  const tabFreq = document.createElement("button");
  tabFreq.type = "button";
  tabFreq.className = "offer-taxonomy__tab";
  tabFreq.textContent = "Frequently used";

  const tabs = document.createElement("div");
  tabs.className = "offer-taxonomy__tabs";
  tabs.append(tabGrouped, tabAz, tabFreq);

  const panelGrouped = document.createElement("div");
  panelGrouped.className = "offer-taxonomy__panel";
  panelGrouped.dataset.panel = "grouped";

  for (const g of TAXONOMY_GROUPS) {
    const fieldset = document.createElement("fieldset");
    fieldset.className = "offer-taxonomy__group";
    const head = document.createElement("div");
    head.className = "offer-taxonomy__group-head";
    const leg = document.createElement("legend");
    leg.className = "offer-taxonomy__group-title";
    leg.textContent = g.title;
    const selAll = document.createElement("label");
    selAll.className = "offer-taxonomy__select-all";
    const selAllCb = document.createElement("input");
    selAllCb.type = "checkbox";
    selAllCb.dataset.selectAllGroup = g.id;
    selAllCb.title = `Select all in ${g.title}`;
    selAll.append(selAllCb, document.createTextNode(" Select all"));
    head.append(leg, selAll);
    const grid = document.createElement("div");
    grid.className = "offer-taxonomy__grid";
    for (const label of g.items) {
      const k = keyify(label);
      const lab = document.createElement("label");
      lab.className = "offer-taxonomy__item";
      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.dataset.tagKey = k;
      cb.dataset.groupId = g.id;
      const span = document.createElement("span");
      span.textContent = label;
      lab.append(cb, span);
      grid.appendChild(lab);
    }
    fieldset.append(head, grid);
    panelGrouped.appendChild(fieldset);
  }

  const panelAz = document.createElement("div");
  panelAz.className = "offer-taxonomy__panel";
  panelAz.hidden = true;
  panelAz.dataset.panel = "az";
  const gridAz = document.createElement("div");
  gridAz.className = "offer-taxonomy__grid offer-taxonomy__grid--dense";
  for (const label of allLabelsSorted()) {
    const k = keyify(label);
    const lab = document.createElement("label");
    lab.className = "offer-taxonomy__item";
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.dataset.tagKey = k;
    const span = document.createElement("span");
    span.textContent = label;
    lab.append(cb, span);
    gridAz.appendChild(lab);
  }
  const azSelectAll = document.createElement("div");
  azSelectAll.className = "offer-taxonomy__toolbar";
  const btnAzAll = document.createElement("button");
  btnAzAll.type = "button";
  btnAzAll.className = "btn btn--ghost btn--sm";
  btnAzAll.textContent = "Select all in list";
  const btnAzNone = document.createElement("button");
  btnAzNone.type = "button";
  btnAzNone.className = "btn btn--ghost btn--sm";
  btnAzNone.textContent = "Clear all";
  azSelectAll.append(btnAzAll, btnAzNone);
  panelAz.append(azSelectAll, gridAz);

  const panelFreq = document.createElement("div");
  panelFreq.className = "offer-taxonomy__panel";
  panelFreq.hidden = true;
  panelFreq.dataset.panel = "freq";
  const gridFreq = document.createElement("div");
  gridFreq.className = "offer-taxonomy__grid";
  const map = buildLabelMap();
  for (const lab of FREQUENT_LABELS) {
    const k = keyify(lab);
    if (!map.has(k)) continue;
    const display = map.get(k);
    const elLab = document.createElement("label");
    elLab.className = "offer-taxonomy__item";
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.dataset.tagKey = k;
    const span = document.createElement("span");
    span.textContent = display;
    elLab.append(cb, span);
    gridFreq.appendChild(elLab);
  }
  const freqToolbar = document.createElement("div");
  freqToolbar.className = "offer-taxonomy__toolbar";
  const btnFreqAll = document.createElement("button");
  btnFreqAll.type = "button";
  btnFreqAll.className = "btn btn--ghost btn--sm";
  btnFreqAll.textContent = "Select all on this tab";
  freqToolbar.appendChild(btnFreqAll);
  panelFreq.append(freqToolbar, gridFreq);

  const customWrap = document.createElement("div");
  customWrap.className = "offer-taxonomy__custom";
  const customLabel = document.createElement("label");
  customLabel.className = "offer-taxonomy__custom-label";
  const customTitle = document.createElement("span");
  customTitle.className = "offer-taxonomy__custom-title";
  customTitle.textContent = "Custom SEO tags";
  const customHint = document.createElement("span");
  customHint.className = "offer-taxonomy__custom-hint";
  customHint.textContent =
    "Comma-separated keywords not in the list above. Merged with checked tags when you save (deduped, case-insensitive).";
  const customTa = document.createElement("textarea");
  customTa.className = "offer-taxonomy__custom-input field__input field__input--area";
  customTa.rows = 2;
  customTa.setAttribute("spellcheck", "true");
  customTa.placeholder = "e.g. brand name, niche phrases, long-tail keywords";
  customLabel.append(customTitle, customHint, customTa);
  customWrap.appendChild(customLabel);

  const countEl = document.createElement("p");
  countEl.className = "offer-taxonomy__count";
  countEl.setAttribute("role", "status");

  root.replaceChildren(tabs, panelGrouped, panelAz, panelFreq, customWrap, countEl);

  customTa.addEventListener("input", () => {
    customTags = dedupeCustomPreserveOrder(parseCommaList(customTa.value));
    updateCount();
  });

  function syncAll() {
    root.querySelectorAll("input[type=checkbox][data-tag-key]").forEach((inp) => {
      const k = inp.dataset.tagKey;
      inp.checked = selected.has(k);
    });
    updateGroupSelectAllState();
    updateCount();
  }

  function updateGroupSelectAllState() {
    for (const g of TAXONOMY_GROUPS) {
      const sel = root.querySelector(`input[data-select-all-group="${g.id}"]`);
      if (!sel) continue;
      const keys = g.items.map((l) => keyify(l));
      const n = keys.filter((k) => selected.has(k)).length;
      sel.checked = n > 0 && n === keys.length;
      sel.indeterminate = n > 0 && n < keys.length;
    }
  }

  function updateCount() {
    const nTax = selected.size;
    const nTotal = totalSeoTagCount();
    const extraCustom = customTags.filter((c) => !selected.has(keyify(c))).length;
    const parts = [`${nTotal} unique tag(s) for SEO`];
    if (nTax && extraCustom) {
      parts.push(`${nTax} from checklist`, `${extraCustom} extra keyword(s)`);
    } else if (nTax) {
      parts.push(`${nTax} from checklist`);
    } else if (extraCustom) {
      parts.push(`${extraCustom} custom keyword(s)`);
    }
    countEl.textContent = parts.join(" · ");
    countEl.classList.remove("offer-taxonomy__count--warn", "offer-taxonomy__count--err");
    opts.onChange?.(nTotal);
  }

  function tryAddKey(k) {
    if (selected.has(k)) return true;
    selected.add(k);
    return true;
  }

  function syncCustomTextarea() {
    customTa.value = customTags.join(", ");
  }

  root.addEventListener("change", (e) => {
    const t = e.target;
    if (!(t instanceof HTMLInputElement)) return;

    if (t.dataset.selectAllGroup) {
      const gid = t.dataset.selectAllGroup;
      const g = TAXONOMY_GROUPS.find((x) => x.id === gid);
      if (!g) return;
      if (t.checked) {
        for (const label of g.items) {
          const k = keyify(label);
          if (!tryAddKey(k)) break;
        }
      } else {
        for (const label of g.items) {
          selected.delete(keyify(label));
        }
      }
      syncAll();
      return;
    }

    if (t.dataset.tagKey) {
      const k = t.dataset.tagKey;
      if (t.checked) {
        tryAddKey(k);
      } else {
        selected.delete(k);
      }
      syncAll();
    }
  });

  btnAzAll.addEventListener("click", () => {
    for (const label of allLabelsSorted()) {
      const k = keyify(label);
      if (!tryAddKey(k)) break;
    }
    syncAll();
  });

  btnAzNone.addEventListener("click", () => {
    selected.clear();
    syncAll();
  });

  btnFreqAll.addEventListener("click", () => {
    const map2 = buildLabelMap();
    for (const lab of FREQUENT_LABELS) {
      const k = keyify(lab);
      if (!map2.has(k)) continue;
      if (!tryAddKey(k)) break;
    }
    syncAll();
  });

  function showPanel(name) {
    panelGrouped.hidden = name !== "grouped";
    panelAz.hidden = name !== "az";
    panelFreq.hidden = name !== "freq";
    tabGrouped.classList.toggle("offer-taxonomy__tab--active", name === "grouped");
    tabAz.classList.toggle("offer-taxonomy__tab--active", name === "az");
    tabFreq.classList.toggle("offer-taxonomy__tab--active", name === "freq");
  }

  tabGrouped.addEventListener("click", () => showPanel("grouped"));
  tabAz.addEventListener("click", () => showPanel("az"));
  tabFreq.addEventListener("click", () => showPanel("freq"));

  function buildMergedCsv() {
    const taxLabels = [...selected]
      .map((k) => labelByKey.get(k))
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));
    const taxKeySet = new Set([...selected]);
    const extras = [];
    for (const c of customTags) {
      const k = keyify(c);
      if (taxKeySet.has(k)) continue;
      taxKeySet.add(k);
      extras.push(c);
    }
    return [...taxLabels, ...extras].join(", ");
  }

  return {
    /** @param {string} csv */
    setFromCsv(csv) {
      selected.clear();
      customTags = [];
      const parts = parseCommaList(csv);
      for (const p of parts) {
        const k = keyify(p);
        if (allKeys.has(k)) selected.add(k);
        else customTags.push(p);
      }
      customTags = dedupeCustomPreserveOrder(customTags);
      syncCustomTextarea();
      syncAll();
    },
    getCsv() {
      return buildMergedCsv();
    },
    getSelectedCount() {
      return totalSeoTagCount();
    },
    validate() {
      return { ok: true, message: "" };
    },
    clear() {
      selected.clear();
      customTags = [];
      syncCustomTextarea();
      syncAll();
    },
  };
}

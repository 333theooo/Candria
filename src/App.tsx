import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  ChevronDown,
  Compass,
  Menu,
  Moon,
  Newspaper,
  ShieldCheck,
  SunMedium,
  X,
} from "lucide-react";

type TabId =
  | "start"
  | "faq"
  | "shops"
  | "compare"
  | "review"
  | "candria"
  | "next";

type CompareModeId = "new" | "wide" | "thca" | "browse";

type Shop = {
  name: string;
  domain: string;
  url: string;
  short: string;
  bestFor: string;
  focus: string;
  shipping: string;
  note: string;
  tags: string[];
  status: string;
  brand: string;
};

type FaqItem = {
  question: string;
  answer: string;
  tag: string;
};

type CompareMode = {
  id: CompareModeId;
  label: string;
  title: string;
  text: string;
  primary: string;
  why: string;
  secondary: { name: string; reason: string }[];
};

const tabs: { id: TabId; label: string }[] = [
  { id: "start", label: "Start" },
  { id: "faq", label: "FAQ" },
  { id: "shops", label: "Trusted shoppar" },
  { id: "compare", label: "Jämför shoppar" },
  { id: "review", label: "Under review" },
  { id: "candria", label: "Vad Candria gör" },
  { id: "next", label: "Nästa" },
];

const trustedShops: Shop[] = [
  {
    name: "Upgrade Natural",
    domain: "upgradenatural.se",
    url: "https://upgradenatural.se",
    short:
      "Bred svensk shop med tydligt fokus på THC-A och flera olika produktformat.",
    bestFor: "Bra för dig som vill se ett bredare utbud direkt.",
    focus: "THC-A buds, hash, isolat och vapes",
    shipping: "1–3 dagars leverans enligt sidan",
    note: "Diskreta paket och Billwave nämns på siten.",
    tags: ["Brett sortiment", "Svensk shop", "THC-A fokus"],
    status: "Trusted",
    brand: "UN",
  },
  {
    name: "Kushy",
    domain: "kushy.se",
    url: "https://kushy.se",
    short:
      "Mer tydligt THCA-fokuserad shop med buds, vapes, cartridges, koncentrat och isolat.",
    bestFor: "Bra för dig som vill ha mer tydligt THCA-fokus.",
    focus: "THCA-buds, vapes, cartridges, koncentrat och isolat",
    shipping: "1–2 dagars leverans enligt sidan",
    note: "Diskret/luktfritt paket och svensk lagertext på siten.",
    tags: ["THCA-specialist", "Snabb frakt", "Avskalat sortiment"],
    status: "Trusted",
    brand: "K",
  },
  {
    name: "Hazey",
    domain: "hazey.se",
    url: "https://hazey.se",
    short:
      "Svensk shop med brett fokus på lagliga cannabinoider, särskilt THCA buds och vapes men också flera andra cannabinoider.",
    bestFor: "Bra för dig som vill kolla flera cannabinoider på samma ställe.",
    focus: "THCA buds, vapes och flera andra cannabinoidkategorier",
    shipping: "Snabb leverans i Sverige enligt sidan",
    note: "EU-certifierad industrihampa och tydligt 18+ språk på siten.",
    tags: ["Brett utbud", "THCA & vapes", "Svensk leverans"],
    status: "Trusted",
    brand: "H",
  },
  {
    name: "Swizzle",
    domain: "swizzle.se",
    url: "https://swizzle.se",
    short:
      "Shop med THC-A, CBD och fler kategorier där de lyfter bred variation, diskret frakt och att de följer svensk lag.",
    bestFor: "Bra för dig som vill jämföra fler typer av produkter.",
    focus: "THCA, CBD, gummies, vapes, pre-rolls och isolat",
    shipping: "Snabb och diskret leverans enligt sidan",
    note: "De betonar att de följer svensk lag och uppdaterar kunder vid förändringar.",
    tags: ["Brett utbud", "Diskret frakt", "Lagfokus"],
    status: "Trusted",
    brand: "S",
  },
];

const reviewShops: Shop[] = [
  {
    name: "Uforia",
    domain: "uforia.se",
    url: "https://uforia.se",
    short:
      "Har tidigare varit omtyckt av vissa, men den senaste tiden har många i communityt rapporterat stora problem.",
    bestFor: "Bör behandlas med försiktighet just nu tills läget känns tydligare igen.",
    focus: "Framför allt vapes och vissa andra THC-A-produkter",
    shipping: "Flera community-rapporter om kraftiga förseningar eller uteblivna utskick",
    note: "Många nämner tyst support, lång väntan och orderstrul.",
    tags: ["Under review", "Leveransproblem", "Community-varningar"],
    status: "Under review",
    brand: "U",
  },
];

const faqItems: FaqItem[] = [
  {
    question: "Vad är Candria egentligen?",
    answer:
      "Candria är tänkt att bli en svensk plats där man kan förstå THCA och liknande alt-cannabinoider mycket enklare. Inte en shop och inte bara ännu ett forum, utan mer som ett lugnare mellanläge där information, jämförelser och överblick faktiskt samlas på ett vettigt sätt.",
    tag: "Om Candria",
  },
  {
    question: "Varför behövs en sån här sida?",
    answer:
      "När man följer communityt märker man snabbt att samma frågor kommer tillbaka hela tiden: var man ska börja, vilka shoppar som känns seriösa, om THCA faktiskt ger effekt, varför vissa produkter känns svaga och vad som ens gäller just nu. Informationen finns redan där ute, men den är ofta utspridd, kortlivad och svår att lita på. Det är precis det Candria försöker lösa.",
    tag: "Varför",
  },
  {
    question: "Är Candria en shop?",
    answer:
      "Nej. Tanken är inte att sälja produkter direkt, utan att hjälpa människor förstå marknaden bättre innan de bestämmer sig själva. Candria ska kännas mer som en tydlig guide än som en säljkanal.",
    tag: "Grundidé",
  },
  {
    question: "Vad menas med trusted shoppar?",
    answer:
      "Det betyder inte att Candria garanterar någonting. Det betyder bara att en shop just nu verkar vara en av de mer rimliga aktörerna att ha koll på, utifrån hur den presenteras, hur den nämns i communityt och om det finns färska varningssignaler eller inte.",
    tag: "Shoppar",
  },
  {
    question: "Vad menas med under review?",
    answer:
      "Det betyder att det finns tydliga frågetecken kring en aktör just nu, till exempel leveransproblem, tyst support eller annat som gjort folk osäkra. Det är inte automatiskt samma sak som scam, men det är ett tecken på att man bör vara mer försiktig och läsa på lite extra innan man beställer.",
    tag: "Shoppar",
  },
  {
    question: "Är THCA det folk bryr sig mest om just nu?",
    answer:
      "Ja, det är ett av de tydligaste mönstren i communityt. Väldigt mycket kretsar kring just THCA, både som buds, vapes, isolat och som jämförelsepunkt mot andra alt-cannabinoider.",
    tag: "THCA",
  },
  {
    question: "Blir man faktiskt hög på THCA?",
    answer:
      "Det är en av de vanligaste frågorna. Många beskriver att THCA kan ge effekt när det värms, men också att upplevelsen ibland känns svagare, plattare eller bara annorlunda än vanligt weed beroende på produkt, format och kvalitet.",
    tag: "THCA",
  },
  {
    question: "Varför säger shoppar ofta samlarprodukt eller inte för konsumtion?",
    answer:
      "Det är något många reagerar på. Shoppar kan sälja produkter som väldigt tydligt ser ut att vara gjorda för användning, men samtidigt formulera sig som om de bara vore samlarobjekt. Det är just den typen av gråzonsförvirring Candria ska hjälpa folk förstå bättre, utan att låtsas som att den inte finns.",
    tag: "Gråzon",
  },
  {
    question: "Vad undrar folk mest om när det gäller shoppar?",
    answer:
      "Främst tre saker: om shoppen känns seriös, hur leveranserna faktiskt fungerar i praktiken, och om produkterna motsvarar det som lovas. Just leverans, support, restocks och trovärdighet återkommer hela tiden i communityt.",
    tag: "Mönster",
  },
  {
    question: "Är leverans verkligen en så stor grej i communityt?",
    answer:
      "Ja, verkligen. Det dyker ofta upp frågor om Postnord, förseningar, uteblivna beställningar och hur snabbt olika shoppar faktiskt skickar. För många är leveransfrågan nästan lika viktig som själva produkten.",
    tag: "Leverans",
  },
  {
    question: "Varför pratar folk så mycket om labbrapporter och claims?",
    answer:
      "För att många försöker skilja på vad som faktiskt verkar seriöst och vad som bara är marknadsföring. Folk vill förstå om något verkligen är testat, om rapporter känns trovärdiga och om nya produktnamn faktiskt betyder något eller mest låter bra.",
    tag: "Kvalitet",
  },
  {
    question: "Är Candria till för nybörjare eller mer insatta personer?",
    answer:
      "Båda. Nya personer ska kunna få en lugn startpunkt och känna att de äntligen förstår vad folk pratar om. Mer insatta personer ska kunna få bättre överblick, jämförelser och dokumentation än vad som idag ofta finns utspritt i communityt.",
    tag: "Målgrupp",
  },
  {
    question: "Kommer Candria ersätta Reddit eller Discord?",
    answer:
      "Nej, inte riktigt. Communityt behövs fortfarande. Tanken är snarare att Candria ska vara platsen där det viktigaste från allt det där blir lättare att hitta, lättare att förstå och mycket mindre rörigt.",
    tag: "Community",
  },
];

const candriaHelp = [
  {
    title: "Börja här",
    text: "En enkel första sida för personer som vill förstå marknaden utan att kunna något innan.",
  },
  {
    title: "Läget i Sverige",
    text: "En tydlig överblick över vad folk pratar om, vad som verkar aktuellt och vad som känns osäkert.",
  },
  {
    title: "Trusted shoppar",
    text: "En renare överblick över shoppar som ofta nämns, med kort info och tydligare struktur.",
  },
  {
    title: "Produktinfo",
    text: "En plats där folk senare ska kunna förstå produkter, format och dokumentation enklare.",
  },
];

const compareModes: CompareMode[] = [
  {
    id: "new",
    label: "Jag är ny",
    title: "Om du är ny i marknaden",
    text: "Börja med något som känns tydligt, lätt att läsa och inte för rörigt direkt.",
    primary: "Kushy",
    why: "Kushy känns lättare att förstå snabbt eftersom shoppen har mer tydligt THCA-fokus och ett mer avskalat sortiment.",
    secondary: [
      { name: "Upgrade Natural", reason: "Bra om du vill se fler format direkt." },
      { name: "Hazey", reason: "Bra om du också vill kolla andra cannabinoider." },
    ],
  },
  {
    id: "wide",
    label: "Brett utbud",
    title: "Om du vill jämföra mycket",
    text: "Välj en shop där du snabbt kan få känsla för fler produktformat och fler vinklar av marknaden.",
    primary: "Upgrade Natural",
    why: "Upgrade Natural känns stark om du vill se bredare sortiment direkt och få en större första överblick.",
    secondary: [
      { name: "Hazey", reason: "Liknande bredare känsla med flera cannabinoider." },
      { name: "Swizzle", reason: "Bra om du vill jämföra fler typer av produkter." },
    ],
  },
  {
    id: "thca",
    label: "THCA-fokus",
    title: "Om du främst bryr dig om THCA",
    text: "Här passar shoppar som känns mer fokuserade på just THCA och mindre som bred allmän shop först.",
    primary: "Kushy",
    why: "Kushy känns mest ren i sin THCA-profil med buds, carts, koncentrat och isolat tydligt framme.",
    secondary: [
      { name: "Upgrade Natural", reason: "Bra sekundär om du vill ha mer bredd också." },
      { name: "Hazey", reason: "Har också tydligt THCA-innehåll." },
    ],
  },
  {
    id: "browse",
    label: "Bara kolla runt",
    title: "Om du bara vill få känsla för marknaden först",
    text: "Då handlar det mindre om att välja perfekt direkt och mer om att se hur olika shoppar känns och skiljer sig åt.",
    primary: "Hazey",
    why: "Hazey känns bra om du bara vill orientera dig först och få känsla för flera kategorier utan att låsa dig direkt.",
    secondary: [
      { name: "Swizzle", reason: "Bra om du vill jämföra fler produkttyper." },
      { name: "Upgrade Natural", reason: "Bra om du vill se bredd snabbt." },
    ],
  },
];

function TabButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button className={`tab-btn ${active ? "active" : ""}`} onClick={onClick}>
      {children}
    </button>
  );
}

function SectionHeader({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text?: string;
}) {
  return (
    <div className="section-header">
      <div className="eyebrow">{eyebrow}</div>
      <h2>{title}</h2>
      {text ? <p>{text}</p> : null}
    </div>
  );
}

function ShopCard({ shop, review = false }: { shop: Shop; review?: boolean }) {
  return (
    <div className={`shop-card ${review ? "review" : ""}`}>
      <div className="shop-card-top">
        <div className="shop-main">
          <div className={`shop-brand ${review ? "review" : ""}`}>{shop.brand}</div>
          <div className="shop-meta">
            <div className="shop-title-row">
              <h3>{shop.name}</h3>
              <span className={`shop-status ${review ? "review" : ""}`}>
                {shop.status}
              </span>
            </div>
            <div className="shop-domain">{shop.domain}</div>
            <p className="shop-short">{shop.short}</p>
          </div>
        </div>

        <a className={`pill-link ${review ? "danger" : ""}`} href={shop.url} target="_blank" rel="noreferrer">
          Till hemsidan
        </a>
      </div>

      <div className={`shop-details ${review ? "review" : ""}`}>
        <div className="detail-row">
          <span>Bra för</span>
          <span>{shop.bestFor}</span>
        </div>
        <div className="detail-row">
          <span>Sortiment</span>
          <span>{shop.focus}</span>
        </div>
        <div className="detail-row">
          <span>Leverans</span>
          <span>{shop.shipping}</span>
        </div>
        <div className="detail-row">
          <span>Notering</span>
          <span>{shop.note}</span>
        </div>
      </div>

      <div className="tags-row">
        {shop.tags.map((tag) => (
          <span key={tag} className={`tag ${review ? "review" : ""}`}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("start");
  const [openFaq, setOpenFaq] = useState(0);
  const [compareMode, setCompareMode] = useState<CompareModeId>("new");

  const activeCompare = useMemo(
    () => compareModes.find((mode) => mode.id === compareMode) ?? compareModes[0],
    [compareMode]
  );

  const primaryShop = trustedShops.find((shop) => shop.name === activeCompare.primary);
  const secondaryShops = activeCompare.secondary.map((item) => ({
    info: item,
    shop: trustedShops.find((shop) => shop.name === item.name),
  }));

  const changeTab = (tab: TabId) => {
    setActiveTab(tab);
    setMenuOpen(false);
  };

  return (
    <div className={`app-shell ${darkMode ? "theme-dark" : ""}`}>
      <header className="topbar">
        <div className="container topbar-inner">
          <button className="brand" onClick={() => changeTab("start")}>
            <div className="brand-mark" />
            <div>
              <div className="brand-name">Candria</div>
              <div className="brand-domain">candria.se</div>
            </div>
          </button>

          <nav className="desktop-nav">
            {tabs.map((tab) => (
              <TabButton
                key={tab.id}
                active={activeTab === tab.id}
                onClick={() => changeTab(tab.id)}
              >
                {tab.label}
              </TabButton>
            ))}
          </nav>

          <div className="topbar-actions">
            <button
              className="icon-btn"
              onClick={() => setDarkMode((v) => !v)}
              aria-label="Byt tema"
            >
              {darkMode ? <SunMedium size={18} /> : <Moon size={18} />}
            </button>
            <button
              className="icon-btn mobile-only"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Öppna meny"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {menuOpen ? (
          <div className="mobile-nav">
            <div className="container mobile-nav-inner">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`mobile-nav-btn ${activeTab === tab.id ? "active" : ""}`}
                  onClick={() => changeTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </header>

      <main className="main-area">
        <AnimatePresence mode="wait">
          {activeTab === "start" && (
            <motion.section
              key="start"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="container hero"
            >
              <div className="hero-grid">
                <div>
                  <div className="hero-pill">
                    <Newspaper size={16} />
                    Svensk överblick för THCA och altnoider
                  </div>

                  <h1>Candria, alt-noider på allvar.</h1>

                  <p className="hero-text">
                    Alt-noid communityt är äkta och intresset är stort. Problemet är
                    att informationen ofta är splittrad, rörig och svår att lita på.
                    Candria är tänkt att bli en lugnare och mer seriös plats där man
                    kan förstå marknaden, följa läget och hitta bättre information.
                  </p>

                  <div className="hero-actions">
                    <button className="btn btn-primary" onClick={() => changeTab("faq")}>
                      Se FAQ <ArrowRight size={16} />
                    </button>
                    <button className="btn btn-secondary" onClick={() => changeTab("shops")}>
                      Se trusted shoppar
                    </button>
                    <button className="btn btn-premium" onClick={() => changeTab("compare")}>
                      Jämför shoppar <ArrowRight size={16} />
                    </button>
                  </div>
                </div>

                <div className="hero-side-card">
                  <div className="eyebrow">Kort sagt</div>
                  <div className="hero-bullet-list">
                    <div>Förstå marknaden enklare</div>
                    <div>Få bättre överblick över shoppar och produkter</div>
                    <div>Hitta mer samlad och seriös information</div>
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {activeTab === "faq" && (
            <motion.section
              key="faq"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="container section"
            >
              <SectionHeader
                eyebrow="FAQ"
                title="Frågorna folk faktiskt ställer."
                text="Byggd runt samma saker som hela tiden återkommer i communityt: THCA, trusted shops, leveranser, gråzoner, legitimitet, labbrapporter och den eviga frågan om var man ens ska börja."
              />

              <div className="faq-layout">
                <div className="faq-side">
                  <div className="info-panel">
                    <div className="eyebrow">FAQ overview</div>
                    <h3>En enklare väg in i hela scenen.</h3>
                    <p>
                      Den här sidan är till för att man snabbt ska förstå både
                      Candria och marknaden, utan att behöva gräva igenom massor av
                      gamla trådar först.
                    </p>
                  </div>

                  <div className="info-panel">
                    <div className="eyebrow">Det folk oftast undrar</div>
                    <div className="chip-row">
                      {[
                        "THCA",
                        "Trusted shoppar",
                        "Leveranser",
                        "Labbrapporter",
                        "Gråzon",
                        "Var börjar man?",
                      ].map((item) => (
                        <span key={item} className="chip">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="faq-list">
                  {faqItems.map((item, index) => {
                    const isOpen = openFaq === index;
                    return (
                      <div key={item.question} className="faq-item">
                        <button
                          className="faq-button"
                          onClick={() => setOpenFaq(isOpen ? -1 : index)}
                        >
                          <div className="faq-left">
                            <div className="faq-number">
                              {String(index + 1).padStart(2, "0")}
                            </div>
                            <div>
                              <div className="faq-tag">{item.tag}</div>
                              <div className="faq-question">{item.question}</div>
                            </div>
                          </div>

                          <motion.div
                            animate={{ rotate: isOpen ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="faq-icon"
                          >
                            <ChevronDown size={18} />
                          </motion.div>
                        </button>

                        <AnimatePresence initial={false}>
                          {isOpen ? (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.22 }}
                              className="faq-answer-wrap"
                            >
                              <div className="faq-answer">{item.answer}</div>
                            </motion.div>
                          ) : null}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.section>
          )}

          {activeTab === "shops" && (
            <motion.section
              key="shops"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="container section"
            >
              <SectionHeader
                eyebrow="Trusted shoppar"
                title="En enklare överblick över shoppar folk ofta nämner."
                text="Gjort för att vara lätt att rekommendera vidare: kolla listan, förstå skillnaderna snabbt och välj sedan själv vad som känns bäst."
              />

              <div className="section-note">
                <ShieldCheck size={16} />
                Candria trusted shop list
              </div>

              <div className="stack">
                {trustedShops.map((shop) => (
                  <ShopCard key={shop.name} shop={shop} />
                ))}
              </div>
            </motion.section>
          )}

          {activeTab === "compare" && (
            <motion.section
              key="compare"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="container section"
            >
              <div className="compare-shell">
                <div className="compare-glow compare-glow-1" />
                <div className="compare-glow compare-glow-2" />
                <div className="compare-glow compare-glow-3" />

                <div className="compare-header">
                  <div className="eyebrow compare-eyebrow">Jämför shoppar</div>
                  <h2>Hitta en rimlig startpunkt för just det du letar efter.</h2>
                  <p>
                    En mörk, enkel market map där Candria hjälper dig orientera dig
                    snabbare mellan shopparna.
                  </p>
                </div>

                <div className="compare-mode-row">
                  {compareModes.map((mode) => (
                    <button
                      key={mode.id}
                      className={`compare-mode-btn ${
                        compareMode === mode.id ? "active" : ""
                      }`}
                      onClick={() => setCompareMode(mode.id)}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>

                <div className="compare-grid">
                  <div className="compare-map-card">
                    <div className="eyebrow compare-eyebrow">Candria market map</div>
                    <h3>{activeCompare.title}</h3>
                    <p>{activeCompare.text}</p>

                    <div className="compare-map">
                      <div className="compare-ring ring-1" />
                      <div className="compare-ring ring-2" />
                      <div className="compare-ring ring-3" />

                      <motion.div
                        className="compare-center"
                        animate={{ scale: [1, 1.04, 1] }}
                        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <div className="compare-center-small">Du söker</div>
                        <div className="compare-center-label">{activeCompare.label}</div>
                      </motion.div>

                      {primaryShop && (
                        <div className="compare-node primary">
                          <div className="compare-node-head">
                            <div className="compare-node-brand">{primaryShop.brand}</div>
                            <div>
                              <div className="compare-node-title">{primaryShop.name}</div>
                              <div className="compare-node-sub">Huvudmatch</div>
                            </div>
                          </div>
                          <p>{activeCompare.why}</p>
                          <a href={primaryShop.url} target="_blank" rel="noreferrer">
                            Till hemsidan
                          </a>
                        </div>
                      )}

                      {secondaryShops[0]?.shop && (
                        <div className="compare-node secondary secondary-top">
                          <div className="compare-node-head">
                            <div className="compare-node-brand">
                              {secondaryShops[0].shop.brand}
                            </div>
                            <div>
                              <div className="compare-node-title">
                                {secondaryShops[0].shop.name}
                              </div>
                              <div className="compare-node-sub">Alternativ</div>
                            </div>
                          </div>
                          <a
                            href={secondaryShops[0].shop.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Till hemsidan
                          </a>
                        </div>
                      )}

                      {secondaryShops[1]?.shop && (
                        <div className="compare-node secondary secondary-bottom">
                          <div className="compare-node-head">
                            <div className="compare-node-brand">
                              {secondaryShops[1].shop.brand}
                            </div>
                            <div>
                              <div className="compare-node-title">
                                {secondaryShops[1].shop.name}
                              </div>
                              <div className="compare-node-sub">Alternativ</div>
                            </div>
                          </div>
                          <a
                            href={secondaryShops[1].shop.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Till hemsidan
                          </a>
                        </div>
                      )}

                      <div className="compare-line line-1" />
                      <div className="compare-line line-2" />
                      <div className="compare-line line-3" />
                    </div>
                  </div>

                  <div className="compare-side">
                    <div className="compare-side-card">
                      <div className="eyebrow compare-eyebrow">Varför den här matchen?</div>
                      {primaryShop && (
                        <>
                          <div className="compare-side-shop">
                            <div className="compare-side-brand">{primaryShop.brand}</div>
                            <div>
                              <div className="compare-side-title">{primaryShop.name}</div>
                              <div className="compare-side-sub">{primaryShop.domain}</div>
                            </div>
                          </div>
                          <div className="compare-side-copy">{activeCompare.why}</div>
                        </>
                      )}
                    </div>

                    <div className="compare-side-card">
                      <div className="eyebrow compare-eyebrow">Alla val i den här matchen</div>
                      <div className="compare-side-list">
                        {primaryShop && (
                          <div className="compare-side-list-item">
                            <div className="compare-side-shop">
                              <div className="compare-side-brand">{primaryShop.brand}</div>
                              <div>
                                <div className="compare-side-title">{primaryShop.name}</div>
                                <div className="compare-side-sub">Huvudmatch</div>
                              </div>
                            </div>
                            <a href={primaryShop.url} target="_blank" rel="noreferrer">
                              Till hemsidan
                            </a>
                          </div>
                        )}

                        {secondaryShops.map(({ info, shop }) =>
                          shop ? (
                            <div key={shop.name} className="compare-side-list-item">
                              <div className="compare-side-shop">
                                <div className="compare-side-brand">{shop.brand}</div>
                                <div>
                                  <div className="compare-side-title">{shop.name}</div>
                                  <div className="compare-side-sub">{shop.domain}</div>
                                </div>
                              </div>
                              <p>{info.reason}</p>
                              <a href={shop.url} target="_blank" rel="noreferrer">
                                Till hemsidan
                              </a>
                            </div>
                          ) : null
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {activeTab === "review" && (
            <motion.section
              key="review"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="container section"
            >
              <SectionHeader
                eyebrow="Shoppar med varningsflaggor"
                title="Shoppar som just nu bör kollas extra försiktigt."
                text="Här betyder det inte automatiskt scam eller svartlistning. Det betyder bara att det finns tillräckligt många färska varningssignaler för att man bör läsa på innan man beställer."
              />

              <div className="section-note danger">
                <AlertTriangle size={16} />
                Candria review list
              </div>

              <div className="stack">
                {reviewShops.map((shop) => (
                  <ShopCard key={shop.name} shop={shop} review />
                ))}
              </div>
            </motion.section>
          )}

          {activeTab === "candria" && (
            <motion.section
              key="candria"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="container section"
            >
              <SectionHeader
                eyebrow="Vad Candria ska göra"
                title="En mer seriös middle ground för marknaden."
                text="Tanken är inte att vara ett forum eller en shop, utan en bättre plats mitt emellan där informationen känns lugnare, tydligare och mer användbar."
              />

              <div className="grid-two">
                {candriaHelp.map((item) => (
                  <InfoCard key={item.title} title={item.title} text={item.text} />
                ))}
              </div>
            </motion.section>
          )}

          {activeTab === "next" && (
            <motion.section
              key="next"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="container section"
            >
              <SectionHeader
                eyebrow="Nästa steg"
                title="Härifrån bygger man riktiga sidor, inte bara idéer."
                text="Det naturliga nästa är att göra varje del till en riktig sida med ännu enklare struktur och ännu tydligare information."
              />

              <div className="next-panel">
                <div className="next-grid">
                  {["Börja här", "Läget i Sverige", "Trusted shoppar", "Produktinfo"].map(
                    (item) => (
                      <div key={item} className="next-item">
                        <Compass size={16} />
                        <span>{item}</span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;

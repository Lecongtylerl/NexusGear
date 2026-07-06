/* ============================================================
   NexusGear · SEG3125 Assignment 4 (E-Commerce)
   Tyler Le · 300401351

   React 18 application (JSX). Loaded by index.html and compiled
   in-browser by Babel Standalone using the classic runtime, so it
   uses the global React.createElement (no build step required).

   Components: App (root + faceted-search state) · ProductCard ·
   QuickView · CartDrawer · Checkout (4-step wizard) · Survey.
   ============================================================ */

    const { useState, useMemo, useEffect, useRef } = React;

    /* ============================================================
       DATA: semantic network of features drives the faceted search
       ============================================================ */
    const COLORS = {
      Black:  "#1e1c22",
      White:  "#e8ecf3",
      Blue:   "#4D8EF8",
      Pink:   "#EC4899",
      Red:    "#F43F5E",
      RGB:    "linear-gradient(135deg,#F43F5E,#F59E0B,#22C55E,#4D8EF8,#A855F7)"
    };

    const CATEGORIES = ["Keyboards","Mice","Headsets","Monitors","Controllers","Chairs","Webcams","Mousepads"];

    // Clean, consistent line-icon glyphs per category (professional catalog look).
    function CatIcon({ cat, size = 24 }) {
      const c = { width:size, height:size, viewBox:"0 0 24 24", fill:"none",
        stroke:"currentColor", strokeWidth:1.35, strokeLinecap:"round", strokeLinejoin:"round" };
      switch (cat) {
        case "Keyboards": return (<svg {...c}><rect x="2.5" y="6.5" width="19" height="11" rx="2"/><path d="M6 10h.01M9 10h.01M12 10h.01M15 10h.01M18 10h.01M6 13h.01M9 13h.01M15 13h.01M18 13h.01"/><path d="M8.5 15.5h7"/></svg>);
        case "Mice": return (<svg {...c}><rect x="6.5" y="3" width="11" height="18" rx="5.5"/><path d="M12 3.5v6"/></svg>);
        case "Headsets": return (<svg {...c}><path d="M4 13v-1a8 8 0 0 1 16 0v1"/><rect x="2.8" y="12.5" width="4.2" height="6.5" rx="1.6"/><rect x="17" y="12.5" width="4.2" height="6.5" rx="1.6"/></svg>);
        case "Monitors": return (<svg {...c}><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M12 16v4M8 20h8"/></svg>);
        case "Controllers": return (<svg {...c}><rect x="2.5" y="8.5" width="19" height="9" rx="4.5"/><path d="M7 11.5v3M5.5 13h3"/><circle cx="16" cy="12.6" r="0.9" fill="currentColor" stroke="none"/><circle cx="17.7" cy="14.3" r="0.9" fill="currentColor" stroke="none"/></svg>);
        case "Chairs": return (<svg {...c}><rect x="8" y="3" width="8" height="8" rx="2"/><path d="M7.5 13.5h9M12 14v3M8.5 19.5l3.5-2 3.5 2"/></svg>);
        case "Webcams": return (<svg {...c}><circle cx="12" cy="10" r="5"/><circle cx="12" cy="10" r="1.7"/><path d="M12 15v3M8.5 20h7"/></svg>);
        case "Mousepads": return (<svg {...c}><rect x="2.5" y="7" width="19" height="10" rx="2"/><rect x="12.8" y="9.5" width="4" height="5.5" rx="2"/></svg>);
        default: return null;
      }
    }

    // Real product photography (transparent PNGs, freely licensed via Wikimedia
    // Commons, processed locally). Mousepads fall back to the line icon.
    const CAT_IMG = {
      Keyboards:   "img/keyboard.png",
      Mice:        "img/mouse.png",
      Headsets:    "img/headset.png",
      Monitors:    "img/monitor.png",
      Controllers: "img/controller.png",
      Chairs:      "img/chair.png",
      Webcams:     "img/webcam.png",
    };
    function ProductMedia({ cat, size = 120, iconSize = 58 }) {
      const src = CAT_IMG[cat];
      if (!src) return <CatIcon cat={cat} size={iconSize} />;
      return (
        <img src={src} alt={cat} loading="lazy"
          style={{ maxWidth:"76%", maxHeight:size, objectFit:"contain",
                   filter:"drop-shadow(0 12px 20px rgba(0,0,0,0.45))" }} />
      );
    }

    // helper to build a product
    let _id = 0;
    const P = (o) => ({ id: ++_id, reviews: o.reviews ?? Math.round(40+o.rating*30), stock:true, isNew:false, connectivity:"Wired", ...o });

    const PRODUCTS = [
      P({ name:"Vortex TKL Mechanical Keyboard", brand:"Nexus", cat:"Keyboards", price:119, old:149, rating:4.8, colors:["Black","RGB"], connectivity:"Wired", isNew:true,
          specs:{ Switches:"Hot-swap Red", Layout:"87-key TKL", Backlight:"Per-key RGB", Keycaps:"PBT Double-shot" },
          blurb:"Type and clash with confidence. Hot-swappable switches let you tune the feel exactly how you like it, and the double-shot PBT keycaps are built to outlast your longest ranked grind." }),
      P({ name:"Vortex Pro Wireless Keyboard", brand:"Nexus", cat:"Keyboards", price:169, rating:4.6, colors:["White","Black"], connectivity:"Wireless",
          specs:{ Switches:"Brown Tactile", Layout:"Full-size", Battery:"200 hr", Connection:"2.4GHz + BT" },
          blurb:"Go cable-free without giving up speed. A 200-hour battery and lag-free 2.4GHz dongle mean you can move it anywhere and never think about it." }),
      P({ name:"Riot60 Compact Keyboard", brand:"Riot", cat:"Keyboards", price:79, old:99, rating:4.4, colors:["Pink","Black","White"], connectivity:"Wireless",
          specs:{ Switches:"Linear Red", Layout:"60% Compact", Battery:"120 hr", Weight:"580 g" },
          blurb:"Small desk? No problem. The 60% layout frees up room for big mouse swings while still feeling satisfyingly clicky." }),

      P({ name:"Talon Lightweight Gaming Mouse", brand:"Apex", cat:"Mice", price:59, rating:4.9, colors:["Black","White"], connectivity:"Wired", isNew:true,
          specs:{ Sensor:"26K DPI Optical", Weight:"58 g", Buttons:"6 Programmable", Polling:"1000 Hz" },
          blurb:"Featherlight at 58 grams, so flick shots feel effortless. The 26K sensor tracks every micro-movement with no smoothing and no acceleration, just you." }),
      P({ name:"Talon Wireless Superlight", brand:"Apex", cat:"Mice", price:99, old:129, rating:4.8, colors:["Black","Pink"], connectivity:"Wireless",
          specs:{ Sensor:"30K DPI", Weight:"63 g", Battery:"90 hr", Polling:"4000 Hz" },
          blurb:"All the precision of our wired Talon, now completely untethered. A blazing 4000Hz wireless link keeps latency down where pros need it." }),
      P({ name:"Titan MMO Mouse", brand:"Titan", cat:"Mice", price:74, rating:4.3, colors:["Black","RGB"], connectivity:"Wired",
          specs:{ Sensor:"18K DPI", Weight:"105 g", Buttons:"12 Side Buttons", Polling:"1000 Hz" },
          blurb:"Twelve programmable side buttons put your entire ability bar under your thumb. Built for MMO and MOBA players who never want to reach for a key." }),

      P({ name:"Halo 7.1 Surround Headset", brand:"Halo", cat:"Headsets", price:129, old:159, rating:4.7, colors:["Black","Blue"], connectivity:"Wired", isNew:true,
          specs:{ Audio:"7.1 Virtual Surround", Driver:"50mm Neodymium", Mic:"Detachable Noise-cancel", Weight:"320 g" },
          blurb:"Hear the footsteps before you see them. Virtual 7.1 surround turns positional audio into a genuine competitive edge, and the memory-foam cups stay comfy for hours." }),
      P({ name:"Halo Air Wireless Headset", brand:"Halo", cat:"Headsets", price:159, rating:4.5, colors:["White","Black"], connectivity:"Wireless",
          specs:{ Audio:"Spatial Audio", Driver:"40mm", Battery:"40 hr", Mic:"Retractable" },
          blurb:"Cut the cord and keep the clarity. Forty hours of battery gets you through the longest sessions, and the retractable mic tucks away when you're just vibing." }),
      P({ name:"Volt Studio Headset", brand:"Volt", cat:"Headsets", price:89, rating:4.2, colors:["Black","Pink"], connectivity:"Wired",
          specs:{ Audio:"Stereo Hi-Fi", Driver:"53mm", Mic:"Flip-to-mute", Weight:"290 g" },
          blurb:"Crisp highs, punchy lows, and a flip-to-mute mic that just works. A dependable all-rounder for gaming, calls, and everything in between." }),

      P({ name:"Nexus 27\" 165Hz Monitor", brand:"Nexus", cat:"Monitors", price:279, old:339, rating:4.8, colors:["Black"], connectivity:"Wired", isNew:true,
          specs:{ Panel:"27\" IPS QHD", Refresh:"165 Hz", Response:"1 ms", Sync:"FreeSync + G-Sync" },
          blurb:"Buttery 165Hz on a razor-sharp QHD IPS panel. Motion stays clean and colours stay true. This is the upgrade your rig has been waiting for." }),
      P({ name:"Apex 24\" 240Hz Esports Monitor", brand:"Apex", cat:"Monitors", price:319, rating:4.7, colors:["Black"], connectivity:"Wired",
          specs:{ Panel:"24\" Fast IPS FHD", Refresh:"240 Hz", Response:"0.5 ms", Sync:"G-Sync" },
          blurb:"Built for one thing: winning. A 240Hz refresh and 0.5ms response give competitive players the smoothest, fastest image money can buy." }),
      P({ name:"Volt 34\" Ultrawide Curved", brand:"Volt", cat:"Monitors", price:449, old:529, rating:4.6, colors:["Black","White"], connectivity:"Wired",
          specs:{ Panel:"34\" VA Ultrawide", Refresh:"144 Hz", Response:"1 ms", Curve:"1500R" },
          blurb:"Wrap yourself in the game. This 34\" 1500R ultrawide fills your peripheral vision for the most immersive racing and open-world sessions." }),

      P({ name:"Titan Wireless Controller", brand:"Titan", cat:"Controllers", price:64, rating:4.5, colors:["Black","White","Blue"], connectivity:"Wireless",
          specs:{ Connection:"BT + 2.4GHz", Battery:"30 hr", Feedback:"Hall-effect sticks", Triggers:"Adaptive" },
          blurb:"Hall-effect sticks mean stick drift is a thing of the past. Comfortable, precise, and ready for PC or console right out of the box." }),
      P({ name:"Riot Pro Elite Controller", brand:"Riot", cat:"Controllers", price:129, old:149, rating:4.7, colors:["Black","RGB"], connectivity:"Wired", isNew:true,
          specs:{ Connection:"Wired USB-C", Paddles:"4 Remappable", Triggers:"Hair-trigger locks", Grips:"Swappable" },
          blurb:"Four remappable back paddles and hair-trigger locks put pro-level control at your fingertips. Customize everything and play like the pros do." }),
      P({ name:"Volt Arcade Fight Stick", brand:"Volt", cat:"Controllers", price:99, rating:4.3, colors:["Black","Red"], connectivity:"Wired", stock:false,
          specs:{ Buttons:"8 Arcade", Joystick:"Ball-top", Connection:"USB-C", Compatible:"PC / Console" },
          blurb:"Bring the arcade home. Genuine arcade-grade buttons and a ball-top stick deliver the authentic fighting-game feel every combo deserves." }),

      P({ name:"Nexus Ergo Gaming Chair", brand:"Nexus", cat:"Chairs", price:299, old:369, rating:4.6, colors:["Black","Blue"], connectivity:"Wired",
          specs:{ Support:"4D Armrests", Recline:"90°–160°", Lumbar:"Adjustable", Rating:"Up to 150 kg" },
          blurb:"Your back will thank you at hour six. Adjustable lumbar support and 4D armrests keep you locked in comfort through the marathon sessions." }),
      P({ name:"Apex Racer Chair", brand:"Apex", cat:"Chairs", price:239, rating:4.3, colors:["Red","Black","White"], connectivity:"Wired",
          specs:{ Support:"3D Armrests", Recline:"90°–155°", Material:"PU Leather", Rating:"Up to 130 kg" },
          blurb:"Race-inspired looks with everyday comfort. Breathable PU leather and a bold silhouette make your setup look as fast as you play." }),

      P({ name:"Nexus 4K Streaming Webcam", brand:"Nexus", cat:"Webcams", price:119, old:139, rating:4.5, colors:["Black"], connectivity:"Wired", isNew:true,
          specs:{ Resolution:"4K UHD 30fps", FOV:"90° Adjustable", Focus:"Auto + HDR", Mic:"Dual Stereo" },
          blurb:"Show up sharp on every stream. Crisp 4K with HDR and autofocus keeps you looking pro whether you're casting, on calls, or going live." }),
      P({ name:"Volt 1080p Streamer Cam", brand:"Volt", cat:"Webcams", price:69, rating:4.2, colors:["Black","White"], connectivity:"Wired",
          specs:{ Resolution:"1080p 60fps", FOV:"78°", Focus:"Fixed", Mic:"Noise-reducing" },
          blurb:"Smooth 1080p at 60fps for the streamer on a budget. Plug it in, hit go live, and let your gameplay do the talking." }),

      P({ name:"Nexus XL Desk Mat", brand:"Nexus", cat:"Mousepads", price:29, old:39, rating:4.7, colors:["Black","Blue","RGB"], connectivity:"Wired",
          specs:{ Size:"900 × 400 mm", Surface:"Micro-textured cloth", Base:"Anti-slip rubber", Edge:"Stitched" },
          blurb:"One smooth surface for keyboard and mouse alike. The micro-textured cloth balances speed and control, and stitched edges keep it looking fresh." }),
      P({ name:"Apex Glass Gaming Pad", brand:"Apex", cat:"Mousepads", price:44, rating:4.4, colors:["Black","White"], connectivity:"Wired",
          specs:{ Size:"500 × 400 mm", Surface:"Tempered glass", Base:"Silicone feet", Speed:"Ultra-fast" },
          blurb:"For players who want zero friction. A tempered-glass surface delivers the fastest, most consistent glide you've ever felt under your mouse." }),
      P({ name:"Riot RGB Mousepad", brand:"Riot", cat:"Mousepads", price:34, rating:4.3, colors:["RGB","Black","Pink"], connectivity:"Wired",
          specs:{ Size:"800 × 300 mm", Surface:"Cloth", Lighting:"14-zone RGB", Base:"Rubber" },
          blurb:"Light up your battlestation. Fourteen zones of customizable RGB glow around a smooth cloth surface that's built to game on." }),
    ];

    const BRANDS = [...new Set(PRODUCTS.map(p=>p.cat==="_"?null:p.brand))].filter(Boolean).sort();
    const CONNECTIVITY = ["Wired","Wireless"];
    const PRICE_BRACKETS = [
      { id:"any",  label:"Any price", test:()=>true },
      { id:"u50",  label:"Under $50",     test:p=>p.price<50 },
      { id:"50",   label:"$50 – $100",    test:p=>p.price>=50 && p.price<100 },
      { id:"100",  label:"$100 – $200",   test:p=>p.price>=100 && p.price<200 },
      { id:"200",  label:"$200 & up",     test:p=>p.price>=200 },
    ];
    const RATING_OPTS = [
      { id:0,   label:"Any rating" },
      { id:4,   label:"4.0★ & up" },
      { id:4.5, label:"4.5★ & up" },
    ];

    /* ============================================================
       Small helpers
       ============================================================ */
    const fmt = (n) => "$" + n.toFixed(2);
    const Stars = ({ r, reviews }) => {
      const full = Math.floor(r);
      const half = r - full >= 0.5;
      let s = "★".repeat(full) + (half ? "½" : "");
      return (
        <div className="stars" aria-label={r + " out of 5 stars"}>
          {"★".repeat(full)}{half ? "⯨" : ""}<span style={{color:"var(--text-muted)"}}>{"★".repeat(5-full-(half?1:0))}</span>
          {reviews != null && <span className="rev">{r.toFixed(1)} ({reviews})</span>}
        </div>
      );
    };
    const swatchBg = (c) => ({ background: COLORS[c], ...(c==="White"?{}:{}) });

    /* ============================================================
       APP
       ============================================================ */
    function App() {
      // ---- faceted search state ----
      const [search, setSearch]     = useState("");
      const [cats, setCats]         = useState([]);
      const [brands, setBrands]     = useState([]);
      const [colors, setColors]     = useState([]);
      const [conns, setConns]       = useState([]);
      const [priceB, setPriceB]     = useState("any");
      const [minRating, setMinRating] = useState(0);
      const [inStock, setInStock]   = useState(false);
      const [sort, setSort]         = useState("featured");
      const [filtersOpen, setFiltersOpen] = useState(false);

      // ---- shopping state ----
      const [cart, setCart]         = useState([]);          // [{id, qty}]
      const [cartOpen, setCartOpen] = useState(false);
      const [quickView, setQuickView] = useState(null);
      const [checkout, setCheckout] = useState(false);
      const [survey, setSurvey]     = useState(false);
      const [toast, setToast]       = useState(null);
      const [lastOrder, setLastOrder] = useState(null);

      const toastTimer = useRef(null);
      const notify = (msg) => {
        setToast(msg);
        clearTimeout(toastTimer.current);
        toastTimer.current = setTimeout(()=>setToast(null), 2200);
      };

      // ---- toggling helpers ----
      const toggle = (arr, setArr, v) =>
        setArr(arr.includes(v) ? arr.filter(x=>x!==v) : [...arr, v]);

      const activeFilterCount =
        cats.length + brands.length + colors.length + conns.length +
        (priceB!=="any"?1:0) + (minRating?1:0) + (inStock?1:0) + (search?1:0);

      const clearAll = () => {
        setSearch(""); setCats([]); setBrands([]); setColors([]);
        setConns([]); setPriceB("any"); setMinRating(0); setInStock(false);
      };

      // ---- FILTER + SORT (the faceted search engine) ----
      const results = useMemo(() => {
        const bracket = PRICE_BRACKETS.find(b=>b.id===priceB);
        let out = PRODUCTS.filter(p => {
          if (search && !(`${p.name} ${p.brand} ${p.cat}`.toLowerCase().includes(search.toLowerCase()))) return false;
          if (cats.length && !cats.includes(p.cat)) return false;
          if (brands.length && !brands.includes(p.brand)) return false;
          if (conns.length && !conns.includes(p.connectivity)) return false;
          if (colors.length && !p.colors.some(c=>colors.includes(c))) return false;
          if (!bracket.test(p)) return false;
          if (p.rating < minRating) return false;
          if (inStock && !p.stock) return false;
          return true;
        });
        const s = {
          featured: (a,b)=> (b.isNew-a.isNew) || (b.rating-a.rating),
          priceLow: (a,b)=> a.price-b.price,
          priceHigh:(a,b)=> b.price-a.price,
          rating:   (a,b)=> b.rating-a.rating,
          newest:   (a,b)=> b.isNew-a.isNew || b.id-a.id,
        }[sort];
        return [...out].sort(s);
      }, [search,cats,brands,colors,conns,priceB,minRating,inStock,sort]);

      // count helper for facet options (how many products match a given facet value, given the *other* active filters ignored for simplicity)
      const catCount = (c) => PRODUCTS.filter(p=>p.cat===c).length;
      const brandCount = (b) => PRODUCTS.filter(p=>p.brand===b).length;

      // ---- cart derived ----
      const cartDetailed = cart.map(l => ({ ...l, product: PRODUCTS.find(p=>p.id===l.id) }));
      const cartCount = cart.reduce((n,l)=>n+l.qty, 0);
      const subtotal = cartDetailed.reduce((s,l)=>s + l.product.price*l.qty, 0);

      const addToCart = (p) => {
        setCart(prev => {
          const found = prev.find(l=>l.id===p.id);
          if (found) return prev.map(l=>l.id===p.id?{...l, qty:l.qty+1}:l);
          return [...prev, { id:p.id, qty:1 }];
        });
        notify(`Added “${p.name}” to cart`);
      };
      const setQty = (id, d) => setCart(prev =>
        prev.map(l=>l.id===id?{...l, qty:Math.max(1, l.qty+d)}:l));
      const removeLine = (id) => setCart(prev => prev.filter(l=>l.id!==id));

      const onOrderComplete = (order) => {
        setLastOrder(order);
        setCart([]);
      };

      // lock body scroll when overlay open
      useEffect(() => {
        const open = cartOpen || quickView || checkout || survey;
        document.body.style.overflow = open ? "hidden" : "";
      }, [cartOpen, quickView, checkout, survey]);

      return (
        <>
          {/* ===== INCITE TO ACTION: promo bar ===== */}
          <div className="promo-bar">
            Summer Sale: save up to <b>25%</b> sitewide. Use code <span className="code">LEVELUP25</span> at checkout.
          </div>

          {/* ===== Header ===== */}
          <header className="site-header">
            <div className="container header-inner">
              <a className="brand" href="#top" aria-label="NexusGear home">
                <span className="logo"><i className="bi bi-controller"></i></span>
                Nexus<span>Gear</span>
              </a>
              <div className="search-wrap">
                <i className="bi bi-search" aria-hidden="true"></i>
                <input
                  className="search-input"
                  placeholder="Search keyboards, mice, monitors…"
                  value={search}
                  onChange={e=>setSearch(e.target.value)}
                  aria-label="Search products"
                />
              </div>
              <nav className="header-actions">
                <a className="header-link hide-sm" href="#deals">Deals</a>
                <button className="header-link hide-sm" onClick={()=>setSurvey(true)}>Feedback</button>
                <button className="cart-btn" onClick={()=>setCartOpen(true)} aria-label={`Cart, ${cartCount} items`}>
                  <i className="bi bi-bag"></i> Cart
                  {cartCount>0 && <span className="cart-count">{cartCount}</span>}
                </button>
              </nav>
            </div>
          </header>

          <div id="top"></div>

          {/* ===== Hero / deals (INCITE TO ACTION + brand voice) ===== */}
          <section className="hero" id="deals">
            <div className="container hero-inner">
              <div>
                <div className="hero-tag"><i className="bi bi-lightning-charge-fill"></i> Level up your setup</div>
                <h1>Gear built to <span className="gradient-text">win</span>.</h1>
                <p>Hand-picked keyboards, mice, headsets and more, tuned by gamers for gamers. Free 2-day shipping on every order over $75.</p>
                <a className="hero-cta" href="#catalog" onClick={()=>{setCats([]);}}>
                  <i className="bi bi-bag-check"></i> Shop the collection
                </a>
              </div>
              <div className="hero-deal-card">
                <div style={{fontSize:"0.75rem",fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",color:"var(--text-secondary)"}}>Deal of the week</div>
                <div className="big">25% OFF</div>
                <div style={{color:"var(--text-secondary)",fontSize:"0.9rem",marginTop:"4px"}}>All mechanical keyboards. Don't miss it!</div>
              </div>
            </div>
          </section>

          {/* ===== Shop ===== */}
          <main className="shop" id="catalog">
            <div className="container">
              <button className="filter-toggle" onClick={()=>setFiltersOpen(true)} style={{marginBottom:"18px"}}>
                <i className="bi bi-sliders"></i> Filters {activeFilterCount>0 && `(${activeFilterCount})`}
              </button>

              <div className="shop-grid">
                {/* ---- FACETED SEARCH SIDEBAR ---- */}
                {filtersOpen && <div className="overlay" style={{background:"rgba(4,7,13,0.5)",zIndex:110}} onClick={()=>setFiltersOpen(false)}></div>}
                <aside className={"filters" + (filtersOpen?" open":"")} aria-label="Product filters">
                  <div className="filters-head">
                    <h3><i className="bi bi-funnel"></i> Filters</h3>
                    <button className="clear-btn" onClick={clearAll} disabled={activeFilterCount===0}>Clear all</button>
                  </div>

                  <div className="facet">
                    <div className="facet-title">Category</div>
                    {CATEGORIES.map(c=>(
                      <label className="facet-opt" key={c}>
                        <input type="checkbox" checked={cats.includes(c)} onChange={()=>toggle(cats,setCats,c)} />
                        {c} <span className="count">{catCount(c)}</span>
                      </label>
                    ))}
                  </div>

                  <div className="facet">
                    <div className="facet-title">Brand</div>
                    {BRANDS.map(b=>(
                      <label className="facet-opt" key={b}>
                        <input type="checkbox" checked={brands.includes(b)} onChange={()=>toggle(brands,setBrands,b)} />
                        {b} <span className="count">{brandCount(b)}</span>
                      </label>
                    ))}
                  </div>

                  <div className="facet">
                    <div className="facet-title">Price</div>
                    {PRICE_BRACKETS.map(b=>(
                      <label className="facet-opt" key={b.id}>
                        <input type="radio" name="price" checked={priceB===b.id} onChange={()=>setPriceB(b.id)} />
                        {b.label}
                      </label>
                    ))}
                  </div>

                  <div className="facet">
                    <div className="facet-title">Color</div>
                    <div className="swatches">
                      {Object.keys(COLORS).map(c=>(
                        <button key={c} title={c} aria-label={c}
                          className={"swatch"+(colors.includes(c)?" on":"")}
                          style={swatchBg(c)} onClick={()=>toggle(colors,setColors,c)} />
                      ))}
                    </div>
                  </div>

                  <div className="facet">
                    <div className="facet-title">Connectivity</div>
                    {CONNECTIVITY.map(c=>(
                      <label className="facet-opt" key={c}>
                        <input type="checkbox" checked={conns.includes(c)} onChange={()=>toggle(conns,setConns,c)} />
                        {c}
                      </label>
                    ))}
                  </div>

                  <div className="facet">
                    <div className="facet-title">Rating</div>
                    {RATING_OPTS.map(o=>(
                      <label className="facet-opt" key={o.id}>
                        <input type="radio" name="rating" checked={minRating===o.id} onChange={()=>setMinRating(o.id)} />
                        {o.label}
                      </label>
                    ))}
                  </div>

                  <div className="facet">
                    <div className="toggle-row">
                      <span>In stock only</span>
                      <label className="switch">
                        <input type="checkbox" checked={inStock} onChange={e=>setInStock(e.target.checked)} />
                        <span className="slider"></span>
                      </label>
                    </div>
                  </div>

                  <button className="btn-ghost" style={{marginTop:"8px"}} onClick={()=>setFiltersOpen(false)}>
                    Show {results.length} results
                  </button>
                </aside>

                {/* ---- RESULTS ---- */}
                <section aria-label="Products">
                  <div className="toolbar">
                    <div className="result-count">
                      Showing <b>{results.length}</b> of {PRODUCTS.length} products
                    </div>
                    <label style={{display:"flex",alignItems:"center",gap:"8px",fontSize:"0.85rem",color:"var(--text-secondary)"}}>
                      Sort by
                      <select className="sort-select" value={sort} onChange={e=>setSort(e.target.value)}>
                        <option value="featured">Featured</option>
                        <option value="priceLow">Price: Low to High</option>
                        <option value="priceHigh">Price: High to Low</option>
                        <option value="rating">Highest Rated</option>
                        <option value="newest">Newest</option>
                      </select>
                    </label>
                  </div>

                  {/* active filter chips (visibility of system status) */}
                  {activeFilterCount>0 && (
                    <div className="active-chips">
                      {search && <span className="chip">“{search}” <button onClick={()=>setSearch("")} aria-label="Clear search"><i className="bi bi-x"></i></button></span>}
                      {cats.map(c=><span className="chip" key={c}>{c} <button onClick={()=>toggle(cats,setCats,c)}><i className="bi bi-x"></i></button></span>)}
                      {brands.map(b=><span className="chip" key={b}>{b} <button onClick={()=>toggle(brands,setBrands,b)}><i className="bi bi-x"></i></button></span>)}
                      {colors.map(c=><span className="chip" key={c}>{c} <button onClick={()=>toggle(colors,setColors,c)}><i className="bi bi-x"></i></button></span>)}
                      {conns.map(c=><span className="chip" key={c}>{c} <button onClick={()=>toggle(conns,setConns,c)}><i className="bi bi-x"></i></button></span>)}
                      {priceB!=="any" && <span className="chip">{PRICE_BRACKETS.find(b=>b.id===priceB).label} <button onClick={()=>setPriceB("any")}><i className="bi bi-x"></i></button></span>}
                      {minRating>0 && <span className="chip">{minRating}★ & up <button onClick={()=>setMinRating(0)}><i className="bi bi-x"></i></button></span>}
                      {inStock && <span className="chip">In stock <button onClick={()=>setInStock(false)}><i className="bi bi-x"></i></button></span>}
                    </div>
                  )}

                  {results.length===0 ? (
                    <div className="empty">
                      <i className="bi bi-search"></i>
                      <h3 style={{marginBottom:"8px"}}>No gear matches those filters</h3>
                      <p style={{marginBottom:"18px"}}>Try removing a filter or two. There's plenty more to explore.</p>
                      <button className="hero-cta" style={{color:"#fff"}} onClick={clearAll}>Clear all filters</button>
                    </div>
                  ) : (
                    <div className="product-grid">
                      {results.map(p=>(
                        <ProductCard key={p.id} p={p} onAdd={addToCart} onView={setQuickView} />
                      ))}
                    </div>
                  )}
                </section>
              </div>
            </div>
          </main>

          {/* ===== Footer ===== */}
          <footer className="site-footer">
            <div className="container footer-inner">
              <div>
                <div className="brand" style={{marginBottom:"8px"}}>
                  <span className="logo"><i className="bi bi-controller"></i></span> Nexus<span>Gear</span>
                </div>
                <p className="muted">Premium gaming &amp; tech gear · A SEG3125 prototype by Tyler Le</p>
              </div>
              <div style={{display:"flex",gap:"12px",flexWrap:"wrap"}}>
                <button className="back-portfolio" onClick={()=>setSurvey(true)}><i className="bi bi-chat-heart"></i> Share feedback</button>
                <a className="back-portfolio" href="https://sensational-figolla-2b5e9f.netlify.app/#cases"><i className="bi bi-arrow-left"></i> Back to portfolio</a>
              </div>
            </div>
          </footer>

          {/* ===== Overlays ===== */}
          {quickView && <QuickView p={quickView} onClose={()=>setQuickView(null)} onAdd={addToCart} />}
          {cartOpen && (
            <CartDrawer
              lines={cartDetailed} subtotal={subtotal} count={cartCount}
              onClose={()=>setCartOpen(false)} onQty={setQty} onRemove={removeLine}
              onCheckout={()=>{ setCartOpen(false); setCheckout(true); }}
            />
          )}
          {checkout && (
            <Checkout
              lines={cartDetailed} subtotal={subtotal}
              onClose={()=>setCheckout(false)}
              onComplete={onOrderComplete}
              onSurvey={()=>{ setCheckout(false); setSurvey(true); }}
            />
          )}
          {survey && <Survey onClose={()=>setSurvey(false)} onDone={()=>notify("Thanks for your feedback! 💜")} />}

          {toast && <div className="toast"><i className="bi bi-check-circle-fill"></i>{toast}</div>}
        </>
      );
    }

    /* ============================================================
       Product card
       ============================================================ */
    function ProductCard({ p, onAdd, onView }) {
      return (
        <article className="card">
          <div className="card-media" onClick={()=>onView(p)}>
            <ProductMedia cat={p.cat} size={128} iconSize={58} />
            <div className="card-badges">
              {p.old && <span className="badge badge-deal">Save {fmt(p.old-p.price)}</span>}
              {p.isNew && <span className="badge badge-new">New</span>}
              {!p.stock && <span className="badge badge-out">Sold out</span>}
            </div>
            <button className="quick-btn" onClick={(e)=>{e.stopPropagation(); onView(p);}} aria-label="Quick view"><i className="bi bi-eye"></i></button>
          </div>
          <div className="card-body">
            <div className="card-brand">{p.brand}</div>
            <div className="card-name" onClick={()=>onView(p)}>{p.name}</div>
            <Stars r={p.rating} reviews={p.reviews} />
            <div className="card-colors">
              {p.colors.map(c=><span key={c} className="mini-swatch" title={c} style={swatchBg(c)} />)}
            </div>
            <div className="card-foot">
              <div className="price">
                {p.old && <span className="old">{fmt(p.old)}</span>}{fmt(p.price)}
              </div>
              <button className="add-btn" disabled={!p.stock} onClick={()=>onAdd(p)}>
                <i className="bi bi-plus-lg"></i>{p.stock?"Add":"Sold out"}
              </button>
            </div>
          </div>
        </article>
      );
    }

    /* ============================================================
       Quick view (INFORM: full specs & description)
       ============================================================ */
    function QuickView({ p, onClose, onAdd }) {
      return (
        <div className="overlay" onClick={onClose}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="qv-media">
              <ProductMedia cat={p.cat} size={190} iconSize={104} />
              <button className="icon-btn" style={{position:"absolute",top:"14px",right:"14px",background:"rgba(14,13,17,0.6)"}} onClick={onClose} aria-label="Close"><i className="bi bi-x-lg"></i></button>
              <div className="card-badges">
                {p.old && <span className="badge badge-deal">Save {fmt(p.old-p.price)}</span>}
                {p.isNew && <span className="badge badge-new">New</span>}
              </div>
            </div>
            <div className="qv-body">
              <div className="card-brand">{p.brand} · {p.cat}</div>
              <h2>{p.name}</h2>
              <Stars r={p.rating} reviews={p.reviews} />
              <div style={{display:"flex",alignItems:"center",gap:"14px",margin:"16px 0"}}>
                <div className="price" style={{fontSize:"1.6rem"}}>
                  {p.old && <span className="old">{fmt(p.old)}</span>}{fmt(p.price)}
                </div>
                {p.stock
                  ? <span style={{color:"var(--success)",fontSize:"0.85rem",fontWeight:600}}><i className="bi bi-check-circle-fill"></i> In stock</span>
                  : <span style={{color:"var(--text-muted)",fontSize:"0.85rem",fontWeight:600}}>Currently sold out</span>}
              </div>
              <p className="qv-blurb">{p.blurb}</p>

              <div className="spec-list">
                {Object.entries(p.specs).map(([k,v])=>(
                  <div className="spec-row" key={k}><span className="k">{k}</span><span className="v">{v}</span></div>
                ))}
              </div>

              <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"18px"}}>
                <span style={{fontSize:"0.85rem",color:"var(--text-secondary)"}}>Colors:</span>
                {p.colors.map(c=><span key={c} className="mini-swatch" title={c} style={{...swatchBg(c),width:"20px",height:"20px"}} />)}
              </div>

              <button className="btn-primary" disabled={!p.stock} onClick={()=>{onAdd(p); onClose();}}>
                <i className="bi bi-bag-plus"></i> {p.stock ? "Add to cart" : "Sold out"}
              </button>
            </div>
          </div>
        </div>
      );
    }

    /* ============================================================
       Cart drawer
       ============================================================ */
    function CartDrawer({ lines, subtotal, count, onClose, onQty, onRemove, onCheckout }) {
      const shipping = subtotal>75 || subtotal===0 ? 0 : 9.99;
      return (
        <div className="overlay" onClick={onClose}>
          <div className="modal drawer" onClick={e=>e.stopPropagation()}>
            <div className="modal-head">
              <h3><i className="bi bi-bag"></i> Your cart ({count})</h3>
              <button className="icon-btn" onClick={onClose} aria-label="Close cart"><i className="bi bi-x-lg"></i></button>
            </div>

            {lines.length===0 ? (
              <div className="empty" style={{padding:"60px 24px",flex:1}}>
                <i className="bi bi-bag"></i>
                <h4 style={{marginBottom:"6px"}}>Your cart is empty</h4>
                <p style={{marginBottom:"18px"}}>Looks like you haven't added any gear yet. Let's fix that!</p>
                <button className="btn-ghost" onClick={onClose}>Continue shopping</button>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {lines.map(l=>(
                    <div className="cart-line" key={l.id}>
                      <div className="cart-thumb" style={{background:"var(--bg-elevated)",color:"var(--text-secondary)"}}><ProductMedia cat={l.product.cat} size={44} iconSize={28} /></div>
                      <div className="cart-line-info">
                        <div className="b">{l.product.brand}</div>
                        <h5>{l.product.name}</h5>
                        <div className="qty">
                          <button onClick={()=>onQty(l.id,-1)} aria-label="Decrease quantity"><i className="bi bi-dash"></i></button>
                          <span>{l.qty}</span>
                          <button onClick={()=>onQty(l.id,1)} aria-label="Increase quantity"><i className="bi bi-plus"></i></button>
                        </div>
                        <button className="remove-line" onClick={()=>onRemove(l.id)}>Remove</button>
                      </div>
                      <div style={{fontWeight:700,fontFamily:"Space Grotesk"}}>{fmt(l.product.price*l.qty)}</div>
                    </div>
                  ))}
                </div>
                <div className="cart-foot">
                  <div className="cart-row"><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
                  <div className="cart-row">
                    <span>Shipping</span>
                    <span>{shipping===0 ? <span style={{color:"var(--success)"}}>FREE</span> : fmt(shipping)}</span>
                  </div>
                  {subtotal>0 && subtotal<75 && (
                    <div style={{fontSize:"0.8rem",color:"var(--deal)",marginBottom:"8px"}}>
                      <i className="bi bi-truck"></i> Add {fmt(75-subtotal)} more for FREE shipping!
                    </div>
                  )}
                  <div className="cart-row total"><span>Total</span><span>{fmt(subtotal+shipping)}</span></div>
                  <button className="btn-primary" onClick={onCheckout}>
                    <i className="bi bi-lock-fill"></i> Checkout securely
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      );
    }

    /* ============================================================
       CHECKOUT: "follow instructions" process w/ visible stepper
       ============================================================ */
    const STEPS = ["Cart", "Shipping", "Payment", "Done"];
    const STEP_HINTS = [
      "Step 1 of 4: Review your items. Next: shipping details.",
      "Step 2 of 4: Where should we send it? Next: payment.",
      "Step 3 of 4: Enter payment. Next: confirm your order.",
      "All done! Your order is confirmed.",
    ];

    function Checkout({ lines, subtotal, onClose, onComplete, onSurvey }) {
      const [step, setStep] = useState(0);
      const shipping = subtotal>75 ? 0 : 9.99;
      const tax = +(subtotal*0.13).toFixed(2);
      const total = subtotal + shipping + tax;

      const [ship, setShip] = useState({ name:"", email:"", address:"", city:"", zip:"", country:"Canada" });
      const [pay, setPay]   = useState({ card:"", exp:"", cvv:"", holder:"" });
      const [errors, setErrors] = useState({});
      const [order, setOrder] = useState(null);

      const set = (obj,setObj,k) => (e) => { setObj({...obj,[k]:e.target.value}); setErrors(er=>({...er,[k]:null})); };

      const validateShip = () => {
        const e = {};
        if (!ship.name.trim()) e.name = "Please enter your name";
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(ship.email)) e.email = "Enter a valid email";
        if (!ship.address.trim()) e.address = "Please enter your address";
        if (!ship.city.trim()) e.city = "Required";
        if (!ship.zip.trim()) e.zip = "Required";
        setErrors(e); return Object.keys(e).length===0;
      };
      const validatePay = () => {
        const e = {};
        const digits = pay.card.replace(/\s/g,"");
        if (!/^\d{16}$/.test(digits)) e.card = "Card number must be 16 digits";
        if (!/^\d{2}\/\d{2}$/.test(pay.exp)) e.exp = "Use MM/YY";
        if (!/^\d{3,4}$/.test(pay.cvv)) e.cvv = "3–4 digits";
        if (!pay.holder.trim()) e.holder = "Required";
        setErrors(e); return Object.keys(e).length===0;
      };

      const next = () => {
        if (step===0) setStep(1);
        else if (step===1) { if (validateShip()) setStep(2); }
        else if (step===2) {
          if (validatePay()) {
            const num = "NG-" + (100000 + (lines.reduce((s,l)=>s+l.id*l.qty,0)*7919 % 899999));
            const o = { num, total, name:ship.name, email:ship.email };
            setOrder(o); onComplete(o); setStep(3);
          }
        }
      };
      const back = () => setStep(s=>Math.max(0,s-1));

      const fmtCard = (v) => v.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim();
      const fmtExp  = (v) => { const d=v.replace(/\D/g,"").slice(0,4); return d.length>2?d.slice(0,2)+"/"+d.slice(2):d; };

      return (
        <div className="overlay" onClick={step===3?undefined:onClose}>
          <div className="modal checkout-modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-head">
              <h3><i className="bi bi-bag-check"></i> Checkout</h3>
              {step<3 && <button className="icon-btn" onClick={onClose} aria-label="Close"><i className="bi bi-x-lg"></i></button>}
            </div>

            {/* progress stepper: visibility of system status */}
            <div className="stepper">
              {STEPS.map((label,i)=>(
                <div key={label} className={"step" + (i===step?" active":"") + (i<step?" done":"")}>
                  <div className="step-dot">{i<step ? <i className="bi bi-check-lg"></i> : i+1}</div>
                  <div className="step-label">{label}</div>
                </div>
              ))}
            </div>
            <div className="step-hint">{STEP_HINTS[step]}</div>

            <div className="checkout-body">
              {step===0 && (
                <>
                  {lines.map(l=>(
                    <div className="review-line" key={l.id}>
                      <span style={{display:"inline-flex",alignItems:"center",gap:"9px"}}><span style={{color:"var(--text-muted)",display:"inline-flex"}}><CatIcon cat={l.product.cat} size={17} /></span>{l.product.name} <span style={{color:"var(--text-muted)"}}>×{l.qty}</span></span>
                      <span style={{fontWeight:600}}>{fmt(l.product.price*l.qty)}</span>
                    </div>
                  ))}
                  <div className="review-line"><span>Shipping</span><span>{shipping===0?"FREE":fmt(shipping)}</span></div>
                  <div className="review-line"><span>Tax (13% HST)</span><span>{fmt(tax)}</span></div>
                  <div className="review-line" style={{fontWeight:700,fontSize:"1.1rem",borderBottom:"none"}}>
                    <span>Total</span><span>{fmt(total)}</span>
                  </div>
                  <div className="checkout-foot">
                    <button className="btn-ghost" onClick={onClose}>Keep shopping</button>
                    <button className="btn-primary" onClick={next}>Continue to shipping <i className="bi bi-arrow-right"></i></button>
                  </div>
                </>
              )}

              {step===1 && (
                <>
                  <div className="form-grid">
                    <Field label="Full name" req err={errors.name} full>
                      <input value={ship.name} onChange={set(ship,setShip,"name")} placeholder="Jordan Rivera" />
                    </Field>
                    <Field label="Email" req err={errors.email} full>
                      <input value={ship.email} onChange={set(ship,setShip,"email")} placeholder="you@email.com" />
                    </Field>
                    <Field label="Street address" req err={errors.address} full>
                      <input value={ship.address} onChange={set(ship,setShip,"address")} placeholder="123 Laurier Ave" />
                    </Field>
                    <Field label="City" req err={errors.city}>
                      <input value={ship.city} onChange={set(ship,setShip,"city")} placeholder="Ottawa" />
                    </Field>
                    <Field label="Postal code" req err={errors.zip}>
                      <input value={ship.zip} onChange={set(ship,setShip,"zip")} placeholder="K1N 6N5" />
                    </Field>
                    <Field label="Country">
                      <select value={ship.country} onChange={set(ship,setShip,"country")}>
                        <option>Canada</option><option>United States</option><option>United Kingdom</option>
                      </select>
                    </Field>
                  </div>
                  <div className="checkout-foot">
                    <button className="btn-ghost" onClick={back}><i className="bi bi-arrow-left"></i> Back</button>
                    <button className="btn-primary" onClick={next}>Continue to payment <i className="bi bi-arrow-right"></i></button>
                  </div>
                </>
              )}

              {step===2 && (
                <>
                  <div className="form-grid">
                    <Field label="Card number" req err={errors.card} full>
                      <input value={pay.card} onChange={e=>{setPay({...pay,card:fmtCard(e.target.value)}); setErrors(er=>({...er,card:null}));}} placeholder="4242 4242 4242 4242" inputMode="numeric" />
                    </Field>
                    <Field label="Expiry (MM/YY)" req err={errors.exp}>
                      <input value={pay.exp} onChange={e=>{setPay({...pay,exp:fmtExp(e.target.value)}); setErrors(er=>({...er,exp:null}));}} placeholder="08/27" inputMode="numeric" />
                    </Field>
                    <Field label="CVV" req err={errors.cvv}>
                      <input value={pay.cvv} onChange={e=>{setPay({...pay,cvv:e.target.value.replace(/\D/g,"").slice(0,4)}); setErrors(er=>({...er,cvv:null}));}} placeholder="123" inputMode="numeric" />
                    </Field>
                    <Field label="Name on card" req err={errors.holder} full>
                      <input value={pay.holder} onChange={set(pay,setPay,"holder")} placeholder="Jordan Rivera" />
                    </Field>
                  </div>
                  <div className="review-line" style={{marginTop:"14px",fontWeight:700,fontSize:"1.1rem"}}>
                    <span>Total to pay</span><span>{fmt(total)}</span>
                  </div>
                  <div className="secure-note"><i className="bi bi-shield-lock"></i> This is a prototype. No real card is charged and no data is stored.</div>
                  <div className="checkout-foot">
                    <button className="btn-ghost" onClick={back}><i className="bi bi-arrow-left"></i> Back</button>
                    <button className="btn-primary" onClick={next}><i className="bi bi-lock-fill"></i> Pay {fmt(total)}</button>
                  </div>
                </>
              )}

              {step===3 && order && (
                <div className="confirm">
                  <div className="confirm-icon"><i className="bi bi-check-lg"></i></div>
                  <h2>You're all set, {order.name.split(" ")[0]}! 🎉</h2>
                  <p>Thanks for your order. We've emailed a receipt to <b>{order.email}</b> and your gear is already being packed.</p>
                  <div className="order-num">Order {order.num}</div>

                  {/* ENGAGE IN A CONNECTION: survey invite */}
                  <div className="survey-prompt">
                    <h4>💜 How did we do?</h4>
                    <p>You're the reason we do this. Got 30 seconds? We'd love to hear what you think of your shopping experience.</p>
                    <div style={{display:"flex",gap:"10px",flexWrap:"wrap",justifyContent:"center"}}>
                      <button className="btn-primary" style={{width:"auto",padding:"12px 22px"}} onClick={onSurvey}><i className="bi bi-chat-heart"></i> Share my feedback</button>
                      <button className="btn-ghost" style={{width:"auto",padding:"12px 22px"}} onClick={onClose}>Maybe later</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    function Field({ label, req, err, full, children }) {
      return (
        <div className={"field" + (full?" full":"") + (err?" err":"")}>
          <label>{label} {req && <span className="req">*</span>}</label>
          {children}
          {err && <span className="err-msg"><i className="bi bi-exclamation-circle"></i>{err}</span>}
        </div>
      );
    }

    /* ============================================================
       SURVEY: "communicate" process (ENGAGE IN A CONNECTION)
       ============================================================ */
    const RATE_LABELS = ["", "We'll do better 😔", "Not our best 😕", "Pretty good 🙂", "Great! 😄", "You made our day! 🤩"];
    const LIKED = ["Easy to find things","Great prices","Fast & smooth","Looks awesome","Helpful product info","Simple checkout"];

    function Survey({ onClose, onDone }) {
      const [rating, setRating] = useState(0);
      const [hover, setHover] = useState(0);
      const [liked, setLiked] = useState([]);
      const [recommend, setRecommend] = useState(null);
      const [comment, setComment] = useState("");
      const [done, setDone] = useState(false);

      const toggleLiked = (v) => setLiked(liked.includes(v) ? liked.filter(x=>x!==v) : [...liked, v]);
      const submit = () => { setDone(true); onDone && onDone(); };

      return (
        <div className="overlay" onClick={onClose}>
          <div className="modal" onClick={e=>e.stopPropagation()} style={{maxWidth:"540px"}}>
            <div className="modal-head">
              <h3><i className="bi bi-chat-heart"></i> Tell us how we did</h3>
              <button className="icon-btn" onClick={onClose} aria-label="Close"><i className="bi bi-x-lg"></i></button>
            </div>

            {done ? (
              <div className="confirm" style={{padding:"40px 30px"}}>
                <div className="confirm-icon"><i className="bi bi-heart-fill"></i></div>
                <h2>Thank you! 💜</h2>
                <p>Your feedback means the world to us. It's how we make NexusGear better for players like you. See you next time!</p>
                <button className="btn-primary" style={{maxWidth:"220px",margin:"22px auto 0"}} onClick={onClose}>Back to shopping</button>
              </div>
            ) : (
              <div className="checkout-body">
                <p style={{color:"var(--text-secondary)",marginBottom:"20px",fontSize:"0.92rem"}}>
                  We'd genuinely love your honest take. It only takes a moment, and every answer helps.
                </p>

                <div className="survey-q">
                  <label>How was your overall experience?</label>
                  <div className="rate-stars">
                    {[1,2,3,4,5].map(n=>(
                      <button key={n}
                        className={(hover||rating)>=n ? "on" : ""}
                        onMouseEnter={()=>setHover(n)} onMouseLeave={()=>setHover(0)}
                        onClick={()=>setRating(n)} aria-label={`${n} stars`}>★</button>
                    ))}
                  </div>
                  <div className="rate-label">{RATE_LABELS[hover||rating]}</div>
                </div>

                <div className="survey-q">
                  <label>What did you enjoy most? <span style={{color:"var(--text-muted)",fontWeight:400}}>(pick any)</span></label>
                  <div className="pill-group">
                    {LIKED.map(v=>(
                      <button key={v} className={"pill"+(liked.includes(v)?" on":"")} onClick={()=>toggleLiked(v)}>{v}</button>
                    ))}
                  </div>
                </div>

                <div className="survey-q">
                  <label>Would you recommend NexusGear to a friend?</label>
                  <div className="pill-group">
                    {["Absolutely!","Maybe","Not yet"].map(v=>(
                      <button key={v} className={"pill"+(recommend===v?" on":"")} onClick={()=>setRecommend(v)}>{v}</button>
                    ))}
                  </div>
                </div>

                <div className="survey-q" style={{marginBottom:"10px"}}>
                  <label>Anything else you'd like to share?</label>
                  <textarea rows="3" value={comment} onChange={e=>setComment(e.target.value)}
                    placeholder="Tell us what you loved or what we could do better…"
                    style={{background:"var(--bg-card)",border:"1px solid var(--border)",color:"var(--text-primary)",borderRadius:"10px",padding:"12px",fontFamily:"inherit",fontSize:"0.9rem",width:"100%",resize:"vertical"}} />
                </div>

                <button className="btn-primary" disabled={rating===0} onClick={submit}>
                  <i className="bi bi-send"></i> {rating===0 ? "Tap a star to continue" : "Send my feedback"}
                </button>
              </div>
            )}
          </div>
        </div>
      );
    }

    ReactDOM.createRoot(document.getElementById("root")).render(<App />);

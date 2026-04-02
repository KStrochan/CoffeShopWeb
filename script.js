const products = [
  {id:'extra-crema',name:'Extra Crema',subtitle:'Espresso Blend • 1 kg beans',price:24,category:'blend',roast:'Medium',note:'Creamy body',image:'assets/extra-crema-pack.webp',badges:['Bestseller','Creamy'],desc:'Smooth espresso blend with rounded body and generous crema.'},
  {id:'miscela',name:'Miscela',subtitle:'Espresso Blend • 1 kg beans',price:23,category:'blend',roast:'Medium',note:'Everyday comfort',image:'assets/miscela-pack.webp',badges:['Signature'],desc:'Balanced espresso blend for reliable daily brewing at home or work.'},
  {id:'intensive',name:'Intensive',subtitle:'Espresso Blend • 1 kg beans',price:26,category:'blend',roast:'Medium-dark',note:'Bold espresso',image:'assets/intensive-pack.webp',badges:['Strong shot'],desc:'Built for fuller body and stronger expression in milk drinks and espresso.'},
  {id:'peru-organic',name:'Peru Organic',subtitle:'100% Arabica • 1 kg beans',price:31,category:'single-origin',roast:'Medium',note:'Origin clarity',image:'assets/peru-organic-pack.webp',badges:['Organic','Single origin'],desc:'Single-origin Peru with clean structure and premium visual identity.'},
  {id:'medio',name:'Medio',subtitle:'Espresso Blend • 1 kg beans',price:22,category:'blend',roast:'Medium',note:'Classic profile',image:'assets/medio-pack.webp',badges:['Daily choice'],desc:'A practical everyday espresso blend with classic balance.'},
  {id:'platinum',name:'Platinum',subtitle:'Espresso Blend • 1 kg beans',price:29,category:'blend',roast:'Dark',note:'Deep body',image:'assets/platinum-pack.webp',badges:['Premium','Dark roast'],desc:'Richer espresso blend with more depth and stronger roast presence.'},
  {id:'tesoro',name:'Tesoro',subtitle:'Espresso Blend • 1 kg beans',price:27,category:'blend',roast:'Medium-dark',note:'Structured cup',image:'assets/tesoro-pack.webp',badges:['Limited look'],desc:'Bold design with confident espresso structure and stronger character.'},
  {id:'originale',name:'Originale Ice',subtitle:'Espresso Blend • 1 kg beans',price:28,category:'blend',roast:'Medium',note:'Modern profile',image:'assets/originale-pack.webp',badges:['Contemporary'],desc:'Modern visual language paired with clean espresso versatility.'},
  {id:'gift-platinum',name:'Platinum Duo Gift Box',subtitle:'2 x 1 kg premium gift set',price:58,category:'gift',roast:'Curated',note:'Gift-ready',image:'assets/gift-box.jpg',badges:['Gift set'],desc:'Luxury black presentation box with two Platinum bags inside.'}
];

const reviews = [
  {title:'Looks like a real premium store',text:'The visuals and product structure immediately feel commercial, polished, and believable. It does not read like a quick demo page.',author:'Olena K.',role:'Retail buyer'},
  {title:'Useful for office ordering',text:'The bundle flow, local cart persistence, and quick add behavior make it practical for offices and repeat buying.',author:'Dmytro S.',role:'Office manager'},
  {title:'Strong brand storytelling',text:'Using lifestyle photos across the site makes the coffee feel premium and emotionally engaging instead of purely catalog-based.',author:'Iryna M.',role:'Brand strategist'}
];

const faqs = [
  {q:'Is this a functional frontend store?',a:'Yes. It includes search, category filtering, sorting, quantity controls, cart, wishlist, persistent local storage, bundle add, and a checkout modal.'},
  {q:'Can this later connect to a real backend and payments?',a:'Yes. The structure is ready to be extended with APIs, order storage, payment gateways, shipping methods, and admin tools.'},
  {q:'Can products, prices, and texts be edited easily?',a:'Yes. All product data and dynamic content are stored in JavaScript objects, so updates are straightforward.'},
  {q:'Can this become a multi-page store later?',a:'Yes. You can split product cards into dedicated product pages, add authentication, and connect the cart to a backend.'}
];

const $ = (s, p=document) => p.querySelector(s);
const $$ = (s, p=document) => [...p.querySelectorAll(s)];

const STORAGE = {
  cart: 'gemini-premium-cart',
  wishlist: 'gemini-premium-wishlist'
};

let state = {
  cart: load(STORAGE.cart, []),
  wishlist: load(STORAGE.wishlist, []),
  filter: 'all',
  search: '',
  sort: 'featured'
};

const qtyState = {};
products.forEach(p => qtyState[p.id] = 1);

function load(key, fallback){
  try{
    const v = JSON.parse(localStorage.getItem(key));
    return v ?? fallback;
  }catch(e){ return fallback; }
}
function save(key, value){ localStorage.setItem(key, JSON.stringify(value)); }
function money(v){ return `$${v.toFixed(2)}`; }
function productById(id){ return products.find(p => p.id === id); }

function toast(message){
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = message;
  $('#toastWrap').appendChild(el);
  setTimeout(()=> el.style.opacity = '0', 2200);
  setTimeout(()=> el.remove(), 2600);
}

function updateCounts(){
  $('#cartCount').textContent = state.cart.reduce((sum, item) => sum + item.qty, 0);
  $('#wishlistCount').textContent = state.wishlist.length;
}

function renderProducts(){
  let items = [...products].filter(product => {
    const filterOk = state.filter === 'all' || product.category === state.filter;
    const q = state.search.trim().toLowerCase();
    const haystack = [product.name, product.subtitle, product.roast, product.note, product.desc, ...product.badges].join(' ').toLowerCase();
    const searchOk = !q || haystack.includes(q);
    return filterOk && searchOk;
  });

  if(state.sort === 'price-asc') items.sort((a,b)=>a.price-b.price);
  if(state.sort === 'price-desc') items.sort((a,b)=>b.price-a.price);
  if(state.sort === 'name-asc') items.sort((a,b)=>a.name.localeCompare(b.name));

  $('#products').innerHTML = items.map(product => `
    <article class="product-card reveal visible">
      <div class="product-card__media">
        <img src="${product.image}" alt="${product.name}">
        <div class="product-card__badges">${product.badges.map(b=>`<span class="badge">${b}</span>`).join('')}</div>
        <div class="product-card__icons">
          <button class="round-btn" data-wishlist="${product.id}">${state.wishlist.includes(product.id) ? '♥' : '♡'}</button>
          <button class="round-btn" data-quick="${product.id}">＋</button>
        </div>
      </div>
      <div class="product-card__body">
        <div class="product-card__top">
          <div>
            <h3>${product.name}</h3>
            <div class="product-card__sub">${product.subtitle}</div>
          </div>
          <div class="price">${money(product.price)}</div>
        </div>
        <div class="chips">
          <span class="chip">${product.roast} roast</span>
          <span class="chip">${product.note}</span>
        </div>
        <div class="product-card__sub">${product.desc}</div>
        <div class="product-card__bottom">
          <div class="qty">
            <button data-qty="${product.id}" data-change="-1">−</button>
            <span id="qty-${product.id}">${qtyState[product.id]}</span>
            <button data-qty="${product.id}" data-change="1">＋</button>
          </div>
          <button class="btn btn--primary" data-add="${product.id}">Add to cart</button>
        </div>
      </div>
    </article>
  `).join('');

  $$('[data-qty]').forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.qty;
      qtyState[id] = Math.max(1, qtyState[id] + Number(btn.dataset.change));
      $(`#qty-${id}`).textContent = qtyState[id];
    };
  });

  $$('[data-add]').forEach(btn => btn.onclick = () => addToCart(btn.dataset.add, qtyState[btn.dataset.add]));
  $$('[data-quick]').forEach(btn => btn.onclick = () => addToCart(btn.dataset.quick, 1));
  $$('[data-wishlist]').forEach(btn => btn.onclick = () => toggleWishlist(btn.dataset.wishlist));
}

function addToCart(id, qty=1){
  const existing = state.cart.find(item => item.id === id);
  if(existing) existing.qty += qty;
  else state.cart.push({id, qty});
  save(STORAGE.cart, state.cart);
  renderCart();
  updateCounts();
  toast('Added to cart');
}

function toggleWishlist(id){
  if(state.wishlist.includes(id)){
    state.wishlist = state.wishlist.filter(x => x !== id);
    toast('Removed from wishlist');
  } else {
    state.wishlist.push(id);
    toast('Saved to wishlist');
  }
  save(STORAGE.wishlist, state.wishlist);
  renderWishlist();
  renderProducts();
  updateCounts();
}

function renderWishlist(){
  const wrap = $('#wishlistItems');
  if(!state.wishlist.length){
    wrap.innerHTML = '<div class="empty">Your wishlist is empty.</div>';
    return;
  }
  wrap.innerHTML = state.wishlist.map(id => {
    const p = productById(id);
    return `
      <article class="drawer-item">
        <img src="${p.image}" alt="${p.name}">
        <div>
          <h4>${p.name}</h4>
          <p>${p.subtitle}</p>
          <p><strong>${money(p.price)}</strong></p>
        </div>
        <div class="drawer-item__actions">
          <button data-wish-add="${p.id}">Add to cart</button>
          <button data-wish-remove="${p.id}">Remove</button>
        </div>
      </article>
    `;
  }).join('');

  $$('[data-wish-add]').forEach(btn => btn.onclick = () => addToCart(btn.dataset.wishAdd, 1));
  $$('[data-wish-remove]').forEach(btn => btn.onclick = () => toggleWishlist(btn.dataset.wishRemove));
}

function changeCartQty(id, delta){
  const item = state.cart.find(x => x.id === id);
  if(!item) return;
  item.qty += delta;
  if(item.qty <= 0) state.cart = state.cart.filter(x => x.id !== id);
  save(STORAGE.cart, state.cart);
  renderCart();
  updateCounts();
}

function removeCart(id){
  state.cart = state.cart.filter(x => x.id !== id);
  save(STORAGE.cart, state.cart);
  renderCart();
  updateCounts();
}

function renderCart(){
  const wrap = $('#cartItems');
  if(!state.cart.length){
    wrap.innerHTML = '<div class="empty">Your cart is empty. Add a few premium bags to begin.</div>';
    $('#subtotal').textContent = '$0.00';
    $('#shipping').textContent = '$0.00';
    $('#total').textContent = '$0.00';
    return;
  }

  wrap.innerHTML = state.cart.map(item => {
    const p = productById(item.id);
    return `
      <article class="drawer-item">
        <img src="${p.image}" alt="${p.name}">
        <div>
          <h4>${p.name}</h4>
          <p>${p.subtitle}</p>
          <p><strong>${money(p.price * item.qty)}</strong></p>
        </div>
        <div class="drawer-item__actions">
          <button data-cart-change="${p.id}" data-delta="-1">−</button>
          <strong>${item.qty}</strong>
          <button data-cart-change="${p.id}" data-delta="1">＋</button>
          <button data-cart-remove="${p.id}">Remove</button>
        </div>
      </article>
    `;
  }).join('');

  $$('[data-cart-change]').forEach(btn => btn.onclick = () => changeCartQty(btn.dataset.cartChange, Number(btn.dataset.delta)));
  $$('[data-cart-remove]').forEach(btn => btn.onclick = () => removeCart(btn.dataset.cartRemove));

  const subtotal = state.cart.reduce((sum, item) => sum + productById(item.id).price * item.qty, 0);
  const shipping = subtotal === 0 ? 0 : subtotal > 90 ? 0 : 7;
  $('#subtotal').textContent = money(subtotal);
  $('#shipping').textContent = money(shipping);
  $('#total').textContent = money(subtotal + shipping);
}

function renderReviews(){
  $('#reviewsGrid').innerHTML = reviews.map(r => `
    <article class="review reveal visible">
      <div class="review__stars">★★★★★</div>
      <h3>${r.title}</h3>
      <p>${r.text}</p>
      <footer>${r.author} • ${r.role}</footer>
    </article>
  `).join('');
}

function renderFaq(){
  $('#faqList').innerHTML = faqs.map((f, i) => `
    <article class="faq-item ${i===0 ? 'open' : ''}">
      <div class="faq-item__q">
        <span>${f.q}</span>
        <strong>${i===0 ? '−' : '+'}</strong>
      </div>
      <div class="faq-item__a"><p>${f.a}</p></div>
    </article>
  `).join('');

  $$('.faq-item').forEach(item => {
    $('.faq-item__q', item).onclick = () => {
      const open = item.classList.contains('open');
      $$('.faq-item').forEach(other => {
        other.classList.remove('open');
        $('strong', $('.faq-item__q', other)).textContent = '+';
      });
      if(!open){
        item.classList.add('open');
        $('strong', $('.faq-item__q', item)).textContent = '−';
      }
    };
  });
}

function setupFilters(){
  $$('#filters .filter').forEach(btn => {
    btn.onclick = () => {
      $$('#filters .filter').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.filter = btn.dataset.filter;
      renderProducts();
    };
  });

  $('#sortSelect').onchange = e => {
    state.sort = e.target.value;
    renderProducts();
  };

  $('#searchInput').oninput = e => {
    state.search = e.target.value;
    renderProducts();
  };

  $('#clearSearch').onclick = () => {
    $('#searchInput').value = '';
    state.search = '';
    renderProducts();
  };
}

function openDrawer(id){ document.getElementById(id).classList.add('open'); }
function closeDrawer(id){ document.getElementById(id).classList.remove('open'); }

function setupUI(){
  $('#searchToggle').onclick = () => $('#searchPanel').classList.toggle('open');
  $('#wishlistToggle').onclick = () => openDrawer('wishlistDrawer');
  $('#cartToggle').onclick = () => openDrawer('cartDrawer');
  $('#menuToggle').onclick = () => $('#nav').classList.toggle('open');

  $$('[data-close]').forEach(btn => btn.onclick = () => closeDrawer(btn.dataset.close));
  ['wishlistDrawer','cartDrawer'].forEach(id => {
    const el = document.getElementById(id);
    el.addEventListener('click', e => { if(e.target === el) closeDrawer(id); });
  });

  window.addEventListener('scroll', () => {
    document.querySelector('.header').style.borderBottomColor = window.scrollY > 10 ? 'rgba(23,19,17,.08)' : 'transparent';
  });
}

function setupHero(){
  const slides = $$('.hero-slide');
  const dotsWrap = $('#heroDots');
  let current = 0;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = `hero-dot ${i===0 ? 'active' : ''}`;
    dot.onclick = () => go(i);
    dotsWrap.appendChild(dot);
  });

  const dots = $$('.hero-dot', dotsWrap);

  function go(index){
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  $('#heroPrev').onclick = () => go(current - 1);
  $('#heroNext').onclick = () => go(current + 1);
  setInterval(() => go(current + 1), 5000);
}

function setupBundle(){
  $('#bundleAdd').onclick = () => {
    addToCart('peru-organic', 1);
    addToCart('extra-crema', 1);
    addToCart('platinum', 1);
    toast('Premium trio added');
  };
}

function setupCheckout(){
  $('#checkoutOpen').onclick = () => {
    if(!state.cart.length){
      toast('Your cart is empty');
      return;
    }
    $('#checkoutModal').classList.add('open');
  };
  $('#checkoutClose').onclick = () => $('#checkoutModal').classList.remove('open');
  $('#checkoutModal').addEventListener('click', e => {
    if(e.target.id === 'checkoutModal') $('#checkoutModal').classList.remove('open');
  });
  $('#checkoutForm').onsubmit = e => {
    e.preventDefault();
    const data = new FormData(e.target);
    const name = data.get('name');
    state.cart = [];
    save(STORAGE.cart, state.cart);
    renderCart();
    updateCounts();
    $('#checkoutModal').classList.remove('open');
    closeDrawer('cartDrawer');
    e.target.reset();
    toast(`Thank you, ${name}. Order placed.`);
  };
}

function setupNewsletter(){
  $('#newsletterForm').onsubmit = e => {
    e.preventDefault();
    toast('Subscribed successfully');
    e.target.reset();
  };
}

function setupReveal(){
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, {threshold: .18});
  $$('.reveal').forEach(el => observer.observe(el));
}

renderProducts();
renderWishlist();
renderCart();
renderReviews();
renderFaq();
setupFilters();
setupUI();
setupHero();
setupBundle();
setupCheckout();
setupNewsletter();
setupReveal();
updateCounts();

import{t as e}from"./supabase-C_OAid-5.js";/* empty css             */import{a as t,c as n,o as r,t as i,u as a}from"./toast-8XgWW_WI.js";import{t as o}from"./sortable.esm-BRxt44hw.js";import{n as s,r as c,t as l}from"./theme-toggle-l6r1rMgD.js";import{a as u,i as d,n as f,r as p,t as m}from"./tag-utils-C9XkEIXv.js";import{r as h}from"./slug-utils-BHiS6Xa0.js";var g=null,_=[],v=``,y=``,b=[],x=null;async function S(){g=await n(),g&&(w(),await T(),D(),f(e,g.id).then(e=>{b=e}),await C(),document.getElementById(`new-collection-btn`)?.addEventListener(`click`,M),document.getElementById(`collection-search`)?.addEventListener(`input`,e=>{v=e.target.value,D()}))}async function C(){try{let{data:t}=await e.from(`profiles`).select(`username`).eq(`id`,g.id).single();if(t?.username)return;let n=document.createElement(`div`);n.className=`username-onboarding`,n.innerHTML=`
      <div class="onboarding-content">
        <div class="onboarding-text">
          <h3><i class="fas fa-user-tag"></i> Set Your Username</h3>
          <p>Choose a permanent username for your public collection URLs (e.g. academiqr.com/u/<strong>your-name</strong>/collection)</p>
        </div>
        <div class="onboarding-input">
          <div class="username-input-row">
            <span class="username-prefix">academiqr.com/u/</span>
            <input type="text" id="onboarding-username" placeholder="your-username" maxlength="30">
          </div>
          <p id="onboarding-username-status" style="font-size:0.75rem; min-height:1.2em; margin-top:4px;"></p>
          <button class="btn-primary" id="onboarding-save-btn">Set Username</button>
        </div>
      </div>
    `;let r=document.querySelector(`.dashboard-header`);r.parentNode.insertBefore(n,r.nextSibling);let a=null;document.getElementById(`onboarding-username`)?.addEventListener(`input`,t=>{let n=t.target.value.toLowerCase().replace(/[^a-z0-9-]/g,``);t.target.value=n;let r=document.getElementById(`onboarding-username-status`);!n||n.length<3?(r.textContent=n?`Must be at least 3 characters`:``,r.style.color=`#64748b`):(r.textContent=`Checking...`,r.style.color=`#64748b`,clearTimeout(a),a=setTimeout(async()=>{let{data:t}=await e.from(`profiles`).select(`id`).eq(`username`,n).limit(1);t&&t.length>0?(r.textContent=`Username is taken`,r.style.color=`#ef4444`):(r.textContent=`Available!`,r.style.color=`#22c55e`)},500))}),document.getElementById(`onboarding-save-btn`)?.addEventListener(`click`,async()=>{let t=document.getElementById(`onboarding-username`)?.value?.trim().toLowerCase().replace(/[^a-z0-9-]/g,``);if(!t||t.length<3){i(`Username must be at least 3 characters (letters, numbers, hyphens only)`,`warning`);return}let r=document.getElementById(`onboarding-save-btn`);r.disabled=!0,r.innerHTML=`<i class="fas fa-spinner fa-spin"></i> Saving...`;try{let{error:a}=await e.from(`profiles`).upsert({id:g.id,username:t});if(a){if(a.code===`23505`||a.message?.includes(`username`))i(`That username is already taken. Please choose another.`,`warning`);else throw a;r.disabled=!1,r.innerHTML=`Set Username`;return}n.remove()}catch(e){console.error(`Failed to set username:`,e),i(`Failed to save: `+e.message,`error`),r.disabled=!1,r.innerHTML=`Set Username`}})}catch{}}function w(){let e=document.getElementById(`main-nav`);if(!e)return;e.innerHTML=`
    <div class="nav-inner">
      <a href="/src/pages/dashboard.html" class="nav-brand">
            <img src="https://natzpfyxpuycsuuzbqrd.supabase.co/storage/v1/object/public/assets/AcademiQR_logo_blue.png" alt="AcademiQR" class="nav-logo-icon" width="40" height="40" data-light="https://natzpfyxpuycsuuzbqrd.supabase.co/storage/v1/object/public/assets/AcademiQR_logo_blue.png" data-dark="https://natzpfyxpuycsuuzbqrd.supabase.co/storage/v1/object/public/assets/AcademiQR_logo_white_.png">
            <img src="https://natzpfyxpuycsuuzbqrd.supabase.co/storage/v1/object/public/assets/AcademiQR_wordmark_blue_logo_.png" alt="" class="nav-logo-wordmark" width="200" height="40" data-light="https://natzpfyxpuycsuuzbqrd.supabase.co/storage/v1/object/public/assets/AcademiQR_wordmark_blue_logo_.png" data-dark="https://natzpfyxpuycsuuzbqrd.supabase.co/storage/v1/object/public/assets/AcademiQR_wordmark_white_logo_.png">
          </a>
      <div class="nav-links">
        <a href="/src/pages/library.html" class="nav-link">
          <i class="fas fa-link"></i> Link Library
        </a>
        <a href="/src/pages/profile.html" class="nav-link">
          <i class="fas fa-user-circle"></i> Profile
        </a>
        <div class="nav-user">
          <button id="theme-toggle-btn" class="btn-ghost" title="Toggle dark mode"><i class="fas fa-circle-half-stroke"></i></button>
          <button id="sign-out-btn" class="btn-ghost"><i class="fas fa-sign-out-alt"></i> Sign Out</button>
        </div>
      </div>
    </div>
  `,document.getElementById(`sign-out-btn`)?.addEventListener(`click`,async()=>{await a(),r(`login`)}),s();let t=document.getElementById(`theme-toggle-btn`);t&&(t.querySelector(`i`).className=(l(),`fas fa-circle-half-stroke`),t.addEventListener(`click`,()=>{c(),t.querySelector(`i`).className=`fas fa-circle-half-stroke`}))}async function T(){let t=document.getElementById(`collections-grid`);if(t){t.innerHTML=`
    <div class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading your collections...</p>
    </div>
  `;try{let{data:t,error:n}=await e.from(`link_lists`).select(`*`).eq(`owner_id`,g.id).order(`created_at`,{ascending:!1});if(n)throw n;_=t||[],_.sort((e,t)=>{let n=e.order_index??1/0,r=t.order_index??1/0;return n===r?new Date(t.created_at||0)-new Date(e.created_at||0):n-r}),await Promise.all(_.map(async t=>{try{let{data:n,error:r}=await e.from(`link_items`).select(`title, url`).eq(`list_id`,t.id);t._links=r?[]:n||[],t._linkCount=t._links.length}catch{t._links=[],t._linkCount=0}}))}catch(e){console.error(`Failed to load collections:`,e),t.innerHTML=`
      <div class="empty-state">
        <i class="fas fa-exclamation-triangle"></i>
        <p>Failed to load collections. Please try again.</p>
        <button class="btn-primary" onclick="location.reload()">Retry</button>
      </div>
    `}}}function E(){let e=_;if(y&&(e=e.filter(e=>((e.presentation_data||{}).tags||[]).includes(y))),v.trim()){let t=v.toLowerCase();e=e.filter(e=>{let n=e.presentation_data||{};return(n.title||``).toLowerCase().includes(t)||(n.conference||``).toLowerCase().includes(t)||(n.location||``).toLowerCase().includes(t)||(n.date||``).toLowerCase().includes(t)||(n.tags||[]).some(e=>e.includes(t))?!0:(e._links||[]).some(e=>(e.title||``).toLowerCase().includes(t)||(e.url||``).toLowerCase().includes(t))})}return e}function D(){let n=document.getElementById(`collections-grid`);if(!n)return;if(x&&=(x.destroy(),null),_.length===0){n.innerHTML=`
      <div class="empty-state">
        <div class="empty-icon"><i class="fas fa-rocket"></i></div>
        <h3>Welcome to AcademiQR</h3>
        <p>Create your first collection to start sharing links with your audience.</p>
        <button class="btn-primary" id="empty-create-btn">
          <i class="fas fa-plus"></i> Create Collection
        </button>
      </div>
    `,document.getElementById(`empty-create-btn`)?.addEventListener(`click`,M);return}let r=E(),a=!!v.trim();r.length===0?n.innerHTML=`
      <div class="empty-state">
        <div class="empty-icon"><i class="fas fa-search"></i></div>
        <h3>No matching collections</h3>
        <p>No collections match "${F(v)}". Try a different search term.</p>
      </div>
    `:(n.innerHTML=r.map(e=>{let t=e.presentation_data||{},n=t.title||`Untitled Collection`,r=t.conference||``,i=e._linkCount||0,o,s;e.passkey_hash?(o=`fa-key`,s=`Passkey`):e.visibility===`private`?(o=`fa-lock`,s=`Private`):(o=`fa-globe`,s=`Public`);let c=e.theme||{},l=c.backgroundColor||c.background_color||`#1A2F5B`,d=c.accentColor||c.accent_color||`#3B5998`,f=e.created_at?new Date(e.created_at).toLocaleDateString(`en-US`,{month:`short`,day:`numeric`,year:`numeric`}):``;return`
      <div class="collection-card" data-id="${e.id}">
        <div class="card-theme-strip" style="background: linear-gradient(135deg, ${d}, ${l})"></div>
        <div class="card-body">
          <div class="card-top">
            ${a?``:`<span class="drag-handle" title="Drag to reorder"><i class="fas fa-grip-vertical"></i></span>`}
            <div class="card-content">
              <div class="card-title-row">
                <h3 class="card-title">${F(n)}</h3>
                <div class="card-actions">
                  <button class="btn-icon" title="Duplicate" data-action="duplicate" data-id="${e.id}">
                    <i class="fas fa-copy"></i>
                  </button>
                  <button class="btn-icon btn-danger-icon" title="Delete" data-action="delete" data-id="${e.id}">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
              ${r?`<p class="card-conference">${F(r)}</p>`:``}
            </div>
          </div>
          <div class="card-meta">
            <span class="card-badge"><i class="fas ${o}"></i> ${s}</span>
            <span class="card-links"><i class="fas fa-link"></i> ${i} link${i===1?``:`s`}</span>
            <span class="card-date">${f}</span>
          </div>
          ${t.tags&&t.tags.length,`
            <div class="card-tags" data-collection-id="${e.id}">
              ${u(t.tags||[],{clickable:!0,removable:!0,activeTag:y})}
              <button class="tag-add-btn" data-collection-id="${e.id}" title="Add tag"><i class="fas fa-plus"></i></button>
            </div>
          `}
        </div>
      </div>
    `}).join(``),n.querySelectorAll(`.collection-card`).forEach(e=>{e.addEventListener(`click`,n=>{n.target.closest(`.card-actions`)||n.target.closest(`.drag-handle`)||n.target.closest(`.card-tags`)||t(e.dataset.id)})}),n.querySelectorAll(`[data-action="duplicate"]`).forEach(e=>{e.addEventListener(`click`,t=>{t.stopPropagation(),N(e.dataset.id)})}),n.querySelectorAll(`[data-action="delete"]`).forEach(e=>{e.addEventListener(`click`,t=>{t.stopPropagation(),P(e.dataset.id)})}),n.querySelectorAll(`.tag-remove[data-tag]`).forEach(t=>{t.addEventListener(`click`,async n=>{n.stopPropagation();let r=t.dataset.tag,a=t.closest(`.collection-card`)?.dataset.id,o=_.find(e=>e.id===a);if(!o)return;let s={...o.presentation_data||{}};s.tags=(s.tags||[]).filter(e=>e!==r);let{error:c}=await e.from(`link_lists`).update({presentation_data:s,updated_at:new Date().toISOString()}).eq(`id`,a);c?i(`Failed to remove tag: `+c.message,`error`):(o.presentation_data=s,D())})}),n.querySelectorAll(`.tag-chip[data-tag]`).forEach(e=>{e.addEventListener(`click`,t=>{if(t.stopPropagation(),t.target.closest(`.tag-remove`))return;let n=e.dataset.tag;y=y===n?``:n,D(),O()})}),n.querySelectorAll(`.tag-add-btn`).forEach(e=>{e.addEventListener(`click`,t=>{t.stopPropagation();let n=e.dataset.collectionId;k(e,n)})}),O(),!a&&!y&&r.length>1&&(x=new o(n,{animation:150,handle:`.drag-handle`,ghostClass:`sortable-ghost`,chosenClass:`sortable-chosen`,dragClass:`sortable-drag`,onEnd:A})))}function O(){let e=document.getElementById(`tag-filter-bar`);e&&(y?(e.style.display=`flex`,e.innerHTML=`
      <span>Filtered by:</span>
      <span class="tag-chip tag-active">${F(y)} <button class="tag-remove" id="clear-tag-filter">&times;</button></span>
    `,document.getElementById(`clear-tag-filter`)?.addEventListener(`click`,()=>{y=``,D()})):(e.style.display=`none`,e.innerHTML=``))}function k(t,n){document.querySelectorAll(`.tag-input-wrapper`).forEach(e=>e.remove());let r=_.find(e=>e.id===n);if(!r)return;let a=(r.presentation_data||{}).tags||[],o=t.closest(`.card-tags`);m(o,b,a,async t=>{let o={...r.presentation_data||{},tags:d([...a,t])},{error:s}=await e.from(`link_lists`).update({presentation_data:o,updated_at:new Date().toISOString()}).eq(`id`,n);s?i(`Failed to add tag: `+s.message,`error`):(r.presentation_data=o,b.includes(t)||b.push(t),b.sort(),p(),D())}),o.querySelector(`.tag-input`)?.focus()}async function A(){let t=document.getElementById(`collections-grid`).querySelectorAll(`.collection-card`),n=Array.from(t).map(e=>e.dataset.id),r=[];for(let e of n){let t=_.find(t=>t.id===e);t&&r.push(t)}for(let e of _)r.includes(e)||r.push(e);_=r;try{await Promise.all(_.map((t,n)=>(t.order_index=(n+1)*100,e.from(`link_lists`).update({order_index:t.order_index}).eq(`id`,t.id))))}catch(e){console.error(`Failed to save order:`,e)}}function j(e){let t=h(e,50);return t?`${t}-${Math.random().toString(36).substring(2,6)}`:crypto.randomUUID().substring(0,8)}async function M(){let n=_.reduce((e,t)=>Math.min(e,t.order_index??0),0);try{let r=j(`untitled`),{data:i,error:a}=await e.from(`link_lists`).insert({owner_id:g.id,slug:r,visibility:`public`,theme:{},presentation_data:{title:`Untitled Collection`},order_index:n-100}).select().single();if(a)throw a;t(i.id)}catch(e){console.error(`Failed to create collection:`,e),i(`Failed to create collection: `+e.message,`error`)}}async function N(t){let n=_.find(e=>e.id===t);if(n&&confirm(`Duplicate "${n.presentation_data?.title||`Untitled`}"?`))try{let r=j((n.presentation_data?.title||`untitled`)+` copy`),i=_.reduce((e,t)=>Math.max(e,t.order_index||0),0),{data:a,error:o}=await e.from(`link_lists`).insert({owner_id:g.id,slug:r,title:n.title,description:n.description,theme:n.theme,socials:n.socials,layout:n.layout,visibility:n.visibility,presentation_data:{...n.presentation_data,title:(n.presentation_data?.title||`Untitled`)+` (Copy)`},order_index:i+100}).select().single();if(o)throw o;let{data:s}=await e.from(`link_items`).select(`*`).eq(`list_id`,t);if(s&&s.length>0){let t=s.map(e=>({list_id:a.id,title:e.title,url:e.url,image_url:e.image_url,order_index:e.order_index,is_active:e.is_active}));await e.from(`link_items`).insert(t)}await T(),D()}catch(e){console.error(`Failed to duplicate:`,e),i(`Failed to duplicate: `+e.message,`error`)}}async function P(t){let n=_.find(e=>e.id===t);if(!n)return;let r=n.presentation_data?.title||`Untitled Collection`;if(confirm(`Delete "${r}"? This will also delete all links in this collection. This cannot be undone.`))try{let{error:n}=await e.from(`link_lists`).delete().eq(`id`,t).eq(`owner_id`,g.id);if(n)throw n;await T(),D()}catch(e){console.error(`Failed to delete:`,e),i(`Failed to delete: `+e.message,`error`)}}function F(e){let t=document.createElement(`div`);return t.textContent=e,t.innerHTML}S();
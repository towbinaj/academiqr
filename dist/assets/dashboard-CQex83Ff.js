import{s as m}from"./supabase-whCCoo43.js";/* empty css             */import{a as S,b as I,n as $,g as E,s as h}from"./toast-C5Ve3yOU.js";import{S as A}from"./sortable.esm-D-EvzYhP.js";import{i as B,g as U,t as z}from"./theme-toggle-D-yRes8V.js";import{g as F,r as M,c as D,n as H,i as P}from"./tag-utils-CwIXpYMv.js";let f=null,g=[],_="",p="",v=[],k=null;async function R(){var a,t;f=await S(),f&&(N(),await L(),b(),F(m,f.id).then(r=>{v=r}),await Q(),(a=document.getElementById("new-collection-btn"))==null||a.addEventListener("click",T),(t=document.getElementById("collection-search"))==null||t.addEventListener("input",r=>{_=r.target.value,b()}))}async function Q(){var a,t;try{const{data:r}=await m.from("profiles").select("username").eq("id",f.id).single();if(r!=null&&r.username)return;const n=document.createElement("div");n.className="username-onboarding",n.innerHTML=`
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
    `;const e=document.querySelector(".dashboard-header");e.parentNode.insertBefore(n,e.nextSibling);let s=null;(a=document.getElementById("onboarding-username"))==null||a.addEventListener("input",i=>{const o=i.target.value.toLowerCase().replace(/[^a-z0-9-]/g,"");i.target.value=o;const l=document.getElementById("onboarding-username-status");if(!o||o.length<3){l.textContent=o?"Must be at least 3 characters":"",l.style.color="#64748b";return}l.textContent="Checking...",l.style.color="#64748b",clearTimeout(s),s=setTimeout(async()=>{const{data:d}=await m.from("profiles").select("id").eq("username",o).limit(1);d&&d.length>0?(l.textContent="Username is taken",l.style.color="#ef4444"):(l.textContent="Available!",l.style.color="#22c55e")},500)}),(t=document.getElementById("onboarding-save-btn"))==null||t.addEventListener("click",async()=>{var l,d,c;const i=(d=(l=document.getElementById("onboarding-username"))==null?void 0:l.value)==null?void 0:d.trim().toLowerCase().replace(/[^a-z0-9-]/g,"");if(!i||i.length<3){h("Username must be at least 3 characters (letters, numbers, hyphens only)","warning");return}const o=document.getElementById("onboarding-save-btn");o.disabled=!0,o.innerHTML='<i class="fas fa-spinner fa-spin"></i> Saving...';try{const{error:u}=await m.from("profiles").upsert({id:f.id,username:i});if(u){if(u.code==="23505"||(c=u.message)!=null&&c.includes("username"))h("That username is already taken. Please choose another.","warning");else throw u;o.disabled=!1,o.innerHTML="Set Username";return}n.remove()}catch(u){console.error("Failed to set username:",u),h("Failed to save: "+u.message,"error"),o.disabled=!1,o.innerHTML="Set Username"}})}catch{}}function N(){var r;const a=document.getElementById("main-nav");if(!a)return;a.innerHTML=`
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
  `,(r=document.getElementById("sign-out-btn"))==null||r.addEventListener("click",async()=>{await I(),$("login")}),B();const t=document.getElementById("theme-toggle-btn");t&&(t.querySelector("i").className=(U()==="dark","fas fa-circle-half-stroke"),t.addEventListener("click",()=>{const n=z();t.querySelector("i").className="fas fa-circle-half-stroke"}))}async function L(){const a=document.getElementById("collections-grid");if(a){a.innerHTML=`
    <div class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading your collections...</p>
    </div>
  `;try{const{data:t,error:r}=await m.from("link_lists").select("*").eq("owner_id",f.id).order("created_at",{ascending:!1});if(r)throw r;g=t||[],g.sort((n,e)=>{const s=n.order_index??1/0,i=e.order_index??1/0;return s!==i?s-i:new Date(e.created_at||0)-new Date(n.created_at||0)}),await Promise.all(g.map(async n=>{try{const{data:e,error:s}=await m.from("link_items").select("title, url").eq("list_id",n.id);n._links=s?[]:e||[],n._linkCount=n._links.length}catch{n._links=[],n._linkCount=0}}))}catch(t){console.error("Failed to load collections:",t),a.innerHTML=`
      <div class="empty-state">
        <i class="fas fa-exclamation-triangle"></i>
        <p>Failed to load collections. Please try again.</p>
        <button class="btn-primary" onclick="location.reload()">Retry</button>
      </div>
    `}}}function O(){let a=g;if(p&&(a=a.filter(t=>((t.presentation_data||{}).tags||[]).includes(p))),_.trim()){const t=_.toLowerCase();a=a.filter(r=>{const n=r.presentation_data||{};return(n.title||"").toLowerCase().includes(t)||(n.conference||"").toLowerCase().includes(t)||(n.location||"").toLowerCase().includes(t)||(n.date||"").toLowerCase().includes(t)||(n.tags||[]).some(i=>i.includes(t))?!0:(r._links||[]).some(i=>(i.title||"").toLowerCase().includes(t)||(i.url||"").toLowerCase().includes(t))})}return a}function b(){var n;const a=document.getElementById("collections-grid");if(!a)return;if(k&&(k.destroy(),k=null),g.length===0){a.innerHTML=`
      <div class="empty-state">
        <div class="empty-icon"><i class="fas fa-rocket"></i></div>
        <h3>Welcome to AcademiQR</h3>
        <p>Create your first collection to start sharing links with your audience.</p>
        <button class="btn-primary" id="empty-create-btn">
          <i class="fas fa-plus"></i> Create Collection
        </button>
      </div>
    `,(n=document.getElementById("empty-create-btn"))==null||n.addEventListener("click",T);return}const t=O(),r=!!_.trim();if(t.length===0){a.innerHTML=`
      <div class="empty-state">
        <div class="empty-icon"><i class="fas fa-search"></i></div>
        <h3>No matching collections</h3>
        <p>No collections match "${w(_)}". Try a different search term.</p>
      </div>
    `;return}a.innerHTML=t.map(e=>{const s=e.presentation_data||{},i=s.title||"Untitled Collection",o=s.conference||"",l=e._linkCount||0;let d,c;e.passkey_hash?(d="fa-key",c="Passkey"):e.visibility==="private"?(d="fa-lock",c="Private"):(d="fa-globe",c="Public");const u=e.theme||{},y=u.backgroundColor||u.background_color||"#1A2F5B",x=u.accentColor||u.accent_color||"#3B5998",q=e.created_at?new Date(e.created_at).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}):"";return`
      <div class="collection-card" data-id="${e.id}">
        <div class="card-theme-strip" style="background: linear-gradient(135deg, ${x}, ${y})"></div>
        <div class="card-body">
          <div class="card-top">
            ${r?"":'<span class="drag-handle" title="Drag to reorder"><i class="fas fa-grip-vertical"></i></span>'}
            <div class="card-content">
              <div class="card-title-row">
                <h3 class="card-title">${w(i)}</h3>
                <div class="card-actions">
                  <button class="btn-icon" title="Duplicate" data-action="duplicate" data-id="${e.id}">
                    <i class="fas fa-copy"></i>
                  </button>
                  <button class="btn-icon btn-danger-icon" title="Delete" data-action="delete" data-id="${e.id}">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
              ${o?`<p class="card-conference">${w(o)}</p>`:""}
            </div>
          </div>
          <div class="card-meta">
            <span class="card-badge"><i class="fas ${d}"></i> ${c}</span>
            <span class="card-links"><i class="fas fa-link"></i> ${l} link${l!==1?"s":""}</span>
            <span class="card-date">${q}</span>
          </div>
          ${s.tags&&s.tags.length>0,`
            <div class="card-tags" data-collection-id="${e.id}">
              ${M(s.tags||[],{clickable:!0,removable:!0,activeTag:p})}
              <button class="tag-add-btn" data-collection-id="${e.id}" title="Add tag"><i class="fas fa-plus"></i></button>
            </div>
          `}
        </div>
      </div>
    `}).join(""),a.querySelectorAll(".collection-card").forEach(e=>{e.addEventListener("click",s=>{s.target.closest(".card-actions")||s.target.closest(".drag-handle")||s.target.closest(".card-tags")||E(e.dataset.id)})}),a.querySelectorAll('[data-action="duplicate"]').forEach(e=>{e.addEventListener("click",s=>{s.stopPropagation(),G(e.dataset.id)})}),a.querySelectorAll('[data-action="delete"]').forEach(e=>{e.addEventListener("click",s=>{s.stopPropagation(),J(e.dataset.id)})}),a.querySelectorAll(".tag-remove[data-tag]").forEach(e=>{e.addEventListener("click",async s=>{s.stopPropagation();const i=e.dataset.tag,o=e.closest(".collection-card"),l=o==null?void 0:o.dataset.id,d=g.find(y=>y.id===l);if(!d)return;const c={...d.presentation_data||{}};c.tags=(c.tags||[]).filter(y=>y!==i);const{error:u}=await m.from("link_lists").update({presentation_data:c,updated_at:new Date().toISOString()}).eq("id",l);if(u){h("Failed to remove tag: "+u.message,"error");return}d.presentation_data=c,b()})}),a.querySelectorAll(".tag-chip[data-tag]").forEach(e=>{e.addEventListener("click",s=>{if(s.stopPropagation(),s.target.closest(".tag-remove"))return;const i=e.dataset.tag;p=p===i?"":i,b(),C()})}),a.querySelectorAll(".tag-add-btn").forEach(e=>{e.addEventListener("click",s=>{s.stopPropagation();const i=e.dataset.collectionId;j(e,i)})}),C(),!r&&!p&&t.length>1&&(k=new A(a,{animation:150,handle:".drag-handle",ghostClass:"sortable-ghost",chosenClass:"sortable-chosen",dragClass:"sortable-drag",onEnd:W}))}function C(){var t;const a=document.getElementById("tag-filter-bar");a&&(p?(a.style.display="flex",a.innerHTML=`
      <span>Filtered by:</span>
      <span class="tag-chip tag-active">${w(p)} <button class="tag-remove" id="clear-tag-filter">&times;</button></span>
    `,(t=document.getElementById("clear-tag-filter"))==null||t.addEventListener("click",()=>{p="",b()})):(a.style.display="none",a.innerHTML=""))}function j(a,t){var s;document.querySelectorAll(".tag-input-wrapper").forEach(i=>i.remove());const r=g.find(i=>i.id===t);if(!r)return;const n=(r.presentation_data||{}).tags||[],e=a.closest(".card-tags");D(e,v,n,async i=>{const o={...r.presentation_data||{},tags:H([...n,i])},{error:l}=await m.from("link_lists").update({presentation_data:o,updated_at:new Date().toISOString()}).eq("id",t);if(l){h("Failed to add tag: "+l.message,"error");return}r.presentation_data=o,v.includes(i)||v.push(i),v.sort(),P(),b()}),(s=e.querySelector(".tag-input"))==null||s.focus()}async function W(){const t=document.getElementById("collections-grid").querySelectorAll(".collection-card"),r=Array.from(t).map(e=>e.dataset.id),n=[];for(const e of r){const s=g.find(i=>i.id===e);s&&n.push(s)}for(const e of g)n.includes(e)||n.push(e);g=n;try{await Promise.all(g.map((e,s)=>(e.order_index=(s+1)*100,m.from("link_lists").update({order_index:e.order_index}).eq("id",e.id))))}catch(e){console.error("Failed to save order:",e)}}function Y(a){let t=a.toLowerCase().replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-").replace(/^-|-$/g,"").substring(0,50);return t?`${t}-${Math.random().toString(36).substring(2,6)}`:crypto.randomUUID().substring(0,8)}async function T(){const a=g.reduce((t,r)=>Math.min(t,r.order_index??0),0);try{const t=Y("untitled"),{data:r,error:n}=await m.from("link_lists").insert({owner_id:f.id,slug:t,visibility:"public",theme:{},presentation_data:{title:"Untitled Collection"},order_index:a-100}).select().single();if(n)throw n;E(r.id)}catch(t){console.error("Failed to create collection:",t),h("Failed to create collection: "+t.message,"error")}}async function G(a){var r,n;const t=g.find(e=>e.id===a);if(t&&confirm(`Duplicate "${((r=t.presentation_data)==null?void 0:r.title)||"Untitled"}"?`))try{const e=crypto.randomUUID(),s=g.reduce((d,c)=>Math.max(d,c.order_index||0),0),{data:i,error:o}=await m.from("link_lists").insert({owner_id:f.id,slug:e,title:t.title,description:t.description,theme:t.theme,socials:t.socials,layout:t.layout,visibility:t.visibility,presentation_data:{...t.presentation_data,title:(((n=t.presentation_data)==null?void 0:n.title)||"Untitled")+" (Copy)"},order_index:s+100}).select().single();if(o)throw o;const{data:l}=await m.from("link_items").select("*").eq("list_id",a);if(l&&l.length>0){const d=l.map(c=>({list_id:i.id,title:c.title,url:c.url,image_url:c.image_url,order_index:c.order_index,is_active:c.is_active}));await m.from("link_items").insert(d)}await L(),b()}catch(e){console.error("Failed to duplicate:",e),h("Failed to duplicate: "+e.message,"error")}}async function J(a){var n;const t=g.find(e=>e.id===a);if(!t)return;const r=((n=t.presentation_data)==null?void 0:n.title)||"Untitled Collection";if(confirm(`Delete "${r}"? This will also delete all links in this collection. This cannot be undone.`))try{const{error:e}=await m.from("link_lists").delete().eq("id",a).eq("owner_id",f.id);if(e)throw e;await L(),b()}catch(e){console.error("Failed to delete:",e),h("Failed to delete: "+e.message,"error")}}function w(a){const t=document.createElement("div");return t.textContent=a,t.innerHTML}R();

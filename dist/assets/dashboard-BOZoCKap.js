import{s as m}from"./supabase-whCCoo43.js";/* empty css             */import{a as q,b as A,n as F,g as x,s as p}from"./toast-C5Ve3yOU.js";import{S as M}from"./sortable.esm-D-EvzYhP.js";import{i as P,g as U,t as z}from"./theme-toggle-D-yRes8V.js";import{g as H,r as D,c as R,n as j,i as Q}from"./tag-utils-CwIXpYMv.js";let h=null,f=[],k="",g="",v=[],w=null;async function N(){var n,a,o,s;h=await q(),h&&(W(),await L(),b(),H(m,h.id).then(e=>{v=e}),await O(),(n=document.getElementById("new-collection-btn"))==null||n.addEventListener("click",S),(a=document.getElementById("template-modal-close"))==null||a.addEventListener("click",C),(o=document.getElementById("template-modal"))==null||o.addEventListener("click",e=>{e.target.id==="template-modal"&&C()}),document.addEventListener("keydown",e=>{e.key==="Escape"&&C()}),(s=document.getElementById("collection-search"))==null||s.addEventListener("input",e=>{k=e.target.value,b()}))}async function O(){var n,a;try{const{data:o}=await m.from("profiles").select("username").eq("id",h.id).single();if(o!=null&&o.username)return;const s=document.createElement("div");s.className="username-onboarding",s.innerHTML=`
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
    `;const e=document.querySelector(".dashboard-header");e.parentNode.insertBefore(s,e.nextSibling);let t=null;(n=document.getElementById("onboarding-username"))==null||n.addEventListener("input",r=>{const i=r.target.value.toLowerCase().replace(/[^a-z0-9-]/g,"");r.target.value=i;const l=document.getElementById("onboarding-username-status");if(!i||i.length<3){l.textContent=i?"Must be at least 3 characters":"",l.style.color="#64748b";return}l.textContent="Checking...",l.style.color="#64748b",clearTimeout(t),t=setTimeout(async()=>{const{data:d}=await m.from("profiles").select("id").eq("username",i).limit(1);d&&d.length>0?(l.textContent="Username is taken",l.style.color="#ef4444"):(l.textContent="Available!",l.style.color="#22c55e")},500)}),(a=document.getElementById("onboarding-save-btn"))==null||a.addEventListener("click",async()=>{var l,d,c;const r=(d=(l=document.getElementById("onboarding-username"))==null?void 0:l.value)==null?void 0:d.trim().toLowerCase().replace(/[^a-z0-9-]/g,"");if(!r||r.length<3){p("Username must be at least 3 characters (letters, numbers, hyphens only)","warning");return}const i=document.getElementById("onboarding-save-btn");i.disabled=!0,i.innerHTML='<i class="fas fa-spinner fa-spin"></i> Saving...';try{const{error:u}=await m.from("profiles").upsert({id:h.id,username:r});if(u){if(u.code==="23505"||(c=u.message)!=null&&c.includes("username"))p("That username is already taken. Please choose another.","warning");else throw u;i.disabled=!1,i.innerHTML="Set Username";return}s.remove()}catch(u){console.error("Failed to set username:",u),p("Failed to save: "+u.message,"error"),i.disabled=!1,i.innerHTML="Set Username"}})}catch{}}function W(){var o;const n=document.getElementById("main-nav");if(!n)return;n.innerHTML=`
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
  `,(o=document.getElementById("sign-out-btn"))==null||o.addEventListener("click",async()=>{await A(),F("login")}),P();const a=document.getElementById("theme-toggle-btn");a&&(a.querySelector("i").className=(U()==="dark","fas fa-circle-half-stroke"),a.addEventListener("click",()=>{const s=z();a.querySelector("i").className="fas fa-circle-half-stroke"}))}async function L(){const n=document.getElementById("collections-grid");if(n){n.innerHTML=`
    <div class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading your collections...</p>
    </div>
  `;try{const{data:a,error:o}=await m.from("link_lists").select("*").eq("owner_id",h.id).order("created_at",{ascending:!1});if(o)throw o;f=a||[],f.sort((s,e)=>{const t=s.order_index??1/0,r=e.order_index??1/0;return t!==r?t-r:new Date(e.created_at||0)-new Date(s.created_at||0)}),await Promise.all(f.map(async s=>{try{const{data:e,error:t}=await m.from("link_items").select("title, url").eq("list_id",s.id);s._links=t?[]:e||[],s._linkCount=s._links.length}catch{s._links=[],s._linkCount=0}}))}catch(a){console.error("Failed to load collections:",a),n.innerHTML=`
      <div class="empty-state">
        <i class="fas fa-exclamation-triangle"></i>
        <p>Failed to load collections. Please try again.</p>
        <button class="btn-primary" onclick="location.reload()">Retry</button>
      </div>
    `}}}function Y(){let n=f;if(g&&(n=n.filter(a=>((a.presentation_data||{}).tags||[]).includes(g))),k.trim()){const a=k.toLowerCase();n=n.filter(o=>{const s=o.presentation_data||{};return(s.title||"").toLowerCase().includes(a)||(s.conference||"").toLowerCase().includes(a)||(s.location||"").toLowerCase().includes(a)||(s.date||"").toLowerCase().includes(a)||(s.tags||[]).some(r=>r.includes(a))?!0:(o._links||[]).some(r=>(r.title||"").toLowerCase().includes(a)||(r.url||"").toLowerCase().includes(a))})}return n}function b(){var s;const n=document.getElementById("collections-grid");if(!n)return;if(w&&(w.destroy(),w=null),f.length===0){const e=_.filter(t=>t.id!=="blank").slice(0,3);n.innerHTML=`
      <div class="empty-state">
        <div class="empty-icon"><i class="fas fa-rocket"></i></div>
        <h3>Welcome to AcademiQR</h3>
        <p>Pick a template to create your first collection, or start from scratch.</p>
        <div class="empty-templates">
          ${e.map(t=>`
            <div class="template-card empty-template-card" data-template="${t.id}">
              <div class="template-icon" style="background: ${t.theme.backgroundColor||"#f1f5f9"}; color: ${t.theme.textColor||"#1A2F5B"};">
                <i class="fas ${t.icon}"></i>
              </div>
              <div class="template-name">${t.name}</div>
              <div class="template-desc">${t.desc}</div>
            </div>
          `).join("")}
        </div>
        <button class="btn-secondary" id="empty-create-btn" style="margin-top: 12px;">
          <i class="fas fa-plus"></i> Start from scratch
        </button>
      </div>
    `,n.querySelectorAll(".empty-template-card").forEach(t=>{t.addEventListener("click",()=>{const r=t.dataset.template,i=_.find(l=>l.id===r);i&&B(i.name+" Collection",r)})}),(s=document.getElementById("empty-create-btn"))==null||s.addEventListener("click",S);return}const a=Y(),o=!!k.trim();if(a.length===0){n.innerHTML=`
      <div class="empty-state">
        <div class="empty-icon"><i class="fas fa-search"></i></div>
        <h3>No matching collections</h3>
        <p>No collections match "${E(k)}". Try a different search term.</p>
      </div>
    `;return}n.innerHTML=a.map(e=>{const t=e.presentation_data||{},r=t.title||"Untitled Collection",i=t.conference||"",l=e._linkCount||0;let d,c;e.passkey_hash?(d="fa-key",c="Passkey"):e.visibility==="private"?(d="fa-lock",c="Private"):(d="fa-globe",c="Public");const u=e.theme||{},y=u.backgroundColor||u.background_color||"#1A2F5B",I=u.accentColor||u.accent_color||"#3B5998",$=e.created_at?new Date(e.created_at).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}):"";return`
      <div class="collection-card" data-id="${e.id}">
        <div class="card-theme-strip" style="background: linear-gradient(135deg, ${I}, ${y})"></div>
        <div class="card-body">
          <div class="card-top">
            ${o?"":'<span class="drag-handle" title="Drag to reorder"><i class="fas fa-grip-vertical"></i></span>'}
            <div class="card-content">
              <div class="card-title-row">
                <h3 class="card-title">${E(r)}</h3>
                <div class="card-actions">
                  <button class="btn-icon" title="Duplicate" data-action="duplicate" data-id="${e.id}">
                    <i class="fas fa-copy"></i>
                  </button>
                  <button class="btn-icon btn-danger-icon" title="Delete" data-action="delete" data-id="${e.id}">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>
              ${i?`<p class="card-conference">${E(i)}</p>`:""}
            </div>
          </div>
          <div class="card-meta">
            <span class="card-badge"><i class="fas ${d}"></i> ${c}</span>
            <span class="card-links"><i class="fas fa-link"></i> ${l} link${l!==1?"s":""}</span>
            <span class="card-date">${$}</span>
          </div>
          ${t.tags&&t.tags.length>0,`
            <div class="card-tags" data-collection-id="${e.id}">
              ${D(t.tags||[],{clickable:!0,removable:!0,activeTag:g})}
              <button class="tag-add-btn" data-collection-id="${e.id}" title="Add tag"><i class="fas fa-plus"></i></button>
            </div>
          `}
        </div>
      </div>
    `}).join(""),n.querySelectorAll(".collection-card").forEach(e=>{e.addEventListener("click",t=>{t.target.closest(".card-actions")||t.target.closest(".drag-handle")||t.target.closest(".card-tags")||x(e.dataset.id)})}),n.querySelectorAll('[data-action="duplicate"]').forEach(e=>{e.addEventListener("click",t=>{t.stopPropagation(),X(e.dataset.id)})}),n.querySelectorAll('[data-action="delete"]').forEach(e=>{e.addEventListener("click",t=>{t.stopPropagation(),Z(e.dataset.id)})}),n.querySelectorAll(".tag-remove[data-tag]").forEach(e=>{e.addEventListener("click",async t=>{t.stopPropagation();const r=e.dataset.tag,i=e.closest(".collection-card"),l=i==null?void 0:i.dataset.id,d=f.find(y=>y.id===l);if(!d)return;const c={...d.presentation_data||{}};c.tags=(c.tags||[]).filter(y=>y!==r);const{error:u}=await m.from("link_lists").update({presentation_data:c,updated_at:new Date().toISOString()}).eq("id",l);if(u){p("Failed to remove tag: "+u.message,"error");return}d.presentation_data=c,b()})}),n.querySelectorAll(".tag-chip[data-tag]").forEach(e=>{e.addEventListener("click",t=>{if(t.stopPropagation(),t.target.closest(".tag-remove"))return;const r=e.dataset.tag;g=g===r?"":r,b(),T()})}),n.querySelectorAll(".tag-add-btn").forEach(e=>{e.addEventListener("click",t=>{t.stopPropagation();const r=e.dataset.collectionId;G(e,r)})}),T(),!o&&!g&&a.length>1&&(w=new M(n,{animation:150,handle:".drag-handle",ghostClass:"sortable-ghost",chosenClass:"sortable-chosen",dragClass:"sortable-drag",onEnd:J}))}function T(){var a;const n=document.getElementById("tag-filter-bar");n&&(g?(n.style.display="flex",n.innerHTML=`
      <span>Filtered by:</span>
      <span class="tag-chip tag-active">${E(g)} <button class="tag-remove" id="clear-tag-filter">&times;</button></span>
    `,(a=document.getElementById("clear-tag-filter"))==null||a.addEventListener("click",()=>{g="",b()})):(n.style.display="none",n.innerHTML=""))}function G(n,a){var t;document.querySelectorAll(".tag-input-wrapper").forEach(r=>r.remove());const o=f.find(r=>r.id===a);if(!o)return;const s=(o.presentation_data||{}).tags||[],e=n.closest(".card-tags");R(e,v,s,async r=>{const i={...o.presentation_data||{},tags:j([...s,r])},{error:l}=await m.from("link_lists").update({presentation_data:i,updated_at:new Date().toISOString()}).eq("id",a);if(l){p("Failed to add tag: "+l.message,"error");return}o.presentation_data=i,v.includes(r)||v.push(r),v.sort(),Q(),b()}),(t=e.querySelector(".tag-input"))==null||t.focus()}async function J(){const a=document.getElementById("collections-grid").querySelectorAll(".collection-card"),o=Array.from(a).map(e=>e.dataset.id),s=[];for(const e of o){const t=f.find(r=>r.id===e);t&&s.push(t)}for(const e of f)s.includes(e)||s.push(e);f=s;try{await Promise.all(f.map((e,t)=>(e.order_index=(t+1)*100,m.from("link_lists").update({order_index:e.order_index}).eq("id",e.id))))}catch(e){console.error("Failed to save order:",e)}}function K(n){let a=n.toLowerCase().replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-").replace(/^-|-$/g,"").substring(0,50);return a?`${a}-${Math.random().toString(36).substring(2,6)}`:crypto.randomUUID().substring(0,8)}const _=[{id:"blank",name:"Blank",icon:"fa-file",desc:"Start from scratch",theme:{},presentation:{}},{id:"conference",name:"Conference Talk",icon:"fa-microphone",desc:"Presentation with slides & resources",theme:{backgroundColor:"#1A2F5B",textColor:"#ffffff",buttonStyle:"filled",buttonBackgroundColor:"#3B5998",buttonTextColor:"#ffffff"},presentation:{conference:"",location:"",date:""}},{id:"workshop",name:"Workshop",icon:"fa-chalkboard-teacher",desc:"Hands-on session with materials",theme:{backgroundColor:"#0f766e",textColor:"#ffffff",buttonStyle:"filled",buttonBackgroundColor:"#14b8a6",buttonTextColor:"#ffffff"},presentation:{conference:"",location:""}},{id:"course",name:"Course / Lecture",icon:"fa-graduation-cap",desc:"Educational content & readings",theme:{backgroundColor:"#7c3aed",textColor:"#ffffff",buttonStyle:"filled",buttonBackgroundColor:"#8b5cf6",buttonTextColor:"#ffffff"},presentation:{}},{id:"research",name:"Research Paper",icon:"fa-flask",desc:"Publications, data & supplemental materials",theme:{backgroundColor:"#1e3a5f",textColor:"#ffffff",buttonStyle:"outline",buttonBackgroundColor:"#ffffff",buttonTextColor:"#1e3a5f"},presentation:{}},{id:"portfolio",name:"Portfolio",icon:"fa-briefcase",desc:"Professional links & projects",theme:{backgroundColor:"#18181b",textColor:"#ffffff",buttonStyle:"filled",buttonBackgroundColor:"#3b82f6",buttonTextColor:"#ffffff"},presentation:{}}];function V(){var o;const n=document.getElementById("template-modal");document.getElementById("new-coll-title").value="";const a=document.getElementById("template-grid");a.innerHTML=_.map(s=>`
    <div class="template-card" data-template="${s.id}">
      <div class="template-icon" style="background: ${s.theme.backgroundColor||"#f1f5f9"}; color: ${s.theme.textColor||"#1A2F5B"};">
        <i class="fas ${s.icon}"></i>
      </div>
      <div class="template-name">${s.name}</div>
      <div class="template-desc">${s.desc}</div>
    </div>
  `).join(""),a.querySelectorAll(".template-card").forEach(s=>{s.addEventListener("click",()=>{var t,r;const e=(t=document.getElementById("new-coll-title"))==null?void 0:t.value.trim();if(!e){(r=document.getElementById("new-coll-title"))==null||r.focus(),p("Please enter a title first.","warning");return}B(e,s.dataset.template)})}),n.style.display="flex",(o=document.getElementById("new-coll-title"))==null||o.focus()}function C(){document.getElementById("template-modal").style.display="none"}async function B(n,a){const o=_.find(t=>t.id===a)||_[0],s=K(n),e=f.reduce((t,r)=>Math.max(t,r.order_index||0),0);try{const{data:t,error:r}=await m.from("link_lists").insert({owner_id:h.id,slug:s,visibility:"public",theme:o.theme||{},presentation_data:{title:n,...o.presentation},order_index:e+100}).select().single();if(r)throw r;C(),x(t.id)}catch(t){console.error("Failed to create collection:",t),p("Failed to create collection: "+t.message,"error")}}async function S(){V()}async function X(n){var o,s;const a=f.find(e=>e.id===n);if(a&&confirm(`Duplicate "${((o=a.presentation_data)==null?void 0:o.title)||"Untitled"}"?`))try{const e=crypto.randomUUID(),t=f.reduce((d,c)=>Math.max(d,c.order_index||0),0),{data:r,error:i}=await m.from("link_lists").insert({owner_id:h.id,slug:e,title:a.title,description:a.description,theme:a.theme,socials:a.socials,layout:a.layout,visibility:a.visibility,presentation_data:{...a.presentation_data,title:(((s=a.presentation_data)==null?void 0:s.title)||"Untitled")+" (Copy)"},order_index:t+100}).select().single();if(i)throw i;const{data:l}=await m.from("link_items").select("*").eq("list_id",n);if(l&&l.length>0){const d=l.map(c=>({list_id:r.id,title:c.title,url:c.url,image_url:c.image_url,order_index:c.order_index,is_active:c.is_active}));await m.from("link_items").insert(d)}await L(),b()}catch(e){console.error("Failed to duplicate:",e),p("Failed to duplicate: "+e.message,"error")}}async function Z(n){var s;const a=f.find(e=>e.id===n);if(!a)return;const o=((s=a.presentation_data)==null?void 0:s.title)||"Untitled Collection";if(confirm(`Delete "${o}"? This will also delete all links in this collection. This cannot be undone.`))try{const{error:e}=await m.from("link_lists").delete().eq("id",n).eq("owner_id",h.id);if(e)throw e;await L(),b()}catch(e){console.error("Failed to delete:",e),p("Failed to delete: "+e.message,"error")}}function E(n){const a=document.createElement("div");return a.textContent=n,a.innerHTML}N();

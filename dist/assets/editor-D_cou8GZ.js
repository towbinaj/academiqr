import{s as B}from"./supabase-whCCoo43.js";/* empty css             */import{c as Qe,s as Q,a as et,d as tt,e as Pe,b as it,n as ot}from"./toast-C5Ve3yOU.js";import{c as le,r as se,f as nt}from"./auto-save-CVe8WLcj.js";import{h as ce,r as at,g as ve,a as $e,b as Ne,c as Oe}from"./link-utils-D1VnX3pm.js";import{i as lt,g as st,t as rt}from"./theme-toggle-D-yRes8V.js";import{c as Ie,l as dt}from"./image-utils-gR03vQbS.js";import{g as ct,r as ee,c as He,n as Fe,i as De}from"./tag-utils-CwIXpYMv.js";const ut="https://natzpfyxpuycsuuzbqrd.supabase.co/storage/v1/object/public/assets/AcademiQR_logo_blue.png",K=250,W=16,D=8;let ye=null,O=null;function Ge(e){const t=document.createElement("div");return t.textContent=e,t.innerHTML}function _e(e,t,i,o,n,a){e.beginPath(),e.moveTo(t+a,i),e.lineTo(t+o-a,i),e.arcTo(t+o,i,t+o,i+a,a),e.lineTo(t+o,i+n-a),e.arcTo(t+o,i+n,t+o-a,i+n,a),e.lineTo(t+a,i+n),e.arcTo(t,i+n,t,i+n-a,a),e.lineTo(t,i+a),e.arcTo(t,i,t+a,i,a),e.closePath()}function ke(e){var i,o,n,a,l,r;const t=d=>e.querySelector(`#${d}`);return{color:((i=t("qr-color"))==null?void 0:i.value)||"#1A2F5B",bgColor:((o=t("qr-bg-color"))==null?void 0:o.value)||"#ffffff",borderEnabled:((n=t("qr-border-enabled"))==null?void 0:n.checked)||!1,borderColor:((a=t("qr-border-color"))==null?void 0:a.value)||"#000000",borderStyle:((l=t("qr-border-style"))==null?void 0:l.value)||"solid",borderRadius:parseInt(((r=t("qr-border-radius"))==null?void 0:r.value)||"16"),logo:O}}function gt(e,t){const i=t.borderEnabled?D:0,o=t.borderEnabled?t.borderRadius:16,n=document.createElement("canvas");n.width=K,n.height=K;const a=n.getContext("2d");if(a.clearRect(0,0,K,K),a.fillStyle=t.bgColor,_e(a,i,i,e.width+W*2,e.height+W*2,o),a.fill(),t.borderEnabled){if(a.strokeStyle=t.borderColor,a.lineWidth=D,t.borderStyle==="dashed")a.setLineDash([D*2,D]);else if(t.borderStyle==="dotted")a.setLineDash([D,D]);else if(t.borderStyle==="double"){a.lineWidth=D/3;const d=D/2,c=D/2,h=e.width+W*2+D,m=e.height+W*2+D;a.strokeRect(d,c,h,m),a.strokeRect(d+D,c+D,h-D*2,m-D*2)}if(t.borderStyle!=="double"){const d=D/2,c=D/2,h=e.width+W*2+D,m=e.height+W*2+D;o>0?(_e(a,d,c,h,m,o),a.stroke()):a.strokeRect(d,c,h,m)}a.setLineDash([])}const l=i+W,r=i+W;return a.save(),_e(a,i,i,e.width+W*2,e.height+W*2,o),a.clip(),a.drawImage(e,l,r),a.restore(),{canvas:n,ctx:a,qrX:l,qrY:r,qrSize:e.width}}function mt(e,t,i,o,n){return new Promise(a=>{if(!t){a();return}const l=new Image;l.crossOrigin="anonymous",l.onload=()=>{const r=n*.2;let d=l.width,c=l.height;if(d>r||c>r){const x=Math.min(r/d,r/c);d*=x,c*=x}const h=i+(n-d)/2,m=o+(n-c)/2;e.fillStyle="#ffffff",e.beginPath(),e.arc(i+n/2,o+n/2,Math.max(d,c)/2+8,0,Math.PI*2),e.fill(),e.drawImage(l,h,m,d,c),a()},l.onerror=()=>a(),l.src=t})}async function oe(e,t){if(typeof QRCode>"u"){console.error("[QR] QRCode.js library not loaded");return}const i=ke(e),o=e.querySelector("#qr-code-container");if(!o)return;ye=null,o.innerHTML="",o.style.cssText="background:transparent; padding:0; display:flex; align-items:center; justify-content:center; width:250px; height:250px; margin:0 auto; box-sizing:border-box; border:none; border-radius:0; overflow:visible;";const n=i.borderEnabled?D:0,a=K-n*2-W*2,l=document.createElement("div");l.style.cssText="position:absolute; left:-9999px; top:-9999px;",document.body.appendChild(l);try{ye=new QRCode(l,{text:t,width:a,height:a,colorDark:i.color,colorLight:i.bgColor,correctLevel:QRCode.CorrectLevel.H})}catch(q){console.error("[QR] Generation failed:",q),o.innerHTML='<p style="color:#ef4444; font-size:0.8rem;">QR generation failed</p>',document.body.removeChild(l);return}await new Promise(q=>setTimeout(q,100));const r=l.querySelector("canvas");if(!r){document.body.removeChild(l);return}const{canvas:d,ctx:c,qrX:h,qrY:m,qrSize:x}=gt(r,i);await mt(c,O,h,m,x);const w=document.createElement("img");w.src=d.toDataURL("image/png");const y=i.borderEnabled?i.borderRadius:16;w.style.cssText=`width:${K}px; height:${K}px; display:block; margin:0 auto; border-radius:${y}px; background:transparent;`,w.alt="QR Code",w.title="Right-click to copy image",w.setAttribute("data-composite","true"),o.innerHTML="",o.appendChild(w),o._compositeCanvas=d,document.body.removeChild(l);const T=e.querySelector("#qr-actions");T&&(T.style.display="flex")}function pt(e,t,i){const o=e.querySelector("#qr-code-container");if(!o||!ye)return;const n=o.querySelector('img[data-composite="true"]');if(!n)return;const a=`${i||"qrcode"}-qrcode`;if(t==="png"||t==="jpeg"){const l=new Image;l.onload=()=>{const r=document.createElement("canvas");r.width=l.width,r.height=l.height;const d=r.getContext("2d");t==="jpeg"&&(d.fillStyle="#ffffff",d.fillRect(0,0,r.width,r.height)),d.drawImage(l,0,0);const c=document.createElement("a");c.download=`${a}.${t==="jpeg"?"jpg":"png"}`,c.href=r.toDataURL(t==="jpeg"?"image/jpeg":"image/png",.95),c.click()},l.src=n.src}else if(t==="svg"){const l=new Image;l.onload=()=>{const r=document.createElement("canvas");r.width=l.width,r.height=l.height,r.getContext("2d").drawImage(l,0,0);const c=r.toDataURL("image/png"),h=`<svg xmlns="http://www.w3.org/2000/svg" width="${r.width}" height="${r.height}" viewBox="0 0 ${r.width} ${r.height}"><image href="${c}" width="${r.width}" height="${r.height}"/></svg>`,m=new Blob([h],{type:"image/svg+xml"}),x=document.createElement("a");x.download=`${a}.svg`,x.href=URL.createObjectURL(m),x.click(),URL.revokeObjectURL(x.href)},l.src=n.src}}async function ft(e,t){const i=ke(t),o={color:i.color,bgColor:i.bgColor,borderEnabled:i.borderEnabled,borderColor:i.borderColor,borderStyle:i.borderStyle,borderRadius:String(i.borderRadius),logo:O},{error:n}=await B.from("link_lists").update({qr_code_data:o,updated_at:new Date().toISOString()}).eq("id",e);return!n}async function Se(e,t){const i=e.querySelector("#saved-qr-themes-list");if(!i)return;const{data:o,error:n}=await B.from("user_themes").select("*").eq("user_id",t).eq("theme_type","qr").order("created_at",{ascending:!1});if(n||!o||o.length===0){i.innerHTML='<p class="qr-themes-empty">No saved QR themes yet</p>';return}i.innerHTML=o.map(a=>{const l=Ge(a.name);return`
      <div class="saved-theme-item" data-theme-id="${a.id}" data-theme-name="${l}">
        <div class="saved-theme-name">${l}</div>
        <button class="btn-icon qr-theme-delete" data-theme-id="${a.id}" data-theme-name="${l}" title="Delete"><i class="fas fa-trash"></i></button>
      </div>
    `}).join("")}async function bt(e,t,i){var d;const o=e.querySelector("#qr-theme-name"),n=(d=o==null?void 0:o.value)==null?void 0:d.trim();if(!n){Q("Please enter a QR theme name","warning");return}const a=ke(e),l={name:n,color:a.color,bgColor:a.bgColor,borderEnabled:a.borderEnabled,borderColor:a.borderColor,borderStyle:a.borderStyle,borderRadius:String(a.borderRadius),logo:O},{data:r}=await B.from("user_themes").select("id").eq("user_id",t).eq("name",n).eq("theme_type","qr").maybeSingle();if(r){if(!confirm(`QR Theme "${n}" already exists. Overwrite?`))return;await B.from("user_themes").update({theme_data:l,updated_at:new Date().toISOString()}).eq("id",r.id)}else await B.from("user_themes").insert({user_id:t,name:n,theme_type:"qr",theme_data:l});o.value="",await Se(e,t)}async function vt(e,t,i,o){confirm(`Delete QR Theme "${o}"?`)&&(await B.from("user_themes").delete().eq("id",i).eq("user_id",t),await Se(e,t))}function yt(e,t,i){const o=n=>e.querySelector(`#${n}`);if(i.color&&(o("qr-color")&&(o("qr-color").value=i.color),o("qr-color-text")&&(o("qr-color-text").value=i.color)),i.bgColor&&(o("qr-bg-color")&&(o("qr-bg-color").value=i.bgColor),o("qr-bg-color-text")&&(o("qr-bg-color-text").value=i.bgColor)),i.borderEnabled!==void 0){o("qr-border-enabled")&&(o("qr-border-enabled").checked=i.borderEnabled);const n=o("qr-border-options");n&&(n.style.display=i.borderEnabled?"block":"none")}i.borderColor&&(o("qr-border-color")&&(o("qr-border-color").value=i.borderColor),o("qr-border-color-text")&&(o("qr-border-color-text").value=i.borderColor)),i.borderStyle&&o("qr-border-style")&&(o("qr-border-style").value=i.borderStyle),i.borderRadius&&o("qr-border-radius")&&(o("qr-border-radius").value=i.borderRadius),i.logo?O=i.logo:O=null,Ee(e),oe(e,t)}function ht(e,t,i){var a;const o=(a=i.target.files)==null?void 0:a[0];if(!o)return;if(o.size>5*1024*1024){Q("Logo must be under 5 MB","warning"),i.target.value="";return}const n=new FileReader;n.onload=l=>{O=l.target.result,Ee(e),oe(e,t)},n.readAsDataURL(o)}function kt(e,t){O=null,Ee(e);const i=e.querySelector("#qr-logo-upload");i&&(i.value=""),oe(e,t)}function Et(e,t){O=ut,Ee(e),oe(e,t)}function Ee(e){const t=e.querySelector("#qr-logo-preview"),i=e.querySelector("#qr-logo-img");O?(i&&(i.src=O),t&&(t.style.display="inline-block")):(t&&(t.style.display="none"),i&&(i.src=""))}function xt(e,t,i){const o=e.querySelector(`#${t}`),n=e.querySelector(`#${i}`);o&&n&&(n.value=o.value)}function _t(e,t,i){const o=e.querySelector(`#${t}`),n=e.querySelector(`#${i}`);o&&n&&/^#[0-9a-fA-F]{6}$/.test(o.value)&&(n.value=o.value)}function wt(e,t,i){var y,T,q,P,k,u,b,L,p,_,S,g,f,H,C,$,A;if(!t||!i){e.innerHTML='<div class="qr-tab"><p>Please select a collection first.</p></div>';return}const o=Qe(i.id,t.id),n=t.qr_code_data||{};ye=null,O=n.logo||null;const a=n.color||"#1A2F5B",l=n.bgColor||"#ffffff",r=n.borderEnabled===!0||n.borderEnabled==="true",d=n.borderColor||"#000000",c=n.borderStyle||"solid",h=String(n.borderRadius||"16");e.innerHTML=`
    <div class="qr-tab">
      <h3>QR Code <span id="qr-save-status" class="auto-save-status"></span></h3>
      <p class="tab-description">Generate a QR code that links directly to this collection's public page.</p>

      <div class="qr-content">
        <!-- Left: Settings -->
        <div class="qr-settings">

          <!-- Public URL -->
          <div class="form-group">
            <label>Collection URL</label>
            <div class="qr-url-row">
              <input type="text" id="qr-url" class="form-input" value="${Ge(o)}" readonly>
              <button id="qr-copy-url" class="btn-icon" title="Copy URL"><i class="fas fa-copy"></i></button>
            </div>
          </div>

          <!-- Colors -->
          <div class="form-group qr-color-row">
            <div class="qr-color-group">
              <label>QR Code Color</label>
              <div class="color-options">
                <input type="color" id="qr-color" value="${a}" class="color-picker">
                <input type="text" id="qr-color-text" value="${a}" class="color-input" maxlength="7">
              </div>
            </div>
            <div class="qr-color-group">
              <label>Background Color</label>
              <div class="color-options">
                <input type="color" id="qr-bg-color" value="${l}" class="color-picker">
                <input type="text" id="qr-bg-color-text" value="${l}" class="color-input" maxlength="7">
              </div>
            </div>
          </div>

          <!-- Border -->
          <div class="form-group">
            <label class="qr-checkbox-label">
              <input type="checkbox" id="qr-border-enabled" ${r?"checked":""}>
              <span>Border</span>
            </label>
            <div id="qr-border-options" class="qr-border-options" style="display: ${r?"block":"none"};">
              <div class="form-group">
                <label class="qr-sub-label">Color</label>
                <div class="color-options">
                  <input type="color" id="qr-border-color" value="${d}" class="color-picker">
                  <input type="text" id="qr-border-color-text" value="${d}" class="color-input" maxlength="7">
                </div>
              </div>
              <div class="qr-border-inline">
                <div>
                  <label class="qr-sub-label">Style</label>
                  <select id="qr-border-style" class="form-input">
                    <option value="solid" ${c==="solid"?"selected":""}>Solid</option>
                    <option value="dashed" ${c==="dashed"?"selected":""}>Dashed</option>
                    <option value="dotted" ${c==="dotted"?"selected":""}>Dotted</option>
                    <option value="double" ${c==="double"?"selected":""}>Double</option>
                  </select>
                </div>
                <div>
                  <label class="qr-sub-label">Corners</label>
                  <select id="qr-border-radius" class="form-input">
                    <option value="16" ${h==="16"?"selected":""}>Rounded</option>
                    <option value="0" ${h==="0"?"selected":""}>Square</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Logo -->
          <div class="form-group">
            <label>Center Logo</label>
            <input type="file" id="qr-logo-upload" accept="image/*" style="display:none;">
            <div class="qr-logo-buttons">
              <button id="qr-logo-upload-btn" class="btn-primary btn-sm">Upload New</button>
              <button id="qr-logo-default-btn" class="btn-primary btn-sm">AcademiQR Logo</button>
            </div>
            <div id="qr-logo-preview" class="qr-logo-preview" style="display: ${O?"inline-block":"none"};">
              <img id="qr-logo-img" src="${O||""}" alt="Logo">
              <button id="qr-logo-remove" class="btn-remove-image" title="Remove logo"><i class="fas fa-xmark"></i></button>
            </div>
          </div>

          <!-- QR Theme Management -->
          <div class="qr-theme-section">
            <div class="section-header" id="qr-theme-toggle">
              <h4>QR Code Theme Management</h4>
              <svg class="section-chevron" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
            </div>
            <div class="section-content" id="qr-theme-content" style="display:none;">
              <div class="form-group">
                <label class="qr-sub-label">New Theme</label>
                <div class="qr-theme-save-row">
                  <input type="text" id="qr-theme-name" class="form-input" maxlength="100" placeholder="Enter theme name">
                  <button id="qr-theme-save-btn" class="btn-primary btn-sm">Save</button>
                </div>
              </div>
              <div class="form-group">
                <label class="qr-sub-label">Saved Themes</label>
                <div id="saved-qr-themes-list">
                  <p class="qr-themes-empty">Loading...</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Preview + Download -->
        <div class="qr-preview-section">
          <div id="qr-code-container" class="qr-code-container">
            <div style="text-align:center; color:#9ca3af;">
              <i class="fas fa-qrcode" style="font-size:2rem; margin-bottom:8px; display:block; opacity:0.3;"></i>
              <p style="font-size:0.85rem;">Generating...</p>
            </div>
          </div>
          <div id="qr-actions" class="qr-actions" style="display:none;">
            <button class="btn-primary btn-sm" data-format="png"><i class="fas fa-download"></i> PNG</button>
            <button class="btn-primary btn-sm" data-format="jpeg"><i class="fas fa-download"></i> JPEG</button>
            <button class="btn-primary btn-sm" data-format="svg"><i class="fas fa-download"></i> SVG</button>
          </div>
        </div>
      </div>
    </div>
  `;const m=()=>oe(e,o);(y=e.querySelector("#qr-copy-url"))==null||y.addEventListener("click",()=>{navigator.clipboard.writeText(o).then(()=>{const s=e.querySelector("#qr-copy-url");s&&(s.innerHTML='<i class="fas fa-check"></i>',setTimeout(()=>s.innerHTML='<i class="fas fa-copy"></i>',1500))})});for(const s of["qr-color","qr-bg-color","qr-border-color"])(T=e.querySelector(`#${s}`))==null||T.addEventListener("input",()=>{xt(e,s,s+"-text"),m()});for(const[s,E]of[["qr-color-text","qr-color"],["qr-bg-color-text","qr-bg-color"],["qr-border-color-text","qr-border-color"]])(q=e.querySelector(`#${s}`))==null||q.addEventListener("input",()=>{_t(e,s,E),m()});(P=e.querySelector("#qr-border-enabled"))==null||P.addEventListener("change",s=>{const E=e.querySelector("#qr-border-options");E&&(E.style.display=s.target.checked?"block":"none"),m()});for(const s of["qr-border-style","qr-border-radius"])(k=e.querySelector(`#${s}`))==null||k.addEventListener("change",m);const x=le(async()=>{const s=await ft(t.id,e);if(s){const E=ke(e);t.qr_code_data={color:E.color,bgColor:E.bgColor,borderEnabled:E.borderEnabled,borderColor:E.borderColor,borderStyle:E.borderStyle,borderRadius:String(E.borderRadius),logo:O}}return s},{statusSelector:"#qr-save-status"});se(x);const w=()=>x.trigger();for(const s of["qr-color","qr-bg-color","qr-border-color"])(u=e.querySelector(`#${s}`))==null||u.addEventListener("input",w);for(const s of["qr-color-text","qr-bg-color-text","qr-border-color-text"])(b=e.querySelector(`#${s}`))==null||b.addEventListener("input",w);(L=e.querySelector("#qr-border-enabled"))==null||L.addEventListener("change",w);for(const s of["qr-border-style","qr-border-radius"])(p=e.querySelector(`#${s}`))==null||p.addEventListener("change",w);(_=e.querySelector("#qr-logo-upload-btn"))==null||_.addEventListener("click",()=>{var s;(s=e.querySelector("#qr-logo-upload"))==null||s.click()}),(S=e.querySelector("#qr-logo-upload"))==null||S.addEventListener("change",s=>{ht(e,o,s),w()}),(g=e.querySelector("#qr-logo-default-btn"))==null||g.addEventListener("click",()=>{Et(e,o),w()}),(f=e.querySelector("#qr-logo-remove"))==null||f.addEventListener("click",()=>{kt(e,o),w()}),(H=e.querySelector("#qr-actions"))==null||H.addEventListener("click",s=>{const E=s.target.closest("button[data-format]");E&&pt(e,E.dataset.format,t.slug)}),(C=e.querySelector("#qr-theme-toggle"))==null||C.addEventListener("click",()=>{const s=e.querySelector("#qr-theme-content"),E=e.querySelector("#qr-theme-toggle .section-chevron");if(s){const M=s.style.display!=="none";s.style.display=M?"none":"block",E&&E.classList.toggle("collapsed",M)}}),($=e.querySelector("#qr-theme-save-btn"))==null||$.addEventListener("click",()=>{bt(e,i.id)}),(A=e.querySelector("#saved-qr-themes-list"))==null||A.addEventListener("click",async s=>{const E=s.target.closest(".qr-theme-delete");if(E){s.stopPropagation(),await vt(e,i.id,E.dataset.themeId,E.dataset.themeName);return}const M=s.target.closest(".saved-theme-item");if(M){const{data:j}=await B.from("user_themes").select("theme_data").eq("id",M.dataset.themeId).single();j!=null&&j.theme_data&&yt(e,o,j.theme_data)}}),oe(e,o),Se(e,i.id)}function me(e){const t=document.createElement("div");return t.textContent=e,t.innerHTML}const Lt={instagram:"Instagram",facebook:"Facebook",twitter:"X (Twitter)",linkedin:"LinkedIn",youtube:"YouTube",tiktok:"TikTok",snapchat:"Snapchat",email:"Email"};function qt(){const e=new Date,t=new Date;return t.setDate(t.getDate()-30),{from:t.toISOString().slice(0,10),to:e.toISOString().slice(0,10)}}function Ue(e,t=!1){const[i,o,n]=e.split("-").map(Number);return t?new Date(i,o-1,n,23,59,59,999).toISOString():new Date(i,o-1,n,0,0,0,0).toISOString()}async function $t(e,t,i,o){var $,A;const n=i?Ue(i):null,a=o?Ue(o,!0):null;function l(s,E){return n&&(s=s.gte(E,n)),a&&(s=s.lte(E,a)),s}let r=B.from("link_clicks").select("*",{count:"exact",head:!0}).eq("owner_id",e).eq("list_id",t).not("link_id","is",null);r=l(r,"clicked_at");const{count:d}=await r;let c=B.from("page_views").select("*",{count:"exact",head:!0}).eq("owner_id",e).eq("list_id",t);c=l(c,"viewed_at");const{count:h}=await c;let m=B.from("page_views").select("session_id").eq("owner_id",e).eq("list_id",t);m=l(m,"viewed_at");const{data:x}=await m,w=x?new Set(x.map(s=>s.session_id).filter(Boolean)).size:0;let y=B.from("link_clicks").select("link_id, link_items:link_id (title, url)").eq("owner_id",e).eq("list_id",t).not("link_id","is",null);y=l(y,"clicked_at");const{data:T}=await y,q={};if(T)for(const s of T)q[s.link_id]||(q[s.link_id]={title:(($=s.link_items)==null?void 0:$.title)||"Unknown Link",url:((A=s.link_items)==null?void 0:A.url)||"",clicks:0}),q[s.link_id].clicks++;const P=Object.values(q).sort((s,E)=>E.clicks-s.clicks);let k=B.from("link_clicks").select("social_platform").eq("owner_id",e).eq("list_id",t);k=l(k,"clicked_at");const{data:u}=await k,b={};if(u)for(const s of u){if(!s.social_platform)continue;const E=s.social_platform.toLowerCase();b[E]||(b[E]={platform:E,clicks:0}),b[E].clicks++}const L=Object.values(b).sort((s,E)=>E.clicks-s.clicks),p=L.reduce((s,E)=>s+E.clicks,0);let _=B.from("page_views").select("viewed_at").eq("owner_id",e).eq("list_id",t);_=l(_,"viewed_at");const{data:S}=await _,g={};if(S)for(const s of S){const E=(s.viewed_at||s.created_at||"").substring(0,10);E&&(g[E]=(g[E]||0)+1)}let f=B.from("link_clicks").select("clicked_at").eq("owner_id",e).eq("list_id",t).not("link_id","is",null);f=l(f,"clicked_at");const{data:H}=await f,C={};if(H)for(const s of H){const E=(s.clicked_at||s.created_at||"").substring(0,10);E&&(C[E]=(C[E]||0)+1)}return{totalClicks:d||0,totalViews:h||0,uniqueVisitors:w,totalSocialClicks:p,linkBreakdown:P,socialBreakdown:L,dailyViews:g,dailyClicks:C}}function It(e,t){const i=e.querySelector("#links-breakdown-list");if(!i)return;if(!t||t.length===0){i.innerHTML='<p class="analytics-empty"><i class="fas fa-chart-bar" style="opacity:0.3; font-size:1.5rem; display:block; margin-bottom:8px;"></i>No link clicks yet. Share your collection to start seeing analytics.</p>';return}const o=Math.max(...t.map(n=>n.clicks));i.innerHTML=t.map(n=>{const a=o>0?n.clicks/o*100:0,l=n.url.length>50?n.url.substring(0,50)+"...":n.url;return`
      <div class="analytics-link-row">
        <div class="analytics-link-info">
          <div class="analytics-link-title">${me(n.title)}</div>
          <div class="analytics-link-url" title="${me(n.url)}">${me(l)}</div>
        </div>
        <div class="analytics-link-count">${n.clicks}</div>
        <div class="analytics-bar-track">
          <div class="analytics-bar-fill" style="width: ${a}%;"></div>
        </div>
      </div>
    `}).join("")}function St(e,t){const i=e.querySelector("#social-breakdown-list");if(i){if(!t||t.length===0){i.innerHTML='<p class="analytics-empty">No social media clicks yet.</p>';return}i.innerHTML=t.map(o=>{const n=Lt[o.platform]||o.platform.charAt(0).toUpperCase()+o.platform.slice(1);return`
      <div class="analytics-social-row">
        <span class="analytics-social-name">${me(n)}</span>
        <span class="analytics-social-count">${o.clicks}</span>
      </div>
    `}).join("")}}function Tt(e,t){const i=(o,n)=>{const a=e.querySelector(`#${o}`);a&&(a.textContent=n)};i("stat-total-views",t.totalViews),i("stat-link-clicks",t.totalClicks),i("stat-social-clicks",t.totalSocialClicks),i("stat-unique-visitors",t.uniqueVisitors)}function Bt(e,t,i,o,n){const a=e.querySelector("#analytics-chart");if(!a)return;const l=a.getContext("2d"),r=window.devicePixelRatio||1,c=a.parentElement.getBoundingClientRect().width||600,h=200;a.width=c*r,a.height=h*r,a.style.width=c+"px",a.style.height=h+"px",l.scale(r,r);const m=new Date(o||Date.now()-30*864e5),x=new Date(n||Date.now()),w=[],y=new Date(m);for(;y<=x;)w.push(y.toISOString().substring(0,10)),y.setDate(y.getDate()+1);if(w.length===0)return;const T=w.map($=>t[$]||0),q=w.map($=>i[$]||0),P=Math.max(...T,...q,1),k={top:20,right:16,bottom:32,left:40},u=c-k.left-k.right,b=h-k.top-k.bottom,L=document.documentElement.getAttribute("data-theme")==="dark",p=L?"rgba(255,255,255,0.1)":"#e2e8f0",_="#94a3b8",S=L?"rgba(147, 197, 253, 1)":"rgba(26, 47, 91, 1)",g=L?"rgba(74, 222, 128, 1)":"rgba(34, 197, 94, 1)",f=L?"#cbd5e1":void 0;l.clearRect(0,0,c,h),l.strokeStyle=p,l.lineWidth=.5;for(let $=0;$<=4;$++){const A=k.top+b/4*$;l.beginPath(),l.moveTo(k.left,A),l.lineTo(c-k.right,A),l.stroke()}l.fillStyle=_,l.font="10px Inter, sans-serif",l.textAlign="right";for(let $=0;$<=4;$++){const A=Math.round(P*(4-$)/4),s=k.top+b/4*$+3;l.fillText(A.toString(),k.left-6,s)}l.textAlign="center";const H=Math.max(1,Math.floor(w.length/6));for(let $=0;$<w.length;$+=H){const A=k.left+u/(w.length-1||1)*$,s=w[$].split("-");l.fillText(`${s[1]}/${s[2]}`,A,h-8)}function C($,A){if(!($.length<2)){l.strokeStyle=A,l.lineWidth=2,l.lineJoin="round",l.beginPath();for(let s=0;s<$.length;s++){const E=k.left+u/($.length-1||1)*s,M=k.top+b-$[s]/P*b;s===0?l.moveTo(E,M):l.lineTo(E,M)}l.stroke(),l.lineTo(k.left+u,k.top+b),l.lineTo(k.left,k.top+b),l.closePath(),l.fillStyle=A.replace("1)",L?"0.15)":"0.08)"),l.fill()}}C(T,S),C(q,g),l.font="11px Inter, sans-serif",l.fillStyle=S,l.fillRect(k.left,4,12,3),l.fillStyle=f||S,l.fillText("Views",k.left+40,10),l.fillStyle=g,l.fillRect(k.left+80,4,12,3),l.fillStyle=f||g,l.fillText("Clicks",k.left+120,10)}function Ct(e,t,i){var a,l;if(!t||!i){e.innerHTML='<div class="analytics-tab"><p>Please select a collection first.</p></div>';return}const o=qt();e.innerHTML=`
    <div class="analytics-tab">
      <h3>Analytics</h3>
      <p class="tab-description">Page views and link clicks for this collection.</p>

      <!-- Date Range Filter -->
      <div class="analytics-date-row">
        <input type="date" id="analytics-date-from" class="form-input" value="${o.from}">
        <span class="analytics-date-sep">to</span>
        <input type="date" id="analytics-date-to" class="form-input" value="${o.to}">
        <button id="analytics-refresh" class="btn-primary btn-sm"><i class="fas fa-sync-alt"></i> Apply</button>
      </div>

      <!-- Stats Grid -->
      <div class="analytics-stats-grid">
        <div class="stat-card">
          <div class="stat-number" id="stat-total-views">—</div>
          <div class="stat-label">Total Views</div>
        </div>
        <div class="stat-card">
          <div class="stat-number" id="stat-link-clicks">—</div>
          <div class="stat-label">Link Clicks</div>
        </div>
        <div class="stat-card">
          <div class="stat-number" id="stat-social-clicks">—</div>
          <div class="stat-label">Social Clicks</div>
        </div>
        <div class="stat-card">
          <div class="stat-number" id="stat-unique-visitors">—</div>
          <div class="stat-label">Unique Visitors</div>
        </div>
      </div>

      <!-- Views & Clicks Chart -->
      <div class="analytics-section">
        <div class="section-header" id="chart-toggle">
          <h4>Views & Clicks Over Time</h4>
          <svg class="section-chevron" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
        </div>
        <div class="section-content" id="chart-content">
          <canvas id="analytics-chart" style="width:100%; height:200px;"></canvas>
        </div>
      </div>

      <!-- Clicks by Link -->
      <div class="analytics-section">
        <div class="section-header" id="links-breakdown-toggle">
          <h4>Clicks by Link</h4>
          <svg class="section-chevron" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
        </div>
        <div class="section-content" id="links-breakdown-content">
          <div id="links-breakdown-list">
            <p class="analytics-empty">Loading...</p>
          </div>
        </div>
      </div>

      <!-- Social Media Clicks -->
      <div class="analytics-section">
        <div class="section-header" id="social-breakdown-toggle">
          <h4>Social Media Clicks</h4>
          <svg class="section-chevron" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
        </div>
        <div class="section-content" id="social-breakdown-content">
          <div id="social-breakdown-list">
            <p class="analytics-empty">Loading...</p>
          </div>
        </div>
      </div>
    </div>
  `;const n=async()=>{var h,m;const r=((h=e.querySelector("#analytics-date-from"))==null?void 0:h.value)||"",d=((m=e.querySelector("#analytics-date-to"))==null?void 0:m.value)||"",c=e.querySelector("#analytics-refresh");c&&(c.disabled=!0,c.innerHTML='<i class="fas fa-spinner fa-spin"></i> Loading...');try{const x=await $t(i.id,t.id,r,d);Tt(e,x),Bt(e,x.dailyViews,x.dailyClicks,r,d),It(e,x.linkBreakdown),St(e,x.socialBreakdown)}catch(x){console.error("[Analytics] Failed to load:",x)}c&&(c.disabled=!1,c.innerHTML='<i class="fas fa-sync-alt"></i> Apply')};(a=e.querySelector("#analytics-refresh"))==null||a.addEventListener("click",n);for(const[r,d]of[["chart-toggle","chart-content"],["links-breakdown-toggle","links-breakdown-content"],["social-breakdown-toggle","social-breakdown-content"]])(l=e.querySelector(`#${r}`))==null||l.addEventListener("click",()=>{const c=e.querySelector(`#${d}`),h=e.querySelector(`#${r} .section-chevron`);if(c){const m=c.style.display!=="none";c.style.display=m?"none":"block",h&&h.classList.toggle("collapsed",m)}});n()}let N=null,v=null,F=null,R=[],G=null,de="details",Y=[],ie=null,te=null,J=null,he=null;const je='<svg class="section-chevron" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>',Ve='<svg class="section-chevron collapsed" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>',Rt={backgroundType:"solid",backgroundColor:"#ffffff",gradientText:"",backgroundImage:"",backgroundImageX:50,backgroundImageY:50,backgroundImageScale:100,profileTextColor:"#1A2F5B",presentationTextColor:"#1A2F5B",buttonTextColor:"#000000",buttonBackgroundColor:"#1A2F5B",buttonStyle:"soft",buttonBorderRadius:"8px",buttonPadding:"12px 24px",buttonFontSize:"16px",buttonFontWeight:"500",textFontSize:"18px",textFontWeight:"600",borderEnabled:!0,borderType:"gradient",borderStyle:"thin",borderColor:"#1A2F5B",borderWidth:"1px",borderGradient:"linear-gradient(186deg, #D54070 0%, #8F4469 20%, #CA5699 40%, #59B8DA 60%, #9AD0DD 80%, #73B44A 100%)"};function We(e){const t=document.getElementById(e);if(!t)return;const i=t.textContent;t.textContent="✓ Saved",setTimeout(()=>{t.textContent=i},1500)}function Te(e=50,t=50,i=100){return`translate(${(e-50)*.6}%, ${(t-50)*.6}%) scale(${i/100})`}function Xe(e){e.querySelectorAll(".section-header").forEach(t=>{t.addEventListener("click",()=>{const i=t.dataset.section,o=document.getElementById(i),n=t.querySelector(".section-chevron");o&&n&&(o.classList.toggle("collapsed"),n.classList.toggle("collapsed"))})})}async function At(){var t;if(N=await et(),!N)return;const e=tt("id");if(!e){Pe();return}if(Mt(),await Promise.all([Pt(e),Ft()]),!v){Q("Collection not found","error"),Pe();return}await Ht(),Z(),ct(B,N.id).then(i=>{Y=i}),X(),z(),ni(),ai(),ie=le(async()=>{try{we();const{error:i}=await B.from("link_lists").update({presentation_data:v.presentation_data}).eq("id",v.id);if(i)throw i;return Z(),!0}catch(i){return console.error("Auto-save presentation failed:",i),!1}},{statusSelector:"#presentation-save-status"}),te=le(async()=>{var i,o,n;try{const a=((i=document.getElementById("collection-visibility"))==null?void 0:i.value)||"public",l=(o=document.getElementById("collection-passkey"))==null?void 0:o.value.trim(),r=((n=document.getElementById("collection-slug"))==null?void 0:n.value.trim().toLowerCase().replace(/[^a-z0-9-]/g,""))||v.slug,d={visibility:a,slug:r};a==="passkey"&&l?d.passkey_hash=l:a!=="passkey"&&(d.passkey_hash=null);const{error:c}=await B.from("link_lists").update(d).eq("id",v.id);if(c)throw c;return v.visibility=a,v.slug=r,d.passkey_hash!==void 0&&(v.passkey_hash=d.passkey_hash),Z(),!0}catch(a){return console.error("Auto-save settings failed:",a),!1}},{statusSelector:"#settings-save-status"}),J=le(async()=>{var o,n,a,l,r,d,c,h;const i=G;if(!i)return!1;try{const m=R.find(S=>S.id===i);if(!m)return!1;const x=(o=document.getElementById("link-title"))==null?void 0:o.value.trim(),w=(n=document.getElementById("link-url"))==null?void 0:n.value.trim(),y=(a=document.getElementById("link-image"))==null?void 0:a.value.trim(),T=!!m.source_link_id,q=ce(m),P=T?!m.use_library_defaults:q,k=T&&m.use_library_defaults,u=k?((l=m.image_position)==null?void 0:l.x)??50:parseInt((r=document.getElementById("link-img-pos-x"))==null?void 0:r.value)||50,b=k?((d=m.image_position)==null?void 0:d.y)??50:parseInt((c=document.getElementById("link-img-pos-y"))==null?void 0:c.value)||50,L=k?m.image_scale??100:parseInt((h=document.getElementById("link-img-scale"))==null?void 0:h.value)||100,p={url:w,use_library_defaults:!!m.use_library_defaults};m.tags&&m.tags.length>0&&(p.tags=m.tags),P&&!T?p.custom_overrides={title:x,image_url:y||null,image_position:{x:u,y:b},image_scale:L}:k||(p.title=x,p.image_url=y||null,p.image_position={x:u,y:b},p.image_scale=L,p.custom_overrides=null);const{error:_}=await B.from("link_items").update({...p,updated_at:new Date().toISOString()}).eq("id",i);if(_)throw _;return Object.assign(m,p),V(),z(),!0}catch(m){return console.error("Auto-save link failed:",m),!1}},{statusSelector:"#link-save-status"}),he=le(async()=>{try{const i=Re(),o={...v.theme,...i},{error:n}=await B.from("link_lists").update({theme:o}).eq("id",v.id);if(n)throw n;return v.theme=o,z(),!0}catch(i){return console.error("Auto-save theme failed:",i),!1}},{statusSelector:"#theme-save-status"}),se(ie),se(te),se(J),se(he),window.addEventListener("beforeunload",()=>{nt()}),sessionStorage.setItem("academiqr-last-collection",JSON.stringify({id:v.id,title:((t=v.presentation_data)==null?void 0:t.title)||"Untitled Collection"}))}function Mt(){var i;const e=document.getElementById("main-nav");if(!e)return;e.innerHTML=`
    <div class="nav-inner">
      <a href="/src/pages/dashboard.html" class="nav-brand">
            <img src="https://natzpfyxpuycsuuzbqrd.supabase.co/storage/v1/object/public/assets/AcademiQR_logo_blue.png" alt="AcademiQR" class="nav-logo-icon" width="40" height="40" data-light="https://natzpfyxpuycsuuzbqrd.supabase.co/storage/v1/object/public/assets/AcademiQR_logo_blue.png" data-dark="https://natzpfyxpuycsuuzbqrd.supabase.co/storage/v1/object/public/assets/AcademiQR_logo_white_.png">
            <img src="https://natzpfyxpuycsuuzbqrd.supabase.co/storage/v1/object/public/assets/AcademiQR_wordmark_blue_logo_.png" alt="" class="nav-logo-wordmark" width="200" height="40" data-light="https://natzpfyxpuycsuuzbqrd.supabase.co/storage/v1/object/public/assets/AcademiQR_wordmark_blue_logo_.png" data-dark="https://natzpfyxpuycsuuzbqrd.supabase.co/storage/v1/object/public/assets/AcademiQR_wordmark_white_logo_.png">
          </a>
      <div class="nav-links">
        <a href="/src/pages/dashboard.html" class="nav-link"><i class="fas fa-th-large"></i> My Collections</a>
        <a href="/src/pages/library.html" class="nav-link"><i class="fas fa-link"></i> Link Library</a>
        <a href="/src/pages/profile.html" class="nav-link"><i class="fas fa-user-circle"></i> Profile</a>
        <div class="nav-user">
          <button id="theme-toggle-btn" class="btn-ghost" title="Toggle dark mode"><i class="fas fa-circle-half-stroke"></i></button>
          <button id="sign-out-btn" class="btn-ghost"><i class="fas fa-sign-out-alt"></i> Sign Out</button>
        </div>
      </div>
    </div>
  `,(i=document.getElementById("sign-out-btn"))==null||i.addEventListener("click",async()=>{await it(),ot("login")}),lt();const t=document.getElementById("theme-toggle-btn");t&&(t.querySelector("i").className=(st()==="dark","fas fa-circle-half-stroke"),t.addEventListener("click",()=>{const o=rt();t.querySelector("i").className="fas fa-circle-half-stroke"}))}async function Pt(e){try{const{data:t,error:i}=await B.from("link_lists").select("*").eq("id",e).eq("owner_id",N.id).single();if(i)throw i;v=t}catch(t){console.error("Failed to load collection:",t),v=null}}async function Ht(){if(v)try{const{data:e,error:t}=await B.from("link_items").select("*, source_link_id, use_library_defaults").eq("list_id",v.id).order("order_index",{ascending:!0});if(t)throw t;R=e||[],R.sort((i,o)=>{const n=i.order_index??1/0,a=o.order_index??1/0;return n!==a?n-a:new Date(i.created_at||0)-new Date(o.created_at||0)}),await at(R)}catch(e){console.error("Failed to load links:",e),R=[]}}async function Ft(){try{const{data:e,error:t}=await B.from("profiles").select("display_name, username, profile_photo, profile_photo_position, social_email, social_instagram, social_facebook, social_twitter, social_linkedin, social_youtube, social_tiktok, social_snapchat").eq("id",N.id).single();if(t)throw t;F=e}catch(e){console.error("Failed to load profile:",e),F={}}}function Z(){const e=v.presentation_data||{},t=e.title||"Untitled Collection";document.getElementById("collection-title").textContent=t;const i=document.getElementById("collection-meta");if(i){const o=e.conference||"";i.innerHTML=`
      ${o?`<span class="meta-item"><i class="fas fa-building"></i> ${I(o)}</span>`:""}
      <span class="meta-item"><i class="fas fa-list"></i> ${R.length} link${R.length!==1?"s":""}</span>
    `}V()}function V(){const e=document.getElementById("links-list");if(e){if(R.length===0){e.innerHTML=`
      <div class="empty-links">
        <i class="fas fa-link"></i>
        <p>No links yet. Add your first link!</p>
      </div>
    `;return}e.innerHTML=R.map((t,i)=>{const o=t.id===G,n=t.is_active!==!1;return`
      <div class="link-item ${o?"selected":""} ${n?"":"inactive"}"
           data-link-id="${t.id}" data-index="${i}">
        <div class="link-drag-handle" title="Drag to reorder">
          <i class="fas fa-grip-vertical"></i>
        </div>
        ${ve(t)?`
          <div class="link-thumb">
            <img src="${I(ve(t))}" alt="" loading="lazy"
                 onerror="this.parentElement.innerHTML='<i class=\\'fas fa-image\\'></i>'">
          </div>
        `:`
          <div class="link-thumb link-thumb-empty">
            <i class="fas fa-link"></i>
          </div>
        `}
        <div class="link-info">
          <div class="link-title">${I($e(t)||"Untitled Link")}${t.use_library_defaults&&t.source_link_id?' <i class="fas fa-link" style="font-size:0.6rem; opacity:0.5;" title="Using library version"></i>':""}</div>
          <div class="link-url">${I(Je(t.url||""))}</div>
        </div>
        <div class="link-actions">
          <button class="btn-icon link-toggle" data-link-id="${t.id}" title="${n?"Active":"Inactive"}">
            <i class="fas ${n?"fa-toggle-on":"fa-toggle-off"}"></i>
          </button>
        </div>
      </div>
    `}).join(""),e.querySelectorAll(".link-item").forEach(t=>{t.addEventListener("click",i=>{i.target.closest(".link-toggle")||i.target.closest(".link-drag-handle")||(G=t.dataset.linkId,V(),X(),Dt())})}),e.querySelectorAll(".link-toggle").forEach(t=>{t.addEventListener("click",i=>{i.stopPropagation(),Jt(t.dataset.linkId)})}),ii()}}function Dt(){setTimeout(()=>{const e=document.getElementById("link-editor-section");e&&(e.style.display="block",e.scrollIntoView({behavior:"smooth",block:"start"}))},50)}function X(){const e=document.getElementById("tab-content");if(e)switch(de){case"details":Ut(e);break;case"appearance":ue(e);break;case"qr-code":jt(e);break;case"analytics":Vt(e);break}}function Ut(e){var c,h,m,x,w,y,T,q,P,k;const t=v.presentation_data||{},i=je,o=v.visibility||"public",n=!!v.passkey_hash;let a=`
    <!-- ═══ PRESENTATION INFORMATION ═══ -->
    <div class="section">
      <div class="section-header" data-section="presentation-section">
        <h3>Presentation Information <span id="presentation-save-status" class="auto-save-status"></span></h3>
        ${i}
      </div>
      <div class="section-content" id="presentation-section">
        <div class="form-group">
          <label for="info-title">Title</label>
          <input type="text" id="info-title" value="${I(t.title||"")}" placeholder="Presentation title" maxlength="200">
        </div>
        <div class="form-group">
          <label for="info-conference">Conference / Event</label>
          <input type="text" id="info-conference" value="${I(t.conference||"")}" placeholder="Conference name" maxlength="200">
        </div>
        <div class="form-group">
          <label for="info-location">Location</label>
          <input type="text" id="info-location" value="${I(t.location||"")}" placeholder="City, State / Country" maxlength="200">
        </div>
        <div class="form-group">
          <label for="info-date">Date</label>
          <input type="date" id="info-date" value="${t.date||""}">
        </div>
        <div class="form-group" style="display:flex; gap:24px;">
          <label class="checkbox-label">
            <input type="checkbox" id="display-title" ${t.displayTitle!==!1?"checked":""}>
            <span>Show title</span>
          </label>
          <label class="checkbox-label">
            <input type="checkbox" id="display-conference" ${t.displayConference!==!1?"checked":""}>
            <span>Show conference</span>
          </label>
        </div>
      </div>
    </div>

    <!-- ═══ TAGS ═══ -->
    <div class="section">
      <div class="section-header" data-section="tags-section">
        <h3>Tags</h3>
        ${i}
      </div>
      <div class="section-content" id="tags-section">
        <div class="form-group">
          <div class="editor-tags-container">
            ${ee(t.tags||[],{removable:!0})}
          </div>
          <div id="editor-tag-input-container"></div>
        </div>
      </div>
    </div>

    <!-- ═══ COLLECTION SETTINGS ═══ -->
    <div class="section">
      <div class="section-header" data-section="settings-section">
        <h3>Collection Settings <span id="settings-save-status" class="auto-save-status"></span></h3>
        ${Ve}
      </div>
      <div class="section-content collapsed" id="settings-section">
        <div class="form-group">
          <label for="collection-slug">Collection URL Slug</label>
          <div class="slug-input-row">
            <span class="slug-prefix">${F!=null&&F.username?`academiqr.com/u/${I(F.username)}/`:"slug: "}</span>
            <input type="text" id="collection-slug" value="${I(v.slug||"")}" placeholder="my-collection" maxlength="60">
          </div>
          <p id="slug-status" style="font-size:0.75rem; margin-top:4px; min-height:1.2em; color:#9ca3af;"></p>
        </div>
        <div class="form-group">
          <label>Public Link</label>
          <div style="display:flex; align-items:center; gap:8px; background:#f8fafc; padding:10px 14px; border-radius:8px; border:1px solid #e2e8f0;">
            <i class="fas fa-link" style="color:#9ca3af; font-size:0.75rem;"></i>
            <span id="public-link-preview" style="color:#64748b; font-size:0.8rem; word-break:break-all;">${F!=null&&F.username&&v.slug?`academiqr.com/u/${I(F.username)}/${I(v.slug)}`:`academiqr.com/public.html?collection=${v.id.substring(0,8)}...`}</span>
            <button type="button" class="btn-ghost btn-sm" id="copy-link-btn" title="Copy link" style="margin-left:auto;"><i class="fas fa-copy"></i></button>
          </div>
        </div>
        <div class="form-group">
          <label for="collection-visibility">Visibility</label>
          <select id="collection-visibility" class="form-select">
            <option value="public" ${o==="public"?"selected":""}>Public — Anyone with the link</option>
            <option value="private" ${o==="private"?"selected":""}>Private — Only you</option>
            <option value="passkey" ${n?"selected":""}>Passkey — Requires a code</option>
          </select>
        </div>
        <div class="form-group" id="passkey-group" style="display:${n||o==="passkey"?"block":"none"}">
          <label for="collection-passkey">Passkey</label>
          <input type="text" id="collection-passkey" value="" placeholder="${n?"(unchanged — enter new to update)":"Enter passkey"}">
        </div>
      </div>
    </div>
  `;if(G){const u=R.find(b=>b.id===G);if(u){const b=!!u.source_link_id,L=ce(u),p=b?!u.use_library_defaults:L,_=b&&u.use_library_defaults,S=p&&L?u.custom_overrides.title??u.title??"":u.title||"",g=p&&L?u.custom_overrides.image_url??u.image_url??"":u.image_url||"",f=$e(u)||"",H=ve(u)||"",C=_?Ne(u):p&&L&&u.custom_overrides.image_position?u.custom_overrides.image_position:u.image_position||u.imagePosition||{x:50,y:50},$=_?Oe(u):p&&L&&u.custom_overrides.image_scale!=null?u.custom_overrides.image_scale:u.image_scale??u.imageScale??100,A=_?H:g;a+=`
    <!-- ═══ EDIT LINK ═══ -->
    <div class="section">
      <div class="section-header" data-section="link-editor-section">
        <h3>Edit Link <span id="link-save-status" class="auto-save-status"></span></h3>
        ${i}
      </div>
      <div class="section-content" id="link-editor-section">
        <div class="link-editor">
          <div class="link-editor-header" style="margin-bottom:12px;">
            <span style="font-size:0.875rem; color:#64748b;">Editing: <strong>${I(f||"Untitled")}</strong></span>
            <button class="btn-danger btn-sm" id="delete-link-btn" data-link-id="${u.id}">
              <i class="fas fa-trash"></i> Delete
            </button>
          </div>

          <!-- Library / Customize toggle (all links) -->
          <div class="link-source-toggle">
            <div class="source-toggle-options">
              <label class="source-toggle-option ${p?"":"active"}">
                <input type="radio" name="link-source-mode" value="library" ${p?"":"checked"}>
                <i class="fas fa-book"></i> Use Library Version
              </label>
              <label class="source-toggle-option ${p?"active":""}">
                <input type="radio" name="link-source-mode" value="custom" ${p?"checked":""}>
                <i class="fas fa-pen"></i> Customize for This Collection
              </label>
            </div>
            ${p?`
              <p class="source-toggle-hint"><i class="fas fa-info-circle"></i> This link has custom title/image for this collection only.</p>
            `:`
              <p class="source-toggle-hint"><i class="fas fa-info-circle"></i> ${b?"Title and image sync with the library version. Changes in the library will appear here automatically.":"Editing title or image here will also update in your Link Library."}</p>
            `}
          </div>

          <div class="form-group">
            <label for="link-title">Title</label>
            <input type="text" id="link-title" value="${I(_?f:S)}" placeholder="Link title" ${_?"disabled":""}>
          </div>

          <div class="form-group">
            <label for="link-url">URL</label>
            <input type="url" id="link-url" value="${I(u.url||"")}" placeholder="https://...">
          </div>

          <div class="form-group">
            <label for="link-image">Image URL</label>
            <div class="image-input-row">
              <input type="text" id="link-image" value="${I(A||"")}" placeholder="Image URL or upload" ${_?"disabled":""}>
              <button class="btn-secondary" id="upload-image-btn" ${_?"disabled":""}><i class="fas fa-upload"></i> Upload</button>
              <button class="btn-secondary" id="browse-media-btn" ${_?"disabled":""}><i class="fas fa-images"></i> Browse</button>
              <input type="file" id="link-image-file" accept="image/*" style="display:none;">
            </div>
            ${A?`
              <div class="image-preview" style="margin-top:12px;">
                <img src="${I(A)}" alt="Preview"
                     style="transform: ${Te(C.x,C.y,$)};"
                     onerror="this.style.display='none'">
              </div>
              ${_?"":`
              <div class="form-group" style="margin-top:8px;">
                <label>Image Position X</label>
                <input type="range" id="link-img-pos-x" min="0" max="100" value="${C.x??50}" class="range-input">
              </div>
              <div class="form-group">
                <label>Image Position Y</label>
                <input type="range" id="link-img-pos-y" min="0" max="100" value="${C.y??50}" class="range-input">
              </div>
              <div class="form-group">
                <label>Image Scale</label>
                <input type="range" id="link-img-scale" min="50" max="200" value="${$}" class="range-input">
              </div>
              `}
            `:""}
          </div>

          <div class="form-group">
            <label>Tags</label>
            <div id="link-tags-display" style="display:flex; flex-wrap:wrap; gap:4px; margin-bottom:6px;">
              ${ee(u.tags||[],{removable:!0})}
            </div>
            <div id="link-tag-input-container"></div>
          </div>

          ${p?`
          <div class="form-actions">
              <button class="btn-secondary" id="save-as-library-btn" title="Create a new library link with this custom title/image">
                <i class="fas fa-plus"></i> Save as New Library Link
              </button>
          </div>
          `:""}
        </div>
      </div>
    </div>
      `}}else a+=`
    <div style="text-align:center; padding:24px; color:#9ca3af;">
      <i class="fas fa-mouse-pointer" style="font-size:1.5rem; opacity:0.3; margin-bottom:8px; display:block;"></i>
      <p style="font-size:0.875rem;">Select a link in the sidebar to edit it</p>
    </div>
    `;e.innerHTML=a,["info-title","info-conference","info-location","info-date"].forEach(u=>{var b;(b=document.getElementById(u))==null||b.addEventListener("input",()=>{we(),z(),ie.trigger()})}),["display-title","display-conference"].forEach(u=>{var b;(b=document.getElementById(u))==null||b.addEventListener("change",()=>{we(),z(),ie.trigger()})});const l=e.querySelector(".editor-tags-container"),r=document.getElementById("editor-tag-input-container");if(r){const u=(v.presentation_data||{}).tags||[];He(r,Y,u,async b=>{const L=v.presentation_data||{};L.tags=Fe([...L.tags||[],b]),v.presentation_data=L,Y.includes(b)||(Y.push(b),Y.sort(),De()),ie.trigger(),l&&(l.innerHTML=ee(L.tags,{removable:!0})),qe(l)})}qe(l),(c=document.getElementById("copy-link-btn"))==null||c.addEventListener("click",zt);const d=v.slug||"";if((h=document.getElementById("collection-slug"))==null||h.addEventListener("input",u=>{const b=u.target.value.toLowerCase().replace(/[^a-z0-9-]/g,"");u.target.value=b;const L=document.getElementById("public-link-preview"),p=document.getElementById("slug-status");L&&(F!=null&&F.username)&&b?L.textContent=`academiqr.com/u/${F.username}/${b}`:L&&b&&(L.textContent=`academiqr.com/public.html?collection=${v.id.substring(0,8)}...`),p&&d&&b!==d?p.innerHTML='<span style="color:#dc2626;"><i class="fas fa-exclamation-triangle"></i> Changing this slug will break any QR codes or shared links that use the current short URL.</span>':p&&(p.textContent=""),d&&b!==d||te.trigger()}),(m=document.getElementById("collection-slug"))==null||m.addEventListener("blur",()=>{var b;const u=((b=document.getElementById("collection-slug"))==null?void 0:b.value.trim().toLowerCase().replace(/[^a-z0-9-]/g,""))||"";if(d&&u!==d&&u)if(confirm(`You are changing this collection's URL slug.

Any QR codes or shared links using the short URL format will stop working.
(Note: QR codes using the legacy ?collection= format will still work.)

Continue?`))te.trigger();else{document.getElementById("collection-slug").value=d;const p=document.getElementById("public-link-preview");p&&(F!=null&&F.username)&&d&&(p.textContent=`academiqr.com/u/${F.username}/${d}`);const _=document.getElementById("slug-status");_&&(_.textContent="")}}),(x=document.getElementById("collection-visibility"))==null||x.addEventListener("change",u=>{const b=document.getElementById("passkey-group");b&&(b.style.display=u.target.value==="passkey"?"block":"none"),te.trigger()}),(w=document.getElementById("collection-passkey"))==null||w.addEventListener("input",()=>{te.trigger()}),G){const u=G;(y=document.getElementById("delete-link-btn"))==null||y.addEventListener("click",()=>Yt(u)),["link-title","link-url","link-image"].forEach(p=>{var _;(_=document.getElementById(p))==null||_.addEventListener("input",()=>{J.trigger()})});const b=document.getElementById("link-tags-display"),L=document.getElementById("link-tag-input-container");if(L){const p=R.find(_=>_.id===u);if(p){const _=p.tags||[];He(L,Y,_,async S=>{p.tags=Fe([...p.tags||[],S]),b&&(b.innerHTML=ee(p.tags,{removable:!0}),Le(b,p)),Y.includes(S)||(Y.push(S),Y.sort(),De()),J.trigger()}),Le(b,p)}}document.querySelectorAll('input[name="link-source-mode"]').forEach(p=>{p.addEventListener("change",_=>{const S=R.find(f=>f.id===u);if(!S)return;const g=_.target.value==="library";S.source_link_id?S.use_library_defaults=g:g?S.custom_overrides=null:S.custom_overrides={title:S.title||"",image_url:S.image_url||null,image_position:S.image_position||{x:50,y:50},image_scale:S.image_scale??100},X(),V(),z()})}),(T=document.getElementById("save-as-library-btn"))==null||T.addEventListener("click",()=>Xt(u)),(q=document.getElementById("upload-image-btn"))==null||q.addEventListener("click",()=>{var p;(p=document.getElementById("link-image-file"))==null||p.click()}),(P=document.getElementById("link-image-file"))==null||P.addEventListener("change",Qt),(k=document.getElementById("browse-media-btn"))==null||k.addEventListener("click",()=>{Ce(p=>{const _=document.getElementById("link-image");_&&(_.value=p);const S=R.find(g=>g.id===u);S&&(ce(S)?S.custom_overrides.image_url=p:S.image_url=p,z(),V(),X(),J.trigger())})}),["link-img-pos-x","link-img-pos-y","link-img-scale"].forEach(p=>{var _;(_=document.getElementById(p))==null||_.addEventListener("input",()=>{Nt(),J.trigger()})})}Xe(e)}function we(){var t,i,o,n,a,l;const e=v.presentation_data||{};e.title=((t=document.getElementById("info-title"))==null?void 0:t.value)||"",e.conference=((i=document.getElementById("info-conference"))==null?void 0:i.value)||"",e.location=((o=document.getElementById("info-location"))==null?void 0:o.value)||"",e.date=((n=document.getElementById("info-date"))==null?void 0:n.value)||"",e.displayTitle=((a=document.getElementById("display-title"))==null?void 0:a.checked)??!0,e.displayConference=((l=document.getElementById("display-conference"))==null?void 0:l.checked)??!0,v.presentation_data=e}function zt(){const e=Qe(N.id,v.id,{username:F==null?void 0:F.username,slug:v.slug});navigator.clipboard.writeText(e).then(()=>{const t=document.getElementById("copy-link-btn");t&&(t.innerHTML='<i class="fas fa-check"></i>',setTimeout(()=>{t.innerHTML='<i class="fas fa-copy"></i>'},1500))}).catch(()=>{prompt("Copy this link:",e)})}async function Qt(e){var n;const t=(n=e.target.files)==null?void 0:n[0];if(!t)return;const i=document.getElementById("upload-image-btn"),o=i==null?void 0:i.innerHTML;try{i&&(i.disabled=!0,i.innerHTML='<i class="fas fa-spinner fa-spin"></i> Uploading...');const a=await Ie(t,"links",N.id,{maxWidth:800,maxHeight:800}),l=document.getElementById("link-image");l&&(l.value=a);const r=R.find(d=>d.id===G);r&&(ce(r)?r.custom_overrides.image_url=a:r.image_url=a,z(),V(),J.trigger())}catch(a){console.error("Image upload failed:",a),Q("Image upload failed: "+a.message,"error")}finally{i&&(i.disabled=!1,i.innerHTML=o)}}function Nt(){var a,l,r;const e=R.find(d=>d.id===G);if(!e)return;const t=parseInt((a=document.getElementById("link-img-pos-x"))==null?void 0:a.value)||50,i=parseInt((l=document.getElementById("link-img-pos-y"))==null?void 0:l.value)||50,o=parseInt((r=document.getElementById("link-img-scale"))==null?void 0:r.value)||100;ce(e)?(e.custom_overrides.image_position={x:t,y:i},e.custom_overrides.image_scale=o):(e.image_position={x:t,y:i},e.image_scale=o);const n=document.querySelector(".image-preview img");n&&(n.style.transform=Te(t,i,o)),z()}function Be(e){if(!e||typeof e=="object"&&Object.keys(e).length===0)return{...Rt};if(typeof e=="string")try{e=JSON.parse(e)}catch{return Be(null)}const t=e.borderEnabled!==void 0?!!e.borderEnabled:e.gradientBorderEnabled!==void 0?!!e.gradientBorderEnabled:!0,i=[e.textColor,e.presentationTextColor,e.profileTextColor,e.presentationColor,e.profileColor].find(n=>typeof n=="string"&&n.length>0)||"#1A2F5B";return{backgroundType:e.backgroundType||"solid",backgroundColor:e.backgroundColor||"#ffffff",gradientText:e.gradientText||"",backgroundImage:e.backgroundImage||"",backgroundImageX:e.backgroundImageX??e.imagePositionX??50,backgroundImageY:e.backgroundImageY??e.imagePositionY??50,backgroundImageScale:e.backgroundImageScale??e.imageScale??100,profileTextColor:i,presentationTextColor:i,buttonTextColor:e.buttonTextColor||"#000000",buttonBackgroundColor:e.buttonBackgroundColor||e.buttonBgColor||"#1A2F5B",buttonStyle:e.buttonStyle||"soft",buttonBorderRadius:e.buttonBorderRadius||e.borderRadius||"8px",buttonPadding:e.buttonPadding||"12px 24px",buttonFontSize:e.buttonFontSize||"16px",buttonFontWeight:e.buttonFontWeight||"500",textFontSize:e.textFontSize||"18px",textFontWeight:e.textFontWeight||"600",borderEnabled:t,borderType:e.borderType||"solid",borderStyle:e.borderStyle==="fill"||e.borderStyle==="thin"?e.borderStyle:"fill",borderColor:e.borderColor||"#1A2F5B",borderWidth:e.borderWidth||"1px",borderGradient:e.borderGradient||e.borderGradientText||"",borderGradientAngle:e.borderGradientAngle||""}}const Ot=["#ffffff","#e5e7eb","#9ca3af","#1f2937","#000000","#1A2F5B"],ze=["linear-gradient(45deg, #ff6b6b, #4ecdc4)","linear-gradient(135deg, #1A2F5B, #3B5B8F)","linear-gradient(43deg, #D54070 0%, #8F4469 20%, #CA5699 40%, #59B8DA 60%, #9AD0DD 80%, #73B44A 100%)"];function ne(e){return`<div class="color-presets">${Ot.map(t=>`<button type="button" class="color-preset ${t===e?"active":""}" data-color="${t}" style="background:${t};${t==="#ffffff"?"border:1px solid #e5e7eb;":""}" title="${t}"></button>`).join("")}</div>`}function ue(e){var q,P,k,u,b,L,p,_,S;const t=Be(v.theme),i=t.backgroundType,o=t.backgroundColor,n=t.gradientText||"linear-gradient(45deg, #ff6b6b 0%, #4ecdc4 100%)";t.profileTextColor;const a=t.presentationTextColor,l=t.buttonTextColor,r=t.buttonBackgroundColor,d=t.buttonStyle,c=t.borderEnabled,h=t.borderType,m=t.borderStyle,x=t.borderColor;t.borderWidth,t.buttonBorderRadius;const w=t.borderGradient,y=je;e.innerHTML=`
    <div class="appearance-editor">
      <!-- ═══ BACKGROUND ═══ -->
      <div class="section">
        <div class="section-header" data-section="background-section">
          <h3>Background <span id="theme-save-status" class="auto-save-status"></span></h3>
          ${y}
        </div>
        <div class="section-content" id="background-section">
          <div class="form-group">
            <div class="radio-group">
              <label class="radio-label"><input type="radio" name="bg-type" value="solid" ${i==="solid"?"checked":""}> Solid Color</label>
              <label class="radio-label"><input type="radio" name="bg-type" value="gradient" ${i==="gradient"?"checked":""}> Gradient</label>
              <label class="radio-label"><input type="radio" name="bg-type" value="image" ${i==="image"?"checked":""}> Image</label>
            </div>
          </div>

          <!-- Solid Color -->
          <div id="bg-solid-group" style="display:${i==="solid"?"block":"none"}">
            <div class="form-group">
              <div class="color-input-row">
                <input type="color" id="theme-bg-color" value="${o}">
                <input type="text" id="theme-bg-color-text" value="${o}" class="color-text">
              </div>
              ${ne(o)}
            </div>
          </div>

          <!-- Gradient -->
          <div id="bg-gradient-group" style="display:${i==="gradient"?"block":"none"}">
            <div class="form-group">
              <label>Gradient CSS</label>
              <textarea id="theme-gradient" class="gradient-textarea" rows="2" placeholder="linear-gradient(...)">${I(n)}</textarea>
              <div class="gradient-preview" id="gradient-preview" style="background: ${n};"></div>
            </div>
            <div class="form-group">
              <label>Presets</label>
              <div class="gradient-presets">
                ${ze.map((g,f)=>`
                  <button type="button" class="gradient-preset" data-gradient="${I(g)}" style="background: ${g};" title="Preset ${f+1}"></button>
                `).join("")}
              </div>
            </div>
          </div>

          <!-- Image -->
          <div id="bg-image-group" style="display:${i==="image"?"block":"none"}">
            <div class="form-group">
              <label>Background Image</label>
              <div class="image-upload-row">
                <button type="button" class="btn-save-compact" id="bg-upload-btn"><i class="fas fa-folder-open"></i> Choose File</button>
                <button type="button" class="btn-save-compact" id="bg-browse-media-btn"><i class="fas fa-images"></i> Browse Library</button>
                <input type="file" id="bg-image-file" accept="image/*" style="display:none">
              </div>
              ${t.backgroundImage&&t.backgroundType==="image"?`
                <div class="bg-image-preview" style="background-image: url('${t.backgroundImage}');"></div>
                <button type="button" class="btn-ghost btn-sm" id="bg-image-remove"><i class="fas fa-times"></i> Remove</button>
              `:""}
            </div>
            <div class="form-group">
              <label>Position X</label>
              <input type="range" id="bg-pos-x" min="0" max="100" value="${t.backgroundImageX}" class="range-input">
            </div>
            <div class="form-group">
              <label>Position Y</label>
              <input type="range" id="bg-pos-y" min="0" max="100" value="${t.backgroundImageY}" class="range-input">
            </div>
            <div class="form-group">
              <label>Scale</label>
              <input type="range" id="bg-pos-scale" min="50" max="200" value="${t.backgroundImageScale}" class="range-input">
            </div>
          </div>
        </div>
      </div>

      <!-- ═══ TEXT & BUTTONS ═══ -->
      <div class="section">
        <div class="section-header" data-section="text-buttons-section">
          <h3>Text & Buttons</h3>
          ${y}
        </div>
        <div class="section-content" id="text-buttons-section">
          <div class="form-group">
            <label>Profile and Presentation Information Text Color</label>
            <div class="color-input-row">
              <input type="color" id="theme-presentation-text" value="${a}">
              <input type="text" id="theme-presentation-text-val" value="${a}" class="color-text">
            </div>
            ${ne(a)}
          </div>
          <div class="form-group">
            <label>Button Text Color</label>
            <div class="color-input-row">
              <input type="color" id="theme-btn-text" value="${l}">
              <input type="text" id="theme-btn-text-val" value="${l}" class="color-text">
            </div>
            ${ne(l)}
          </div>
          <div class="form-group">
            <label>Button Style</label>
            <select id="theme-button-style" class="form-select">
              <option value="soft" ${d==="soft"?"selected":""}>Soft Glass</option>
              <option value="solid" ${d==="solid"?"selected":""}>Solid</option>
              <option value="outline" ${d==="outline"?"selected":""}>Outline</option>
            </select>
          </div>
          <div class="form-group" id="btn-bg-group" style="display:${d==="solid"?"block":"none"}">
            <label>Button Background Color</label>
            <div class="color-input-row">
              <input type="color" id="theme-btn-bg" value="${r}">
              <input type="text" id="theme-btn-bg-val" value="${r}" class="color-text">
            </div>
            ${ne(r)}
          </div>
        </div>
      </div>

      <!-- ═══ BORDER EFFECTS ═══ -->
      <div class="section">
        <div class="section-header" data-section="border-effects-section">
          <h3>Border Effects</h3>
          ${y}
        </div>
        <div class="section-content" id="border-effects-section">
          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" id="theme-border-enabled" ${c?"checked":""}>
              <span>Enable Custom Border</span>
            </label>
          </div>
          <div id="border-options" style="display:${c?"block":"none"}">
            <div class="form-group">
              <label>Border Type</label>
              <div class="radio-group">
                <label class="radio-label"><input type="radio" name="border-type" value="solid" ${h==="solid"?"checked":""}> Solid Color</label>
                <label class="radio-label"><input type="radio" name="border-type" value="gradient" ${h==="gradient"?"checked":""}> Gradient</label>
              </div>
            </div>
            <div class="form-group">
              <label>Border Style</label>
              <div class="radio-group">
                <label class="radio-label"><input type="radio" name="border-style" value="fill" ${m==="fill"?"checked":""}> Frame Fill</label>
                <label class="radio-label"><input type="radio" name="border-style" value="thin" ${m==="thin"?"checked":""}> Thin Border</label>
              </div>
            </div>

            <!-- Solid border color -->
            <div id="border-solid-group" style="display:${h==="solid"?"block":"none"}">
              <div class="form-group">
                <label>Border Color</label>
                <div class="color-input-row">
                  <input type="color" id="theme-border-color" value="${x}">
                  <input type="text" id="theme-border-color-val" value="${x}" class="color-text">
                </div>
                ${ne(x)}
              </div>
            </div>

            <!-- Gradient border -->
            <div id="border-gradient-group" style="display:${h==="gradient"?"block":"none"}">
              <div class="form-group">
                <label>Border Gradient CSS</label>
                <textarea id="theme-border-gradient" class="gradient-textarea" rows="2" placeholder="linear-gradient(...)">${I(w)}</textarea>
                <div class="gradient-preview" id="border-gradient-preview" style="background: ${w||"linear-gradient(45deg, #1A2F5B, #3B5B8F)"};"></div>
              </div>
              <div class="form-group">
                <label>Presets</label>
                <div class="gradient-presets">
                  ${ze.map((g,f)=>`
                    <button type="button" class="border-gradient-preset" data-gradient="${I(g)}" style="background: ${g};" title="Preset ${f+1}"></button>
                  `).join("")}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <!-- ═══ THEME MANAGEMENT ═══ -->
      <div class="section">
        <div class="section-header" data-section="theme-management-section">
          <h3>Theme Management</h3>
          ${Ve}
        </div>
        <div class="section-content collapsed" id="theme-management-section">
          <div class="form-group">
            <label>New Theme</label>
            <div style="display:flex; gap:8px;">
              <input type="text" id="theme-name" placeholder="Enter theme name" maxlength="100" style="flex:1;">
              <button type="button" class="btn-save-compact" id="save-new-theme-btn">Save Theme</button>
            </div>
          </div>
          <div class="form-group">
            <label>Saved Themes</label>
            <div id="saved-themes-list">
              <p style="color:#9ca3af; font-size:0.875rem;">Loading...</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  `,[["theme-bg-color","theme-bg-color-text"],["theme-presentation-text","theme-presentation-text-val"],["theme-btn-bg","theme-btn-bg-val"],["theme-btn-text","theme-btn-text-val"],["theme-border-color","theme-border-color-val"]].forEach(([g,f])=>{var H,C;(H=document.getElementById(g))==null||H.addEventListener("input",$=>{const A=document.getElementById(f);A&&(A.value=$.target.value),U()}),(C=document.getElementById(f))==null||C.addEventListener("input",$=>{const A=document.getElementById(g);A&&/^#[0-9a-fA-F]{6}$/.test($.target.value)&&(A.value=$.target.value),U()})}),e.addEventListener("click",g=>{const f=g.target.closest(".color-preset");if(!f)return;const H=f.dataset.color,C=f.closest(".form-group"),$=C==null?void 0:C.querySelector('input[type="color"]'),A=C==null?void 0:C.querySelector(".color-text");$&&($.value=H),A&&(A.value=H),C==null||C.querySelectorAll(".color-preset").forEach(s=>s.classList.remove("active")),f.classList.add("active"),U()}),e.querySelectorAll(".gradient-preset").forEach(g=>{g.addEventListener("click",()=>{const f=document.getElementById("theme-gradient"),H=document.getElementById("gradient-preview");f&&(f.value=g.dataset.gradient),H&&(H.style.background=g.dataset.gradient),U()})}),e.querySelectorAll(".border-gradient-preset").forEach(g=>{g.addEventListener("click",()=>{const f=document.getElementById("theme-border-gradient"),H=document.getElementById("border-gradient-preview");f&&(f.value=g.dataset.gradient),H&&(H.style.background=g.dataset.gradient),U()})}),e.querySelectorAll('input[name="bg-type"]').forEach(g=>{g.addEventListener("change",f=>{document.getElementById("bg-solid-group").style.display=f.target.value==="solid"?"block":"none",document.getElementById("bg-gradient-group").style.display=f.target.value==="gradient"?"block":"none",document.getElementById("bg-image-group").style.display=f.target.value==="image"?"block":"none",U()})}),(q=document.getElementById("theme-button-style"))==null||q.addEventListener("change",g=>{const f=document.getElementById("btn-bg-group");f&&(f.style.display=g.target.value==="solid"?"block":"none"),U()}),(P=document.getElementById("theme-border-enabled"))==null||P.addEventListener("change",g=>{const f=document.getElementById("border-options");f&&(f.style.display=g.target.checked?"block":"none"),U()}),e.querySelectorAll('input[name="border-type"]').forEach(g=>{g.addEventListener("change",f=>{document.getElementById("border-solid-group").style.display=f.target.value==="solid"?"block":"none",document.getElementById("border-gradient-group").style.display=f.target.value==="gradient"?"block":"none",U()})}),(k=document.getElementById("theme-gradient"))==null||k.addEventListener("input",g=>{const f=document.getElementById("gradient-preview");f&&(f.style.background=g.target.value),U()}),(u=document.getElementById("theme-border-gradient"))==null||u.addEventListener("input",g=>{const f=document.getElementById("border-gradient-preview");f&&(f.style.background=g.target.value),U()}),["bg-pos-x","bg-pos-y","bg-pos-scale"].forEach(g=>{var f;(f=document.getElementById(g))==null||f.addEventListener("input",U)}),(b=document.getElementById("bg-upload-btn"))==null||b.addEventListener("click",()=>{var g;(g=document.getElementById("bg-image-file"))==null||g.click()}),(L=document.getElementById("bg-image-file"))==null||L.addEventListener("change",Gt),(p=document.getElementById("bg-browse-media-btn"))==null||p.addEventListener("click",()=>{Ce(g=>{v._pendingBgImage=g,U(),ue(document.getElementById("tab-content"))})}),(_=document.getElementById("bg-image-remove"))==null||_.addEventListener("click",()=>{v._pendingBgImage=null,v.theme&&(v.theme.backgroundImage="");const g=document.querySelector('input[name="bg-type"][value="solid"]');g&&(g.checked=!0),U(),ue(document.getElementById("tab-content"))}),["theme-button-style"].forEach(g=>{var f;(f=document.getElementById(g))==null||f.addEventListener("change",U)}),e.querySelectorAll('input[name="border-style"]').forEach(g=>{g.addEventListener("change",U)}),Xe(e),(S=document.getElementById("save-new-theme-btn"))==null||S.addEventListener("click",oi),Ae()}async function Gt(e){var n;const t=(n=e.target.files)==null?void 0:n[0];if(!t)return;const i=document.getElementById("bg-upload-btn"),o=i==null?void 0:i.innerHTML;try{i&&(i.disabled=!0,i.innerHTML='<i class="fas fa-spinner fa-spin"></i> Uploading...');const a=await Ie(t,"backgrounds",N.id,{maxWidth:1920,maxHeight:1920});v._pendingBgImage=a,U(),ue(document.getElementById("tab-content"))}catch(a){console.error("Background image upload failed:",a),Q("Background image upload failed: "+a.message,"error")}finally{i&&(i.disabled=!1,i.innerHTML=o)}}function U(){const e=Re(),t={...v.theme,...e};v._pendingBgImage&&(t.backgroundImage=v._pendingBgImage),z(t),he&&he.trigger()}function jt(e){wt(e,v,N)}function Vt(e){Ct(e,v,N)}function z(e){const t=document.getElementById("phone-preview");if(!t)return;const i=Be(e||v.theme),o=v.presentation_data||{},n=F||{},a=i.backgroundType;let l="";if(a==="gradient"&&i.gradientText)l=`background: ${i.gradientText};`;else if(a==="image"&&i.backgroundImage){const M=i.backgroundImageX,j=i.backgroundImageY,xe=i.backgroundImageScale;l=`background: url('${i.backgroundImage}') ${M}% ${j}% / ${xe}% no-repeat;`}else l=`background: ${i.backgroundColor};`;const r=i.presentationTextColor,d=r,c=i.buttonStyle,h=i.buttonBackgroundColor,m=i.buttonTextColor;i.buttonBorderRadius;const x=i.borderEnabled,w=i.borderType,y=i.borderStyle,T=i.borderColor,q=i.borderGradient,P=n.profile_photo||"";let k={scale:100,x:50,y:50};if(n.profile_photo_position)try{k=typeof n.profile_photo_position=="string"?JSON.parse(n.profile_photo_position):n.profile_photo_position}catch{}const u=(k.scale||100)/100,b=((k.x||50)-50)*-1,L=((k.y||50)-50)*-1,p=[{key:"social_email",icon:"fa-envelope",prefix:"mailto:"},{key:"social_instagram",icon:"fa-instagram",prefix:""},{key:"social_facebook",icon:"fa-facebook",prefix:""},{key:"social_twitter",icon:"fa-x-twitter",prefix:""},{key:"social_linkedin",icon:"fa-linkedin",prefix:""},{key:"social_youtube",icon:"fa-youtube",prefix:""},{key:"social_tiktok",icon:"fa-tiktok",prefix:""},{key:"social_snapchat",icon:"fa-snapchat",prefix:""}].filter(M=>{var j;return(j=n[M.key])==null?void 0:j.trim()}),_=o.title||"Untitled",S=o.displayTitle!==!1,g=o.displayConference!==!1,f=o.conference||"",H=o.location||"",C=o.date?Wt(o.date):"",$=R.filter(M=>M.is_active!==!1);function A(){let M=`color: ${m}; border-radius: 8px; font-size: 1.14rem;`;return c==="solid"?M+=`background: ${h} !important; border-color: ${h} !important;`:c==="outline"?M+=`background: transparent !important; border: 2px solid ${m} !important; color: ${m} !important;`:M+=`color: ${m} !important;`,M}const s=t.closest(".phone-mockup")||t.parentElement;s&&(s.style.boxShadow="0 20px 40px rgba(0, 0, 0, 0.3)",s.style.padding="8px",x?w==="gradient"&&q?y==="thin"?(s.style.background=q,s.style.padding="8px",s.style.boxShadow="inset 0 0 0 3px transparent, 0 20px 40px rgba(0, 0, 0, 0.3)"):(s.style.background=q,s.style.padding="8px"):y==="thin"?(s.style.background="#1e293b",s.style.boxShadow=`inset 0 0 0 8px ${T}, 0 20px 40px rgba(0, 0, 0, 0.3)`):s.style.background=T:s.style.background="#1e293b");const E=S&&_||g&&f||H||C;t.innerHTML=`
    <div class="phone-screen" style="${l}">
      <!-- Header content — wraps profile + presentation like v0.6.7 -->
      <div class="phone-header-content">
        <!-- Profile — avatar + name side by side -->
        <div class="phone-profile-section">
          ${P?`
            <div class="phone-avatar">
              <img src="${I(P)}" alt="Profile"
                   style="transform: translate(${b}%, ${L}%) scale(${u}) !important; transform-origin: center center !important;"
                   onerror="this.parentElement.style.display='none'">
            </div>
          `:""}
          <div class="phone-name-section">
            ${n.display_name?`<h4 class="phone-display-name" style="color: ${d};">${I(n.display_name)}</h4>`:""}
            ${p.length>0?`
              <div class="phone-socials">
                ${p.map(M=>`
                  <span class="phone-social-icon ${M.key}" title="${M.key.replace("social_","")}">
                    <i class="${M.key==="social_email"?"fas":"fab"} ${M.icon}"></i>
                  </span>
                `).join("")}
              </div>
            `:""}
          </div>
        </div>

        <!-- Presentation Info -->
        ${E?`
          <div class="phone-presentation" style="color: ${r};">
            ${S?`<div class="phone-info-field"><span class="phone-info-value">${I(_)}</span></div>`:""}
            ${g&&f?`<div class="phone-info-field"><span class="phone-info-value">${I(f)}</span></div>`:""}
            ${H?`<div class="phone-info-field"><span class="phone-info-value" style="font-size:0.9rem;">${I(H)}</span></div>`:""}
            ${C?`<div class="phone-info-field"><span class="phone-info-value" style="font-size:0.9rem;">${I(C)}</span></div>`:""}
          </div>
        `:""}
      </div>

      <!-- Links -->
      <div class="phone-links">
        ${$.length===0?`
          <p class="phone-empty" style="color: ${r};">No active links</p>
        `:$.map(M=>{const j=Ne(M),xe=Oe(M),Ke=Te(j.x,j.y,xe),Me=ve(M),Ze=$e(M)||"Untitled";return`
            <div class="phone-link-btn ${c}" style="${A()}">
              ${Me?`
                <div class="phone-link-image-wrapper">
                  <div class="phone-link-image">
                    <img src="${I(Me)}" alt=""
                      style="transform: ${Ke};"
                      onerror="this.parentElement.innerHTML='<i class=\\'fas fa-link\\' style=\\'color:#6b7280\\'></i>'">
                  </div>
                </div>
              `:""}
              <div class="phone-link-text">${I(Ze)}</div>
            </div>
          `}).join("")}
      </div>

      <!-- Footer -->
      <div class="phone-footer" style="color: ${d};">
        <p class="phone-footer-text">Powered by <a href="https://academiqr.com" style="color: ${d};">AcademiQR.com</a></p>
      </div>
    </div>
  `}function Wt(e){try{return new Date(e+"T00:00:00").toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}catch{return e}}async function Xt(e){var d,c,h,m,x,w;if(!R.find(y=>y.id===e))return;const i=(d=document.getElementById("link-title"))==null?void 0:d.value.trim(),o=(c=document.getElementById("link-url"))==null?void 0:c.value.trim(),n=(h=document.getElementById("link-image"))==null?void 0:h.value.trim(),a=parseInt((m=document.getElementById("link-img-pos-x"))==null?void 0:m.value)||50,l=parseInt((x=document.getElementById("link-img-pos-y"))==null?void 0:x.value)||50,r=parseInt((w=document.getElementById("link-img-scale"))==null?void 0:w.value)||100;if(!i){Q("Please enter a title.","warning");return}if(!o){Q("Please enter a URL.","warning");return}try{const y=R.reduce((P,k)=>Math.max(P,k.order_index||0),0),{data:T,error:q}=await B.from("link_items").insert({list_id:v.id,title:i,url:o,image_url:n||null,image_position:{x:a,y:l},image_scale:r,order_index:y+100,is_active:!0}).select().single();if(q)throw q;R.push(T),G=T.id,V(),X(),z(),Z(),We("save-as-library-btn")}catch(y){console.error("Failed to create library link:",y),Q("Failed to create link: "+y.message,"error")}}async function Yt(e){const t=R.find(i=>i.id===e);if(!(!t||!confirm(`Delete "${t.title||"this link"}"?`)))try{const{error:i}=await B.from("link_items").delete().eq("id",e).eq("list_id",v.id);if(i)throw i;R=R.filter(o=>o.id!==e),G=null,V(),X(),z(),Z()}catch(i){console.error("Failed to delete link:",i),Q("Failed to delete: "+i.message,"error")}}async function Jt(e){const t=R.find(o=>o.id===e);if(!t)return;const i=t.is_active===!1;try{const{error:o}=await B.from("link_items").update({is_active:i}).eq("id",e);if(o)throw o;t.is_active=i,V(),z()}catch(o){console.error("Failed to toggle link:",o)}}function Kt(){const e=document.getElementById("new-link-modal");e&&(document.getElementById("new-link-title").value="",document.getElementById("new-link-url").value="",document.getElementById("new-link-image").value="",e.style.display="flex",document.getElementById("new-link-title").focus())}function re(){const e=document.getElementById("new-link-modal");e&&(e.style.display="none")}async function Zt(){var o,n,a;const e=(o=document.getElementById("new-link-title"))==null?void 0:o.value.trim(),t=(n=document.getElementById("new-link-url"))==null?void 0:n.value.trim(),i=(a=document.getElementById("new-link-image"))==null?void 0:a.value.trim();if(!e){Q("Please enter a title.","warning");return}if(!t){Q("Please enter a URL.","warning");return}try{const l=R.reduce((c,h)=>Math.max(c,h.order_index||0),0),{data:r,error:d}=await B.from("link_items").insert({list_id:v.id,title:e,url:t,image_url:i||null,order_index:l+100,is_active:!0}).select().single();if(d)throw d;R.push(r),G=r.id,re(),V(),X(),z(),Z()}catch(l){console.error("Failed to add link:",l),Q("Failed to add link: "+l.message,"error")}}let ge=[];async function ei(){const e=document.getElementById("existing-link-modal");if(!e)return;e.style.display="flex";const t=document.getElementById("existing-links-list");t&&(t.innerHTML='<p class="existing-link-empty">Loading...</p>');try{const{data:i,error:o}=await B.from("link_items").select("*, link_lists!inner(id, slug, presentation_data, owner_id)").eq("link_lists.owner_id",N.id).neq("list_id",v.id).order("created_at",{ascending:!1});if(o)throw o;ge=i||[],Ye("")}catch(i){console.error("Failed to load links:",i),t&&(t.innerHTML='<p class="existing-link-empty">Failed to load links.</p>')}}function Ye(e){const t=document.getElementById("existing-links-list");if(!t)return;const i=e.toLowerCase(),o=i?ge.filter(n=>(n.title||"").toLowerCase().includes(i)||(n.url||"").toLowerCase().includes(i)):ge;if(o.length===0){t.innerHTML=`<p class="existing-link-empty">${i?"No matches found.":"No links in other collections."}</p>`;return}t.innerHTML=o.map(n=>{var l,r,d;const a=((r=(l=n.link_lists)==null?void 0:l.presentation_data)==null?void 0:r.title)||((d=n.link_lists)==null?void 0:d.slug)||"";return`
      <div class="existing-link-item" data-link-id="${n.id}">
        <div class="link-thumb">
          ${n.image_url?`<img src="${I(n.image_url)}" alt="" onerror="this.parentElement.innerHTML='<i class=\\'fas fa-link\\' style=\\'color:#9ca3af\\'></i>'">`:'<i class="fas fa-link" style="color:#9ca3af"></i>'}
        </div>
        <div class="link-info">
          <div class="link-title">${I(n.title||"Untitled")}</div>
          <div class="link-url">${I(Je(n.url||""))}</div>
        </div>
        <span class="link-collection-name">${I(a)}</span>
      </div>
    `}).join(""),t.querySelectorAll(".existing-link-item").forEach(n=>{n.addEventListener("click",()=>ti(n.dataset.linkId))})}async function ti(e){const t=ge.find(i=>i.id===e);if(t)try{const i=R.reduce((a,l)=>Math.max(a,l.order_index||0),0),{data:o,error:n}=await B.from("link_items").insert({list_id:v.id,title:t.title,url:t.url,image_url:t.image_url,image_position:t.image_position||null,image_scale:t.image_scale||null,order_index:i+100,is_active:!0,source_link_id:e,use_library_defaults:!0}).select().single();if(n)throw n;o._resolved_title=t.title,o._resolved_image_url=t.image_url,o._resolved_image_position=t.image_position,o._resolved_image_scale=t.image_scale,R.push(o),G=o.id,pe(),V(),X(),z(),Z()}catch(i){console.error("Failed to add existing link:",i),Q("Failed to add link: "+i.message,"error")}}function pe(){const e=document.getElementById("existing-link-modal");e&&(e.style.display="none"),ge=[]}let fe=null;async function Ce(e){fe=e;const t=document.getElementById("media-library-modal"),i=document.getElementById("media-library-content");if(!(!t||!i)){t.style.display="flex",i.innerHTML=`
    <div style="text-align:center; padding:32px; color:#9ca3af;">
      <i class="fas fa-spinner fa-spin" style="font-size:1.5rem;"></i>
      <p style="margin-top:12px;">Loading your images...</p>
    </div>
  `;try{const o=await dt(N.id);if(o.length===0){i.innerHTML=`
        <div style="text-align:center; padding:32px; color:#9ca3af;">
          <i class="fas fa-images" style="font-size:2rem; opacity:0.3; margin-bottom:12px; display:block;"></i>
          <p>No uploaded images yet.</p>
          <p style="font-size:0.8rem;">Upload an image first, then it will appear here for reuse.</p>
        </div>
      `;return}i.innerHTML=`
      <div class="media-grid">
        ${o.map(n=>`
          <div class="media-item" data-url="${I(n.url)}" title="${I(n.name)}">
            <img src="${I(n.url)}" alt="${I(n.name)}" loading="lazy">
            <span class="media-item-label">${I(n.category)}</span>
          </div>
        `).join("")}
      </div>
    `,i.querySelectorAll(".media-item").forEach(n=>{n.addEventListener("click",()=>{const a=n.dataset.url;fe&&fe(a),be()})})}catch(o){console.error("Failed to load media library:",o),i.innerHTML=`
      <div style="text-align:center; padding:32px; color:#ef4444;">
        <p>Failed to load images: ${I(o.message)}</p>
      </div>
    `}}}function be(){const e=document.getElementById("media-library-modal");e&&(e.style.display="none"),fe=null}let ae=null;function ii(){const e=document.getElementById("links-list");e&&e.querySelectorAll(".link-item").forEach(t=>{t.setAttribute("draggable","true"),t.addEventListener("dragstart",i=>{ae=parseInt(t.dataset.index),t.classList.add("dragging"),i.dataTransfer.effectAllowed="move"}),t.addEventListener("dragend",()=>{t.classList.remove("dragging"),e.querySelectorAll(".link-item").forEach(i=>i.classList.remove("drag-over")),ae=null}),t.addEventListener("dragover",i=>{i.preventDefault(),i.dataTransfer.dropEffect="move",e.querySelectorAll(".link-item").forEach(o=>o.classList.remove("drag-over")),t.classList.add("drag-over")}),t.addEventListener("dragleave",()=>{t.classList.remove("drag-over")}),t.addEventListener("drop",async i=>{i.preventDefault();const o=parseInt(t.dataset.index);if(ae===null||ae===o)return;const[n]=R.splice(ae,1);R.splice(o,0,n),R.forEach((a,l)=>{a.order_index=(l+1)*100}),V(),z();try{await Promise.all(R.map(a=>B.from("link_items").update({order_index:a.order_index}).eq("id",a.id)))}catch(a){console.error("Failed to save order:",a)}})})}function Re(){var r,d,c,h,m,x,w,y,T,q,P,k,u,b,L;const e=((r=document.querySelector('input[name="bg-type"]:checked'))==null?void 0:r.value)||"solid",t=((d=document.querySelector('input[name="border-type"]:checked'))==null?void 0:d.value)||"solid",i=((c=document.querySelector('input[name="border-style"]:checked'))==null?void 0:c.value)||"fill",o=((h=document.getElementById("theme-border-enabled"))==null?void 0:h.checked)||!1,n=((m=document.getElementById("theme-presentation-text"))==null?void 0:m.value)||"#1A2F5B",a=((x=document.getElementById("theme-btn-bg"))==null?void 0:x.value)||"#1A2F5B",l=((w=document.getElementById("theme-border-gradient"))==null?void 0:w.value)||"";return{backgroundType:e,backgroundColor:((y=document.getElementById("theme-bg-color"))==null?void 0:y.value)||"#ffffff",gradientText:((T=document.getElementById("theme-gradient"))==null?void 0:T.value)||"",backgroundImage:e==="image"&&(v._pendingBgImage||(v.theme||{}).backgroundImage)||"",backgroundImageX:parseInt((q=document.getElementById("bg-pos-x"))==null?void 0:q.value)||50,backgroundImageY:parseInt((P=document.getElementById("bg-pos-y"))==null?void 0:P.value)||50,backgroundImageScale:parseInt((k=document.getElementById("bg-pos-scale"))==null?void 0:k.value)||100,profileTextColor:n,presentationTextColor:n,textColor:n,presentationColor:n,profileColor:n,buttonBackgroundColor:a,buttonBgColor:a,buttonTextColor:((u=document.getElementById("theme-btn-text"))==null?void 0:u.value)||"#000000",buttonStyle:((b=document.getElementById("theme-button-style"))==null?void 0:b.value)||"soft",buttonBorderRadius:"8px",borderEnabled:o,gradientBorderEnabled:o,borderType:t,borderStyle:i,borderColor:((L=document.getElementById("theme-border-color"))==null?void 0:L.value)||"#1A2F5B",borderGradient:l,borderGradientText:l}}async function Ae(){const e=document.getElementById("saved-themes-list");if(e)try{const{data:t,error:i}=await B.from("user_themes").select("*").eq("user_id",N.id).eq("theme_type","appearance").order("created_at",{ascending:!1});if(i)throw i;if(!t||t.length===0){e.innerHTML='<p style="color:#9ca3af; font-size:0.875rem;">No saved themes yet.</p>';return}e.innerHTML=t.map(o=>`
      <div class="saved-theme-item" style="display:flex; justify-content:space-between; align-items:center; padding:8px 12px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; margin-bottom:8px;">
        <span style="font-size:0.875rem; font-weight:500; color:#1e293b;">${I(o.name||o.theme_name||"Unnamed")}</span>
        <div style="display:flex; gap:4px;">
          <button type="button" class="apply-theme-btn" data-theme-id="${o.id}" style="background:#1A2F5B; color:white; border:none; padding:4px 10px; border-radius:4px; font-size:0.75rem; cursor:pointer;">Apply</button>
          <button type="button" class="delete-theme-btn" data-theme-id="${o.id}" style="background:none; color:#ef4444; border:1px solid #ef4444; padding:4px 8px; border-radius:4px; font-size:0.75rem; cursor:pointer;"><i class="fas fa-trash"></i></button>
        </div>
      </div>
    `).join(""),e.querySelectorAll(".apply-theme-btn").forEach(o=>{o.addEventListener("click",async()=>{const n=t.find(a=>a.id===o.dataset.themeId);n&&n.theme_data&&(v.theme={...v.theme,...n.theme_data},z(),ue(document.getElementById("tab-content")))})}),e.querySelectorAll(".delete-theme-btn").forEach(o=>{o.addEventListener("click",async()=>{const n=t.find(a=>a.id===o.dataset.themeId);if(!(!n||!confirm(`Delete theme "${n.name||n.theme_name}"?`)))try{const{error:a}=await B.from("user_themes").delete().eq("id",n.id).eq("user_id",N.id);if(a)throw a;Ae()}catch(a){console.error("Failed to delete theme:",a),Q("Failed to delete: "+a.message,"error")}})})}catch(t){console.error("Failed to load themes:",t),e.innerHTML='<p style="color:#ef4444; font-size:0.875rem;">Failed to load themes.</p>'}}async function oi(){const e=document.getElementById("theme-name"),t=e==null?void 0:e.value.trim();if(!t){Q("Please enter a theme name.","warning");return}try{const i=Re(),{error:o}=await B.from("user_themes").insert({user_id:N.id,name:t,theme_type:"appearance",theme_data:i});if(o)throw o;e&&(e.value=""),Ae(),We("save-new-theme-btn")}catch(i){console.error("Failed to save theme:",i),Q("Failed to save theme: "+i.message,"error")}}function ni(){var e,t,i,o,n,a,l,r,d,c,h,m,x,w;document.querySelectorAll(".tab").forEach(y=>{y.addEventListener("click",()=>{document.querySelectorAll(".tab").forEach(T=>T.classList.remove("active")),y.classList.add("active"),de=y.dataset.tab,X()})}),(e=document.getElementById("add-link-btn"))==null||e.addEventListener("click",Kt),(t=document.getElementById("add-existing-btn"))==null||t.addEventListener("click",ei),(i=document.getElementById("new-link-modal-close"))==null||i.addEventListener("click",re),(o=document.getElementById("new-link-cancel"))==null||o.addEventListener("click",re),(n=document.getElementById("new-link-save"))==null||n.addEventListener("click",Zt),(a=document.getElementById("new-link-modal"))==null||a.addEventListener("click",y=>{y.target.id==="new-link-modal"&&re()}),(l=document.getElementById("new-link-upload-btn"))==null||l.addEventListener("click",()=>{var y;(y=document.getElementById("new-link-image-file"))==null||y.click()}),(r=document.getElementById("new-link-image-file"))==null||r.addEventListener("change",async y=>{var k;const T=(k=y.target.files)==null?void 0:k[0];if(!T)return;const q=document.getElementById("new-link-upload-btn"),P=q==null?void 0:q.innerHTML;try{q&&(q.disabled=!0,q.innerHTML='<i class="fas fa-spinner fa-spin"></i>');const u=await Ie(T,"links",N.id,{maxWidth:800,maxHeight:800});document.getElementById("new-link-image").value=u}catch(u){console.error("Upload failed:",u),Q("Upload failed: "+u.message,"error")}finally{q&&(q.disabled=!1,q.innerHTML=P)}}),(d=document.getElementById("new-link-browse-btn"))==null||d.addEventListener("click",()=>{Ce(y=>{document.getElementById("new-link-image").value=y})}),(c=document.getElementById("existing-link-modal-close"))==null||c.addEventListener("click",pe),(h=document.getElementById("existing-link-modal"))==null||h.addEventListener("click",y=>{y.target.id==="existing-link-modal"&&pe()}),(m=document.getElementById("existing-link-search"))==null||m.addEventListener("input",y=>{Ye(y.target.value)}),(x=document.getElementById("media-library-close"))==null||x.addEventListener("click",be),(w=document.getElementById("media-library-modal"))==null||w.addEventListener("click",y=>{y.target.id==="media-library-modal"&&be()}),document.addEventListener("keydown",y=>{y.key==="Escape"&&(re(),pe(),be())})}function I(e){const t=document.createElement("div");return t.textContent=e,t.innerHTML}function Je(e){try{const t=new URL(e),i=t.pathname.length>30?t.pathname.substring(0,30)+"...":t.pathname;return t.hostname+i}catch{return e.length>50?e.substring(0,50)+"...":e}}function Le(e,t){!e||!t||e.querySelectorAll(".tag-remove").forEach(i=>{i.addEventListener("click",o=>{o.stopPropagation();const n=i.dataset.tag;t.tags=(t.tags||[]).filter(a=>a!==n),e.innerHTML=ee(t.tags,{removable:!0}),Le(e,t),J.trigger()})})}function qe(e){e&&e.querySelectorAll(".tag-remove").forEach(t=>{t.addEventListener("click",i=>{i.stopPropagation();const o=t.dataset.tag,n=v.presentation_data||{};n.tags=(n.tags||[]).filter(a=>a!==o),v.presentation_data=n,ie.trigger(),e.innerHTML=ee(n.tags,{removable:!0}),qe(e)})})}function ai(){if(window.innerWidth>768)return;const e=document.createElement("div");e.className="mobile-tab-bar",e.innerHTML=`
    <button class="mobile-tab-btn ${de==="details"?"active":""}" data-tab="details">
      <i class="fas fa-file-alt"></i><span>Details</span>
    </button>
    <button class="mobile-tab-btn ${de==="appearance"?"active":""}" data-tab="appearance">
      <i class="fas fa-palette"></i><span>Theme</span>
    </button>
    <button class="mobile-tab-btn" data-tab="qr-code">
      <i class="fas fa-qrcode"></i><span>QR</span>
    </button>
    <button class="mobile-tab-btn" data-tab="analytics">
      <i class="fas fa-chart-bar"></i><span>Analytics</span>
    </button>
  `,document.body.appendChild(e),e.querySelectorAll(".mobile-tab-btn").forEach(i=>{i.addEventListener("click",()=>{e.querySelectorAll(".mobile-tab-btn").forEach(o=>o.classList.remove("active")),i.classList.add("active"),de=i.dataset.tab,X()})});const t=document.createElement("button");t.className="preview-fab",t.innerHTML='<i class="fas fa-eye"></i>',t.title="Preview",document.body.appendChild(t),t.addEventListener("click",()=>{const i=document.createElement("div");i.className="preview-overlay",i.innerHTML=`
      <button class="preview-overlay-close"><i class="fas fa-times"></i></button>
      <div class="editor-preview-mockup" id="mobile-preview-mockup"></div>
    `,document.body.appendChild(i);const o=document.getElementById("mobile-preview-mockup"),n=document.getElementById("preview-mockup");n&&o&&(o.innerHTML=n.innerHTML,o.style.cssText=n.style.cssText),i.querySelector(".preview-overlay-close").addEventListener("click",()=>i.remove()),i.addEventListener("click",a=>{a.target===i&&i.remove()})})}At();

import{s as C}from"./supabase-whCCoo43.js";/* empty css             */import{c as Ge,s as N,a as it,d as ot,e as De,b as nt,n as at}from"./toast-C5Ve3yOU.js";import{c as de,r as ce,f as lt}from"./auto-save-CVe8WLcj.js";import{h as me,r as st,g as ke,a as Te,b as je,c as Ve}from"./link-utils-D1VnX3pm.js";import{i as rt,g as dt,t as ct}from"./theme-toggle-D-yRes8V.js";import{c as Be,l as ut}from"./image-utils-gR03vQbS.js";import{g as gt,r as oe,c as Ue,n as ze,i as Qe}from"./tag-utils-CwIXpYMv.js";const mt="https://natzpfyxpuycsuuzbqrd.supabase.co/storage/v1/object/public/assets/AcademiQR_logo_blue.png",ee=250,X=16,U=8;let Ee=null,G=null;function We(e){const t=document.createElement("div");return t.textContent=e,t.innerHTML}function qe(e,t,i,o,n,a){e.beginPath(),e.moveTo(t+a,i),e.lineTo(t+o-a,i),e.arcTo(t+o,i,t+o,i+a,a),e.lineTo(t+o,i+n-a),e.arcTo(t+o,i+n,t+o-a,i+n,a),e.lineTo(t+a,i+n),e.arcTo(t,i+n,t,i+n-a,a),e.lineTo(t,i+a),e.arcTo(t,i,t+a,i,a),e.closePath()}function _e(e){var i,o,n,a,l,s;const t=r=>e.querySelector(`#${r}`);return{color:((i=t("qr-color"))==null?void 0:i.value)||"#1A2F5B",bgColor:((o=t("qr-bg-color"))==null?void 0:o.value)||"#ffffff",borderEnabled:((n=t("qr-border-enabled"))==null?void 0:n.checked)||!1,borderColor:((a=t("qr-border-color"))==null?void 0:a.value)||"#000000",borderStyle:((l=t("qr-border-style"))==null?void 0:l.value)||"solid",borderRadius:parseInt(((s=t("qr-border-radius"))==null?void 0:s.value)||"16"),logo:G}}function pt(e,t){const i=t.borderEnabled?U:0,o=t.borderEnabled?t.borderRadius:16,n=document.createElement("canvas");n.width=ee,n.height=ee;const a=n.getContext("2d");if(a.clearRect(0,0,ee,ee),a.fillStyle=t.bgColor,qe(a,i,i,e.width+X*2,e.height+X*2,o),a.fill(),t.borderEnabled){if(a.strokeStyle=t.borderColor,a.lineWidth=U,t.borderStyle==="dashed")a.setLineDash([U*2,U]);else if(t.borderStyle==="dotted")a.setLineDash([U,U]);else if(t.borderStyle==="double"){a.lineWidth=U/3;const r=U/2,c=U/2,h=e.width+X*2+U,m=e.height+X*2+U;a.strokeRect(r,c,h,m),a.strokeRect(r+U,c+U,h-U*2,m-U*2)}if(t.borderStyle!=="double"){const r=U/2,c=U/2,h=e.width+X*2+U,m=e.height+X*2+U;o>0?(qe(a,r,c,h,m,o),a.stroke()):a.strokeRect(r,c,h,m)}a.setLineDash([])}const l=i+X,s=i+X;return a.save(),qe(a,i,i,e.width+X*2,e.height+X*2,o),a.clip(),a.drawImage(e,l,s),a.restore(),{canvas:n,ctx:a,qrX:l,qrY:s,qrSize:e.width}}function ft(e,t,i,o,n){return new Promise(a=>{if(!t){a();return}const l=new Image;l.crossOrigin="anonymous",l.onload=()=>{const s=n*.2;let r=l.width,c=l.height;if(r>s||c>s){const x=Math.min(s/r,s/c);r*=x,c*=x}const h=i+(n-r)/2,m=o+(n-c)/2;e.fillStyle="#ffffff",e.beginPath(),e.arc(i+n/2,o+n/2,Math.max(r,c)/2+8,0,Math.PI*2),e.fill(),e.drawImage(l,h,m,r,c),a()},l.onerror=()=>a(),l.src=t})}async function le(e,t){if(typeof QRCode>"u"){console.error("[QR] QRCode.js library not loaded");return}const i=_e(e),o=e.querySelector("#qr-code-container");if(!o)return;Ee=null,o.innerHTML="",o.style.cssText="background:transparent; padding:0; display:flex; align-items:center; justify-content:center; width:250px; height:250px; margin:0 auto; box-sizing:border-box; border:none; border-radius:0; overflow:visible;";const n=i.borderEnabled?U:0,a=ee-n*2-X*2,l=document.createElement("div");l.style.cssText="position:absolute; left:-9999px; top:-9999px;",document.body.appendChild(l);try{Ee=new QRCode(l,{text:t,width:a,height:a,colorDark:i.color,colorLight:i.bgColor,correctLevel:QRCode.CorrectLevel.H})}catch($){console.error("[QR] Generation failed:",$),o.innerHTML='<p style="color:#ef4444; font-size:0.8rem;">QR generation failed</p>',document.body.removeChild(l);return}await new Promise($=>setTimeout($,100));const s=l.querySelector("canvas");if(!s){document.body.removeChild(l);return}const{canvas:r,ctx:c,qrX:h,qrY:m,qrSize:x}=pt(s,i);await ft(c,G,h,m,x);const w=document.createElement("img");w.src=r.toDataURL("image/png");const y=i.borderEnabled?i.borderRadius:16;w.style.cssText=`width:${ee}px; height:${ee}px; display:block; margin:0 auto; border-radius:${y}px; background:transparent;`,w.alt="QR Code",w.title="Right-click to copy image",w.setAttribute("data-composite","true"),o.innerHTML="",o.appendChild(w),o._compositeCanvas=r,document.body.removeChild(l);const T=e.querySelector("#qr-actions");T&&(T.style.display="flex")}function bt(e,t,i){const o=e.querySelector("#qr-code-container");if(!o||!Ee)return;const n=o.querySelector('img[data-composite="true"]');if(!n)return;const a=`${i||"qrcode"}-qrcode`;if(t==="png"||t==="jpeg"){const l=new Image;l.onload=()=>{const s=document.createElement("canvas");s.width=l.width,s.height=l.height;const r=s.getContext("2d");t==="jpeg"&&(r.fillStyle="#ffffff",r.fillRect(0,0,s.width,s.height)),r.drawImage(l,0,0);const c=document.createElement("a");c.download=`${a}.${t==="jpeg"?"jpg":"png"}`,c.href=s.toDataURL(t==="jpeg"?"image/jpeg":"image/png",.95),c.click()},l.src=n.src}else if(t==="svg"){const l=new Image;l.onload=()=>{const s=document.createElement("canvas");s.width=l.width,s.height=l.height,s.getContext("2d").drawImage(l,0,0);const c=s.toDataURL("image/png"),h=`<svg xmlns="http://www.w3.org/2000/svg" width="${s.width}" height="${s.height}" viewBox="0 0 ${s.width} ${s.height}"><image href="${c}" width="${s.width}" height="${s.height}"/></svg>`,m=new Blob([h],{type:"image/svg+xml"}),x=document.createElement("a");x.download=`${a}.svg`,x.href=URL.createObjectURL(m),x.click(),URL.revokeObjectURL(x.href)},l.src=n.src}}async function vt(e,t){const i=_e(t),o={color:i.color,bgColor:i.bgColor,borderEnabled:i.borderEnabled,borderColor:i.borderColor,borderStyle:i.borderStyle,borderRadius:String(i.borderRadius),logo:G},{error:n}=await C.from("link_lists").update({qr_code_data:o,updated_at:new Date().toISOString()}).eq("id",e);return!n}async function Ce(e,t){const i=e.querySelector("#saved-qr-themes-list");if(!i)return;const{data:o,error:n}=await C.from("user_themes").select("*").eq("user_id",t).eq("theme_type","qr").order("created_at",{ascending:!1});if(n||!o||o.length===0){i.innerHTML='<p class="qr-themes-empty">No saved QR themes yet</p>';return}i.innerHTML=o.map(a=>{const l=We(a.name);return`
      <div class="saved-theme-item" data-theme-id="${a.id}" data-theme-name="${l}">
        <div class="saved-theme-name">${l}</div>
        <button class="btn-icon qr-theme-delete" data-theme-id="${a.id}" data-theme-name="${l}" title="Delete"><i class="fas fa-trash"></i></button>
      </div>
    `}).join("")}async function yt(e,t,i){var r;const o=e.querySelector("#qr-theme-name"),n=(r=o==null?void 0:o.value)==null?void 0:r.trim();if(!n){N("Please enter a QR theme name","warning");return}const a=_e(e),l={name:n,color:a.color,bgColor:a.bgColor,borderEnabled:a.borderEnabled,borderColor:a.borderColor,borderStyle:a.borderStyle,borderRadius:String(a.borderRadius),logo:G},{data:s}=await C.from("user_themes").select("id").eq("user_id",t).eq("name",n).eq("theme_type","qr").maybeSingle();if(s){if(!confirm(`QR Theme "${n}" already exists. Overwrite?`))return;await C.from("user_themes").update({theme_data:l,updated_at:new Date().toISOString()}).eq("id",s.id)}else await C.from("user_themes").insert({user_id:t,name:n,theme_type:"qr",theme_data:l});o.value="",await Ce(e,t)}async function ht(e,t,i,o){confirm(`Delete QR Theme "${o}"?`)&&(await C.from("user_themes").delete().eq("id",i).eq("user_id",t),await Ce(e,t))}function kt(e,t,i){const o=n=>e.querySelector(`#${n}`);if(i.color&&(o("qr-color")&&(o("qr-color").value=i.color),o("qr-color-text")&&(o("qr-color-text").value=i.color)),i.bgColor&&(o("qr-bg-color")&&(o("qr-bg-color").value=i.bgColor),o("qr-bg-color-text")&&(o("qr-bg-color-text").value=i.bgColor)),i.borderEnabled!==void 0){o("qr-border-enabled")&&(o("qr-border-enabled").checked=i.borderEnabled);const n=o("qr-border-options");n&&(n.style.display=i.borderEnabled?"block":"none")}i.borderColor&&(o("qr-border-color")&&(o("qr-border-color").value=i.borderColor),o("qr-border-color-text")&&(o("qr-border-color-text").value=i.borderColor)),i.borderStyle&&o("qr-border-style")&&(o("qr-border-style").value=i.borderStyle),i.borderRadius&&o("qr-border-radius")&&(o("qr-border-radius").value=i.borderRadius),i.logo?G=i.logo:G=null,we(e),le(e,t)}function Et(e,t,i){var a;const o=(a=i.target.files)==null?void 0:a[0];if(!o)return;if(o.size>5*1024*1024){N("Logo must be under 5 MB","warning"),i.target.value="";return}const n=new FileReader;n.onload=l=>{G=l.target.result,we(e),le(e,t)},n.readAsDataURL(o)}function xt(e,t){G=null,we(e);const i=e.querySelector("#qr-logo-upload");i&&(i.value=""),le(e,t)}function _t(e,t){G=mt,we(e),le(e,t)}function we(e){const t=e.querySelector("#qr-logo-preview"),i=e.querySelector("#qr-logo-img");G?(i&&(i.src=G),t&&(t.style.display="inline-block")):(t&&(t.style.display="none"),i&&(i.src=""))}function wt(e,t,i){const o=e.querySelector(`#${t}`),n=e.querySelector(`#${i}`);o&&n&&(n.value=o.value)}function Lt(e,t,i){const o=e.querySelector(`#${t}`),n=e.querySelector(`#${i}`);o&&n&&/^#[0-9a-fA-F]{6}$/.test(o.value)&&(n.value=o.value)}function qt(e,t,i){var y,T,$,M,k,u,b,L,p,_,S,g,f,H,R,q,B;if(!t||!i){e.innerHTML='<div class="qr-tab"><p>Please select a collection first.</p></div>';return}const o=Ge(i.id,t.id),n=t.qr_code_data||{};Ee=null,G=n.logo||null;const a=n.color||"#1A2F5B",l=n.bgColor||"#ffffff",s=n.borderEnabled===!0||n.borderEnabled==="true",r=n.borderColor||"#000000",c=n.borderStyle||"solid",h=String(n.borderRadius||"16");e.innerHTML=`
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
              <input type="text" id="qr-url" class="form-input" value="${We(o)}" readonly>
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
              <input type="checkbox" id="qr-border-enabled" ${s?"checked":""}>
              <span>Border</span>
            </label>
            <div id="qr-border-options" class="qr-border-options" style="display: ${s?"block":"none"};">
              <div class="form-group">
                <label class="qr-sub-label">Color</label>
                <div class="color-options">
                  <input type="color" id="qr-border-color" value="${r}" class="color-picker">
                  <input type="text" id="qr-border-color-text" value="${r}" class="color-input" maxlength="7">
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
            <div id="qr-logo-preview" class="qr-logo-preview" style="display: ${G?"inline-block":"none"};">
              <img id="qr-logo-img" src="${G||""}" alt="Logo">
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
  `;const m=()=>le(e,o);(y=e.querySelector("#qr-copy-url"))==null||y.addEventListener("click",()=>{navigator.clipboard.writeText(o).then(()=>{const d=e.querySelector("#qr-copy-url");d&&(d.innerHTML='<i class="fas fa-check"></i>',setTimeout(()=>d.innerHTML='<i class="fas fa-copy"></i>',1500))})});for(const d of["qr-color","qr-bg-color","qr-border-color"])(T=e.querySelector(`#${d}`))==null||T.addEventListener("input",()=>{wt(e,d,d+"-text"),m()});for(const[d,E]of[["qr-color-text","qr-color"],["qr-bg-color-text","qr-bg-color"],["qr-border-color-text","qr-border-color"]])($=e.querySelector(`#${d}`))==null||$.addEventListener("input",()=>{Lt(e,d,E),m()});(M=e.querySelector("#qr-border-enabled"))==null||M.addEventListener("change",d=>{const E=e.querySelector("#qr-border-options");E&&(E.style.display=d.target.checked?"block":"none"),m()});for(const d of["qr-border-style","qr-border-radius"])(k=e.querySelector(`#${d}`))==null||k.addEventListener("change",m);const x=de(async()=>{const d=await vt(t.id,e);if(d){const E=_e(e);t.qr_code_data={color:E.color,bgColor:E.bgColor,borderEnabled:E.borderEnabled,borderColor:E.borderColor,borderStyle:E.borderStyle,borderRadius:String(E.borderRadius),logo:G}}return d},{statusSelector:"#qr-save-status"});ce(x);const w=()=>x.trigger();for(const d of["qr-color","qr-bg-color","qr-border-color"])(u=e.querySelector(`#${d}`))==null||u.addEventListener("input",w);for(const d of["qr-color-text","qr-bg-color-text","qr-border-color-text"])(b=e.querySelector(`#${d}`))==null||b.addEventListener("input",w);(L=e.querySelector("#qr-border-enabled"))==null||L.addEventListener("change",w);for(const d of["qr-border-style","qr-border-radius"])(p=e.querySelector(`#${d}`))==null||p.addEventListener("change",w);(_=e.querySelector("#qr-logo-upload-btn"))==null||_.addEventListener("click",()=>{var d;(d=e.querySelector("#qr-logo-upload"))==null||d.click()}),(S=e.querySelector("#qr-logo-upload"))==null||S.addEventListener("change",d=>{Et(e,o,d),w()}),(g=e.querySelector("#qr-logo-default-btn"))==null||g.addEventListener("click",()=>{_t(e,o),w()}),(f=e.querySelector("#qr-logo-remove"))==null||f.addEventListener("click",()=>{xt(e,o),w()}),(H=e.querySelector("#qr-actions"))==null||H.addEventListener("click",d=>{const E=d.target.closest("button[data-format]");E&&bt(e,E.dataset.format,t.slug)}),(R=e.querySelector("#qr-theme-toggle"))==null||R.addEventListener("click",()=>{const d=e.querySelector("#qr-theme-content"),E=e.querySelector("#qr-theme-toggle .section-chevron");if(d){const D=d.style.display!=="none";d.style.display=D?"none":"block",E&&E.classList.toggle("collapsed",D)}}),(q=e.querySelector("#qr-theme-save-btn"))==null||q.addEventListener("click",()=>{yt(e,i.id)}),(B=e.querySelector("#saved-qr-themes-list"))==null||B.addEventListener("click",async d=>{const E=d.target.closest(".qr-theme-delete");if(E){d.stopPropagation(),await ht(e,i.id,E.dataset.themeId,E.dataset.themeName);return}const D=d.target.closest(".saved-theme-item");if(D){const{data:ie}=await C.from("user_themes").select("theme_data").eq("id",D.dataset.themeId).single();ie!=null&&ie.theme_data&&kt(e,o,ie.theme_data)}}),le(e,o),Ce(e,i.id)}function be(e){const t=document.createElement("div");return t.textContent=e,t.innerHTML}const $t={instagram:"Instagram",facebook:"Facebook",twitter:"X (Twitter)",linkedin:"LinkedIn",youtube:"YouTube",tiktok:"TikTok",snapchat:"Snapchat",email:"Email"};function St(){const e=new Date,t=new Date;return t.setDate(t.getDate()-30),{from:t.toISOString().slice(0,10),to:e.toISOString().slice(0,10)}}function Ne(e,t=!1){const[i,o,n]=e.split("-").map(Number);return t?new Date(i,o-1,n,23,59,59,999).toISOString():new Date(i,o-1,n,0,0,0,0).toISOString()}async function It(e,t,i,o){var q,B;const n=i?Ne(i):null,a=o?Ne(o,!0):null;function l(d,E){return n&&(d=d.gte(E,n)),a&&(d=d.lte(E,a)),d}let s=C.from("link_clicks").select("*",{count:"exact",head:!0}).eq("owner_id",e).eq("list_id",t).not("link_id","is",null);s=l(s,"clicked_at");const{count:r}=await s;let c=C.from("page_views").select("*",{count:"exact",head:!0}).eq("owner_id",e).eq("list_id",t);c=l(c,"viewed_at");const{count:h}=await c;let m=C.from("page_views").select("session_id").eq("owner_id",e).eq("list_id",t);m=l(m,"viewed_at");const{data:x}=await m,w=x?new Set(x.map(d=>d.session_id).filter(Boolean)).size:0;let y=C.from("link_clicks").select("link_id, link_items:link_id (title, url)").eq("owner_id",e).eq("list_id",t).not("link_id","is",null);y=l(y,"clicked_at");const{data:T}=await y,$={};if(T)for(const d of T)$[d.link_id]||($[d.link_id]={title:((q=d.link_items)==null?void 0:q.title)||"Unknown Link",url:((B=d.link_items)==null?void 0:B.url)||"",clicks:0}),$[d.link_id].clicks++;const M=Object.values($).sort((d,E)=>E.clicks-d.clicks);let k=C.from("link_clicks").select("social_platform").eq("owner_id",e).eq("list_id",t);k=l(k,"clicked_at");const{data:u}=await k,b={};if(u)for(const d of u){if(!d.social_platform)continue;const E=d.social_platform.toLowerCase();b[E]||(b[E]={platform:E,clicks:0}),b[E].clicks++}const L=Object.values(b).sort((d,E)=>E.clicks-d.clicks),p=L.reduce((d,E)=>d+E.clicks,0);let _=C.from("page_views").select("viewed_at").eq("owner_id",e).eq("list_id",t);_=l(_,"viewed_at");const{data:S}=await _,g={};if(S)for(const d of S){const E=(d.viewed_at||d.created_at||"").substring(0,10);E&&(g[E]=(g[E]||0)+1)}let f=C.from("link_clicks").select("clicked_at").eq("owner_id",e).eq("list_id",t).not("link_id","is",null);f=l(f,"clicked_at");const{data:H}=await f,R={};if(H)for(const d of H){const E=(d.clicked_at||d.created_at||"").substring(0,10);E&&(R[E]=(R[E]||0)+1)}return{totalClicks:r||0,totalViews:h||0,uniqueVisitors:w,totalSocialClicks:p,linkBreakdown:M,socialBreakdown:L,dailyViews:g,dailyClicks:R}}function Tt(e,t){const i=e.querySelector("#links-breakdown-list");if(!i)return;if(!t||t.length===0){i.innerHTML='<p class="analytics-empty"><i class="fas fa-chart-bar" style="opacity:0.3; font-size:1.5rem; display:block; margin-bottom:8px;"></i>No link clicks yet. Share your collection to start seeing analytics.</p>';return}const o=Math.max(...t.map(n=>n.clicks));i.innerHTML=t.map(n=>{const a=o>0?n.clicks/o*100:0,l=n.url.length>50?n.url.substring(0,50)+"...":n.url;return`
      <div class="analytics-link-row">
        <div class="analytics-link-info">
          <div class="analytics-link-title">${be(n.title)}</div>
          <div class="analytics-link-url" title="${be(n.url)}">${be(l)}</div>
        </div>
        <div class="analytics-link-count">${n.clicks}</div>
        <div class="analytics-bar-track">
          <div class="analytics-bar-fill" style="width: ${a}%;"></div>
        </div>
      </div>
    `}).join("")}function Bt(e,t){const i=e.querySelector("#social-breakdown-list");if(i){if(!t||t.length===0){i.innerHTML='<p class="analytics-empty">No social media clicks yet.</p>';return}i.innerHTML=t.map(o=>{const n=$t[o.platform]||o.platform.charAt(0).toUpperCase()+o.platform.slice(1);return`
      <div class="analytics-social-row">
        <span class="analytics-social-name">${be(n)}</span>
        <span class="analytics-social-count">${o.clicks}</span>
      </div>
    `}).join("")}}function Ct(e,t){const i=(o,n)=>{const a=e.querySelector(`#${o}`);a&&(a.textContent=n)};i("stat-total-views",t.totalViews),i("stat-link-clicks",t.totalClicks),i("stat-social-clicks",t.totalSocialClicks),i("stat-unique-visitors",t.uniqueVisitors)}function Rt(e,t,i,o,n){const a=e.querySelector("#analytics-chart");if(!a)return;const l=a.getContext("2d"),s=window.devicePixelRatio||1,c=a.parentElement.getBoundingClientRect().width||600,h=200;a.width=c*s,a.height=h*s,a.style.width=c+"px",a.style.height=h+"px",l.scale(s,s);const m=new Date(o||Date.now()-30*864e5),x=new Date(n||Date.now()),w=[],y=new Date(m);for(;y<=x;)w.push(y.toISOString().substring(0,10)),y.setDate(y.getDate()+1);if(w.length===0)return;const T=w.map(q=>t[q]||0),$=w.map(q=>i[q]||0),M=Math.max(...T,...$,1),k={top:20,right:16,bottom:32,left:40},u=c-k.left-k.right,b=h-k.top-k.bottom,L=document.documentElement.getAttribute("data-theme")==="dark",p=L?"rgba(255,255,255,0.1)":"#e2e8f0",_="#94a3b8",S=L?"rgba(147, 197, 253, 1)":"rgba(26, 47, 91, 1)",g=L?"rgba(74, 222, 128, 1)":"rgba(34, 197, 94, 1)",f=L?"#cbd5e1":void 0;l.clearRect(0,0,c,h),l.strokeStyle=p,l.lineWidth=.5;for(let q=0;q<=4;q++){const B=k.top+b/4*q;l.beginPath(),l.moveTo(k.left,B),l.lineTo(c-k.right,B),l.stroke()}l.fillStyle=_,l.font="10px Inter, sans-serif",l.textAlign="right";for(let q=0;q<=4;q++){const B=Math.round(M*(4-q)/4),d=k.top+b/4*q+3;l.fillText(B.toString(),k.left-6,d)}l.textAlign="center";const H=Math.max(1,Math.floor(w.length/6));for(let q=0;q<w.length;q+=H){const B=k.left+u/(w.length-1||1)*q,d=w[q].split("-");l.fillText(`${d[1]}/${d[2]}`,B,h-8)}function R(q,B){if(!(q.length<2)){l.strokeStyle=B,l.lineWidth=2,l.lineJoin="round",l.beginPath();for(let d=0;d<q.length;d++){const E=k.left+u/(q.length-1||1)*d,D=k.top+b-q[d]/M*b;d===0?l.moveTo(E,D):l.lineTo(E,D)}l.stroke(),l.lineTo(k.left+u,k.top+b),l.lineTo(k.left,k.top+b),l.closePath(),l.fillStyle=B.replace("1)",L?"0.15)":"0.08)"),l.fill()}}R(T,S),R($,g),l.font="11px Inter, sans-serif",l.fillStyle=S,l.fillRect(k.left,4,12,3),l.fillStyle=f||S,l.fillText("Views",k.left+40,10),l.fillStyle=g,l.fillRect(k.left+80,4,12,3),l.fillStyle=f||g,l.fillText("Clicks",k.left+120,10)}function At(e,t,i){var a,l;if(!t||!i){e.innerHTML='<div class="analytics-tab"><p>Please select a collection first.</p></div>';return}const o=St();e.innerHTML=`
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
  `;const n=async()=>{var h,m;const s=((h=e.querySelector("#analytics-date-from"))==null?void 0:h.value)||"",r=((m=e.querySelector("#analytics-date-to"))==null?void 0:m.value)||"",c=e.querySelector("#analytics-refresh");c&&(c.disabled=!0,c.innerHTML='<i class="fas fa-spinner fa-spin"></i> Loading...');try{const x=await It(i.id,t.id,s,r);Ct(e,x),Rt(e,x.dailyViews,x.dailyClicks,s,r),Tt(e,x.linkBreakdown),Bt(e,x.socialBreakdown)}catch(x){console.error("[Analytics] Failed to load:",x)}c&&(c.disabled=!1,c.innerHTML='<i class="fas fa-sync-alt"></i> Apply')};(a=e.querySelector("#analytics-refresh"))==null||a.addEventListener("click",n);for(const[s,r]of[["chart-toggle","chart-content"],["links-breakdown-toggle","links-breakdown-content"],["social-breakdown-toggle","social-breakdown-content"]])(l=e.querySelector(`#${s}`))==null||l.addEventListener("click",()=>{const c=e.querySelector(`#${r}`),h=e.querySelector(`#${s} .section-chevron`);if(c){const m=c.style.display!=="none";c.style.display=m?"none":"block",h&&h.classList.toggle("collapsed",m)}});n()}let O=null,v=null,F=null,A=[],V=null,ge="details",K=[],ae=null,ne=null,Z=null,xe=null;const Xe='<svg class="section-chevron" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>',Ye='<svg class="section-chevron collapsed" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>',Mt={backgroundType:"solid",backgroundColor:"#ffffff",gradientText:"",backgroundImage:"",backgroundImageX:50,backgroundImageY:50,backgroundImageScale:100,profileTextColor:"#1A2F5B",presentationTextColor:"#1A2F5B",buttonTextColor:"#000000",buttonBackgroundColor:"#1A2F5B",buttonStyle:"soft",buttonBorderRadius:"8px",buttonPadding:"12px 24px",buttonFontSize:"16px",buttonFontWeight:"500",textFontSize:"18px",textFontWeight:"600",borderEnabled:!0,borderType:"gradient",borderStyle:"thin",borderColor:"#1A2F5B",borderWidth:"1px",borderGradient:"linear-gradient(186deg, #D54070 0%, #8F4469 20%, #CA5699 40%, #59B8DA 60%, #9AD0DD 80%, #73B44A 100%)"};function Je(e){const t=document.getElementById(e);if(!t)return;const i=t.textContent;t.textContent="✓ Saved",setTimeout(()=>{t.textContent=i},1500)}function Re(e=50,t=50,i=100){return`translate(${(e-50)*.6}%, ${(t-50)*.6}%) scale(${i/100})`}function Ke(e){e.querySelectorAll(".section-header").forEach(t=>{t.addEventListener("click",()=>{const i=t.dataset.section,o=document.getElementById(i),n=t.querySelector(".section-chevron");o&&n&&(o.classList.toggle("collapsed"),n.classList.toggle("collapsed"))})})}async function Pt(){var t;if(O=await it(),!O)return;const e=ot("id");if(!e){De();return}if(Ht(),await Promise.all([Ft(e),Ut()]),!v){N("Collection not found","error"),De();return}await Dt(),te(),gt(C,O.id).then(i=>{K=i}),Y(),Q(),li(),si(),ae=de(async()=>{try{$e();const{error:i}=await C.from("link_lists").update({presentation_data:v.presentation_data}).eq("id",v.id);if(i)throw i;return te(),!0}catch(i){return console.error("Auto-save presentation failed:",i),!1}},{statusSelector:"#presentation-save-status"}),ne=de(async()=>{var i,o,n;try{const a=((i=document.getElementById("collection-visibility"))==null?void 0:i.value)||"public",l=(o=document.getElementById("collection-passkey"))==null?void 0:o.value.trim(),s=((n=document.getElementById("collection-slug"))==null?void 0:n.value.trim().toLowerCase().replace(/[^a-z0-9-]/g,""))||v.slug,r={visibility:a,slug:s};a==="passkey"&&l?r.passkey_hash=l:a!=="passkey"&&(r.passkey_hash=null);const{error:c}=await C.from("link_lists").update(r).eq("id",v.id);if(c)throw c;return v.visibility=a,v.slug=s,r.passkey_hash!==void 0&&(v.passkey_hash=r.passkey_hash),te(),!0}catch(a){return console.error("Auto-save settings failed:",a),!1}},{statusSelector:"#settings-save-status"}),Z=de(async()=>{var o,n,a,l,s,r,c,h;const i=V;if(!i)return!1;try{const m=A.find(S=>S.id===i);if(!m)return!1;const x=(o=document.getElementById("link-title"))==null?void 0:o.value.trim(),w=(n=document.getElementById("link-url"))==null?void 0:n.value.trim(),y=(a=document.getElementById("link-image"))==null?void 0:a.value.trim(),T=!!m.source_link_id,$=me(m),M=T?!m.use_library_defaults:$,k=T&&m.use_library_defaults,u=k?((l=m.image_position)==null?void 0:l.x)??50:parseInt((s=document.getElementById("link-img-pos-x"))==null?void 0:s.value)||50,b=k?((r=m.image_position)==null?void 0:r.y)??50:parseInt((c=document.getElementById("link-img-pos-y"))==null?void 0:c.value)||50,L=k?m.image_scale??100:parseInt((h=document.getElementById("link-img-scale"))==null?void 0:h.value)||100,p={url:w,use_library_defaults:!!m.use_library_defaults};m.tags&&m.tags.length>0&&(p.tags=m.tags),M&&!T?p.custom_overrides={title:x,image_url:y||null,image_position:{x:u,y:b},image_scale:L}:k||(p.title=x,p.image_url=y||null,p.image_position={x:u,y:b},p.image_scale=L,p.custom_overrides=null);const{error:_}=await C.from("link_items").update({...p,updated_at:new Date().toISOString()}).eq("id",i);if(_)throw _;return Object.assign(m,p),W(),Q(),!0}catch(m){return console.error("Auto-save link failed:",m),!1}},{statusSelector:"#link-save-status"}),xe=de(async()=>{try{const i=Pe(),o={...v.theme,...i},{error:n}=await C.from("link_lists").update({theme:o}).eq("id",v.id);if(n)throw n;return v.theme=o,Q(),!0}catch(i){return console.error("Auto-save theme failed:",i),!1}},{statusSelector:"#theme-save-status"}),ce(ae),ce(ne),ce(Z),ce(xe),window.addEventListener("beforeunload",()=>{lt()}),sessionStorage.setItem("academiqr-last-collection",JSON.stringify({id:v.id,title:((t=v.presentation_data)==null?void 0:t.title)||"Untitled Collection"}))}function Ht(){var i;const e=document.getElementById("main-nav");if(!e)return;e.innerHTML=`
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
  `,(i=document.getElementById("sign-out-btn"))==null||i.addEventListener("click",async()=>{await nt(),at("login")}),rt();const t=document.getElementById("theme-toggle-btn");t&&(t.querySelector("i").className=(dt()==="dark","fas fa-circle-half-stroke"),t.addEventListener("click",()=>{const o=ct();t.querySelector("i").className="fas fa-circle-half-stroke"}))}async function Ft(e){try{const{data:t,error:i}=await C.from("link_lists").select("*").eq("id",e).eq("owner_id",O.id).single();if(i)throw i;v=t}catch(t){console.error("Failed to load collection:",t),v=null}}async function Dt(){if(v)try{const{data:e,error:t}=await C.from("link_items").select("*, source_link_id, use_library_defaults").eq("list_id",v.id).order("order_index",{ascending:!0});if(t)throw t;A=e||[],A.sort((i,o)=>{const n=i.order_index??1/0,a=o.order_index??1/0;return n!==a?n-a:new Date(i.created_at||0)-new Date(o.created_at||0)}),await st(A)}catch(e){console.error("Failed to load links:",e),A=[]}}async function Ut(){try{const{data:e,error:t}=await C.from("profiles").select("display_name, username, profile_photo, profile_photo_position, social_order, social_website, social_email, social_instagram, social_facebook, social_twitter, social_linkedin, social_youtube, social_tiktok, social_snapchat, social_google_scholar, social_orcid, social_researchgate").eq("id",O.id).single();if(t)throw t;F=e}catch(e){console.error("Failed to load profile:",e),F={}}}function te(){const e=v.presentation_data||{},t=e.title||"Untitled Collection";document.getElementById("collection-title").textContent=t;const i=document.getElementById("collection-meta");if(i){const o=e.conference||"";i.innerHTML=`
      ${o?`<span class="meta-item"><i class="fas fa-building"></i> ${I(o)}</span>`:""}
      <span class="meta-item"><i class="fas fa-list"></i> ${A.length} link${A.length!==1?"s":""}</span>
    `}W()}function W(){const e=document.getElementById("links-list");if(e){if(A.length===0){e.innerHTML=`
      <div class="empty-links">
        <i class="fas fa-link"></i>
        <p>No links yet. Add your first link!</p>
      </div>
    `;return}e.innerHTML=A.map((t,i)=>{const o=t.id===V,n=t.is_active!==!1;return`
      <div class="link-item ${o?"selected":""} ${n?"":"inactive"}"
           data-link-id="${t.id}" data-index="${i}">
        <div class="link-drag-handle" title="Drag to reorder">
          <i class="fas fa-grip-vertical"></i>
        </div>
        ${ke(t)?`
          <div class="link-thumb">
            <img src="${I(ke(t))}" alt="" loading="lazy"
                 onerror="this.parentElement.innerHTML='<i class=\\'fas fa-image\\'></i>'">
          </div>
        `:`
          <div class="link-thumb link-thumb-empty">
            <i class="fas fa-link"></i>
          </div>
        `}
        <div class="link-info">
          <div class="link-title">${I(Te(t)||"Untitled Link")}${t.use_library_defaults&&t.source_link_id?' <i class="fas fa-link" style="font-size:0.6rem; opacity:0.5;" title="Using library version"></i>':""}</div>
          <div class="link-url">${I(et(t.url||""))}</div>
        </div>
        <div class="link-actions">
          <button class="btn-icon link-toggle" data-link-id="${t.id}" title="${n?"Active":"Inactive"}">
            <i class="fas ${n?"fa-toggle-on":"fa-toggle-off"}"></i>
          </button>
        </div>
      </div>
    `}).join(""),e.querySelectorAll(".link-item").forEach(t=>{t.addEventListener("click",i=>{i.target.closest(".link-toggle")||i.target.closest(".link-drag-handle")||(V=t.dataset.linkId,W(),Y(),zt())})}),e.querySelectorAll(".link-toggle").forEach(t=>{t.addEventListener("click",i=>{i.stopPropagation(),Zt(t.dataset.linkId)})}),ni()}}function zt(){setTimeout(()=>{const e=document.getElementById("link-editor-section");e&&(e.style.display="block",e.scrollIntoView({behavior:"smooth",block:"start"}))},50)}function Y(){const e=document.getElementById("tab-content");if(e)switch(ge){case"details":Qt(e);break;case"appearance":pe(e);break;case"qr-code":Wt(e);break;case"analytics":Xt(e);break}}function Qt(e){var c,h,m,x,w,y,T,$,M,k;const t=v.presentation_data||{},i=Xe,o=v.visibility||"public",n=!!v.passkey_hash;let a=`
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
            ${oe(t.tags||[],{removable:!0})}
          </div>
          <div id="editor-tag-input-container"></div>
        </div>
      </div>
    </div>

    <!-- ═══ COLLECTION SETTINGS ═══ -->
    <div class="section">
      <div class="section-header" data-section="settings-section">
        <h3>Collection Settings <span id="settings-save-status" class="auto-save-status"></span></h3>
        ${Ye}
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
  `;if(V){const u=A.find(b=>b.id===V);if(u){const b=!!u.source_link_id,L=me(u),p=b?!u.use_library_defaults:L,_=b&&u.use_library_defaults,S=p&&L?u.custom_overrides.title??u.title??"":u.title||"",g=p&&L?u.custom_overrides.image_url??u.image_url??"":u.image_url||"",f=Te(u)||"",H=ke(u)||"",R=_?je(u):p&&L&&u.custom_overrides.image_position?u.custom_overrides.image_position:u.image_position||u.imagePosition||{x:50,y:50},q=_?Ve(u):p&&L&&u.custom_overrides.image_scale!=null?u.custom_overrides.image_scale:u.image_scale??u.imageScale??100,B=_?H:g;a+=`
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
              <input type="text" id="link-image" value="${I(B||"")}" placeholder="Image URL or upload" ${_?"disabled":""}>
              <button class="btn-secondary" id="upload-image-btn" ${_?"disabled":""}><i class="fas fa-upload"></i> Upload</button>
              <button class="btn-secondary" id="browse-media-btn" ${_?"disabled":""}><i class="fas fa-images"></i> Browse</button>
              <input type="file" id="link-image-file" accept="image/*" style="display:none;">
            </div>
            ${B?`
              <div class="image-preview" style="margin-top:12px;">
                <img src="${I(B)}" alt="Preview"
                     style="transform: ${Re(R.x,R.y,q)};"
                     onerror="this.style.display='none'">
              </div>
              ${_?"":`
              <div class="form-group" style="margin-top:8px;">
                <label>Image Position X</label>
                <input type="range" id="link-img-pos-x" min="0" max="100" value="${R.x??50}" class="range-input">
              </div>
              <div class="form-group">
                <label>Image Position Y</label>
                <input type="range" id="link-img-pos-y" min="0" max="100" value="${R.y??50}" class="range-input">
              </div>
              <div class="form-group">
                <label>Image Scale</label>
                <input type="range" id="link-img-scale" min="50" max="200" value="${q}" class="range-input">
              </div>
              `}
            `:""}
          </div>

          <div class="form-group">
            <label>Tags</label>
            <div id="link-tags-display" style="display:flex; flex-wrap:wrap; gap:4px; margin-bottom:6px;">
              ${oe(u.tags||[],{removable:!0})}
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
    `;e.innerHTML=a,["info-title","info-conference","info-location","info-date"].forEach(u=>{var b;(b=document.getElementById(u))==null||b.addEventListener("input",()=>{$e(),Q(),ae.trigger()})}),["display-title","display-conference"].forEach(u=>{var b;(b=document.getElementById(u))==null||b.addEventListener("change",()=>{$e(),Q(),ae.trigger()})});const l=e.querySelector(".editor-tags-container"),s=document.getElementById("editor-tag-input-container");if(s){const u=(v.presentation_data||{}).tags||[];Ue(s,K,u,async b=>{const L=v.presentation_data||{};L.tags=ze([...L.tags||[],b]),v.presentation_data=L,K.includes(b)||(K.push(b),K.sort(),Qe()),ae.trigger(),l&&(l.innerHTML=oe(L.tags,{removable:!0})),Ie(l)})}Ie(l),(c=document.getElementById("copy-link-btn"))==null||c.addEventListener("click",Nt);const r=v.slug||"";if((h=document.getElementById("collection-slug"))==null||h.addEventListener("input",u=>{const b=u.target.value.toLowerCase().replace(/[^a-z0-9-]/g,"");u.target.value=b;const L=document.getElementById("public-link-preview"),p=document.getElementById("slug-status");L&&(F!=null&&F.username)&&b?L.textContent=`academiqr.com/u/${F.username}/${b}`:L&&b&&(L.textContent=`academiqr.com/public.html?collection=${v.id.substring(0,8)}...`),p&&r&&b!==r?p.innerHTML='<span style="color:#dc2626;"><i class="fas fa-exclamation-triangle"></i> Changing this slug will break any QR codes or shared links that use the current short URL.</span>':p&&(p.textContent=""),r&&b!==r||ne.trigger()}),(m=document.getElementById("collection-slug"))==null||m.addEventListener("blur",()=>{var b;const u=((b=document.getElementById("collection-slug"))==null?void 0:b.value.trim().toLowerCase().replace(/[^a-z0-9-]/g,""))||"";if(r&&u!==r&&u)if(confirm(`You are changing this collection's URL slug.

Any QR codes or shared links using the short URL format will stop working.
(Note: QR codes using the legacy ?collection= format will still work.)

Continue?`))ne.trigger();else{document.getElementById("collection-slug").value=r;const p=document.getElementById("public-link-preview");p&&(F!=null&&F.username)&&r&&(p.textContent=`academiqr.com/u/${F.username}/${r}`);const _=document.getElementById("slug-status");_&&(_.textContent="")}}),(x=document.getElementById("collection-visibility"))==null||x.addEventListener("change",u=>{const b=document.getElementById("passkey-group");b&&(b.style.display=u.target.value==="passkey"?"block":"none"),ne.trigger()}),(w=document.getElementById("collection-passkey"))==null||w.addEventListener("input",()=>{ne.trigger()}),V){const u=V;(y=document.getElementById("delete-link-btn"))==null||y.addEventListener("click",()=>Kt(u)),["link-title","link-url","link-image"].forEach(p=>{var _;(_=document.getElementById(p))==null||_.addEventListener("input",()=>{Z.trigger()})});const b=document.getElementById("link-tags-display"),L=document.getElementById("link-tag-input-container");if(L){const p=A.find(_=>_.id===u);if(p){const _=p.tags||[];Ue(L,K,_,async S=>{p.tags=ze([...p.tags||[],S]),b&&(b.innerHTML=oe(p.tags,{removable:!0}),Se(b,p)),K.includes(S)||(K.push(S),K.sort(),Qe()),Z.trigger()}),Se(b,p)}}document.querySelectorAll('input[name="link-source-mode"]').forEach(p=>{p.addEventListener("change",_=>{const S=A.find(f=>f.id===u);if(!S)return;const g=_.target.value==="library";S.source_link_id?S.use_library_defaults=g:g?S.custom_overrides=null:S.custom_overrides={title:S.title||"",image_url:S.image_url||null,image_position:S.image_position||{x:50,y:50},image_scale:S.image_scale??100},Y(),W(),Q()})}),(T=document.getElementById("save-as-library-btn"))==null||T.addEventListener("click",()=>Jt(u)),($=document.getElementById("upload-image-btn"))==null||$.addEventListener("click",()=>{var p;(p=document.getElementById("link-image-file"))==null||p.click()}),(M=document.getElementById("link-image-file"))==null||M.addEventListener("change",Ot),(k=document.getElementById("browse-media-btn"))==null||k.addEventListener("click",()=>{Me(p=>{const _=document.getElementById("link-image");_&&(_.value=p);const S=A.find(g=>g.id===u);S&&(me(S)?S.custom_overrides.image_url=p:S.image_url=p,Q(),W(),Y(),Z.trigger())})}),["link-img-pos-x","link-img-pos-y","link-img-scale"].forEach(p=>{var _;(_=document.getElementById(p))==null||_.addEventListener("input",()=>{Gt(),Z.trigger()})})}Ke(e)}function $e(){var t,i,o,n,a,l;const e=v.presentation_data||{};e.title=((t=document.getElementById("info-title"))==null?void 0:t.value)||"",e.conference=((i=document.getElementById("info-conference"))==null?void 0:i.value)||"",e.location=((o=document.getElementById("info-location"))==null?void 0:o.value)||"",e.date=((n=document.getElementById("info-date"))==null?void 0:n.value)||"",e.displayTitle=((a=document.getElementById("display-title"))==null?void 0:a.checked)??!0,e.displayConference=((l=document.getElementById("display-conference"))==null?void 0:l.checked)??!0,v.presentation_data=e}function Nt(){const e=Ge(O.id,v.id,{username:F==null?void 0:F.username,slug:v.slug});navigator.clipboard.writeText(e).then(()=>{const t=document.getElementById("copy-link-btn");t&&(t.innerHTML='<i class="fas fa-check"></i>',setTimeout(()=>{t.innerHTML='<i class="fas fa-copy"></i>'},1500))}).catch(()=>{prompt("Copy this link:",e)})}async function Ot(e){var n;const t=(n=e.target.files)==null?void 0:n[0];if(!t)return;const i=document.getElementById("upload-image-btn"),o=i==null?void 0:i.innerHTML;try{i&&(i.disabled=!0,i.innerHTML='<i class="fas fa-spinner fa-spin"></i> Uploading...');const a=await Be(t,"links",O.id,{maxWidth:800,maxHeight:800}),l=document.getElementById("link-image");l&&(l.value=a);const s=A.find(r=>r.id===V);s&&(me(s)?s.custom_overrides.image_url=a:s.image_url=a,Q(),W(),Z.trigger())}catch(a){console.error("Image upload failed:",a),N("Image upload failed: "+a.message,"error")}finally{i&&(i.disabled=!1,i.innerHTML=o)}}function Gt(){var a,l,s;const e=A.find(r=>r.id===V);if(!e)return;const t=parseInt((a=document.getElementById("link-img-pos-x"))==null?void 0:a.value)||50,i=parseInt((l=document.getElementById("link-img-pos-y"))==null?void 0:l.value)||50,o=parseInt((s=document.getElementById("link-img-scale"))==null?void 0:s.value)||100;me(e)?(e.custom_overrides.image_position={x:t,y:i},e.custom_overrides.image_scale=o):(e.image_position={x:t,y:i},e.image_scale=o);const n=document.querySelector(".image-preview img");n&&(n.style.transform=Re(t,i,o)),Q()}function Ae(e){if(!e||typeof e=="object"&&Object.keys(e).length===0)return{...Mt};if(typeof e=="string")try{e=JSON.parse(e)}catch{return Ae(null)}const t=e.borderEnabled!==void 0?!!e.borderEnabled:e.gradientBorderEnabled!==void 0?!!e.gradientBorderEnabled:!0,i=[e.textColor,e.presentationTextColor,e.profileTextColor,e.presentationColor,e.profileColor].find(n=>typeof n=="string"&&n.length>0)||"#1A2F5B";return{backgroundType:e.backgroundType||"solid",backgroundColor:e.backgroundColor||"#ffffff",gradientText:e.gradientText||"",backgroundImage:e.backgroundImage||"",backgroundImageX:e.backgroundImageX??e.imagePositionX??50,backgroundImageY:e.backgroundImageY??e.imagePositionY??50,backgroundImageScale:e.backgroundImageScale??e.imageScale??100,profileTextColor:i,presentationTextColor:i,buttonTextColor:e.buttonTextColor||"#000000",buttonBackgroundColor:e.buttonBackgroundColor||e.buttonBgColor||"#1A2F5B",buttonStyle:e.buttonStyle||"soft",buttonBorderRadius:e.buttonBorderRadius||e.borderRadius||"8px",buttonPadding:e.buttonPadding||"12px 24px",buttonFontSize:e.buttonFontSize||"16px",buttonFontWeight:e.buttonFontWeight||"500",textFontSize:e.textFontSize||"18px",textFontWeight:e.textFontWeight||"600",borderEnabled:t,borderType:e.borderType||"solid",borderStyle:e.borderStyle==="fill"||e.borderStyle==="thin"?e.borderStyle:"fill",borderColor:e.borderColor||"#1A2F5B",borderWidth:e.borderWidth||"1px",borderGradient:e.borderGradient||e.borderGradientText||"",borderGradientAngle:e.borderGradientAngle||""}}const jt=["#ffffff","#e5e7eb","#9ca3af","#1f2937","#000000","#1A2F5B"],Oe=["linear-gradient(45deg, #ff6b6b, #4ecdc4)","linear-gradient(135deg, #1A2F5B, #3B5B8F)","linear-gradient(43deg, #D54070 0%, #8F4469 20%, #CA5699 40%, #59B8DA 60%, #9AD0DD 80%, #73B44A 100%)"];function se(e){return`<div class="color-presets">${jt.map(t=>`<button type="button" class="color-preset ${t===e?"active":""}" data-color="${t}" style="background:${t};${t==="#ffffff"?"border:1px solid #e5e7eb;":""}" title="${t}"></button>`).join("")}</div>`}function pe(e){var $,M,k,u,b,L,p,_,S;const t=Ae(v.theme),i=t.backgroundType,o=t.backgroundColor,n=t.gradientText||"linear-gradient(45deg, #ff6b6b 0%, #4ecdc4 100%)";t.profileTextColor;const a=t.presentationTextColor,l=t.buttonTextColor,s=t.buttonBackgroundColor,r=t.buttonStyle,c=t.borderEnabled,h=t.borderType,m=t.borderStyle,x=t.borderColor;t.borderWidth,t.buttonBorderRadius;const w=t.borderGradient,y=Xe;e.innerHTML=`
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
              ${se(o)}
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
                ${Oe.map((g,f)=>`
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
            ${se(a)}
          </div>
          <div class="form-group">
            <label>Button Text Color</label>
            <div class="color-input-row">
              <input type="color" id="theme-btn-text" value="${l}">
              <input type="text" id="theme-btn-text-val" value="${l}" class="color-text">
            </div>
            ${se(l)}
          </div>
          <div class="form-group">
            <label>Button Style</label>
            <select id="theme-button-style" class="form-select">
              <option value="soft" ${r==="soft"?"selected":""}>Soft Glass</option>
              <option value="solid" ${r==="solid"?"selected":""}>Solid</option>
              <option value="outline" ${r==="outline"?"selected":""}>Outline</option>
            </select>
          </div>
          <div class="form-group" id="btn-bg-group" style="display:${r==="solid"?"block":"none"}">
            <label>Button Background Color</label>
            <div class="color-input-row">
              <input type="color" id="theme-btn-bg" value="${s}">
              <input type="text" id="theme-btn-bg-val" value="${s}" class="color-text">
            </div>
            ${se(s)}
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
                ${se(x)}
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
                  ${Oe.map((g,f)=>`
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
          ${Ye}
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
  `,[["theme-bg-color","theme-bg-color-text"],["theme-presentation-text","theme-presentation-text-val"],["theme-btn-bg","theme-btn-bg-val"],["theme-btn-text","theme-btn-text-val"],["theme-border-color","theme-border-color-val"]].forEach(([g,f])=>{var H,R;(H=document.getElementById(g))==null||H.addEventListener("input",q=>{const B=document.getElementById(f);B&&(B.value=q.target.value),z()}),(R=document.getElementById(f))==null||R.addEventListener("input",q=>{const B=document.getElementById(g);B&&/^#[0-9a-fA-F]{6}$/.test(q.target.value)&&(B.value=q.target.value),z()})}),e.addEventListener("click",g=>{const f=g.target.closest(".color-preset");if(!f)return;const H=f.dataset.color,R=f.closest(".form-group"),q=R==null?void 0:R.querySelector('input[type="color"]'),B=R==null?void 0:R.querySelector(".color-text");q&&(q.value=H),B&&(B.value=H),R==null||R.querySelectorAll(".color-preset").forEach(d=>d.classList.remove("active")),f.classList.add("active"),z()}),e.querySelectorAll(".gradient-preset").forEach(g=>{g.addEventListener("click",()=>{const f=document.getElementById("theme-gradient"),H=document.getElementById("gradient-preview");f&&(f.value=g.dataset.gradient),H&&(H.style.background=g.dataset.gradient),z()})}),e.querySelectorAll(".border-gradient-preset").forEach(g=>{g.addEventListener("click",()=>{const f=document.getElementById("theme-border-gradient"),H=document.getElementById("border-gradient-preview");f&&(f.value=g.dataset.gradient),H&&(H.style.background=g.dataset.gradient),z()})}),e.querySelectorAll('input[name="bg-type"]').forEach(g=>{g.addEventListener("change",f=>{document.getElementById("bg-solid-group").style.display=f.target.value==="solid"?"block":"none",document.getElementById("bg-gradient-group").style.display=f.target.value==="gradient"?"block":"none",document.getElementById("bg-image-group").style.display=f.target.value==="image"?"block":"none",z()})}),($=document.getElementById("theme-button-style"))==null||$.addEventListener("change",g=>{const f=document.getElementById("btn-bg-group");f&&(f.style.display=g.target.value==="solid"?"block":"none"),z()}),(M=document.getElementById("theme-border-enabled"))==null||M.addEventListener("change",g=>{const f=document.getElementById("border-options");f&&(f.style.display=g.target.checked?"block":"none"),z()}),e.querySelectorAll('input[name="border-type"]').forEach(g=>{g.addEventListener("change",f=>{document.getElementById("border-solid-group").style.display=f.target.value==="solid"?"block":"none",document.getElementById("border-gradient-group").style.display=f.target.value==="gradient"?"block":"none",z()})}),(k=document.getElementById("theme-gradient"))==null||k.addEventListener("input",g=>{const f=document.getElementById("gradient-preview");f&&(f.style.background=g.target.value),z()}),(u=document.getElementById("theme-border-gradient"))==null||u.addEventListener("input",g=>{const f=document.getElementById("border-gradient-preview");f&&(f.style.background=g.target.value),z()}),["bg-pos-x","bg-pos-y","bg-pos-scale"].forEach(g=>{var f;(f=document.getElementById(g))==null||f.addEventListener("input",z)}),(b=document.getElementById("bg-upload-btn"))==null||b.addEventListener("click",()=>{var g;(g=document.getElementById("bg-image-file"))==null||g.click()}),(L=document.getElementById("bg-image-file"))==null||L.addEventListener("change",Vt),(p=document.getElementById("bg-browse-media-btn"))==null||p.addEventListener("click",()=>{Me(g=>{v._pendingBgImage=g,z(),pe(document.getElementById("tab-content"))})}),(_=document.getElementById("bg-image-remove"))==null||_.addEventListener("click",()=>{v._pendingBgImage=null,v.theme&&(v.theme.backgroundImage="");const g=document.querySelector('input[name="bg-type"][value="solid"]');g&&(g.checked=!0),z(),pe(document.getElementById("tab-content"))}),["theme-button-style"].forEach(g=>{var f;(f=document.getElementById(g))==null||f.addEventListener("change",z)}),e.querySelectorAll('input[name="border-style"]').forEach(g=>{g.addEventListener("change",z)}),Ke(e),(S=document.getElementById("save-new-theme-btn"))==null||S.addEventListener("click",ai),He()}async function Vt(e){var n;const t=(n=e.target.files)==null?void 0:n[0];if(!t)return;const i=document.getElementById("bg-upload-btn"),o=i==null?void 0:i.innerHTML;try{i&&(i.disabled=!0,i.innerHTML='<i class="fas fa-spinner fa-spin"></i> Uploading...');const a=await Be(t,"backgrounds",O.id,{maxWidth:1920,maxHeight:1920});v._pendingBgImage=a,z(),pe(document.getElementById("tab-content"))}catch(a){console.error("Background image upload failed:",a),N("Background image upload failed: "+a.message,"error")}finally{i&&(i.disabled=!1,i.innerHTML=o)}}function z(){const e=Pe(),t={...v.theme,...e};v._pendingBgImage&&(t.backgroundImage=v._pendingBgImage),Q(t),xe&&xe.trigger()}function Wt(e){qt(e,v,O)}function Xt(e){At(e,v,O)}function Q(e){const t=document.getElementById("phone-preview");if(!t)return;const i=Ae(e||v.theme),o=v.presentation_data||{},n=F||{},a=i.backgroundType;let l="";if(a==="gradient"&&i.gradientText)l=`background: ${i.gradientText};`;else if(a==="image"&&i.backgroundImage){const P=i.backgroundImageX,j=i.backgroundImageY,J=i.backgroundImageScale;l=`background: url('${i.backgroundImage}') ${P}% ${j}% / ${J}% no-repeat;`}else l=`background: ${i.backgroundColor};`;const s=i.presentationTextColor,r=s,c=i.buttonStyle,h=i.buttonBackgroundColor,m=i.buttonTextColor;i.buttonBorderRadius;const x=i.borderEnabled,w=i.borderType,y=i.borderStyle,T=i.borderColor,$=i.borderGradient,M=n.profile_photo||"";let k={scale:100,x:50,y:50};if(n.profile_photo_position)try{k=typeof n.profile_photo_position=="string"?JSON.parse(n.profile_photo_position):n.profile_photo_position}catch{}const u=(k.scale||100)/100,b=((k.x||50)-50)*-1,L=((k.y||50)-50)*-1,p=[{key:"social_email",icon:"fa-envelope",prefix:"mailto:",fab:!1},{key:"social_website",icon:"fa-globe",prefix:"",fab:!1},{key:"social_instagram",icon:"fa-instagram",prefix:"",fab:!0},{key:"social_facebook",icon:"fa-facebook",prefix:"",fab:!0},{key:"social_twitter",icon:"fa-x-twitter",prefix:"",fab:!0},{key:"social_linkedin",icon:"fa-linkedin",prefix:"",fab:!0},{key:"social_youtube",icon:"fa-youtube",prefix:"",fab:!0},{key:"social_tiktok",icon:"fa-tiktok",prefix:"",fab:!0},{key:"social_snapchat",icon:"fa-snapchat",prefix:"",fab:!0},{key:"social_google_scholar",icon:"fa-graduation-cap",prefix:"",fab:!1},{key:"social_orcid",icon:"fa-orcid",prefix:"",fab:!0},{key:"social_researchgate",icon:"fa-researchgate",prefix:"",fab:!0}],_=n.social_order;let S;if(_&&Array.isArray(_)){const P=[];for(const j of _){const J=p.find(Le=>Le.key===`social_${j}`);J&&P.push(J)}for(const j of p)P.includes(j)||P.push(j);S=P.filter(j=>{var J;return(J=n[j.key])==null?void 0:J.trim()})}else S=p.filter(P=>{var j;return(j=n[P.key])==null?void 0:j.trim()});const g=o.title||"Untitled",f=o.displayTitle!==!1,H=o.displayConference!==!1,R=o.conference||"",q=o.location||"",B=o.date?Yt(o.date):"",d=A.filter(P=>P.is_active!==!1);function E(){let P=`color: ${m}; border-radius: 8px; font-size: 1.14rem;`;return c==="solid"?P+=`background: ${h} !important; border-color: ${h} !important;`:c==="outline"?P+=`background: transparent !important; border: 2px solid ${m} !important; color: ${m} !important;`:P+=`color: ${m} !important;`,P}const D=t.closest(".phone-mockup")||t.parentElement;D&&(D.style.boxShadow="0 20px 40px rgba(0, 0, 0, 0.3)",D.style.padding="8px",x?w==="gradient"&&$?y==="thin"?(D.style.background=$,D.style.padding="8px",D.style.boxShadow="inset 0 0 0 3px transparent, 0 20px 40px rgba(0, 0, 0, 0.3)"):(D.style.background=$,D.style.padding="8px"):y==="thin"?(D.style.background="#1e293b",D.style.boxShadow=`inset 0 0 0 8px ${T}, 0 20px 40px rgba(0, 0, 0, 0.3)`):D.style.background=T:D.style.background="#1e293b");const ie=f&&g||H&&R||q||B;t.innerHTML=`
    <div class="phone-screen" style="${l}">
      <!-- Header content — wraps profile + presentation like v0.6.7 -->
      <div class="phone-header-content">
        <!-- Profile — avatar + name side by side -->
        <div class="phone-profile-section">
          ${M?`
            <div class="phone-avatar">
              <img src="${I(M)}" alt="Profile"
                   style="transform: translate(${b}%, ${L}%) scale(${u}) !important; transform-origin: center center !important;"
                   onerror="this.parentElement.style.display='none'">
            </div>
          `:""}
          <div class="phone-name-section">
            ${n.display_name?`<h4 class="phone-display-name" style="color: ${r};">${I(n.display_name)}</h4>`:""}
            ${S.length>0?`
              <div class="phone-socials">
                ${S.map(P=>`
                  <span class="phone-social-icon ${P.key}" title="${P.key.replace("social_","")}">
                    <i class="${P.fab?"fab":"fas"} ${P.icon}"></i>
                  </span>
                `).join("")}
              </div>
            `:""}
          </div>
        </div>

        <!-- Presentation Info -->
        ${ie?`
          <div class="phone-presentation" style="color: ${s};">
            ${f?`<div class="phone-info-field"><span class="phone-info-value">${I(g)}</span></div>`:""}
            ${H&&R?`<div class="phone-info-field"><span class="phone-info-value">${I(R)}</span></div>`:""}
            ${q?`<div class="phone-info-field"><span class="phone-info-value" style="font-size:0.9rem;">${I(q)}</span></div>`:""}
            ${B?`<div class="phone-info-field"><span class="phone-info-value" style="font-size:0.9rem;">${I(B)}</span></div>`:""}
          </div>
        `:""}
      </div>

      <!-- Links -->
      <div class="phone-links">
        ${d.length===0?`
          <p class="phone-empty" style="color: ${s};">No active links</p>
        `:d.map(P=>{const j=je(P),J=Ve(P),Le=Re(j.x,j.y,J),Fe=ke(P),tt=Te(P)||"Untitled";return`
            <div class="phone-link-btn ${c}" style="${E()}">
              ${Fe?`
                <div class="phone-link-image-wrapper">
                  <div class="phone-link-image">
                    <img src="${I(Fe)}" alt=""
                      style="transform: ${Le};"
                      onerror="this.parentElement.innerHTML='<i class=\\'fas fa-link\\' style=\\'color:#6b7280\\'></i>'">
                  </div>
                </div>
              `:""}
              <div class="phone-link-text">${I(tt)}</div>
            </div>
          `}).join("")}
      </div>

      <!-- Footer -->
      <div class="phone-footer" style="color: ${r};">
        <p class="phone-footer-text">Powered by <a href="https://academiqr.com" style="color: ${r};">AcademiQR.com</a></p>
      </div>
    </div>
  `}function Yt(e){try{return new Date(e+"T00:00:00").toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}catch{return e}}async function Jt(e){var r,c,h,m,x,w;if(!A.find(y=>y.id===e))return;const i=(r=document.getElementById("link-title"))==null?void 0:r.value.trim(),o=(c=document.getElementById("link-url"))==null?void 0:c.value.trim(),n=(h=document.getElementById("link-image"))==null?void 0:h.value.trim(),a=parseInt((m=document.getElementById("link-img-pos-x"))==null?void 0:m.value)||50,l=parseInt((x=document.getElementById("link-img-pos-y"))==null?void 0:x.value)||50,s=parseInt((w=document.getElementById("link-img-scale"))==null?void 0:w.value)||100;if(!i){N("Please enter a title.","warning");return}if(!o){N("Please enter a URL.","warning");return}try{const y=A.reduce((M,k)=>Math.max(M,k.order_index||0),0),{data:T,error:$}=await C.from("link_items").insert({list_id:v.id,title:i,url:o,image_url:n||null,image_position:{x:a,y:l},image_scale:s,order_index:y+100,is_active:!0}).select().single();if($)throw $;A.push(T),V=T.id,W(),Y(),Q(),te(),Je("save-as-library-btn")}catch(y){console.error("Failed to create library link:",y),N("Failed to create link: "+y.message,"error")}}async function Kt(e){const t=A.find(i=>i.id===e);if(!(!t||!confirm(`Delete "${t.title||"this link"}"?`)))try{const{error:i}=await C.from("link_items").delete().eq("id",e).eq("list_id",v.id);if(i)throw i;A=A.filter(o=>o.id!==e),V=null,W(),Y(),Q(),te()}catch(i){console.error("Failed to delete link:",i),N("Failed to delete: "+i.message,"error")}}async function Zt(e){const t=A.find(o=>o.id===e);if(!t)return;const i=t.is_active===!1;try{const{error:o}=await C.from("link_items").update({is_active:i}).eq("id",e);if(o)throw o;t.is_active=i,W(),Q()}catch(o){console.error("Failed to toggle link:",o)}}function ei(){const e=document.getElementById("new-link-modal");e&&(document.getElementById("new-link-title").value="",document.getElementById("new-link-url").value="",document.getElementById("new-link-image").value="",e.style.display="flex",document.getElementById("new-link-title").focus())}function ue(){const e=document.getElementById("new-link-modal");e&&(e.style.display="none")}async function ti(){var o,n,a;const e=(o=document.getElementById("new-link-title"))==null?void 0:o.value.trim(),t=(n=document.getElementById("new-link-url"))==null?void 0:n.value.trim(),i=(a=document.getElementById("new-link-image"))==null?void 0:a.value.trim();if(!e){N("Please enter a title.","warning");return}if(!t){N("Please enter a URL.","warning");return}try{const l=A.reduce((c,h)=>Math.max(c,h.order_index||0),0),{data:s,error:r}=await C.from("link_items").insert({list_id:v.id,title:e,url:t,image_url:i||null,order_index:l+100,is_active:!0}).select().single();if(r)throw r;A.push(s),V=s.id,ue(),W(),Y(),Q(),te()}catch(l){console.error("Failed to add link:",l),N("Failed to add link: "+l.message,"error")}}let fe=[];async function ii(){const e=document.getElementById("existing-link-modal");if(!e)return;e.style.display="flex";const t=document.getElementById("existing-links-list");t&&(t.innerHTML='<p class="existing-link-empty">Loading...</p>');try{const{data:i,error:o}=await C.from("link_items").select("*, link_lists!inner(id, slug, presentation_data, owner_id)").eq("link_lists.owner_id",O.id).neq("list_id",v.id).order("created_at",{ascending:!1});if(o)throw o;fe=i||[],Ze("")}catch(i){console.error("Failed to load links:",i),t&&(t.innerHTML='<p class="existing-link-empty">Failed to load links.</p>')}}function Ze(e){const t=document.getElementById("existing-links-list");if(!t)return;const i=e.toLowerCase(),o=i?fe.filter(n=>(n.title||"").toLowerCase().includes(i)||(n.url||"").toLowerCase().includes(i)):fe;if(o.length===0){t.innerHTML=`<p class="existing-link-empty">${i?"No matches found.":"No links in other collections."}</p>`;return}t.innerHTML=o.map(n=>{var l,s,r;const a=((s=(l=n.link_lists)==null?void 0:l.presentation_data)==null?void 0:s.title)||((r=n.link_lists)==null?void 0:r.slug)||"";return`
      <div class="existing-link-item" data-link-id="${n.id}">
        <div class="link-thumb">
          ${n.image_url?`<img src="${I(n.image_url)}" alt="" onerror="this.parentElement.innerHTML='<i class=\\'fas fa-link\\' style=\\'color:#9ca3af\\'></i>'">`:'<i class="fas fa-link" style="color:#9ca3af"></i>'}
        </div>
        <div class="link-info">
          <div class="link-title">${I(n.title||"Untitled")}</div>
          <div class="link-url">${I(et(n.url||""))}</div>
        </div>
        <span class="link-collection-name">${I(a)}</span>
      </div>
    `}).join(""),t.querySelectorAll(".existing-link-item").forEach(n=>{n.addEventListener("click",()=>oi(n.dataset.linkId))})}async function oi(e){const t=fe.find(i=>i.id===e);if(t)try{const i=A.reduce((a,l)=>Math.max(a,l.order_index||0),0),{data:o,error:n}=await C.from("link_items").insert({list_id:v.id,title:t.title,url:t.url,image_url:t.image_url,image_position:t.image_position||null,image_scale:t.image_scale||null,order_index:i+100,is_active:!0,source_link_id:e,use_library_defaults:!0}).select().single();if(n)throw n;o._resolved_title=t.title,o._resolved_image_url=t.image_url,o._resolved_image_position=t.image_position,o._resolved_image_scale=t.image_scale,A.push(o),V=o.id,ve(),W(),Y(),Q(),te()}catch(i){console.error("Failed to add existing link:",i),N("Failed to add link: "+i.message,"error")}}function ve(){const e=document.getElementById("existing-link-modal");e&&(e.style.display="none"),fe=[]}let ye=null;async function Me(e){ye=e;const t=document.getElementById("media-library-modal"),i=document.getElementById("media-library-content");if(!(!t||!i)){t.style.display="flex",i.innerHTML=`
    <div style="text-align:center; padding:32px; color:#9ca3af;">
      <i class="fas fa-spinner fa-spin" style="font-size:1.5rem;"></i>
      <p style="margin-top:12px;">Loading your images...</p>
    </div>
  `;try{const o=await ut(O.id);if(o.length===0){i.innerHTML=`
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
    `,i.querySelectorAll(".media-item").forEach(n=>{n.addEventListener("click",()=>{const a=n.dataset.url;ye&&ye(a),he()})})}catch(o){console.error("Failed to load media library:",o),i.innerHTML=`
      <div style="text-align:center; padding:32px; color:#ef4444;">
        <p>Failed to load images: ${I(o.message)}</p>
      </div>
    `}}}function he(){const e=document.getElementById("media-library-modal");e&&(e.style.display="none"),ye=null}let re=null;function ni(){const e=document.getElementById("links-list");e&&e.querySelectorAll(".link-item").forEach(t=>{t.setAttribute("draggable","true"),t.addEventListener("dragstart",i=>{re=parseInt(t.dataset.index),t.classList.add("dragging"),i.dataTransfer.effectAllowed="move"}),t.addEventListener("dragend",()=>{t.classList.remove("dragging"),e.querySelectorAll(".link-item").forEach(i=>i.classList.remove("drag-over")),re=null}),t.addEventListener("dragover",i=>{i.preventDefault(),i.dataTransfer.dropEffect="move",e.querySelectorAll(".link-item").forEach(o=>o.classList.remove("drag-over")),t.classList.add("drag-over")}),t.addEventListener("dragleave",()=>{t.classList.remove("drag-over")}),t.addEventListener("drop",async i=>{i.preventDefault();const o=parseInt(t.dataset.index);if(re===null||re===o)return;const[n]=A.splice(re,1);A.splice(o,0,n),A.forEach((a,l)=>{a.order_index=(l+1)*100}),W(),Q();try{await Promise.all(A.map(a=>C.from("link_items").update({order_index:a.order_index}).eq("id",a.id)))}catch(a){console.error("Failed to save order:",a)}})})}function Pe(){var s,r,c,h,m,x,w,y,T,$,M,k,u,b,L;const e=((s=document.querySelector('input[name="bg-type"]:checked'))==null?void 0:s.value)||"solid",t=((r=document.querySelector('input[name="border-type"]:checked'))==null?void 0:r.value)||"solid",i=((c=document.querySelector('input[name="border-style"]:checked'))==null?void 0:c.value)||"fill",o=((h=document.getElementById("theme-border-enabled"))==null?void 0:h.checked)||!1,n=((m=document.getElementById("theme-presentation-text"))==null?void 0:m.value)||"#1A2F5B",a=((x=document.getElementById("theme-btn-bg"))==null?void 0:x.value)||"#1A2F5B",l=((w=document.getElementById("theme-border-gradient"))==null?void 0:w.value)||"";return{backgroundType:e,backgroundColor:((y=document.getElementById("theme-bg-color"))==null?void 0:y.value)||"#ffffff",gradientText:((T=document.getElementById("theme-gradient"))==null?void 0:T.value)||"",backgroundImage:e==="image"&&(v._pendingBgImage||(v.theme||{}).backgroundImage)||"",backgroundImageX:parseInt(($=document.getElementById("bg-pos-x"))==null?void 0:$.value)||50,backgroundImageY:parseInt((M=document.getElementById("bg-pos-y"))==null?void 0:M.value)||50,backgroundImageScale:parseInt((k=document.getElementById("bg-pos-scale"))==null?void 0:k.value)||100,profileTextColor:n,presentationTextColor:n,textColor:n,presentationColor:n,profileColor:n,buttonBackgroundColor:a,buttonBgColor:a,buttonTextColor:((u=document.getElementById("theme-btn-text"))==null?void 0:u.value)||"#000000",buttonStyle:((b=document.getElementById("theme-button-style"))==null?void 0:b.value)||"soft",buttonBorderRadius:"8px",borderEnabled:o,gradientBorderEnabled:o,borderType:t,borderStyle:i,borderColor:((L=document.getElementById("theme-border-color"))==null?void 0:L.value)||"#1A2F5B",borderGradient:l,borderGradientText:l}}async function He(){const e=document.getElementById("saved-themes-list");if(e)try{const{data:t,error:i}=await C.from("user_themes").select("*").eq("user_id",O.id).eq("theme_type","appearance").order("created_at",{ascending:!1});if(i)throw i;if(!t||t.length===0){e.innerHTML='<p style="color:#9ca3af; font-size:0.875rem;">No saved themes yet.</p>';return}e.innerHTML=t.map(o=>`
      <div class="saved-theme-item" style="display:flex; justify-content:space-between; align-items:center; padding:8px 12px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; margin-bottom:8px;">
        <span style="font-size:0.875rem; font-weight:500; color:#1e293b;">${I(o.name||o.theme_name||"Unnamed")}</span>
        <div style="display:flex; gap:4px;">
          <button type="button" class="apply-theme-btn" data-theme-id="${o.id}" style="background:#1A2F5B; color:white; border:none; padding:4px 10px; border-radius:4px; font-size:0.75rem; cursor:pointer;">Apply</button>
          <button type="button" class="delete-theme-btn" data-theme-id="${o.id}" style="background:none; color:#ef4444; border:1px solid #ef4444; padding:4px 8px; border-radius:4px; font-size:0.75rem; cursor:pointer;"><i class="fas fa-trash"></i></button>
        </div>
      </div>
    `).join(""),e.querySelectorAll(".apply-theme-btn").forEach(o=>{o.addEventListener("click",async()=>{const n=t.find(a=>a.id===o.dataset.themeId);n&&n.theme_data&&(v.theme={...v.theme,...n.theme_data},Q(),pe(document.getElementById("tab-content")))})}),e.querySelectorAll(".delete-theme-btn").forEach(o=>{o.addEventListener("click",async()=>{const n=t.find(a=>a.id===o.dataset.themeId);if(!(!n||!confirm(`Delete theme "${n.name||n.theme_name}"?`)))try{const{error:a}=await C.from("user_themes").delete().eq("id",n.id).eq("user_id",O.id);if(a)throw a;He()}catch(a){console.error("Failed to delete theme:",a),N("Failed to delete: "+a.message,"error")}})})}catch(t){console.error("Failed to load themes:",t),e.innerHTML='<p style="color:#ef4444; font-size:0.875rem;">Failed to load themes.</p>'}}async function ai(){const e=document.getElementById("theme-name"),t=e==null?void 0:e.value.trim();if(!t){N("Please enter a theme name.","warning");return}try{const i=Pe(),{error:o}=await C.from("user_themes").insert({user_id:O.id,name:t,theme_type:"appearance",theme_data:i});if(o)throw o;e&&(e.value=""),He(),Je("save-new-theme-btn")}catch(i){console.error("Failed to save theme:",i),N("Failed to save theme: "+i.message,"error")}}function li(){var e,t,i,o,n,a,l,s,r,c,h,m,x,w;document.querySelectorAll(".tab").forEach(y=>{y.addEventListener("click",()=>{document.querySelectorAll(".tab").forEach(T=>T.classList.remove("active")),y.classList.add("active"),ge=y.dataset.tab,Y()})}),(e=document.getElementById("add-link-btn"))==null||e.addEventListener("click",ei),(t=document.getElementById("add-existing-btn"))==null||t.addEventListener("click",ii),(i=document.getElementById("new-link-modal-close"))==null||i.addEventListener("click",ue),(o=document.getElementById("new-link-cancel"))==null||o.addEventListener("click",ue),(n=document.getElementById("new-link-save"))==null||n.addEventListener("click",ti),(a=document.getElementById("new-link-modal"))==null||a.addEventListener("click",y=>{y.target.id==="new-link-modal"&&ue()}),(l=document.getElementById("new-link-upload-btn"))==null||l.addEventListener("click",()=>{var y;(y=document.getElementById("new-link-image-file"))==null||y.click()}),(s=document.getElementById("new-link-image-file"))==null||s.addEventListener("change",async y=>{var k;const T=(k=y.target.files)==null?void 0:k[0];if(!T)return;const $=document.getElementById("new-link-upload-btn"),M=$==null?void 0:$.innerHTML;try{$&&($.disabled=!0,$.innerHTML='<i class="fas fa-spinner fa-spin"></i>');const u=await Be(T,"links",O.id,{maxWidth:800,maxHeight:800});document.getElementById("new-link-image").value=u}catch(u){console.error("Upload failed:",u),N("Upload failed: "+u.message,"error")}finally{$&&($.disabled=!1,$.innerHTML=M)}}),(r=document.getElementById("new-link-browse-btn"))==null||r.addEventListener("click",()=>{Me(y=>{document.getElementById("new-link-image").value=y})}),(c=document.getElementById("existing-link-modal-close"))==null||c.addEventListener("click",ve),(h=document.getElementById("existing-link-modal"))==null||h.addEventListener("click",y=>{y.target.id==="existing-link-modal"&&ve()}),(m=document.getElementById("existing-link-search"))==null||m.addEventListener("input",y=>{Ze(y.target.value)}),(x=document.getElementById("media-library-close"))==null||x.addEventListener("click",he),(w=document.getElementById("media-library-modal"))==null||w.addEventListener("click",y=>{y.target.id==="media-library-modal"&&he()}),document.addEventListener("keydown",y=>{y.key==="Escape"&&(ue(),ve(),he())})}function I(e){const t=document.createElement("div");return t.textContent=e,t.innerHTML}function et(e){try{const t=new URL(e),i=t.pathname.length>30?t.pathname.substring(0,30)+"...":t.pathname;return t.hostname+i}catch{return e.length>50?e.substring(0,50)+"...":e}}function Se(e,t){!e||!t||e.querySelectorAll(".tag-remove").forEach(i=>{i.addEventListener("click",o=>{o.stopPropagation();const n=i.dataset.tag;t.tags=(t.tags||[]).filter(a=>a!==n),e.innerHTML=oe(t.tags,{removable:!0}),Se(e,t),Z.trigger()})})}function Ie(e){e&&e.querySelectorAll(".tag-remove").forEach(t=>{t.addEventListener("click",i=>{i.stopPropagation();const o=t.dataset.tag,n=v.presentation_data||{};n.tags=(n.tags||[]).filter(a=>a!==o),v.presentation_data=n,ae.trigger(),e.innerHTML=oe(n.tags,{removable:!0}),Ie(e)})})}function si(){if(window.innerWidth>768)return;const e=document.createElement("div");e.className="mobile-tab-bar",e.innerHTML=`
    <button class="mobile-tab-btn ${ge==="details"?"active":""}" data-tab="details">
      <i class="fas fa-file-alt"></i><span>Details</span>
    </button>
    <button class="mobile-tab-btn ${ge==="appearance"?"active":""}" data-tab="appearance">
      <i class="fas fa-palette"></i><span>Theme</span>
    </button>
    <button class="mobile-tab-btn" data-tab="qr-code">
      <i class="fas fa-qrcode"></i><span>QR</span>
    </button>
    <button class="mobile-tab-btn" data-tab="analytics">
      <i class="fas fa-chart-bar"></i><span>Analytics</span>
    </button>
  `,document.body.appendChild(e),e.querySelectorAll(".mobile-tab-btn").forEach(i=>{i.addEventListener("click",()=>{e.querySelectorAll(".mobile-tab-btn").forEach(o=>o.classList.remove("active")),i.classList.add("active"),ge=i.dataset.tab,Y()})});const t=document.createElement("button");t.className="preview-fab",t.innerHTML='<i class="fas fa-eye"></i>',t.title="Preview",document.body.appendChild(t),t.addEventListener("click",()=>{const i=document.createElement("div");i.className="preview-overlay",i.innerHTML=`
      <button class="preview-overlay-close"><i class="fas fa-times"></i></button>
      <div class="editor-preview-mockup" id="mobile-preview-mockup"></div>
    `,document.body.appendChild(i);const o=document.getElementById("mobile-preview-mockup"),n=document.getElementById("phone-preview");n&&o&&(o.innerHTML=n.innerHTML,o.style.cssText=n.style.cssText),i.querySelector(".preview-overlay-close").addEventListener("click",()=>i.remove()),i.addEventListener("click",a=>{a.target===i&&i.remove()})})}Pt();

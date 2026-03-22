import{s as B}from"./supabase-whCCoo43.js";/* empty css             */import{c as Ne,a as et,d as tt,e as Pe,s as O,b as it,n as ot}from"./toast-C5Ve3yOU.js";import{c as le,r as se,f as nt}from"./auto-save-CVe8WLcj.js";import{h as ce,r as at,g as ve,a as $e,b as Qe,c as Oe}from"./link-utils-D1VnX3pm.js";import{i as lt,g as st,t as rt}from"./theme-toggle-yIlytQ8Y.js";import{c as Ie,l as dt}from"./image-utils-gR03vQbS.js";import{g as ct,r as ee,c as He,n as De,i as Fe}from"./tag-utils-CwIXpYMv.js";const ut="https://natzpfyxpuycsuuzbqrd.supabase.co/storage/v1/object/public/assets/AcademiQR_logo_Dark.png",K=250,W=16,F=8;let ye=null,Q=null;function Ge(e){const t=document.createElement("div");return t.textContent=e,t.innerHTML}function _e(e,t,i,o,n,a){e.beginPath(),e.moveTo(t+a,i),e.lineTo(t+o-a,i),e.arcTo(t+o,i,t+o,i+a,a),e.lineTo(t+o,i+n-a),e.arcTo(t+o,i+n,t+o-a,i+n,a),e.lineTo(t+a,i+n),e.arcTo(t,i+n,t,i+n-a,a),e.lineTo(t,i+a),e.arcTo(t,i,t+a,i,a),e.closePath()}function ke(e){var i,o,n,a,l,r;const t=d=>e.querySelector(`#${d}`);return{color:((i=t("qr-color"))==null?void 0:i.value)||"#1A2F5B",bgColor:((o=t("qr-bg-color"))==null?void 0:o.value)||"#ffffff",borderEnabled:((n=t("qr-border-enabled"))==null?void 0:n.checked)||!1,borderColor:((a=t("qr-border-color"))==null?void 0:a.value)||"#000000",borderStyle:((l=t("qr-border-style"))==null?void 0:l.value)||"solid",borderRadius:parseInt(((r=t("qr-border-radius"))==null?void 0:r.value)||"16"),logo:Q}}function gt(e,t){const i=t.borderEnabled?F:0,o=t.borderEnabled?t.borderRadius:16,n=document.createElement("canvas");n.width=K,n.height=K;const a=n.getContext("2d");if(a.clearRect(0,0,K,K),a.fillStyle=t.bgColor,_e(a,i,i,e.width+W*2,e.height+W*2,o),a.fill(),t.borderEnabled){if(a.strokeStyle=t.borderColor,a.lineWidth=F,t.borderStyle==="dashed")a.setLineDash([F*2,F]);else if(t.borderStyle==="dotted")a.setLineDash([F,F]);else if(t.borderStyle==="double"){a.lineWidth=F/3;const d=F/2,c=F/2,v=e.width+W*2+F,E=e.height+W*2+F;a.strokeRect(d,c,v,E),a.strokeRect(d+F,c+F,v-F*2,E-F*2)}if(t.borderStyle!=="double"){const d=F/2,c=F/2,v=e.width+W*2+F,E=e.height+W*2+F;o>0?(_e(a,d,c,v,E,o),a.stroke()):a.strokeRect(d,c,v,E)}a.setLineDash([])}const l=i+W,r=i+W;return a.save(),_e(a,i,i,e.width+W*2,e.height+W*2,o),a.clip(),a.drawImage(e,l,r),a.restore(),{canvas:n,ctx:a,qrX:l,qrY:r,qrSize:e.width}}function mt(e,t,i,o,n){return new Promise(a=>{if(!t){a();return}const l=new Image;l.crossOrigin="anonymous",l.onload=()=>{const r=n*.2;let d=l.width,c=l.height;if(d>r||c>r){const f=Math.min(r/d,r/c);d*=f,c*=f}const v=i+(n-d)/2,E=o+(n-c)/2;e.fillStyle="#ffffff",e.beginPath(),e.arc(i+n/2,o+n/2,Math.max(d,c)/2+8,0,Math.PI*2),e.fill(),e.drawImage(l,v,E,d,c),a()},l.onerror=()=>a(),l.src=t})}async function oe(e,t){if(typeof QRCode>"u"){console.error("[QR] QRCode.js library not loaded");return}const i=ke(e),o=e.querySelector("#qr-code-container");if(!o)return;ye=null,o.innerHTML="",o.style.cssText="background:transparent; padding:0; display:flex; align-items:center; justify-content:center; width:250px; height:250px; margin:0 auto; box-sizing:border-box; border:none; border-radius:0; overflow:visible;";const n=i.borderEnabled?F:0,a=K-n*2-W*2,l=document.createElement("div");l.style.cssText="position:absolute; left:-9999px; top:-9999px;",document.body.appendChild(l);try{ye=new QRCode(l,{text:t,width:a,height:a,colorDark:i.color,colorLight:i.bgColor,correctLevel:QRCode.CorrectLevel.H})}catch(L){console.error("[QR] Generation failed:",L),o.innerHTML='<p style="color:#ef4444; font-size:0.8rem;">QR generation failed</p>',document.body.removeChild(l);return}await new Promise(L=>setTimeout(L,100));const r=l.querySelector("canvas");if(!r){document.body.removeChild(l);return}const{canvas:d,ctx:c,qrX:v,qrY:E,qrSize:f}=gt(r,i);await mt(c,Q,v,E,f);const w=document.createElement("img");w.src=d.toDataURL("image/png");const y=i.borderEnabled?i.borderRadius:16;w.style.cssText=`width:${K}px; height:${K}px; display:block; margin:0 auto; border-radius:${y}px; background:transparent;`,w.alt="QR Code",w.title="Right-click to copy image",w.setAttribute("data-composite","true"),o.innerHTML="",o.appendChild(w),o._compositeCanvas=d,document.body.removeChild(l);const T=e.querySelector("#qr-actions");T&&(T.style.display="flex")}function pt(e,t,i){const o=e.querySelector("#qr-code-container");if(!o||!ye)return;const n=o.querySelector('img[data-composite="true"]');if(!n)return;const a=`${i||"qrcode"}-qrcode`;if(t==="png"||t==="jpeg"){const l=new Image;l.onload=()=>{const r=document.createElement("canvas");r.width=l.width,r.height=l.height;const d=r.getContext("2d");t==="jpeg"&&(d.fillStyle="#ffffff",d.fillRect(0,0,r.width,r.height)),d.drawImage(l,0,0);const c=document.createElement("a");c.download=`${a}.${t==="jpeg"?"jpg":"png"}`,c.href=r.toDataURL(t==="jpeg"?"image/jpeg":"image/png",.95),c.click()},l.src=n.src}else if(t==="svg"){const l=new Image;l.onload=()=>{const r=document.createElement("canvas");r.width=l.width,r.height=l.height,r.getContext("2d").drawImage(l,0,0);const c=r.toDataURL("image/png"),v=`<svg xmlns="http://www.w3.org/2000/svg" width="${r.width}" height="${r.height}" viewBox="0 0 ${r.width} ${r.height}"><image href="${c}" width="${r.width}" height="${r.height}"/></svg>`,E=new Blob([v],{type:"image/svg+xml"}),f=document.createElement("a");f.download=`${a}.svg`,f.href=URL.createObjectURL(E),f.click(),URL.revokeObjectURL(f.href)},l.src=n.src}}async function ft(e,t){const i=ke(t),o={color:i.color,bgColor:i.bgColor,borderEnabled:i.borderEnabled,borderColor:i.borderColor,borderStyle:i.borderStyle,borderRadius:String(i.borderRadius),logo:Q},{error:n}=await B.from("link_lists").update({qr_code_data:o,updated_at:new Date().toISOString()}).eq("id",e);return!n}async function Se(e,t){const i=e.querySelector("#saved-qr-themes-list");if(!i)return;const{data:o,error:n}=await B.from("user_themes").select("*").eq("user_id",t).eq("theme_type","qr").order("created_at",{ascending:!1});if(n||!o||o.length===0){i.innerHTML='<p class="qr-themes-empty">No saved QR themes yet</p>';return}i.innerHTML=o.map(a=>{const l=Ge(a.name);return`
      <div class="saved-theme-item" data-theme-id="${a.id}" data-theme-name="${l}">
        <div class="saved-theme-name">${l}</div>
        <button class="btn-icon qr-theme-delete" data-theme-id="${a.id}" data-theme-name="${l}" title="Delete"><i class="fas fa-trash"></i></button>
      </div>
    `}).join("")}async function bt(e,t,i){var d;const o=e.querySelector("#qr-theme-name"),n=(d=o==null?void 0:o.value)==null?void 0:d.trim();if(!n){alert("Please enter a QR theme name");return}const a=ke(e),l={name:n,color:a.color,bgColor:a.bgColor,borderEnabled:a.borderEnabled,borderColor:a.borderColor,borderStyle:a.borderStyle,borderRadius:String(a.borderRadius),logo:Q},{data:r}=await B.from("user_themes").select("id").eq("user_id",t).eq("name",n).eq("theme_type","qr").maybeSingle();if(r){if(!confirm(`QR Theme "${n}" already exists. Overwrite?`))return;await B.from("user_themes").update({theme_data:l,updated_at:new Date().toISOString()}).eq("id",r.id)}else await B.from("user_themes").insert({user_id:t,name:n,theme_type:"qr",theme_data:l});o.value="",await Se(e,t)}async function vt(e,t,i,o){confirm(`Delete QR Theme "${o}"?`)&&(await B.from("user_themes").delete().eq("id",i).eq("user_id",t),await Se(e,t))}function yt(e,t,i){const o=n=>e.querySelector(`#${n}`);if(i.color&&(o("qr-color")&&(o("qr-color").value=i.color),o("qr-color-text")&&(o("qr-color-text").value=i.color)),i.bgColor&&(o("qr-bg-color")&&(o("qr-bg-color").value=i.bgColor),o("qr-bg-color-text")&&(o("qr-bg-color-text").value=i.bgColor)),i.borderEnabled!==void 0){o("qr-border-enabled")&&(o("qr-border-enabled").checked=i.borderEnabled);const n=o("qr-border-options");n&&(n.style.display=i.borderEnabled?"block":"none")}i.borderColor&&(o("qr-border-color")&&(o("qr-border-color").value=i.borderColor),o("qr-border-color-text")&&(o("qr-border-color-text").value=i.borderColor)),i.borderStyle&&o("qr-border-style")&&(o("qr-border-style").value=i.borderStyle),i.borderRadius&&o("qr-border-radius")&&(o("qr-border-radius").value=i.borderRadius),i.logo?Q=i.logo:Q=null,Ee(e),oe(e,t)}function ht(e,t,i){var a;const o=(a=i.target.files)==null?void 0:a[0];if(!o)return;if(o.size>5*1024*1024){alert("Logo must be under 5 MB"),i.target.value="";return}const n=new FileReader;n.onload=l=>{Q=l.target.result,Ee(e),oe(e,t)},n.readAsDataURL(o)}function kt(e,t){Q=null,Ee(e);const i=e.querySelector("#qr-logo-upload");i&&(i.value=""),oe(e,t)}function Et(e,t){Q=ut,Ee(e),oe(e,t)}function Ee(e){const t=e.querySelector("#qr-logo-preview"),i=e.querySelector("#qr-logo-img");Q?(i&&(i.src=Q),t&&(t.style.display="inline-block")):(t&&(t.style.display="none"),i&&(i.src=""))}function xt(e,t,i){const o=e.querySelector(`#${t}`),n=e.querySelector(`#${i}`);o&&n&&(n.value=o.value)}function _t(e,t,i){const o=e.querySelector(`#${t}`),n=e.querySelector(`#${i}`);o&&n&&/^#[0-9a-fA-F]{6}$/.test(o.value)&&(n.value=o.value)}function wt(e,t,i){var y,T,L,P,x,u,b,q,h,k,I,g,p,H,R,$,A;if(!t||!i){e.innerHTML='<div class="qr-tab"><p>Please select a collection first.</p></div>';return}const o=Ne(i.id,t.id),n=t.qr_code_data||{};ye=null,Q=n.logo||null;const a=n.color||"#1A2F5B",l=n.bgColor||"#ffffff",r=n.borderEnabled===!0||n.borderEnabled==="true",d=n.borderColor||"#000000",c=n.borderStyle||"solid",v=String(n.borderRadius||"16");e.innerHTML=`
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
                    <option value="16" ${v==="16"?"selected":""}>Rounded</option>
                    <option value="0" ${v==="0"?"selected":""}>Square</option>
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
            <div id="qr-logo-preview" class="qr-logo-preview" style="display: ${Q?"inline-block":"none"};">
              <img id="qr-logo-img" src="${Q||""}" alt="Logo">
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
  `;const E=()=>oe(e,o);(y=e.querySelector("#qr-copy-url"))==null||y.addEventListener("click",()=>{navigator.clipboard.writeText(o).then(()=>{const s=e.querySelector("#qr-copy-url");s&&(s.innerHTML='<i class="fas fa-check"></i>',setTimeout(()=>s.innerHTML='<i class="fas fa-copy"></i>',1500))})});for(const s of["qr-color","qr-bg-color","qr-border-color"])(T=e.querySelector(`#${s}`))==null||T.addEventListener("input",()=>{xt(e,s,s+"-text"),E()});for(const[s,_]of[["qr-color-text","qr-color"],["qr-bg-color-text","qr-bg-color"],["qr-border-color-text","qr-border-color"]])(L=e.querySelector(`#${s}`))==null||L.addEventListener("input",()=>{_t(e,s,_),E()});(P=e.querySelector("#qr-border-enabled"))==null||P.addEventListener("change",s=>{const _=e.querySelector("#qr-border-options");_&&(_.style.display=s.target.checked?"block":"none"),E()});for(const s of["qr-border-style","qr-border-radius"])(x=e.querySelector(`#${s}`))==null||x.addEventListener("change",E);const f=le(async()=>{const s=await ft(t.id,e);if(s){const _=ke(e);t.qr_code_data={color:_.color,bgColor:_.bgColor,borderEnabled:_.borderEnabled,borderColor:_.borderColor,borderStyle:_.borderStyle,borderRadius:String(_.borderRadius),logo:Q}}return s},{statusSelector:"#qr-save-status"});se(f);const w=()=>f.trigger();for(const s of["qr-color","qr-bg-color","qr-border-color"])(u=e.querySelector(`#${s}`))==null||u.addEventListener("input",w);for(const s of["qr-color-text","qr-bg-color-text","qr-border-color-text"])(b=e.querySelector(`#${s}`))==null||b.addEventListener("input",w);(q=e.querySelector("#qr-border-enabled"))==null||q.addEventListener("change",w);for(const s of["qr-border-style","qr-border-radius"])(h=e.querySelector(`#${s}`))==null||h.addEventListener("change",w);(k=e.querySelector("#qr-logo-upload-btn"))==null||k.addEventListener("click",()=>{var s;(s=e.querySelector("#qr-logo-upload"))==null||s.click()}),(I=e.querySelector("#qr-logo-upload"))==null||I.addEventListener("change",s=>{ht(e,o,s),w()}),(g=e.querySelector("#qr-logo-default-btn"))==null||g.addEventListener("click",()=>{Et(e,o),w()}),(p=e.querySelector("#qr-logo-remove"))==null||p.addEventListener("click",()=>{kt(e,o),w()}),(H=e.querySelector("#qr-actions"))==null||H.addEventListener("click",s=>{const _=s.target.closest("button[data-format]");_&&pt(e,_.dataset.format,t.slug)}),(R=e.querySelector("#qr-theme-toggle"))==null||R.addEventListener("click",()=>{const s=e.querySelector("#qr-theme-content"),_=e.querySelector("#qr-theme-toggle .section-chevron");if(s){const M=s.style.display!=="none";s.style.display=M?"none":"block",_&&_.classList.toggle("collapsed",M)}}),($=e.querySelector("#qr-theme-save-btn"))==null||$.addEventListener("click",()=>{bt(e,i.id)}),(A=e.querySelector("#saved-qr-themes-list"))==null||A.addEventListener("click",async s=>{const _=s.target.closest(".qr-theme-delete");if(_){s.stopPropagation(),await vt(e,i.id,_.dataset.themeId,_.dataset.themeName);return}const M=s.target.closest(".saved-theme-item");if(M){const{data:j}=await B.from("user_themes").select("theme_data").eq("id",M.dataset.themeId).single();j!=null&&j.theme_data&&yt(e,o,j.theme_data)}}),oe(e,o),Se(e,i.id)}function me(e){const t=document.createElement("div");return t.textContent=e,t.innerHTML}const Lt={instagram:"Instagram",facebook:"Facebook",twitter:"X (Twitter)",linkedin:"LinkedIn",youtube:"YouTube",tiktok:"TikTok",snapchat:"Snapchat",email:"Email"};function qt(){const e=new Date,t=new Date;return t.setDate(t.getDate()-30),{from:t.toISOString().slice(0,10),to:e.toISOString().slice(0,10)}}function Ue(e,t=!1){const[i,o,n]=e.split("-").map(Number);return t?new Date(i,o-1,n,23,59,59,999).toISOString():new Date(i,o-1,n,0,0,0,0).toISOString()}async function $t(e,t,i,o){var $,A;const n=i?Ue(i):null,a=o?Ue(o,!0):null;function l(s,_){return n&&(s=s.gte(_,n)),a&&(s=s.lte(_,a)),s}let r=B.from("link_clicks").select("*",{count:"exact",head:!0}).eq("owner_id",e).eq("list_id",t).not("link_id","is",null);r=l(r,"clicked_at");const{count:d}=await r;let c=B.from("page_views").select("*",{count:"exact",head:!0}).eq("owner_id",e).eq("list_id",t);c=l(c,"viewed_at");const{count:v}=await c;let E=B.from("page_views").select("session_id").eq("owner_id",e).eq("list_id",t);E=l(E,"viewed_at");const{data:f}=await E,w=f?new Set(f.map(s=>s.session_id).filter(Boolean)).size:0;let y=B.from("link_clicks").select("link_id, link_items:link_id (title, url)").eq("owner_id",e).eq("list_id",t).not("link_id","is",null);y=l(y,"clicked_at");const{data:T}=await y,L={};if(T)for(const s of T)L[s.link_id]||(L[s.link_id]={title:(($=s.link_items)==null?void 0:$.title)||"Unknown Link",url:((A=s.link_items)==null?void 0:A.url)||"",clicks:0}),L[s.link_id].clicks++;const P=Object.values(L).sort((s,_)=>_.clicks-s.clicks);let x=B.from("link_clicks").select("social_platform").eq("owner_id",e).eq("list_id",t);x=l(x,"clicked_at");const{data:u}=await x,b={};if(u)for(const s of u){if(!s.social_platform)continue;const _=s.social_platform.toLowerCase();b[_]||(b[_]={platform:_,clicks:0}),b[_].clicks++}const q=Object.values(b).sort((s,_)=>_.clicks-s.clicks),h=q.reduce((s,_)=>s+_.clicks,0);let k=B.from("page_views").select("viewed_at").eq("owner_id",e).eq("list_id",t);k=l(k,"viewed_at");const{data:I}=await k,g={};if(I)for(const s of I){const _=(s.viewed_at||s.created_at||"").substring(0,10);_&&(g[_]=(g[_]||0)+1)}let p=B.from("link_clicks").select("clicked_at").eq("owner_id",e).eq("list_id",t).not("link_id","is",null);p=l(p,"clicked_at");const{data:H}=await p,R={};if(H)for(const s of H){const _=(s.clicked_at||s.created_at||"").substring(0,10);_&&(R[_]=(R[_]||0)+1)}return{totalClicks:d||0,totalViews:v||0,uniqueVisitors:w,totalSocialClicks:h,linkBreakdown:P,socialBreakdown:q,dailyViews:g,dailyClicks:R}}function It(e,t){const i=e.querySelector("#links-breakdown-list");if(!i)return;if(!t||t.length===0){i.innerHTML='<p class="analytics-empty"><i class="fas fa-chart-bar" style="opacity:0.3; font-size:1.5rem; display:block; margin-bottom:8px;"></i>No link clicks yet. Share your collection to start seeing analytics.</p>';return}const o=Math.max(...t.map(n=>n.clicks));i.innerHTML=t.map(n=>{const a=o>0?n.clicks/o*100:0,l=n.url.length>50?n.url.substring(0,50)+"...":n.url;return`
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
    `}).join("")}}function Tt(e,t){const i=(o,n)=>{const a=e.querySelector(`#${o}`);a&&(a.textContent=n)};i("stat-total-views",t.totalViews),i("stat-link-clicks",t.totalClicks),i("stat-social-clicks",t.totalSocialClicks),i("stat-unique-visitors",t.uniqueVisitors)}function Bt(e,t,i,o,n){const a=e.querySelector("#analytics-chart");if(!a)return;const l=a.getContext("2d"),r=window.devicePixelRatio||1,c=a.parentElement.getBoundingClientRect().width||600,v=200;a.width=c*r,a.height=v*r,a.style.width=c+"px",a.style.height=v+"px",l.scale(r,r);const E=new Date(o||Date.now()-30*864e5),f=new Date(n||Date.now()),w=[],y=new Date(E);for(;y<=f;)w.push(y.toISOString().substring(0,10)),y.setDate(y.getDate()+1);if(w.length===0)return;const T=w.map($=>t[$]||0),L=w.map($=>i[$]||0),P=Math.max(...T,...L,1),x={top:20,right:16,bottom:32,left:40},u=c-x.left-x.right,b=v-x.top-x.bottom,q=document.documentElement.getAttribute("data-theme")==="dark",h=q?"rgba(255,255,255,0.1)":"#e2e8f0",k="#94a3b8",I=q?"rgba(147, 197, 253, 1)":"rgba(26, 47, 91, 1)",g=q?"rgba(74, 222, 128, 1)":"rgba(34, 197, 94, 1)",p=q?"#cbd5e1":void 0;l.clearRect(0,0,c,v),l.strokeStyle=h,l.lineWidth=.5;for(let $=0;$<=4;$++){const A=x.top+b/4*$;l.beginPath(),l.moveTo(x.left,A),l.lineTo(c-x.right,A),l.stroke()}l.fillStyle=k,l.font="10px Inter, sans-serif",l.textAlign="right";for(let $=0;$<=4;$++){const A=Math.round(P*(4-$)/4),s=x.top+b/4*$+3;l.fillText(A.toString(),x.left-6,s)}l.textAlign="center";const H=Math.max(1,Math.floor(w.length/6));for(let $=0;$<w.length;$+=H){const A=x.left+u/(w.length-1||1)*$,s=w[$].split("-");l.fillText(`${s[1]}/${s[2]}`,A,v-8)}function R($,A){if(!($.length<2)){l.strokeStyle=A,l.lineWidth=2,l.lineJoin="round",l.beginPath();for(let s=0;s<$.length;s++){const _=x.left+u/($.length-1||1)*s,M=x.top+b-$[s]/P*b;s===0?l.moveTo(_,M):l.lineTo(_,M)}l.stroke(),l.lineTo(x.left+u,x.top+b),l.lineTo(x.left,x.top+b),l.closePath(),l.fillStyle=A.replace("1)",q?"0.15)":"0.08)"),l.fill()}}R(T,I),R(L,g),l.font="11px Inter, sans-serif",l.fillStyle=I,l.fillRect(x.left,4,12,3),l.fillStyle=p||I,l.fillText("Views",x.left+40,10),l.fillStyle=g,l.fillRect(x.left+80,4,12,3),l.fillStyle=p||g,l.fillText("Clicks",x.left+120,10)}function Ct(e,t,i){var a,l;if(!t||!i){e.innerHTML='<div class="analytics-tab"><p>Please select a collection first.</p></div>';return}const o=qt();e.innerHTML=`
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
  `;const n=async()=>{var v,E;const r=((v=e.querySelector("#analytics-date-from"))==null?void 0:v.value)||"",d=((E=e.querySelector("#analytics-date-to"))==null?void 0:E.value)||"",c=e.querySelector("#analytics-refresh");c&&(c.disabled=!0,c.innerHTML='<i class="fas fa-spinner fa-spin"></i> Loading...');try{const f=await $t(i.id,t.id,r,d);Tt(e,f),Bt(e,f.dailyViews,f.dailyClicks,r,d),It(e,f.linkBreakdown),St(e,f.socialBreakdown)}catch(f){console.error("[Analytics] Failed to load:",f)}c&&(c.disabled=!1,c.innerHTML='<i class="fas fa-sync-alt"></i> Apply')};(a=e.querySelector("#analytics-refresh"))==null||a.addEventListener("click",n);for(const[r,d]of[["chart-toggle","chart-content"],["links-breakdown-toggle","links-breakdown-content"],["social-breakdown-toggle","social-breakdown-content"]])(l=e.querySelector(`#${r}`))==null||l.addEventListener("click",()=>{const c=e.querySelector(`#${d}`),v=e.querySelector(`#${r} .section-chevron`);if(c){const E=c.style.display!=="none";c.style.display=E?"none":"block",v&&v.classList.toggle("collapsed",E)}});n()}let N=null,m=null,D=null,C=[],G=null,de="details",Y=[],ie=null,te=null,J=null,he=null;const je='<svg class="section-chevron" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>',Ve='<svg class="section-chevron collapsed" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>',Rt={backgroundType:"solid",backgroundColor:"#ffffff",gradientText:"",backgroundImage:"",backgroundImageX:50,backgroundImageY:50,backgroundImageScale:100,profileTextColor:"#1A2F5B",presentationTextColor:"#1A2F5B",buttonTextColor:"#000000",buttonBackgroundColor:"#1A2F5B",buttonStyle:"soft",buttonBorderRadius:"8px",buttonPadding:"12px 24px",buttonFontSize:"16px",buttonFontWeight:"500",textFontSize:"18px",textFontWeight:"600",borderEnabled:!0,borderType:"gradient",borderStyle:"thin",borderColor:"#1A2F5B",borderWidth:"1px",borderGradient:"linear-gradient(186deg, #D54070 0%, #8F4469 20%, #CA5699 40%, #59B8DA 60%, #9AD0DD 80%, #73B44A 100%)"};function We(e){const t=document.getElementById(e);if(!t)return;const i=t.textContent;t.textContent="✓ Saved",setTimeout(()=>{t.textContent=i},1500)}function Te(e=50,t=50,i=100){return`translate(${(e-50)*.6}%, ${(t-50)*.6}%) scale(${i/100})`}function Xe(e){e.querySelectorAll(".section-header").forEach(t=>{t.addEventListener("click",()=>{const i=t.dataset.section,o=document.getElementById(i),n=t.querySelector(".section-chevron");o&&n&&(o.classList.toggle("collapsed"),n.classList.toggle("collapsed"))})})}async function At(){var t,i;if(N=await et(),!N)return;const e=tt("id");if(!e){Pe();return}if(Mt(),await Promise.all([Pt(e),Dt()]),!m){O("Collection not found","error"),Pe();return}await Ht(),Z(),ct(B,N.id).then(o=>{Y=o}),X(),z(),ni(),ai(),ie=le(async()=>{try{we();const{error:o}=await B.from("link_lists").update({presentation_data:m.presentation_data}).eq("id",m.id);if(o)throw o;return Z(),!0}catch(o){return console.error("Auto-save presentation failed:",o),!1}},{statusSelector:"#presentation-save-status"}),te=le(async()=>{var o,n,a;try{const l=((o=document.getElementById("collection-visibility"))==null?void 0:o.value)||"public",r=(n=document.getElementById("collection-passkey"))==null?void 0:n.value.trim(),d=((a=document.getElementById("collection-slug"))==null?void 0:a.value.trim().toLowerCase().replace(/[^a-z0-9-]/g,""))||m.slug,c={visibility:l,slug:d};l==="passkey"&&r?c.passkey_hash=r:l!=="passkey"&&(c.passkey_hash=null);const{error:v}=await B.from("link_lists").update(c).eq("id",m.id);if(v)throw v;return m.visibility=l,m.slug=d,c.passkey_hash!==void 0&&(m.passkey_hash=c.passkey_hash),Z(),!0}catch(l){return console.error("Auto-save settings failed:",l),!1}},{statusSelector:"#settings-save-status"}),J=le(async()=>{var n,a,l,r,d,c,v,E;const o=G;if(!o)return!1;try{const f=C.find(g=>g.id===o);if(!f)return!1;const w=(n=document.getElementById("link-title"))==null?void 0:n.value.trim(),y=(a=document.getElementById("link-url"))==null?void 0:a.value.trim(),T=(l=document.getElementById("link-image"))==null?void 0:l.value.trim(),L=!!f.source_link_id,P=ce(f),x=L?!f.use_library_defaults:P,u=L&&f.use_library_defaults,b=u?((r=f.image_position)==null?void 0:r.x)??50:parseInt((d=document.getElementById("link-img-pos-x"))==null?void 0:d.value)||50,q=u?((c=f.image_position)==null?void 0:c.y)??50:parseInt((v=document.getElementById("link-img-pos-y"))==null?void 0:v.value)||50,h=u?f.image_scale??100:parseInt((E=document.getElementById("link-img-scale"))==null?void 0:E.value)||100,k={url:y,use_library_defaults:!!f.use_library_defaults};f.tags&&f.tags.length>0&&(k.tags=f.tags),x&&!L?k.custom_overrides={title:w,image_url:T||null,image_position:{x:b,y:q},image_scale:h}:u||(k.title=w,k.image_url=T||null,k.image_position={x:b,y:q},k.image_scale=h,k.custom_overrides=null);const{error:I}=await B.from("link_items").update({...k,updated_at:new Date().toISOString()}).eq("id",o);if(I)throw I;return Object.assign(f,k),V(),z(),!0}catch(f){return console.error("Auto-save link failed:",f),!1}},{statusSelector:"#link-save-status"}),he=le(async()=>{try{const o=Re(),n={...m.theme,...o},{error:a}=await B.from("link_lists").update({theme:n}).eq("id",m.id);if(a)throw a;return m.theme=n,z(),!0}catch(o){return console.error("Auto-save theme failed:",o),!1}},{statusSelector:"#theme-save-status"}),se(ie),se(te),se(J),se(he),window.addEventListener("beforeunload",()=>{nt()}),sessionStorage.setItem("academiqr-last-collection",JSON.stringify({id:m.id,title:((t=m.presentation_data)==null?void 0:t.title)||"Untitled Collection"})),console.log(`[AcademiQR v1.0] Editor loaded: "${((i=m.presentation_data)==null?void 0:i.title)||"Untitled"}" with ${C.length} links`)}function Mt(){var i;const e=document.getElementById("main-nav");if(!e)return;e.innerHTML=`
    <div class="nav-inner">
      <a href="/src/pages/dashboard.html" class="nav-brand"><img src="https://natzpfyxpuycsuuzbqrd.supabase.co/storage/v1/object/public/assets/AcademiQR_logo_Dark.png" alt="AcademiQR" class="nav-logo"></a>
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
  `,(i=document.getElementById("sign-out-btn"))==null||i.addEventListener("click",async()=>{await it(),ot("login")}),lt();const t=document.getElementById("theme-toggle-btn");t&&(t.querySelector("i").className=(st()==="dark","fas fa-circle-half-stroke"),t.addEventListener("click",()=>{const o=rt();t.querySelector("i").className="fas fa-circle-half-stroke"}))}async function Pt(e){try{const{data:t,error:i}=await B.from("link_lists").select("*").eq("id",e).eq("owner_id",N.id).single();if(i)throw i;m=t,console.log("[Editor] Collection loaded:",m==null?void 0:m.id)}catch(t){console.error("Failed to load collection:",t),m=null}}async function Ht(){if(m)try{const{data:e,error:t}=await B.from("link_items").select("*, source_link_id, use_library_defaults").eq("list_id",m.id).order("order_index",{ascending:!0});if(t)throw t;C=e||[],C.sort((i,o)=>{const n=i.order_index??1/0,a=o.order_index??1/0;return n!==a?n-a:new Date(i.created_at||0)-new Date(o.created_at||0)}),await at(C)}catch(e){console.error("Failed to load links:",e),C=[]}}async function Dt(){try{const{data:e,error:t}=await B.from("profiles").select("display_name, username, profile_photo, profile_photo_position, social_email, social_instagram, social_facebook, social_twitter, social_linkedin, social_youtube, social_tiktok, social_snapchat").eq("id",N.id).single();if(t)throw t;D=e}catch(e){console.error("Failed to load profile:",e),D={}}}function Z(){const e=m.presentation_data||{},t=e.title||"Untitled Collection";document.getElementById("collection-title").textContent=t;const i=document.getElementById("collection-meta");if(i){const o=e.conference||"";i.innerHTML=`
      ${o?`<span class="meta-item"><i class="fas fa-building"></i> ${S(o)}</span>`:""}
      <span class="meta-item"><i class="fas fa-list"></i> ${C.length} link${C.length!==1?"s":""}</span>
    `}V()}function V(){const e=document.getElementById("links-list");if(e){if(C.length===0){e.innerHTML=`
      <div class="empty-links">
        <i class="fas fa-link"></i>
        <p>No links yet. Add your first link!</p>
      </div>
    `;return}e.innerHTML=C.map((t,i)=>{const o=t.id===G,n=t.is_active!==!1;return`
      <div class="link-item ${o?"selected":""} ${n?"":"inactive"}"
           data-link-id="${t.id}" data-index="${i}">
        <div class="link-drag-handle" title="Drag to reorder">
          <i class="fas fa-grip-vertical"></i>
        </div>
        ${ve(t)?`
          <div class="link-thumb">
            <img src="${S(ve(t))}" alt="" loading="lazy"
                 onerror="this.parentElement.innerHTML='<i class=\\'fas fa-image\\'></i>'">
          </div>
        `:`
          <div class="link-thumb link-thumb-empty">
            <i class="fas fa-link"></i>
          </div>
        `}
        <div class="link-info">
          <div class="link-title">${S($e(t)||"Untitled Link")}${t.use_library_defaults&&t.source_link_id?' <i class="fas fa-link" style="font-size:0.6rem; opacity:0.5;" title="Using library version"></i>':""}</div>
          <div class="link-url">${S(Je(t.url||""))}</div>
        </div>
        <div class="link-actions">
          <button class="btn-icon link-toggle" data-link-id="${t.id}" title="${n?"Active":"Inactive"}">
            <i class="fas ${n?"fa-toggle-on":"fa-toggle-off"}"></i>
          </button>
        </div>
      </div>
    `}).join(""),e.querySelectorAll(".link-item").forEach(t=>{t.addEventListener("click",i=>{i.target.closest(".link-toggle")||i.target.closest(".link-drag-handle")||(G=t.dataset.linkId,V(),X(),Ft())})}),e.querySelectorAll(".link-toggle").forEach(t=>{t.addEventListener("click",i=>{i.stopPropagation(),Jt(t.dataset.linkId)})}),ii()}}function Ft(){setTimeout(()=>{const e=document.getElementById("link-editor-section");e&&(e.style.display="block",e.scrollIntoView({behavior:"smooth",block:"start"}))},50)}function X(){const e=document.getElementById("tab-content");if(e)switch(de){case"details":Ut(e);break;case"appearance":ue(e);break;case"qr-code":jt(e);break;case"analytics":Vt(e);break}}function Ut(e){var c,v,E,f,w,y,T,L,P,x;const t=m.presentation_data||{},i=je,o=m.visibility||"public",n=!!m.passkey_hash;let a=`
    <!-- ═══ PRESENTATION INFORMATION ═══ -->
    <div class="section">
      <div class="section-header" data-section="presentation-section">
        <h3>Presentation Information <span id="presentation-save-status" class="auto-save-status"></span></h3>
        ${i}
      </div>
      <div class="section-content" id="presentation-section">
        <div class="form-group">
          <label for="info-title">Title</label>
          <input type="text" id="info-title" value="${S(t.title||"")}" placeholder="Presentation title" maxlength="200">
        </div>
        <div class="form-group">
          <label for="info-conference">Conference / Event</label>
          <input type="text" id="info-conference" value="${S(t.conference||"")}" placeholder="Conference name" maxlength="200">
        </div>
        <div class="form-group">
          <label for="info-location">Location</label>
          <input type="text" id="info-location" value="${S(t.location||"")}" placeholder="City, State / Country" maxlength="200">
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
            <span class="slug-prefix">${D!=null&&D.username?`academiqr.com/u/${S(D.username)}/`:"slug: "}</span>
            <input type="text" id="collection-slug" value="${S(m.slug||"")}" placeholder="my-collection" maxlength="60">
          </div>
          <p id="slug-status" style="font-size:0.75rem; margin-top:4px; min-height:1.2em; color:#9ca3af;"></p>
        </div>
        <div class="form-group">
          <label>Public Link</label>
          <div style="display:flex; align-items:center; gap:8px; background:#f8fafc; padding:10px 14px; border-radius:8px; border:1px solid #e2e8f0;">
            <i class="fas fa-link" style="color:#9ca3af; font-size:0.75rem;"></i>
            <span id="public-link-preview" style="color:#64748b; font-size:0.8rem; word-break:break-all;">${D!=null&&D.username&&m.slug?`academiqr.com/u/${S(D.username)}/${S(m.slug)}`:`academiqr.com/public.html?collection=${m.id.substring(0,8)}...`}</span>
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
  `;if(G){const u=C.find(b=>b.id===G);if(u){const b=!!u.source_link_id,q=ce(u),h=b?!u.use_library_defaults:q,k=b&&u.use_library_defaults,I=h&&q?u.custom_overrides.title??u.title??"":u.title||"",g=h&&q?u.custom_overrides.image_url??u.image_url??"":u.image_url||"",p=$e(u)||"",H=ve(u)||"",R=k?Qe(u):h&&q&&u.custom_overrides.image_position?u.custom_overrides.image_position:u.image_position||u.imagePosition||{x:50,y:50},$=k?Oe(u):h&&q&&u.custom_overrides.image_scale!=null?u.custom_overrides.image_scale:u.image_scale??u.imageScale??100,A=k?H:g;a+=`
    <!-- ═══ EDIT LINK ═══ -->
    <div class="section">
      <div class="section-header" data-section="link-editor-section">
        <h3>Edit Link <span id="link-save-status" class="auto-save-status"></span></h3>
        ${i}
      </div>
      <div class="section-content" id="link-editor-section">
        <div class="link-editor">
          <div class="link-editor-header" style="margin-bottom:12px;">
            <span style="font-size:0.875rem; color:#64748b;">Editing: <strong>${S(p||"Untitled")}</strong></span>
            <button class="btn-danger btn-sm" id="delete-link-btn" data-link-id="${u.id}">
              <i class="fas fa-trash"></i> Delete
            </button>
          </div>

          <!-- Library / Customize toggle (all links) -->
          <div class="link-source-toggle">
            <div class="source-toggle-options">
              <label class="source-toggle-option ${h?"":"active"}">
                <input type="radio" name="link-source-mode" value="library" ${h?"":"checked"}>
                <i class="fas fa-book"></i> Use Library Version
              </label>
              <label class="source-toggle-option ${h?"active":""}">
                <input type="radio" name="link-source-mode" value="custom" ${h?"checked":""}>
                <i class="fas fa-pen"></i> Customize for This Collection
              </label>
            </div>
            ${h?`
              <p class="source-toggle-hint"><i class="fas fa-info-circle"></i> This link has custom title/image for this collection only.</p>
            `:`
              <p class="source-toggle-hint"><i class="fas fa-info-circle"></i> ${b?"Title and image sync with the library version. Changes in the library will appear here automatically.":"Editing title or image here will also update in your Link Library."}</p>
            `}
          </div>

          <div class="form-group">
            <label for="link-title">Title</label>
            <input type="text" id="link-title" value="${S(k?p:I)}" placeholder="Link title" ${k?"disabled":""}>
          </div>

          <div class="form-group">
            <label for="link-url">URL</label>
            <input type="url" id="link-url" value="${S(u.url||"")}" placeholder="https://...">
          </div>

          <div class="form-group">
            <label for="link-image">Image URL</label>
            <div class="image-input-row">
              <input type="text" id="link-image" value="${S(A||"")}" placeholder="Image URL or upload" ${k?"disabled":""}>
              <button class="btn-secondary" id="upload-image-btn" ${k?"disabled":""}><i class="fas fa-upload"></i> Upload</button>
              <button class="btn-secondary" id="browse-media-btn" ${k?"disabled":""}><i class="fas fa-images"></i> Browse</button>
              <input type="file" id="link-image-file" accept="image/*" style="display:none;">
            </div>
            ${A?`
              <div class="image-preview" style="margin-top:12px;">
                <img src="${S(A)}" alt="Preview"
                     style="transform: ${Te(R.x,R.y,$)};"
                     onerror="this.style.display='none'">
              </div>
              ${k?"":`
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

          ${h?`
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
    `;e.innerHTML=a,["info-title","info-conference","info-location","info-date"].forEach(u=>{var b;(b=document.getElementById(u))==null||b.addEventListener("input",()=>{we(),z(),ie.trigger()})}),["display-title","display-conference"].forEach(u=>{var b;(b=document.getElementById(u))==null||b.addEventListener("change",()=>{we(),z(),ie.trigger()})});const l=e.querySelector(".editor-tags-container"),r=document.getElementById("editor-tag-input-container");if(r){const u=(m.presentation_data||{}).tags||[];He(r,Y,u,async b=>{const q=m.presentation_data||{};q.tags=De([...q.tags||[],b]),m.presentation_data=q,Y.includes(b)||(Y.push(b),Y.sort(),Fe()),ie.trigger(),l&&(l.innerHTML=ee(q.tags,{removable:!0})),qe(l)})}qe(l),(c=document.getElementById("copy-link-btn"))==null||c.addEventListener("click",zt);const d=m.slug||"";if((v=document.getElementById("collection-slug"))==null||v.addEventListener("input",u=>{const b=u.target.value.toLowerCase().replace(/[^a-z0-9-]/g,"");u.target.value=b;const q=document.getElementById("public-link-preview"),h=document.getElementById("slug-status");q&&(D!=null&&D.username)&&b?q.textContent=`academiqr.com/u/${D.username}/${b}`:q&&b&&(q.textContent=`academiqr.com/public.html?collection=${m.id.substring(0,8)}...`),h&&d&&b!==d?h.innerHTML='<span style="color:#dc2626;"><i class="fas fa-exclamation-triangle"></i> Changing this slug will break any QR codes or shared links that use the current short URL.</span>':h&&(h.textContent=""),d&&b!==d||te.trigger()}),(E=document.getElementById("collection-slug"))==null||E.addEventListener("blur",()=>{var b;const u=((b=document.getElementById("collection-slug"))==null?void 0:b.value.trim().toLowerCase().replace(/[^a-z0-9-]/g,""))||"";if(d&&u!==d&&u)if(confirm(`You are changing this collection's URL slug.

Any QR codes or shared links using the short URL format will stop working.
(Note: QR codes using the legacy ?collection= format will still work.)

Continue?`))te.trigger();else{document.getElementById("collection-slug").value=d;const h=document.getElementById("public-link-preview");h&&(D!=null&&D.username)&&d&&(h.textContent=`academiqr.com/u/${D.username}/${d}`);const k=document.getElementById("slug-status");k&&(k.textContent="")}}),(f=document.getElementById("collection-visibility"))==null||f.addEventListener("change",u=>{const b=document.getElementById("passkey-group");b&&(b.style.display=u.target.value==="passkey"?"block":"none"),te.trigger()}),(w=document.getElementById("collection-passkey"))==null||w.addEventListener("input",()=>{te.trigger()}),G){const u=G;(y=document.getElementById("delete-link-btn"))==null||y.addEventListener("click",()=>Yt(u)),["link-title","link-url","link-image"].forEach(h=>{var k;(k=document.getElementById(h))==null||k.addEventListener("input",()=>{J.trigger()})});const b=document.getElementById("link-tags-display"),q=document.getElementById("link-tag-input-container");if(q){const h=C.find(k=>k.id===u);if(h){const k=h.tags||[];He(q,Y,k,async I=>{h.tags=De([...h.tags||[],I]),b&&(b.innerHTML=ee(h.tags,{removable:!0}),Le(b,h)),Y.includes(I)||(Y.push(I),Y.sort(),Fe()),J.trigger()}),Le(b,h)}}document.querySelectorAll('input[name="link-source-mode"]').forEach(h=>{h.addEventListener("change",k=>{const I=C.find(p=>p.id===u);if(!I)return;const g=k.target.value==="library";I.source_link_id?I.use_library_defaults=g:g?I.custom_overrides=null:I.custom_overrides={title:I.title||"",image_url:I.image_url||null,image_position:I.image_position||{x:50,y:50},image_scale:I.image_scale??100},X(),V(),z()})}),(T=document.getElementById("save-as-library-btn"))==null||T.addEventListener("click",()=>Xt(u)),(L=document.getElementById("upload-image-btn"))==null||L.addEventListener("click",()=>{var h;(h=document.getElementById("link-image-file"))==null||h.click()}),(P=document.getElementById("link-image-file"))==null||P.addEventListener("change",Nt),(x=document.getElementById("browse-media-btn"))==null||x.addEventListener("click",()=>{Ce(h=>{const k=document.getElementById("link-image");k&&(k.value=h);const I=C.find(g=>g.id===u);I&&(ce(I)?I.custom_overrides.image_url=h:I.image_url=h,z(),V(),X(),J.trigger())})}),["link-img-pos-x","link-img-pos-y","link-img-scale"].forEach(h=>{var k;(k=document.getElementById(h))==null||k.addEventListener("input",()=>{Qt(),J.trigger()})})}Xe(e)}function we(){var t,i,o,n,a,l;const e=m.presentation_data||{};e.title=((t=document.getElementById("info-title"))==null?void 0:t.value)||"",e.conference=((i=document.getElementById("info-conference"))==null?void 0:i.value)||"",e.location=((o=document.getElementById("info-location"))==null?void 0:o.value)||"",e.date=((n=document.getElementById("info-date"))==null?void 0:n.value)||"",e.displayTitle=((a=document.getElementById("display-title"))==null?void 0:a.checked)??!0,e.displayConference=((l=document.getElementById("display-conference"))==null?void 0:l.checked)??!0,m.presentation_data=e}function zt(){const e=Ne(N.id,m.id,{username:D==null?void 0:D.username,slug:m.slug});navigator.clipboard.writeText(e).then(()=>{const t=document.getElementById("copy-link-btn");t&&(t.innerHTML='<i class="fas fa-check"></i>',setTimeout(()=>{t.innerHTML='<i class="fas fa-copy"></i>'},1500))}).catch(()=>{prompt("Copy this link:",e)})}async function Nt(e){var n;const t=(n=e.target.files)==null?void 0:n[0];if(!t)return;const i=document.getElementById("upload-image-btn"),o=i==null?void 0:i.innerHTML;try{i&&(i.disabled=!0,i.innerHTML='<i class="fas fa-spinner fa-spin"></i> Uploading...');const a=await Ie(t,"links",N.id,{maxWidth:800,maxHeight:800}),l=document.getElementById("link-image");l&&(l.value=a);const r=C.find(d=>d.id===G);r&&(ce(r)?r.custom_overrides.image_url=a:r.image_url=a,z(),V(),J.trigger())}catch(a){console.error("Image upload failed:",a),O("Image upload failed: "+a.message,"error")}finally{i&&(i.disabled=!1,i.innerHTML=o)}}function Qt(){var a,l,r;const e=C.find(d=>d.id===G);if(!e)return;const t=parseInt((a=document.getElementById("link-img-pos-x"))==null?void 0:a.value)||50,i=parseInt((l=document.getElementById("link-img-pos-y"))==null?void 0:l.value)||50,o=parseInt((r=document.getElementById("link-img-scale"))==null?void 0:r.value)||100;ce(e)?(e.custom_overrides.image_position={x:t,y:i},e.custom_overrides.image_scale=o):(e.image_position={x:t,y:i},e.image_scale=o);const n=document.querySelector(".image-preview img");n&&(n.style.transform=Te(t,i,o)),z()}function Be(e){if(!e||typeof e=="object"&&Object.keys(e).length===0)return{...Rt};if(typeof e=="string")try{e=JSON.parse(e)}catch{return Be(null)}const t=e.borderEnabled!==void 0?!!e.borderEnabled:e.gradientBorderEnabled!==void 0?!!e.gradientBorderEnabled:!0,i=[e.textColor,e.presentationTextColor,e.profileTextColor,e.presentationColor,e.profileColor].find(n=>typeof n=="string"&&n.length>0)||"#1A2F5B";return{backgroundType:e.backgroundType||"solid",backgroundColor:e.backgroundColor||"#ffffff",gradientText:e.gradientText||"",backgroundImage:e.backgroundImage||"",backgroundImageX:e.backgroundImageX??e.imagePositionX??50,backgroundImageY:e.backgroundImageY??e.imagePositionY??50,backgroundImageScale:e.backgroundImageScale??e.imageScale??100,profileTextColor:i,presentationTextColor:i,buttonTextColor:e.buttonTextColor||"#000000",buttonBackgroundColor:e.buttonBackgroundColor||e.buttonBgColor||"#1A2F5B",buttonStyle:e.buttonStyle||"soft",buttonBorderRadius:e.buttonBorderRadius||e.borderRadius||"8px",buttonPadding:e.buttonPadding||"12px 24px",buttonFontSize:e.buttonFontSize||"16px",buttonFontWeight:e.buttonFontWeight||"500",textFontSize:e.textFontSize||"18px",textFontWeight:e.textFontWeight||"600",borderEnabled:t,borderType:e.borderType||"solid",borderStyle:e.borderStyle==="fill"||e.borderStyle==="thin"?e.borderStyle:"fill",borderColor:e.borderColor||"#1A2F5B",borderWidth:e.borderWidth||"1px",borderGradient:e.borderGradient||e.borderGradientText||"",borderGradientAngle:e.borderGradientAngle||""}}const Ot=["#ffffff","#e5e7eb","#9ca3af","#1f2937","#000000","#1A2F5B"],ze=["linear-gradient(45deg, #ff6b6b, #4ecdc4)","linear-gradient(135deg, #1A2F5B, #3B5B8F)","linear-gradient(43deg, #D54070 0%, #8F4469 20%, #CA5699 40%, #59B8DA 60%, #9AD0DD 80%, #73B44A 100%)"];function ne(e){return`<div class="color-presets">${Ot.map(t=>`<button type="button" class="color-preset ${t===e?"active":""}" data-color="${t}" style="background:${t};${t==="#ffffff"?"border:1px solid #e5e7eb;":""}" title="${t}"></button>`).join("")}</div>`}function ue(e){var L,P,x,u,b,q,h,k,I;const t=Be(m.theme),i=t.backgroundType,o=t.backgroundColor,n=t.gradientText||"linear-gradient(45deg, #ff6b6b 0%, #4ecdc4 100%)";t.profileTextColor;const a=t.presentationTextColor,l=t.buttonTextColor,r=t.buttonBackgroundColor,d=t.buttonStyle,c=t.borderEnabled,v=t.borderType,E=t.borderStyle,f=t.borderColor;t.borderWidth,t.buttonBorderRadius;const w=t.borderGradient,y=je;e.innerHTML=`
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
              <textarea id="theme-gradient" class="gradient-textarea" rows="2" placeholder="linear-gradient(...)">${S(n)}</textarea>
              <div class="gradient-preview" id="gradient-preview" style="background: ${n};"></div>
            </div>
            <div class="form-group">
              <label>Presets</label>
              <div class="gradient-presets">
                ${ze.map((g,p)=>`
                  <button type="button" class="gradient-preset" data-gradient="${S(g)}" style="background: ${g};" title="Preset ${p+1}"></button>
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
                <label class="radio-label"><input type="radio" name="border-type" value="solid" ${v==="solid"?"checked":""}> Solid Color</label>
                <label class="radio-label"><input type="radio" name="border-type" value="gradient" ${v==="gradient"?"checked":""}> Gradient</label>
              </div>
            </div>
            <div class="form-group">
              <label>Border Style</label>
              <div class="radio-group">
                <label class="radio-label"><input type="radio" name="border-style" value="fill" ${E==="fill"?"checked":""}> Frame Fill</label>
                <label class="radio-label"><input type="radio" name="border-style" value="thin" ${E==="thin"?"checked":""}> Thin Border</label>
              </div>
            </div>

            <!-- Solid border color -->
            <div id="border-solid-group" style="display:${v==="solid"?"block":"none"}">
              <div class="form-group">
                <label>Border Color</label>
                <div class="color-input-row">
                  <input type="color" id="theme-border-color" value="${f}">
                  <input type="text" id="theme-border-color-val" value="${f}" class="color-text">
                </div>
                ${ne(f)}
              </div>
            </div>

            <!-- Gradient border -->
            <div id="border-gradient-group" style="display:${v==="gradient"?"block":"none"}">
              <div class="form-group">
                <label>Border Gradient CSS</label>
                <textarea id="theme-border-gradient" class="gradient-textarea" rows="2" placeholder="linear-gradient(...)">${S(w)}</textarea>
                <div class="gradient-preview" id="border-gradient-preview" style="background: ${w||"linear-gradient(45deg, #1A2F5B, #3B5B8F)"};"></div>
              </div>
              <div class="form-group">
                <label>Presets</label>
                <div class="gradient-presets">
                  ${ze.map((g,p)=>`
                    <button type="button" class="border-gradient-preset" data-gradient="${S(g)}" style="background: ${g};" title="Preset ${p+1}"></button>
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
  `,[["theme-bg-color","theme-bg-color-text"],["theme-presentation-text","theme-presentation-text-val"],["theme-btn-bg","theme-btn-bg-val"],["theme-btn-text","theme-btn-text-val"],["theme-border-color","theme-border-color-val"]].forEach(([g,p])=>{var H,R;(H=document.getElementById(g))==null||H.addEventListener("input",$=>{const A=document.getElementById(p);A&&(A.value=$.target.value),U()}),(R=document.getElementById(p))==null||R.addEventListener("input",$=>{const A=document.getElementById(g);A&&/^#[0-9a-fA-F]{6}$/.test($.target.value)&&(A.value=$.target.value),U()})}),e.addEventListener("click",g=>{const p=g.target.closest(".color-preset");if(!p)return;const H=p.dataset.color,R=p.closest(".form-group"),$=R==null?void 0:R.querySelector('input[type="color"]'),A=R==null?void 0:R.querySelector(".color-text");$&&($.value=H),A&&(A.value=H),R==null||R.querySelectorAll(".color-preset").forEach(s=>s.classList.remove("active")),p.classList.add("active"),U()}),e.querySelectorAll(".gradient-preset").forEach(g=>{g.addEventListener("click",()=>{const p=document.getElementById("theme-gradient"),H=document.getElementById("gradient-preview");p&&(p.value=g.dataset.gradient),H&&(H.style.background=g.dataset.gradient),U()})}),e.querySelectorAll(".border-gradient-preset").forEach(g=>{g.addEventListener("click",()=>{const p=document.getElementById("theme-border-gradient"),H=document.getElementById("border-gradient-preview");p&&(p.value=g.dataset.gradient),H&&(H.style.background=g.dataset.gradient),U()})}),e.querySelectorAll('input[name="bg-type"]').forEach(g=>{g.addEventListener("change",p=>{document.getElementById("bg-solid-group").style.display=p.target.value==="solid"?"block":"none",document.getElementById("bg-gradient-group").style.display=p.target.value==="gradient"?"block":"none",document.getElementById("bg-image-group").style.display=p.target.value==="image"?"block":"none",U()})}),(L=document.getElementById("theme-button-style"))==null||L.addEventListener("change",g=>{const p=document.getElementById("btn-bg-group");p&&(p.style.display=g.target.value==="solid"?"block":"none"),U()}),(P=document.getElementById("theme-border-enabled"))==null||P.addEventListener("change",g=>{const p=document.getElementById("border-options");p&&(p.style.display=g.target.checked?"block":"none"),U()}),e.querySelectorAll('input[name="border-type"]').forEach(g=>{g.addEventListener("change",p=>{document.getElementById("border-solid-group").style.display=p.target.value==="solid"?"block":"none",document.getElementById("border-gradient-group").style.display=p.target.value==="gradient"?"block":"none",U()})}),(x=document.getElementById("theme-gradient"))==null||x.addEventListener("input",g=>{const p=document.getElementById("gradient-preview");p&&(p.style.background=g.target.value),U()}),(u=document.getElementById("theme-border-gradient"))==null||u.addEventListener("input",g=>{const p=document.getElementById("border-gradient-preview");p&&(p.style.background=g.target.value),U()}),["bg-pos-x","bg-pos-y","bg-pos-scale"].forEach(g=>{var p;(p=document.getElementById(g))==null||p.addEventListener("input",U)}),(b=document.getElementById("bg-upload-btn"))==null||b.addEventListener("click",()=>{var g;(g=document.getElementById("bg-image-file"))==null||g.click()}),(q=document.getElementById("bg-image-file"))==null||q.addEventListener("change",Gt),(h=document.getElementById("bg-browse-media-btn"))==null||h.addEventListener("click",()=>{Ce(g=>{m._pendingBgImage=g,U(),ue(document.getElementById("tab-content"))})}),(k=document.getElementById("bg-image-remove"))==null||k.addEventListener("click",()=>{m._pendingBgImage=null,m.theme&&(m.theme.backgroundImage="");const g=document.querySelector('input[name="bg-type"][value="solid"]');g&&(g.checked=!0),U(),ue(document.getElementById("tab-content"))}),["theme-button-style"].forEach(g=>{var p;(p=document.getElementById(g))==null||p.addEventListener("change",U)}),e.querySelectorAll('input[name="border-style"]').forEach(g=>{g.addEventListener("change",U)}),Xe(e),(I=document.getElementById("save-new-theme-btn"))==null||I.addEventListener("click",oi),Ae()}async function Gt(e){var n;const t=(n=e.target.files)==null?void 0:n[0];if(!t)return;const i=document.getElementById("bg-upload-btn"),o=i==null?void 0:i.innerHTML;try{i&&(i.disabled=!0,i.innerHTML='<i class="fas fa-spinner fa-spin"></i> Uploading...');const a=await Ie(t,"backgrounds",N.id,{maxWidth:1920,maxHeight:1920});m._pendingBgImage=a,U(),ue(document.getElementById("tab-content"))}catch(a){console.error("Background image upload failed:",a),O("Background image upload failed: "+a.message,"error")}finally{i&&(i.disabled=!1,i.innerHTML=o)}}function U(){const e=Re(),t={...m.theme,...e};m._pendingBgImage&&(t.backgroundImage=m._pendingBgImage),z(t),he&&he.trigger()}function jt(e){wt(e,m,N)}function Vt(e){Ct(e,m,N)}function z(e){const t=document.getElementById("phone-preview");if(!t)return;const i=Be(e||m.theme),o=m.presentation_data||{},n=D||{},a=i.backgroundType;let l="";if(a==="gradient"&&i.gradientText)l=`background: ${i.gradientText};`;else if(a==="image"&&i.backgroundImage){const M=i.backgroundImageX,j=i.backgroundImageY,xe=i.backgroundImageScale;l=`background: url('${i.backgroundImage}') ${M}% ${j}% / ${xe}% no-repeat;`}else l=`background: ${i.backgroundColor};`;const r=i.presentationTextColor,d=r,c=i.buttonStyle,v=i.buttonBackgroundColor,E=i.buttonTextColor;i.buttonBorderRadius;const f=i.borderEnabled,w=i.borderType,y=i.borderStyle,T=i.borderColor,L=i.borderGradient,P=n.profile_photo||"";let x={scale:100,x:50,y:50};if(n.profile_photo_position)try{x=typeof n.profile_photo_position=="string"?JSON.parse(n.profile_photo_position):n.profile_photo_position}catch{}const u=(x.scale||100)/100,b=((x.x||50)-50)*-1,q=((x.y||50)-50)*-1,h=[{key:"social_email",icon:"fa-envelope",prefix:"mailto:"},{key:"social_instagram",icon:"fa-instagram",prefix:""},{key:"social_facebook",icon:"fa-facebook",prefix:""},{key:"social_twitter",icon:"fa-x-twitter",prefix:""},{key:"social_linkedin",icon:"fa-linkedin",prefix:""},{key:"social_youtube",icon:"fa-youtube",prefix:""},{key:"social_tiktok",icon:"fa-tiktok",prefix:""},{key:"social_snapchat",icon:"fa-snapchat",prefix:""}].filter(M=>{var j;return(j=n[M.key])==null?void 0:j.trim()}),k=o.title||"Untitled",I=o.displayTitle!==!1,g=o.displayConference!==!1,p=o.conference||"",H=o.location||"",R=o.date?Wt(o.date):"",$=C.filter(M=>M.is_active!==!1);function A(){let M=`color: ${E}; border-radius: 8px; font-size: 1.14rem;`;return c==="solid"?M+=`background: ${v} !important; border-color: ${v} !important;`:c==="outline"?M+=`background: transparent !important; border: 2px solid ${E} !important; color: ${E} !important;`:M+=`color: ${E} !important;`,M}const s=t.closest(".phone-mockup")||t.parentElement;s&&(s.style.boxShadow="0 20px 40px rgba(0, 0, 0, 0.3)",s.style.padding="8px",f?w==="gradient"&&L?y==="thin"?(s.style.background=L,s.style.padding="8px",s.style.boxShadow="inset 0 0 0 3px transparent, 0 20px 40px rgba(0, 0, 0, 0.3)"):(s.style.background=L,s.style.padding="8px"):y==="thin"?(s.style.background="#1e293b",s.style.boxShadow=`inset 0 0 0 8px ${T}, 0 20px 40px rgba(0, 0, 0, 0.3)`):s.style.background=T:s.style.background="#1e293b");const _=I&&k||g&&p||H||R;t.innerHTML=`
    <div class="phone-screen" style="${l}">
      <!-- Header content — wraps profile + presentation like v0.6.7 -->
      <div class="phone-header-content">
        <!-- Profile — avatar + name side by side -->
        <div class="phone-profile-section">
          ${P?`
            <div class="phone-avatar">
              <img src="${S(P)}" alt="Profile"
                   style="transform: translate(${b}%, ${q}%) scale(${u}) !important; transform-origin: center center !important;"
                   onerror="this.parentElement.style.display='none'">
            </div>
          `:""}
          <div class="phone-name-section">
            ${n.display_name?`<h4 class="phone-display-name" style="color: ${d};">${S(n.display_name)}</h4>`:""}
            ${h.length>0?`
              <div class="phone-socials">
                ${h.map(M=>`
                  <span class="phone-social-icon ${M.key}" title="${M.key.replace("social_","")}">
                    <i class="${M.key==="social_email"?"fas":"fab"} ${M.icon}"></i>
                  </span>
                `).join("")}
              </div>
            `:""}
          </div>
        </div>

        <!-- Presentation Info -->
        ${_?`
          <div class="phone-presentation" style="color: ${r};">
            ${I?`<div class="phone-info-field"><span class="phone-info-value">${S(k)}</span></div>`:""}
            ${g&&p?`<div class="phone-info-field"><span class="phone-info-value">${S(p)}</span></div>`:""}
            ${H?`<div class="phone-info-field"><span class="phone-info-value" style="font-size:0.9rem;">${S(H)}</span></div>`:""}
            ${R?`<div class="phone-info-field"><span class="phone-info-value" style="font-size:0.9rem;">${S(R)}</span></div>`:""}
          </div>
        `:""}
      </div>

      <!-- Links -->
      <div class="phone-links">
        ${$.length===0?`
          <p class="phone-empty" style="color: ${r};">No active links</p>
        `:$.map(M=>{const j=Qe(M),xe=Oe(M),Ke=Te(j.x,j.y,xe),Me=ve(M),Ze=$e(M)||"Untitled";return`
            <div class="phone-link-btn ${c}" style="${A()}">
              ${Me?`
                <div class="phone-link-image-wrapper">
                  <div class="phone-link-image">
                    <img src="${S(Me)}" alt=""
                      style="transform: ${Ke};"
                      onerror="this.parentElement.innerHTML='<i class=\\'fas fa-link\\' style=\\'color:#6b7280\\'></i>'">
                  </div>
                </div>
              `:""}
              <div class="phone-link-text">${S(Ze)}</div>
            </div>
          `}).join("")}
      </div>

      <!-- Footer -->
      <div class="phone-footer" style="color: ${d};">
        <p class="phone-footer-text">Powered by <a href="https://academiqr.com" style="color: ${d};">AcademiQR.com</a></p>
      </div>
    </div>
  `}function Wt(e){try{return new Date(e+"T00:00:00").toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}catch{return e}}async function Xt(e){var d,c,v,E,f,w;if(!C.find(y=>y.id===e))return;const i=(d=document.getElementById("link-title"))==null?void 0:d.value.trim(),o=(c=document.getElementById("link-url"))==null?void 0:c.value.trim(),n=(v=document.getElementById("link-image"))==null?void 0:v.value.trim(),a=parseInt((E=document.getElementById("link-img-pos-x"))==null?void 0:E.value)||50,l=parseInt((f=document.getElementById("link-img-pos-y"))==null?void 0:f.value)||50,r=parseInt((w=document.getElementById("link-img-scale"))==null?void 0:w.value)||100;if(!i){O("Please enter a title.","warning");return}if(!o){O("Please enter a URL.","warning");return}try{const y=C.reduce((P,x)=>Math.max(P,x.order_index||0),0),{data:T,error:L}=await B.from("link_items").insert({list_id:m.id,title:i,url:o,image_url:n||null,image_position:{x:a,y:l},image_scale:r,order_index:y+100,is_active:!0}).select().single();if(L)throw L;C.push(T),G=T.id,V(),X(),z(),Z(),We("save-as-library-btn")}catch(y){console.error("Failed to create library link:",y),O("Failed to create link: "+y.message,"error")}}async function Yt(e){const t=C.find(i=>i.id===e);if(!(!t||!confirm(`Delete "${t.title||"this link"}"?`)))try{const{error:i}=await B.from("link_items").delete().eq("id",e).eq("list_id",m.id);if(i)throw i;C=C.filter(o=>o.id!==e),G=null,V(),X(),z(),Z()}catch(i){console.error("Failed to delete link:",i),O("Failed to delete: "+i.message,"error")}}async function Jt(e){const t=C.find(o=>o.id===e);if(!t)return;const i=t.is_active===!1;try{const{error:o}=await B.from("link_items").update({is_active:i}).eq("id",e);if(o)throw o;t.is_active=i,V(),z()}catch(o){console.error("Failed to toggle link:",o)}}function Kt(){const e=document.getElementById("new-link-modal");e&&(document.getElementById("new-link-title").value="",document.getElementById("new-link-url").value="",document.getElementById("new-link-image").value="",e.style.display="flex",document.getElementById("new-link-title").focus())}function re(){const e=document.getElementById("new-link-modal");e&&(e.style.display="none")}async function Zt(){var o,n,a;const e=(o=document.getElementById("new-link-title"))==null?void 0:o.value.trim(),t=(n=document.getElementById("new-link-url"))==null?void 0:n.value.trim(),i=(a=document.getElementById("new-link-image"))==null?void 0:a.value.trim();if(!e){O("Please enter a title.","warning");return}if(!t){O("Please enter a URL.","warning");return}try{const l=C.reduce((c,v)=>Math.max(c,v.order_index||0),0),{data:r,error:d}=await B.from("link_items").insert({list_id:m.id,title:e,url:t,image_url:i||null,order_index:l+100,is_active:!0}).select().single();if(d)throw d;C.push(r),G=r.id,re(),V(),X(),z(),Z()}catch(l){console.error("Failed to add link:",l),O("Failed to add link: "+l.message,"error")}}let ge=[];async function ei(){const e=document.getElementById("existing-link-modal");if(!e)return;e.style.display="flex";const t=document.getElementById("existing-links-list");t&&(t.innerHTML='<p class="existing-link-empty">Loading...</p>');try{const{data:i,error:o}=await B.from("link_items").select("*, link_lists!inner(id, slug, presentation_data, owner_id)").eq("link_lists.owner_id",N.id).neq("list_id",m.id).order("created_at",{ascending:!1});if(o)throw o;ge=i||[],Ye("")}catch(i){console.error("Failed to load links:",i),t&&(t.innerHTML='<p class="existing-link-empty">Failed to load links.</p>')}}function Ye(e){const t=document.getElementById("existing-links-list");if(!t)return;const i=e.toLowerCase(),o=i?ge.filter(n=>(n.title||"").toLowerCase().includes(i)||(n.url||"").toLowerCase().includes(i)):ge;if(o.length===0){t.innerHTML=`<p class="existing-link-empty">${i?"No matches found.":"No links in other collections."}</p>`;return}t.innerHTML=o.map(n=>{var l,r,d;const a=((r=(l=n.link_lists)==null?void 0:l.presentation_data)==null?void 0:r.title)||((d=n.link_lists)==null?void 0:d.slug)||"";return`
      <div class="existing-link-item" data-link-id="${n.id}">
        <div class="link-thumb">
          ${n.image_url?`<img src="${S(n.image_url)}" alt="" onerror="this.parentElement.innerHTML='<i class=\\'fas fa-link\\' style=\\'color:#9ca3af\\'></i>'">`:'<i class="fas fa-link" style="color:#9ca3af"></i>'}
        </div>
        <div class="link-info">
          <div class="link-title">${S(n.title||"Untitled")}</div>
          <div class="link-url">${S(Je(n.url||""))}</div>
        </div>
        <span class="link-collection-name">${S(a)}</span>
      </div>
    `}).join(""),t.querySelectorAll(".existing-link-item").forEach(n=>{n.addEventListener("click",()=>ti(n.dataset.linkId))})}async function ti(e){const t=ge.find(i=>i.id===e);if(t)try{const i=C.reduce((a,l)=>Math.max(a,l.order_index||0),0),{data:o,error:n}=await B.from("link_items").insert({list_id:m.id,title:t.title,url:t.url,image_url:t.image_url,image_position:t.image_position||null,image_scale:t.image_scale||null,order_index:i+100,is_active:!0,source_link_id:e,use_library_defaults:!0}).select().single();if(n)throw n;o._resolved_title=t.title,o._resolved_image_url=t.image_url,o._resolved_image_position=t.image_position,o._resolved_image_scale=t.image_scale,C.push(o),G=o.id,pe(),V(),X(),z(),Z()}catch(i){console.error("Failed to add existing link:",i),O("Failed to add link: "+i.message,"error")}}function pe(){const e=document.getElementById("existing-link-modal");e&&(e.style.display="none"),ge=[]}let fe=null;async function Ce(e){fe=e;const t=document.getElementById("media-library-modal"),i=document.getElementById("media-library-content");if(!(!t||!i)){t.style.display="flex",i.innerHTML=`
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
          <div class="media-item" data-url="${S(n.url)}" title="${S(n.name)}">
            <img src="${S(n.url)}" alt="${S(n.name)}" loading="lazy">
            <span class="media-item-label">${S(n.category)}</span>
          </div>
        `).join("")}
      </div>
    `,i.querySelectorAll(".media-item").forEach(n=>{n.addEventListener("click",()=>{const a=n.dataset.url;fe&&fe(a),be()})})}catch(o){console.error("Failed to load media library:",o),i.innerHTML=`
      <div style="text-align:center; padding:32px; color:#ef4444;">
        <p>Failed to load images: ${S(o.message)}</p>
      </div>
    `}}}function be(){const e=document.getElementById("media-library-modal");e&&(e.style.display="none"),fe=null}let ae=null;function ii(){const e=document.getElementById("links-list");e&&e.querySelectorAll(".link-item").forEach(t=>{t.setAttribute("draggable","true"),t.addEventListener("dragstart",i=>{ae=parseInt(t.dataset.index),t.classList.add("dragging"),i.dataTransfer.effectAllowed="move"}),t.addEventListener("dragend",()=>{t.classList.remove("dragging"),e.querySelectorAll(".link-item").forEach(i=>i.classList.remove("drag-over")),ae=null}),t.addEventListener("dragover",i=>{i.preventDefault(),i.dataTransfer.dropEffect="move",e.querySelectorAll(".link-item").forEach(o=>o.classList.remove("drag-over")),t.classList.add("drag-over")}),t.addEventListener("dragleave",()=>{t.classList.remove("drag-over")}),t.addEventListener("drop",async i=>{i.preventDefault();const o=parseInt(t.dataset.index);if(ae===null||ae===o)return;const[n]=C.splice(ae,1);C.splice(o,0,n),C.forEach((a,l)=>{a.order_index=(l+1)*100}),V(),z();try{await Promise.all(C.map(a=>B.from("link_items").update({order_index:a.order_index}).eq("id",a.id)))}catch(a){console.error("Failed to save order:",a)}})})}function Re(){var r,d,c,v,E,f,w,y,T,L,P,x,u,b,q;const e=((r=document.querySelector('input[name="bg-type"]:checked'))==null?void 0:r.value)||"solid",t=((d=document.querySelector('input[name="border-type"]:checked'))==null?void 0:d.value)||"solid",i=((c=document.querySelector('input[name="border-style"]:checked'))==null?void 0:c.value)||"fill",o=((v=document.getElementById("theme-border-enabled"))==null?void 0:v.checked)||!1,n=((E=document.getElementById("theme-presentation-text"))==null?void 0:E.value)||"#1A2F5B",a=((f=document.getElementById("theme-btn-bg"))==null?void 0:f.value)||"#1A2F5B",l=((w=document.getElementById("theme-border-gradient"))==null?void 0:w.value)||"";return{backgroundType:e,backgroundColor:((y=document.getElementById("theme-bg-color"))==null?void 0:y.value)||"#ffffff",gradientText:((T=document.getElementById("theme-gradient"))==null?void 0:T.value)||"",backgroundImage:e==="image"&&(m._pendingBgImage||(m.theme||{}).backgroundImage)||"",backgroundImageX:parseInt((L=document.getElementById("bg-pos-x"))==null?void 0:L.value)||50,backgroundImageY:parseInt((P=document.getElementById("bg-pos-y"))==null?void 0:P.value)||50,backgroundImageScale:parseInt((x=document.getElementById("bg-pos-scale"))==null?void 0:x.value)||100,profileTextColor:n,presentationTextColor:n,textColor:n,presentationColor:n,profileColor:n,buttonBackgroundColor:a,buttonBgColor:a,buttonTextColor:((u=document.getElementById("theme-btn-text"))==null?void 0:u.value)||"#000000",buttonStyle:((b=document.getElementById("theme-button-style"))==null?void 0:b.value)||"soft",buttonBorderRadius:"8px",borderEnabled:o,gradientBorderEnabled:o,borderType:t,borderStyle:i,borderColor:((q=document.getElementById("theme-border-color"))==null?void 0:q.value)||"#1A2F5B",borderGradient:l,borderGradientText:l}}async function Ae(){const e=document.getElementById("saved-themes-list");if(e)try{const{data:t,error:i}=await B.from("user_themes").select("*").eq("user_id",N.id).eq("theme_type","appearance").order("created_at",{ascending:!1});if(i)throw i;if(!t||t.length===0){e.innerHTML='<p style="color:#9ca3af; font-size:0.875rem;">No saved themes yet.</p>';return}e.innerHTML=t.map(o=>`
      <div class="saved-theme-item" style="display:flex; justify-content:space-between; align-items:center; padding:8px 12px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; margin-bottom:8px;">
        <span style="font-size:0.875rem; font-weight:500; color:#1e293b;">${S(o.name||o.theme_name||"Unnamed")}</span>
        <div style="display:flex; gap:4px;">
          <button type="button" class="apply-theme-btn" data-theme-id="${o.id}" style="background:#1A2F5B; color:white; border:none; padding:4px 10px; border-radius:4px; font-size:0.75rem; cursor:pointer;">Apply</button>
          <button type="button" class="delete-theme-btn" data-theme-id="${o.id}" style="background:none; color:#ef4444; border:1px solid #ef4444; padding:4px 8px; border-radius:4px; font-size:0.75rem; cursor:pointer;"><i class="fas fa-trash"></i></button>
        </div>
      </div>
    `).join(""),e.querySelectorAll(".apply-theme-btn").forEach(o=>{o.addEventListener("click",async()=>{const n=t.find(a=>a.id===o.dataset.themeId);n&&n.theme_data&&(m.theme={...m.theme,...n.theme_data},z(),ue(document.getElementById("tab-content")))})}),e.querySelectorAll(".delete-theme-btn").forEach(o=>{o.addEventListener("click",async()=>{const n=t.find(a=>a.id===o.dataset.themeId);if(!(!n||!confirm(`Delete theme "${n.name||n.theme_name}"?`)))try{const{error:a}=await B.from("user_themes").delete().eq("id",n.id).eq("user_id",N.id);if(a)throw a;Ae()}catch(a){console.error("Failed to delete theme:",a),O("Failed to delete: "+a.message,"error")}})})}catch(t){console.error("Failed to load themes:",t),e.innerHTML='<p style="color:#ef4444; font-size:0.875rem;">Failed to load themes.</p>'}}async function oi(){const e=document.getElementById("theme-name"),t=e==null?void 0:e.value.trim();if(!t){O("Please enter a theme name.","warning");return}try{const i=Re(),{error:o}=await B.from("user_themes").insert({user_id:N.id,name:t,theme_type:"appearance",theme_data:i});if(o)throw o;e&&(e.value=""),Ae(),We("save-new-theme-btn")}catch(i){console.error("Failed to save theme:",i),O("Failed to save theme: "+i.message,"error")}}function ni(){var e,t,i,o,n,a,l,r,d,c,v,E,f,w;document.querySelectorAll(".tab").forEach(y=>{y.addEventListener("click",()=>{document.querySelectorAll(".tab").forEach(T=>T.classList.remove("active")),y.classList.add("active"),de=y.dataset.tab,X()})}),(e=document.getElementById("add-link-btn"))==null||e.addEventListener("click",Kt),(t=document.getElementById("add-existing-btn"))==null||t.addEventListener("click",ei),(i=document.getElementById("new-link-modal-close"))==null||i.addEventListener("click",re),(o=document.getElementById("new-link-cancel"))==null||o.addEventListener("click",re),(n=document.getElementById("new-link-save"))==null||n.addEventListener("click",Zt),(a=document.getElementById("new-link-modal"))==null||a.addEventListener("click",y=>{y.target.id==="new-link-modal"&&re()}),(l=document.getElementById("new-link-upload-btn"))==null||l.addEventListener("click",()=>{var y;(y=document.getElementById("new-link-image-file"))==null||y.click()}),(r=document.getElementById("new-link-image-file"))==null||r.addEventListener("change",async y=>{var x;const T=(x=y.target.files)==null?void 0:x[0];if(!T)return;const L=document.getElementById("new-link-upload-btn"),P=L==null?void 0:L.innerHTML;try{L&&(L.disabled=!0,L.innerHTML='<i class="fas fa-spinner fa-spin"></i>');const u=await Ie(T,"links",N.id,{maxWidth:800,maxHeight:800});document.getElementById("new-link-image").value=u}catch(u){console.error("Upload failed:",u),O("Upload failed: "+u.message,"error")}finally{L&&(L.disabled=!1,L.innerHTML=P)}}),(d=document.getElementById("new-link-browse-btn"))==null||d.addEventListener("click",()=>{Ce(y=>{document.getElementById("new-link-image").value=y})}),(c=document.getElementById("existing-link-modal-close"))==null||c.addEventListener("click",pe),(v=document.getElementById("existing-link-modal"))==null||v.addEventListener("click",y=>{y.target.id==="existing-link-modal"&&pe()}),(E=document.getElementById("existing-link-search"))==null||E.addEventListener("input",y=>{Ye(y.target.value)}),(f=document.getElementById("media-library-close"))==null||f.addEventListener("click",be),(w=document.getElementById("media-library-modal"))==null||w.addEventListener("click",y=>{y.target.id==="media-library-modal"&&be()}),document.addEventListener("keydown",y=>{y.key==="Escape"&&(re(),pe(),be())})}function S(e){const t=document.createElement("div");return t.textContent=e,t.innerHTML}function Je(e){try{const t=new URL(e),i=t.pathname.length>30?t.pathname.substring(0,30)+"...":t.pathname;return t.hostname+i}catch{return e.length>50?e.substring(0,50)+"...":e}}function Le(e,t){!e||!t||e.querySelectorAll(".tag-remove").forEach(i=>{i.addEventListener("click",o=>{o.stopPropagation();const n=i.dataset.tag;t.tags=(t.tags||[]).filter(a=>a!==n),e.innerHTML=ee(t.tags,{removable:!0}),Le(e,t),J.trigger()})})}function qe(e){e&&e.querySelectorAll(".tag-remove").forEach(t=>{t.addEventListener("click",i=>{i.stopPropagation();const o=t.dataset.tag,n=m.presentation_data||{};n.tags=(n.tags||[]).filter(a=>a!==o),m.presentation_data=n,ie.trigger(),e.innerHTML=ee(n.tags,{removable:!0}),qe(e)})})}function ai(){if(window.innerWidth>768)return;const e=document.createElement("div");e.className="mobile-tab-bar",e.innerHTML=`
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

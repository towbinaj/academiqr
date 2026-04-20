import{s as T}from"./supabase-whCCoo43.js";/* empty css             */import{c as We,s as N,a as ot,d as nt,e as Qe,b as at,n as lt}from"./toast-C5Ve3yOU.js";import{c as ce,r as ue,f as Ce}from"./auto-save-CVe8WLcj.js";import{h as ae,r as st,g as ke,a as Re,b as Ee,c as Ae}from"./link-utils-CD_pf_ip.js";import{i as rt,g as dt,t as ct}from"./theme-toggle-D-yRes8V.js";import{c as Me,l as ut}from"./image-utils-gR03vQbS.js";import{g as gt,r as oe,c as Ne,n as Oe,i as je}from"./tag-utils-CwIXpYMv.js";const mt="https://natzpfyxpuycsuuzbqrd.supabase.co/storage/v1/object/public/assets/AcademiQR_logo_blue.png",ee=250,X=16,U=8;let xe=null,j=null;function Xe(e){const t=document.createElement("div");return t.textContent=e,t.innerHTML}function Ie(e,t,i,o,n,a){e.beginPath(),e.moveTo(t+a,i),e.lineTo(t+o-a,i),e.arcTo(t+o,i,t+o,i+a,a),e.lineTo(t+o,i+n-a),e.arcTo(t+o,i+n,t+o-a,i+n,a),e.lineTo(t+a,i+n),e.arcTo(t,i+n,t,i+n-a,a),e.lineTo(t,i+a),e.arcTo(t,i,t+a,i,a),e.closePath()}function we(e){var i,o,n,a,l,s;const t=d=>e.querySelector(`#${d}`);return{color:((i=t("qr-color"))==null?void 0:i.value)||"#1A2F5B",bgColor:((o=t("qr-bg-color"))==null?void 0:o.value)||"#ffffff",borderEnabled:((n=t("qr-border-enabled"))==null?void 0:n.checked)||!1,borderColor:((a=t("qr-border-color"))==null?void 0:a.value)||"#000000",borderStyle:((l=t("qr-border-style"))==null?void 0:l.value)||"solid",borderRadius:parseInt(((s=t("qr-border-radius"))==null?void 0:s.value)||"16"),logo:j}}function pt(e,t){const i=t.borderEnabled?U:0,o=t.borderEnabled?t.borderRadius:16,n=document.createElement("canvas");n.width=ee,n.height=ee;const a=n.getContext("2d");if(a.clearRect(0,0,ee,ee),a.fillStyle=t.bgColor,Ie(a,i,i,e.width+X*2,e.height+X*2,o),a.fill(),t.borderEnabled){if(a.strokeStyle=t.borderColor,a.lineWidth=U,t.borderStyle==="dashed")a.setLineDash([U*2,U]);else if(t.borderStyle==="dotted")a.setLineDash([U,U]);else if(t.borderStyle==="double"){a.lineWidth=U/3;const d=U/2,u=U/2,h=e.width+X*2+U,m=e.height+X*2+U;a.strokeRect(d,u,h,m),a.strokeRect(d+U,u+U,h-U*2,m-U*2)}if(t.borderStyle!=="double"){const d=U/2,u=U/2,h=e.width+X*2+U,m=e.height+X*2+U;o>0?(Ie(a,d,u,h,m,o),a.stroke()):a.strokeRect(d,u,h,m)}a.setLineDash([])}const l=i+X,s=i+X;return a.save(),Ie(a,i,i,e.width+X*2,e.height+X*2,o),a.clip(),a.drawImage(e,l,s),a.restore(),{canvas:n,ctx:a,qrX:l,qrY:s,qrSize:e.width}}function ft(e,t,i,o,n){return new Promise(a=>{if(!t){a();return}const l=new Image;l.crossOrigin="anonymous",l.onload=()=>{const s=n*.2;let d=l.width,u=l.height;if(d>s||u>s){const _=Math.min(s/d,s/u);d*=_,u*=_}const h=i+(n-d)/2,m=o+(n-u)/2;e.fillStyle="#ffffff",e.beginPath(),e.arc(i+n/2,o+n/2,Math.max(d,u)/2+8,0,Math.PI*2),e.fill(),e.drawImage(l,h,m,d,u),a()},l.onerror=()=>a(),l.src=t})}async function se(e,t){if(typeof QRCode>"u"){console.error("[QR] QRCode.js library not loaded");return}const i=we(e),o=e.querySelector("#qr-code-container");if(!o)return;xe=null,o.innerHTML="",o.style.cssText="background:transparent; padding:0; display:flex; align-items:center; justify-content:center; width:250px; height:250px; margin:0 auto; box-sizing:border-box; border:none; border-radius:0; overflow:visible;";const n=i.borderEnabled?U:0,a=ee-n*2-X*2,l=document.createElement("div");l.style.cssText="position:absolute; left:-9999px; top:-9999px;",document.body.appendChild(l);try{xe=new QRCode(l,{text:t,width:a,height:a,colorDark:i.color,colorLight:i.bgColor,correctLevel:QRCode.CorrectLevel.H})}catch($){console.error("[QR] Generation failed:",$),o.innerHTML='<p style="color:#ef4444; font-size:0.8rem;">QR generation failed</p>',document.body.removeChild(l);return}await new Promise($=>setTimeout($,100));const s=l.querySelector("canvas");if(!s){document.body.removeChild(l);return}const{canvas:d,ctx:u,qrX:h,qrY:m,qrSize:_}=pt(s,i);await ft(u,j,h,m,_);const L=document.createElement("img");L.src=d.toDataURL("image/png");const v=i.borderEnabled?i.borderRadius:16;L.style.cssText=`width:${ee}px; height:${ee}px; display:block; margin:0 auto; border-radius:${v}px; background:transparent;`,L.alt="QR Code",L.title="Right-click to copy image",L.setAttribute("data-composite","true"),o.innerHTML="",o.appendChild(L),o._compositeCanvas=d,document.body.removeChild(l);const S=e.querySelector("#qr-actions");S&&(S.style.display="flex")}function bt(e,t,i){const o=e.querySelector("#qr-code-container");if(!o||!xe)return;const n=o.querySelector('img[data-composite="true"]');if(!n)return;const a=`${i||"qrcode"}-qrcode`;if(t==="png"||t==="jpeg"){const l=new Image;l.onload=()=>{const s=document.createElement("canvas");s.width=l.width,s.height=l.height;const d=s.getContext("2d");t==="jpeg"&&(d.fillStyle="#ffffff",d.fillRect(0,0,s.width,s.height)),d.drawImage(l,0,0);const u=document.createElement("a");u.download=`${a}.${t==="jpeg"?"jpg":"png"}`,u.href=s.toDataURL(t==="jpeg"?"image/jpeg":"image/png",.95),u.click()},l.src=n.src}else if(t==="svg"){const l=new Image;l.onload=()=>{const s=document.createElement("canvas");s.width=l.width,s.height=l.height,s.getContext("2d").drawImage(l,0,0);const u=s.toDataURL("image/png"),h=`<svg xmlns="http://www.w3.org/2000/svg" width="${s.width}" height="${s.height}" viewBox="0 0 ${s.width} ${s.height}"><image href="${u}" width="${s.width}" height="${s.height}"/></svg>`,m=new Blob([h],{type:"image/svg+xml"}),_=document.createElement("a");_.download=`${a}.svg`,_.href=URL.createObjectURL(m),_.click(),URL.revokeObjectURL(_.href)},l.src=n.src}}async function vt(e,t){const i=we(t),o={color:i.color,bgColor:i.bgColor,borderEnabled:i.borderEnabled,borderColor:i.borderColor,borderStyle:i.borderStyle,borderRadius:String(i.borderRadius),logo:j},{error:n}=await T.from("link_lists").update({qr_code_data:o,updated_at:new Date().toISOString()}).eq("id",e);return!n}async function Pe(e,t){const i=e.querySelector("#saved-qr-themes-list");if(!i)return;const{data:o,error:n}=await T.from("user_themes").select("*").eq("user_id",t).eq("theme_type","qr").order("created_at",{ascending:!1});if(n||!o||o.length===0){i.innerHTML='<p class="qr-themes-empty">No saved QR themes yet</p>';return}i.innerHTML=o.map(a=>{const l=Xe(a.name);return`
      <div class="saved-theme-item" data-theme-id="${a.id}" data-theme-name="${l}">
        <div class="saved-theme-name">${l}</div>
        <button class="btn-icon qr-theme-delete" data-theme-id="${a.id}" data-theme-name="${l}" title="Delete"><i class="fas fa-trash"></i></button>
      </div>
    `}).join("")}async function yt(e,t,i){var d;const o=e.querySelector("#qr-theme-name"),n=(d=o==null?void 0:o.value)==null?void 0:d.trim();if(!n){N("Please enter a QR theme name","warning");return}const a=we(e),l={name:n,color:a.color,bgColor:a.bgColor,borderEnabled:a.borderEnabled,borderColor:a.borderColor,borderStyle:a.borderStyle,borderRadius:String(a.borderRadius),logo:j},{data:s}=await T.from("user_themes").select("id").eq("user_id",t).eq("name",n).eq("theme_type","qr").maybeSingle();if(s){if(!confirm(`QR Theme "${n}" already exists. Overwrite?`))return;await T.from("user_themes").update({theme_data:l,updated_at:new Date().toISOString()}).eq("id",s.id)}else await T.from("user_themes").insert({user_id:t,name:n,theme_type:"qr",theme_data:l});o.value="",await Pe(e,t)}async function ht(e,t,i,o){confirm(`Delete QR Theme "${o}"?`)&&(await T.from("user_themes").delete().eq("id",i).eq("user_id",t),await Pe(e,t))}function kt(e,t,i){const o=n=>e.querySelector(`#${n}`);if(i.color&&(o("qr-color")&&(o("qr-color").value=i.color),o("qr-color-text")&&(o("qr-color-text").value=i.color)),i.bgColor&&(o("qr-bg-color")&&(o("qr-bg-color").value=i.bgColor),o("qr-bg-color-text")&&(o("qr-bg-color-text").value=i.bgColor)),i.borderEnabled!==void 0){o("qr-border-enabled")&&(o("qr-border-enabled").checked=i.borderEnabled);const n=o("qr-border-options");n&&(n.style.display=i.borderEnabled?"block":"none")}i.borderColor&&(o("qr-border-color")&&(o("qr-border-color").value=i.borderColor),o("qr-border-color-text")&&(o("qr-border-color-text").value=i.borderColor)),i.borderStyle&&o("qr-border-style")&&(o("qr-border-style").value=i.borderStyle),i.borderRadius&&o("qr-border-radius")&&(o("qr-border-radius").value=i.borderRadius),i.logo?j=i.logo:j=null,Le(e),se(e,t)}function Et(e,t,i){var a;const o=(a=i.target.files)==null?void 0:a[0];if(!o)return;if(o.size>5*1024*1024){N("Logo must be under 5 MB","warning"),i.target.value="";return}const n=new FileReader;n.onload=l=>{j=l.target.result,Le(e),se(e,t)},n.readAsDataURL(o)}function xt(e,t){j=null,Le(e);const i=e.querySelector("#qr-logo-upload");i&&(i.value=""),se(e,t)}function _t(e,t){j=mt,Le(e),se(e,t)}function Le(e){const t=e.querySelector("#qr-logo-preview"),i=e.querySelector("#qr-logo-img");j?(i&&(i.src=j),t&&(t.style.display="inline-block")):(t&&(t.style.display="none"),i&&(i.src=""))}function wt(e,t,i){const o=e.querySelector(`#${t}`),n=e.querySelector(`#${i}`);o&&n&&(n.value=o.value)}function Lt(e,t,i){const o=e.querySelector(`#${t}`),n=e.querySelector(`#${i}`);o&&n&&/^#[0-9a-fA-F]{6}$/.test(o.value)&&(n.value=o.value)}function qt(e,t,i){var v,S,$,P,E,R,g,y,q,f,k,c,p,M,A,w,C;if(!t||!i){e.innerHTML='<div class="qr-tab"><p>Please select a collection first.</p></div>';return}const o=We(i.id,t.id),n=t.qr_code_data||{};xe=null,j=n.logo||null;const a=n.color||"#1A2F5B",l=n.bgColor||"#ffffff",s=n.borderEnabled===!0||n.borderEnabled==="true",d=n.borderColor||"#000000",u=n.borderStyle||"solid",h=String(n.borderRadius||"16");e.innerHTML=`
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
              <input type="text" id="qr-url" class="form-input" value="${Xe(o)}" readonly>
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
                  <input type="color" id="qr-border-color" value="${d}" class="color-picker">
                  <input type="text" id="qr-border-color-text" value="${d}" class="color-input" maxlength="7">
                </div>
              </div>
              <div class="qr-border-inline">
                <div>
                  <label class="qr-sub-label">Style</label>
                  <select id="qr-border-style" class="form-input">
                    <option value="solid" ${u==="solid"?"selected":""}>Solid</option>
                    <option value="dashed" ${u==="dashed"?"selected":""}>Dashed</option>
                    <option value="dotted" ${u==="dotted"?"selected":""}>Dotted</option>
                    <option value="double" ${u==="double"?"selected":""}>Double</option>
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
            <div id="qr-logo-preview" class="qr-logo-preview" style="display: ${j?"inline-block":"none"};">
              <img id="qr-logo-img" src="${j||""}" alt="Logo">
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
  `;const m=()=>se(e,o);(v=e.querySelector("#qr-copy-url"))==null||v.addEventListener("click",()=>{navigator.clipboard.writeText(o).then(()=>{const r=e.querySelector("#qr-copy-url");r&&(r.innerHTML='<i class="fas fa-check"></i>',setTimeout(()=>r.innerHTML='<i class="fas fa-copy"></i>',1500))})});for(const r of["qr-color","qr-bg-color","qr-border-color"])(S=e.querySelector(`#${r}`))==null||S.addEventListener("input",()=>{wt(e,r,r+"-text"),m()});for(const[r,x]of[["qr-color-text","qr-color"],["qr-bg-color-text","qr-bg-color"],["qr-border-color-text","qr-border-color"]])($=e.querySelector(`#${r}`))==null||$.addEventListener("input",()=>{Lt(e,r,x),m()});(P=e.querySelector("#qr-border-enabled"))==null||P.addEventListener("change",r=>{const x=e.querySelector("#qr-border-options");x&&(x.style.display=r.target.checked?"block":"none"),m()});for(const r of["qr-border-style","qr-border-radius"])(E=e.querySelector(`#${r}`))==null||E.addEventListener("change",m);const _=ce(async()=>{if(!e.querySelector("#qr-color"))return!1;const r=await vt(t.id,e);if(r){const x=we(e);t.qr_code_data={color:x.color,bgColor:x.bgColor,borderEnabled:x.borderEnabled,borderColor:x.borderColor,borderStyle:x.borderStyle,borderRadius:String(x.borderRadius),logo:j}}return r},{statusSelector:"#qr-save-status"});ue(_);const L=()=>_.trigger();for(const r of["qr-color","qr-bg-color","qr-border-color"])(R=e.querySelector(`#${r}`))==null||R.addEventListener("input",L);for(const r of["qr-color-text","qr-bg-color-text","qr-border-color-text"])(g=e.querySelector(`#${r}`))==null||g.addEventListener("input",L);(y=e.querySelector("#qr-border-enabled"))==null||y.addEventListener("change",L);for(const r of["qr-border-style","qr-border-radius"])(q=e.querySelector(`#${r}`))==null||q.addEventListener("change",L);(f=e.querySelector("#qr-logo-upload-btn"))==null||f.addEventListener("click",()=>{var r;(r=e.querySelector("#qr-logo-upload"))==null||r.click()}),(k=e.querySelector("#qr-logo-upload"))==null||k.addEventListener("change",r=>{Et(e,o,r),L()}),(c=e.querySelector("#qr-logo-default-btn"))==null||c.addEventListener("click",()=>{_t(e,o),L()}),(p=e.querySelector("#qr-logo-remove"))==null||p.addEventListener("click",()=>{xt(e,o),L()}),(M=e.querySelector("#qr-actions"))==null||M.addEventListener("click",r=>{const x=r.target.closest("button[data-format]");x&&bt(e,x.dataset.format,t.slug)}),(A=e.querySelector("#qr-theme-toggle"))==null||A.addEventListener("click",()=>{const r=e.querySelector("#qr-theme-content"),x=e.querySelector("#qr-theme-toggle .section-chevron");if(r){const D=r.style.display!=="none";r.style.display=D?"none":"block",x&&x.classList.toggle("collapsed",D)}}),(w=e.querySelector("#qr-theme-save-btn"))==null||w.addEventListener("click",()=>{yt(e,i.id)}),(C=e.querySelector("#saved-qr-themes-list"))==null||C.addEventListener("click",async r=>{const x=r.target.closest(".qr-theme-delete");if(x){r.stopPropagation(),await ht(e,i.id,x.dataset.themeId,x.dataset.themeName);return}const D=r.target.closest(".saved-theme-item");if(D){const{data:ie}=await T.from("user_themes").select("theme_data").eq("id",D.dataset.themeId).single();ie!=null&&ie.theme_data&&kt(e,o,ie.theme_data)}}),se(e,o),Pe(e,i.id)}function be(e){const t=document.createElement("div");return t.textContent=e,t.innerHTML}const $t={instagram:"Instagram",facebook:"Facebook",twitter:"X (Twitter)",linkedin:"LinkedIn",youtube:"YouTube",tiktok:"TikTok",snapchat:"Snapchat",email:"Email"};function It(){const e=new Date,t=new Date;return t.setDate(t.getDate()-30),{from:t.toISOString().slice(0,10),to:e.toISOString().slice(0,10)}}function Ge(e,t=!1){const[i,o,n]=e.split("-").map(Number);return t?new Date(i,o-1,n,23,59,59,999).toISOString():new Date(i,o-1,n,0,0,0,0).toISOString()}async function St(e,t,i,o){var w,C;const n=i?Ge(i):null,a=o?Ge(o,!0):null;function l(r,x){return n&&(r=r.gte(x,n)),a&&(r=r.lte(x,a)),r}let s=T.from("link_clicks").select("*",{count:"exact",head:!0}).eq("owner_id",e).eq("list_id",t).not("link_id","is",null);s=l(s,"clicked_at");const{count:d}=await s;let u=T.from("page_views").select("*",{count:"exact",head:!0}).eq("owner_id",e).eq("list_id",t);u=l(u,"viewed_at");const{count:h}=await u;let m=T.from("page_views").select("session_id").eq("owner_id",e).eq("list_id",t);m=l(m,"viewed_at");const{data:_}=await m,L=_?new Set(_.map(r=>r.session_id).filter(Boolean)).size:0;let v=T.from("link_clicks").select("link_id, link_items:link_id (title, url)").eq("owner_id",e).eq("list_id",t).not("link_id","is",null);v=l(v,"clicked_at");const{data:S}=await v,$={};if(S)for(const r of S)$[r.link_id]||($[r.link_id]={title:((w=r.link_items)==null?void 0:w.title)||"Unknown Link",url:((C=r.link_items)==null?void 0:C.url)||"",clicks:0}),$[r.link_id].clicks++;const P=Object.values($).sort((r,x)=>x.clicks-r.clicks);let E=T.from("link_clicks").select("social_platform").eq("owner_id",e).eq("list_id",t);E=l(E,"clicked_at");const{data:R}=await E,g={};if(R)for(const r of R){if(!r.social_platform)continue;const x=r.social_platform.toLowerCase();g[x]||(g[x]={platform:x,clicks:0}),g[x].clicks++}const y=Object.values(g).sort((r,x)=>x.clicks-r.clicks),q=y.reduce((r,x)=>r+x.clicks,0);let f=T.from("page_views").select("viewed_at").eq("owner_id",e).eq("list_id",t);f=l(f,"viewed_at");const{data:k}=await f,c={};if(k)for(const r of k){const x=(r.viewed_at||r.created_at||"").substring(0,10);x&&(c[x]=(c[x]||0)+1)}let p=T.from("link_clicks").select("clicked_at").eq("owner_id",e).eq("list_id",t).not("link_id","is",null);p=l(p,"clicked_at");const{data:M}=await p,A={};if(M)for(const r of M){const x=(r.clicked_at||r.created_at||"").substring(0,10);x&&(A[x]=(A[x]||0)+1)}return{totalClicks:d||0,totalViews:h||0,uniqueVisitors:L,totalSocialClicks:q,linkBreakdown:P,socialBreakdown:y,dailyViews:c,dailyClicks:A}}function Tt(e,t){const i=e.querySelector("#links-breakdown-list");if(!i)return;if(!t||t.length===0){i.innerHTML='<p class="analytics-empty"><i class="fas fa-chart-bar" style="opacity:0.3; font-size:1.5rem; display:block; margin-bottom:8px;"></i>No link clicks yet. Share your collection to start seeing analytics.</p>';return}const o=Math.max(...t.map(n=>n.clicks));i.innerHTML=t.map(n=>{const a=o>0?n.clicks/o*100:0,l=n.url.length>50?n.url.substring(0,50)+"...":n.url;return`
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
    `}).join("")}}function Ct(e,t){const i=(o,n)=>{const a=e.querySelector(`#${o}`);a&&(a.textContent=n)};i("stat-total-views",t.totalViews),i("stat-link-clicks",t.totalClicks),i("stat-social-clicks",t.totalSocialClicks),i("stat-unique-visitors",t.uniqueVisitors)}function Rt(e,t,i,o,n){const a=e.querySelector("#analytics-chart");if(!a)return;const l=a.getContext("2d"),s=window.devicePixelRatio||1,u=a.parentElement.getBoundingClientRect().width||600,h=200;a.width=u*s,a.height=h*s,a.style.width=u+"px",a.style.height=h+"px",l.scale(s,s);const m=new Date(o||Date.now()-30*864e5),_=new Date(n||Date.now()),L=[],v=new Date(m);for(;v<=_;)L.push(v.toISOString().substring(0,10)),v.setDate(v.getDate()+1);if(L.length===0)return;const S=L.map(w=>t[w]||0),$=L.map(w=>i[w]||0),P=Math.max(...S,...$,1),E={top:20,right:16,bottom:32,left:40},R=u-E.left-E.right,g=h-E.top-E.bottom,y=document.documentElement.getAttribute("data-theme")==="dark",q=y?"rgba(255,255,255,0.1)":"#e2e8f0",f="#94a3b8",k=y?"rgba(147, 197, 253, 1)":"rgba(26, 47, 91, 1)",c=y?"rgba(74, 222, 128, 1)":"rgba(34, 197, 94, 1)",p=y?"#cbd5e1":void 0;l.clearRect(0,0,u,h),l.strokeStyle=q,l.lineWidth=.5;for(let w=0;w<=4;w++){const C=E.top+g/4*w;l.beginPath(),l.moveTo(E.left,C),l.lineTo(u-E.right,C),l.stroke()}l.fillStyle=f,l.font="10px Inter, sans-serif",l.textAlign="right";for(let w=0;w<=4;w++){const C=Math.round(P*(4-w)/4),r=E.top+g/4*w+3;l.fillText(C.toString(),E.left-6,r)}l.textAlign="center";const M=Math.max(1,Math.floor(L.length/6));for(let w=0;w<L.length;w+=M){const C=E.left+R/(L.length-1||1)*w,r=L[w].split("-");l.fillText(`${r[1]}/${r[2]}`,C,h-8)}function A(w,C){if(!(w.length<2)){l.strokeStyle=C,l.lineWidth=2,l.lineJoin="round",l.beginPath();for(let r=0;r<w.length;r++){const x=E.left+R/(w.length-1||1)*r,D=E.top+g-w[r]/P*g;r===0?l.moveTo(x,D):l.lineTo(x,D)}l.stroke(),l.lineTo(E.left+R,E.top+g),l.lineTo(E.left,E.top+g),l.closePath(),l.fillStyle=C.replace("1)",y?"0.15)":"0.08)"),l.fill()}}A(S,k),A($,c),l.font="11px Inter, sans-serif",l.fillStyle=k,l.fillRect(E.left,4,12,3),l.fillStyle=p||k,l.fillText("Views",E.left+40,10),l.fillStyle=c,l.fillRect(E.left+80,4,12,3),l.fillStyle=p||c,l.fillText("Clicks",E.left+120,10)}function At(e,t,i){var a,l;if(!t||!i){e.innerHTML='<div class="analytics-tab"><p>Please select a collection first.</p></div>';return}const o=It();e.innerHTML=`
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
  `;const n=async()=>{var h,m;const s=((h=e.querySelector("#analytics-date-from"))==null?void 0:h.value)||"",d=((m=e.querySelector("#analytics-date-to"))==null?void 0:m.value)||"",u=e.querySelector("#analytics-refresh");u&&(u.disabled=!0,u.innerHTML='<i class="fas fa-spinner fa-spin"></i> Loading...');try{const _=await St(i.id,t.id,s,d);Ct(e,_),Rt(e,_.dailyViews,_.dailyClicks,s,d),Tt(e,_.linkBreakdown),Bt(e,_.socialBreakdown)}catch(_){console.error("[Analytics] Failed to load:",_)}u&&(u.disabled=!1,u.innerHTML='<i class="fas fa-sync-alt"></i> Apply')};(a=e.querySelector("#analytics-refresh"))==null||a.addEventListener("click",n);for(const[s,d]of[["chart-toggle","chart-content"],["links-breakdown-toggle","links-breakdown-content"],["social-breakdown-toggle","social-breakdown-content"]])(l=e.querySelector(`#${s}`))==null||l.addEventListener("click",()=>{const u=e.querySelector(`#${d}`),h=e.querySelector(`#${s} .section-chevron`);if(u){const m=u.style.display!=="none";u.style.display=m?"none":"block",h&&h.classList.toggle("collapsed",m)}});n()}let O=null,b=null,F=null,B=[],V=null,me="details",K=[],le=null,ne=null,Z=null,_e=null;const Ye='<svg class="section-chevron" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>',Je='<svg class="section-chevron collapsed" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>',Mt={backgroundType:"solid",backgroundColor:"#ffffff",gradientText:"",backgroundImage:"",backgroundImageX:50,backgroundImageY:50,backgroundImageScale:100,profileTextColor:"#1A2F5B",presentationTextColor:"#1A2F5B",buttonTextColor:"#000000",buttonBackgroundColor:"#1A2F5B",buttonStyle:"soft",buttonBorderRadius:"8px",buttonPadding:"12px 24px",buttonFontSize:"16px",buttonFontWeight:"500",textFontSize:"18px",textFontWeight:"600",borderEnabled:!0,borderType:"gradient",borderStyle:"thin",borderColor:"#1A2F5B",borderWidth:"1px",borderGradient:"linear-gradient(186deg, #D54070 0%, #8F4469 20%, #CA5699 40%, #59B8DA 60%, #9AD0DD 80%, #73B44A 100%)"};function Ke(e){const t=document.getElementById(e);if(!t)return;const i=t.textContent;t.textContent="✓ Saved",setTimeout(()=>{t.textContent=i},1500)}function qe(e=50,t=50,i=100){return`object-fit: ${i<100?"contain":"cover"}; object-position: ${e}% ${t}%; transform: scale(${i/100}); transform-origin: ${e}% ${t}%;`}function Ze(e){e.querySelectorAll(".section-header").forEach(t=>{t.addEventListener("click",()=>{const i=t.dataset.section,o=document.getElementById(i),n=t.querySelector(".section-chevron");o&&n&&(o.classList.toggle("collapsed"),n.classList.toggle("collapsed"))})})}async function Pt(){var t;if(O=await ot(),!O)return;const e=nt("id");if(!e){Qe();return}if(Ht(),await Promise.all([Ft(e),Ut()]),!b){N("Collection not found","error"),Qe();return}await Dt(),te(),gt(T,O.id).then(i=>{K=i}),Y(),z(),li(),si(),le=ce(async()=>{try{Se();const{error:i}=await T.from("link_lists").update({presentation_data:b.presentation_data}).eq("id",b.id);if(i)throw i;return te(),!0}catch(i){return console.error("Auto-save presentation failed:",i),!1}},{statusSelector:"#presentation-save-status"}),ne=ce(async()=>{var i,o,n;try{const a=((i=document.getElementById("collection-visibility"))==null?void 0:i.value)||"public",l=(o=document.getElementById("collection-passkey"))==null?void 0:o.value.trim(),s=((n=document.getElementById("collection-slug"))==null?void 0:n.value.trim().toLowerCase().replace(/[^a-z0-9-]/g,""))||b.slug,d={visibility:a,slug:s};a==="passkey"&&l?d.passkey_hash=l:a!=="passkey"&&(d.passkey_hash=null);const{error:u}=await T.from("link_lists").update(d).eq("id",b.id);if(u)throw u;return b.visibility=a,b.slug=s,d.passkey_hash!==void 0&&(b.passkey_hash=d.passkey_hash),te(),!0}catch(a){return console.error("Auto-save settings failed:",a),!1}},{statusSelector:"#settings-save-status"}),Z=ce(async()=>{var o,n,a,l,s,d,u,h;const i=V;if(!i)return!1;try{const m=B.find(k=>k.id===i);if(!m)return!1;const _=(o=document.getElementById("link-title"))==null?void 0:o.value.trim(),L=(n=document.getElementById("link-url"))==null?void 0:n.value.trim(),v=(a=document.getElementById("link-image"))==null?void 0:a.value.trim(),S=!!m.source_link_id,$=ae(m),P=S?!m.use_library_defaults:$,E=S&&m.use_library_defaults,R=E?((l=m.image_position)==null?void 0:l.x)??50:parseInt((s=document.getElementById("link-img-pos-x"))==null?void 0:s.value)||50,g=E?((d=m.image_position)==null?void 0:d.y)??50:parseInt((u=document.getElementById("link-img-pos-y"))==null?void 0:u.value)||50,y=E?m.image_scale??100:parseInt((h=document.getElementById("link-img-scale"))==null?void 0:h.value)||100,q={url:L,use_library_defaults:!!m.use_library_defaults};m.tags&&m.tags.length>0&&(q.tags=m.tags),P&&!S?q.custom_overrides={title:_,image_url:v||null,image_position:{x:R,y:g},image_scale:y}:E||(q.title=_,q.image_url=v||null,q.image_position={x:R,y:g},q.image_scale=y,q.custom_overrides=null);const{error:f}=await T.from("link_items").update({...q,updated_at:new Date().toISOString()}).eq("id",i);if(f)throw f;return Object.assign(m,q),W(),z(),!0}catch(m){return console.error("Auto-save link failed:",m),!1}},{statusSelector:"#link-save-status"}),_e=ce(async()=>{try{const i=De(),o={...b.theme,...i},{error:n}=await T.from("link_lists").update({theme:o}).eq("id",b.id);if(n)throw n;return b.theme=o,z(),!0}catch(i){return console.error("Auto-save theme failed:",i),!1}},{statusSelector:"#theme-save-status"}),ue(le),ue(ne),ue(Z),ue(_e),window.addEventListener("beforeunload",()=>{Ce()}),sessionStorage.setItem("academiqr-last-collection",JSON.stringify({id:b.id,title:((t=b.presentation_data)==null?void 0:t.title)||"Untitled Collection"}))}function Ht(){var i;const e=document.getElementById("main-nav");if(!e)return;e.innerHTML=`
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
  `,(i=document.getElementById("sign-out-btn"))==null||i.addEventListener("click",async()=>{await at(),lt("login")}),rt();const t=document.getElementById("theme-toggle-btn");t&&(t.querySelector("i").className=(dt()==="dark","fas fa-circle-half-stroke"),t.addEventListener("click",()=>{const o=ct();t.querySelector("i").className="fas fa-circle-half-stroke"}))}async function Ft(e){try{const{data:t,error:i}=await T.from("link_lists").select("*").eq("id",e).eq("owner_id",O.id).single();if(i)throw i;b=t}catch(t){console.error("Failed to load collection:",t),b=null}}async function Dt(){if(b)try{const{data:e,error:t}=await T.from("link_items").select("*, source_link_id, use_library_defaults").eq("list_id",b.id).order("order_index",{ascending:!0});if(t)throw t;B=e||[],B.sort((i,o)=>{const n=i.order_index??1/0,a=o.order_index??1/0;return n!==a?n-a:new Date(i.created_at||0)-new Date(o.created_at||0)}),await st(B)}catch(e){console.error("Failed to load links:",e),B=[]}}async function Ut(){try{const{data:e,error:t}=await T.from("profiles").select("display_name, username, profile_photo, profile_photo_position, social_order, social_website, social_email, social_instagram, social_facebook, social_twitter, social_linkedin, social_youtube, social_tiktok, social_snapchat, social_google_scholar, social_orcid, social_researchgate").eq("id",O.id).single();if(t)throw t;F=e}catch(e){console.error("Failed to load profile:",e),F={}}}function te(){const e=b.presentation_data||{},t=e.title||"Untitled Collection";document.getElementById("collection-title").textContent=t;const i=document.getElementById("collection-meta");if(i){const o=e.conference||"";i.innerHTML=`
      ${o?`<span class="meta-item"><i class="fas fa-building"></i> ${I(o)}</span>`:""}
      <span class="meta-item"><i class="fas fa-list"></i> ${B.length} link${B.length!==1?"s":""}</span>
    `}W()}function W(){const e=document.getElementById("links-list");if(e){if(B.length===0){e.innerHTML=`
      <div class="empty-links">
        <i class="fas fa-link"></i>
        <p>No links yet. Add your first link!</p>
      </div>
    `;return}e.innerHTML=B.map((t,i)=>{const o=t.id===V,n=t.is_active!==!1;return`
      <div class="link-item ${o?"selected":""} ${n?"":"inactive"}"
           data-link-id="${t.id}" data-index="${i}">
        <div class="link-drag-handle" title="Drag to reorder">
          <i class="fas fa-grip-vertical"></i>
        </div>
        ${ke(t)?`
          <div class="link-thumb">
            <img src="${I(ke(t))}" alt="" loading="lazy"
                 style="${qe(Ee(t).x,Ee(t).y,Re(t))}"
                 onerror="this.parentElement.innerHTML='<i class=\\'fas fa-image\\'></i>'">
          </div>
        `:`
          <div class="link-thumb link-thumb-empty">
            <i class="fas fa-link"></i>
          </div>
        `}
        <div class="link-info">
          <div class="link-title">${I(Ae(t)||"Untitled Link")}${t.use_library_defaults&&t.source_link_id?' <i class="fas fa-link" style="font-size:0.6rem; opacity:0.5;" title="Using library version"></i>':""}</div>
          <div class="link-url">${I(tt(t.url||""))}</div>
        </div>
        <div class="link-actions">
          <button class="btn-icon link-toggle" data-link-id="${t.id}" title="${n?"Active":"Inactive"}">
            <i class="fas ${n?"fa-toggle-on":"fa-toggle-off"}"></i>
          </button>
        </div>
      </div>
    `}).join(""),e.querySelectorAll(".link-item").forEach(t=>{t.addEventListener("click",i=>{i.target.closest(".link-toggle")||i.target.closest(".link-drag-handle")||(V=t.dataset.linkId,W(),Y(),zt())})}),e.querySelectorAll(".link-toggle").forEach(t=>{t.addEventListener("click",i=>{i.stopPropagation(),Zt(t.dataset.linkId)})}),ni()}}function zt(){setTimeout(()=>{const e=document.getElementById("link-editor-section");e&&(e.style.display="block",e.scrollIntoView({behavior:"smooth",block:"start"}))},50)}function Y(){const e=document.getElementById("tab-content");if(e)switch(me){case"details":Qt(e);break;case"appearance":pe(e);break;case"qr-code":Wt(e);break;case"analytics":Xt(e);break}}function Qt(e){var u,h,m,_,L,v,S,$,P,E,R;const t=b.presentation_data||{},i=Ye,o=b.visibility||"public",n=!!b.passkey_hash;let a=`
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
        ${Je}
      </div>
      <div class="section-content collapsed" id="settings-section">
        <div class="form-group">
          <label for="collection-slug">Collection URL Slug</label>
          <div class="slug-input-row">
            <span class="slug-prefix">${F!=null&&F.username?`academiqr.com/u/${I(F.username)}/`:"slug: "}</span>
            <input type="text" id="collection-slug" value="${I(b.slug||"")}" placeholder="my-collection" maxlength="60">
          </div>
          <p id="slug-status" style="font-size:0.75rem; margin-top:4px; min-height:1.2em; color:#9ca3af;"></p>
        </div>
        <div class="form-group">
          <label>Public Link</label>
          <div style="display:flex; align-items:center; gap:8px; background:#f8fafc; padding:10px 14px; border-radius:8px; border:1px solid #e2e8f0;">
            <i class="fas fa-link" style="color:#9ca3af; font-size:0.75rem;"></i>
            <span id="public-link-preview" style="color:#64748b; font-size:0.8rem; word-break:break-all;">${F!=null&&F.username&&b.slug?`academiqr.com/u/${I(F.username)}/${I(b.slug)}`:`academiqr.com/public.html?collection=${b.id.substring(0,8)}...`}</span>
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
  `;if(V){const g=B.find(y=>y.id===V);if(g){const y=!!g.source_link_id,q=ae(g),f=y?!g.use_library_defaults:q,k=y&&g.use_library_defaults,c=f&&q?g.custom_overrides.title??g.title??"":g.title||"",p=f&&q?g.custom_overrides.image_url??g.image_url??"":g.image_url||"",M=Ae(g)||"",A=ke(g)||"",w=k?Ee(g):f&&q&&g.custom_overrides.image_position?g.custom_overrides.image_position:g.image_position||g.imagePosition||{x:50,y:50},C=k?Re(g):f&&q&&g.custom_overrides.image_scale!=null?g.custom_overrides.image_scale:g.image_scale??g.imageScale??100,r=k?A:p;a+=`
    <!-- ═══ EDIT LINK ═══ -->
    <div class="section">
      <div class="section-header" data-section="link-editor-section">
        <h3>Edit Link <span id="link-save-status" class="auto-save-status"></span></h3>
        ${i}
      </div>
      <div class="section-content" id="link-editor-section">
        <div class="link-editor">
          <div class="link-editor-header" style="margin-bottom:12px;">
            <span style="font-size:0.875rem; color:#64748b;">Editing: <strong>${I(M||"Untitled")}</strong></span>
            <button class="btn-danger btn-sm" id="delete-link-btn" data-link-id="${g.id}">
              <i class="fas fa-trash"></i> Delete
            </button>
          </div>

          <!-- Library / Customize toggle (all links) -->
          <div class="link-source-toggle">
            <div class="source-toggle-options">
              <label class="source-toggle-option ${f?"":"active"}">
                <input type="radio" name="link-source-mode" value="library" ${f?"":"checked"}>
                <i class="fas fa-book"></i> Use Library Version
              </label>
              <label class="source-toggle-option ${f?"active":""}">
                <input type="radio" name="link-source-mode" value="custom" ${f?"checked":""}>
                <i class="fas fa-pen"></i> Customize for This Collection
              </label>
            </div>
            ${f?`
              <p class="source-toggle-hint"><i class="fas fa-info-circle"></i> This link has custom title/image for this collection only.</p>
            `:`
              <p class="source-toggle-hint"><i class="fas fa-info-circle"></i> ${y?"Title and image sync with the library version. Changes in the library will appear here automatically.":"Editing title or image here will also update in your Link Library."}</p>
            `}
          </div>

          <div class="form-group">
            <label for="link-title">Title</label>
            <input type="text" id="link-title" value="${I(k?M:c)}" placeholder="Link title" ${k?"disabled":""}>
          </div>

          <div class="form-group">
            <label for="link-url">URL</label>
            <input type="url" id="link-url" value="${I(g.url||"")}" placeholder="https://...">
          </div>

          <div class="form-group">
            <label for="link-image">Image URL</label>
            <div class="image-input-row">
              <input type="text" id="link-image" value="${I(r||"")}" placeholder="Image URL or upload" ${k?"disabled":""}>
              <button class="btn-secondary" id="upload-image-btn" ${k?"disabled":""}><i class="fas fa-upload"></i> Upload</button>
              <button class="btn-secondary" id="browse-media-btn" ${k?"disabled":""}><i class="fas fa-images"></i> Browse</button>
              <input type="file" id="link-image-file" accept="image/*" style="display:none;">
            </div>
            ${r?`
              <div class="image-preview" style="margin-top:12px;">
                <img src="${I(r)}" alt="Preview"
                     style="${qe(w.x,w.y,C)}"
                     onerror="this.style.display='none'">
              </div>
              ${k?"":`
              <div class="form-group" style="margin-top:8px;">
                <label>Image Position X</label>
                <input type="range" id="link-img-pos-x" min="0" max="100" value="${w.x??50}" class="range-input">
              </div>
              <div class="form-group">
                <label>Image Position Y</label>
                <input type="range" id="link-img-pos-y" min="0" max="100" value="${w.y??50}" class="range-input">
              </div>
              <div class="form-group">
                <label>Image Scale</label>
                <input type="range" id="link-img-scale" min="50" max="300" value="${C}" class="range-input">
              </div>
              `}
            `:""}
          </div>

          <div class="form-group">
            <label>Tags</label>
            <div id="link-tags-display" style="display:flex; flex-wrap:wrap; gap:4px; margin-bottom:6px;">
              ${oe(g.tags||[],{removable:!0})}
            </div>
            <div id="link-tag-input-container"></div>
          </div>

          ${f?`
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
    `;e.innerHTML=a,["info-title","info-conference","info-location","info-date"].forEach(g=>{var y;(y=document.getElementById(g))==null||y.addEventListener("input",()=>{Se(),z(),le.trigger()})}),["display-title","display-conference"].forEach(g=>{var y;(y=document.getElementById(g))==null||y.addEventListener("change",()=>{Se(),z(),le.trigger()})});const l=e.querySelector(".editor-tags-container"),s=document.getElementById("editor-tag-input-container");if(s){const g=(b.presentation_data||{}).tags||[];Ne(s,K,g,async y=>{const q=b.presentation_data||{};q.tags=Oe([...q.tags||[],y]),b.presentation_data=q,K.includes(y)||(K.push(y),K.sort(),je()),le.trigger(),l&&(l.innerHTML=oe(q.tags,{removable:!0})),Be(l)})}Be(l),(u=document.getElementById("copy-link-btn"))==null||u.addEventListener("click",Nt);const d=b.slug||"";if((h=document.getElementById("collection-slug"))==null||h.addEventListener("input",g=>{const y=g.target.value.toLowerCase().replace(/[^a-z0-9-]/g,"");g.target.value=y;const q=document.getElementById("public-link-preview"),f=document.getElementById("slug-status");q&&(F!=null&&F.username)&&y?q.textContent=`academiqr.com/u/${F.username}/${y}`:q&&y&&(q.textContent=`academiqr.com/public.html?collection=${b.id.substring(0,8)}...`),f&&d&&y!==d?f.innerHTML='<span style="color:#dc2626;"><i class="fas fa-exclamation-triangle"></i> Changing this slug will break any QR codes or shared links that use the current short URL.</span>':f&&(f.textContent=""),d&&y!==d||ne.trigger()}),(m=document.getElementById("collection-slug"))==null||m.addEventListener("blur",()=>{var y;const g=((y=document.getElementById("collection-slug"))==null?void 0:y.value.trim().toLowerCase().replace(/[^a-z0-9-]/g,""))||"";if(d&&g!==d&&g)if(confirm(`You are changing this collection's URL slug.

Any QR codes or shared links using the short URL format will stop working.
(Note: QR codes using the legacy ?collection= format will still work.)

Continue?`))ne.trigger();else{document.getElementById("collection-slug").value=d;const f=document.getElementById("public-link-preview");f&&(F!=null&&F.username)&&d&&(f.textContent=`academiqr.com/u/${F.username}/${d}`);const k=document.getElementById("slug-status");k&&(k.textContent="")}}),(_=document.getElementById("collection-visibility"))==null||_.addEventListener("change",g=>{const y=document.getElementById("passkey-group");y&&(y.style.display=g.target.value==="passkey"?"block":"none"),ne.trigger()}),(L=document.getElementById("collection-passkey"))==null||L.addEventListener("input",()=>{ne.trigger()}),V){const g=V;(v=document.getElementById("delete-link-btn"))==null||v.addEventListener("click",()=>Kt(g)),["link-title","link-url","link-image"].forEach(f=>{var k;(k=document.getElementById(f))==null||k.addEventListener("input",()=>{Z.trigger()})});const y=document.getElementById("link-tags-display"),q=document.getElementById("link-tag-input-container");if(q){const f=B.find(k=>k.id===g);if(f){const k=f.tags||[];Ne(q,K,k,async c=>{f.tags=Oe([...f.tags||[],c]),y&&(y.innerHTML=oe(f.tags,{removable:!0}),Te(y,f)),K.includes(c)||(K.push(c),K.sort(),je()),Z.trigger()}),Te(y,f)}}document.querySelectorAll('input[name="link-source-mode"]').forEach(f=>{f.addEventListener("change",k=>{const c=B.find(M=>M.id===g);if(!c)return;const p=k.target.value==="library";c.source_link_id?c.use_library_defaults=p:p?c.custom_overrides=null:c.custom_overrides={title:c.title||"",image_url:c.image_url||null,image_position:c.image_position||{x:50,y:50},image_scale:c.image_scale??100},Y(),W(),z()})}),(S=document.getElementById("save-as-library-btn"))==null||S.addEventListener("click",()=>Jt(g)),($=document.getElementById("upload-image-btn"))==null||$.addEventListener("click",()=>{var f;(f=document.getElementById("link-image-file"))==null||f.click()}),(P=document.getElementById("link-image-file"))==null||P.addEventListener("change",Ot),(E=document.getElementById("browse-media-btn"))==null||E.addEventListener("click",()=>{Fe(f=>{const k=document.getElementById("link-image");k&&(k.value=f);const c=B.find(p=>p.id===g);c&&(ae(c)?c.custom_overrides.image_url=f:c.image_url=f,z(),W(),Y(),Z.trigger())})}),(R=document.getElementById("link-image"))==null||R.addEventListener("input",()=>{var c;const f=(c=document.getElementById("link-image"))==null?void 0:c.value.trim(),k=B.find(p=>p.id===g);k&&(ae(k)?k.custom_overrides.image_url=f||null:k.image_url=f||null,z(),W(),Z.trigger())}),["link-img-pos-x","link-img-pos-y","link-img-scale"].forEach(f=>{var k;(k=document.getElementById(f))==null||k.addEventListener("input",()=>{jt(),Z.trigger()})})}Ze(e)}function Se(){var t,i,o,n,a,l;const e=b.presentation_data||{};e.title=((t=document.getElementById("info-title"))==null?void 0:t.value)||"",e.conference=((i=document.getElementById("info-conference"))==null?void 0:i.value)||"",e.location=((o=document.getElementById("info-location"))==null?void 0:o.value)||"",e.date=((n=document.getElementById("info-date"))==null?void 0:n.value)||"",e.displayTitle=((a=document.getElementById("display-title"))==null?void 0:a.checked)??!0,e.displayConference=((l=document.getElementById("display-conference"))==null?void 0:l.checked)??!0,b.presentation_data=e}function Nt(){const e=We(O.id,b.id,{username:F==null?void 0:F.username,slug:b.slug});navigator.clipboard.writeText(e).then(()=>{const t=document.getElementById("copy-link-btn");t&&(t.innerHTML='<i class="fas fa-check"></i>',setTimeout(()=>{t.innerHTML='<i class="fas fa-copy"></i>'},1500))}).catch(()=>{prompt("Copy this link:",e)})}async function Ot(e){var n;const t=(n=e.target.files)==null?void 0:n[0];if(!t)return;const i=document.getElementById("upload-image-btn"),o=i==null?void 0:i.innerHTML;try{i&&(i.disabled=!0,i.innerHTML='<i class="fas fa-spinner fa-spin"></i> Uploading...');const a=await Me(t,"links",O.id,{maxWidth:1200,maxHeight:1200,quality:.75}),l=document.getElementById("link-image");l&&(l.value=a);const s=B.find(d=>d.id===V);s&&(ae(s)?s.custom_overrides.image_url=a:s.image_url=a,z(),W(),Z.trigger())}catch(a){console.error("Image upload failed:",a),N("Image upload failed: "+a.message,"error")}finally{i&&(i.disabled=!1,i.innerHTML=o)}}function jt(){var a,l,s;const e=B.find(d=>d.id===V);if(!e)return;const t=parseInt((a=document.getElementById("link-img-pos-x"))==null?void 0:a.value)||50,i=parseInt((l=document.getElementById("link-img-pos-y"))==null?void 0:l.value)||50,o=parseInt((s=document.getElementById("link-img-scale"))==null?void 0:s.value)||100;ae(e)?(e.custom_overrides.image_position={x:t,y:i},e.custom_overrides.image_scale=o):(e.image_position={x:t,y:i},e.image_scale=o);const n=document.querySelector(".image-preview img");n&&(n.style.cssText=qe(t,i,o)),z()}function He(e){if(!e||typeof e=="object"&&Object.keys(e).length===0)return{...Mt};if(typeof e=="string")try{e=JSON.parse(e)}catch{return He(null)}const t=e.borderEnabled!==void 0?!!e.borderEnabled:e.gradientBorderEnabled!==void 0?!!e.gradientBorderEnabled:!0,i=[e.textColor,e.presentationTextColor,e.profileTextColor,e.presentationColor,e.profileColor].find(n=>typeof n=="string"&&n.length>0)||"#1A2F5B";return{backgroundType:e.backgroundType||"solid",backgroundColor:e.backgroundColor||"#ffffff",gradientText:e.gradientText||"",backgroundImage:e.backgroundImage||"",backgroundImageX:e.backgroundImageX??e.imagePositionX??50,backgroundImageY:e.backgroundImageY??e.imagePositionY??50,backgroundImageScale:e.backgroundImageScale??e.imageScale??100,profileTextColor:i,presentationTextColor:i,buttonTextColor:e.buttonTextColor||"#000000",buttonBackgroundColor:e.buttonBackgroundColor||e.buttonBgColor||"#1A2F5B",buttonStyle:e.buttonStyle||"soft",buttonBorderRadius:e.buttonBorderRadius||e.borderRadius||"8px",buttonPadding:e.buttonPadding||"12px 24px",buttonFontSize:e.buttonFontSize||"16px",buttonFontWeight:e.buttonFontWeight||"500",textFontSize:e.textFontSize||"18px",textFontWeight:e.textFontWeight||"600",borderEnabled:t,borderType:e.borderType||"solid",borderStyle:e.borderStyle==="fill"||e.borderStyle==="thin"?e.borderStyle:"fill",borderColor:e.borderColor||"#1A2F5B",borderWidth:e.borderWidth||"1px",borderGradient:e.borderGradient||e.borderGradientText||"",borderGradientAngle:e.borderGradientAngle||""}}const Gt=["#ffffff","#e5e7eb","#9ca3af","#1f2937","#000000","#1A2F5B"],Ve=["linear-gradient(45deg, #ff6b6b, #4ecdc4)","linear-gradient(135deg, #1A2F5B, #3B5B8F)","linear-gradient(43deg, #D54070 0%, #8F4469 20%, #CA5699 40%, #59B8DA 60%, #9AD0DD 80%, #73B44A 100%)"];function re(e){return`<div class="color-presets">${Gt.map(t=>`<button type="button" class="color-preset ${t===e?"active":""}" data-color="${t}" style="background:${t};${t==="#ffffff"?"border:1px solid #e5e7eb;":""}" title="${t}"></button>`).join("")}</div>`}function pe(e){var $,P,E,R,g,y,q,f,k;const t=He(b.theme),i=t.backgroundType,o=t.backgroundColor,n=t.gradientText||"linear-gradient(45deg, #ff6b6b 0%, #4ecdc4 100%)";t.profileTextColor;const a=t.presentationTextColor,l=t.buttonTextColor,s=t.buttonBackgroundColor,d=t.buttonStyle,u=t.borderEnabled,h=t.borderType,m=t.borderStyle,_=t.borderColor;t.borderWidth,t.buttonBorderRadius;const L=t.borderGradient,v=Ye;e.innerHTML=`
    <div class="appearance-editor">
      <!-- ═══ BACKGROUND ═══ -->
      <div class="section">
        <div class="section-header" data-section="background-section">
          <h3>Background <span id="theme-save-status" class="auto-save-status"></span></h3>
          ${v}
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
              ${re(o)}
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
                ${Ve.map((c,p)=>`
                  <button type="button" class="gradient-preset" data-gradient="${I(c)}" style="background: ${c};" title="Preset ${p+1}"></button>
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
          ${v}
        </div>
        <div class="section-content" id="text-buttons-section">
          <div class="form-group">
            <label>Profile and Presentation Information Text Color</label>
            <div class="color-input-row">
              <input type="color" id="theme-presentation-text" value="${a}">
              <input type="text" id="theme-presentation-text-val" value="${a}" class="color-text">
            </div>
            ${re(a)}
          </div>
          <div class="form-group">
            <label>Button Text Color</label>
            <div class="color-input-row">
              <input type="color" id="theme-btn-text" value="${l}">
              <input type="text" id="theme-btn-text-val" value="${l}" class="color-text">
            </div>
            ${re(l)}
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
              <input type="color" id="theme-btn-bg" value="${s}">
              <input type="text" id="theme-btn-bg-val" value="${s}" class="color-text">
            </div>
            ${re(s)}
          </div>
        </div>
      </div>

      <!-- ═══ BORDER EFFECTS ═══ -->
      <div class="section">
        <div class="section-header" data-section="border-effects-section">
          <h3>Border Effects</h3>
          ${v}
        </div>
        <div class="section-content" id="border-effects-section">
          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" id="theme-border-enabled" ${u?"checked":""}>
              <span>Enable Custom Border</span>
            </label>
          </div>
          <div id="border-options" style="display:${u?"block":"none"}">
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
                  <input type="color" id="theme-border-color" value="${_}">
                  <input type="text" id="theme-border-color-val" value="${_}" class="color-text">
                </div>
                ${re(_)}
              </div>
            </div>

            <!-- Gradient border -->
            <div id="border-gradient-group" style="display:${h==="gradient"?"block":"none"}">
              <div class="form-group">
                <label>Border Gradient CSS</label>
                <textarea id="theme-border-gradient" class="gradient-textarea" rows="2" placeholder="linear-gradient(...)">${I(L)}</textarea>
                <div class="gradient-preview" id="border-gradient-preview" style="background: ${L||"linear-gradient(45deg, #1A2F5B, #3B5B8F)"};"></div>
              </div>
              <div class="form-group">
                <label>Presets</label>
                <div class="gradient-presets">
                  ${Ve.map((c,p)=>`
                    <button type="button" class="border-gradient-preset" data-gradient="${I(c)}" style="background: ${c};" title="Preset ${p+1}"></button>
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
          ${Je}
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
  `,[["theme-bg-color","theme-bg-color-text"],["theme-presentation-text","theme-presentation-text-val"],["theme-btn-bg","theme-btn-bg-val"],["theme-btn-text","theme-btn-text-val"],["theme-border-color","theme-border-color-val"]].forEach(([c,p])=>{var M,A;(M=document.getElementById(c))==null||M.addEventListener("input",w=>{const C=document.getElementById(p);C&&(C.value=w.target.value),Q()}),(A=document.getElementById(p))==null||A.addEventListener("input",w=>{const C=document.getElementById(c);C&&/^#[0-9a-fA-F]{6}$/.test(w.target.value)&&(C.value=w.target.value),Q()})}),e.addEventListener("click",c=>{const p=c.target.closest(".color-preset");if(!p)return;const M=p.dataset.color,A=p.closest(".form-group"),w=A==null?void 0:A.querySelector('input[type="color"]'),C=A==null?void 0:A.querySelector(".color-text");w&&(w.value=M),C&&(C.value=M),A==null||A.querySelectorAll(".color-preset").forEach(r=>r.classList.remove("active")),p.classList.add("active"),Q()}),e.querySelectorAll(".gradient-preset").forEach(c=>{c.addEventListener("click",()=>{const p=document.getElementById("theme-gradient"),M=document.getElementById("gradient-preview");p&&(p.value=c.dataset.gradient),M&&(M.style.background=c.dataset.gradient),Q()})}),e.querySelectorAll(".border-gradient-preset").forEach(c=>{c.addEventListener("click",()=>{const p=document.getElementById("theme-border-gradient"),M=document.getElementById("border-gradient-preview");p&&(p.value=c.dataset.gradient),M&&(M.style.background=c.dataset.gradient),Q()})}),e.querySelectorAll('input[name="bg-type"]').forEach(c=>{c.addEventListener("change",p=>{document.getElementById("bg-solid-group").style.display=p.target.value==="solid"?"block":"none",document.getElementById("bg-gradient-group").style.display=p.target.value==="gradient"?"block":"none",document.getElementById("bg-image-group").style.display=p.target.value==="image"?"block":"none",Q()})}),($=document.getElementById("theme-button-style"))==null||$.addEventListener("change",c=>{const p=document.getElementById("btn-bg-group");p&&(p.style.display=c.target.value==="solid"?"block":"none"),Q()}),(P=document.getElementById("theme-border-enabled"))==null||P.addEventListener("change",c=>{const p=document.getElementById("border-options");p&&(p.style.display=c.target.checked?"block":"none"),Q()}),e.querySelectorAll('input[name="border-type"]').forEach(c=>{c.addEventListener("change",p=>{document.getElementById("border-solid-group").style.display=p.target.value==="solid"?"block":"none",document.getElementById("border-gradient-group").style.display=p.target.value==="gradient"?"block":"none",Q()})}),(E=document.getElementById("theme-gradient"))==null||E.addEventListener("input",c=>{const p=document.getElementById("gradient-preview");p&&(p.style.background=c.target.value),Q()}),(R=document.getElementById("theme-border-gradient"))==null||R.addEventListener("input",c=>{const p=document.getElementById("border-gradient-preview");p&&(p.style.background=c.target.value),Q()}),["bg-pos-x","bg-pos-y","bg-pos-scale"].forEach(c=>{var p;(p=document.getElementById(c))==null||p.addEventListener("input",Q)}),(g=document.getElementById("bg-upload-btn"))==null||g.addEventListener("click",()=>{var c;(c=document.getElementById("bg-image-file"))==null||c.click()}),(y=document.getElementById("bg-image-file"))==null||y.addEventListener("change",Vt),(q=document.getElementById("bg-browse-media-btn"))==null||q.addEventListener("click",()=>{Fe(c=>{b._pendingBgImage=c,Q(),pe(document.getElementById("tab-content"))})}),(f=document.getElementById("bg-image-remove"))==null||f.addEventListener("click",()=>{b._pendingBgImage=null,b.theme&&(b.theme.backgroundImage="");const c=document.querySelector('input[name="bg-type"][value="solid"]');c&&(c.checked=!0),Q(),pe(document.getElementById("tab-content"))}),["theme-button-style"].forEach(c=>{var p;(p=document.getElementById(c))==null||p.addEventListener("change",Q)}),e.querySelectorAll('input[name="border-style"]').forEach(c=>{c.addEventListener("change",Q)}),Ze(e),(k=document.getElementById("save-new-theme-btn"))==null||k.addEventListener("click",ai),Ue()}async function Vt(e){var n;const t=(n=e.target.files)==null?void 0:n[0];if(!t)return;const i=document.getElementById("bg-upload-btn"),o=i==null?void 0:i.innerHTML;try{i&&(i.disabled=!0,i.innerHTML='<i class="fas fa-spinner fa-spin"></i> Uploading...');const a=await Me(t,"backgrounds",O.id,{maxWidth:1920,maxHeight:1920});b._pendingBgImage=a,Q(),pe(document.getElementById("tab-content"))}catch(a){console.error("Background image upload failed:",a),N("Background image upload failed: "+a.message,"error")}finally{i&&(i.disabled=!1,i.innerHTML=o)}}function Q(){const e=De(),t={...b.theme,...e};b._pendingBgImage&&(t.backgroundImage=b._pendingBgImage),z(t),_e&&_e.trigger()}function Wt(e){qt(e,b,O)}function Xt(e){At(e,b,O)}function z(e){const t=document.getElementById("phone-preview");if(!t)return;const i=He(e||b.theme),o=b.presentation_data||{},n=F||{},a=i.backgroundType;let l="";if(a==="gradient"&&i.gradientText)l=`background: ${i.gradientText};`;else if(a==="image"&&i.backgroundImage){const H=i.backgroundImageX,G=i.backgroundImageY,J=i.backgroundImageScale;l=`background: url('${i.backgroundImage}') ${H}% ${G}% / ${J}% no-repeat;`}else l=`background: ${i.backgroundColor};`;const s=i.presentationTextColor,d=s,u=i.buttonStyle,h=i.buttonBackgroundColor,m=i.buttonTextColor;i.buttonBorderRadius;const _=i.borderEnabled,L=i.borderType,v=i.borderStyle,S=i.borderColor,$=i.borderGradient,P=n.profile_photo||"";let E={scale:100,x:50,y:50};if(n.profile_photo_position)try{E=typeof n.profile_photo_position=="string"?JSON.parse(n.profile_photo_position):n.profile_photo_position}catch{}const R=(E.scale||100)/100,g=((E.x||50)-50)*-1,y=((E.y||50)-50)*-1,q=[{key:"social_email",icon:"fa-envelope",prefix:"mailto:",fab:!1},{key:"social_website",icon:"fa-globe",prefix:"",fab:!1},{key:"social_instagram",icon:"fa-instagram",prefix:"",fab:!0},{key:"social_facebook",icon:"fa-facebook",prefix:"",fab:!0},{key:"social_twitter",icon:"fa-x-twitter",prefix:"",fab:!0},{key:"social_linkedin",icon:"fa-linkedin",prefix:"",fab:!0},{key:"social_youtube",icon:"fa-youtube",prefix:"",fab:!0},{key:"social_tiktok",icon:"fa-tiktok",prefix:"",fab:!0},{key:"social_snapchat",icon:"fa-snapchat",prefix:"",fab:!0},{key:"social_google_scholar",icon:"fa-graduation-cap",prefix:"",fab:!1},{key:"social_orcid",icon:"fa-orcid",prefix:"",fab:!0},{key:"social_researchgate",icon:"fa-researchgate",prefix:"",fab:!0}],f=n.social_order;let k;if(f&&Array.isArray(f)){const H=[];for(const G of f){const J=q.find($e=>$e.key===`social_${G}`);J&&H.push(J)}for(const G of q)H.includes(G)||H.push(G);k=H.filter(G=>{var J;return(J=n[G.key])==null?void 0:J.trim()})}else k=q.filter(H=>{var G;return(G=n[H.key])==null?void 0:G.trim()});const c=o.title||"Untitled",p=o.displayTitle!==!1,M=o.displayConference!==!1,A=o.conference||"",w=o.location||"",C=o.date?Yt(o.date):"",r=B.filter(H=>H.is_active!==!1);function x(){let H=`color: ${m}; border-radius: 8px; font-size: 1.14rem;`;return u==="solid"?H+=`background: ${h} !important; border-color: ${h} !important;`:u==="outline"?H+=`background: transparent !important; border: 2px solid ${m} !important; color: ${m} !important;`:H+=`color: ${m} !important;`,H}const D=t.closest(".phone-mockup")||t.parentElement;D&&(D.style.boxShadow="0 20px 40px rgba(0, 0, 0, 0.3)",D.style.padding="8px",_?L==="gradient"&&$?v==="thin"?(D.style.background=$,D.style.padding="8px",D.style.boxShadow="inset 0 0 0 3px transparent, 0 20px 40px rgba(0, 0, 0, 0.3)"):(D.style.background=$,D.style.padding="8px"):v==="thin"?(D.style.background="#1e293b",D.style.boxShadow=`inset 0 0 0 8px ${S}, 0 20px 40px rgba(0, 0, 0, 0.3)`):D.style.background=S:D.style.background="#1e293b");const ie=p&&c||M&&A||w||C;t.innerHTML=`
    <div class="phone-screen" style="${l}">
      <!-- Header content — wraps profile + presentation like v0.6.7 -->
      <div class="phone-header-content">
        <!-- Profile — avatar + name side by side -->
        <div class="phone-profile-section">
          ${P?`
            <div class="phone-avatar">
              <img src="${I(P)}" alt="Profile"
                   style="transform: translate(${g}%, ${y}%) scale(${R}) !important; transform-origin: center center !important;"
                   onerror="this.parentElement.style.display='none'">
            </div>
          `:""}
          <div class="phone-name-section">
            ${n.display_name?`<h4 class="phone-display-name" style="color: ${d};">${I(n.display_name)}</h4>`:""}
            ${k.length>0?`
              <div class="phone-socials">
                ${k.map(H=>`
                  <span class="phone-social-icon ${H.key}" title="${H.key.replace("social_","")}">
                    <i class="${H.fab?"fab":"fas"} ${H.icon}"></i>
                  </span>
                `).join("")}
              </div>
            `:""}
          </div>
        </div>

        <!-- Presentation Info -->
        ${ie?`
          <div class="phone-presentation" style="color: ${s};">
            ${p?`<div class="phone-info-field"><span class="phone-info-value">${I(c)}</span></div>`:""}
            ${M&&A?`<div class="phone-info-field"><span class="phone-info-value">${I(A)}</span></div>`:""}
            ${w?`<div class="phone-info-field"><span class="phone-info-value" style="font-size:0.9rem;">${I(w)}</span></div>`:""}
            ${C?`<div class="phone-info-field"><span class="phone-info-value" style="font-size:0.9rem;">${I(C)}</span></div>`:""}
          </div>
        `:""}
      </div>

      <!-- Links -->
      <div class="phone-links">
        ${r.length===0?`
          <p class="phone-empty" style="color: ${s};">No active links</p>
        `:r.map(H=>{const G=Ee(H),J=Re(H),$e=qe(G.x,G.y,J),ze=ke(H),it=Ae(H)||"Untitled";return`
            <div class="phone-link-btn ${u}" style="${x()}">
              ${ze?`
                <div class="phone-link-image-wrapper">
                  <div class="phone-link-image">
                    <img src="${I(ze)}" alt=""
                      style="${$e}"
                      onerror="this.parentElement.innerHTML='<i class=\\'fas fa-link\\' style=\\'color:#6b7280\\'></i>'">
                  </div>
                </div>
              `:""}
              <div class="phone-link-text">${I(it)}</div>
            </div>
          `}).join("")}
      </div>

      <!-- Footer -->
      <div class="phone-footer" style="color: ${d};">
        <p class="phone-footer-text">Powered by <a href="https://academiqr.com" style="color: ${d};">AcademiQR.com</a></p>
      </div>
    </div>
  `}function Yt(e){try{return new Date(e+"T00:00:00").toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}catch{return e}}async function Jt(e){var d,u,h,m,_,L;if(!B.find(v=>v.id===e))return;const i=(d=document.getElementById("link-title"))==null?void 0:d.value.trim(),o=(u=document.getElementById("link-url"))==null?void 0:u.value.trim(),n=(h=document.getElementById("link-image"))==null?void 0:h.value.trim(),a=parseInt((m=document.getElementById("link-img-pos-x"))==null?void 0:m.value)||50,l=parseInt((_=document.getElementById("link-img-pos-y"))==null?void 0:_.value)||50,s=parseInt((L=document.getElementById("link-img-scale"))==null?void 0:L.value)||100;if(!i){N("Please enter a title.","warning");return}if(!o){N("Please enter a URL.","warning");return}try{const v=B.reduce((P,E)=>Math.max(P,E.order_index||0),0),{data:S,error:$}=await T.from("link_items").insert({list_id:b.id,title:i,url:o,image_url:n||null,image_position:{x:a,y:l},image_scale:s,order_index:v+100,is_active:!0}).select().single();if($)throw $;B.push(S),V=S.id,W(),Y(),z(),te(),Ke("save-as-library-btn")}catch(v){console.error("Failed to create library link:",v),N("Failed to create link: "+v.message,"error")}}async function Kt(e){const t=B.find(i=>i.id===e);if(!(!t||!confirm(`Delete "${t.title||"this link"}"?`)))try{const{error:i}=await T.from("link_items").delete().eq("id",e).eq("list_id",b.id);if(i)throw i;B=B.filter(o=>o.id!==e),V=null,W(),Y(),z(),te()}catch(i){console.error("Failed to delete link:",i),N("Failed to delete: "+i.message,"error")}}async function Zt(e){const t=B.find(o=>o.id===e);if(!t)return;const i=t.is_active===!1;try{const{error:o}=await T.from("link_items").update({is_active:i}).eq("id",e);if(o)throw o;t.is_active=i,W(),z()}catch(o){console.error("Failed to toggle link:",o)}}function ei(){const e=document.getElementById("new-link-modal");e&&(document.getElementById("new-link-title").value="",document.getElementById("new-link-url").value="",document.getElementById("new-link-image").value="",e.style.display="flex",document.getElementById("new-link-title").focus())}function ge(){const e=document.getElementById("new-link-modal");e&&(e.style.display="none")}async function ti(){var o,n,a;const e=(o=document.getElementById("new-link-title"))==null?void 0:o.value.trim(),t=(n=document.getElementById("new-link-url"))==null?void 0:n.value.trim(),i=(a=document.getElementById("new-link-image"))==null?void 0:a.value.trim();if(!e){N("Please enter a title.","warning");return}if(!t){N("Please enter a URL.","warning");return}try{const l=B.reduce((u,h)=>Math.max(u,h.order_index||0),0),{data:s,error:d}=await T.from("link_items").insert({list_id:b.id,title:e,url:t,image_url:i||null,order_index:l+100,is_active:!0}).select().single();if(d)throw d;B.push(s),V=s.id,ge(),W(),Y(),z(),te()}catch(l){console.error("Failed to add link:",l),N("Failed to add link: "+l.message,"error")}}let fe=[];async function ii(){const e=document.getElementById("existing-link-modal");if(!e)return;e.style.display="flex";const t=document.getElementById("existing-links-list");t&&(t.innerHTML='<p class="existing-link-empty">Loading...</p>');try{const{data:i,error:o}=await T.from("link_items").select("*, link_lists!inner(id, slug, presentation_data, owner_id)").eq("link_lists.owner_id",O.id).neq("list_id",b.id).order("created_at",{ascending:!1});if(o)throw o;fe=i||[],et("")}catch(i){console.error("Failed to load links:",i),t&&(t.innerHTML='<p class="existing-link-empty">Failed to load links.</p>')}}function et(e){const t=document.getElementById("existing-links-list");if(!t)return;const i=e.toLowerCase(),o=i?fe.filter(n=>(n.title||"").toLowerCase().includes(i)||(n.url||"").toLowerCase().includes(i)):fe;if(o.length===0){t.innerHTML=`<p class="existing-link-empty">${i?"No matches found.":"No links in other collections."}</p>`;return}t.innerHTML=o.map(n=>{var l,s,d;const a=((s=(l=n.link_lists)==null?void 0:l.presentation_data)==null?void 0:s.title)||((d=n.link_lists)==null?void 0:d.slug)||"";return`
      <div class="existing-link-item" data-link-id="${n.id}">
        <div class="link-thumb">
          ${n.image_url?`<img src="${I(n.image_url)}" alt="" onerror="this.parentElement.innerHTML='<i class=\\'fas fa-link\\' style=\\'color:#9ca3af\\'></i>'">`:'<i class="fas fa-link" style="color:#9ca3af"></i>'}
        </div>
        <div class="link-info">
          <div class="link-title">${I(n.title||"Untitled")}</div>
          <div class="link-url">${I(tt(n.url||""))}</div>
        </div>
        <span class="link-collection-name">${I(a)}</span>
      </div>
    `}).join(""),t.querySelectorAll(".existing-link-item").forEach(n=>{n.addEventListener("click",()=>oi(n.dataset.linkId))})}async function oi(e){const t=fe.find(i=>i.id===e);if(t)try{const i=B.reduce((a,l)=>Math.max(a,l.order_index||0),0),{data:o,error:n}=await T.from("link_items").insert({list_id:b.id,title:t.title,url:t.url,image_url:t.image_url,image_position:t.image_position||null,image_scale:t.image_scale||null,order_index:i+100,is_active:!0,source_link_id:e,use_library_defaults:!0}).select().single();if(n)throw n;o._resolved_title=t.title,o._resolved_image_url=t.image_url,o._resolved_image_position=t.image_position,o._resolved_image_scale=t.image_scale,B.push(o),V=o.id,ve(),W(),Y(),z(),te()}catch(i){console.error("Failed to add existing link:",i),N("Failed to add link: "+i.message,"error")}}function ve(){const e=document.getElementById("existing-link-modal");e&&(e.style.display="none"),fe=[]}let ye=null;async function Fe(e){ye=e;const t=document.getElementById("media-library-modal"),i=document.getElementById("media-library-content");if(!(!t||!i)){t.style.display="flex",i.innerHTML=`
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
    `}}}function he(){const e=document.getElementById("media-library-modal");e&&(e.style.display="none"),ye=null}let de=null;function ni(){const e=document.getElementById("links-list");e&&e.querySelectorAll(".link-item").forEach(t=>{t.setAttribute("draggable","true"),t.addEventListener("dragstart",i=>{de=parseInt(t.dataset.index),t.classList.add("dragging"),i.dataTransfer.effectAllowed="move"}),t.addEventListener("dragend",()=>{t.classList.remove("dragging"),e.querySelectorAll(".link-item").forEach(i=>i.classList.remove("drag-over")),de=null}),t.addEventListener("dragover",i=>{i.preventDefault(),i.dataTransfer.dropEffect="move",e.querySelectorAll(".link-item").forEach(o=>o.classList.remove("drag-over")),t.classList.add("drag-over")}),t.addEventListener("dragleave",()=>{t.classList.remove("drag-over")}),t.addEventListener("drop",async i=>{i.preventDefault();const o=parseInt(t.dataset.index);if(de===null||de===o)return;const[n]=B.splice(de,1);B.splice(o,0,n),B.forEach((a,l)=>{a.order_index=(l+1)*100}),W(),z();try{await Promise.all(B.map(a=>T.from("link_items").update({order_index:a.order_index}).eq("id",a.id)))}catch(a){console.error("Failed to save order:",a)}})})}function De(){var s,d,u,h,m,_,L,v,S,$,P,E,R,g,y;const e=((s=document.querySelector('input[name="bg-type"]:checked'))==null?void 0:s.value)||"solid",t=((d=document.querySelector('input[name="border-type"]:checked'))==null?void 0:d.value)||"solid",i=((u=document.querySelector('input[name="border-style"]:checked'))==null?void 0:u.value)||"fill",o=((h=document.getElementById("theme-border-enabled"))==null?void 0:h.checked)||!1,n=((m=document.getElementById("theme-presentation-text"))==null?void 0:m.value)||"#1A2F5B",a=((_=document.getElementById("theme-btn-bg"))==null?void 0:_.value)||"#1A2F5B",l=((L=document.getElementById("theme-border-gradient"))==null?void 0:L.value)||"";return{backgroundType:e,backgroundColor:((v=document.getElementById("theme-bg-color"))==null?void 0:v.value)||"#ffffff",gradientText:((S=document.getElementById("theme-gradient"))==null?void 0:S.value)||"",backgroundImage:e==="image"&&(b._pendingBgImage||(b.theme||{}).backgroundImage)||"",backgroundImageX:parseInt(($=document.getElementById("bg-pos-x"))==null?void 0:$.value)||50,backgroundImageY:parseInt((P=document.getElementById("bg-pos-y"))==null?void 0:P.value)||50,backgroundImageScale:parseInt((E=document.getElementById("bg-pos-scale"))==null?void 0:E.value)||100,profileTextColor:n,presentationTextColor:n,textColor:n,presentationColor:n,profileColor:n,buttonBackgroundColor:a,buttonBgColor:a,buttonTextColor:((R=document.getElementById("theme-btn-text"))==null?void 0:R.value)||"#000000",buttonStyle:((g=document.getElementById("theme-button-style"))==null?void 0:g.value)||"soft",buttonBorderRadius:"8px",borderEnabled:o,gradientBorderEnabled:o,borderType:t,borderStyle:i,borderColor:((y=document.getElementById("theme-border-color"))==null?void 0:y.value)||"#1A2F5B",borderGradient:l,borderGradientText:l}}async function Ue(){const e=document.getElementById("saved-themes-list");if(e)try{const{data:t,error:i}=await T.from("user_themes").select("*").eq("user_id",O.id).eq("theme_type","appearance").order("created_at",{ascending:!1});if(i)throw i;if(!t||t.length===0){e.innerHTML='<p style="color:#9ca3af; font-size:0.875rem;">No saved themes yet.</p>';return}e.innerHTML=t.map(o=>`
      <div class="saved-theme-item" style="display:flex; justify-content:space-between; align-items:center; padding:8px 12px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; margin-bottom:8px;">
        <span style="font-size:0.875rem; font-weight:500; color:#1e293b;">${I(o.name||o.theme_name||"Unnamed")}</span>
        <div style="display:flex; gap:4px;">
          <button type="button" class="apply-theme-btn" data-theme-id="${o.id}" style="background:#1A2F5B; color:white; border:none; padding:4px 10px; border-radius:4px; font-size:0.75rem; cursor:pointer;">Apply</button>
          <button type="button" class="delete-theme-btn" data-theme-id="${o.id}" style="background:none; color:#ef4444; border:1px solid #ef4444; padding:4px 8px; border-radius:4px; font-size:0.75rem; cursor:pointer;"><i class="fas fa-trash"></i></button>
        </div>
      </div>
    `).join(""),e.querySelectorAll(".apply-theme-btn").forEach(o=>{o.addEventListener("click",async()=>{const n=t.find(a=>a.id===o.dataset.themeId);n&&n.theme_data&&(b.theme={...b.theme,...n.theme_data},z(),pe(document.getElementById("tab-content")))})}),e.querySelectorAll(".delete-theme-btn").forEach(o=>{o.addEventListener("click",async()=>{const n=t.find(a=>a.id===o.dataset.themeId);if(!(!n||!confirm(`Delete theme "${n.name||n.theme_name}"?`)))try{const{error:a}=await T.from("user_themes").delete().eq("id",n.id).eq("user_id",O.id);if(a)throw a;Ue()}catch(a){console.error("Failed to delete theme:",a),N("Failed to delete: "+a.message,"error")}})})}catch(t){console.error("Failed to load themes:",t),e.innerHTML='<p style="color:#ef4444; font-size:0.875rem;">Failed to load themes.</p>'}}async function ai(){const e=document.getElementById("theme-name"),t=e==null?void 0:e.value.trim();if(!t){N("Please enter a theme name.","warning");return}try{const i=De(),{error:o}=await T.from("user_themes").insert({user_id:O.id,name:t,theme_type:"appearance",theme_data:i});if(o)throw o;e&&(e.value=""),Ue(),Ke("save-new-theme-btn")}catch(i){console.error("Failed to save theme:",i),N("Failed to save theme: "+i.message,"error")}}function li(){var e,t,i,o,n,a,l,s,d,u,h,m,_,L;document.querySelectorAll(".tab").forEach(v=>{v.addEventListener("click",async()=>{await Ce(),document.querySelectorAll(".tab").forEach(S=>S.classList.remove("active")),v.classList.add("active"),me=v.dataset.tab,Y()})}),(e=document.getElementById("add-link-btn"))==null||e.addEventListener("click",ei),(t=document.getElementById("add-existing-btn"))==null||t.addEventListener("click",ii),(i=document.getElementById("new-link-modal-close"))==null||i.addEventListener("click",ge),(o=document.getElementById("new-link-cancel"))==null||o.addEventListener("click",ge),(n=document.getElementById("new-link-save"))==null||n.addEventListener("click",ti),(a=document.getElementById("new-link-modal"))==null||a.addEventListener("click",v=>{v.target.id==="new-link-modal"&&ge()}),(l=document.getElementById("new-link-upload-btn"))==null||l.addEventListener("click",()=>{var v;(v=document.getElementById("new-link-image-file"))==null||v.click()}),(s=document.getElementById("new-link-image-file"))==null||s.addEventListener("change",async v=>{var E;const S=(E=v.target.files)==null?void 0:E[0];if(!S)return;const $=document.getElementById("new-link-upload-btn"),P=$==null?void 0:$.innerHTML;try{$&&($.disabled=!0,$.innerHTML='<i class="fas fa-spinner fa-spin"></i>');const R=await Me(S,"links",O.id,{maxWidth:1200,maxHeight:1200,quality:.75});document.getElementById("new-link-image").value=R}catch(R){console.error("Upload failed:",R),N("Upload failed: "+R.message,"error")}finally{$&&($.disabled=!1,$.innerHTML=P)}}),(d=document.getElementById("new-link-browse-btn"))==null||d.addEventListener("click",()=>{Fe(v=>{document.getElementById("new-link-image").value=v})}),(u=document.getElementById("existing-link-modal-close"))==null||u.addEventListener("click",ve),(h=document.getElementById("existing-link-modal"))==null||h.addEventListener("click",v=>{v.target.id==="existing-link-modal"&&ve()}),(m=document.getElementById("existing-link-search"))==null||m.addEventListener("input",v=>{et(v.target.value)}),(_=document.getElementById("media-library-close"))==null||_.addEventListener("click",he),(L=document.getElementById("media-library-modal"))==null||L.addEventListener("click",v=>{v.target.id==="media-library-modal"&&he()}),document.addEventListener("keydown",v=>{v.key==="Escape"&&(ge(),ve(),he())})}function I(e){const t=document.createElement("div");return t.textContent=e,t.innerHTML}function tt(e){try{const t=new URL(e),i=t.pathname.length>30?t.pathname.substring(0,30)+"...":t.pathname;return t.hostname+i}catch{return e.length>50?e.substring(0,50)+"...":e}}function Te(e,t){!e||!t||e.querySelectorAll(".tag-remove").forEach(i=>{i.addEventListener("click",o=>{o.stopPropagation();const n=i.dataset.tag;t.tags=(t.tags||[]).filter(a=>a!==n),e.innerHTML=oe(t.tags,{removable:!0}),Te(e,t),Z.trigger()})})}function Be(e){e&&e.querySelectorAll(".tag-remove").forEach(t=>{t.addEventListener("click",i=>{i.stopPropagation();const o=t.dataset.tag,n=b.presentation_data||{};n.tags=(n.tags||[]).filter(a=>a!==o),b.presentation_data=n,le.trigger(),e.innerHTML=oe(n.tags,{removable:!0}),Be(e)})})}function si(){if(window.innerWidth>768)return;const e=document.createElement("div");e.className="mobile-tab-bar",e.innerHTML=`
    <button class="mobile-tab-btn ${me==="details"?"active":""}" data-tab="details">
      <i class="fas fa-file-alt"></i><span>Details</span>
    </button>
    <button class="mobile-tab-btn ${me==="appearance"?"active":""}" data-tab="appearance">
      <i class="fas fa-palette"></i><span>Theme</span>
    </button>
    <button class="mobile-tab-btn" data-tab="qr-code">
      <i class="fas fa-qrcode"></i><span>QR</span>
    </button>
    <button class="mobile-tab-btn" data-tab="analytics">
      <i class="fas fa-chart-bar"></i><span>Analytics</span>
    </button>
  `,document.body.appendChild(e),e.querySelectorAll(".mobile-tab-btn").forEach(i=>{i.addEventListener("click",async()=>{await Ce(),e.querySelectorAll(".mobile-tab-btn").forEach(o=>o.classList.remove("active")),i.classList.add("active"),me=i.dataset.tab,Y()})});const t=document.createElement("button");t.className="preview-fab",t.innerHTML='<i class="fas fa-eye"></i>',t.title="Preview",document.body.appendChild(t),t.addEventListener("click",()=>{const i=document.createElement("div");i.className="preview-overlay",i.innerHTML=`
      <button class="preview-overlay-close"><i class="fas fa-times"></i></button>
      <div class="editor-preview-mockup" id="mobile-preview-mockup"></div>
    `,document.body.appendChild(i);const o=document.getElementById("mobile-preview-mockup"),n=document.getElementById("phone-preview");n&&o&&(o.innerHTML=n.innerHTML,o.style.cssText=n.style.cssText),i.querySelector(".preview-overlay-close").addEventListener("click",()=>i.remove()),i.addEventListener("click",a=>{a.target===i&&i.remove()})})}Pt();

import{s as I}from"./supabase-whCCoo43.js";/* empty css             */import{b as Re,a as Ve,c as We,d as Te,s as Xe,n as Ye}from"./router-CHKU_QSV.js";import{r as Je,g as ue,a as xe,h as le,b as Me,c as Ae}from"./link-utils-D1VnX3pm.js";import{i as Ke,g as Ze,t as et}from"./theme-toggle-yIlytQ8Y.js";import{c as Ee,l as tt}from"./image-utils-gR03vQbS.js";function ie(e,t={}){const i=t.delay||1e3,o=t.statusSelector||null;let n=null,l=!1;function a(b){if(!o)return;const m=document.querySelector(o);m&&(b==="saving"?(m.innerHTML='<i class="fas fa-circle-notch fa-spin"></i>',m.className="auto-save-status saving"):b==="saved"?(m.innerHTML='<i class="fas fa-check"></i> Saved',m.className="auto-save-status saved",setTimeout(()=>{m.classList.contains("saved")&&(m.className="auto-save-status fade-out",setTimeout(()=>{m.className="auto-save-status",m.innerHTML=""},300))},1500)):b==="error"&&(m.innerHTML='<i class="fas fa-exclamation-triangle"></i> Error',m.className="auto-save-status error",setTimeout(()=>{m.className="auto-save-status fade-out",setTimeout(()=>{m.className="auto-save-status",m.innerHTML=""},300)},3e3)))}async function s(){l=!1,a("saving");try{const b=await e();a(b!==!1?"saved":"error")}catch(b){console.error("[AutoSave] Save failed:",b),a("error")}}function u(){l=!0,n&&clearTimeout(n),n=setTimeout(s,i)}async function c(){n&&(clearTimeout(n),n=null),l&&await s()}function y(){l=!1,n&&(clearTimeout(n),n=null)}return{trigger:u,flush:c,cancel:y}}const Pe=[];function oe(e){Pe.push(e)}async function it(){await Promise.all(Pe.map(e=>e.flush()))}const ot="https://natzpfyxpuycsuuzbqrd.supabase.co/storage/v1/object/public/assets/AcademiQR_logo_Dark.png",X=250,V=16,H=8;let me=null,z=null;function He(e){const t=document.createElement("div");return t.textContent=e,t.innerHTML}function he(e,t,i,o,n,l){e.beginPath(),e.moveTo(t+l,i),e.lineTo(t+o-l,i),e.arcTo(t+o,i,t+o,i+l,l),e.lineTo(t+o,i+n-l),e.arcTo(t+o,i+n,t+o-l,i+n,l),e.lineTo(t+l,i+n),e.arcTo(t,i+n,t,i+n-l,l),e.lineTo(t,i+l),e.arcTo(t,i,t+l,i,l),e.closePath()}function fe(e){var i,o,n,l,a,s;const t=u=>e.querySelector(`#${u}`);return{color:((i=t("qr-color"))==null?void 0:i.value)||"#1A2F5B",bgColor:((o=t("qr-bg-color"))==null?void 0:o.value)||"#ffffff",borderEnabled:((n=t("qr-border-enabled"))==null?void 0:n.checked)||!1,borderColor:((l=t("qr-border-color"))==null?void 0:l.value)||"#000000",borderStyle:((a=t("qr-border-style"))==null?void 0:a.value)||"solid",borderRadius:parseInt(((s=t("qr-border-radius"))==null?void 0:s.value)||"16"),logo:z}}function nt(e,t){const i=t.borderEnabled?H:0,o=t.borderEnabled?t.borderRadius:16,n=document.createElement("canvas");n.width=X,n.height=X;const l=n.getContext("2d");if(l.clearRect(0,0,X,X),l.fillStyle=t.bgColor,he(l,i,i,e.width+V*2,e.height+V*2,o),l.fill(),t.borderEnabled){if(l.strokeStyle=t.borderColor,l.lineWidth=H,t.borderStyle==="dashed")l.setLineDash([H*2,H]);else if(t.borderStyle==="dotted")l.setLineDash([H,H]);else if(t.borderStyle==="double"){l.lineWidth=H/3;const u=H/2,c=H/2,y=e.width+V*2+H,b=e.height+V*2+H;l.strokeRect(u,c,y,b),l.strokeRect(u+H,c+H,y-H*2,b-H*2)}if(t.borderStyle!=="double"){const u=H/2,c=H/2,y=e.width+V*2+H,b=e.height+V*2+H;o>0?(he(l,u,c,y,b,o),l.stroke()):l.strokeRect(u,c,y,b)}l.setLineDash([])}const a=i+V,s=i+V;return l.save(),he(l,i,i,e.width+V*2,e.height+V*2,o),l.clip(),l.drawImage(e,a,s),l.restore(),{canvas:n,ctx:l,qrX:a,qrY:s,qrSize:e.width}}function lt(e,t,i,o,n){return new Promise(l=>{if(!t){l();return}const a=new Image;a.crossOrigin="anonymous",a.onload=()=>{const s=n*.2;let u=a.width,c=a.height;if(u>s||c>s){const m=Math.min(s/u,s/c);u*=m,c*=m}const y=i+(n-u)/2,b=o+(n-c)/2;e.fillStyle="#ffffff",e.beginPath(),e.arc(i+n/2,o+n/2,Math.max(u,c)/2+8,0,Math.PI*2),e.fill(),e.drawImage(a,y,b,u,c),l()},a.onerror=()=>l(),a.src=t})}async function Z(e,t){if(typeof QRCode>"u"){console.error("[QR] QRCode.js library not loaded");return}const i=fe(e),o=e.querySelector("#qr-code-container");if(!o)return;me=null,o.innerHTML="",o.style.cssText="background:transparent; padding:0; display:flex; align-items:center; justify-content:center; width:250px; height:250px; margin:0 auto; box-sizing:border-box; border:none; border-radius:0; overflow:visible;";const n=i.borderEnabled?H:0,l=X-n*2-V*2,a=document.createElement("div");a.style.cssText="position:absolute; left:-9999px; top:-9999px;",document.body.appendChild(a);try{me=new QRCode(a,{text:t,width:l,height:l,colorDark:i.color,colorLight:i.bgColor,correctLevel:QRCode.CorrectLevel.H})}catch(w){console.error("[QR] Generation failed:",w),o.innerHTML='<p style="color:#ef4444; font-size:0.8rem;">QR generation failed</p>',document.body.removeChild(a);return}await new Promise(w=>setTimeout(w,100));const s=a.querySelector("canvas");if(!s){document.body.removeChild(a);return}const{canvas:u,ctx:c,qrX:y,qrY:b,qrSize:m}=nt(s,i);await lt(c,z,y,b,m);const _=document.createElement("img");_.src=u.toDataURL("image/png");const h=i.borderEnabled?i.borderRadius:16;_.style.cssText=`width:${X}px; height:${X}px; display:block; margin:0 auto; border-radius:${h}px; background:transparent;`,_.alt="QR Code",_.title="Right-click to copy image",_.setAttribute("data-composite","true"),o.innerHTML="",o.appendChild(_),o._compositeCanvas=u,document.body.removeChild(a);const q=e.querySelector("#qr-actions");q&&(q.style.display="flex")}function at(e,t,i){const o=e.querySelector("#qr-code-container");if(!o||!me)return;const n=o.querySelector('img[data-composite="true"]');if(!n)return;const l=`${i||"qrcode"}-qrcode`;if(t==="png"||t==="jpeg"){const a=new Image;a.onload=()=>{const s=document.createElement("canvas");s.width=a.width,s.height=a.height;const u=s.getContext("2d");t==="jpeg"&&(u.fillStyle="#ffffff",u.fillRect(0,0,s.width,s.height)),u.drawImage(a,0,0);const c=document.createElement("a");c.download=`${l}.${t==="jpeg"?"jpg":"png"}`,c.href=s.toDataURL(t==="jpeg"?"image/jpeg":"image/png",.95),c.click()},a.src=n.src}else if(t==="svg"){const a=new Image;a.onload=()=>{const s=document.createElement("canvas");s.width=a.width,s.height=a.height,s.getContext("2d").drawImage(a,0,0);const c=s.toDataURL("image/png"),y=`<svg xmlns="http://www.w3.org/2000/svg" width="${s.width}" height="${s.height}" viewBox="0 0 ${s.width} ${s.height}"><image href="${c}" width="${s.width}" height="${s.height}"/></svg>`,b=new Blob([y],{type:"image/svg+xml"}),m=document.createElement("a");m.download=`${l}.svg`,m.href=URL.createObjectURL(b),m.click(),URL.revokeObjectURL(m.href)},a.src=n.src}}async function st(e,t){const i=fe(t),o={color:i.color,bgColor:i.bgColor,borderEnabled:i.borderEnabled,borderColor:i.borderColor,borderStyle:i.borderStyle,borderRadius:String(i.borderRadius),logo:z},{error:n}=await I.from("link_lists").update({qr_code_data:o,updated_at:new Date().toISOString()}).eq("id",e);return!n}async function _e(e,t){const i=e.querySelector("#saved-qr-themes-list");if(!i)return;const{data:o,error:n}=await I.from("user_themes").select("*").eq("user_id",t).eq("theme_type","qr").order("created_at",{ascending:!1});if(n||!o||o.length===0){i.innerHTML='<p class="qr-themes-empty">No saved QR themes yet</p>';return}i.innerHTML=o.map(l=>{const a=He(l.name);return`
      <div class="saved-theme-item" data-theme-id="${l.id}" data-theme-name="${a}">
        <div class="saved-theme-name">${a}</div>
        <button class="btn-icon qr-theme-delete" data-theme-id="${l.id}" data-theme-name="${a}" title="Delete"><i class="fas fa-trash"></i></button>
      </div>
    `}).join("")}async function rt(e,t,i){var u;const o=e.querySelector("#qr-theme-name"),n=(u=o==null?void 0:o.value)==null?void 0:u.trim();if(!n){alert("Please enter a QR theme name");return}const l=fe(e),a={name:n,color:l.color,bgColor:l.bgColor,borderEnabled:l.borderEnabled,borderColor:l.borderColor,borderStyle:l.borderStyle,borderRadius:String(l.borderRadius),logo:z},{data:s}=await I.from("user_themes").select("id").eq("user_id",t).eq("name",n).eq("theme_type","qr").maybeSingle();if(s){if(!confirm(`QR Theme "${n}" already exists. Overwrite?`))return;await I.from("user_themes").update({theme_data:a,updated_at:new Date().toISOString()}).eq("id",s.id)}else await I.from("user_themes").insert({user_id:t,name:n,theme_type:"qr",theme_data:a});o.value="",await _e(e,t)}async function dt(e,t,i,o){confirm(`Delete QR Theme "${o}"?`)&&(await I.from("user_themes").delete().eq("id",i).eq("user_id",t),await _e(e,t))}function ct(e,t,i){const o=n=>e.querySelector(`#${n}`);if(i.color&&(o("qr-color")&&(o("qr-color").value=i.color),o("qr-color-text")&&(o("qr-color-text").value=i.color)),i.bgColor&&(o("qr-bg-color")&&(o("qr-bg-color").value=i.bgColor),o("qr-bg-color-text")&&(o("qr-bg-color-text").value=i.bgColor)),i.borderEnabled!==void 0){o("qr-border-enabled")&&(o("qr-border-enabled").checked=i.borderEnabled);const n=o("qr-border-options");n&&(n.style.display=i.borderEnabled?"block":"none")}i.borderColor&&(o("qr-border-color")&&(o("qr-border-color").value=i.borderColor),o("qr-border-color-text")&&(o("qr-border-color-text").value=i.borderColor)),i.borderStyle&&o("qr-border-style")&&(o("qr-border-style").value=i.borderStyle),i.borderRadius&&o("qr-border-radius")&&(o("qr-border-radius").value=i.borderRadius),i.logo?z=i.logo:z=null,be(e),Z(e,t)}function ut(e,t,i){var l;const o=(l=i.target.files)==null?void 0:l[0];if(!o)return;if(o.size>5*1024*1024){alert("Logo must be under 5 MB"),i.target.value="";return}const n=new FileReader;n.onload=a=>{z=a.target.result,be(e),Z(e,t)},n.readAsDataURL(o)}function mt(e,t){z=null,be(e);const i=e.querySelector("#qr-logo-upload");i&&(i.value=""),Z(e,t)}function gt(e,t){z=ot,be(e),Z(e,t)}function be(e){const t=e.querySelector("#qr-logo-preview"),i=e.querySelector("#qr-logo-img");z?(i&&(i.src=z),t&&(t.style.display="inline-block")):(t&&(t.style.display="none"),i&&(i.src=""))}function pt(e,t,i){const o=e.querySelector(`#${t}`),n=e.querySelector(`#${i}`);o&&n&&(n.value=o.value)}function ft(e,t,i){const o=e.querySelector(`#${t}`),n=e.querySelector(`#${i}`);o&&n&&/^#[0-9a-fA-F]{6}$/.test(o.value)&&(n.value=o.value)}function bt(e,t,i){var h,q,w,g,d,x,v,L,F,M,p,f,B,R,A,S,U;if(!t||!i){e.innerHTML='<div class="qr-tab"><p>Please select a collection first.</p></div>';return}const o=Re(i.id,t.id),n=t.qr_code_data||{};me=null,z=n.logo||null;const l=n.color||"#1A2F5B",a=n.bgColor||"#ffffff",s=n.borderEnabled===!0||n.borderEnabled==="true",u=n.borderColor||"#000000",c=n.borderStyle||"solid",y=String(n.borderRadius||"16");e.innerHTML=`
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
              <input type="text" id="qr-url" class="form-input" value="${He(o)}" readonly>
              <button id="qr-copy-url" class="btn-icon" title="Copy URL"><i class="fas fa-copy"></i></button>
            </div>
          </div>

          <!-- Colors -->
          <div class="form-group qr-color-row">
            <div class="qr-color-group">
              <label>QR Code Color</label>
              <div class="color-options">
                <input type="color" id="qr-color" value="${l}" class="color-picker">
                <input type="text" id="qr-color-text" value="${l}" class="color-input" maxlength="7">
              </div>
            </div>
            <div class="qr-color-group">
              <label>Background Color</label>
              <div class="color-options">
                <input type="color" id="qr-bg-color" value="${a}" class="color-picker">
                <input type="text" id="qr-bg-color-text" value="${a}" class="color-input" maxlength="7">
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
                  <input type="color" id="qr-border-color" value="${u}" class="color-picker">
                  <input type="text" id="qr-border-color-text" value="${u}" class="color-input" maxlength="7">
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
                    <option value="16" ${y==="16"?"selected":""}>Rounded</option>
                    <option value="0" ${y==="0"?"selected":""}>Square</option>
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
            <div id="qr-logo-preview" class="qr-logo-preview" style="display: ${z?"inline-block":"none"};">
              <img id="qr-logo-img" src="${z||""}" alt="Logo">
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
  `;const b=()=>Z(e,o);(h=e.querySelector("#qr-copy-url"))==null||h.addEventListener("click",()=>{navigator.clipboard.writeText(o).then(()=>{const r=e.querySelector("#qr-copy-url");r&&(r.innerHTML='<i class="fas fa-check"></i>',setTimeout(()=>r.innerHTML='<i class="fas fa-copy"></i>',1500))})});for(const r of["qr-color","qr-bg-color","qr-border-color"])(q=e.querySelector(`#${r}`))==null||q.addEventListener("input",()=>{pt(e,r,r+"-text"),b()});for(const[r,E]of[["qr-color-text","qr-color"],["qr-bg-color-text","qr-bg-color"],["qr-border-color-text","qr-border-color"]])(w=e.querySelector(`#${r}`))==null||w.addEventListener("input",()=>{ft(e,r,E),b()});(g=e.querySelector("#qr-border-enabled"))==null||g.addEventListener("change",r=>{const E=e.querySelector("#qr-border-options");E&&(E.style.display=r.target.checked?"block":"none"),b()});for(const r of["qr-border-style","qr-border-radius"])(d=e.querySelector(`#${r}`))==null||d.addEventListener("change",b);const m=ie(async()=>{const r=await st(t.id,e);if(r){const E=fe(e);t.qr_code_data={color:E.color,bgColor:E.bgColor,borderEnabled:E.borderEnabled,borderColor:E.borderColor,borderStyle:E.borderStyle,borderRadius:String(E.borderRadius),logo:z}}return r},{statusSelector:"#qr-save-status"});oe(m);const _=()=>m.trigger();for(const r of["qr-color","qr-bg-color","qr-border-color"])(x=e.querySelector(`#${r}`))==null||x.addEventListener("input",_);for(const r of["qr-color-text","qr-bg-color-text","qr-border-color-text"])(v=e.querySelector(`#${r}`))==null||v.addEventListener("input",_);(L=e.querySelector("#qr-border-enabled"))==null||L.addEventListener("change",_);for(const r of["qr-border-style","qr-border-radius"])(F=e.querySelector(`#${r}`))==null||F.addEventListener("change",_);(M=e.querySelector("#qr-logo-upload-btn"))==null||M.addEventListener("click",()=>{var r;(r=e.querySelector("#qr-logo-upload"))==null||r.click()}),(p=e.querySelector("#qr-logo-upload"))==null||p.addEventListener("change",r=>{ut(e,o,r),_()}),(f=e.querySelector("#qr-logo-default-btn"))==null||f.addEventListener("click",()=>{gt(e,o),_()}),(B=e.querySelector("#qr-logo-remove"))==null||B.addEventListener("click",()=>{mt(e,o),_()}),(R=e.querySelector("#qr-actions"))==null||R.addEventListener("click",r=>{const E=r.target.closest("button[data-format]");E&&at(e,E.dataset.format,t.slug)}),(A=e.querySelector("#qr-theme-toggle"))==null||A.addEventListener("click",()=>{const r=e.querySelector("#qr-theme-content"),E=e.querySelector("#qr-theme-toggle .section-chevron");if(r){const C=r.style.display!=="none";r.style.display=C?"none":"block",E&&E.classList.toggle("collapsed",C)}}),(S=e.querySelector("#qr-theme-save-btn"))==null||S.addEventListener("click",()=>{rt(e,i.id)}),(U=e.querySelector("#saved-qr-themes-list"))==null||U.addEventListener("click",async r=>{const E=r.target.closest(".qr-theme-delete");if(E){r.stopPropagation(),await dt(e,i.id,E.dataset.themeId,E.dataset.themeName);return}const C=r.target.closest(".saved-theme-item");if(C){const{data:G}=await I.from("user_themes").select("theme_data").eq("id",C.dataset.themeId).single();G!=null&&G.theme_data&&ct(e,o,G.theme_data)}}),Z(e,o),_e(e,i.id)}function se(e){const t=document.createElement("div");return t.textContent=e,t.innerHTML}const vt={instagram:"Instagram",facebook:"Facebook",twitter:"X (Twitter)",linkedin:"LinkedIn",youtube:"YouTube",tiktok:"TikTok",snapchat:"Snapchat",email:"Email"};function yt(){const e=new Date,t=new Date;return t.setDate(t.getDate()-30),{from:t.toISOString().slice(0,10),to:e.toISOString().slice(0,10)}}function Be(e,t=!1){const[i,o,n]=e.split("-").map(Number);return t?new Date(i,o-1,n,23,59,59,999).toISOString():new Date(i,o-1,n,0,0,0,0).toISOString()}async function ht(e,t,i,o){var S,U;const n=i?Be(i):null,l=o?Be(o,!0):null;function a(r,E){return n&&(r=r.gte(E,n)),l&&(r=r.lte(E,l)),r}let s=I.from("link_clicks").select("*",{count:"exact",head:!0}).eq("owner_id",e).eq("list_id",t).not("link_id","is",null);s=a(s,"clicked_at");const{count:u}=await s;let c=I.from("page_views").select("*",{count:"exact",head:!0}).eq("owner_id",e).eq("list_id",t);c=a(c,"viewed_at");const{count:y}=await c;let b=I.from("page_views").select("session_id").eq("owner_id",e).eq("list_id",t);b=a(b,"viewed_at");const{data:m}=await b,_=m?new Set(m.map(r=>r.session_id).filter(Boolean)).size:0;let h=I.from("link_clicks").select("link_id, link_items:link_id (title, url)").eq("owner_id",e).eq("list_id",t).not("link_id","is",null);h=a(h,"clicked_at");const{data:q}=await h,w={};if(q)for(const r of q)w[r.link_id]||(w[r.link_id]={title:((S=r.link_items)==null?void 0:S.title)||"Unknown Link",url:((U=r.link_items)==null?void 0:U.url)||"",clicks:0}),w[r.link_id].clicks++;const g=Object.values(w).sort((r,E)=>E.clicks-r.clicks);let d=I.from("link_clicks").select("social_platform").eq("owner_id",e).eq("list_id",t);d=a(d,"clicked_at");const{data:x}=await d,v={};if(x)for(const r of x){if(!r.social_platform)continue;const E=r.social_platform.toLowerCase();v[E]||(v[E]={platform:E,clicks:0}),v[E].clicks++}const L=Object.values(v).sort((r,E)=>E.clicks-r.clicks),F=L.reduce((r,E)=>r+E.clicks,0);let M=I.from("page_views").select("viewed_at").eq("owner_id",e).eq("list_id",t);M=a(M,"viewed_at");const{data:p}=await M,f={};if(p)for(const r of p){const E=(r.viewed_at||r.created_at||"").substring(0,10);E&&(f[E]=(f[E]||0)+1)}let B=I.from("link_clicks").select("clicked_at").eq("owner_id",e).eq("list_id",t).not("link_id","is",null);B=a(B,"clicked_at");const{data:R}=await B,A={};if(R)for(const r of R){const E=(r.clicked_at||r.created_at||"").substring(0,10);E&&(A[E]=(A[E]||0)+1)}return{totalClicks:u||0,totalViews:y||0,uniqueVisitors:_,totalSocialClicks:F,linkBreakdown:g,socialBreakdown:L,dailyViews:f,dailyClicks:A}}function kt(e,t){const i=e.querySelector("#links-breakdown-list");if(!i)return;if(!t||t.length===0){i.innerHTML='<p class="analytics-empty">No link clicks yet. Start sharing your links!</p>';return}const o=Math.max(...t.map(n=>n.clicks));i.innerHTML=t.map(n=>{const l=o>0?n.clicks/o*100:0,a=n.url.length>50?n.url.substring(0,50)+"...":n.url;return`
      <div class="analytics-link-row">
        <div class="analytics-link-info">
          <div class="analytics-link-title">${se(n.title)}</div>
          <div class="analytics-link-url" title="${se(n.url)}">${se(a)}</div>
        </div>
        <div class="analytics-link-count">${n.clicks}</div>
        <div class="analytics-bar-track">
          <div class="analytics-bar-fill" style="width: ${l}%;"></div>
        </div>
      </div>
    `}).join("")}function xt(e,t){const i=e.querySelector("#social-breakdown-list");if(i){if(!t||t.length===0){i.innerHTML='<p class="analytics-empty">No social media clicks yet.</p>';return}i.innerHTML=t.map(o=>{const n=vt[o.platform]||o.platform.charAt(0).toUpperCase()+o.platform.slice(1);return`
      <div class="analytics-social-row">
        <span class="analytics-social-name">${se(n)}</span>
        <span class="analytics-social-count">${o.clicks}</span>
      </div>
    `}).join("")}}function Et(e,t){const i=(o,n)=>{const l=e.querySelector(`#${o}`);l&&(l.textContent=n)};i("stat-total-views",t.totalViews),i("stat-link-clicks",t.totalClicks),i("stat-social-clicks",t.totalSocialClicks),i("stat-unique-visitors",t.uniqueVisitors)}function _t(e,t,i,o,n){const l=e.querySelector("#analytics-chart");if(!l)return;const a=l.getContext("2d"),s=window.devicePixelRatio||1,c=l.parentElement.getBoundingClientRect().width||600,y=200;l.width=c*s,l.height=y*s,l.style.width=c+"px",l.style.height=y+"px",a.scale(s,s);const b=new Date(o||Date.now()-30*864e5),m=new Date(n||Date.now()),_=[],h=new Date(b);for(;h<=m;)_.push(h.toISOString().substring(0,10)),h.setDate(h.getDate()+1);if(_.length===0)return;const q=_.map(S=>t[S]||0),w=_.map(S=>i[S]||0),g=Math.max(...q,...w,1),d={top:20,right:16,bottom:32,left:40},x=c-d.left-d.right,v=y-d.top-d.bottom,L=document.documentElement.getAttribute("data-theme")==="dark",F=L?"rgba(255,255,255,0.1)":"#e2e8f0",M="#94a3b8",p=L?"rgba(147, 197, 253, 1)":"rgba(26, 47, 91, 1)",f=L?"rgba(74, 222, 128, 1)":"rgba(34, 197, 94, 1)",B=L?"#cbd5e1":void 0;a.clearRect(0,0,c,y),a.strokeStyle=F,a.lineWidth=.5;for(let S=0;S<=4;S++){const U=d.top+v/4*S;a.beginPath(),a.moveTo(d.left,U),a.lineTo(c-d.right,U),a.stroke()}a.fillStyle=M,a.font="10px Inter, sans-serif",a.textAlign="right";for(let S=0;S<=4;S++){const U=Math.round(g*(4-S)/4),r=d.top+v/4*S+3;a.fillText(U.toString(),d.left-6,r)}a.textAlign="center";const R=Math.max(1,Math.floor(_.length/6));for(let S=0;S<_.length;S+=R){const U=d.left+x/(_.length-1||1)*S,r=_[S].split("-");a.fillText(`${r[1]}/${r[2]}`,U,y-8)}function A(S,U){if(!(S.length<2)){a.strokeStyle=U,a.lineWidth=2,a.lineJoin="round",a.beginPath();for(let r=0;r<S.length;r++){const E=d.left+x/(S.length-1||1)*r,C=d.top+v-S[r]/g*v;r===0?a.moveTo(E,C):a.lineTo(E,C)}a.stroke(),a.lineTo(d.left+x,d.top+v),a.lineTo(d.left,d.top+v),a.closePath(),a.fillStyle=U.replace("1)",L?"0.15)":"0.08)"),a.fill()}}A(q,p),A(w,f),a.font="11px Inter, sans-serif",a.fillStyle=p,a.fillRect(d.left,4,12,3),a.fillStyle=B||p,a.fillText("Views",d.left+40,10),a.fillStyle=f,a.fillRect(d.left+80,4,12,3),a.fillStyle=B||f,a.fillText("Clicks",d.left+120,10)}function wt(e,t,i){var l,a;if(!t||!i){e.innerHTML='<div class="analytics-tab"><p>Please select a collection first.</p></div>';return}const o=yt();e.innerHTML=`
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
  `;const n=async()=>{var y,b;const s=((y=e.querySelector("#analytics-date-from"))==null?void 0:y.value)||"",u=((b=e.querySelector("#analytics-date-to"))==null?void 0:b.value)||"",c=e.querySelector("#analytics-refresh");c&&(c.disabled=!0,c.innerHTML='<i class="fas fa-spinner fa-spin"></i> Loading...');try{const m=await ht(i.id,t.id,s,u);Et(e,m),_t(e,m.dailyViews,m.dailyClicks,s,u),kt(e,m.linkBreakdown),xt(e,m.socialBreakdown)}catch(m){console.error("[Analytics] Failed to load:",m)}c&&(c.disabled=!1,c.innerHTML='<i class="fas fa-sync-alt"></i> Apply')};(l=e.querySelector("#analytics-refresh"))==null||l.addEventListener("click",n);for(const[s,u]of[["chart-toggle","chart-content"],["links-breakdown-toggle","links-breakdown-content"],["social-breakdown-toggle","social-breakdown-content"]])(a=e.querySelector(`#${s}`))==null||a.addEventListener("click",()=>{const c=e.querySelector(`#${u}`),y=e.querySelector(`#${s} .section-chevron`);if(c){const b=c.style.display!=="none";c.style.display=b?"none":"block",y&&y.classList.toggle("collapsed",b)}});n()}let O=null,k=null,P=null,T=[],Q=null,Fe="details",ge=null,J=null,K=null,pe=null;const Ue='<svg class="section-chevron" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>',De='<svg class="section-chevron collapsed" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>',Lt={backgroundType:"solid",backgroundColor:"#ffffff",gradientText:"",backgroundImage:"",backgroundImageX:50,backgroundImageY:50,backgroundImageScale:100,profileTextColor:"#1A2F5B",presentationTextColor:"#1A2F5B",buttonTextColor:"#000000",buttonBackgroundColor:"#1A2F5B",buttonStyle:"soft",buttonBorderRadius:"8px",buttonPadding:"12px 24px",buttonFontSize:"16px",buttonFontWeight:"500",textFontSize:"18px",textFontWeight:"600",borderEnabled:!0,borderType:"gradient",borderStyle:"thin",borderColor:"#1A2F5B",borderWidth:"1px",borderGradient:"linear-gradient(186deg, #D54070 0%, #8F4469 20%, #CA5699 40%, #59B8DA 60%, #9AD0DD 80%, #73B44A 100%)"};function Ne(e){const t=document.getElementById(e);if(!t)return;const i=t.textContent;t.textContent="✓ Saved",setTimeout(()=>{t.textContent=i},1500)}function we(e=50,t=50,i=100){return`translate(${(e-50)*.6}%, ${(t-50)*.6}%) scale(${i/100})`}function ze(e){e.querySelectorAll(".section-header").forEach(t=>{t.addEventListener("click",()=>{const i=t.dataset.section,o=document.getElementById(i),n=t.querySelector(".section-chevron");o&&n&&(o.classList.toggle("collapsed"),n.classList.toggle("collapsed"))})})}async function St(){var t,i;if(O=await Ve(),!O)return;const e=We("id");if(!e){Te();return}if($t(),await Promise.all([qt(e),Tt()]),!k){alert("Collection not found"),Te();return}await It(),Y(),W(),D(),Yt(),ge=ie(async()=>{try{ke();const{error:o}=await I.from("link_lists").update({presentation_data:k.presentation_data}).eq("id",k.id);if(o)throw o;return Y(),!0}catch(o){return console.error("Auto-save presentation failed:",o),!1}},{statusSelector:"#presentation-save-status"}),J=ie(async()=>{var o,n,l;try{const a=((o=document.getElementById("collection-visibility"))==null?void 0:o.value)||"public",s=(n=document.getElementById("collection-passkey"))==null?void 0:n.value.trim(),u=((l=document.getElementById("collection-slug"))==null?void 0:l.value.trim().toLowerCase().replace(/[^a-z0-9-]/g,""))||k.slug,c={visibility:a,slug:u};a==="passkey"&&s?c.passkey_hash=s:a!=="passkey"&&(c.passkey_hash=null);const{error:y}=await I.from("link_lists").update(c).eq("id",k.id);if(y)throw y;return k.visibility=a,k.slug=u,c.passkey_hash!==void 0&&(k.passkey_hash=c.passkey_hash),Y(),!0}catch(a){return console.error("Auto-save settings failed:",a),!1}},{statusSelector:"#settings-save-status"}),K=ie(async()=>{var n,l,a,s,u,c,y,b;const o=Q;if(!o)return!1;try{const m=T.find(f=>f.id===o);if(!m)return!1;const _=(n=document.getElementById("link-title"))==null?void 0:n.value.trim(),h=(l=document.getElementById("link-url"))==null?void 0:l.value.trim(),q=(a=document.getElementById("link-image"))==null?void 0:a.value.trim(),w=!!m.source_link_id,g=le(m),d=w?!m.use_library_defaults:g,x=w&&m.use_library_defaults,v=x?((s=m.image_position)==null?void 0:s.x)??50:parseInt((u=document.getElementById("link-img-pos-x"))==null?void 0:u.value)||50,L=x?((c=m.image_position)==null?void 0:c.y)??50:parseInt((y=document.getElementById("link-img-pos-y"))==null?void 0:y.value)||50,F=x?m.image_scale??100:parseInt((b=document.getElementById("link-img-scale"))==null?void 0:b.value)||100,M={url:h,use_library_defaults:!!m.use_library_defaults};d&&!w?M.custom_overrides={title:_,image_url:q||null,image_position:{x:v,y:L},image_scale:F}:x||(M.title=_,M.image_url=q||null,M.image_position={x:v,y:L},M.image_scale=F,M.custom_overrides=null);const{error:p}=await I.from("link_items").update({...M,updated_at:new Date().toISOString()}).eq("id",o);if(p)throw p;return Object.assign(m,M),j(),D(),!0}catch(m){return console.error("Auto-save link failed:",m),!1}},{statusSelector:"#link-save-status"}),pe=ie(async()=>{try{const o=$e(),n={...k.theme,...o},{error:l}=await I.from("link_lists").update({theme:n}).eq("id",k.id);if(l)throw l;return k.theme=n,D(),!0}catch(o){return console.error("Auto-save theme failed:",o),!1}},{statusSelector:"#theme-save-status"}),oe(ge),oe(J),oe(K),oe(pe),window.addEventListener("beforeunload",()=>{it()}),sessionStorage.setItem("academiqr-last-collection",JSON.stringify({id:k.id,title:((t=k.presentation_data)==null?void 0:t.title)||"Untitled Collection"})),console.log(`[AcademiQR v1.0] Editor loaded: "${((i=k.presentation_data)==null?void 0:i.title)||"Untitled"}" with ${T.length} links`)}function $t(){var i;const e=document.getElementById("main-nav");if(!e)return;e.innerHTML=`
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
  `,(i=document.getElementById("sign-out-btn"))==null||i.addEventListener("click",async()=>{await Xe(),Ye("login")}),Ke();const t=document.getElementById("theme-toggle-btn");t&&(t.querySelector("i").className=(Ze()==="dark","fas fa-circle-half-stroke"),t.addEventListener("click",()=>{const o=et();t.querySelector("i").className="fas fa-circle-half-stroke"}))}async function qt(e){try{const{data:t,error:i}=await I.from("link_lists").select("*").eq("id",e).eq("owner_id",O.id).single();if(i)throw i;k=t,console.log("[Editor] Collection loaded:",k==null?void 0:k.id)}catch(t){console.error("Failed to load collection:",t),k=null}}async function It(){if(k)try{const{data:e,error:t}=await I.from("link_items").select("*, source_link_id, use_library_defaults").eq("list_id",k.id).order("order_index",{ascending:!0});if(t)throw t;T=e||[],T.sort((i,o)=>{const n=i.order_index??1/0,l=o.order_index??1/0;return n!==l?n-l:new Date(i.created_at||0)-new Date(o.created_at||0)}),await Je(T)}catch(e){console.error("Failed to load links:",e),T=[]}}async function Tt(){try{const{data:e,error:t}=await I.from("profiles").select("display_name, username, profile_photo, profile_photo_position, social_email, social_instagram, social_facebook, social_twitter, social_linkedin, social_youtube, social_tiktok, social_snapchat").eq("id",O.id).single();if(t)throw t;P=e}catch(e){console.error("Failed to load profile:",e),P={}}}function Y(){const e=k.presentation_data||{},t=e.title||"Untitled Collection";document.getElementById("collection-title").textContent=t;const i=document.getElementById("collection-meta");if(i){const o=e.conference||"";i.innerHTML=`
      ${o?`<span class="meta-item"><i class="fas fa-building"></i> ${$(o)}</span>`:""}
      <span class="meta-item"><i class="fas fa-list"></i> ${T.length} link${T.length!==1?"s":""}</span>
    `}j()}function j(){const e=document.getElementById("links-list");if(e){if(T.length===0){e.innerHTML=`
      <div class="empty-links">
        <i class="fas fa-link"></i>
        <p>No links yet. Add your first link!</p>
      </div>
    `;return}e.innerHTML=T.map((t,i)=>{const o=t.id===Q,n=t.is_active!==!1;return`
      <div class="link-item ${o?"selected":""} ${n?"":"inactive"}"
           data-link-id="${t.id}" data-index="${i}">
        <div class="link-drag-handle" title="Drag to reorder">
          <i class="fas fa-grip-vertical"></i>
        </div>
        ${ue(t)?`
          <div class="link-thumb">
            <img src="${$(ue(t))}" alt="" loading="lazy"
                 onerror="this.parentElement.innerHTML='<i class=\\'fas fa-image\\'></i>'">
          </div>
        `:`
          <div class="link-thumb link-thumb-empty">
            <i class="fas fa-link"></i>
          </div>
        `}
        <div class="link-info">
          <div class="link-title">${$(xe(t)||"Untitled Link")}${t.use_library_defaults&&t.source_link_id?' <i class="fas fa-link" style="font-size:0.6rem; opacity:0.5;" title="Using library version"></i>':""}</div>
          <div class="link-url">${$(Qe(t.url||""))}</div>
        </div>
        <div class="link-actions">
          <button class="btn-icon link-toggle" data-link-id="${t.id}" title="${n?"Active":"Inactive"}">
            <i class="fas ${n?"fa-toggle-on":"fa-toggle-off"}"></i>
          </button>
        </div>
      </div>
    `}).join(""),e.querySelectorAll(".link-item").forEach(t=>{t.addEventListener("click",i=>{i.target.closest(".link-toggle")||i.target.closest(".link-drag-handle")||(Q=t.dataset.linkId,j(),W(),Bt())})}),e.querySelectorAll(".link-toggle").forEach(t=>{t.addEventListener("click",i=>{i.stopPropagation(),Ot(t.dataset.linkId)})}),Wt()}}function Bt(){setTimeout(()=>{const e=document.getElementById("link-editor-section");e&&(e.style.display="block",e.scrollIntoView({behavior:"smooth",block:"start"}))},50)}function W(){const e=document.getElementById("tab-content");if(e)switch(Fe){case"details":Ct(e);break;case"appearance":ve(e);break;case"qr-code":Ft(e);break;case"analytics":Ut(e);break}}function Ct(e){var s,u,c,y,b,m,_,h,q,w;const t=k.presentation_data||{},i=Ue,o=k.visibility||"public",n=!!k.passkey_hash;let l=`
    <!-- ═══ PRESENTATION INFORMATION ═══ -->
    <div class="section">
      <div class="section-header" data-section="presentation-section">
        <h3>Presentation Information <span id="presentation-save-status" class="auto-save-status"></span></h3>
        ${i}
      </div>
      <div class="section-content" id="presentation-section">
        <div class="form-group">
          <label for="info-title">Title</label>
          <input type="text" id="info-title" value="${$(t.title||"")}" placeholder="Presentation title" maxlength="200">
        </div>
        <div class="form-group">
          <label for="info-conference">Conference / Event</label>
          <input type="text" id="info-conference" value="${$(t.conference||"")}" placeholder="Conference name" maxlength="200">
        </div>
        <div class="form-group">
          <label for="info-location">Location</label>
          <input type="text" id="info-location" value="${$(t.location||"")}" placeholder="City, State / Country" maxlength="200">
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

    <!-- ═══ COLLECTION SETTINGS ═══ -->
    <div class="section">
      <div class="section-header" data-section="settings-section">
        <h3>Collection Settings <span id="settings-save-status" class="auto-save-status"></span></h3>
        ${De}
      </div>
      <div class="section-content collapsed" id="settings-section">
        <div class="form-group">
          <label for="collection-slug">Collection URL Slug</label>
          <div class="slug-input-row">
            <span class="slug-prefix">${P!=null&&P.username?`academiqr.com/u/${$(P.username)}/`:"slug: "}</span>
            <input type="text" id="collection-slug" value="${$(k.slug||"")}" placeholder="my-collection" maxlength="60">
          </div>
          <p id="slug-status" style="font-size:0.75rem; margin-top:4px; min-height:1.2em; color:#9ca3af;"></p>
        </div>
        <div class="form-group">
          <label>Public Link</label>
          <div style="display:flex; align-items:center; gap:8px; background:#f8fafc; padding:10px 14px; border-radius:8px; border:1px solid #e2e8f0;">
            <i class="fas fa-link" style="color:#9ca3af; font-size:0.75rem;"></i>
            <span id="public-link-preview" style="color:#64748b; font-size:0.8rem; word-break:break-all;">${P!=null&&P.username&&k.slug?`academiqr.com/u/${$(P.username)}/${$(k.slug)}`:`academiqr.com/public.html?collection=${k.id.substring(0,8)}...`}</span>
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
  `;if(Q){const g=T.find(d=>d.id===Q);if(g){const d=!!g.source_link_id,x=le(g),v=d?!g.use_library_defaults:x,L=d&&g.use_library_defaults,F=v&&x?g.custom_overrides.title??g.title??"":g.title||"",M=v&&x?g.custom_overrides.image_url??g.image_url??"":g.image_url||"",p=xe(g)||"",f=ue(g)||"",B=L?Me(g):v&&x&&g.custom_overrides.image_position?g.custom_overrides.image_position:g.image_position||g.imagePosition||{x:50,y:50},R=L?Ae(g):v&&x&&g.custom_overrides.image_scale!=null?g.custom_overrides.image_scale:g.image_scale??g.imageScale??100,A=L?f:M;l+=`
    <!-- ═══ EDIT LINK ═══ -->
    <div class="section">
      <div class="section-header" data-section="link-editor-section">
        <h3>Edit Link <span id="link-save-status" class="auto-save-status"></span></h3>
        ${i}
      </div>
      <div class="section-content" id="link-editor-section">
        <div class="link-editor">
          <div class="link-editor-header" style="margin-bottom:12px;">
            <span style="font-size:0.875rem; color:#64748b;">Editing: <strong>${$(p||"Untitled")}</strong></span>
            <button class="btn-danger btn-sm" id="delete-link-btn" data-link-id="${g.id}">
              <i class="fas fa-trash"></i> Delete
            </button>
          </div>

          <!-- Library / Customize toggle (all links) -->
          <div class="link-source-toggle">
            <div class="source-toggle-options">
              <label class="source-toggle-option ${v?"":"active"}">
                <input type="radio" name="link-source-mode" value="library" ${v?"":"checked"}>
                <i class="fas fa-book"></i> Use Library Version
              </label>
              <label class="source-toggle-option ${v?"active":""}">
                <input type="radio" name="link-source-mode" value="custom" ${v?"checked":""}>
                <i class="fas fa-pen"></i> Customize for This Collection
              </label>
            </div>
            ${v?`
              <p class="source-toggle-hint"><i class="fas fa-info-circle"></i> This link has custom title/image for this collection only.</p>
            `:`
              <p class="source-toggle-hint"><i class="fas fa-info-circle"></i> ${d?"Title and image sync with the library version. Changes in the library will appear here automatically.":"Editing title or image here will also update in your Link Library."}</p>
            `}
          </div>

          <div class="form-group">
            <label for="link-title">Title</label>
            <input type="text" id="link-title" value="${$(L?p:F)}" placeholder="Link title" ${L?"disabled":""}>
          </div>

          <div class="form-group">
            <label for="link-url">URL</label>
            <input type="url" id="link-url" value="${$(g.url||"")}" placeholder="https://...">
          </div>

          <div class="form-group">
            <label for="link-image">Image URL</label>
            <div class="image-input-row">
              <input type="text" id="link-image" value="${$(A||"")}" placeholder="Image URL or upload" ${L?"disabled":""}>
              <button class="btn-secondary" id="upload-image-btn" ${L?"disabled":""}><i class="fas fa-upload"></i> Upload</button>
              <button class="btn-secondary" id="browse-media-btn" ${L?"disabled":""}><i class="fas fa-images"></i> Browse</button>
              <input type="file" id="link-image-file" accept="image/*" style="display:none;">
            </div>
            ${A?`
              <div class="image-preview" style="margin-top:12px;">
                <img src="${$(A)}" alt="Preview"
                     style="transform: ${we(B.x,B.y,R)};"
                     onerror="this.style.display='none'">
              </div>
              ${L?"":`
              <div class="form-group" style="margin-top:8px;">
                <label>Image Position X</label>
                <input type="range" id="link-img-pos-x" min="0" max="100" value="${B.x??50}" class="range-input">
              </div>
              <div class="form-group">
                <label>Image Position Y</label>
                <input type="range" id="link-img-pos-y" min="0" max="100" value="${B.y??50}" class="range-input">
              </div>
              <div class="form-group">
                <label>Image Scale</label>
                <input type="range" id="link-img-scale" min="50" max="200" value="${R}" class="range-input">
              </div>
              `}
            `:""}
          </div>

          ${v?`
          <div class="form-actions">
              <button class="btn-secondary" id="save-as-library-btn" title="Create a new library link with this custom title/image">
                <i class="fas fa-plus"></i> Save as New Library Link
              </button>
          </div>
          `:""}
        </div>
      </div>
    </div>
      `}}else l+=`
    <div style="text-align:center; padding:24px; color:#9ca3af;">
      <i class="fas fa-mouse-pointer" style="font-size:1.5rem; opacity:0.3; margin-bottom:8px; display:block;"></i>
      <p style="font-size:0.875rem;">Select a link in the sidebar to edit it</p>
    </div>
    `;e.innerHTML=l,["info-title","info-conference","info-location","info-date"].forEach(g=>{var d;(d=document.getElementById(g))==null||d.addEventListener("input",()=>{ke(),D(),ge.trigger()})}),["display-title","display-conference"].forEach(g=>{var d;(d=document.getElementById(g))==null||d.addEventListener("change",()=>{ke(),D(),ge.trigger()})}),(s=document.getElementById("copy-link-btn"))==null||s.addEventListener("click",Rt);const a=k.slug||"";if((u=document.getElementById("collection-slug"))==null||u.addEventListener("input",g=>{const d=g.target.value.toLowerCase().replace(/[^a-z0-9-]/g,"");g.target.value=d;const x=document.getElementById("public-link-preview"),v=document.getElementById("slug-status");x&&(P!=null&&P.username)&&d?x.textContent=`academiqr.com/u/${P.username}/${d}`:x&&d&&(x.textContent=`academiqr.com/public.html?collection=${k.id.substring(0,8)}...`),v&&a&&d!==a?v.innerHTML='<span style="color:#dc2626;"><i class="fas fa-exclamation-triangle"></i> Changing this slug will break any QR codes or shared links that use the current short URL.</span>':v&&(v.textContent=""),a&&d!==a||J.trigger()}),(c=document.getElementById("collection-slug"))==null||c.addEventListener("blur",()=>{var d;const g=((d=document.getElementById("collection-slug"))==null?void 0:d.value.trim().toLowerCase().replace(/[^a-z0-9-]/g,""))||"";if(a&&g!==a&&g)if(confirm(`You are changing this collection's URL slug.

Any QR codes or shared links using the short URL format will stop working.
(Note: QR codes using the legacy ?collection= format will still work.)

Continue?`))J.trigger();else{document.getElementById("collection-slug").value=a;const v=document.getElementById("public-link-preview");v&&(P!=null&&P.username)&&a&&(v.textContent=`academiqr.com/u/${P.username}/${a}`);const L=document.getElementById("slug-status");L&&(L.textContent="")}}),(y=document.getElementById("collection-visibility"))==null||y.addEventListener("change",g=>{const d=document.getElementById("passkey-group");d&&(d.style.display=g.target.value==="passkey"?"block":"none"),J.trigger()}),(b=document.getElementById("collection-passkey"))==null||b.addEventListener("input",()=>{J.trigger()}),Q){const g=Q;(m=document.getElementById("delete-link-btn"))==null||m.addEventListener("click",()=>zt(g)),["link-title","link-url","link-image"].forEach(d=>{var x;(x=document.getElementById(d))==null||x.addEventListener("input",()=>{K.trigger()})}),document.querySelectorAll('input[name="link-source-mode"]').forEach(d=>{d.addEventListener("change",x=>{const v=T.find(F=>F.id===g);if(!v)return;const L=x.target.value==="library";v.source_link_id?v.use_library_defaults=L:L?v.custom_overrides=null:v.custom_overrides={title:v.title||"",image_url:v.image_url||null,image_position:v.image_position||{x:50,y:50},image_scale:v.image_scale??100},W(),j(),D()})}),(_=document.getElementById("save-as-library-btn"))==null||_.addEventListener("click",()=>Nt(g)),(h=document.getElementById("upload-image-btn"))==null||h.addEventListener("click",()=>{var d;(d=document.getElementById("link-image-file"))==null||d.click()}),(q=document.getElementById("link-image-file"))==null||q.addEventListener("change",Mt),(w=document.getElementById("browse-media-btn"))==null||w.addEventListener("click",()=>{Se(d=>{const x=document.getElementById("link-image");x&&(x.value=d);const v=T.find(L=>L.id===g);v&&(le(v)?v.custom_overrides.image_url=d:v.image_url=d,D(),j(),W(),K.trigger())})}),["link-img-pos-x","link-img-pos-y","link-img-scale"].forEach(d=>{var x;(x=document.getElementById(d))==null||x.addEventListener("input",()=>{At(),K.trigger()})})}ze(e)}function ke(){var t,i,o,n,l,a;const e=k.presentation_data||{};e.title=((t=document.getElementById("info-title"))==null?void 0:t.value)||"",e.conference=((i=document.getElementById("info-conference"))==null?void 0:i.value)||"",e.location=((o=document.getElementById("info-location"))==null?void 0:o.value)||"",e.date=((n=document.getElementById("info-date"))==null?void 0:n.value)||"",e.displayTitle=((l=document.getElementById("display-title"))==null?void 0:l.checked)??!0,e.displayConference=((a=document.getElementById("display-conference"))==null?void 0:a.checked)??!0,k.presentation_data=e}function Rt(){const e=Re(O.id,k.id,{username:P==null?void 0:P.username,slug:k.slug});navigator.clipboard.writeText(e).then(()=>{const t=document.getElementById("copy-link-btn");t&&(t.innerHTML='<i class="fas fa-check"></i>',setTimeout(()=>{t.innerHTML='<i class="fas fa-copy"></i>'},1500))}).catch(()=>{prompt("Copy this link:",e)})}async function Mt(e){var n;const t=(n=e.target.files)==null?void 0:n[0];if(!t)return;const i=document.getElementById("upload-image-btn"),o=i==null?void 0:i.innerHTML;try{i&&(i.disabled=!0,i.innerHTML='<i class="fas fa-spinner fa-spin"></i> Uploading...');const l=await Ee(t,"links",O.id,{maxWidth:800,maxHeight:800}),a=document.getElementById("link-image");a&&(a.value=l);const s=T.find(u=>u.id===Q);s&&(le(s)?s.custom_overrides.image_url=l:s.image_url=l,D(),j(),K.trigger())}catch(l){console.error("Image upload failed:",l),alert("Image upload failed: "+l.message)}finally{i&&(i.disabled=!1,i.innerHTML=o)}}function At(){var l,a,s;const e=T.find(u=>u.id===Q);if(!e)return;const t=parseInt((l=document.getElementById("link-img-pos-x"))==null?void 0:l.value)||50,i=parseInt((a=document.getElementById("link-img-pos-y"))==null?void 0:a.value)||50,o=parseInt((s=document.getElementById("link-img-scale"))==null?void 0:s.value)||100;le(e)?(e.custom_overrides.image_position={x:t,y:i},e.custom_overrides.image_scale=o):(e.image_position={x:t,y:i},e.image_scale=o);const n=document.querySelector(".image-preview img");n&&(n.style.transform=we(t,i,o)),D()}function Le(e){if(!e||typeof e=="object"&&Object.keys(e).length===0)return{...Lt};if(typeof e=="string")try{e=JSON.parse(e)}catch{return Le(null)}const t=e.borderEnabled!==void 0?!!e.borderEnabled:e.gradientBorderEnabled!==void 0?!!e.gradientBorderEnabled:!0,i=[e.textColor,e.presentationTextColor,e.profileTextColor,e.presentationColor,e.profileColor].find(n=>typeof n=="string"&&n.length>0)||"#1A2F5B";return{backgroundType:e.backgroundType||"solid",backgroundColor:e.backgroundColor||"#ffffff",gradientText:e.gradientText||"",backgroundImage:e.backgroundImage||"",backgroundImageX:e.backgroundImageX??e.imagePositionX??50,backgroundImageY:e.backgroundImageY??e.imagePositionY??50,backgroundImageScale:e.backgroundImageScale??e.imageScale??100,profileTextColor:i,presentationTextColor:i,buttonTextColor:e.buttonTextColor||"#000000",buttonBackgroundColor:e.buttonBackgroundColor||e.buttonBgColor||"#1A2F5B",buttonStyle:e.buttonStyle||"soft",buttonBorderRadius:e.buttonBorderRadius||e.borderRadius||"8px",buttonPadding:e.buttonPadding||"12px 24px",buttonFontSize:e.buttonFontSize||"16px",buttonFontWeight:e.buttonFontWeight||"500",textFontSize:e.textFontSize||"18px",textFontWeight:e.textFontWeight||"600",borderEnabled:t,borderType:e.borderType||"solid",borderStyle:e.borderStyle==="fill"||e.borderStyle==="thin"?e.borderStyle:"fill",borderColor:e.borderColor||"#1A2F5B",borderWidth:e.borderWidth||"1px",borderGradient:e.borderGradient||e.borderGradientText||"",borderGradientAngle:e.borderGradientAngle||""}}const Pt=["#ffffff","#e5e7eb","#9ca3af","#1f2937","#000000","#1A2F5B"],Ce=["linear-gradient(45deg, #ff6b6b, #4ecdc4)","linear-gradient(135deg, #1A2F5B, #3B5B8F)","linear-gradient(43deg, #D54070 0%, #8F4469 20%, #CA5699 40%, #59B8DA 60%, #9AD0DD 80%, #73B44A 100%)"];function ee(e){return`<div class="color-presets">${Pt.map(t=>`<button type="button" class="color-preset ${t===e?"active":""}" data-color="${t}" style="background:${t};${t==="#ffffff"?"border:1px solid #e5e7eb;":""}" title="${t}"></button>`).join("")}</div>`}function ve(e){var w,g,d,x,v,L,F,M;const t=Le(k.theme),i=t.backgroundType,o=t.backgroundColor,n=t.gradientText||"linear-gradient(45deg, #ff6b6b 0%, #4ecdc4 100%)";t.profileTextColor;const l=t.presentationTextColor,a=t.buttonTextColor,s=t.buttonBackgroundColor,u=t.buttonStyle,c=t.borderEnabled,y=t.borderType,b=t.borderStyle,m=t.borderColor;t.borderWidth,t.buttonBorderRadius;const _=t.borderGradient,h=Ue;e.innerHTML=`
    <div class="appearance-editor">
      <!-- ═══ BACKGROUND ═══ -->
      <div class="section">
        <div class="section-header" data-section="background-section">
          <h3>Background <span id="theme-save-status" class="auto-save-status"></span></h3>
          ${h}
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
              ${ee(o)}
            </div>
          </div>

          <!-- Gradient -->
          <div id="bg-gradient-group" style="display:${i==="gradient"?"block":"none"}">
            <div class="form-group">
              <label>Gradient CSS</label>
              <textarea id="theme-gradient" class="gradient-textarea" rows="2" placeholder="linear-gradient(...)">${$(n)}</textarea>
              <div class="gradient-preview" id="gradient-preview" style="background: ${n};"></div>
            </div>
            <div class="form-group">
              <label>Presets</label>
              <div class="gradient-presets">
                ${Ce.map((p,f)=>`
                  <button type="button" class="gradient-preset" data-gradient="${$(p)}" style="background: ${p};" title="Preset ${f+1}"></button>
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
          ${h}
        </div>
        <div class="section-content" id="text-buttons-section">
          <div class="form-group">
            <label>Profile and Presentation Information Text Color</label>
            <div class="color-input-row">
              <input type="color" id="theme-presentation-text" value="${l}">
              <input type="text" id="theme-presentation-text-val" value="${l}" class="color-text">
            </div>
            ${ee(l)}
          </div>
          <div class="form-group">
            <label>Button Text Color</label>
            <div class="color-input-row">
              <input type="color" id="theme-btn-text" value="${a}">
              <input type="text" id="theme-btn-text-val" value="${a}" class="color-text">
            </div>
            ${ee(a)}
          </div>
          <div class="form-group">
            <label>Button Style</label>
            <select id="theme-button-style" class="form-select">
              <option value="soft" ${u==="soft"?"selected":""}>Soft Glass</option>
              <option value="solid" ${u==="solid"?"selected":""}>Solid</option>
              <option value="outline" ${u==="outline"?"selected":""}>Outline</option>
            </select>
          </div>
          <div class="form-group" id="btn-bg-group" style="display:${u==="solid"?"block":"none"}">
            <label>Button Background Color</label>
            <div class="color-input-row">
              <input type="color" id="theme-btn-bg" value="${s}">
              <input type="text" id="theme-btn-bg-val" value="${s}" class="color-text">
            </div>
            ${ee(s)}
          </div>
        </div>
      </div>

      <!-- ═══ BORDER EFFECTS ═══ -->
      <div class="section">
        <div class="section-header" data-section="border-effects-section">
          <h3>Border Effects</h3>
          ${h}
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
                <label class="radio-label"><input type="radio" name="border-type" value="solid" ${y==="solid"?"checked":""}> Solid Color</label>
                <label class="radio-label"><input type="radio" name="border-type" value="gradient" ${y==="gradient"?"checked":""}> Gradient</label>
              </div>
            </div>
            <div class="form-group">
              <label>Border Style</label>
              <div class="radio-group">
                <label class="radio-label"><input type="radio" name="border-style" value="fill" ${b==="fill"?"checked":""}> Frame Fill</label>
                <label class="radio-label"><input type="radio" name="border-style" value="thin" ${b==="thin"?"checked":""}> Thin Border</label>
              </div>
            </div>

            <!-- Solid border color -->
            <div id="border-solid-group" style="display:${y==="solid"?"block":"none"}">
              <div class="form-group">
                <label>Border Color</label>
                <div class="color-input-row">
                  <input type="color" id="theme-border-color" value="${m}">
                  <input type="text" id="theme-border-color-val" value="${m}" class="color-text">
                </div>
                ${ee(m)}
              </div>
            </div>

            <!-- Gradient border -->
            <div id="border-gradient-group" style="display:${y==="gradient"?"block":"none"}">
              <div class="form-group">
                <label>Border Gradient CSS</label>
                <textarea id="theme-border-gradient" class="gradient-textarea" rows="2" placeholder="linear-gradient(...)">${$(_)}</textarea>
                <div class="gradient-preview" id="border-gradient-preview" style="background: ${_||"linear-gradient(45deg, #1A2F5B, #3B5B8F)"};"></div>
              </div>
              <div class="form-group">
                <label>Presets</label>
                <div class="gradient-presets">
                  ${Ce.map((p,f)=>`
                    <button type="button" class="border-gradient-preset" data-gradient="${$(p)}" style="background: ${p};" title="Preset ${f+1}"></button>
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
          ${De}
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
  `,[["theme-bg-color","theme-bg-color-text"],["theme-presentation-text","theme-presentation-text-val"],["theme-btn-bg","theme-btn-bg-val"],["theme-btn-text","theme-btn-text-val"],["theme-border-color","theme-border-color-val"]].forEach(([p,f])=>{var B,R;(B=document.getElementById(p))==null||B.addEventListener("input",A=>{const S=document.getElementById(f);S&&(S.value=A.target.value),N()}),(R=document.getElementById(f))==null||R.addEventListener("input",A=>{const S=document.getElementById(p);S&&/^#[0-9a-fA-F]{6}$/.test(A.target.value)&&(S.value=A.target.value),N()})}),e.addEventListener("click",p=>{const f=p.target.closest(".color-preset");if(!f)return;const B=f.dataset.color,R=f.closest(".form-group"),A=R==null?void 0:R.querySelector('input[type="color"]'),S=R==null?void 0:R.querySelector(".color-text");A&&(A.value=B),S&&(S.value=B),R==null||R.querySelectorAll(".color-preset").forEach(U=>U.classList.remove("active")),f.classList.add("active"),N()}),e.querySelectorAll(".gradient-preset").forEach(p=>{p.addEventListener("click",()=>{const f=document.getElementById("theme-gradient"),B=document.getElementById("gradient-preview");f&&(f.value=p.dataset.gradient),B&&(B.style.background=p.dataset.gradient),N()})}),e.querySelectorAll(".border-gradient-preset").forEach(p=>{p.addEventListener("click",()=>{const f=document.getElementById("theme-border-gradient"),B=document.getElementById("border-gradient-preview");f&&(f.value=p.dataset.gradient),B&&(B.style.background=p.dataset.gradient),N()})}),e.querySelectorAll('input[name="bg-type"]').forEach(p=>{p.addEventListener("change",f=>{document.getElementById("bg-solid-group").style.display=f.target.value==="solid"?"block":"none",document.getElementById("bg-gradient-group").style.display=f.target.value==="gradient"?"block":"none",document.getElementById("bg-image-group").style.display=f.target.value==="image"?"block":"none",N()})}),(w=document.getElementById("theme-button-style"))==null||w.addEventListener("change",p=>{const f=document.getElementById("btn-bg-group");f&&(f.style.display=p.target.value==="solid"?"block":"none"),N()}),(g=document.getElementById("theme-border-enabled"))==null||g.addEventListener("change",p=>{const f=document.getElementById("border-options");f&&(f.style.display=p.target.checked?"block":"none"),N()}),e.querySelectorAll('input[name="border-type"]').forEach(p=>{p.addEventListener("change",f=>{document.getElementById("border-solid-group").style.display=f.target.value==="solid"?"block":"none",document.getElementById("border-gradient-group").style.display=f.target.value==="gradient"?"block":"none",N()})}),(d=document.getElementById("theme-gradient"))==null||d.addEventListener("input",p=>{const f=document.getElementById("gradient-preview");f&&(f.style.background=p.target.value),N()}),(x=document.getElementById("theme-border-gradient"))==null||x.addEventListener("input",p=>{const f=document.getElementById("border-gradient-preview");f&&(f.style.background=p.target.value),N()}),["bg-pos-x","bg-pos-y","bg-pos-scale"].forEach(p=>{var f;(f=document.getElementById(p))==null||f.addEventListener("input",N)}),(v=document.getElementById("bg-upload-btn"))==null||v.addEventListener("click",()=>{var p;(p=document.getElementById("bg-image-file"))==null||p.click()}),(L=document.getElementById("bg-image-file"))==null||L.addEventListener("change",Ht);const Jt=document.getElementById("bg-image-remove");Jt&&Jt.addEventListener("click",()=>{delete k._pendingBgImage,k.theme&&(k.theme.backgroundImage="",k.theme.backgroundType="solid"),document.querySelector('input[name="bg-type"][value="solid"]').checked=!0,document.getElementById("bg-solid-group").style.display="block",document.getElementById("bg-gradient-group").style.display="none",document.getElementById("bg-image-group").style.display="none",N(),ve(document.getElementById("tab-content"))}),(F=document.getElementById("bg-browse-media-btn"))==null||F.addEventListener("click",()=>{Se(p=>{k._pendingBgImage=p,N(),ve(document.getElementById("tab-content"))})}),["theme-button-style"].forEach(p=>{var f;(f=document.getElementById(p))==null||f.addEventListener("change",N)}),e.querySelectorAll('input[name="border-style"]').forEach(p=>{p.addEventListener("change",N)}),ze(e),(M=document.getElementById("save-new-theme-btn"))==null||M.addEventListener("click",Xt),qe()}async function Ht(e){var n;const t=(n=e.target.files)==null?void 0:n[0];if(!t)return;const i=document.getElementById("bg-upload-btn"),o=i==null?void 0:i.innerHTML;try{i&&(i.disabled=!0,i.innerHTML='<i class="fas fa-spinner fa-spin"></i> Uploading...');const l=await Ee(t,"backgrounds",O.id,{maxWidth:1920,maxHeight:1920});k._pendingBgImage=l,N(),ve(document.getElementById("tab-content"))}catch(l){console.error("Background image upload failed:",l),alert("Background image upload failed: "+l.message)}finally{i&&(i.disabled=!1,i.innerHTML=o)}}function N(){const e=$e(),t={...k.theme,...e};k._pendingBgImage&&(t.backgroundImage=k._pendingBgImage),D(t),pe&&pe.trigger()}function Ft(e){bt(e,k,O)}function Ut(e){wt(e,k,O)}function D(e){const t=document.getElementById("phone-preview");if(!t)return;const i=Le(e||k.theme),o=k.presentation_data||{},n=P||{},l=i.backgroundType;let a="";if(l==="gradient"&&i.gradientText)a=`background: ${i.gradientText};`;else if(l==="image"&&i.backgroundImage){const C=i.backgroundImageX,G=i.backgroundImageY,ye=i.backgroundImageScale;a=`background: url('${i.backgroundImage}') ${C}% ${G}% / ${ye}% no-repeat;`}else a=`background: ${i.backgroundColor};`;const s=i.presentationTextColor,u=s,c=i.buttonStyle,y=i.buttonBackgroundColor,b=i.buttonTextColor;i.buttonBorderRadius;const m=i.borderEnabled,_=i.borderType,h=i.borderStyle,q=i.borderColor,w=i.borderGradient,g=n.profile_photo||"";let d={scale:100,x:50,y:50};if(n.profile_photo_position)try{d=typeof n.profile_photo_position=="string"?JSON.parse(n.profile_photo_position):n.profile_photo_position}catch{}const x=(d.scale||100)/100,v=((d.x||50)-50)*-1,L=((d.y||50)-50)*-1,F=[{key:"social_email",icon:"fa-envelope",prefix:"mailto:"},{key:"social_instagram",icon:"fa-instagram",prefix:""},{key:"social_facebook",icon:"fa-facebook",prefix:""},{key:"social_twitter",icon:"fa-x-twitter",prefix:""},{key:"social_linkedin",icon:"fa-linkedin",prefix:""},{key:"social_youtube",icon:"fa-youtube",prefix:""},{key:"social_tiktok",icon:"fa-tiktok",prefix:""},{key:"social_snapchat",icon:"fa-snapchat",prefix:""}].filter(C=>{var G;return(G=n[C.key])==null?void 0:G.trim()}),M=o.title||"Untitled",p=o.displayTitle!==!1,f=o.displayConference!==!1,B=o.conference||"",R=o.location||"",A=o.date?Dt(o.date):"",S=T.filter(C=>C.is_active!==!1);function U(){let C=`color: ${b}; border-radius: 8px; font-size: 1.14rem;`;return c==="solid"?C+=`background: ${y} !important; border-color: ${y} !important;`:c==="outline"?C+=`background: transparent !important; border: 2px solid ${b} !important; color: ${b} !important;`:C+=`color: ${b} !important;`,C}const r=t.closest(".phone-mockup")||t.parentElement;r&&(r.style.boxShadow="0 20px 40px rgba(0, 0, 0, 0.3)",r.style.padding="8px",m?_==="gradient"&&w?h==="thin"?(r.style.background=w,r.style.padding="8px",r.style.boxShadow="inset 0 0 0 3px transparent, 0 20px 40px rgba(0, 0, 0, 0.3)"):(r.style.background=w,r.style.padding="8px"):h==="thin"?(r.style.background="#1e293b",r.style.boxShadow=`inset 0 0 0 8px ${q}, 0 20px 40px rgba(0, 0, 0, 0.3)`):r.style.background=q:r.style.background="#1e293b");const E=p&&M||f&&B||R||A;t.innerHTML=`
    <div class="phone-screen" style="${a}">
      <!-- Header content — wraps profile + presentation like v0.6.7 -->
      <div class="phone-header-content">
        <!-- Profile — avatar + name side by side -->
        <div class="phone-profile-section">
          ${g?`
            <div class="phone-avatar">
              <img src="${$(g)}" alt="Profile"
                   style="transform: translate(${v}%, ${L}%) scale(${x}) !important; transform-origin: center center !important;"
                   onerror="this.parentElement.style.display='none'">
            </div>
          `:""}
          <div class="phone-name-section">
            ${n.display_name?`<h4 class="phone-display-name" style="color: ${u};">${$(n.display_name)}</h4>`:""}
            ${F.length>0?`
              <div class="phone-socials">
                ${F.map(C=>`
                  <span class="phone-social-icon ${C.key}" title="${C.key.replace("social_","")}">
                    <i class="${C.key==="social_email"?"fas":"fab"} ${C.icon}"></i>
                  </span>
                `).join("")}
              </div>
            `:""}
          </div>
        </div>

        <!-- Presentation Info -->
        ${E?`
          <div class="phone-presentation" style="color: ${s};">
            ${p?`<div class="phone-info-field"><span class="phone-info-value">${$(M)}</span></div>`:""}
            ${f&&B?`<div class="phone-info-field"><span class="phone-info-value">${$(B)}</span></div>`:""}
            ${R?`<div class="phone-info-field"><span class="phone-info-value" style="font-size:0.9rem;">${$(R)}</span></div>`:""}
            ${A?`<div class="phone-info-field"><span class="phone-info-value" style="font-size:0.9rem;">${$(A)}</span></div>`:""}
          </div>
        `:""}
      </div>

      <!-- Links -->
      <div class="phone-links">
        ${S.length===0?`
          <p class="phone-empty" style="color: ${s};">No active links</p>
        `:S.map(C=>{const G=Me(C),ye=Ae(C),Ge=we(G.x,G.y,ye),Ie=ue(C),je=xe(C)||"Untitled";return`
            <div class="phone-link-btn ${c}" style="${U()}">
              ${Ie?`
                <div class="phone-link-image-wrapper">
                  <div class="phone-link-image">
                    <img src="${$(Ie)}" alt=""
                      style="transform: ${Ge};"
                      onerror="this.parentElement.innerHTML='<i class=\\'fas fa-link\\' style=\\'color:#6b7280\\'></i>'">
                  </div>
                </div>
              `:""}
              <div class="phone-link-text">${$(je)}</div>
            </div>
          `}).join("")}
      </div>

      <!-- Footer -->
      <div class="phone-footer" style="color: ${u};">
        <p class="phone-footer-text">Powered by <a href="https://academiqr.com" style="color: ${u};">AcademiQR.com</a></p>
      </div>
    </div>
  `}function Dt(e){try{return new Date(e+"T00:00:00").toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}catch{return e}}async function Nt(e){var u,c,y,b,m,_;if(!T.find(h=>h.id===e))return;const i=(u=document.getElementById("link-title"))==null?void 0:u.value.trim(),o=(c=document.getElementById("link-url"))==null?void 0:c.value.trim(),n=(y=document.getElementById("link-image"))==null?void 0:y.value.trim(),l=parseInt((b=document.getElementById("link-img-pos-x"))==null?void 0:b.value)||50,a=parseInt((m=document.getElementById("link-img-pos-y"))==null?void 0:m.value)||50,s=parseInt((_=document.getElementById("link-img-scale"))==null?void 0:_.value)||100;if(!i){alert("Please enter a title.");return}if(!o){alert("Please enter a URL.");return}try{const h=T.reduce((g,d)=>Math.max(g,d.order_index||0),0),{data:q,error:w}=await I.from("link_items").insert({list_id:k.id,title:i,url:o,image_url:n||null,image_position:{x:l,y:a},image_scale:s,order_index:h+100,is_active:!0}).select().single();if(w)throw w;T.push(q),Q=q.id,j(),W(),D(),Y(),Ne("save-as-library-btn")}catch(h){console.error("Failed to create library link:",h),alert("Failed to create: "+h.message)}}async function zt(e){const t=T.find(i=>i.id===e);if(!(!t||!confirm(`Delete "${t.title||"this link"}"?`)))try{const{error:i}=await I.from("link_items").delete().eq("id",e).eq("list_id",k.id);if(i)throw i;T=T.filter(o=>o.id!==e),Q=null,j(),W(),D(),Y()}catch(i){console.error("Failed to delete link:",i),alert("Failed to delete: "+i.message)}}async function Ot(e){const t=T.find(o=>o.id===e);if(!t)return;const i=t.is_active===!1;try{const{error:o}=await I.from("link_items").update({is_active:i}).eq("id",e);if(o)throw o;t.is_active=i,j(),D()}catch(o){console.error("Failed to toggle link:",o)}}function Qt(){const e=document.getElementById("new-link-modal");e&&(document.getElementById("new-link-title").value="",document.getElementById("new-link-url").value="",document.getElementById("new-link-image").value="",e.style.display="flex",document.getElementById("new-link-title").focus())}function ne(){const e=document.getElementById("new-link-modal");e&&(e.style.display="none")}async function Gt(){var o,n,l;const e=(o=document.getElementById("new-link-title"))==null?void 0:o.value.trim(),t=(n=document.getElementById("new-link-url"))==null?void 0:n.value.trim(),i=(l=document.getElementById("new-link-image"))==null?void 0:l.value.trim();if(!e){alert("Please enter a title.");return}if(!t){alert("Please enter a URL.");return}try{const a=T.reduce((c,y)=>Math.max(c,y.order_index||0),0),{data:s,error:u}=await I.from("link_items").insert({list_id:k.id,title:e,url:t,image_url:i||null,order_index:a+100,is_active:!0}).select().single();if(u)throw u;T.push(s),Q=s.id,ne(),j(),W(),D(),Y()}catch(a){console.error("Failed to add link:",a),alert("Failed to add link: "+a.message)}}let ae=[];async function jt(){const e=document.getElementById("existing-link-modal");if(!e)return;e.style.display="flex";const t=document.getElementById("existing-links-list");t&&(t.innerHTML='<p class="existing-link-empty">Loading...</p>');try{const{data:i,error:o}=await I.from("link_items").select("*, link_lists!inner(id, slug, presentation_data, owner_id)").eq("link_lists.owner_id",O.id).neq("list_id",k.id).order("created_at",{ascending:!1});if(o)throw o;ae=i||[],Oe("")}catch(i){console.error("Failed to load links:",i),t&&(t.innerHTML='<p class="existing-link-empty">Failed to load links.</p>')}}function Oe(e){const t=document.getElementById("existing-links-list");if(!t)return;const i=e.toLowerCase(),o=i?ae.filter(n=>(n.title||"").toLowerCase().includes(i)||(n.url||"").toLowerCase().includes(i)):ae;if(o.length===0){t.innerHTML=`<p class="existing-link-empty">${i?"No matches found.":"No links in other collections."}</p>`;return}t.innerHTML=o.map(n=>{var a,s,u;const l=((s=(a=n.link_lists)==null?void 0:a.presentation_data)==null?void 0:s.title)||((u=n.link_lists)==null?void 0:u.slug)||"";return`
      <div class="existing-link-item" data-link-id="${n.id}">
        <div class="link-thumb">
          ${n.image_url?`<img src="${$(n.image_url)}" alt="" onerror="this.parentElement.innerHTML='<i class=\\'fas fa-link\\' style=\\'color:#9ca3af\\'></i>'">`:'<i class="fas fa-link" style="color:#9ca3af"></i>'}
        </div>
        <div class="link-info">
          <div class="link-title">${$(n.title||"Untitled")}</div>
          <div class="link-url">${$(Qe(n.url||""))}</div>
        </div>
        <span class="link-collection-name">${$(l)}</span>
      </div>
    `}).join(""),t.querySelectorAll(".existing-link-item").forEach(n=>{n.addEventListener("click",()=>Vt(n.dataset.linkId))})}async function Vt(e){const t=ae.find(i=>i.id===e);if(t)try{const i=T.reduce((l,a)=>Math.max(l,a.order_index||0),0),{data:o,error:n}=await I.from("link_items").insert({list_id:k.id,title:t.title,url:t.url,image_url:t.image_url,image_position:t.image_position||null,image_scale:t.image_scale||null,order_index:i+100,is_active:!0,source_link_id:e,use_library_defaults:!0}).select().single();if(n)throw n;o._resolved_title=t.title,o._resolved_image_url=t.image_url,o._resolved_image_position=t.image_position,o._resolved_image_scale=t.image_scale,T.push(o),Q=o.id,re(),j(),W(),D(),Y()}catch(i){console.error("Failed to add existing link:",i),alert("Failed to add link: "+i.message)}}function re(){const e=document.getElementById("existing-link-modal");e&&(e.style.display="none"),ae=[]}let de=null;async function Se(e){de=e;const t=document.getElementById("media-library-modal"),i=document.getElementById("media-library-content");if(!(!t||!i)){t.style.display="flex",i.innerHTML=`
    <div style="text-align:center; padding:32px; color:#9ca3af;">
      <i class="fas fa-spinner fa-spin" style="font-size:1.5rem;"></i>
      <p style="margin-top:12px;">Loading your images...</p>
    </div>
  `;try{const o=await tt(O.id);if(o.length===0){i.innerHTML=`
        <div style="text-align:center; padding:32px; color:#9ca3af;">
          <i class="fas fa-images" style="font-size:2rem; opacity:0.3; margin-bottom:12px; display:block;"></i>
          <p>No uploaded images yet.</p>
          <p style="font-size:0.8rem;">Upload an image first, then it will appear here for reuse.</p>
        </div>
      `;return}i.innerHTML=`
      <div class="media-grid">
        ${o.map(n=>`
          <div class="media-item" data-url="${$(n.url)}" title="${$(n.name)}">
            <img src="${$(n.url)}" alt="${$(n.name)}" loading="lazy">
            <span class="media-item-label">${$(n.category)}</span>
          </div>
        `).join("")}
      </div>
    `,i.querySelectorAll(".media-item").forEach(n=>{n.addEventListener("click",()=>{const l=n.dataset.url;de&&de(l),ce()})})}catch(o){console.error("Failed to load media library:",o),i.innerHTML=`
      <div style="text-align:center; padding:32px; color:#ef4444;">
        <p>Failed to load images: ${$(o.message)}</p>
      </div>
    `}}}function ce(){const e=document.getElementById("media-library-modal");e&&(e.style.display="none"),de=null}let te=null;function Wt(){const e=document.getElementById("links-list");e&&e.querySelectorAll(".link-item").forEach(t=>{t.setAttribute("draggable","true"),t.addEventListener("dragstart",i=>{te=parseInt(t.dataset.index),t.classList.add("dragging"),i.dataTransfer.effectAllowed="move"}),t.addEventListener("dragend",()=>{t.classList.remove("dragging"),e.querySelectorAll(".link-item").forEach(i=>i.classList.remove("drag-over")),te=null}),t.addEventListener("dragover",i=>{i.preventDefault(),i.dataTransfer.dropEffect="move",e.querySelectorAll(".link-item").forEach(o=>o.classList.remove("drag-over")),t.classList.add("drag-over")}),t.addEventListener("dragleave",()=>{t.classList.remove("drag-over")}),t.addEventListener("drop",async i=>{i.preventDefault();const o=parseInt(t.dataset.index);if(te===null||te===o)return;const[n]=T.splice(te,1);T.splice(o,0,n),T.forEach((l,a)=>{l.order_index=(a+1)*100}),j(),D();try{await Promise.all(T.map(l=>I.from("link_items").update({order_index:l.order_index}).eq("id",l.id)))}catch(l){console.error("Failed to save order:",l)}})})}function $e(){var s,u,c,y,b,m,_,h,q,w,g,d,x,v,L;const e=((s=document.querySelector('input[name="bg-type"]:checked'))==null?void 0:s.value)||"solid",t=((u=document.querySelector('input[name="border-type"]:checked'))==null?void 0:u.value)||"solid",i=((c=document.querySelector('input[name="border-style"]:checked'))==null?void 0:c.value)||"fill",o=((y=document.getElementById("theme-border-enabled"))==null?void 0:y.checked)||!1,n=((b=document.getElementById("theme-presentation-text"))==null?void 0:b.value)||"#1A2F5B",l=((m=document.getElementById("theme-btn-bg"))==null?void 0:m.value)||"#1A2F5B",a=((_=document.getElementById("theme-border-gradient"))==null?void 0:_.value)||"";return{backgroundType:e,backgroundColor:((h=document.getElementById("theme-bg-color"))==null?void 0:h.value)||"#ffffff",gradientText:((q=document.getElementById("theme-gradient"))==null?void 0:q.value)||"",backgroundImage:e==="image"?k._pendingBgImage||(k.theme||{}).backgroundImage||"":"",backgroundImageX:parseInt((w=document.getElementById("bg-pos-x"))==null?void 0:w.value)||50,backgroundImageY:parseInt((g=document.getElementById("bg-pos-y"))==null?void 0:g.value)||50,backgroundImageScale:parseInt((d=document.getElementById("bg-pos-scale"))==null?void 0:d.value)||100,profileTextColor:n,presentationTextColor:n,textColor:n,presentationColor:n,profileColor:n,buttonBackgroundColor:l,buttonBgColor:l,buttonTextColor:((x=document.getElementById("theme-btn-text"))==null?void 0:x.value)||"#000000",buttonStyle:((v=document.getElementById("theme-button-style"))==null?void 0:v.value)||"soft",buttonBorderRadius:"8px",borderEnabled:o,gradientBorderEnabled:o,borderType:t,borderStyle:i,borderColor:((L=document.getElementById("theme-border-color"))==null?void 0:L.value)||"#1A2F5B",borderGradient:a,borderGradientText:a}}async function qe(){const e=document.getElementById("saved-themes-list");if(e)try{const{data:t,error:i}=await I.from("user_themes").select("*").eq("user_id",O.id).eq("theme_type","appearance").order("created_at",{ascending:!1});if(i)throw i;if(!t||t.length===0){e.innerHTML='<p style="color:#9ca3af; font-size:0.875rem;">No saved themes yet.</p>';return}e.innerHTML=t.map(o=>`
      <div class="saved-theme-item" style="display:flex; justify-content:space-between; align-items:center; padding:8px 12px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; margin-bottom:8px;">
        <span style="font-size:0.875rem; font-weight:500; color:#1e293b;">${$(o.name||o.theme_name||"Unnamed")}</span>
        <div style="display:flex; gap:4px;">
          <button type="button" class="apply-theme-btn" data-theme-id="${o.id}" style="background:#1A2F5B; color:white; border:none; padding:4px 10px; border-radius:4px; font-size:0.75rem; cursor:pointer;">Apply</button>
          <button type="button" class="delete-theme-btn" data-theme-id="${o.id}" style="background:none; color:#ef4444; border:1px solid #ef4444; padding:4px 8px; border-radius:4px; font-size:0.75rem; cursor:pointer;"><i class="fas fa-trash"></i></button>
        </div>
      </div>
    `).join(""),e.querySelectorAll(".apply-theme-btn").forEach(o=>{o.addEventListener("click",async()=>{const n=t.find(l=>l.id===o.dataset.themeId);n&&n.theme_data&&(k.theme={...k.theme,...n.theme_data},D(),ve(document.getElementById("tab-content")))})}),e.querySelectorAll(".delete-theme-btn").forEach(o=>{o.addEventListener("click",async()=>{const n=t.find(l=>l.id===o.dataset.themeId);if(!(!n||!confirm(`Delete theme "${n.name||n.theme_name}"?`)))try{const{error:l}=await I.from("user_themes").delete().eq("id",n.id).eq("user_id",O.id);if(l)throw l;qe()}catch(l){console.error("Failed to delete theme:",l),alert("Failed to delete: "+l.message)}})})}catch(t){console.error("Failed to load themes:",t),e.innerHTML='<p style="color:#ef4444; font-size:0.875rem;">Failed to load themes.</p>'}}async function Xt(){const e=document.getElementById("theme-name"),t=e==null?void 0:e.value.trim();if(!t){alert("Please enter a theme name.");return}try{const i=$e(),{error:o}=await I.from("user_themes").insert({user_id:O.id,name:t,theme_type:"appearance",theme_data:i});if(o)throw o;e&&(e.value=""),qe(),Ne("save-new-theme-btn")}catch(i){console.error("Failed to save theme:",i),alert("Failed to save theme: "+i.message)}}function Yt(){var e,t,i,o,n,l,a,s,u,c,y,b,m,_;document.querySelectorAll(".tab").forEach(h=>{h.addEventListener("click",()=>{document.querySelectorAll(".tab").forEach(q=>q.classList.remove("active")),h.classList.add("active"),Fe=h.dataset.tab,W()})}),(e=document.getElementById("add-link-btn"))==null||e.addEventListener("click",Qt),(t=document.getElementById("add-existing-btn"))==null||t.addEventListener("click",jt),(i=document.getElementById("new-link-modal-close"))==null||i.addEventListener("click",ne),(o=document.getElementById("new-link-cancel"))==null||o.addEventListener("click",ne),(n=document.getElementById("new-link-save"))==null||n.addEventListener("click",Gt),(l=document.getElementById("new-link-modal"))==null||l.addEventListener("click",h=>{h.target.id==="new-link-modal"&&ne()}),(a=document.getElementById("new-link-upload-btn"))==null||a.addEventListener("click",()=>{var h;(h=document.getElementById("new-link-image-file"))==null||h.click()}),(s=document.getElementById("new-link-image-file"))==null||s.addEventListener("change",async h=>{var d;const q=(d=h.target.files)==null?void 0:d[0];if(!q)return;const w=document.getElementById("new-link-upload-btn"),g=w==null?void 0:w.innerHTML;try{w&&(w.disabled=!0,w.innerHTML='<i class="fas fa-spinner fa-spin"></i>');const x=await Ee(q,"links",O.id,{maxWidth:800,maxHeight:800});document.getElementById("new-link-image").value=x}catch(x){console.error("Upload failed:",x),alert("Upload failed: "+x.message)}finally{w&&(w.disabled=!1,w.innerHTML=g)}}),(u=document.getElementById("new-link-browse-btn"))==null||u.addEventListener("click",()=>{Se(h=>{document.getElementById("new-link-image").value=h})}),(c=document.getElementById("existing-link-modal-close"))==null||c.addEventListener("click",re),(y=document.getElementById("existing-link-modal"))==null||y.addEventListener("click",h=>{h.target.id==="existing-link-modal"&&re()}),(b=document.getElementById("existing-link-search"))==null||b.addEventListener("input",h=>{Oe(h.target.value)}),(m=document.getElementById("media-library-close"))==null||m.addEventListener("click",ce),(_=document.getElementById("media-library-modal"))==null||_.addEventListener("click",h=>{h.target.id==="media-library-modal"&&ce()}),document.addEventListener("keydown",h=>{h.key==="Escape"&&(ne(),re(),ce())})}function $(e){const t=document.createElement("div");return t.textContent=e,t.innerHTML}function Qe(e){try{const t=new URL(e),i=t.pathname.length>30?t.pathname.substring(0,30)+"...":t.pathname;return t.hostname+i}catch{return e.length>50?e.substring(0,50)+"...":e}}St();

import{t as e}from"./supabase-C_OAid-5.js";/* empty css             */import{c as t,i as n,n as r,o as i,r as a,t as o,u as s}from"./toast-8XgWW_WI.js";import{n as c,r as l,t as u}from"./auto-save-S2Yb2RfU.js";import{a as d,i as f,n as p,o as m,r as h,t as g}from"./link-utils-CXsRhE1K.js";import{n as _,r as v,t as y}from"./theme-toggle-l6r1rMgD.js";import{n as b,t as x}from"./image-utils-B8piJQo8.js";import{a as S,i as C,n as w,r as T,t as E}from"./tag-utils-C9XkEIXv.js";var D=`https://natzpfyxpuycsuuzbqrd.supabase.co/storage/v1/object/public/assets/AcademiQR_logo_blue.png`,O=250,k=16,A=8,j=null,M=null;function N(e){let t=document.createElement(`div`);return t.textContent=e,t.innerHTML}function P(e,t,n,r,i,a){e.beginPath(),e.moveTo(t+a,n),e.lineTo(t+r-a,n),e.arcTo(t+r,n,t+r,n+a,a),e.lineTo(t+r,n+i-a),e.arcTo(t+r,n+i,t+r-a,n+i,a),e.lineTo(t+a,n+i),e.arcTo(t,n+i,t,n+i-a,a),e.lineTo(t,n+a),e.arcTo(t,n,t+a,n,a),e.closePath()}function F(e){let t=t=>e.querySelector(`#${t}`);return{color:t(`qr-color`)?.value||`#1A2F5B`,bgColor:t(`qr-bg-color`)?.value||`#ffffff`,borderEnabled:t(`qr-border-enabled`)?.checked||!1,borderColor:t(`qr-border-color`)?.value||`#000000`,borderStyle:t(`qr-border-style`)?.value||`solid`,borderRadius:parseInt(t(`qr-border-radius`)?.value||`16`),logo:M}}function ee(e,t){let n=t.borderEnabled?A:0,r=t.borderEnabled?t.borderRadius:16,i=document.createElement(`canvas`);i.width=O,i.height=O;let a=i.getContext(`2d`);if(a.clearRect(0,0,O,O),a.fillStyle=t.bgColor,P(a,n,n,e.width+32,e.height+32,r),a.fill(),t.borderEnabled){if(a.strokeStyle=t.borderColor,a.lineWidth=A,t.borderStyle===`dashed`)a.setLineDash([16,A]);else if(t.borderStyle===`dotted`)a.setLineDash([A,A]);else if(t.borderStyle===`double`){a.lineWidth=A/3;let t=A/2,n=A/2,r=e.width+32+A,i=e.height+32+A;a.strokeRect(t,n,r,i),a.strokeRect(12,12,r-16,i-16)}if(t.borderStyle!==`double`){let t=A/2,n=A/2,i=e.width+32+A,o=e.height+32+A;r>0?(P(a,t,n,i,o,r),a.stroke()):a.strokeRect(t,n,i,o)}a.setLineDash([])}let o=n+k,s=n+k;return a.save(),P(a,n,n,e.width+32,e.height+32,r),a.clip(),a.drawImage(e,o,s),a.restore(),{canvas:i,ctx:a,qrX:o,qrY:s,qrSize:e.width}}function I(e,t,n,r,i){return new Promise(a=>{if(!t){a();return}let o=new Image;o.crossOrigin=`anonymous`,o.onload=()=>{let t=i*.2,s=o.width,c=o.height;if(s>t||c>t){let e=Math.min(t/s,t/c);s*=e,c*=e}let l=n+(i-s)/2,u=r+(i-c)/2;e.fillStyle=`#ffffff`,e.beginPath(),e.arc(n+i/2,r+i/2,Math.max(s,c)/2+8,0,Math.PI*2),e.fill(),e.drawImage(o,l,u,s,c),a()},o.onerror=()=>a(),o.src=t})}async function L(e,t){if(typeof QRCode>`u`){console.error(`[QR] QRCode.js library not loaded`);return}let n=F(e),r=e.querySelector(`#qr-code-container`);if(!r)return;j=null,r.innerHTML=``,r.style.cssText=`background:transparent; padding:0; display:flex; align-items:center; justify-content:center; width:250px; height:250px; margin:0 auto; box-sizing:border-box; border:none; border-radius:0; overflow:visible;`;let i=O-(n.borderEnabled?A:0)*2-32,a=document.createElement(`div`);a.style.cssText=`position:absolute; left:-9999px; top:-9999px;`,document.body.appendChild(a);try{j=new QRCode(a,{text:t,width:i,height:i,colorDark:n.color,colorLight:n.bgColor,correctLevel:QRCode.CorrectLevel.H})}catch(e){console.error(`[QR] Generation failed:`,e),r.innerHTML=`<p style="color:#ef4444; font-size:0.8rem;">QR generation failed</p>`,document.body.removeChild(a);return}await new Promise(e=>setTimeout(e,100));let o=a.querySelector(`canvas`);if(!o){document.body.removeChild(a);return}let{canvas:s,ctx:c,qrX:l,qrY:u,qrSize:d}=ee(o,n);await I(c,M,l,u,d);let f=document.createElement(`img`);f.src=s.toDataURL(`image/png`);let p=n.borderEnabled?n.borderRadius:16;f.style.cssText=`width:${O}px; height:${O}px; display:block; margin:0 auto; border-radius:${p}px; background:transparent;`,f.alt=`QR Code`,f.title=`Right-click to copy image`,f.setAttribute(`data-composite`,`true`),r.innerHTML=``,r.appendChild(f),r._compositeCanvas=s,document.body.removeChild(a);let m=e.querySelector(`#qr-actions`);m&&(m.style.display=`flex`)}function te(e,t,n){let r=e.querySelector(`#qr-code-container`);if(!r||!j)return;let i=r.querySelector(`img[data-composite="true"]`);if(!i)return;let a=`${n||`qrcode`}-qrcode`;if(t===`png`||t===`jpeg`){let e=new Image;e.onload=()=>{let n=document.createElement(`canvas`);n.width=e.width,n.height=e.height;let r=n.getContext(`2d`);t===`jpeg`&&(r.fillStyle=`#ffffff`,r.fillRect(0,0,n.width,n.height)),r.drawImage(e,0,0);let i=document.createElement(`a`);i.download=`${a}.${t===`jpeg`?`jpg`:`png`}`,i.href=n.toDataURL(t===`jpeg`?`image/jpeg`:`image/png`,.95),i.click()},e.src=i.src}else if(t===`svg`){let e=new Image;e.onload=()=>{let t=document.createElement(`canvas`);t.width=e.width,t.height=e.height,t.getContext(`2d`).drawImage(e,0,0);let n=t.toDataURL(`image/png`),r=`<svg xmlns="http://www.w3.org/2000/svg" width="${t.width}" height="${t.height}" viewBox="0 0 ${t.width} ${t.height}"><image href="${n}" width="${t.width}" height="${t.height}"/></svg>`,i=new Blob([r],{type:`image/svg+xml`}),o=document.createElement(`a`);o.download=`${a}.svg`,o.href=URL.createObjectURL(i),o.click(),URL.revokeObjectURL(o.href)},e.src=i.src}}async function ne(t,n){let r=F(n),i={color:r.color,bgColor:r.bgColor,borderEnabled:r.borderEnabled,borderColor:r.borderColor,borderStyle:r.borderStyle,borderRadius:String(r.borderRadius),logo:M},{error:a}=await e.from(`link_lists`).update({qr_code_data:i,updated_at:new Date().toISOString()}).eq(`id`,t);return!a}async function re(t,n){let r=t.querySelector(`#saved-qr-themes-list`);if(!r)return;let{data:i,error:a}=await e.from(`user_themes`).select(`*`).eq(`user_id`,n).eq(`theme_type`,`qr`).order(`created_at`,{ascending:!1});r.innerHTML=a||!i||i.length===0?`<p class="qr-themes-empty">No saved QR themes yet</p>`:i.map(e=>{let t=N(e.name);return`
      <div class="saved-theme-item" data-theme-id="${e.id}" data-theme-name="${t}">
        <div class="saved-theme-name">${t}</div>
        <button class="btn-icon qr-theme-delete" data-theme-id="${e.id}" data-theme-name="${t}" title="Delete"><i class="fas fa-trash"></i></button>
      </div>
    `}).join(``)}async function ie(t,n,r){let i=t.querySelector(`#qr-theme-name`),a=i?.value?.trim();if(!a){o(`Please enter a QR theme name`,`warning`);return}let s=F(t),c={name:a,color:s.color,bgColor:s.bgColor,borderEnabled:s.borderEnabled,borderColor:s.borderColor,borderStyle:s.borderStyle,borderRadius:String(s.borderRadius),logo:M},{data:l}=await e.from(`user_themes`).select(`id`).eq(`user_id`,n).eq(`name`,a).eq(`theme_type`,`qr`).maybeSingle();if(l){if(!confirm(`QR Theme "${a}" already exists. Overwrite?`))return;await e.from(`user_themes`).update({theme_data:c,updated_at:new Date().toISOString()}).eq(`id`,l.id)}else await e.from(`user_themes`).insert({user_id:n,name:a,theme_type:`qr`,theme_data:c});i.value=``,await re(t,n)}async function ae(t,n,r,i){confirm(`Delete QR Theme "${i}"?`)&&(await e.from(`user_themes`).delete().eq(`id`,r).eq(`user_id`,n),await re(t,n))}function oe(e,t,n){let r=t=>e.querySelector(`#${t}`);if(n.color&&(r(`qr-color`)&&(r(`qr-color`).value=n.color),r(`qr-color-text`)&&(r(`qr-color-text`).value=n.color)),n.bgColor&&(r(`qr-bg-color`)&&(r(`qr-bg-color`).value=n.bgColor),r(`qr-bg-color-text`)&&(r(`qr-bg-color-text`).value=n.bgColor)),n.borderEnabled!==void 0){r(`qr-border-enabled`)&&(r(`qr-border-enabled`).checked=n.borderEnabled);let e=r(`qr-border-options`);e&&(e.style.display=n.borderEnabled?`block`:`none`)}n.borderColor&&(r(`qr-border-color`)&&(r(`qr-border-color`).value=n.borderColor),r(`qr-border-color-text`)&&(r(`qr-border-color-text`).value=n.borderColor)),n.borderStyle&&r(`qr-border-style`)&&(r(`qr-border-style`).value=n.borderStyle),n.borderRadius&&r(`qr-border-radius`)&&(r(`qr-border-radius`).value=n.borderRadius),M=n.logo?n.logo:null,ue(e),L(e,t)}function se(e,t,n){let r=n.target.files?.[0];if(!r)return;if(r.size>5242880){o(`Logo must be under 5 MB`,`warning`),n.target.value=``;return}let i=new FileReader;i.onload=n=>{M=n.target.result,ue(e),L(e,t)},i.readAsDataURL(r)}function ce(e,t){M=null,ue(e);let n=e.querySelector(`#qr-logo-upload`);n&&(n.value=``),L(e,t)}function le(e,t){M=D,ue(e),L(e,t)}function ue(e){let t=e.querySelector(`#qr-logo-preview`),n=e.querySelector(`#qr-logo-img`);M?(n&&(n.src=M),t&&(t.style.display=`inline-block`)):(t&&(t.style.display=`none`),n&&(n.src=``))}function de(e,t,n){let r=e.querySelector(`#${t}`),i=e.querySelector(`#${n}`);r&&i&&(i.value=r.value)}function fe(e,t,n){let r=e.querySelector(`#${t}`),i=e.querySelector(`#${n}`);r&&i&&/^#[0-9a-fA-F]{6}$/.test(r.value)&&(i.value=r.value)}function pe(t,n,r){if(!n||!r){t.innerHTML=`<div class="qr-tab"><p>Please select a collection first.</p></div>`;return}let i=a(r.id,n.id),o=n.qr_code_data||{};j=null,M=o.logo||null;let s=o.color||`#1A2F5B`,c=o.bgColor||`#ffffff`,d=o.borderEnabled===!0||o.borderEnabled===`true`,f=o.borderColor||`#000000`,p=o.borderStyle||`solid`,m=String(o.borderRadius||`16`);t.innerHTML=`
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
              <input type="text" id="qr-url" class="form-input" value="${N(i)}" readonly>
              <button id="qr-copy-url" class="btn-icon" title="Copy URL"><i class="fas fa-copy"></i></button>
            </div>
          </div>

          <!-- Colors -->
          <div class="form-group qr-color-row">
            <div class="qr-color-group">
              <label>QR Code Color</label>
              <div class="color-options">
                <input type="color" id="qr-color" value="${s}" class="color-picker">
                <input type="text" id="qr-color-text" value="${s}" class="color-input" maxlength="7">
              </div>
            </div>
            <div class="qr-color-group">
              <label>Background Color</label>
              <div class="color-options">
                <input type="color" id="qr-bg-color" value="${c}" class="color-picker">
                <input type="text" id="qr-bg-color-text" value="${c}" class="color-input" maxlength="7">
              </div>
            </div>
          </div>

          <!-- Border -->
          <div class="form-group">
            <label class="qr-checkbox-label">
              <input type="checkbox" id="qr-border-enabled" ${d?`checked`:``}>
              <span>Border</span>
            </label>
            <div id="qr-border-options" class="qr-border-options" style="display: ${d?`block`:`none`};">
              <div class="form-group">
                <label class="qr-sub-label">Color</label>
                <div class="color-options">
                  <input type="color" id="qr-border-color" value="${f}" class="color-picker">
                  <input type="text" id="qr-border-color-text" value="${f}" class="color-input" maxlength="7">
                </div>
              </div>
              <div class="qr-border-inline">
                <div>
                  <label class="qr-sub-label">Style</label>
                  <select id="qr-border-style" class="form-input">
                    <option value="solid" ${p===`solid`?`selected`:``}>Solid</option>
                    <option value="dashed" ${p===`dashed`?`selected`:``}>Dashed</option>
                    <option value="dotted" ${p===`dotted`?`selected`:``}>Dotted</option>
                    <option value="double" ${p===`double`?`selected`:``}>Double</option>
                  </select>
                </div>
                <div>
                  <label class="qr-sub-label">Corners</label>
                  <select id="qr-border-radius" class="form-input">
                    <option value="16" ${m===`16`?`selected`:``}>Rounded</option>
                    <option value="0" ${m===`0`?`selected`:``}>Square</option>
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
            <div id="qr-logo-preview" class="qr-logo-preview" style="display: ${M?`inline-block`:`none`};">
              <img id="qr-logo-img" src="${M||``}" alt="Logo">
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
  `;let h=()=>L(t,i);t.querySelector(`#qr-copy-url`)?.addEventListener(`click`,()=>{navigator.clipboard.writeText(i).then(()=>{let e=t.querySelector(`#qr-copy-url`);e&&(e.innerHTML=`<i class="fas fa-check"></i>`,setTimeout(()=>e.innerHTML=`<i class="fas fa-copy"></i>`,1500))})});for(let e of[`qr-color`,`qr-bg-color`,`qr-border-color`])t.querySelector(`#${e}`)?.addEventListener(`input`,()=>{de(t,e,e+`-text`),h()});for(let[e,n]of[[`qr-color-text`,`qr-color`],[`qr-bg-color-text`,`qr-bg-color`],[`qr-border-color-text`,`qr-border-color`]])t.querySelector(`#${e}`)?.addEventListener(`input`,()=>{fe(t,e,n),h()});t.querySelector(`#qr-border-enabled`)?.addEventListener(`change`,e=>{let n=t.querySelector(`#qr-border-options`);n&&(n.style.display=e.target.checked?`block`:`none`),h()});for(let e of[`qr-border-style`,`qr-border-radius`])t.querySelector(`#${e}`)?.addEventListener(`change`,h);let g=u(async()=>{if(!t.querySelector(`#qr-color`))return!1;let e=await ne(n.id,t);if(e){let e=F(t);n.qr_code_data={color:e.color,bgColor:e.bgColor,borderEnabled:e.borderEnabled,borderColor:e.borderColor,borderStyle:e.borderStyle,borderRadius:String(e.borderRadius),logo:M}}return e},{statusSelector:`#qr-save-status`});l(g);let _=()=>g.trigger();for(let e of[`qr-color`,`qr-bg-color`,`qr-border-color`])t.querySelector(`#${e}`)?.addEventListener(`input`,_);for(let e of[`qr-color-text`,`qr-bg-color-text`,`qr-border-color-text`])t.querySelector(`#${e}`)?.addEventListener(`input`,_);t.querySelector(`#qr-border-enabled`)?.addEventListener(`change`,_);for(let e of[`qr-border-style`,`qr-border-radius`])t.querySelector(`#${e}`)?.addEventListener(`change`,_);t.querySelector(`#qr-logo-upload-btn`)?.addEventListener(`click`,()=>{t.querySelector(`#qr-logo-upload`)?.click()}),t.querySelector(`#qr-logo-upload`)?.addEventListener(`change`,e=>{se(t,i,e),_()}),t.querySelector(`#qr-logo-default-btn`)?.addEventListener(`click`,()=>{le(t,i),_()}),t.querySelector(`#qr-logo-remove`)?.addEventListener(`click`,()=>{ce(t,i),_()}),t.querySelector(`#qr-actions`)?.addEventListener(`click`,e=>{let r=e.target.closest(`button[data-format]`);r&&te(t,r.dataset.format,n.slug)}),t.querySelector(`#qr-theme-toggle`)?.addEventListener(`click`,()=>{let e=t.querySelector(`#qr-theme-content`),n=t.querySelector(`#qr-theme-toggle .section-chevron`);if(e){let t=e.style.display!==`none`;e.style.display=t?`none`:`block`,n&&n.classList.toggle(`collapsed`,t)}}),t.querySelector(`#qr-theme-save-btn`)?.addEventListener(`click`,()=>{ie(t,r.id,i)}),t.querySelector(`#saved-qr-themes-list`)?.addEventListener(`click`,async n=>{let a=n.target.closest(`.qr-theme-delete`);if(a){n.stopPropagation(),await ae(t,r.id,a.dataset.themeId,a.dataset.themeName);return}let o=n.target.closest(`.saved-theme-item`);if(o){let{data:n}=await e.from(`user_themes`).select(`theme_data`).eq(`id`,o.dataset.themeId).single();n?.theme_data&&oe(t,i,n.theme_data)}}),L(t,i),re(t,r.id)}function me(e){let t=document.createElement(`div`);return t.textContent=e,t.innerHTML}var he={instagram:`Instagram`,facebook:`Facebook`,twitter:`X (Twitter)`,linkedin:`LinkedIn`,youtube:`YouTube`,tiktok:`TikTok`,snapchat:`Snapchat`,email:`Email`};function ge(){let e=new Date,t=new Date;return t.setDate(t.getDate()-30),{from:t.toISOString().slice(0,10),to:e.toISOString().slice(0,10)}}function _e(e,t=!1){let[n,r,i]=e.split(`-`).map(Number);return t?new Date(n,r-1,i,23,59,59,999).toISOString():new Date(n,r-1,i,0,0,0,0).toISOString()}async function ve(t,n,r,i){let a=r?_e(r):null,o=i?_e(i,!0):null;function s(e,t){return a&&(e=e.gte(t,a)),o&&(e=e.lte(t,o)),e}let c=e.from(`link_clicks`).select(`*`,{count:`exact`,head:!0}).eq(`owner_id`,t).eq(`list_id`,n).not(`link_id`,`is`,null);c=s(c,`clicked_at`);let{count:l}=await c,u=e.from(`page_views`).select(`*`,{count:`exact`,head:!0}).eq(`owner_id`,t).eq(`list_id`,n);u=s(u,`viewed_at`);let{count:d}=await u,f=e.from(`page_views`).select(`session_id`).eq(`owner_id`,t).eq(`list_id`,n);f=s(f,`viewed_at`);let{data:p}=await f,m=p?new Set(p.map(e=>e.session_id).filter(Boolean)).size:0,h=e.from(`link_clicks`).select(`link_id, link_items:link_id (title, url)`).eq(`owner_id`,t).eq(`list_id`,n).not(`link_id`,`is`,null);h=s(h,`clicked_at`);let{data:g}=await h,_={};if(g)for(let e of g)_[e.link_id]||(_[e.link_id]={title:e.link_items?.title||`Unknown Link`,url:e.link_items?.url||``,clicks:0}),_[e.link_id].clicks++;let v=Object.values(_).sort((e,t)=>t.clicks-e.clicks),y=e.from(`link_clicks`).select(`social_platform`).eq(`owner_id`,t).eq(`list_id`,n);y=s(y,`clicked_at`);let{data:b}=await y,x={};if(b)for(let e of b){if(!e.social_platform)continue;let t=e.social_platform.toLowerCase();x[t]||(x[t]={platform:t,clicks:0}),x[t].clicks++}let S=Object.values(x).sort((e,t)=>t.clicks-e.clicks),C=S.reduce((e,t)=>e+t.clicks,0),w=e.from(`page_views`).select(`viewed_at`).eq(`owner_id`,t).eq(`list_id`,n);w=s(w,`viewed_at`);let{data:T}=await w,E={};if(T)for(let e of T){let t=(e.viewed_at||e.created_at||``).substring(0,10);t&&(E[t]=(E[t]||0)+1)}let D=e.from(`link_clicks`).select(`clicked_at`).eq(`owner_id`,t).eq(`list_id`,n).not(`link_id`,`is`,null);D=s(D,`clicked_at`);let{data:O}=await D,k={};if(O)for(let e of O){let t=(e.clicked_at||e.created_at||``).substring(0,10);t&&(k[t]=(k[t]||0)+1)}return{totalClicks:l||0,totalViews:d||0,uniqueVisitors:m,totalSocialClicks:C,linkBreakdown:v,socialBreakdown:S,dailyViews:E,dailyClicks:k}}function ye(e,t){let n=e.querySelector(`#links-breakdown-list`);if(!n)return;if(!t||t.length===0){n.innerHTML=`<p class="analytics-empty"><i class="fas fa-chart-bar" style="opacity:0.3; font-size:1.5rem; display:block; margin-bottom:8px;"></i>No link clicks yet. Share your collection to start seeing analytics.</p>`;return}let r=Math.max(...t.map(e=>e.clicks));n.innerHTML=t.map(e=>{let t=r>0?e.clicks/r*100:0,n=e.url.length>50?e.url.substring(0,50)+`...`:e.url;return`
      <div class="analytics-link-row">
        <div class="analytics-link-info">
          <div class="analytics-link-title">${me(e.title)}</div>
          <div class="analytics-link-url" title="${me(e.url)}">${me(n)}</div>
        </div>
        <div class="analytics-link-count">${e.clicks}</div>
        <div class="analytics-bar-track">
          <div class="analytics-bar-fill" style="width: ${t}%;"></div>
        </div>
      </div>
    `}).join(``)}function be(e,t){let n=e.querySelector(`#social-breakdown-list`);n&&(n.innerHTML=!t||t.length===0?`<p class="analytics-empty">No social media clicks yet.</p>`:t.map(e=>`
      <div class="analytics-social-row">
        <span class="analytics-social-name">${me(he[e.platform]||e.platform.charAt(0).toUpperCase()+e.platform.slice(1))}</span>
        <span class="analytics-social-count">${e.clicks}</span>
      </div>
    `).join(``))}function xe(e,t){let n=(t,n)=>{let r=e.querySelector(`#${t}`);r&&(r.textContent=n)};n(`stat-total-views`,t.totalViews),n(`stat-link-clicks`,t.totalClicks),n(`stat-social-clicks`,t.totalSocialClicks),n(`stat-unique-visitors`,t.uniqueVisitors)}function Se(e,t,n,r,i){let a=e.querySelector(`#analytics-chart`);if(!a)return;let o=a.getContext(`2d`),s=window.devicePixelRatio||1,c=a.parentElement.getBoundingClientRect().width||600;a.width=c*s,a.height=200*s,a.style.width=c+`px`,a.style.height=`200px`,o.scale(s,s);let l=new Date(r||Date.now()-2592e6),u=new Date(i||Date.now()),d=[],f=new Date(l);for(;f<=u;)d.push(f.toISOString().substring(0,10)),f.setDate(f.getDate()+1);if(d.length===0)return;let p=d.map(e=>t[e]||0),m=d.map(e=>n[e]||0),h=Math.max(...p,...m,1),g={top:20,right:16,bottom:32,left:40},_=c-g.left-g.right,v=200-g.top-g.bottom,y=document.documentElement.getAttribute(`data-theme`)===`dark`,b=y?`rgba(255,255,255,0.1)`:`#e2e8f0`,x=y?`rgba(147, 197, 253, 1)`:`rgba(26, 47, 91, 1)`,S=y?`rgba(74, 222, 128, 1)`:`rgba(34, 197, 94, 1)`,C=y?`#cbd5e1`:void 0;o.clearRect(0,0,c,200),o.strokeStyle=b,o.lineWidth=.5;for(let e=0;e<=4;e++){let t=g.top+v/4*e;o.beginPath(),o.moveTo(g.left,t),o.lineTo(c-g.right,t),o.stroke()}o.fillStyle=`#94a3b8`,o.font=`10px Inter, sans-serif`,o.textAlign=`right`;for(let e=0;e<=4;e++){let t=Math.round(h*(4-e)/4),n=g.top+v/4*e+3;o.fillText(t.toString(),g.left-6,n)}o.textAlign=`center`;let w=Math.max(1,Math.floor(d.length/6));for(let e=0;e<d.length;e+=w){let t=g.left+_/(d.length-1||1)*e,n=d[e].split(`-`);o.fillText(`${n[1]}/${n[2]}`,t,192)}function T(e,t){if(!(e.length<2)){o.strokeStyle=t,o.lineWidth=2,o.lineJoin=`round`,o.beginPath();for(let t=0;t<e.length;t++){let n=g.left+_/(e.length-1||1)*t,r=g.top+v-e[t]/h*v;t===0?o.moveTo(n,r):o.lineTo(n,r)}o.stroke(),o.lineTo(g.left+_,g.top+v),o.lineTo(g.left,g.top+v),o.closePath(),o.fillStyle=t.replace(`1)`,y?`0.15)`:`0.08)`),o.fill()}}T(p,x),T(m,S),o.font=`11px Inter, sans-serif`,o.fillStyle=x,o.fillRect(g.left,4,12,3),o.fillStyle=C||x,o.fillText(`Views`,g.left+40,10),o.fillStyle=S,o.fillRect(g.left+80,4,12,3),o.fillStyle=C||S,o.fillText(`Clicks`,g.left+120,10)}function Ce(e,t,n){if(!t||!n){e.innerHTML=`<div class="analytics-tab"><p>Please select a collection first.</p></div>`;return}let r=ge();e.innerHTML=`
    <div class="analytics-tab">
      <h3>Analytics</h3>
      <p class="tab-description">Page views and link clicks for this collection.</p>

      <!-- Date Range Filter -->
      <div class="analytics-date-row">
        <input type="date" id="analytics-date-from" class="form-input" value="${r.from}">
        <span class="analytics-date-sep">to</span>
        <input type="date" id="analytics-date-to" class="form-input" value="${r.to}">
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
  `;let i=async()=>{let r=e.querySelector(`#analytics-date-from`)?.value||``,i=e.querySelector(`#analytics-date-to`)?.value||``,a=e.querySelector(`#analytics-refresh`);a&&(a.disabled=!0,a.innerHTML=`<i class="fas fa-spinner fa-spin"></i> Loading...`);try{let a=await ve(n.id,t.id,r,i);xe(e,a),Se(e,a.dailyViews,a.dailyClicks,r,i),ye(e,a.linkBreakdown),be(e,a.socialBreakdown)}catch(e){console.error(`[Analytics] Failed to load:`,e)}a&&(a.disabled=!1,a.innerHTML=`<i class="fas fa-sync-alt"></i> Apply`)};e.querySelector(`#analytics-refresh`)?.addEventListener(`click`,i);for(let[t,n]of[[`chart-toggle`,`chart-content`],[`links-breakdown-toggle`,`links-breakdown-content`],[`social-breakdown-toggle`,`social-breakdown-content`]])e.querySelector(`#${t}`)?.addEventListener(`click`,()=>{let r=e.querySelector(`#${n}`),i=e.querySelector(`#${t} .section-chevron`);if(r){let e=r.style.display!==`none`;r.style.display=e?`none`:`block`,i&&i.classList.toggle(`collapsed`,e)}});i()}var R=null,z=null,B=null,V=[],H=null,U=`details`,W=[],G=null,K=null,q=null,we=null,Te=`<svg class="section-chevron" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>`,Ee=`<svg class="section-chevron collapsed" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>`,De={backgroundType:`solid`,backgroundColor:`#ffffff`,gradientText:``,backgroundImage:``,backgroundImageX:50,backgroundImageY:50,backgroundImageScale:100,profileTextColor:`#1A2F5B`,presentationTextColor:`#1A2F5B`,buttonTextColor:`#000000`,buttonBackgroundColor:`#1A2F5B`,buttonStyle:`soft`,buttonBorderRadius:`8px`,buttonPadding:`12px 24px`,buttonFontSize:`16px`,buttonFontWeight:`500`,textFontSize:`18px`,textFontWeight:`600`,borderEnabled:!0,borderType:`gradient`,borderStyle:`thin`,borderColor:`#1A2F5B`,borderWidth:`1px`,borderGradient:`linear-gradient(186deg, #D54070 0%, #8F4469 20%, #CA5699 40%, #59B8DA 60%, #9AD0DD 80%, #73B44A 100%)`};function Oe(e){let t=document.getElementById(e);if(!t)return;let n=t.textContent;t.textContent=`✓ Saved`,setTimeout(()=>{t.textContent=n},1500)}function ke(e=50,t=50,n=100){return`object-fit: ${n<100?`contain`:`cover`}; object-position: ${e}% ${t}%; transform: scale(${n/100}); transform-origin: ${e}% ${t}%;`}function Ae(e){e.querySelectorAll(`.section-header`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.section,n=document.getElementById(t),r=e.querySelector(`.section-chevron`);n&&r&&(n.classList.toggle(`collapsed`),r.classList.toggle(`collapsed`))})})}async function je(){if(R=await t(),!R)return;let i=r(`id`);i?(Me(),await Promise.all([Ne(i),Fe()]),z?(await Pe(),J(),w(e,R.id).then(e=>{W=e}),X(),Q(),gt(),bt(),G=u(async()=>{try{Re();let{error:t}=await e.from(`link_lists`).update({presentation_data:z.presentation_data}).eq(`id`,z.id);if(t)throw t;return J(),!0}catch(e){return console.error(`Auto-save presentation failed:`,e),!1}},{statusSelector:`#presentation-save-status`}),K=u(async()=>{try{let t=document.getElementById(`collection-visibility`)?.value||`public`,n=document.getElementById(`collection-passkey`)?.value.trim(),r=document.getElementById(`collection-slug`)?.value.trim().toLowerCase().replace(/[^a-z0-9-]/g,``)||z.slug,i={visibility:t,slug:r};t===`passkey`&&n?i.passkey_hash=n:t!==`passkey`&&(i.passkey_hash=null);let{error:a}=await e.from(`link_lists`).update(i).eq(`id`,z.id);if(a)throw a;return z.visibility=t,z.slug=r,i.passkey_hash!==void 0&&(z.passkey_hash=i.passkey_hash),J(),!0}catch(e){return console.error(`Auto-save settings failed:`,e),!1}},{statusSelector:`#settings-save-status`}),q=u(async()=>{let t=H;if(!t)return!1;try{let n=V.find(e=>e.id===t);if(!n)return!1;let r=document.getElementById(`link-title`)?.value.trim(),i=document.getElementById(`link-url`)?.value.trim(),a=document.getElementById(`link-image`)?.value.trim(),o=!!n.source_link_id,s=d(n),c=o?!n.use_library_defaults:s,l=o&&n.use_library_defaults,u=l?n.image_position?.x??50:parseInt(document.getElementById(`link-img-pos-x`)?.value)||50,f=l?n.image_position?.y??50:parseInt(document.getElementById(`link-img-pos-y`)?.value)||50,p=l?n.image_scale??100:parseInt(document.getElementById(`link-img-scale`)?.value)||100,m={url:i,use_library_defaults:!!n.use_library_defaults};n.tags&&n.tags.length>0&&(m.tags=n.tags),c&&!o?m.custom_overrides={title:r,image_url:a||null,image_position:{x:u,y:f},image_scale:p}:l||(m.title=r,m.image_url=a||null,m.image_position={x:u,y:f},m.image_scale=p,m.custom_overrides=null);let{error:h}=await e.from(`link_items`).update({...m,updated_at:new Date().toISOString()}).eq(`id`,t);if(h)throw h;return Object.assign(n,m),Y(),Q(),!0}catch(e){return console.error(`Auto-save link failed:`,e),!1}},{statusSelector:`#link-save-status`}),we=u(async()=>{try{let t=pt(),n={...z.theme,...t},{error:r}=await e.from(`link_lists`).update({theme:n}).eq(`id`,z.id);if(r)throw r;return z.theme=n,Q(),!0}catch(e){return console.error(`Auto-save theme failed:`,e),!1}},{statusSelector:`#theme-save-status`}),l(G),l(K),l(q),l(we),window.addEventListener(`beforeunload`,()=>{c()}),sessionStorage.setItem(`academiqr-last-collection`,JSON.stringify({id:z.id,title:z.presentation_data?.title||`Untitled Collection`}))):(o(`Collection not found`,`error`),n())):n()}function Me(){let e=document.getElementById(`main-nav`);if(!e)return;e.innerHTML=`
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
  `,document.getElementById(`sign-out-btn`)?.addEventListener(`click`,async()=>{await s(),i(`login`)}),_();let t=document.getElementById(`theme-toggle-btn`);t&&(t.querySelector(`i`).className=(y(),`fas fa-circle-half-stroke`),t.addEventListener(`click`,()=>{v(),t.querySelector(`i`).className=`fas fa-circle-half-stroke`}))}async function Ne(t){try{let{data:n,error:r}=await e.from(`link_lists`).select(`*`).eq(`id`,t).eq(`owner_id`,R.id).single();if(r)throw r;z=n}catch(e){console.error(`Failed to load collection:`,e),z=null}}async function Pe(){if(z)try{let{data:t,error:n}=await e.from(`link_items`).select(`*, source_link_id, use_library_defaults`).eq(`list_id`,z.id).order(`order_index`,{ascending:!0});if(n)throw n;V=t||[],V.sort((e,t)=>{let n=e.order_index??1/0,r=t.order_index??1/0;return n===r?new Date(e.created_at||0)-new Date(t.created_at||0):n-r}),await m(V)}catch(e){console.error(`Failed to load links:`,e),V=[]}}async function Fe(){try{let{data:t,error:n}=await e.from(`profiles`).select(`display_name, username, profile_photo, profile_photo_position, social_order, social_website, social_email, social_instagram, social_facebook, social_twitter, social_linkedin, social_youtube, social_tiktok, social_snapchat, social_google_scholar, social_orcid, social_researchgate`).eq(`id`,R.id).single();if(n)throw n;B=t}catch(e){console.error(`Failed to load profile:`,e),B={}}}function J(){let e=z.presentation_data||{},t=e.title||`Untitled Collection`;document.getElementById(`collection-title`).textContent=t;let n=document.getElementById(`collection-meta`);if(n){let t=e.conference||``;n.innerHTML=`
      ${t?`<span class="meta-item"><i class="fas fa-building"></i> ${$(t)}</span>`:``}
      <span class="meta-item"><i class="fas fa-list"></i> ${V.length} link${V.length===1?``:`s`}</span>
    `}Y()}function Y(){let e=document.getElementById(`links-list`);e&&(V.length===0?e.innerHTML=`
      <div class="empty-links">
        <i class="fas fa-link"></i>
        <p>No links yet. Add your first link!</p>
      </div>
    `:(e.innerHTML=V.map((e,t)=>{let n=e.id===H,r=e.is_active!==!1;return`
      <div class="link-item ${n?`selected`:``} ${r?``:`inactive`}"
           data-link-id="${e.id}" data-index="${t}">
        <div class="link-drag-handle" title="Drag to reorder">
          <i class="fas fa-grip-vertical"></i>
        </div>
        ${h(e)?`
          <div class="link-thumb">
            <img src="${$(h(e))}" alt="" loading="lazy"
                 style="${ke(g(e).x,g(e).y,p(e))}"
                 onerror="this.parentElement.innerHTML='<i class=\\'fas fa-image\\'></i>'">
          </div>
        `:`
          <div class="link-thumb link-thumb-empty">
            <i class="fas fa-link"></i>
          </div>
        `}
        <div class="link-info">
          <div class="link-title">${$(f(e)||`Untitled Link`)}${e.use_library_defaults&&e.source_link_id?` <i class="fas fa-link" style="font-size:0.6rem; opacity:0.5;" title="Using library version"></i>`:``}</div>
          <div class="link-url">${$(_t(e.url||``))}</div>
        </div>
        <div class="link-actions">
          <button class="btn-icon link-toggle" data-link-id="${e.id}" title="${r?`Active`:`Inactive`}">
            <i class="fas ${r?`fa-toggle-on`:`fa-toggle-off`}"></i>
          </button>
        </div>
      </div>
    `}).join(``),e.querySelectorAll(`.link-item`).forEach(e=>{e.addEventListener(`click`,t=>{t.target.closest(`.link-toggle`)||t.target.closest(`.link-drag-handle`)||(H=e.dataset.linkId,Y(),X(),Ie())})}),e.querySelectorAll(`.link-toggle`).forEach(e=>{e.addEventListener(`click`,t=>{t.stopPropagation(),$e(e.dataset.linkId)})}),ft()))}function Ie(){setTimeout(()=>{let e=document.getElementById(`link-editor-section`);e&&(e.style.display=`block`,e.scrollIntoView({behavior:`smooth`,block:`start`}))},50)}function X(){let e=document.getElementById(`tab-content`);if(e)switch(U){case`details`:Le(e);break;case`appearance`:Ke(e);break;case`qr-code`:Je(e);break;case`analytics`:Ye(e)}}function Le(e){let t=z.presentation_data||{},n=Te,r=z.visibility||`public`,i=!!z.passkey_hash,a=`
    <!-- ═══ PRESENTATION INFORMATION ═══ -->
    <div class="section">
      <div class="section-header" data-section="presentation-section">
        <h3>Presentation Information <span id="presentation-save-status" class="auto-save-status"></span></h3>
        ${n}
      </div>
      <div class="section-content" id="presentation-section">
        <div class="form-group">
          <label for="info-title">Title</label>
          <input type="text" id="info-title" value="${$(t.title||``)}" placeholder="Presentation title" maxlength="200">
        </div>
        <div class="form-group">
          <label for="info-conference">Conference / Event</label>
          <input type="text" id="info-conference" value="${$(t.conference||``)}" placeholder="Conference name" maxlength="200">
        </div>
        <div class="form-group">
          <label for="info-location">Location</label>
          <input type="text" id="info-location" value="${$(t.location||``)}" placeholder="City, State / Country" maxlength="200">
        </div>
        <div class="form-group">
          <label for="info-date">Date</label>
          <input type="date" id="info-date" value="${t.date||``}">
        </div>
        <div class="form-group" style="display:flex; gap:24px;">
          <label class="checkbox-label">
            <input type="checkbox" id="display-title" ${t.displayTitle===!1?``:`checked`}>
            <span>Show title</span>
          </label>
          <label class="checkbox-label">
            <input type="checkbox" id="display-conference" ${t.displayConference===!1?``:`checked`}>
            <span>Show conference</span>
          </label>
        </div>
      </div>
    </div>

    <!-- ═══ TAGS ═══ -->
    <div class="section">
      <div class="section-header" data-section="tags-section">
        <h3>Tags</h3>
        ${n}
      </div>
      <div class="section-content" id="tags-section">
        <div class="form-group">
          <div class="editor-tags-container">
            ${S(t.tags||[],{removable:!0})}
          </div>
          <div id="editor-tag-input-container"></div>
        </div>
      </div>
    </div>

    <!-- ═══ COLLECTION SETTINGS ═══ -->
    <div class="section">
      <div class="section-header" data-section="settings-section">
        <h3>Collection Settings <span id="settings-save-status" class="auto-save-status"></span></h3>
        ${Ee}
      </div>
      <div class="section-content collapsed" id="settings-section">
        <div class="form-group">
          <label for="collection-slug">Collection URL Slug</label>
          <div class="slug-input-row">
            <span class="slug-prefix">${B?.username?`academiqr.com/u/${$(B.username)}/`:`slug: `}</span>
            <input type="text" id="collection-slug" value="${$(z.slug||``)}" placeholder="my-collection" maxlength="60">
          </div>
          <p id="slug-status" style="font-size:0.75rem; margin-top:4px; min-height:1.2em; color:#9ca3af;"></p>
        </div>
        <div class="form-group">
          <label>Public Link</label>
          <div style="display:flex; align-items:center; gap:8px; background:#f8fafc; padding:10px 14px; border-radius:8px; border:1px solid #e2e8f0;">
            <i class="fas fa-link" style="color:#9ca3af; font-size:0.75rem;"></i>
            <span id="public-link-preview" style="color:#64748b; font-size:0.8rem; word-break:break-all;">${B?.username&&z.slug?`academiqr.com/u/${$(B.username)}/${$(z.slug)}`:`academiqr.com/public.html?collection=${z.id.substring(0,8)}...`}</span>
            <button type="button" class="btn-ghost btn-sm" id="copy-link-btn" title="Copy link" style="margin-left:auto;"><i class="fas fa-copy"></i></button>
          </div>
        </div>
        <div class="form-group">
          <label for="collection-visibility">Visibility</label>
          <select id="collection-visibility" class="form-select">
            <option value="public" ${r===`public`?`selected`:``}>Public — Anyone with the link</option>
            <option value="private" ${r===`private`?`selected`:``}>Private — Only you</option>
            <option value="passkey" ${i?`selected`:``}>Passkey — Requires a code</option>
          </select>
        </div>
        <div class="form-group" id="passkey-group" style="display:${i||r===`passkey`?`block`:`none`}">
          <label for="collection-passkey">Passkey</label>
          <input type="text" id="collection-passkey" value="" placeholder="${i?`(unchanged — enter new to update)`:`Enter passkey`}">
        </div>
      </div>
    </div>
  `;if(H){let e=V.find(e=>e.id===H);if(e){let t=!!e.source_link_id,r=d(e),i=t?!e.use_library_defaults:r,o=t&&e.use_library_defaults,s=i&&r?e.custom_overrides.title??e.title??``:e.title||``,c=i&&r?e.custom_overrides.image_url??e.image_url??``:e.image_url||``,l=f(e)||``,u=h(e)||``,m=o?g(e):i&&r&&e.custom_overrides.image_position?e.custom_overrides.image_position:e.image_position||e.imagePosition||{x:50,y:50},_=o?p(e):i&&r&&e.custom_overrides.image_scale!=null?e.custom_overrides.image_scale:e.image_scale??e.imageScale??100,v=o?u:c;a+=`
    <!-- ═══ EDIT LINK ═══ -->
    <div class="section">
      <div class="section-header" data-section="link-editor-section">
        <h3>Edit Link <span id="link-save-status" class="auto-save-status"></span></h3>
        ${n}
      </div>
      <div class="section-content" id="link-editor-section">
        <div class="link-editor">
          <div class="link-editor-header" style="margin-bottom:12px;">
            <span style="font-size:0.875rem; color:#64748b;">Editing: <strong>${$(l||`Untitled`)}</strong></span>
            <button class="btn-danger btn-sm" id="delete-link-btn" data-link-id="${e.id}">
              <i class="fas fa-trash"></i> Delete
            </button>
          </div>

          <!-- Library / Customize toggle (all links) -->
          <div class="link-source-toggle">
            <div class="source-toggle-options">
              <label class="source-toggle-option ${i?``:`active`}">
                <input type="radio" name="link-source-mode" value="library" ${i?``:`checked`}>
                <i class="fas fa-book"></i> Use Library Version
              </label>
              <label class="source-toggle-option ${i?`active`:``}">
                <input type="radio" name="link-source-mode" value="custom" ${i?`checked`:``}>
                <i class="fas fa-pen"></i> Customize for This Collection
              </label>
            </div>
            ${i?`
              <p class="source-toggle-hint"><i class="fas fa-info-circle"></i> This link has custom title/image for this collection only.</p>
            `:`
              <p class="source-toggle-hint"><i class="fas fa-info-circle"></i> ${t?`Title and image sync with the library version. Changes in the library will appear here automatically.`:`Editing title or image here will also update in your Link Library.`}</p>
            `}
          </div>

          <div class="form-group">
            <label for="link-title">Title</label>
            <input type="text" id="link-title" value="${$(o?l:s)}" placeholder="Link title" ${o?`disabled`:``}>
          </div>

          <div class="form-group">
            <label for="link-url">URL</label>
            <input type="url" id="link-url" value="${$(e.url||``)}" placeholder="https://...">
          </div>

          <div class="form-group">
            <label for="link-image">Image URL</label>
            <div class="image-input-row">
              <input type="text" id="link-image" value="${$(v||``)}" placeholder="Image URL or upload" ${o?`disabled`:``}>
              <button class="btn-secondary" id="upload-image-btn" ${o?`disabled`:``}><i class="fas fa-upload"></i> Upload</button>
              <button class="btn-secondary" id="browse-media-btn" ${o?`disabled`:``}><i class="fas fa-images"></i> Browse</button>
              <input type="file" id="link-image-file" accept="image/*" style="display:none;">
            </div>
            ${v?`
              <div class="image-preview" style="margin-top:12px;">
                <img src="${$(v)}" alt="Preview"
                     style="${ke(m.x,m.y,_)}"
                     onerror="this.style.display='none'">
              </div>
              ${o?``:`
              <div class="form-group" style="margin-top:8px;">
                <label>Image Position X</label>
                <input type="range" id="link-img-pos-x" min="0" max="100" value="${m.x??50}" class="range-input">
              </div>
              <div class="form-group">
                <label>Image Position Y</label>
                <input type="range" id="link-img-pos-y" min="0" max="100" value="${m.y??50}" class="range-input">
              </div>
              <div class="form-group">
                <label>Image Scale</label>
                <input type="range" id="link-img-scale" min="50" max="300" value="${_}" class="range-input">
              </div>
              `}
            `:``}
          </div>

          <div class="form-group">
            <label>Tags</label>
            <div id="link-tags-display" style="display:flex; flex-wrap:wrap; gap:4px; margin-bottom:6px;">
              ${S(e.tags||[],{removable:!0})}
            </div>
            <div id="link-tag-input-container"></div>
          </div>

          ${i?`
          <div class="form-actions">
              <button class="btn-secondary" id="save-as-library-btn" title="Create a new library link with this custom title/image">
                <i class="fas fa-plus"></i> Save as New Library Link
              </button>
          </div>
          `:``}
        </div>
      </div>
    </div>
      `}}else a+=`
    <div style="text-align:center; padding:24px; color:#9ca3af;">
      <i class="fas fa-mouse-pointer" style="font-size:1.5rem; opacity:0.3; margin-bottom:8px; display:block;"></i>
      <p style="font-size:0.875rem;">Select a link in the sidebar to edit it</p>
    </div>
    `;e.innerHTML=a,[`info-title`,`info-conference`,`info-location`,`info-date`].forEach(e=>{document.getElementById(e)?.addEventListener(`input`,()=>{Re(),Q(),G.trigger()})}),[`display-title`,`display-conference`].forEach(e=>{document.getElementById(e)?.addEventListener(`change`,()=>{Re(),Q(),G.trigger()})});let o=e.querySelector(`.editor-tags-container`),s=document.getElementById(`editor-tag-input-container`);if(s){let e=(z.presentation_data||{}).tags||[];E(s,W,e,async e=>{let t=z.presentation_data||{};t.tags=C([...t.tags||[],e]),z.presentation_data=t,W.includes(e)||(W.push(e),W.sort(),T()),G.trigger(),o&&(o.innerHTML=S(t.tags,{removable:!0})),yt(o)})}yt(o),document.getElementById(`copy-link-btn`)?.addEventListener(`click`,ze);let c=z.slug||``;if(document.getElementById(`collection-slug`)?.addEventListener(`input`,e=>{let t=e.target.value.toLowerCase().replace(/[^a-z0-9-]/g,``);e.target.value=t;let n=document.getElementById(`public-link-preview`),r=document.getElementById(`slug-status`);n&&B?.username&&t?n.textContent=`academiqr.com/u/${B.username}/${t}`:n&&t&&(n.textContent=`academiqr.com/public.html?collection=${z.id.substring(0,8)}...`),r&&c&&t!==c?r.innerHTML=`<span style="color:#dc2626;"><i class="fas fa-exclamation-triangle"></i> Changing this slug will break any QR codes or shared links that use the current short URL.</span>`:r&&(r.textContent=``),c&&t!==c||K.trigger()}),document.getElementById(`collection-slug`)?.addEventListener(`blur`,()=>{let e=document.getElementById(`collection-slug`)?.value.trim().toLowerCase().replace(/[^a-z0-9-]/g,``)||``;if(c&&e!==c&&e){if(confirm(`You are changing this collection's URL slug.

Any QR codes or shared links using the short URL format will stop working.
(Note: QR codes using the legacy ?collection= format will still work.)

Continue?`))K.trigger();else{document.getElementById(`collection-slug`).value=c;let e=document.getElementById(`public-link-preview`);e&&B?.username&&c&&(e.textContent=`academiqr.com/u/${B.username}/${c}`);let t=document.getElementById(`slug-status`);t&&(t.textContent=``)}}}),document.getElementById(`collection-visibility`)?.addEventListener(`change`,e=>{let t=document.getElementById(`passkey-group`);t&&(t.style.display=e.target.value===`passkey`?`block`:`none`),K.trigger()}),document.getElementById(`collection-passkey`)?.addEventListener(`input`,()=>{K.trigger()}),H){let e=H;document.getElementById(`delete-link-btn`)?.addEventListener(`click`,()=>Qe(e)),[`link-title`,`link-url`,`link-image`].forEach(e=>{document.getElementById(e)?.addEventListener(`input`,()=>{q.trigger()})});let t=document.getElementById(`link-tags-display`),n=document.getElementById(`link-tag-input-container`);if(n){let r=V.find(t=>t.id===e);if(r){let e=r.tags||[];E(n,W,e,async e=>{r.tags=C([...r.tags||[],e]),t&&(t.innerHTML=S(r.tags,{removable:!0}),vt(t,r)),W.includes(e)||(W.push(e),W.sort(),T()),q.trigger()}),vt(t,r)}}document.querySelectorAll(`input[name="link-source-mode"]`).forEach(t=>{t.addEventListener(`change`,t=>{let n=V.find(t=>t.id===e);if(!n)return;let r=t.target.value===`library`;n.source_link_id?n.use_library_defaults=r:n.custom_overrides=r?null:{title:n.title||``,image_url:n.image_url||null,image_position:n.image_position||{x:50,y:50},image_scale:n.image_scale??100},X(),Y(),Q()})}),document.getElementById(`save-as-library-btn`)?.addEventListener(`click`,()=>Ze(e)),document.getElementById(`upload-image-btn`)?.addEventListener(`click`,()=>{document.getElementById(`link-image-file`)?.click()}),document.getElementById(`link-image-file`)?.addEventListener(`change`,Be),document.getElementById(`browse-media-btn`)?.addEventListener(`click`,()=>{lt(t=>{let n=document.getElementById(`link-image`);n&&(n.value=t);let r=V.find(t=>t.id===e);r&&(d(r)?r.custom_overrides.image_url=t:r.image_url=t,Q(),Y(),X(),q.trigger())})}),document.getElementById(`link-image`)?.addEventListener(`input`,()=>{let t=document.getElementById(`link-image`)?.value.trim(),n=V.find(t=>t.id===e);n&&(d(n)?n.custom_overrides.image_url=t||null:n.image_url=t||null,Q(),Y(),q.trigger())}),[`link-img-pos-x`,`link-img-pos-y`,`link-img-scale`].forEach(e=>{document.getElementById(e)?.addEventListener(`input`,()=>{Ve(),q.trigger()})})}Ae(e)}function Re(){let e=z.presentation_data||{};e.title=document.getElementById(`info-title`)?.value||``,e.conference=document.getElementById(`info-conference`)?.value||``,e.location=document.getElementById(`info-location`)?.value||``,e.date=document.getElementById(`info-date`)?.value||``,e.displayTitle=document.getElementById(`display-title`)?.checked??!0,e.displayConference=document.getElementById(`display-conference`)?.checked??!0,z.presentation_data=e}function ze(){let e=a(R.id,z.id,{username:B?.username,slug:z.slug});navigator.clipboard.writeText(e).then(()=>{let e=document.getElementById(`copy-link-btn`);e&&(e.innerHTML=`<i class="fas fa-check"></i>`,setTimeout(()=>{e.innerHTML=`<i class="fas fa-copy"></i>`},1500))}).catch(()=>{prompt(`Copy this link:`,e)})}async function Be(e){let t=e.target.files?.[0];if(!t)return;let n=document.getElementById(`upload-image-btn`),r=n?.innerHTML;try{n&&(n.disabled=!0,n.innerHTML=`<i class="fas fa-spinner fa-spin"></i> Uploading...`);let e=await x(t,`links`,R.id,{maxWidth:1200,maxHeight:1200,quality:.75}),r=document.getElementById(`link-image`);r&&(r.value=e);let i=V.find(e=>e.id===H);i&&(d(i)?i.custom_overrides.image_url=e:i.image_url=e,Q(),Y(),q.trigger())}catch(e){console.error(`Image upload failed:`,e),o(`Image upload failed: `+e.message,`error`)}finally{n&&(n.disabled=!1,n.innerHTML=r)}}function Ve(){let e=V.find(e=>e.id===H);if(!e)return;let t=parseInt(document.getElementById(`link-img-pos-x`)?.value)||50,n=parseInt(document.getElementById(`link-img-pos-y`)?.value)||50,r=parseInt(document.getElementById(`link-img-scale`)?.value)||100;d(e)?(e.custom_overrides.image_position={x:t,y:n},e.custom_overrides.image_scale=r):(e.image_position={x:t,y:n},e.image_scale=r);let i=document.querySelector(`.image-preview img`);i&&(i.style.cssText=ke(t,n,r)),Q()}function He(e){if(!e||typeof e==`object`&&Object.keys(e).length===0)return{...De};if(typeof e==`string`)try{e=JSON.parse(e)}catch{return He(null)}let t=e.borderEnabled===void 0?e.gradientBorderEnabled===void 0||!!e.gradientBorderEnabled:!!e.borderEnabled,n=[e.textColor,e.presentationTextColor,e.profileTextColor,e.presentationColor,e.profileColor].find(e=>typeof e==`string`&&e.length>0)||`#1A2F5B`;return{backgroundType:e.backgroundType||`solid`,backgroundColor:e.backgroundColor||`#ffffff`,gradientText:e.gradientText||``,backgroundImage:e.backgroundImage||``,backgroundImageX:e.backgroundImageX??e.imagePositionX??50,backgroundImageY:e.backgroundImageY??e.imagePositionY??50,backgroundImageScale:e.backgroundImageScale??e.imageScale??100,profileTextColor:n,presentationTextColor:n,buttonTextColor:e.buttonTextColor||`#000000`,buttonBackgroundColor:e.buttonBackgroundColor||e.buttonBgColor||`#1A2F5B`,buttonStyle:e.buttonStyle||`soft`,buttonBorderRadius:e.buttonBorderRadius||e.borderRadius||`8px`,buttonPadding:e.buttonPadding||`12px 24px`,buttonFontSize:e.buttonFontSize||`16px`,buttonFontWeight:e.buttonFontWeight||`500`,textFontSize:e.textFontSize||`18px`,textFontWeight:e.textFontWeight||`600`,borderEnabled:t,borderType:e.borderType||`solid`,borderStyle:e.borderStyle===`fill`||e.borderStyle===`thin`?e.borderStyle:`fill`,borderColor:e.borderColor||`#1A2F5B`,borderWidth:e.borderWidth||`1px`,borderGradient:e.borderGradient||e.borderGradientText||``,borderGradientAngle:e.borderGradientAngle||``}}var Ue=[`#ffffff`,`#e5e7eb`,`#9ca3af`,`#1f2937`,`#000000`,`#1A2F5B`],We=[`linear-gradient(45deg, #ff6b6b, #4ecdc4)`,`linear-gradient(135deg, #1A2F5B, #3B5B8F)`,`linear-gradient(43deg, #D54070 0%, #8F4469 20%, #CA5699 40%, #59B8DA 60%, #9AD0DD 80%, #73B44A 100%)`];function Ge(e){return`<div class="color-presets">${Ue.map(t=>`<button type="button" class="color-preset ${t===e?`active`:``}" data-color="${t}" style="background:${t};${t===`#ffffff`?`border:1px solid #e5e7eb;`:``}" title="${t}"></button>`).join(``)}</div>`}function Ke(e){let t=He(z.theme),n=t.backgroundType,r=t.backgroundColor,i=t.gradientText||`linear-gradient(45deg, #ff6b6b 0%, #4ecdc4 100%)`;t.profileTextColor;let a=t.presentationTextColor,o=t.buttonTextColor,s=t.buttonBackgroundColor,c=t.buttonStyle,l=t.borderEnabled,u=t.borderType,d=t.borderStyle,f=t.borderColor;t.borderWidth,t.buttonBorderRadius;let p=t.borderGradient,m=Te;e.innerHTML=`
    <div class="appearance-editor">
      <!-- ═══ BACKGROUND ═══ -->
      <div class="section">
        <div class="section-header" data-section="background-section">
          <h3>Background <span id="theme-save-status" class="auto-save-status"></span></h3>
          ${m}
        </div>
        <div class="section-content" id="background-section">
          <div class="form-group">
            <div class="radio-group">
              <label class="radio-label"><input type="radio" name="bg-type" value="solid" ${n===`solid`?`checked`:``}> Solid Color</label>
              <label class="radio-label"><input type="radio" name="bg-type" value="gradient" ${n===`gradient`?`checked`:``}> Gradient</label>
              <label class="radio-label"><input type="radio" name="bg-type" value="image" ${n===`image`?`checked`:``}> Image</label>
            </div>
          </div>

          <!-- Solid Color -->
          <div id="bg-solid-group" style="display:${n===`solid`?`block`:`none`}">
            <div class="form-group">
              <div class="color-input-row">
                <input type="color" id="theme-bg-color" value="${r}">
                <input type="text" id="theme-bg-color-text" value="${r}" class="color-text">
              </div>
              ${Ge(r)}
            </div>
          </div>

          <!-- Gradient -->
          <div id="bg-gradient-group" style="display:${n===`gradient`?`block`:`none`}">
            <div class="form-group">
              <label>Gradient CSS</label>
              <textarea id="theme-gradient" class="gradient-textarea" rows="2" placeholder="linear-gradient(...)">${$(i)}</textarea>
              <div class="gradient-preview" id="gradient-preview" style="background: ${i};"></div>
            </div>
            <div class="form-group">
              <label>Presets</label>
              <div class="gradient-presets">
                ${We.map((e,t)=>`
                  <button type="button" class="gradient-preset" data-gradient="${$(e)}" style="background: ${e};" title="Preset ${t+1}"></button>
                `).join(``)}
              </div>
            </div>
          </div>

          <!-- Image -->
          <div id="bg-image-group" style="display:${n===`image`?`block`:`none`}">
            <div class="form-group">
              <label>Background Image</label>
              <div class="image-upload-row">
                <button type="button" class="btn-save-compact" id="bg-upload-btn"><i class="fas fa-folder-open"></i> Choose File</button>
                <button type="button" class="btn-save-compact" id="bg-browse-media-btn"><i class="fas fa-images"></i> Browse Library</button>
                <input type="file" id="bg-image-file" accept="image/*" style="display:none">
              </div>
              ${t.backgroundImage&&t.backgroundType===`image`?`
                <div class="bg-image-preview" style="background-image: url('${t.backgroundImage}');"></div>
                <button type="button" class="btn-ghost btn-sm" id="bg-image-remove"><i class="fas fa-times"></i> Remove</button>
              `:``}
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
          ${m}
        </div>
        <div class="section-content" id="text-buttons-section">
          <div class="form-group">
            <label>Profile and Presentation Information Text Color</label>
            <div class="color-input-row">
              <input type="color" id="theme-presentation-text" value="${a}">
              <input type="text" id="theme-presentation-text-val" value="${a}" class="color-text">
            </div>
            ${Ge(a)}
          </div>
          <div class="form-group">
            <label>Button Text Color</label>
            <div class="color-input-row">
              <input type="color" id="theme-btn-text" value="${o}">
              <input type="text" id="theme-btn-text-val" value="${o}" class="color-text">
            </div>
            ${Ge(o)}
          </div>
          <div class="form-group">
            <label>Button Style</label>
            <select id="theme-button-style" class="form-select">
              <option value="soft" ${c===`soft`?`selected`:``}>Soft Glass</option>
              <option value="solid" ${c===`solid`?`selected`:``}>Solid</option>
              <option value="outline" ${c===`outline`?`selected`:``}>Outline</option>
            </select>
          </div>
          <div class="form-group" id="btn-bg-group" style="display:${c===`solid`?`block`:`none`}">
            <label>Button Background Color</label>
            <div class="color-input-row">
              <input type="color" id="theme-btn-bg" value="${s}">
              <input type="text" id="theme-btn-bg-val" value="${s}" class="color-text">
            </div>
            ${Ge(s)}
          </div>
        </div>
      </div>

      <!-- ═══ BORDER EFFECTS ═══ -->
      <div class="section">
        <div class="section-header" data-section="border-effects-section">
          <h3>Border Effects</h3>
          ${m}
        </div>
        <div class="section-content" id="border-effects-section">
          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" id="theme-border-enabled" ${l?`checked`:``}>
              <span>Enable Custom Border</span>
            </label>
          </div>
          <div id="border-options" style="display:${l?`block`:`none`}">
            <div class="form-group">
              <label>Border Type</label>
              <div class="radio-group">
                <label class="radio-label"><input type="radio" name="border-type" value="solid" ${u===`solid`?`checked`:``}> Solid Color</label>
                <label class="radio-label"><input type="radio" name="border-type" value="gradient" ${u===`gradient`?`checked`:``}> Gradient</label>
              </div>
            </div>
            <div class="form-group">
              <label>Border Style</label>
              <div class="radio-group">
                <label class="radio-label"><input type="radio" name="border-style" value="fill" ${d===`fill`?`checked`:``}> Frame Fill</label>
                <label class="radio-label"><input type="radio" name="border-style" value="thin" ${d===`thin`?`checked`:``}> Thin Border</label>
              </div>
            </div>

            <!-- Solid border color -->
            <div id="border-solid-group" style="display:${u===`solid`?`block`:`none`}">
              <div class="form-group">
                <label>Border Color</label>
                <div class="color-input-row">
                  <input type="color" id="theme-border-color" value="${f}">
                  <input type="text" id="theme-border-color-val" value="${f}" class="color-text">
                </div>
                ${Ge(f)}
              </div>
            </div>

            <!-- Gradient border -->
            <div id="border-gradient-group" style="display:${u===`gradient`?`block`:`none`}">
              <div class="form-group">
                <label>Border Gradient CSS</label>
                <textarea id="theme-border-gradient" class="gradient-textarea" rows="2" placeholder="linear-gradient(...)">${$(p)}</textarea>
                <div class="gradient-preview" id="border-gradient-preview" style="background: ${p||`linear-gradient(45deg, #1A2F5B, #3B5B8F)`};"></div>
              </div>
              <div class="form-group">
                <label>Presets</label>
                <div class="gradient-presets">
                  ${We.map((e,t)=>`
                    <button type="button" class="border-gradient-preset" data-gradient="${$(e)}" style="background: ${e};" title="Preset ${t+1}"></button>
                  `).join(``)}
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
          ${Ee}
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
  `,[[`theme-bg-color`,`theme-bg-color-text`],[`theme-presentation-text`,`theme-presentation-text-val`],[`theme-btn-bg`,`theme-btn-bg-val`],[`theme-btn-text`,`theme-btn-text-val`],[`theme-border-color`,`theme-border-color-val`]].forEach(([e,t])=>{document.getElementById(e)?.addEventListener(`input`,e=>{let n=document.getElementById(t);n&&(n.value=e.target.value),Z()}),document.getElementById(t)?.addEventListener(`input`,t=>{let n=document.getElementById(e);n&&/^#[0-9a-fA-F]{6}$/.test(t.target.value)&&(n.value=t.target.value),Z()})}),e.addEventListener(`click`,e=>{let t=e.target.closest(`.color-preset`);if(!t)return;let n=t.dataset.color,r=t.closest(`.form-group`),i=r?.querySelector(`input[type="color"]`),a=r?.querySelector(`.color-text`);i&&(i.value=n),a&&(a.value=n),r?.querySelectorAll(`.color-preset`).forEach(e=>e.classList.remove(`active`)),t.classList.add(`active`),Z()}),e.querySelectorAll(`.gradient-preset`).forEach(e=>{e.addEventListener(`click`,()=>{let t=document.getElementById(`theme-gradient`),n=document.getElementById(`gradient-preview`);t&&(t.value=e.dataset.gradient),n&&(n.style.background=e.dataset.gradient),Z()})}),e.querySelectorAll(`.border-gradient-preset`).forEach(e=>{e.addEventListener(`click`,()=>{let t=document.getElementById(`theme-border-gradient`),n=document.getElementById(`border-gradient-preview`);t&&(t.value=e.dataset.gradient),n&&(n.style.background=e.dataset.gradient),Z()})}),e.querySelectorAll(`input[name="bg-type"]`).forEach(e=>{e.addEventListener(`change`,e=>{document.getElementById(`bg-solid-group`).style.display=e.target.value===`solid`?`block`:`none`,document.getElementById(`bg-gradient-group`).style.display=e.target.value===`gradient`?`block`:`none`,document.getElementById(`bg-image-group`).style.display=e.target.value===`image`?`block`:`none`,Z()})}),document.getElementById(`theme-button-style`)?.addEventListener(`change`,e=>{let t=document.getElementById(`btn-bg-group`);t&&(t.style.display=e.target.value===`solid`?`block`:`none`),Z()}),document.getElementById(`theme-border-enabled`)?.addEventListener(`change`,e=>{let t=document.getElementById(`border-options`);t&&(t.style.display=e.target.checked?`block`:`none`),Z()}),e.querySelectorAll(`input[name="border-type"]`).forEach(e=>{e.addEventListener(`change`,e=>{document.getElementById(`border-solid-group`).style.display=e.target.value===`solid`?`block`:`none`,document.getElementById(`border-gradient-group`).style.display=e.target.value===`gradient`?`block`:`none`,Z()})}),document.getElementById(`theme-gradient`)?.addEventListener(`input`,e=>{let t=document.getElementById(`gradient-preview`);t&&(t.style.background=e.target.value),Z()}),document.getElementById(`theme-border-gradient`)?.addEventListener(`input`,e=>{let t=document.getElementById(`border-gradient-preview`);t&&(t.style.background=e.target.value),Z()}),[`bg-pos-x`,`bg-pos-y`,`bg-pos-scale`].forEach(e=>{document.getElementById(e)?.addEventListener(`input`,Z)}),document.getElementById(`bg-upload-btn`)?.addEventListener(`click`,()=>{document.getElementById(`bg-image-file`)?.click()}),document.getElementById(`bg-image-file`)?.addEventListener(`change`,qe),document.getElementById(`bg-browse-media-btn`)?.addEventListener(`click`,()=>{lt(e=>{z._pendingBgImage=e,Z(),Ke(document.getElementById(`tab-content`))})}),document.getElementById(`bg-image-remove`)?.addEventListener(`click`,()=>{z._pendingBgImage=null,z.theme&&(z.theme.backgroundImage=``);let e=document.querySelector(`input[name="bg-type"][value="solid"]`);e&&(e.checked=!0),Z(),Ke(document.getElementById(`tab-content`))}),[`theme-button-style`].forEach(e=>{document.getElementById(e)?.addEventListener(`change`,Z)}),e.querySelectorAll(`input[name="border-style"]`).forEach(e=>{e.addEventListener(`change`,Z)}),Ae(e),document.getElementById(`save-new-theme-btn`)?.addEventListener(`click`,ht),mt()}async function qe(e){let t=e.target.files?.[0];if(!t)return;let n=document.getElementById(`bg-upload-btn`),r=n?.innerHTML;try{n&&(n.disabled=!0,n.innerHTML=`<i class="fas fa-spinner fa-spin"></i> Uploading...`);let e=await x(t,`backgrounds`,R.id,{maxWidth:1920,maxHeight:1920});z._pendingBgImage=e,Z(),Ke(document.getElementById(`tab-content`))}catch(e){console.error(`Background image upload failed:`,e),o(`Background image upload failed: `+e.message,`error`)}finally{n&&(n.disabled=!1,n.innerHTML=r)}}function Z(){let e=pt(),t={...z.theme,...e};z._pendingBgImage&&(t.backgroundImage=z._pendingBgImage),Q(t),we&&we.trigger()}function Je(e){pe(e,z,R)}function Ye(e){Ce(e,z,R)}function Q(e){let t=document.getElementById(`phone-preview`);if(!t)return;let n=He(e||z.theme),r=z.presentation_data||{},i=B||{},a=n.backgroundType,o=``;if(a===`gradient`&&n.gradientText)o=`background: ${n.gradientText};`;else if(a===`image`&&n.backgroundImage){let e=n.backgroundImageX,t=n.backgroundImageY,r=n.backgroundImageScale;o=`background: url('${n.backgroundImage}') ${e}% ${t}% / ${r}% no-repeat;`}else o=`background: ${n.backgroundColor};`;let s=n.presentationTextColor,c=s,l=n.buttonStyle,u=n.buttonBackgroundColor,d=n.buttonTextColor;n.buttonBorderRadius;let m=n.borderEnabled,_=n.borderType,v=n.borderStyle,y=n.borderColor,b=n.borderGradient,x=i.profile_photo||``,S={scale:100,x:50,y:50};if(i.profile_photo_position)try{S=typeof i.profile_photo_position==`string`?JSON.parse(i.profile_photo_position):i.profile_photo_position}catch{}let C=(S.scale||100)/100,w=((S.x||50)-50)*-1,T=((S.y||50)-50)*-1,E=[{key:`social_email`,icon:`fa-envelope`,prefix:`mailto:`,fab:!1},{key:`social_website`,icon:`fa-globe`,prefix:``,fab:!1},{key:`social_instagram`,icon:`fa-instagram`,prefix:``,fab:!0},{key:`social_facebook`,icon:`fa-facebook`,prefix:``,fab:!0},{key:`social_twitter`,icon:`fa-x-twitter`,prefix:``,fab:!0},{key:`social_linkedin`,icon:`fa-linkedin`,prefix:``,fab:!0},{key:`social_youtube`,icon:`fa-youtube`,prefix:``,fab:!0},{key:`social_tiktok`,icon:`fa-tiktok`,prefix:``,fab:!0},{key:`social_snapchat`,icon:`fa-snapchat`,prefix:``,fab:!0},{key:`social_google_scholar`,icon:`fa-graduation-cap`,prefix:``,fab:!1},{key:`social_orcid`,icon:`fa-orcid`,prefix:``,fab:!0},{key:`social_researchgate`,icon:`fa-researchgate`,prefix:``,fab:!0}],D=i.social_order,O;if(D&&Array.isArray(D)){let e=[];for(let t of D){let n=E.find(e=>e.key===`social_${t}`);n&&e.push(n)}for(let t of E)e.includes(t)||e.push(t);O=e.filter(e=>i[e.key]?.trim())}else O=E.filter(e=>i[e.key]?.trim());let k=r.title||`Untitled`,A=r.displayTitle!==!1,j=r.displayConference!==!1,M=r.conference||``,N=r.location||``,P=r.date?Xe(r.date):``,F=V.filter(e=>e.is_active!==!1);function ee(){let e=`color: ${d}; border-radius: 8px; font-size: 1.14rem;`;return e+=l===`solid`?`background: ${u} !important; border-color: ${u} !important;`:l===`outline`?`background: transparent !important; border: 2px solid ${d} !important; color: ${d} !important;`:`color: ${d} !important;`,e}let I=t.closest(`.phone-mockup`)||t.parentElement;I&&(I.style.boxShadow=`0 20px 40px rgba(0, 0, 0, 0.3)`,I.style.padding=`8px`,m?_===`gradient`&&b?v===`thin`?(I.style.background=b,I.style.padding=`8px`,I.style.boxShadow=`inset 0 0 0 3px transparent, 0 20px 40px rgba(0, 0, 0, 0.3)`):(I.style.background=b,I.style.padding=`8px`):v===`thin`?(I.style.background=`#1e293b`,I.style.boxShadow=`inset 0 0 0 8px ${y}, 0 20px 40px rgba(0, 0, 0, 0.3)`):I.style.background=y:I.style.background=`#1e293b`);let L=A&&k||j&&M||N||P;t.innerHTML=`
    <div class="phone-screen" style="${o}">
      <!-- Header content — wraps profile + presentation like v0.6.7 -->
      <div class="phone-header-content">
        <!-- Profile — avatar + name side by side -->
        <div class="phone-profile-section">
          ${x?`
            <div class="phone-avatar">
              <img src="${$(x)}" alt="Profile"
                   style="transform: translate(${w}%, ${T}%) scale(${C}) !important; transform-origin: center center !important;"
                   onerror="this.parentElement.style.display='none'">
            </div>
          `:``}
          <div class="phone-name-section">
            ${i.display_name?`<h4 class="phone-display-name" style="color: ${c};">${$(i.display_name)}</h4>`:``}
            ${O.length>0?`
              <div class="phone-socials">
                ${O.map(e=>`
                  <span class="phone-social-icon ${e.key}" title="${e.key.replace(`social_`,``)}">
                    <i class="${e.fab?`fab`:`fas`} ${e.icon}"></i>
                  </span>
                `).join(``)}
              </div>
            `:``}
          </div>
        </div>

        <!-- Presentation Info -->
        ${L?`
          <div class="phone-presentation" style="color: ${s};">
            ${A?`<div class="phone-info-field"><span class="phone-info-value">${$(k)}</span></div>`:``}
            ${j&&M?`<div class="phone-info-field"><span class="phone-info-value">${$(M)}</span></div>`:``}
            ${N?`<div class="phone-info-field"><span class="phone-info-value" style="font-size:0.9rem;">${$(N)}</span></div>`:``}
            ${P?`<div class="phone-info-field"><span class="phone-info-value" style="font-size:0.9rem;">${$(P)}</span></div>`:``}
          </div>
        `:``}
      </div>

      <!-- Links -->
      <div class="phone-links">
        ${F.length===0?`
          <p class="phone-empty" style="color: ${s};">No active links</p>
        `:F.map(e=>{let t=g(e),n=p(e),r=ke(t.x,t.y,n),i=h(e),a=f(e)||`Untitled`;return`
            <div class="phone-link-btn ${l}" style="${ee()}">
              ${i?`
                <div class="phone-link-image-wrapper">
                  <div class="phone-link-image">
                    <img src="${$(i)}" alt=""
                      style="${r}"
                      onerror="this.parentElement.innerHTML='<i class=\\'fas fa-link\\' style=\\'color:#6b7280\\'></i>'">
                  </div>
                </div>
              `:``}
              <div class="phone-link-text">${$(a)}</div>
            </div>
          `}).join(``)}
      </div>

      <!-- Footer -->
      <div class="phone-footer" style="color: ${c};">
        <p class="phone-footer-text">Powered by <a href="https://academiqr.com" style="color: ${c};">AcademiQR.com</a></p>
      </div>
    </div>
  `}function Xe(e){try{return new Date(e+`T00:00:00`).toLocaleDateString(`en-US`,{month:`long`,day:`numeric`,year:`numeric`})}catch{return e}}async function Ze(t){if(!V.find(e=>e.id===t))return;let n=document.getElementById(`link-title`)?.value.trim(),r=document.getElementById(`link-url`)?.value.trim(),i=document.getElementById(`link-image`)?.value.trim(),a=parseInt(document.getElementById(`link-img-pos-x`)?.value)||50,s=parseInt(document.getElementById(`link-img-pos-y`)?.value)||50,c=parseInt(document.getElementById(`link-img-scale`)?.value)||100;if(!n)o(`Please enter a title.`,`warning`);else if(!r)o(`Please enter a URL.`,`warning`);else try{let t=V.reduce((e,t)=>Math.max(e,t.order_index||0),0),{data:o,error:l}=await e.from(`link_items`).insert({list_id:z.id,title:n,url:r,image_url:i||null,image_position:{x:a,y:s},image_scale:c,order_index:t+100,is_active:!0}).select().single();if(l)throw l;V.push(o),H=o.id,Y(),X(),Q(),J(),Oe(`save-as-library-btn`)}catch(e){console.error(`Failed to create library link:`,e),o(`Failed to create link: `+e.message,`error`)}}async function Qe(t){let n=V.find(e=>e.id===t);if(n&&confirm(`Delete "${n.title||`this link`}"?`))try{let{error:n}=await e.from(`link_items`).delete().eq(`id`,t).eq(`list_id`,z.id);if(n)throw n;V=V.filter(e=>e.id!==t),H=null,Y(),X(),Q(),J()}catch(e){console.error(`Failed to delete link:`,e),o(`Failed to delete: `+e.message,`error`)}}async function $e(t){let n=V.find(e=>e.id===t);if(!n)return;let r=n.is_active===!1;try{let{error:i}=await e.from(`link_items`).update({is_active:r}).eq(`id`,t);if(i)throw i;n.is_active=r,Y(),Q()}catch(e){console.error(`Failed to toggle link:`,e)}}function et(){let e=document.getElementById(`new-link-modal`);e&&(document.getElementById(`new-link-title`).value=``,document.getElementById(`new-link-url`).value=``,document.getElementById(`new-link-image`).value=``,e.style.display=`flex`,document.getElementById(`new-link-title`).focus())}function tt(){let e=document.getElementById(`new-link-modal`);e&&(e.style.display=`none`)}async function nt(){let t=document.getElementById(`new-link-title`)?.value.trim(),n=document.getElementById(`new-link-url`)?.value.trim(),r=document.getElementById(`new-link-image`)?.value.trim();if(!t)o(`Please enter a title.`,`warning`);else if(!n)o(`Please enter a URL.`,`warning`);else try{let i=V.reduce((e,t)=>Math.max(e,t.order_index||0),0),{data:a,error:o}=await e.from(`link_items`).insert({list_id:z.id,title:t,url:n,image_url:r||null,order_index:i+100,is_active:!0}).select().single();if(o)throw o;V.push(a),H=a.id,tt(),Y(),X(),Q(),J()}catch(e){console.error(`Failed to add link:`,e),o(`Failed to add link: `+e.message,`error`)}}var rt=[];async function it(){let t=document.getElementById(`existing-link-modal`);if(!t)return;t.style.display=`flex`;let n=document.getElementById(`existing-links-list`);n&&(n.innerHTML=`<p class="existing-link-empty">Loading...</p>`);try{let{data:t,error:n}=await e.from(`link_items`).select(`*, link_lists!inner(id, slug, presentation_data, owner_id)`).eq(`link_lists.owner_id`,R.id).neq(`list_id`,z.id).order(`created_at`,{ascending:!1});if(n)throw n;rt=t||[],at(``)}catch(e){console.error(`Failed to load links:`,e),n&&(n.innerHTML=`<p class="existing-link-empty">Failed to load links.</p>`)}}function at(e){let t=document.getElementById(`existing-links-list`);if(!t)return;let n=e.toLowerCase(),r=n?rt.filter(e=>(e.title||``).toLowerCase().includes(n)||(e.url||``).toLowerCase().includes(n)):rt;r.length===0?t.innerHTML=`<p class="existing-link-empty">${n?`No matches found.`:`No links in other collections.`}</p>`:(t.innerHTML=r.map(e=>{let t=e.link_lists?.presentation_data?.title||e.link_lists?.slug||``;return`
      <div class="existing-link-item" data-link-id="${e.id}">
        <div class="link-thumb">
          ${e.image_url?`<img src="${$(e.image_url)}" alt="" onerror="this.parentElement.innerHTML='<i class=\\'fas fa-link\\' style=\\'color:#9ca3af\\'></i>'">`:`<i class="fas fa-link" style="color:#9ca3af"></i>`}
        </div>
        <div class="link-info">
          <div class="link-title">${$(e.title||`Untitled`)}</div>
          <div class="link-url">${$(_t(e.url||``))}</div>
        </div>
        <span class="link-collection-name">${$(t)}</span>
      </div>
    `}).join(``),t.querySelectorAll(`.existing-link-item`).forEach(e=>{e.addEventListener(`click`,()=>ot(e.dataset.linkId))}))}async function ot(t){let n=rt.find(e=>e.id===t);if(n)try{let r=V.reduce((e,t)=>Math.max(e,t.order_index||0),0),{data:i,error:a}=await e.from(`link_items`).insert({list_id:z.id,title:n.title,url:n.url,image_url:n.image_url,image_position:n.image_position||null,image_scale:n.image_scale||null,order_index:r+100,is_active:!0,source_link_id:t,use_library_defaults:!0}).select().single();if(a)throw a;i._resolved_title=n.title,i._resolved_image_url=n.image_url,i._resolved_image_position=n.image_position,i._resolved_image_scale=n.image_scale,V.push(i),H=i.id,st(),Y(),X(),Q(),J()}catch(e){console.error(`Failed to add existing link:`,e),o(`Failed to add link: `+e.message,`error`)}}function st(){let e=document.getElementById(`existing-link-modal`);e&&(e.style.display=`none`),rt=[]}var ct=null;async function lt(e){ct=e;let t=document.getElementById(`media-library-modal`),n=document.getElementById(`media-library-content`);if(t&&n){t.style.display=`flex`,n.innerHTML=`
    <div style="text-align:center; padding:32px; color:#9ca3af;">
      <i class="fas fa-spinner fa-spin" style="font-size:1.5rem;"></i>
      <p style="margin-top:12px;">Loading your images...</p>
    </div>
  `;try{let e=await b(R.id);if(e.length===0){n.innerHTML=`
        <div style="text-align:center; padding:32px; color:#9ca3af;">
          <i class="fas fa-images" style="font-size:2rem; opacity:0.3; margin-bottom:12px; display:block;"></i>
          <p>No uploaded images yet.</p>
          <p style="font-size:0.8rem;">Upload an image first, then it will appear here for reuse.</p>
        </div>
      `;return}n.innerHTML=`
      <div class="media-grid">
        ${e.map(e=>`
          <div class="media-item" data-url="${$(e.url)}" title="${$(e.name)}">
            <img src="${$(e.url)}" alt="${$(e.name)}" loading="lazy">
            <span class="media-item-label">${$(e.category)}</span>
          </div>
        `).join(``)}
      </div>
    `,n.querySelectorAll(`.media-item`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.url;ct&&ct(t),ut()})})}catch(e){console.error(`Failed to load media library:`,e),n.innerHTML=`
      <div style="text-align:center; padding:32px; color:#ef4444;">
        <p>Failed to load images: ${$(e.message)}</p>
      </div>
    `}}}function ut(){let e=document.getElementById(`media-library-modal`);e&&(e.style.display=`none`),ct=null}var dt=null;function ft(){let t=document.getElementById(`links-list`);t&&t.querySelectorAll(`.link-item`).forEach(n=>{n.setAttribute(`draggable`,`true`),n.addEventListener(`dragstart`,e=>{dt=parseInt(n.dataset.index),n.classList.add(`dragging`),e.dataTransfer.effectAllowed=`move`}),n.addEventListener(`dragend`,()=>{n.classList.remove(`dragging`),t.querySelectorAll(`.link-item`).forEach(e=>e.classList.remove(`drag-over`)),dt=null}),n.addEventListener(`dragover`,e=>{e.preventDefault(),e.dataTransfer.dropEffect=`move`,t.querySelectorAll(`.link-item`).forEach(e=>e.classList.remove(`drag-over`)),n.classList.add(`drag-over`)}),n.addEventListener(`dragleave`,()=>{n.classList.remove(`drag-over`)}),n.addEventListener(`drop`,async t=>{t.preventDefault();let r=parseInt(n.dataset.index);if(dt===null||dt===r)return;let[i]=V.splice(dt,1);V.splice(r,0,i),V.forEach((e,t)=>{e.order_index=(t+1)*100}),Y(),Q();try{await Promise.all(V.map(t=>e.from(`link_items`).update({order_index:t.order_index}).eq(`id`,t.id)))}catch(e){console.error(`Failed to save order:`,e)}})})}function pt(){let e=document.querySelector(`input[name="bg-type"]:checked`)?.value||`solid`,t=document.querySelector(`input[name="border-type"]:checked`)?.value||`solid`,n=document.querySelector(`input[name="border-style"]:checked`)?.value||`fill`,r=document.getElementById(`theme-border-enabled`)?.checked||!1,i=document.getElementById(`theme-presentation-text`)?.value||`#1A2F5B`,a=document.getElementById(`theme-btn-bg`)?.value||`#1A2F5B`,o=document.getElementById(`theme-border-gradient`)?.value||``;return{backgroundType:e,backgroundColor:document.getElementById(`theme-bg-color`)?.value||`#ffffff`,gradientText:document.getElementById(`theme-gradient`)?.value||``,backgroundImage:e===`image`&&(z._pendingBgImage||(z.theme||{}).backgroundImage)||``,backgroundImageX:parseInt(document.getElementById(`bg-pos-x`)?.value)||50,backgroundImageY:parseInt(document.getElementById(`bg-pos-y`)?.value)||50,backgroundImageScale:parseInt(document.getElementById(`bg-pos-scale`)?.value)||100,profileTextColor:i,presentationTextColor:i,textColor:i,presentationColor:i,profileColor:i,buttonBackgroundColor:a,buttonBgColor:a,buttonTextColor:document.getElementById(`theme-btn-text`)?.value||`#000000`,buttonStyle:document.getElementById(`theme-button-style`)?.value||`soft`,buttonBorderRadius:`8px`,borderEnabled:r,gradientBorderEnabled:r,borderType:t,borderStyle:n,borderColor:document.getElementById(`theme-border-color`)?.value||`#1A2F5B`,borderGradient:o,borderGradientText:o}}async function mt(){let t=document.getElementById(`saved-themes-list`);if(t)try{let{data:n,error:r}=await e.from(`user_themes`).select(`*`).eq(`user_id`,R.id).eq(`theme_type`,`appearance`).order(`created_at`,{ascending:!1});if(r)throw r;if(!n||n.length===0){t.innerHTML=`<p style="color:#9ca3af; font-size:0.875rem;">No saved themes yet.</p>`;return}t.innerHTML=n.map(e=>`
      <div class="saved-theme-item" style="display:flex; justify-content:space-between; align-items:center; padding:8px 12px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; margin-bottom:8px;">
        <span style="font-size:0.875rem; font-weight:500; color:#1e293b;">${$(e.name||e.theme_name||`Unnamed`)}</span>
        <div style="display:flex; gap:4px;">
          <button type="button" class="apply-theme-btn" data-theme-id="${e.id}" style="background:#1A2F5B; color:white; border:none; padding:4px 10px; border-radius:4px; font-size:0.75rem; cursor:pointer;">Apply</button>
          <button type="button" class="delete-theme-btn" data-theme-id="${e.id}" style="background:none; color:#ef4444; border:1px solid #ef4444; padding:4px 8px; border-radius:4px; font-size:0.75rem; cursor:pointer;"><i class="fas fa-trash"></i></button>
        </div>
      </div>
    `).join(``),t.querySelectorAll(`.apply-theme-btn`).forEach(e=>{e.addEventListener(`click`,async()=>{let t=n.find(t=>t.id===e.dataset.themeId);t&&t.theme_data&&(z.theme={...z.theme,...t.theme_data},Q(),Ke(document.getElementById(`tab-content`)))})}),t.querySelectorAll(`.delete-theme-btn`).forEach(t=>{t.addEventListener(`click`,async()=>{let r=n.find(e=>e.id===t.dataset.themeId);if(r&&confirm(`Delete theme "${r.name||r.theme_name}"?`))try{let{error:t}=await e.from(`user_themes`).delete().eq(`id`,r.id).eq(`user_id`,R.id);if(t)throw t;mt()}catch(e){console.error(`Failed to delete theme:`,e),o(`Failed to delete: `+e.message,`error`)}})})}catch(e){console.error(`Failed to load themes:`,e),t.innerHTML=`<p style="color:#ef4444; font-size:0.875rem;">Failed to load themes.</p>`}}async function ht(){let t=document.getElementById(`theme-name`),n=t?.value.trim();if(!n)o(`Please enter a theme name.`,`warning`);else try{let r=pt(),{error:i}=await e.from(`user_themes`).insert({user_id:R.id,name:n,theme_type:`appearance`,theme_data:r});if(i)throw i;t&&(t.value=``),mt(),Oe(`save-new-theme-btn`)}catch(e){console.error(`Failed to save theme:`,e),o(`Failed to save theme: `+e.message,`error`)}}function gt(){document.querySelectorAll(`.tab`).forEach(e=>{e.addEventListener(`click`,async()=>{await c(),document.querySelectorAll(`.tab`).forEach(e=>e.classList.remove(`active`)),e.classList.add(`active`),U=e.dataset.tab,X()})}),document.getElementById(`add-link-btn`)?.addEventListener(`click`,et),document.getElementById(`add-existing-btn`)?.addEventListener(`click`,it),document.getElementById(`new-link-modal-close`)?.addEventListener(`click`,tt),document.getElementById(`new-link-cancel`)?.addEventListener(`click`,tt),document.getElementById(`new-link-save`)?.addEventListener(`click`,nt),document.getElementById(`new-link-modal`)?.addEventListener(`click`,e=>{e.target.id===`new-link-modal`&&tt()}),document.getElementById(`new-link-upload-btn`)?.addEventListener(`click`,()=>{document.getElementById(`new-link-image-file`)?.click()}),document.getElementById(`new-link-image-file`)?.addEventListener(`change`,async e=>{let t=e.target.files?.[0];if(!t)return;let n=document.getElementById(`new-link-upload-btn`),r=n?.innerHTML;try{n&&(n.disabled=!0,n.innerHTML=`<i class="fas fa-spinner fa-spin"></i>`);let e=await x(t,`links`,R.id,{maxWidth:1200,maxHeight:1200,quality:.75});document.getElementById(`new-link-image`).value=e}catch(e){console.error(`Upload failed:`,e),o(`Upload failed: `+e.message,`error`)}finally{n&&(n.disabled=!1,n.innerHTML=r)}}),document.getElementById(`new-link-browse-btn`)?.addEventListener(`click`,()=>{lt(e=>{document.getElementById(`new-link-image`).value=e})}),document.getElementById(`existing-link-modal-close`)?.addEventListener(`click`,st),document.getElementById(`existing-link-modal`)?.addEventListener(`click`,e=>{e.target.id===`existing-link-modal`&&st()}),document.getElementById(`existing-link-search`)?.addEventListener(`input`,e=>{at(e.target.value)}),document.getElementById(`media-library-close`)?.addEventListener(`click`,ut),document.getElementById(`media-library-modal`)?.addEventListener(`click`,e=>{e.target.id===`media-library-modal`&&ut()}),document.addEventListener(`keydown`,e=>{e.key===`Escape`&&(tt(),st(),ut())})}function $(e){let t=document.createElement(`div`);return t.textContent=e,t.innerHTML}function _t(e){try{let t=new URL(e),n=t.pathname.length>30?t.pathname.substring(0,30)+`...`:t.pathname;return t.hostname+n}catch{return e.length>50?e.substring(0,50)+`...`:e}}function vt(e,t){e&&t&&e.querySelectorAll(`.tag-remove`).forEach(n=>{n.addEventListener(`click`,r=>{r.stopPropagation();let i=n.dataset.tag;t.tags=(t.tags||[]).filter(e=>e!==i),e.innerHTML=S(t.tags,{removable:!0}),vt(e,t),q.trigger()})})}function yt(e){e&&e.querySelectorAll(`.tag-remove`).forEach(t=>{t.addEventListener(`click`,n=>{n.stopPropagation();let r=t.dataset.tag,i=z.presentation_data||{};i.tags=(i.tags||[]).filter(e=>e!==r),z.presentation_data=i,G.trigger(),e.innerHTML=S(i.tags,{removable:!0}),yt(e)})})}function bt(){if(window.innerWidth>768)return;let e=document.createElement(`div`);e.className=`mobile-tab-bar`,e.innerHTML=`
    <button class="mobile-tab-btn ${U===`details`?`active`:``}" data-tab="details">
      <i class="fas fa-file-alt"></i><span>Details</span>
    </button>
    <button class="mobile-tab-btn ${U===`appearance`?`active`:``}" data-tab="appearance">
      <i class="fas fa-palette"></i><span>Theme</span>
    </button>
    <button class="mobile-tab-btn" data-tab="qr-code">
      <i class="fas fa-qrcode"></i><span>QR</span>
    </button>
    <button class="mobile-tab-btn" data-tab="analytics">
      <i class="fas fa-chart-bar"></i><span>Analytics</span>
    </button>
  `,document.body.appendChild(e),e.querySelectorAll(`.mobile-tab-btn`).forEach(t=>{t.addEventListener(`click`,async()=>{await c(),e.querySelectorAll(`.mobile-tab-btn`).forEach(e=>e.classList.remove(`active`)),t.classList.add(`active`),U=t.dataset.tab,X()})});let t=document.createElement(`button`);t.className=`preview-fab`,t.innerHTML=`<i class="fas fa-eye"></i>`,t.title=`Preview`,document.body.appendChild(t),t.addEventListener(`click`,()=>{let e=document.createElement(`div`);e.className=`preview-overlay`,e.innerHTML=`
      <button class="preview-overlay-close"><i class="fas fa-times"></i></button>
      <div class="editor-preview-mockup" id="mobile-preview-mockup"></div>
    `,document.body.appendChild(e);let t=document.getElementById(`mobile-preview-mockup`),n=document.getElementById(`phone-preview`);n&&t&&(t.innerHTML=n.innerHTML,t.style.cssText=n.style.cssText),e.querySelector(`.preview-overlay-close`).addEventListener(`click`,()=>e.remove()),e.addEventListener(`click`,t=>{t.target===e&&e.remove()})})}je();
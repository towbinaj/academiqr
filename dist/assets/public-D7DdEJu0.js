import{t as e}from"./supabase-C_OAid-5.js";import{i as t,n,o as r,r as i,t as a}from"./link-utils-CXsRhE1K.js";var o=document.getElementById(`public-root`);function s(e){let t=document.createElement(`div`);return t.textContent=e,t.innerHTML}function c(e){try{return new Date(e+`T00:00:00`).toLocaleDateString(`en-US`,{month:`long`,day:`numeric`,year:`numeric`})}catch{return e}}function l(e,t){let n=e.presentation_data||{},r=n.title||`AcademiQR Collection`,i=t?.display_name||``,a=n.conference||``,o=[];i&&o.push(i),a&&o.push(a);let s=o.length>0?`${r} — ${o.join(` • `)}`:r,c=t?.profile_photo||`https://natzpfyxpuycsuuzbqrd.supabase.co/storage/v1/object/public/assets/AcademiQR_logo_blue.png`;document.title=`${r} | AcademiQR`;let l={"og:title":r,"og:description":s,"og:image":c,"og:type":`website`,"og:url":window.location.href,"twitter:card":`summary`,"twitter:title":r,"twitter:description":s,"twitter:image":c};for(let[e,t]of Object.entries(l)){let n=e.startsWith(`twitter:`)?`name`:`property`,r=document.querySelector(`meta[${n}="${e}"]`);r||(r=document.createElement(`meta`),r.setAttribute(n,e),document.head.appendChild(r)),r.setAttribute(`content`,t)}let u=document.querySelector(`meta[name="description"]`);u||(u=document.createElement(`meta`),u.setAttribute(`name`,`description`),document.head.appendChild(u)),u.setAttribute(`content`,s)}function u(e=50,t=50,n=100){return`object-fit: ${n<100?`contain`:`cover`}; object-position: ${e}% ${t}%; transform: scale(${n/100}); transform-origin: ${e}% ${t}%;`}function d(e){let t={backgroundType:`solid`,backgroundColor:`#ffffff`,gradientText:``,backgroundImage:``,backgroundImageX:50,backgroundImageY:50,backgroundImageScale:100,profileTextColor:`#1A2F5B`,presentationTextColor:`#1A2F5B`,buttonTextColor:`#000000`,buttonBackgroundColor:`#1A2F5B`,buttonStyle:`soft`,buttonBorderRadius:`8px`,borderEnabled:!0,borderType:`gradient`,borderStyle:`thin`,borderColor:`#1A2F5B`,borderGradient:`linear-gradient(186deg, #D54070 0%, #8F4469 20%, #CA5699 40%, #59B8DA 60%, #9AD0DD 80%, #73B44A 100%)`};if(!e)return{...t};if(typeof e==`string`)try{e=JSON.parse(e)}catch{return{...t}}let n=e.borderEnabled===void 0?e.gradientBorderEnabled===void 0||!!e.gradientBorderEnabled:!!e.borderEnabled;return{backgroundType:e.backgroundType||`solid`,backgroundColor:e.backgroundColor||`#ffffff`,gradientText:e.gradientText||``,backgroundImage:e.backgroundImage||``,backgroundImageX:e.backgroundImageX??e.imagePositionX??50,backgroundImageY:e.backgroundImageY??e.imagePositionY??50,backgroundImageScale:e.backgroundImageScale??e.imageScale??100,profileTextColor:[e.textColor,e.presentationTextColor,e.profileTextColor,e.presentationColor,e.profileColor].find(e=>typeof e==`string`&&e.length>0)||`#1A2F5B`,presentationTextColor:[e.textColor,e.presentationTextColor,e.profileTextColor,e.presentationColor,e.profileColor].find(e=>typeof e==`string`&&e.length>0)||`#1A2F5B`,buttonTextColor:e.buttonTextColor||`#000000`,buttonBackgroundColor:e.buttonBackgroundColor||e.buttonBgColor||`#1A2F5B`,buttonStyle:e.buttonStyle||`soft`,buttonBorderRadius:e.buttonBorderRadius||e.borderRadius||`8px`,borderEnabled:n,borderType:e.borderType||`solid`,borderStyle:e.borderStyle===`fill`||e.borderStyle===`thin`?e.borderStyle:`fill`,borderColor:e.borderColor||`#1A2F5B`,borderGradient:e.borderGradient||e.borderGradientText||``}}function f(e,t){o.innerHTML=`
    <div class="error-state">
      <i class="fas fa-exclamation-circle"></i>
      <h2>${s(e)}</h2>
      <p>${s(t)}</p>
    </div>
  `}async function p(t){let{data:n,error:r}=await e.from(`link_lists`).select(`id, owner_id, slug, visibility, passkey_hash, theme, presentation_data, qr_code_data`).eq(`id`,t).single();if(r)throw r;return n}async function m(t){let{data:n,error:i}=await e.from(`link_items`).select(`id, url, title, image_url, image_position, image_scale, order_index, is_active, source_link_id, use_library_defaults, custom_overrides`).eq(`list_id`,t).order(`order_index`,{ascending:!0});if(i)throw i;let a=(n||[]).filter(e=>e.is_active!==!1);return await r(a),a}async function h(t){let{data:n,error:r}=await e.from(`profiles`).select(`display_name, profile_photo, profile_photo_position, social_order, social_website, social_email, social_instagram, social_facebook, social_twitter, social_linkedin, social_youtube, social_tiktok, social_snapchat, social_google_scholar, social_orcid, social_researchgate`).eq(`id`,t).single();if(r)throw r;return n||{}}var g=crypto.randomUUID();async function _(t){try{let n=navigator.userAgent,r=/Mobile|Android|iPhone|iPad|iPod/i.test(n),i=/iPad|Android(?!.*Mobile)/i.test(n)?`tablet`:r?`mobile`:`desktop`;await e.from(`page_views`).insert({list_id:t.id,owner_id:t.owner_id,user_agent:n.substring(0,500),device_type:i,referrer:document.referrer||null,session_id:g})}catch{}}function v(t,n){e.from(`link_clicks`).insert({link_id:n,list_id:t.id,owner_id:t.owner_id,user_agent:navigator.userAgent.substring(0,500),session_id:g}).then(()=>{}).catch(()=>{})}function y(t,n){e.from(`link_clicks`).insert({list_id:t.id,owner_id:t.owner_id,user_agent:navigator.userAgent.substring(0,500),social_platform:n,session_id:g}).then(()=>{}).catch(()=>{})}function b(e){let{buttonStyle:t,buttonBackgroundColor:n,buttonTextColor:r}=e,i=`color: ${r}; border-radius: 8px; font-size: 1rem;`;return i+=t===`solid`?`background: ${n}; border-color: ${n};`:t===`outline`?`background: transparent; border: 2px solid ${r}; color: ${r};`:`color: ${r};`,i}function x(e,r,l){let f=d(e.theme),p=e.presentation_data||{},m=l||{};document.title=p.title?`${p.title} — AcademiQR`:`AcademiQR`;let h=``;h=f.backgroundType===`gradient`&&f.gradientText?`background: ${f.gradientText};`:f.backgroundType===`image`&&f.backgroundImage?`background: url('${f.backgroundImage}') ${f.backgroundImageX}% ${f.backgroundImageY}% / ${f.backgroundImageScale}% no-repeat;`:`background: ${f.backgroundColor};`;let g=`background: #1e293b;`;f.borderEnabled&&(g=f.borderType===`gradient`&&f.borderGradient?`background: ${f.borderGradient};`:f.borderStyle===`thin`?`background: #1e293b; box-shadow: inset 0 0 0 8px ${f.borderColor};`:`background: ${f.borderColor};`);let _=m.profile_photo||``,x={scale:100,x:50,y:50};if(m.profile_photo_position)try{x=typeof m.profile_photo_position==`string`?JSON.parse(m.profile_photo_position):m.profile_photo_position}catch{}let S=(x.scale||100)/100,C=((x.x||50)-50)*-1,w=((x.y||50)-50)*-1,T=[{key:`social_email`,icon:`fa-envelope`,prefix:`mailto:`,fab:!1},{key:`social_website`,icon:`fa-globe`,prefix:``,fab:!1},{key:`social_instagram`,icon:`fa-instagram`,prefix:``,fab:!0},{key:`social_facebook`,icon:`fa-facebook`,prefix:``,fab:!0},{key:`social_twitter`,icon:`fa-x-twitter`,prefix:``,fab:!0},{key:`social_linkedin`,icon:`fa-linkedin`,prefix:``,fab:!0},{key:`social_youtube`,icon:`fa-youtube`,prefix:``,fab:!0},{key:`social_tiktok`,icon:`fa-tiktok`,prefix:``,fab:!0},{key:`social_snapchat`,icon:`fa-snapchat`,prefix:``,fab:!0},{key:`social_google_scholar`,icon:`fa-graduation-cap`,prefix:``,fab:!1},{key:`social_orcid`,icon:`fa-orcid`,prefix:``,fab:!0},{key:`social_researchgate`,icon:`fa-researchgate`,prefix:``,fab:!0}],E=m.social_order,D;if(E&&Array.isArray(E)){let e=[];for(let t of E){let n=T.find(e=>e.key===`social_${t}`);n&&e.push(n)}for(let t of T)e.includes(t)||e.push(t);D=e.filter(e=>m[e.key]?.trim())}else D=T.filter(e=>m[e.key]?.trim());let O=p.title||``,k=p.displayTitle!==!1,A=p.displayConference!==!1,j=p.conference||``,M=p.location||``,N=p.date?c(p.date):``,P=k&&O||A&&j||M||N,F=f.profileTextColor,I=f.presentationTextColor;o.innerHTML=`
    <div class="public-wrapper">
      <div class="public-frame" style="${g}">
        <div class="public-screen" style="${h}">

          <!-- Header -->
          <div class="public-header">
            <div class="public-profile">
              ${_?`
                <div class="public-avatar">
                  <img src="${s(_)}" alt="Profile"
                       style="transform: translate(${C}%, ${w}%) scale(${S}); transform-origin: center center;"
                       onerror="this.parentElement.style.display='none'">
                </div>
              `:``}
              <div class="public-name-section">
                ${m.display_name?`<h1 class="public-display-name" style="color: ${F};">${s(m.display_name)}</h1>`:``}
                ${D.length>0?`
                  <div class="public-socials">
                    ${D.map(e=>`<a href="${s(e.prefix+(m[e.key]||``))}" target="_blank" rel="noopener noreferrer"
                                 class="public-social-icon ${e.key}" title="${e.key.replace(`social_`,``)}">
                                <i class="${e.fab?`fab`:`fas`} ${e.icon}"></i>
                              </a>`).join(``)}
                  </div>
                `:``}
              </div>
            </div>

            ${P?`
              <div class="public-presentation" style="color: ${I};">
                ${k&&O?`<div class="public-info-field"><span class="public-info-value">${s(O)}</span></div>`:``}
                ${A&&j?`<div class="public-info-field"><span class="public-info-value">${s(j)}</span></div>`:``}
                ${M?`<div class="public-info-field"><span class="public-info-value" style="font-size:0.9rem;">${s(M)}</span></div>`:``}
                ${N?`<div class="public-info-field"><span class="public-info-value" style="font-size:0.9rem;">${s(N)}</span></div>`:``}
              </div>
            `:``}
          </div>

          <!-- Links -->
          <div class="public-links">
            ${r.length===0?`
              <p style="text-align:center; color:${I}; opacity:0.6; padding:24px;">No links available</p>
            `:r.map(e=>{let r=a(e),o=n(e),c=u(r.x,r.y,o),l=i(e),d=t(e)||`Untitled`;return`
                <a href="${s(e.url||`#`)}" target="_blank" rel="noopener noreferrer"
                   class="public-link-btn ${f.buttonStyle}" style="${b(f)}" data-link-id="${e.id}">
                  ${l?`
                    <div class="public-link-image-wrapper">
                      <div class="public-link-image">
                        <img src="${s(l)}" alt=""
                             style="${c}"
                             onerror="this.parentElement.innerHTML='<i class=\\'fas fa-link\\' style=\\'color:#6b7280\\'></i>'">
                      </div>
                    </div>
                  `:``}
                  <div class="public-link-text">${s(d)}</div>
                </a>
              `}).join(``)}
          </div>

          <!-- Footer -->
          <div class="public-footer" style="color: ${F};">
            <p class="public-footer-text">Powered by <a href="https://academiqr.com" style="color: ${F};">AcademiQR.com</a></p>
          </div>
        </div>
      </div>
    </div>
  `,o.querySelectorAll(`.public-link-btn`).forEach(t=>{t.addEventListener(`click`,()=>{let n=t.dataset.linkId;n&&v(e,n)})}),o.querySelectorAll(`.public-social-icon`).forEach(t=>{t.addEventListener(`click`,()=>{let n=t.className.split(` `).find(e=>e.startsWith(`social_`));y(e,n?n.replace(`social_`,``):`unknown`)})})}function S(e,t){o.innerHTML=`
    <div class="passkey-modal">
      <i class="fas fa-lock" style="font-size:2rem; color:#1A2F5B; margin-bottom:12px;"></i>
      <h2>This collection is protected</h2>
      <p>Enter the passkey to view this content.</p>
      <input type="password" id="passkey-input" placeholder="Enter passkey" autofocus>
      <button id="passkey-submit">Submit</button>
      <p id="passkey-error" style="color:#ef4444; font-size:0.75rem; margin-top:8px; display:none;">Incorrect passkey. Try again.</p>
    </div>
  `;let n=()=>{(document.getElementById(`passkey-input`)?.value||``)===e.passkey_hash?t():document.getElementById(`passkey-error`).style.display=`block`};document.getElementById(`passkey-submit`)?.addEventListener(`click`,n),document.getElementById(`passkey-input`)?.addEventListener(`keydown`,e=>{e.key===`Enter`&&n()})}async function C(){let t=new URLSearchParams(window.location.search).get(`collection`);if(t)return t;let n=window.location.pathname.match(/^\/u\/([^/]+)\/([^/]+)\/?$/);if(n){let[t,r]=n.slice(1).map(e=>{try{return decodeURIComponent(e)}catch{return e}}),{data:i}=await e.from(`profiles`).select(`id`).eq(`username`,t).single();if(!i)return null;let{data:a}=await e.from(`link_lists`).select(`id`).eq(`owner_id`,i.id).eq(`slug`,r).single();return a?.id||null}return null}async function w(){let e=await C();if(!e)f(`Missing Collection`,`No collection ID provided in the URL.`);else try{let t=await p(e);if(!t){f(`Not Found`,`This collection does not exist or has been removed.`);return}if(t.visibility===`private`){f(`Private Collection`,`This collection is private and cannot be viewed.`);return}let[n,r]=await Promise.all([m(e),h(t.owner_id)]);l(t,r),t.passkey_hash?S(t,()=>{x(t,n,r),_(t)}):(x(t,n,r),_(t))}catch(e){console.error(`[Public] Failed to load:`,e),f(`Something went wrong`,`Unable to load this collection. Please try again later.`)}}w();
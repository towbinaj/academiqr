import{s as f}from"./supabase-whCCoo43.js";import{r as M,b as U,c as z,g as H,a as N}from"./link-utils-D1VnX3pm.js";const h=document.getElementById("public-root");function d(e){const t=document.createElement("div");return t.textContent=e,t.innerHTML}function j(e){try{return new Date(e+"T00:00:00").toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}catch{return e}}function G(e,t){const i=e.presentation_data||{},o=i.title||"AcademiQR Collection",n=(t==null?void 0:t.display_name)||"",a=i.conference||"",l=[];n&&l.push(n),a&&l.push(a);const c=l.length>0?`${o} — ${l.join(" • ")}`:o,y=(t==null?void 0:t.profile_photo)||"https://natzpfyxpuycsuuzbqrd.supabase.co/storage/v1/object/public/assets/AcademiQR_logo_blue.png";document.title=`${o} | AcademiQR`;const g={"og:title":o,"og:description":c,"og:image":y,"og:type":"website","og:url":window.location.href,"twitter:card":"summary","twitter:title":o,"twitter:description":c,"twitter:image":y};for(const[k,T]of Object.entries(g)){const m=k.startsWith("twitter:")?"name":"property";let p=document.querySelector(`meta[${m}="${k}"]`);p||(p=document.createElement("meta"),p.setAttribute(m,k),document.head.appendChild(p)),p.setAttribute("content",T)}let b=document.querySelector('meta[name="description"]');b||(b=document.createElement("meta"),b.setAttribute("name","description"),document.head.appendChild(b)),b.setAttribute("content",c)}function Q(e=50,t=50,i=100){return`object-position: ${e}% ${t}%; transform: scale(${i/100}); transform-origin: ${e}% ${t}%;`}function X(e){const t={backgroundType:"solid",backgroundColor:"#ffffff",gradientText:"",backgroundImage:"",backgroundImageX:50,backgroundImageY:50,backgroundImageScale:100,profileTextColor:"#1A2F5B",presentationTextColor:"#1A2F5B",buttonTextColor:"#000000",buttonBackgroundColor:"#1A2F5B",buttonStyle:"soft",buttonBorderRadius:"8px",borderEnabled:!0,borderType:"gradient",borderStyle:"thin",borderColor:"#1A2F5B",borderGradient:"linear-gradient(186deg, #D54070 0%, #8F4469 20%, #CA5699 40%, #59B8DA 60%, #9AD0DD 80%, #73B44A 100%)"};if(!e)return{...t};if(typeof e=="string")try{e=JSON.parse(e)}catch{return{...t}}const i=e.borderEnabled!==void 0?!!e.borderEnabled:e.gradientBorderEnabled!==void 0?!!e.gradientBorderEnabled:!0;return{backgroundType:e.backgroundType||"solid",backgroundColor:e.backgroundColor||"#ffffff",gradientText:e.gradientText||"",backgroundImage:e.backgroundImage||"",backgroundImageX:e.backgroundImageX??e.imagePositionX??50,backgroundImageY:e.backgroundImageY??e.imagePositionY??50,backgroundImageScale:e.backgroundImageScale??e.imageScale??100,profileTextColor:[e.textColor,e.presentationTextColor,e.profileTextColor,e.presentationColor,e.profileColor].find(o=>typeof o=="string"&&o.length>0)||"#1A2F5B",presentationTextColor:[e.textColor,e.presentationTextColor,e.profileTextColor,e.presentationColor,e.profileColor].find(o=>typeof o=="string"&&o.length>0)||"#1A2F5B",buttonTextColor:e.buttonTextColor||"#000000",buttonBackgroundColor:e.buttonBackgroundColor||e.buttonBgColor||"#1A2F5B",buttonStyle:e.buttonStyle||"soft",buttonBorderRadius:e.buttonBorderRadius||e.borderRadius||"8px",borderEnabled:i,borderType:e.borderType||"solid",borderStyle:e.borderStyle==="fill"||e.borderStyle==="thin"?e.borderStyle:"fill",borderColor:e.borderColor||"#1A2F5B",borderGradient:e.borderGradient||e.borderGradientText||""}}function x(e,t){h.innerHTML=`
    <div class="error-state">
      <i class="fas fa-exclamation-circle"></i>
      <h2>${d(e)}</h2>
      <p>${d(t)}</p>
    </div>
  `}async function Y(e){const{data:t,error:i}=await f.from("link_lists").select("id, owner_id, slug, visibility, passkey_hash, theme, presentation_data, qr_code_data").eq("id",e).single();if(i)throw i;return t}async function O(e){const{data:t,error:i}=await f.from("link_items").select("id, url, title, image_url, image_position, image_scale, order_index, is_active, source_link_id, use_library_defaults, custom_overrides").eq("list_id",e).order("order_index",{ascending:!0});if(i)throw i;const o=(t||[]).filter(n=>n.is_active!==!1);return await M(o),o}async function J(e){const{data:t,error:i}=await f.from("profiles").select("display_name, profile_photo, profile_photo_position, social_order, social_website, social_email, social_instagram, social_facebook, social_twitter, social_linkedin, social_youtube, social_tiktok, social_snapchat, social_google_scholar, social_orcid, social_researchgate").eq("id",e).single();if(i)throw i;return t||{}}const B=crypto.randomUUID();async function D(e){try{const t=navigator.userAgent,i=/Mobile|Android|iPhone|iPad|iPod/i.test(t),n=/iPad|Android(?!.*Mobile)/i.test(t)?"tablet":i?"mobile":"desktop";await f.from("page_views").insert({list_id:e.id,owner_id:e.owner_id,user_agent:t.substring(0,500),device_type:n,referrer:document.referrer||null,session_id:B})}catch{}}function V(e,t){f.from("link_clicks").insert({link_id:t,list_id:e.id,owner_id:e.owner_id,user_agent:navigator.userAgent.substring(0,500),session_id:B}).then(()=>{}).catch(()=>{})}function W(e,t){f.from("link_clicks").insert({list_id:e.id,owner_id:e.owner_id,user_agent:navigator.userAgent.substring(0,500),social_platform:t,session_id:B}).then(()=>{}).catch(()=>{})}function K(e){const{buttonStyle:t,buttonBackgroundColor:i,buttonTextColor:o}=e;let n=`color: ${o}; border-radius: 8px; font-size: 1rem;`;return t==="solid"?n+=`background: ${i}; border-color: ${i};`:t==="outline"?n+=`background: transparent; border: 2px solid ${o}; color: ${o};`:n+=`color: ${o};`,n}function F(e,t,i){const o=X(e.theme),n=e.presentation_data||{},a=i||{};document.title=n.title?`${n.title} — AcademiQR`:"AcademiQR";let l="";o.backgroundType==="gradient"&&o.gradientText?l=`background: ${o.gradientText};`:o.backgroundType==="image"&&o.backgroundImage?l=`background: url('${o.backgroundImage}') ${o.backgroundImageX}% ${o.backgroundImageY}% / ${o.backgroundImageScale}% no-repeat;`:l=`background: ${o.backgroundColor};`;let c="background: #1e293b;";o.borderEnabled&&(o.borderType==="gradient"&&o.borderGradient?c=`background: ${o.borderGradient};`:o.borderStyle==="thin"?c=`background: #1e293b; box-shadow: inset 0 0 0 8px ${o.borderColor};`:c=`background: ${o.borderColor};`);const y=a.profile_photo||"";let g={scale:100,x:50,y:50};if(a.profile_photo_position)try{g=typeof a.profile_photo_position=="string"?JSON.parse(a.profile_photo_position):a.profile_photo_position}catch{}const b=(g.scale||100)/100,k=((g.x||50)-50)*-1,T=((g.y||50)-50)*-1,m=[{key:"social_email",icon:"fa-envelope",prefix:"mailto:",fab:!1},{key:"social_website",icon:"fa-globe",prefix:"",fab:!1},{key:"social_instagram",icon:"fa-instagram",prefix:"",fab:!0},{key:"social_facebook",icon:"fa-facebook",prefix:"",fab:!0},{key:"social_twitter",icon:"fa-x-twitter",prefix:"",fab:!0},{key:"social_linkedin",icon:"fa-linkedin",prefix:"",fab:!0},{key:"social_youtube",icon:"fa-youtube",prefix:"",fab:!0},{key:"social_tiktok",icon:"fa-tiktok",prefix:"",fab:!0},{key:"social_snapchat",icon:"fa-snapchat",prefix:"",fab:!0},{key:"social_google_scholar",icon:"fa-graduation-cap",prefix:"",fab:!1},{key:"social_orcid",icon:"fa-orcid",prefix:"",fab:!0},{key:"social_researchgate",icon:"fa-researchgate",prefix:"",fab:!0}],p=a.social_order;let v;if(p&&Array.isArray(p)){const r=[];for(const s of p){const u=m.find(_=>_.key===`social_${s}`);u&&r.push(u)}for(const s of m)r.includes(s)||r.push(s);v=r.filter(s=>{var u;return(u=a[s.key])==null?void 0:u.trim()})}else v=m.filter(r=>{var s;return(s=a[r.key])==null?void 0:s.trim()});const C=n.title||"",P=n.displayTitle!==!1,w=n.displayConference!==!1,I=n.conference||"",S=n.location||"",A=n.date?j(n.date):"",q=P&&C||w&&I||S||A,E=o.profileTextColor,L=o.presentationTextColor;h.innerHTML=`
    <div class="public-wrapper">
      <div class="public-frame" style="${c}">
        <div class="public-screen" style="${l}">

          <!-- Header -->
          <div class="public-header">
            <div class="public-profile">
              ${y?`
                <div class="public-avatar">
                  <img src="${d(y)}" alt="Profile"
                       style="transform: translate(${k}%, ${T}%) scale(${b}); transform-origin: center center;"
                       onerror="this.parentElement.style.display='none'">
                </div>
              `:""}
              <div class="public-name-section">
                ${a.display_name?`<h1 class="public-display-name" style="color: ${E};">${d(a.display_name)}</h1>`:""}
                ${v.length>0?`
                  <div class="public-socials">
                    ${v.map(r=>{const s=r.prefix+(a[r.key]||"");return`<a href="${d(s)}" target="_blank" rel="noopener noreferrer"
                                 class="public-social-icon ${r.key}" title="${r.key.replace("social_","")}">
                                <i class="${r.fab?"fab":"fas"} ${r.icon}"></i>
                              </a>`}).join("")}
                  </div>
                `:""}
              </div>
            </div>

            ${q?`
              <div class="public-presentation" style="color: ${L};">
                ${P&&C?`<div class="public-info-field"><span class="public-info-value">${d(C)}</span></div>`:""}
                ${w&&I?`<div class="public-info-field"><span class="public-info-value">${d(I)}</span></div>`:""}
                ${S?`<div class="public-info-field"><span class="public-info-value" style="font-size:0.9rem;">${d(S)}</span></div>`:""}
                ${A?`<div class="public-info-field"><span class="public-info-value" style="font-size:0.9rem;">${d(A)}</span></div>`:""}
              </div>
            `:""}
          </div>

          <!-- Links -->
          <div class="public-links">
            ${t.length===0?`
              <p style="text-align:center; color:${L}; opacity:0.6; padding:24px;">No links available</p>
            `:t.map(r=>{const s=U(r),u=z(r),_=Q(s.x,s.y,u),$=H(r),R=N(r)||"Untitled";return`
                <a href="${d(r.url||"#")}" target="_blank" rel="noopener noreferrer"
                   class="public-link-btn ${o.buttonStyle}" style="${K(o)}" data-link-id="${r.id}">
                  ${$?`
                    <div class="public-link-image-wrapper">
                      <div class="public-link-image">
                        <img src="${d($)}" alt=""
                             style="${_}"
                             onerror="this.parentElement.innerHTML='<i class=\\'fas fa-link\\' style=\\'color:#6b7280\\'></i>'">
                      </div>
                    </div>
                  `:""}
                  <div class="public-link-text">${d(R)}</div>
                </a>
              `}).join("")}
          </div>

          <!-- Footer -->
          <div class="public-footer" style="color: ${E};">
            <p class="public-footer-text">Powered by <a href="https://academiqr.com" style="color: ${E};">AcademiQR.com</a></p>
          </div>
        </div>
      </div>
    </div>
  `,h.querySelectorAll(".public-link-btn").forEach(r=>{r.addEventListener("click",()=>{const s=r.dataset.linkId;s&&V(e,s)})}),h.querySelectorAll(".public-social-icon").forEach(r=>{r.addEventListener("click",()=>{const u=r.className.split(" ").find($=>$.startsWith("social_")),_=u?u.replace("social_",""):"unknown";W(e,_)})})}function Z(e,t){var o,n;h.innerHTML=`
    <div class="passkey-modal">
      <i class="fas fa-lock" style="font-size:2rem; color:#1A2F5B; margin-bottom:12px;"></i>
      <h2>This collection is protected</h2>
      <p>Enter the passkey to view this content.</p>
      <input type="password" id="passkey-input" placeholder="Enter passkey" autofocus>
      <button id="passkey-submit">Submit</button>
      <p id="passkey-error" style="color:#ef4444; font-size:0.75rem; margin-top:8px; display:none;">Incorrect passkey. Try again.</p>
    </div>
  `;const i=()=>{var l;(((l=document.getElementById("passkey-input"))==null?void 0:l.value)||"")===e.passkey_hash?t():document.getElementById("passkey-error").style.display="block"};(o=document.getElementById("passkey-submit"))==null||o.addEventListener("click",i),(n=document.getElementById("passkey-input"))==null||n.addEventListener("keydown",a=>{a.key==="Enter"&&i()})}async function ee(){const t=new URLSearchParams(window.location.search).get("collection");if(t)return t;const o=window.location.pathname.match(/^\/u\/([^/]+)\/([^/]+)\/?$/);if(o){const[,n,a]=o,{data:l}=await f.from("profiles").select("id").eq("username",n).single();if(!l)return null;const{data:c}=await f.from("link_lists").select("id").eq("owner_id",l.id).eq("slug",a).single();return(c==null?void 0:c.id)||null}return null}async function te(){const e=await ee();if(!e){x("Missing Collection","No collection ID provided in the URL.");return}try{const t=await Y(e);if(!t){x("Not Found","This collection does not exist or has been removed.");return}if(t.visibility==="private"){x("Private Collection","This collection is private and cannot be viewed.");return}const[i,o]=await Promise.all([O(e),J(t.owner_id)]);G(t,o),t.passkey_hash?Z(t,()=>{F(t,i,o),D(t)}):(F(t,i,o),D(t))}catch(t){console.error("[Public] Failed to load:",t),x("Something went wrong","Unable to load this collection. Please try again later.")}}te();

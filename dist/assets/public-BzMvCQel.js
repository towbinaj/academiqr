import{s as p}from"./supabase-whCCoo43.js";import{r as q,b as R,c as M,g as U,a as z}from"./link-utils-D1VnX3pm.js";const k=document.getElementById("public-root");function c(e){const t=document.createElement("div");return t.textContent=e,t.innerHTML}function H(e){try{return new Date(e+"T00:00:00").toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}catch{return e}}function N(e,t){const i=e.presentation_data||{},o=i.title||"AcademiQR Collection",n=(t==null?void 0:t.display_name)||"",a=i.conference||"",s=[];n&&s.push(n),a&&s.push(a);const l=s.length>0?`${o} — ${s.join(" • ")}`:o,g=(t==null?void 0:t.profile_photo)||"https://natzpfyxpuycsuuzbqrd.supabase.co/storage/v1/object/public/assets/AcademiQR_logo_blue.png";document.title=`${o} | AcademiQR`;const b={"og:title":o,"og:description":l,"og:image":g,"og:type":"website","og:url":window.location.href,"twitter:card":"summary","twitter:title":o,"twitter:description":l,"twitter:image":g};for(const[m,$]of Object.entries(b)){const y=m.startsWith("twitter:")?"name":"property";let u=document.querySelector(`meta[${y}="${m}"]`);u||(u=document.createElement("meta"),u.setAttribute(y,m),document.head.appendChild(u)),u.setAttribute("content",$)}let f=document.querySelector('meta[name="description"]');f||(f=document.createElement("meta"),f.setAttribute("name","description"),document.head.appendChild(f)),f.setAttribute("content",l)}function G(e=50,t=50,i=100){return`translate(${(e-50)*.6}%, ${(t-50)*.6}%) scale(${i/100})`}function Q(e){const t={backgroundType:"solid",backgroundColor:"#ffffff",gradientText:"",backgroundImage:"",backgroundImageX:50,backgroundImageY:50,backgroundImageScale:100,profileTextColor:"#1A2F5B",presentationTextColor:"#1A2F5B",buttonTextColor:"#000000",buttonBackgroundColor:"#1A2F5B",buttonStyle:"soft",buttonBorderRadius:"8px",borderEnabled:!0,borderType:"gradient",borderStyle:"thin",borderColor:"#1A2F5B",borderGradient:"linear-gradient(186deg, #D54070 0%, #8F4469 20%, #CA5699 40%, #59B8DA 60%, #9AD0DD 80%, #73B44A 100%)"};if(!e)return{...t};if(typeof e=="string")try{e=JSON.parse(e)}catch{return{...t}}const i=e.borderEnabled!==void 0?!!e.borderEnabled:e.gradientBorderEnabled!==void 0?!!e.gradientBorderEnabled:!0;return{backgroundType:e.backgroundType||"solid",backgroundColor:e.backgroundColor||"#ffffff",gradientText:e.gradientText||"",backgroundImage:e.backgroundImage||"",backgroundImageX:e.backgroundImageX??e.imagePositionX??50,backgroundImageY:e.backgroundImageY??e.imagePositionY??50,backgroundImageScale:e.backgroundImageScale??e.imageScale??100,profileTextColor:[e.textColor,e.presentationTextColor,e.profileTextColor,e.presentationColor,e.profileColor].find(o=>typeof o=="string"&&o.length>0)||"#1A2F5B",presentationTextColor:[e.textColor,e.presentationTextColor,e.profileTextColor,e.presentationColor,e.profileColor].find(o=>typeof o=="string"&&o.length>0)||"#1A2F5B",buttonTextColor:e.buttonTextColor||"#000000",buttonBackgroundColor:e.buttonBackgroundColor||e.buttonBgColor||"#1A2F5B",buttonStyle:e.buttonStyle||"soft",buttonBorderRadius:e.buttonBorderRadius||e.borderRadius||"8px",borderEnabled:i,borderType:e.borderType||"solid",borderStyle:e.borderStyle==="fill"||e.borderStyle==="thin"?e.borderStyle:"fill",borderColor:e.borderColor||"#1A2F5B",borderGradient:e.borderGradient||e.borderGradientText||""}}function v(e,t){k.innerHTML=`
    <div class="error-state">
      <i class="fas fa-exclamation-circle"></i>
      <h2>${c(e)}</h2>
      <p>${c(t)}</p>
    </div>
  `}async function X(e){const{data:t,error:i}=await p.from("link_lists").select("id, owner_id, slug, visibility, passkey_hash, theme, presentation_data, qr_code_data").eq("id",e).single();if(i)throw i;return t}async function Y(e){const{data:t,error:i}=await p.from("link_items").select("id, url, title, image_url, image_position, image_scale, order_index, is_active, source_link_id, use_library_defaults, custom_overrides").eq("list_id",e).order("order_index",{ascending:!0});if(i)throw i;const o=(t||[]).filter(n=>n.is_active!==!1);return await q(o),o}async function j(e){const{data:t,error:i}=await p.from("profiles").select("display_name, profile_photo, profile_photo_position, social_email, social_instagram, social_facebook, social_twitter, social_linkedin, social_youtube, social_tiktok, social_snapchat").eq("id",e).single();if(i)throw i;return t||{}}const A=crypto.randomUUID();async function L(e){try{const t=navigator.userAgent,i=/Mobile|Android|iPhone|iPad|iPod/i.test(t),n=/iPad|Android(?!.*Mobile)/i.test(t)?"tablet":i?"mobile":"desktop";await p.from("page_views").insert({list_id:e.id,owner_id:e.owner_id,user_agent:t.substring(0,500),device_type:n,referrer:document.referrer||null,session_id:A})}catch{}}function O(e,t){p.from("link_clicks").insert({link_id:t,list_id:e.id,owner_id:e.owner_id,user_agent:navigator.userAgent.substring(0,500),session_id:A}).then(()=>{}).catch(()=>{})}function J(e,t){p.from("link_clicks").insert({list_id:e.id,owner_id:e.owner_id,user_agent:navigator.userAgent.substring(0,500),social_platform:t,session_id:A}).then(()=>{}).catch(()=>{})}function V(e){const{buttonStyle:t,buttonBackgroundColor:i,buttonTextColor:o}=e;let n=`color: ${o}; border-radius: 8px; font-size: 1rem;`;return t==="solid"?n+=`background: ${i}; border-color: ${i};`:t==="outline"?n+=`background: transparent; border: 2px solid ${o}; color: ${o};`:n+=`color: ${o};`,n}function w(e,t,i){const o=Q(e.theme),n=e.presentation_data||{},a=i||{};document.title=n.title?`${n.title} — AcademiQR`:"AcademiQR";let s="";o.backgroundType==="gradient"&&o.gradientText?s=`background: ${o.gradientText};`:o.backgroundType==="image"&&o.backgroundImage?s=`background: url('${o.backgroundImage}') ${o.backgroundImageX}% ${o.backgroundImageY}% / ${o.backgroundImageScale}% no-repeat;`:s=`background: ${o.backgroundColor};`;let l="background: #1e293b;";o.borderEnabled&&(o.borderType==="gradient"&&o.borderGradient?l=`background: ${o.borderGradient};`:o.borderStyle==="thin"?l=`background: #1e293b; box-shadow: inset 0 0 0 8px ${o.borderColor};`:l=`background: ${o.borderColor};`);const g=a.profile_photo||"";let b={scale:100,x:50,y:50};if(a.profile_photo_position)try{b=typeof a.profile_photo_position=="string"?JSON.parse(a.profile_photo_position):a.profile_photo_position}catch{}const f=(b.scale||100)/100,m=((b.x||50)-50)*-1,$=((b.y||50)-50)*-1,y=[{key:"social_email",icon:"fa-envelope",prefix:"mailto:",fab:!1},{key:"social_instagram",icon:"fa-instagram",prefix:"",fab:!0},{key:"social_facebook",icon:"fa-facebook",prefix:"",fab:!0},{key:"social_twitter",icon:"fa-x-twitter",prefix:"",fab:!0},{key:"social_linkedin",icon:"fa-linkedin",prefix:"",fab:!0},{key:"social_youtube",icon:"fa-youtube",prefix:"",fab:!0},{key:"social_tiktok",icon:"fa-tiktok",prefix:"",fab:!0},{key:"social_snapchat",icon:"fa-snapchat",prefix:"",fab:!0}].filter(r=>{var d;return(d=a[r.key])==null?void 0:d.trim()}),u=n.title||"",E=n.displayTitle!==!1,B=n.displayConference!==!1,x=n.conference||"",T=n.location||"",C=n.date?H(n.date):"",D=E&&u||B&&x||T||C,I=o.profileTextColor,P=o.presentationTextColor;k.innerHTML=`
    <div class="public-wrapper">
      <div class="public-frame" style="${l}">
        <div class="public-screen" style="${s}">

          <!-- Header -->
          <div class="public-header">
            <div class="public-profile">
              ${g?`
                <div class="public-avatar">
                  <img src="${c(g)}" alt="Profile"
                       style="transform: translate(${m}%, ${$}%) scale(${f}); transform-origin: center center;"
                       onerror="this.parentElement.style.display='none'">
                </div>
              `:""}
              <div class="public-name-section">
                ${a.display_name?`<h1 class="public-display-name" style="color: ${I};">${c(a.display_name)}</h1>`:""}
                ${y.length>0?`
                  <div class="public-socials">
                    ${y.map(r=>{const d=r.prefix+(a[r.key]||"");return`<a href="${c(d)}" target="_blank" rel="noopener noreferrer"
                                 class="public-social-icon ${r.key}" title="${r.key.replace("social_","")}">
                                <i class="${r.fab?"fab":"fas"} ${r.icon}"></i>
                              </a>`}).join("")}
                  </div>
                `:""}
              </div>
            </div>

            ${D?`
              <div class="public-presentation" style="color: ${P};">
                ${E&&u?`<div class="public-info-field"><span class="public-info-value">${c(u)}</span></div>`:""}
                ${B&&x?`<div class="public-info-field"><span class="public-info-value">${c(x)}</span></div>`:""}
                ${T?`<div class="public-info-field"><span class="public-info-value" style="font-size:0.9rem;">${c(T)}</span></div>`:""}
                ${C?`<div class="public-info-field"><span class="public-info-value" style="font-size:0.9rem;">${c(C)}</span></div>`:""}
              </div>
            `:""}
          </div>

          <!-- Links -->
          <div class="public-links">
            ${t.length===0?`
              <p style="text-align:center; color:${P}; opacity:0.6; padding:24px;">No links available</p>
            `:t.map(r=>{const d=R(r),h=M(r),S=G(d.x,d.y,h),_=U(r),F=z(r)||"Untitled";return`
                <a href="${c(r.url||"#")}" target="_blank" rel="noopener noreferrer"
                   class="public-link-btn ${o.buttonStyle}" style="${V(o)}" data-link-id="${r.id}">
                  ${_?`
                    <div class="public-link-image-wrapper">
                      <div class="public-link-image">
                        <img src="${c(_)}" alt=""
                             style="transform: ${S};"
                             onerror="this.parentElement.innerHTML='<i class=\\'fas fa-link\\' style=\\'color:#6b7280\\'></i>'">
                      </div>
                    </div>
                  `:""}
                  <div class="public-link-text">${c(F)}</div>
                </a>
              `}).join("")}
          </div>

          <!-- Footer -->
          <div class="public-footer" style="color: ${I};">
            <p class="public-footer-text">Powered by <a href="https://academiqr.com" style="color: ${I};">AcademiQR.com</a></p>
          </div>
        </div>
      </div>
    </div>
  `,k.querySelectorAll(".public-link-btn").forEach(r=>{r.addEventListener("click",()=>{const d=r.dataset.linkId;d&&O(e,d)})}),k.querySelectorAll(".public-social-icon").forEach(r=>{r.addEventListener("click",()=>{const h=r.className.split(" ").find(_=>_.startsWith("social_")),S=h?h.replace("social_",""):"unknown";J(e,S)})})}function W(e,t){var o,n;k.innerHTML=`
    <div class="passkey-modal">
      <i class="fas fa-lock" style="font-size:2rem; color:#1A2F5B; margin-bottom:12px;"></i>
      <h2>This collection is protected</h2>
      <p>Enter the passkey to view this content.</p>
      <input type="password" id="passkey-input" placeholder="Enter passkey" autofocus>
      <button id="passkey-submit">Submit</button>
      <p id="passkey-error" style="color:#ef4444; font-size:0.75rem; margin-top:8px; display:none;">Incorrect passkey. Try again.</p>
    </div>
  `;const i=()=>{var s;(((s=document.getElementById("passkey-input"))==null?void 0:s.value)||"")===e.passkey_hash?t():document.getElementById("passkey-error").style.display="block"};(o=document.getElementById("passkey-submit"))==null||o.addEventListener("click",i),(n=document.getElementById("passkey-input"))==null||n.addEventListener("keydown",a=>{a.key==="Enter"&&i()})}async function K(){const t=new URLSearchParams(window.location.search).get("collection");if(t)return t;const o=window.location.pathname.match(/^\/u\/([^/]+)\/([^/]+)\/?$/);if(o){const[,n,a]=o,{data:s}=await p.from("profiles").select("id").eq("username",n).single();if(!s)return null;const{data:l}=await p.from("link_lists").select("id").eq("owner_id",s.id).eq("slug",a).single();return(l==null?void 0:l.id)||null}return null}async function Z(){const e=await K();if(!e){v("Missing Collection","No collection ID provided in the URL.");return}try{const t=await X(e);if(!t){v("Not Found","This collection does not exist or has been removed.");return}if(t.visibility==="private"){v("Private Collection","This collection is private and cannot be viewed.");return}const[i,o]=await Promise.all([Y(e),j(t.owner_id)]);N(t,o),t.passkey_hash?W(t,()=>{w(t,i,o),L(t)}):(w(t,i,o),L(t))}catch(t){console.error("[Public] Failed to load:",t),v("Something went wrong","Unable to load this collection. Please try again later.")}}Z();

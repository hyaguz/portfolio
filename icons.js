/* =====================================================================
   ÍCONES DAS TECNOLOGIAS (SVG inline, sem requisições externas)

   Cada chave abaixo pode ser usada no campo "icon" de js/data.js.
   Para adicionar uma tecnologia nova você tem duas opções:

   1) Colar aqui o SVG dela:   react: '<svg viewBox="0 0 24 24">…</svg>',
      e usar  icon: "react"  em data.js.

   2) Colocar um arquivo .svg/.png em assets/icons/tech/ e usar o caminho
      em data.js:  icon: "assets/icons/tech/react.svg"

   Dicas:
   - Mantenha o atributo viewBox no <svg>.
   - Use fill="currentColor" nos logos de uma cor só (como o do GitHub):
     assim eles ficam pretos no tema claro e brancos no tema escuro.
   ===================================================================== */
window.TECH_ICONS = {

  html5:
    '<svg viewBox="0 0 512 512" focusable="false">' +
    '<path fill="#e44d26" d="M71 460 30 0h451l-41 460-185 52z"/>' +
    '<path fill="#f16529" d="m256 472 149-41 35-391H256z"/>' +
    '<path fill="#ebebeb" d="M256 208h-75l-5-58h80V94H119l1 15 15 168h121zm0 147h-1l-63-17-4-45h-56l8 89 116 32h1z"/>' +
    '<path fill="#fff" d="M255 208v57h70l-7 73-63 17v59l116-32 1-10 13-149 2-15h-16zm0-114v56h137l1-12 3-28 1-16z"/>' +
    '</svg>',

  css3:
    '<svg viewBox="0 0 512 512" focusable="false">' +
    '<path fill="#264de4" d="M71 460 30 0h451l-41 460-185 52z"/>' +
    '<path fill="#2965f1" d="m256 472 149-41 35-391H256z"/>' +
    '<path fill="none" stroke="#fff" stroke-width="38" stroke-linejoin="round" stroke-linecap="butt" d="M150 136h202l-86 100c52-2 90 24 90 70 0 48-40 78-96 78-36 0-66-10-90-30"/>' +
    '</svg>',

  javascript:
    '<svg viewBox="0 0 128 128" focusable="false">' +
    '<rect x="4" y="4" width="120" height="120" rx="6" fill="#f7df1e"/>' +
    '<path fill="#1a1a1a" d="M34 100.5l9.6-5.8c1.9 3.3 3.5 6.1 7.4 6.1 3.7 0 6.1-1.5 6.1-7.2V54.4h11.8v39.4c0 11.9-7 17.3-17.1 17.3-9.2 0-14.5-4.8-17.8-10.6zM73.2 99l9.6-5.6c2.5 4.1 5.8 7.1 11.6 7.1 4.9 0 8-2.4 8-5.8 0-4-3.2-5.4-8.6-7.8l-2.9-1.2c-8.5-3.6-14.1-8.1-14.1-17.7 0-8.8 6.7-15.5 17.2-15.5 7.5 0 12.8 2.6 16.7 9.4l-9.2 5.9c-2-3.6-4.2-5.1-7.6-5.1-3.5 0-5.7 2.2-5.7 5.1 0 3.5 2.2 5 7.3 7.2l2.9 1.2c10 4.3 15.6 8.6 15.6 18.4 0 10.5-8.3 16.3-19.4 16.3-10.9 0-17.9-5.2-21.4-12.3z"/>' +
    '</svg>',

  git:
    '<svg viewBox="0 0 128 128" focusable="false">' +
    '<rect x="24" y="24" width="80" height="80" rx="9" transform="rotate(45 64 64)" fill="#f05133"/>' +
    '<g fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round">' +
    '<path d="M50 38v50"/><path d="M50 56c0 12 10 14 21 14h5"/></g>' +
    '<g fill="#fff"><circle cx="50" cy="38" r="9"/><circle cx="50" cy="90" r="9"/><circle cx="82" cy="70" r="9"/></g>' +
    '</svg>',

  github:
    '<svg viewBox="0 0 24 24" focusable="false">' +
    '<path fill="currentColor" d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.7 5.39-5.27 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5z"/>' +
    '</svg>',

  flutter:
    '<svg viewBox="0 0 24 24" focusable="false">' +
    '<path fill="#54c5f8" d="M14.314 0 2.3 12 6 15.7 21.684.013h-7.37z"/>' +
    '<path fill="#01579b" d="M14.326 11.2 7.857 17.66l6.47 6.34h7.37l-6.46-6.34 6.46-6.46z"/>' +
    '<path fill="#29b6f6" d="m6 15.7 3.7 3.7 4.63-4.63-3.7-3.7z" opacity=".55"/>' +
    '</svg>',

  dart:
    '<svg viewBox="0 0 128 128" focusable="false">' +
    '<path fill="#01579b" d="M20 44 44 20 100 20 108 28 108 100 64 108z"/>' +
    '<path fill="#0175c2" d="M20 44 20 84 44 108 64 108 108 100 44 44z"/>' +
    '<path fill="#40c4ff" d="M44 20 20 44 44 44 44 20z"/>' +
    '<path fill="#29b6f6" d="M44 20 100 20 108 28 44 28z"/>' +
    '</svg>',

  excel:
    '<svg viewBox="0 0 128 128" focusable="false">' +
    '<rect x="38" y="12" width="82" height="104" rx="8" fill="#21a366"/>' +
    '<path fill="#33c481" d="M46 12h66a8 8 0 0 1 8 8v22H38V20a8 8 0 0 1 8-8z"/>' +
    '<rect x="38" y="42" width="82" height="24" fill="#21a366"/>' +
    '<rect x="38" y="66" width="82" height="24" fill="#107c41"/>' +
    '<path fill="#185c37" d="M38 90h82v18a8 8 0 0 1-8 8H46a8 8 0 0 1-8-8z"/>' +
    '<rect x="6" y="32" width="68" height="64" rx="8" fill="#107c41"/>' +
    '<path fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" d="M24 50l32 28M56 50 24 78"/>' +
    '</svg>'
};

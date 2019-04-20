var i19n = {
  lang: (navigator.language || navigator.userLanguage).split('-').shift(),
  en: {}
};

function _T(k) {
  return (i19n[i19n.lang] || i19n.en)[k] || i19n.en[k] || k;
};
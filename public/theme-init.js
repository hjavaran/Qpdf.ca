/* Applies the saved colour theme before first paint (no flash of the wrong theme).
   Default is light. The preference is stored only in this browser (localStorage). */
(function () {
  try {
    if (localStorage.getItem('qpdf.theme') === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  } catch (e) {
    /* storage unavailable: stay on the default light theme */
  }
})();

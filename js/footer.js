(function () {
  const placeholder = document.getElementById("footer-placeholder");
  if (!placeholder) {
    return;
  }

  const footerHtml = `
    <footer>
      <p>&copy; <span id="year"></span> Muhammad Ihsan Anwar. All rights reserved.</p>
    </footer>
  `;

  placeholder.innerHTML = footerHtml.trim();
})();

// Lightbox de video — reproduce los links de YouTube embebidos, sin salir de la página.
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var items = document.querySelectorAll('.jd-collage-item[href]');
    if (!items.length) return;

    var overlay = document.createElement('div');
    overlay.className = 'jd-video-lightbox';
    overlay.innerHTML =
      '<div class="jd-video-lightbox-inner">' +
        '<button type="button" class="jd-video-lightbox-close" aria-label="Cerrar">&times;</button>' +
        '<div class="jd-video-lightbox-frame"></div>' +
      '</div>';
    document.body.appendChild(overlay);

    var frameWrap = overlay.querySelector('.jd-video-lightbox-frame');
    var closeBtn = overlay.querySelector('.jd-video-lightbox-close');

    function openVideo(id, isVertical) {
      overlay.classList.toggle('is-vertical', !!isVertical);
      // origin ayuda a que YouTube valide el embed correctamente en un dominio real
      // (en local, file:///, el origin no es válido y puede dar Error 153 — normal).
      var origin = window.location.origin && window.location.origin !== 'null'
        ? '&origin=' + encodeURIComponent(window.location.origin)
        : '';
      frameWrap.innerHTML =
        '<iframe src="https://www.youtube.com/embed/' + id + '?autoplay=1&rel=0' + origin + '" ' +
        'title="YouTube video" frameborder="0" ' +
        'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" ' +
        'allowfullscreen></iframe>';
      overlay.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    }

    function closeVideo() {
      overlay.classList.remove('is-active');
      frameWrap.innerHTML = ''; // corta la reproducción al cerrar
      document.body.style.overflow = '';
    }

    items.forEach(function (item) {
      item.addEventListener('click', function (e) {
        var img = item.querySelector('img');
        var match = img && img.src.match(/\/vi\/([^/]+)\//);
        if (!match) return; // sin ID detectable: deja el link normal (abre en YouTube)
        e.preventDefault();
        openVideo(match[1], item.hasAttribute('data-vertical'));
      });
    });

    closeBtn.addEventListener('click', closeVideo);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeVideo();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeVideo();
    });
  });
})();

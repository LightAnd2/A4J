// Mobile nav hamburger toggle
var navToggle = document.querySelector('.nav-toggle');
if (navToggle) {
  navToggle.addEventListener('click', function(e) {
    e.stopPropagation();
    document.querySelector('.site-nav').classList.toggle('nav-open');
  });
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.site-nav')) {
      document.querySelector('.site-nav').classList.remove('nav-open');
    }
  });
}

// Language dropdown toggle
document.querySelectorAll('.lang-btn').forEach(function(btn) {
  btn.addEventListener('click', function(e) {
    e.stopPropagation();
    var sw = btn.closest('.lang-switch');
    sw.classList.toggle('open');
    btn.setAttribute('aria-expanded', sw.classList.contains('open'));
  });
});

// Close language dropdown when clicking outside
document.addEventListener('click', function() {
  document.querySelectorAll('.lang-switch.open').forEach(function(sw) {
    sw.classList.remove('open');
    sw.querySelector('.lang-btn').setAttribute('aria-expanded', 'false');
  });
});

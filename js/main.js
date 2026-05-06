// ============================================
// SHELTERING ARMS CARE HOMES
// Main JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  // Hero background pan effect
  const heroBg = document.getElementById('heroBg');
  if (heroBg) {
    setTimeout(() => heroBg.classList.add('loaded'), 100);
  }

  // Scroll reveal
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(el => observer.observe(el));

  // Nav scroll effect
  const nav = document.querySelector('.nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      nav.style.boxShadow = '0 4px 24px rgba(27,67,50,0.25)';
    } else {
      nav.style.boxShadow = 'none';
    }
  });

  // Form success message
  const form = document.querySelector('form[action*="formspree"]');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('.form-submit');
      btn.textContent = 'Sending...';
      btn.disabled = true;

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          form.innerHTML = `
            <div style="text-align:center; padding:3rem 2rem;">
              <div style="width:60px;height:60px;background:var(--green);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 1.5rem;">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" width="28" height="28"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <h3 style="font-family:'Cormorant Garamond',serif;font-size:1.8rem;color:var(--green);margin-bottom:0.75rem;">Message Received</h3>
              <p style="color:var(--text-light);font-weight:300;font-size:0.95rem;">Thank you for reaching out. Grace or Michael will be in touch with you shortly.</p>
            </div>
          `;
        } else {
          btn.textContent = 'Try Again';
          btn.disabled = false;
        }
      } catch (err) {
        btn.textContent = 'Try Again';
        btn.disabled = false;
      }
    });
  }

});

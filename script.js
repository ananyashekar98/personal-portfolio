(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  // Footer year
  $("#year").textContent = new Date().getFullYear();

  // Mobile menu
  const menuBtn = $("#menuBtn");
  const navLinks = $("#navLinks");
  const closeMenu = () => {
    navLinks.classList.remove("open");
    menuBtn.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  };
  menuBtn.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    menuBtn.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
  });
  $$("a", navLinks).forEach((a) => a.addEventListener("click", closeMenu));

  // Scroll: nav shadow, progress bar, back-to-top
  const nav = $("#nav");
  const progress = $("#progress");
  const toTop = $("#toTop");
  const onScroll = () => {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    nav.classList.toggle("scrolled", y > 10);
    progress.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
    toTop.classList.toggle("show", y > 500);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  // Active nav link on scroll
  const sections = $$("main section[id]");
  const links = $$(".nav-links a");
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          links.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === "#" + e.target.id));
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((s) => spy.observe(s));

  // Reveal on scroll + skill bars + counters
  const animateCount = (el) => {
    const target = +el.dataset.target;
    let n = 0;
    const step = Math.max(1, Math.ceil(target / 30));
    const t = setInterval(() => {
      n = Math.min(target, n + step);
      el.textContent = n;
      if (n >= target) clearInterval(t);
    }, 40);
  };
  const reveal = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("visible");
        $$(".fill", e.target).forEach((f) => (f.style.width = f.dataset.width + "%"));
        $$(".num", e.target).forEach(animateCount);
        reveal.unobserve(e.target);
      });
    },
    { threshold: 0.15 }
  );
  $$(".reveal").forEach((el) => reveal.observe(el));

  // Project filter
  const filters = $$(".filter");
  const cards = $$("#cards .card");
  filters.forEach((btn) =>
    btn.addEventListener("click", () => {
      filters.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const f = btn.dataset.filter;
      cards.forEach((c) => c.classList.toggle("hide", f !== "all" && !c.dataset.cat.split(" ").includes(f)));
    })
  );

  // Contact form validation
  const form = $("#contactForm");
  const rules = {
    name: (v) => (v.trim().length < 2 ? "Please enter your name (at least 2 characters)." : ""),
    email: (v) =>
      !v.trim() ? "Email is required." : !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "Enter a valid email address." : "",
    message: (v) => (v.trim().length < 10 ? "Message must be at least 10 characters." : ""),
  };
  const check = (id) => {
    const input = $("#" + id);
    const msg = rules[id](input.value);
    $("#" + id + "Error").textContent = msg;
    input.parentElement.classList.toggle("invalid", !!msg);
    input.parentElement.classList.toggle("valid", !msg);
    return !msg;
  };
  Object.keys(rules).forEach((id) => {
    $("#" + id).addEventListener("blur", () => check(id));
    $("#" + id).addEventListener("input", () => {
      if ($("#" + id).parentElement.classList.contains("invalid")) check(id);
    });
  });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const ok = Object.keys(rules).map(check).every(Boolean);
    const success = $("#formSuccess");
    if (!ok) {
      success.textContent = "";
      const firstBad = $(".field.invalid input, .field.invalid textarea", form);
      if (firstBad) firstBad.focus();
      return;
    }
    const name = $("#name").value.trim();
    const from = $("#email").value.trim();
    const body = $("#message").value.trim();
    const subject = encodeURIComponent("Portfolio enquiry from " + name);
    const mailBody = encodeURIComponent(body + "\n\nFrom: " + name + " (" + from + ")");
    window.location.href = "mailto:ananyashekar98@gmail.com?subject=" + subject + "&body=" + mailBody;
    success.textContent = "Thanks, " + name + "! Your email app is opening with your message ready to send.";
    form.reset();
    $$(".field", form).forEach((f) => f.classList.remove("valid", "invalid"));
    setTimeout(() => (success.textContent = ""), 6000);
  });
})();

/* Eneia Estudio · interacción: menú, idioma ES/GL, código de tiempo, vídeo y formulario. */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const store = { get: (k) => { try { return localStorage.getItem(k); } catch { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch {} } };

  /* menú móvil */
  const tog = $('.nav-toggle'), menu = $('#menu');
  tog.addEventListener('click', () => { const o = menu.classList.toggle('open'); tog.setAttribute('aria-expanded', o); });
  $$('#menu a').forEach((a) => a.addEventListener('click', () => { menu.classList.remove('open'); tog.setAttribute('aria-expanded', false); }));

  /* idioma */
  const GL = {
    skip: 'Saltar ao contido', menu: 'Menú', 'nav.metodo': 'Método', 'nav.formatos': 'Formatos', 'nav.estudio': 'Estudio', 'nav.contacto': 'Falemos',
    'hero.eyebrow': 'Estudio audiovisual · Galicia', 'hero.h1': 'Mirada de cine.<br>Oficio de empresa.',
    'hero.lead': 'Vídeo corporativo e publicidade coa verdade do cine documental. Contamos o que facedes, coa vosa xente e coa vosa voz.',
    'hero.cta1': 'Contádenos o voso proxecto', 'hero.cta2': 'Ver o manifesto →', 'man.h': 'Manifesto', 'man.sound': 'Ver con son',
    'met.eyebrow': 'Método Eneia', 'met.h': 'Primeiro escoitamos. Despois encadramos.',
    'met.1': 'Unha sesión co voso equipo para entender que facedes, para quen e que ten que pasar despois do vídeo.',
    'met.2': 'Proposta de enfoque por escrito: historia, persoas, localizacións, plan de rodaxe e prezo pechado.',
    'met.3': 'Rodaxe documental con son directo e luz natural. Dúas directoras: unha dirixe a historia e a outra, a imaxe.',
    'met.4': 'Peza principal, cortes verticais e cadrados, subtítulos ES·GL·EN e fotogramas. Listo para anos de uso.',
    'for.eyebrow': 'Formatos', 'for.h': 'Prezo claro desde o primeiro día.', desde: 'desde', mes: '/mes',
    'for.1.t': 'Peza', 'for.1.d': '60–90 s · 1 xornada', 'for.1.p': 'Un vídeo de presentación para web, feiras e comerciais. Guión, rodaxe, montaxe e kit de vida útil básico.',
    'for.2.t': 'Historia', 'for.2.d': '2–4 min · 2 xornadas', 'for.2.p': 'Documental de marca con entrevistas á vosa xente. A peza que explica quen sodes durante anos.',
    'for.3.t': 'Campaña', 'for.3.d': 'Spot 20–30 s + 6 pezas', 'for.3.p': 'Publicidade para redes, medios e pantallas, con versións adaptadas a cada canle e formato.',
    'for.4.t': 'Continuo', 'for.4.d': 'Contido mensual', 'for.4.p': 'Media xornada ao mes e catro pezas verticais. A vosa empresa, presente todo o ano.',
    'for.note': 'Prezos sen IVE. Desprazamentos incluídos en Galicia. Cada proposta detalla xornadas, entregables e prazos antes de comezar.',
    'sec.eyebrow': 'Para quen', 'sec.h': 'Empresas con oficio que merecen ser vistas como traballan.',
    'sec.1': 'Industria e automoción', 'sec.2': 'Mar e conserva', 'sec.3': 'Viño e alimentación', 'sec.4': 'Construción e arquitectura', 'sec.5': 'Turismo de calidade', 'sec.6': 'Axencias de comunicación', 'sec.7': 'Institucións e cultura',
    'est.eyebrow': 'O estudio', 'est.h': 'Eneia soa como «N&nbsp;e&nbsp;A».',
    'est.p1': 'Somos dúas socias e dúas miradas. En cada proxecto, unha dirixe a historia e a outra a imaxe. Vimos do audiovisual e eliximos traballar con empresas porque é onde máis historias reais quedan por contar.',
    'est.p2': 'E si: no estudio hai unha terceira integrante. Arya, a nosa cadela, encárgase de recibir a todo o mundo.',
    'est.q': '«Unha historia real, ben filmada, convence máis ca un anuncio.»',
    'con.eyebrow': 'Contacto', 'con.h': 'Contádenos que facedes.', 'con.p': 'Respondemos en menos de 48 horas laborables cunha primeira idea de enfoque e orzamento.',
    'f.nombre': 'Nome', 'f.empresa': 'Empresa', 'f.email': 'Correo electrónico', 'f.tel': 'Teléfono (opcional)', 'f.formato': 'Formato que vos interesa', 'f.nose': 'Aínda non o sei',
    'f.msg': 'Cóntanos o proxecto', 'f.priv': 'Lin e acepto a <a href="/legal.html#privacidad">política de privacidade</a>.', 'f.send': 'Enviar', legal: 'Aviso legal e privacidade',
    ok: 'Grazas. Recibimos a vosa mensaxe e respondemos en menos de 48 horas laborables.', mail: 'Abrimos o voso programa de correo coa mensaxe xa redactada. Só falta premer «Enviar».',
    err: 'Revisade os campos marcados.', fail: 'Non puidemos enviar a mensaxe. Probade de novo ou escribídenos a ',
  };
  const ES = {}; $$('[data-i18n]').forEach((el) => { ES[el.dataset.i18n] = el.innerHTML; });
  Object.assign(ES, { ok: 'Gracias. Hemos recibido vuestro mensaje y respondemos en menos de 48 horas laborables.', mail: 'Hemos abierto vuestro programa de correo con el mensaje ya redactado. Solo falta pulsar «Enviar».', err: 'Revisad los campos marcados.', fail: 'No hemos podido enviar el mensaje. Probad de nuevo o escribidnos a ' });
  let lang = store.get('eneia-lang') || ((navigator.language || '').startsWith('gl') ? 'gl' : 'es');
  const t = (k) => (lang === 'gl' ? GL : ES)[k] || ES[k] || '';
  const apply = () => {
    document.documentElement.lang = lang;
    $$('[data-i18n]').forEach((el) => { const v = t(el.dataset.i18n); if (v) el.innerHTML = v; });
    $$('.lang [data-l]').forEach((s) => s.classList.toggle('on', s.dataset.l === lang));
  };
  $('.lang').addEventListener('click', () => { lang = lang === 'es' ? 'gl' : 'es'; store.set('eneia-lang', lang); apply(); });
  apply();

  /* código de tiempo del visor (25 fps) */
  const tc = $('#tc'), t0 = performance.now(), pad = (n) => String(n).padStart(2, '0');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const tick = (now) => { const s = (now - t0) / 1000; tc.textContent = `00:${pad(Math.floor(s / 60) % 60)}:${pad(Math.floor(s) % 60)}:${pad(Math.floor((s % 1) * 25))}`; if (!reduce) requestAnimationFrame(tick); };
  requestAnimationFrame(tick);

  /* vídeo: reproduce al entrar en pantalla; botón «con sonido» carga la versión con audio */
  const film = $('#film');
  if ('IntersectionObserver' in window && !reduce) new IntersectionObserver(([e]) => { e.isIntersecting ? film.play().catch(() => {}) : film.pause(); }, { threshold: 0.4 }).observe(film);
  $('#sound').addEventListener('click', (ev) => { film.src = '/assets/video/manifiesto-audio.mp4'; film.muted = false; film.loop = false; film.controls = true; film.play().catch(() => {}); ev.currentTarget.remove(); });

  /* formulario */
  const form = $('#form'), status = $('#status'), cfg = window.ENEIA_CONFIG || {};
  const say = (msg, cls) => { status.textContent = msg; status.className = 'status ' + (cls || ''); };
  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    let bad = null;
    $$('input,select,textarea', form).forEach((f) => { if (f.name === '_gotcha') return; const ok = f.checkValidity(); f.setAttribute('aria-invalid', !ok); if (!ok && !bad) bad = f; });
    if (bad) { say(t('err'), 'err'); bad.focus(); return; }
    if (form._gotcha.value) return; // bot
    const data = Object.fromEntries(new FormData(form)); delete data._gotcha;
    const btn = $('button[type=submit]', form); btn.disabled = true;
    try {
      if (cfg.FORM_ENDPOINT) {
        const r = await fetch(cfg.FORM_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) });
        if (!r.ok) throw new Error(r.status);
        form.reset(); say(t('ok'), 'ok');
      } else {
        const body = `Nombre: ${data.nombre}\nEmpresa: ${data.empresa || '-'}\nCorreo: ${data.email}\nTeléfono: ${data.telefono || '-'}\nFormato: ${data.formato}\n\n${data.mensaje}`;
        location.href = `mailto:${cfg.CONTACT_EMAIL}?subject=${encodeURIComponent('Proyecto · ' + (data.empresa || data.nombre))}&body=${encodeURIComponent(body)}`;
        say(t('mail'), 'ok');
      }
    } catch (e) { say(t('fail') + (cfg.CONTACT_EMAIL || ''), 'err'); }
    finally { btn.disabled = false; }
  });

  $('#y').textContent = new Date().getFullYear();
})();

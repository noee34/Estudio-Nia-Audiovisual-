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
    'hero.eyebrow': 'Estudio audiovisual con IA · Galicia', 'hero.h1': 'Mirada de cine.<br>Oficio de empresa.',
    'hero.lead': 'Fotos e vídeos publicitarios creados con intelixencia artificial e dirección de arte de cine. Imaxe profesional para que a túa empresa venda máis, en días e sen rodaxes.',
    'hero.cta1': 'Pide a túa proposta', 'hero.cta2': 'Ver o manifesto →', 'man.h': 'Manifesto', 'man.sound': 'Ver con son',
    'met.eyebrow': 'Método Eneia', 'met.h': 'A IA é a ferramenta. A mirada, nosa.',
    'met.1': 'Entendemos que vendes, a quen e onde: web, redes, anuncios ou tenda. Envíasnos fotos reais do teu produto.',
    'met.2': 'Concepto, moodboard e textos por escrito, con prezo pechado. Nada se crea sen a túa aprobación.',
    'met.3': 'Creamos as imaxes e os vídeos con IA e puímolos a man: luz, cor, composición e fidelidade ao teu produto.',
    'met.4': 'Todo nos formatos de cada canle, con licenza de uso comercial e etiquetaxe de IA conforme á normativa europea.',
    'for.eyebrow': 'Formatos', 'for.h': 'Imaxe de cine a prezo de peme.', desde: 'desde', mes: '/mes',
    'for.1.t': 'Foto', 'for.1.d': '20 imaxes · 5 días', 'for.1.p': 'Fotos de produto e de ambiente para web, catálogo e tenda en liña, a partir das túas fotos reais.',
    'for.2.t': 'Spot', 'for.2.d': '15–30 s · 3 formatos', 'for.2.p': 'Vídeo publicitario con música, rótulos e versións para redes, anuncios e pantallas.',
    'for.3.t': 'Campaña', 'for.3.d': '30 fotos + 4 vídeos', 'for.3.p': 'Lanzamento, tempada ou promoción: todo o material visual dunha campaña, coherente e listo para publicar.',
    'for.4.t': 'Continuo', 'for.4.d': 'Contido mensual', 'for.4.p': '15 fotos e 4 vídeos ao mes para redes e anuncios. A túa marca, sempre con imaxe nova.',
    'for.note': 'Prezos sen IVE. Primeiras propostas en 72 horas. Licenza de uso comercial incluída e contido etiquetado como xerado con IA segundo o Regulamento europeo de IA.',
    'sec.eyebrow': 'Para quen', 'sec.h': 'Empresas que precisan vender con boa imaxe.',
    'sec.1': 'Comercio e tenda en liña', 'sec.2': 'Alimentación, viño e conservas', 'sec.3': 'Restauración e hostalaría', 'sec.4': 'Moda e complementos', 'sec.5': 'Inmobiliaria e reformas', 'sec.6': 'Turismo e aloxamentos', 'sec.7': 'Axencias de márketing',
    'est.eyebrow': 'O estudio', 'est.h': 'Un estudio con nome propio.',
    'est.p1': 'Son Noe e dirixo Eneia. Uno a intelixencia artificial coa mirada do audiovisual para que calquera empresa, grande ou pequena, teña fotos e vídeos á altura do que vende. Eneia é un nome con historia: leva dentro a miña familia.',
    'est.p2': 'E si: no estudio hai unha segunda integrante. Arya, a miña cadela, encárgase de recibir a todo o mundo.',
    'est.q': '«A intelixencia artificial é a ferramenta. A mirada é nosa.»',
    'con.eyebrow': 'Contacto', 'con.h': 'Cóntanos que vendes.', 'con.p': 'Respondémoste en menos de 48 horas laborables cunha primeira idea e un orzamento pechado.',
    'f.nombre': 'Nome', 'f.empresa': 'Empresa', 'f.email': 'Correo electrónico', 'f.tel': 'Teléfono (opcional)', 'f.formato': 'Formato que che interesa', 'f.nose': 'Aínda non o sei',
    'f.msg': 'Cóntanos que vendes e para que o precisas', 'f.priv': 'Lin e acepto a <a href="/legal.html#privacidad">política de privacidade</a>.', 'f.send': 'Enviar', legal: 'Aviso legal e privacidade',
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

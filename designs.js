/*
  Дизайны сертификатов.

  Сертификат собирается в index.html из блоков внутри .content (CSS grid):
    .art                      — декоративная плитка (HTML из design.art), по умолчанию скрыта
    .head    > .eyebrow, .title
    .who     > .for, .name > span
    .lessons > .num, .unit    (+ класс .many для режима «много»)
    .msg     > .text, .from
    .school  > small, b
    .meta    > .no, .until, .contacts
  Пустые блоки получают класс .empty (по умолчанию скрыты).

  1em внутри .content = 1% меньшей стороны сертификата, поэтому дизайн
  одинаково масштабируется на A4…A6/DL. Книжная ориентация — через
  @container (aspect-ratio < 1).

  Дизайн: { id, name, swatch, fonts, css, nest?, bg?(w,h,u,state), deco?(w,h,u,state), art?(w,h,u,state) }
    nest — вложить блок в другой блок, например { msg: 'who' }.
    w, h — размер сертификата в мм, u — 1% меньшей стороны.
    bg   — нижний слой, заменяется картинкой пользователя.
    deco — слой поверх фона/картинки, под текстом.
*/
(() => {
  const r2 = n => Math.round(n * 100) / 100;
  const svg = (box, inner, par = 'none') =>
    `<svg viewBox="${box}" preserveAspectRatio="${par}" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
  function mulberry32(a) {
    return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  }

  // Soundwave: центр группы палочек — по нему же центрируется шар
  function waveBarsCenter(w, h) {
    // в альбомной — справа, между номером и карточкой QR;
    // в книжной — по центру листа, посередине между заголовком и блоком с именем
    return w >= h ? [w * .8, h * .31] : [w * .5, h * .49];
  }

  const BASE_CSS = `
    .cert {
      position: absolute; overflow: hidden; container-type: size;
      background: var(--bg); color: var(--ink);
      -webkit-print-color-adjust: exact; print-color-adjust: exact;
    }
    .cert .layer { position: absolute; inset: 0; }
    .cert .layer svg { display: block; width: 100%; height: 100%; }
    .cert .photo { background-size: cover; background-position: center; }
    .cert .shade { background: var(--shade-color); }
    .cert.has-photo .bg { display: none; }

    .cert .content {
      position: absolute; inset: var(--pad, 8cqmin); display: grid; isolation: isolate;
      font-size: calc(var(--k, 1) * 1cqmin); line-height: 1.3;
    }
    .cert .content > * { min-width: 0; }
    .cert .head { grid-area: head; }
    .cert .who { grid-area: who; }
    .cert .lessons { grid-area: lessons; }
    .cert .msg { grid-area: msg; }
    .cert .school { grid-area: school; }
    .cert .meta { grid-area: meta; }
    .cert .art { grid-area: art; position: relative; z-index: -1; }
    .cert .art svg { position: absolute; left: 0; top: 0; width: 100%; height: 100%; overflow: visible; display: block; }
    .cert .empty, .cert .art:empty { display: none; }
    .cert .qr { display: none; } /* QR показывают только дизайны, которые его разместили */
    .cert .qr svg { display: block; width: 100%; height: 100%; }
    .cert .name { white-space: nowrap; }
    .cert .name > span { display: inline-block; }
    .cert .school small, .cert .school b { display: block; }
  `;

  const DESIGNS = [
    /* ---------------- Soundwave ---------------- */
    {
      id: 'wave',
      name: 'Soundwave',
      swatch: `radial-gradient(circle at 92% 8%, #ffb69f, #c8a1e9 28%, #9aabe5 48%, transparent 66%), #eae9f5`,
      fonts: ['Manrope:wght@400;500;600;700;800'],
      css: `
        .t-wave {
          --bg: #eae9f5; --shade-color: #eae9f5; --ink: #292447; --muted: #675e89; --rule: #b8b4cb;
          --pad: 7cqmin 9cqmin 6cqmin;
          font-family: Manrope, sans-serif;
        }
        /* head, msg и meta разбираем на отдельные элементы сетки */
        .t-wave .head, .t-wave .msg, .t-wave .meta { display: contents; }
        .t-wave .content {
          grid-template-columns: minmax(0, 1fr) auto;
          grid-template-rows: auto auto auto 1fr auto auto auto auto auto auto;
          grid-template-areas:
            "school no" "eyebrow eyebrow" "title title" ". ." "who who"
            "lessons lessons" "text text" "rule rule" "from until" "contacts contacts";
        }
        .t-wave .content::before { content: ''; grid-area: rule; border-top: max(1px, .15em) solid var(--rule); margin-top: 2.6em; }

        .t-wave .school { align-self: start; }
        .t-wave .school small { font-size: 1.9em; color: var(--muted); margin-bottom: .2em; }
        .t-wave .school b { font-size: 2.3em; font-weight: 800; letter-spacing: .25em; text-transform: uppercase; }
        .t-wave .no { grid-area: no; align-self: start; justify-self: end; font-size: 2em; font-weight: 800; letter-spacing: .15em; color: var(--muted); white-space: nowrap; }

        .t-wave .eyebrow {
          grid-area: eyebrow; max-width: 78%; margin-top: .45em;
          font-size: 10em; font-weight: 800; letter-spacing: -.06em; line-height: 1.02;
        }
        .t-wave .title {
          grid-area: title; justify-self: start; margin-top: .25em;
          font-size: 3.4em; font-weight: 800; letter-spacing: -.02em;
          background: linear-gradient(90deg, #f08a7a, #a879d6 55%, #5f86d6);
          -webkit-background-clip: text; background-clip: text; color: transparent;
        }

        .t-wave .for { font-size: 2.1em; color: var(--muted); }
        .t-wave .name { font-size: calc(8.4em * var(--fit, 1)); font-weight: 800; letter-spacing: -.05em; line-height: 1.08; }

        .t-wave .lessons { display: flex; align-items: center; gap: 2.4em; margin-top: .6em; }
        .t-wave .num { font-size: 12em; font-weight: 800; letter-spacing: -.08em; line-height: 1; }
        .t-wave .unit { font-size: 3.3em; font-weight: 800; }
        .t-wave .lessons.many .num { font-size: 6.4em; letter-spacing: -.05em; }

        .t-wave .text { grid-area: text; max-width: 62cqw; margin-top: 1.2em; font-size: 2.2em; line-height: 1.45; color: #5d5679; }

        .t-wave .from, .t-wave .until { font-size: 1.75em; font-weight: 700; color: #6a637e; padding-top: 1em; }
        .t-wave .from { grid-area: from; }
        .t-wave .until { grid-area: until; text-align: right; white-space: nowrap; }
        .t-wave .contacts { grid-area: contacts; font-size: 1.6em; font-weight: 700; color: #6a637e; margin-top: .5em; }

        /* QR — стеклянная карточка справа от имени и занятий, поверх шара */
        .t-wave .content:has(.qr:not(.empty)) {
          grid-template-areas:
            "school no" "eyebrow eyebrow" "title title" ". ." "who qr"
            "lessons qr" "text qr" "rule rule" "from until" "contacts contacts";
        }
        .t-wave .qr:not(.empty) {
          grid-area: qr; align-self: end; justify-self: end;
          display: flex; flex-direction: column; align-items: center; gap: 1.1em;
          width: 25em; margin-left: 3em; padding: 2em 2em 1.5em; border-radius: 2.6em;
          background: rgba(255, 255, 255, .62); border: max(1px, .15em) solid rgba(255, 255, 255, .9);
          box-shadow: 0 .4em 1em rgba(70, 50, 140, .08), 0 2.4em 4.8em -1.2em rgba(70, 50, 140, .38);
          color: var(--ink);
        }
        .t-wave .qr svg { height: auto; aspect-ratio: 1; }
        .t-wave .qr::after { content: 'Записаться на урок'; font-size: 1.6em; font-weight: 700; color: var(--muted); white-space: nowrap; }

        @container (aspect-ratio < 1) {
          .t-wave { --pad: 8cqmin 8cqmin 7cqmin; }
          .t-wave .eyebrow { max-width: 100%; }
          .t-wave .text { max-width: none; }
        }
      `,
      // размытый градиентный шар — заменяется картинкой пользователя
      bg(w, h, u, state) {
        const land = w >= h;
        const r0 = land ? w * .42 * .85 : w * .62; // базовый размер (в альбомной шар по центру — поменьше)
        const r = r0 * 1.3;                        // с запасом на длинное затухание края
        // в альбомной шар центрирован по палочкам, в книжной — в правом верхнем углу
        let cx, cy, fx, fy;
        if (land) {
          [cx, cy] = waveBarsCenter(w, h);
          fx = cx; fy = cy;
        } else {
          cx = w * .93; cy = r0 * .18;
          fx = cx - r0 * .26; fy = cy + r0 * .02;
        }
        // цветное ядро занимает внутреннюю половину радиуса, остальное — затухание
        const core = [['#ffb69f', 0], ['#fbb0ac', .27], ['#e3a6cf', .53], ['#c8a1e9', .77], ['#ada7e7', 1]]
          .map(([c, t]) => `<stop offset="${r2(.46 * t)}" stop-color="${c}"/>`).join('');
        // край: прозрачность по S-кривой (smoothstep) — без заметной границы
        let fade = '';
        for (let i = 1; i <= 16; i++) {
          const t = i / 16, a = 1 - t * t * (3 - 2 * t);
          fade += `<stop offset="${r2(.5 + .5 * t)}" stop-color="#9aabe5" stop-opacity="${r2(a)}"/>`;
        }
        return svg(`0 0 ${w} ${h}`, `
          <defs>
            <radialGradient id="orb" gradientUnits="userSpaceOnUse" cx="${r2(cx)}" cy="${r2(cy)}" r="${r2(r)}" fx="${r2(fx)}" fy="${r2(fy)}">
              ${core}
              <stop offset=".5" stop-color="#9aabe5"/>
              ${fade}
            </radialGradient>
            <filter id="orbBlur" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="${r2(4.5 * u)}"/></filter>
          </defs>
          <circle cx="${r2(cx)}" cy="${r2(cy)}" r="${r2(r)}" fill="url(#orb)" filter="url(#orbBlur)"/>`);
      },
      // наклонные «звуковые» палочки
      deco(w, h, u, state) {
        const land = w >= h, qr = !!(state.qr || '').trim();
        const [ox, oy] = waveBarsCenter(w, h);
        const H = (land ? h * (qr ? .3 : .34) : h * .2), bw = 2.6 * u, step = (land ? w * .052 : w * .09);
        const bars = [.3, .72, 1, .6, .23].map((k, i) => {
          const bh = H * k, x = ox + (i - 2) * step - bw / 2;
          return `<rect x="${r2(x)}" y="${r2(oy - bh / 2)}" width="${r2(bw)}" height="${r2(bh)}" rx="${r2(bw / 2)}"/>`;
        }).join('');

        // две переплетённые волны за палочками: амплитуда нарастает к центру и гаснет к краям
        // L — во сколько раз волна длиннее базовой; частота растёт так же, чтобы длина периода не менялась
        const L = 1.8, W = (land ? w * .36 : w * .4) * L, A = land ? h * .11 : h * .07, x0 = ox - W / 2;
        const wave = (periods, phase, wobble) => {
          const freq = periods * L;
          // опорные точки (~8 на период) и гладкий сплайн Катмулла — Рома через них
          const n = Math.round(freq * 8), pts = [];
          for (let i = 0; i <= n; i++) {
            const t = i / n;
            const env = Math.pow(Math.sin(Math.PI * t), 1.4) * (.7 + .3 * Math.sin(t * 7.3 * L + wobble));
            const y = Math.sin(2 * Math.PI * freq * t + phase) + .18 * Math.sin(2 * Math.PI * freq * 1.5 * t + phase * 1.7);
            pts.push([x0 + W * t, oy + A * env * y / 1.18]);
          }
          let d = `M${r2(pts[0][0])} ${r2(pts[0][1])}`;
          for (let i = 0; i < n; i++) {
            const p0 = pts[Math.max(i - 1, 0)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(i + 2, n)];
            d += `C${r2(p1[0] + (p2[0] - p0[0]) / 6)} ${r2(p1[1] + (p2[1] - p0[1]) / 6)} `
               + `${r2(p2[0] - (p3[0] - p1[0]) / 6)} ${r2(p2[1] - (p3[1] - p1[1]) / 6)} ${r2(p2[0])} ${r2(p2[1])}`;
          }
          return d;
        };
        // обводка с прозрачными концами: проявляется от краёв к центру
        const fadeGrad = (id, color) => `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${r2(x0)}" y1="0" x2="${r2(x0 + W)}" y2="0">
            <stop offset="0" stop-color="${color}" stop-opacity="0"/><stop offset=".22" stop-color="${color}" stop-opacity=".23"/>
            <stop offset=".78" stop-color="${color}" stop-opacity=".23"/><stop offset="1" stop-color="${color}" stop-opacity="0"/>
          </linearGradient>`;
        // мягкая тень и светлый контур отделяют палочки от шара, как карточку с QR
        return svg(`0 0 ${w} ${h}`, `
          <defs>
            <linearGradient id="pill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stop-color="#ff9a8c"/><stop offset=".5" stop-color="#a27fd8"/><stop offset="1" stop-color="#5f86dc"/>
            </linearGradient>
            <filter id="pillShadow" x="-60%" y="-20%" width="220%" height="140%">
              <feDropShadow dx="0" dy="${r2(.9 * u)}" stdDeviation="${r2(1.1 * u)}" flood-color="#46328c" flood-opacity=".38"/>
            </filter>
            ${fadeGrad('waveBlue', '#4fa3ea')}${fadeGrad('waveMagenta', '#d45cc6')}
          </defs>
          <g fill="none" stroke-width="${r2(.62 * u)}" stroke-linecap="round" stroke-linejoin="round">
            <path d="${wave(8, 0, 0)}" stroke="url(#waveBlue)"/>
            <path d="${wave(8.6, 1.1, 1.8)}" stroke="url(#waveMagenta)"/>
          </g>
          <g fill="url(#pill)" stroke="#fff" stroke-opacity=".7" stroke-width="${r2(.22 * u)}"
             filter="url(#pillShadow)">${bars}</g>`);
      },
    },

    /* ---------------- Брутализм ---------------- */
    {
      id: 'brutal',
      name: 'Брутализм',
      swatch: `linear-gradient(#0b0b0b,#0b0b0b) 0 0/100% 24% no-repeat,
               linear-gradient(#2638ff,#2638ff) 0 100%/30% 40% no-repeat,
               linear-gradient(#ffe600,#ffe600) 100% 100%/34% 76% no-repeat, #f2efe6`,
      fonts: ['IBM Plex Mono:wght@400;600', 'Unbounded:wght@800;900'],
      nest: { qr: 'lessons' },
      css: `
        .t-brutal {
          --bg: #f2efe6; --shade-color: #f2efe6; --ink: #0b0b0b; --paper: #fbfaf5; --acc: #ffe600; --blue: #2638ff;
          --pad: 4cqmin 6cqmin 6cqmin 4cqmin;
          font-family: 'IBM Plex Mono', monospace;
        }
        .t-brutal .content {
          background: var(--ink); gap: .6em; border: .6em solid var(--ink); box-shadow: 1.8em 1.8em 0 var(--ink);
          grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr) minmax(0, .9fr);
          grid-template-rows: auto 1fr auto auto;
          grid-template-areas: "head head head" "who who lessons" "msg art lessons" "school school meta";
        }
        .t-brutal .content > * { background: var(--paper); padding: 2em 2.4em; display: flex; flex-direction: column; gap: .8em; }
        .t-brutal .content > .empty { display: block; background: repeating-linear-gradient(-45deg, var(--ink) 0 .3em, var(--paper) .3em 1.4em); }

        .t-brutal .head {
          background: var(--ink); color: var(--paper); flex-direction: row; flex-wrap: wrap;
          align-items: center; justify-content: space-between; gap: .6em 3em; padding: 1.4em 2.4em 1.8em;
        }
        .t-brutal .eyebrow { font-size: 1.9em; font-weight: 600; text-transform: uppercase; letter-spacing: .06em; }
        .t-brutal .eyebrow::before { content: '■ '; color: var(--acc); }
        .t-brutal .title { font: 800 3.6em/1 Unbounded, sans-serif; text-transform: uppercase; color: var(--acc); }

        .t-brutal .who { justify-content: space-between; }
        .t-brutal .for { font-size: 2em; font-weight: 600; text-transform: uppercase; }
        .t-brutal .for::before { content: '→ '; }
        .t-brutal .name {
          white-space: normal; font: 900 calc(10.5em * var(--fit, 1))/.9 Unbounded, sans-serif;
          text-transform: uppercase; letter-spacing: -.03em;
        }

        .t-brutal .lessons {
          background: var(--acc); display: grid; gap: .5em;
          grid-template-rows: auto auto minmax(0, 1fr);
        }
        .t-brutal .num { font: 900 19em/.8 Unbounded, sans-serif; letter-spacing: -.06em; }
        /* QR занимает всё оставшееся место: квадрат по ширине блока, но не выше свободной высоты */
        .t-brutal .qr:not(.empty) {
          grid-row: 3; /* всегда в последней строке, даже без подписи «занятий» */
          display: flex; align-items: flex-end; container-type: size; margin-top: 1.4em; color: var(--ink);
        }
        .t-brutal .qr svg {
          --side: min(100cqw, 100cqh) - .8em;
          width: calc(var(--side)); height: calc(var(--side));
          padding: 1em; background: var(--paper);
          border: .5em solid var(--ink); box-shadow: .8em .8em 0 var(--ink);
        }
        .t-brutal .lessons:not(.many) .num::before { content: '×'; font-size: .45em; vertical-align: .9em; margin-right: .05em; }
        .t-brutal .unit { font-size: 2.6em; font-weight: 600; text-transform: uppercase; }
        .t-brutal .lessons.many .num { font-size: 5.2em; line-height: .95; text-transform: uppercase; }

        .t-brutal .msg .text { font-size: 2.1em; line-height: 1.45; }
        .t-brutal .msg .from { font-size: 1.9em; font-weight: 600; }
        .t-brutal .msg .from::before { content: '— '; }

        .t-brutal .art { background: var(--blue); }
        .t-brutal .art svg { left: 10%; top: 18%; width: 80%; height: 64%; }

        .t-brutal .school { justify-content: flex-end; }
        .t-brutal .school small { font-size: 1.7em; text-transform: uppercase; }
        .t-brutal .school small::before { content: '// '; }
        .t-brutal .school b { font: 800 3.4em/1.05 Unbounded, sans-serif; text-transform: uppercase; }

        .t-brutal .meta { justify-content: flex-end; }
        .t-brutal .meta > div { font-size: 1.7em; text-transform: uppercase; }
        .t-brutal .meta .no { font: 800 2.2em Unbounded, sans-serif; } /* в IBM Plex Mono нет «№» */

        @container (aspect-ratio < 1) {
          .t-brutal .content {
            grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
            grid-template-rows: auto 1fr 1fr auto auto;
            grid-template-areas: "head head" "who who" "lessons art" "msg msg" "school meta";
          }
        }
      `,
      bg(w, h, u) {
        let lines = '';
        for (let x = 5 * u; x < w; x += 5 * u) lines += `<line x1="${r2(x)}" y1="0" x2="${r2(x)}" y2="${h}"/>`;
        for (let y = 5 * u; y < h; y += 5 * u) lines += `<line x1="0" y1="${r2(y)}" x2="${w}" y2="${r2(y)}"/>`;
        return svg(`0 0 ${w} ${h}`, `<g stroke="#0b0b0b" stroke-opacity=".08" stroke-width="${r2(.12 * u)}">${lines}</g>`);
      },
      // штрихкод из номера сертификата
      art(w, h, u, state) {
        const seed = [...(state.number || '0')].reduce((a, c) => a * 31 + c.charCodeAt(0), 7);
        const rnd = mulberry32(seed);
        let x = 0, bars = '';
        while (x < 100) {
          const bw = [.8, 1.6, 2.6][Math.floor(rnd() * 3)];
          if (x + bw > 100) break;
          bars += `<rect x="${r2(x)}" y="0" width="${bw}" height="50"/>`;
          x += bw + [.8, 1.4][Math.floor(rnd() * 2)];
        }
        return svg('0 0 100 50', `<g fill="#fbfaf5">${bars}</g>`);
      },
    },

    /* ---------------- Конструктивизм ---------------- */
    {
      id: 'constr',
      name: 'Конструктивизм',
      swatch: `radial-gradient(circle at 70% 50%, #d42a1e 0 27%, transparent 28%),
               linear-gradient(#161412,#161412) 0 0/7% 100% no-repeat, #ebe0c8`,
      fonts: ['Oswald:wght@300;500;600;700', 'Rubik Mono One'],
      css: `
        .t-constr {
          --bg: radial-gradient(ellipse at 40% 40%, #f1e8d3, #e4d7bb); --shade-color: #ebe0c8;
          --ink: #161412; --paper: #f4ead6; --red: #d42a1e;
          --pad: 8cqmin 7cqmin 7cqmin 10cqmin;
          font-family: Oswald, sans-serif;
        }
        .t-constr .content {
          gap: 2.4em 4em;
          grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr);
          grid-template-rows: auto auto 1fr auto;
          grid-template-areas: "head lessons" "who lessons" "msg lessons" "school meta";
        }
        .t-constr .art { grid-area: lessons; }

        .t-constr .eyebrow { font-size: 2em; font-weight: 500; letter-spacing: .32em; text-transform: uppercase; color: var(--red); }
        .t-constr .title { font: 4.2em/1.05 'Rubik Mono One', sans-serif; text-transform: uppercase; margin-top: .25em; }

        .t-constr .for {
          display: inline-block; background: var(--ink); color: var(--paper); font-size: 2em; font-weight: 500;
          letter-spacing: .2em; text-transform: uppercase; padding: .1em .6em .15em; margin-bottom: .6em;
        }
        .t-constr .name { white-space: normal; font: 700 calc(12em * var(--fit, 1))/.92 Oswald, sans-serif; text-transform: uppercase; }

        .t-constr .lessons {
          align-self: center; justify-self: center; max-width: 64%;
          display: flex; flex-direction: column; align-items: center; text-align: center; color: var(--paper);
        }
        .t-constr .num { font: 15em/1 'Rubik Mono One', sans-serif; }
        .t-constr .unit { font-size: 3.2em; font-weight: 600; letter-spacing: .14em; text-transform: uppercase; }
        .t-constr .lessons.many .num { font-size: 4.2em; line-height: 1.15; }

        .t-constr .msg { align-self: end; }
        .t-constr .msg .text { font-size: 2.5em; font-weight: 300; line-height: 1.35; border-left: .35em solid var(--red); padding-left: .8em; }
        .t-constr .msg .from { font-size: 2em; font-weight: 500; letter-spacing: .1em; text-transform: uppercase; margin-top: .6em; }

        .t-constr .school small { font-size: 1.7em; font-weight: 500; letter-spacing: .25em; text-transform: uppercase; color: var(--red); }
        .t-constr .school b { font-size: 4em; font-weight: 700; line-height: 1.05; text-transform: uppercase; }

        .t-constr .meta { align-self: end; text-align: right; }
        .t-constr .meta > div { font-size: 1.8em; letter-spacing: .08em; text-transform: uppercase; line-height: 1.5; }

        /* QR — агит-плашка под кругом, на острие клина; номер и срок уезжают под школу */
        .t-constr .content:has(.qr:not(.empty)) {
          grid-template-rows: auto auto 1fr auto auto;
          grid-template-areas: "head lessons" "who lessons" "msg lessons" "school qr" "meta qr";
        }
        .t-constr .content:has(.qr:not(.empty)) .meta { text-align: left; align-self: start; }
        .t-constr .qr:not(.empty) {
          grid-area: qr; display: block; position: relative; justify-self: end; align-self: end;
          width: 21em; aspect-ratio: 1; margin-top: 3em; padding: 1.4em;
          background: var(--paper); border: .7em solid var(--ink); color: var(--ink);
        }
        .t-constr .qr::before {
          content: 'ЗВОНИ!'; position: absolute; left: -1.2em; top: -1.3em;
          transform: rotate(-8deg); transform-origin: left bottom;
          font: 2.1em/1 'Rubik Mono One', sans-serif; padding: .35em .6em .3em; white-space: nowrap;
          background: var(--red); color: var(--paper);
        }
        .t-constr .qr[data-kind="link"]::before { content: 'СКАНИРУЙ!'; }

        @container (aspect-ratio < 1) {
          .t-constr .content {
            grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
            grid-template-rows: auto 1fr auto auto auto;
            grid-template-areas: "head head" "lessons lessons" "who who" "msg msg" "school meta";
          }
          .t-constr .content:has(.qr:not(.empty)) {
            grid-template-rows: auto 1fr auto auto auto auto;
            grid-template-areas: "head head" "lessons lessons" "who who" "msg msg" "school qr" "meta qr";
          }
        }
      `,
      deco(w, h, u) {
        let lines = '';
        for (let i = 0; i < 3; i++) {
          const o = (14 + i * 3) * u;
          lines += `<line x1="${r2(w - o)}" y1="0" x2="${w}" y2="${r2(o)}"/>`;
        }
        return svg(`0 0 ${w} ${h}`, `
          <rect x="0" y="0" width="${r2(3.2 * u)}" height="${h}" fill="#161412"/>
          <rect x="0" y="${r2(8 * u)}" width="${r2(3.2 * u)}" height="${r2(18 * u)}" fill="#d42a1e"/>
          <g stroke="#161412" stroke-width="${r2(.35 * u)}">${lines}</g>`);
      },
      // красный круг с клином; рисуется в квадрате по центру зоны .lessons.
      // С QR в альбомной клин смотрит вниз — на плашку с QR
      art(w, h, u, state) {
        const toQr = w >= h && !!(state.qr || '').trim();
        const wedge = toQr ? '70,76 98,134 78,140' : '76,62 170,90 170,116';
        return svg('0 0 100 100', `
          <line x1="-70" y1="118" x2="150" y2="-10" stroke="#161412" stroke-width=".8"/>
          <circle cx="50" cy="50" r="46" fill="#d42a1e"/>
          <polygon points="${wedge}" fill="#161412"/>`, 'xMidYMid meet');
      },
    },
  ];

  const fonts = [...new Set(DESIGNS.flatMap(d => d.fonts || []))]
    .map(f => 'family=' + f.replace(/ /g, '+')).join('&');
  document.head.insertAdjacentHTML('beforeend',
    `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?${fonts}&display=swap">` +
    `<style>${BASE_CSS}${DESIGNS.map(d => d.css).join('\n')}</style>`);

  window.DESIGNS = DESIGNS;
})();

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const backup = path.join(root, 'src/compartido/estilos/_restore2.css');

function loadSourceCss() {
  if (fs.existsSync(backup)) return fs.readFileSync(backup, 'utf8');
  return execSync('git show 2c89e76:frontend/web-app/src/compartido/estilos/global.css', {
    cwd: path.join(root, '..', '..'),
    encoding: 'utf8',
  });
}

const css = loadSourceCss();

/** @type {Record<string, RegExp[]>} */
const buckets = {
  global: [
    /^:root\b/,
    /^\*/,
    /^body\b/,
    /^button\b/,
    /^input\b/,
    /^@keyframes\b/,
    /^@media\b/,
    /\.app-page-shell\b/,
    /\.app-topbar-standalone\b/,
    /\.page-kicker\b/,
    /\.compact-logout\b/,
    /\.card-hint\b/,
    /\.icon-wrap\b/,
    /\.icon-svg\b/,
    /\.brand-logo\b/,
    /\.field-icon\b/,
    /\.user-avatar\b/,
    /\.field-block\b/,
    /\.field-control\b/,
    /\.role-picker\b/,
    /\.role-chip\b/,
    /\.system-message\b/,
    /\.text-button\b/,
    /\.back-link\b/,
    /\.primary-auth-button\b/,
    /\.primary-setup-button\b/,
    /\.resolve-button\b/,
    /\.generate-button\b/,
    /\.secondary-button\b/,
    /\.wide\b/,
    /\.divider\b/,
    /\.social-row\b/,
    /\.level-progress\b/,
    /\.mini-progress\b/,
    /\.metric-meter\b/,
    /\.empty-hint\b/,
    /\.detail-panel\b/,
    /\.detail-header\b/,
  ],
  auth: [
    /\.auth-shell\b/,
    /\.auth-hero\b/,
    /\.auth-card\b/,
    /\.auth-heading\b/,
    /\.auth-form\b/,
    /\.auth-options\b/,
    /\.auth-switch\b/,
    /\.auth-mode-icon\b/,
    /\.small-mark\b/,
    /\.logo-card\b/,
    /\.lab-preview\b/,
    /\.beam\b/,
    /\.orbit\b/,
    /\.core\b/,
  ],
  onboarding: [
    /\.onboarding-shell\b/,
    /\.setup-/,
    /\.option-cards\b/,
    /\.option-icon\b/,
    /\.science-tip\b/,
    /\.tip-grid\b/,
  ],
  summary: [
    /\.summary-shell\b/,
    /\.summary-grid\b/,
    /\.summary-main-card\b/,
    /\.summary-side\b/,
    /\.route-band\b/,
    /\.route-feature-icons\b/,
    /\.check-badge\b/,
    /\.focus-visual\b/,
  ],
  retos: [
    /\.physics-shell\b/,
    /\.app-topbar\b/,
    /\.brand-cluster\b/,
    /\.brand-mark\b/,
    /\.player-stats\b/,
    /\.level-chip\b/,
    /\.stat-pill\b/,
    /\.xp-pill\b/,
    /\.gem-pill\b/,
    /\.profile-badge\b/,
    /\.workspace-grid\b/,
    /\.left-nav\b/,
    /\.nav-item\b/,
    /\.nav-label\b/,
    /\.challenge-stage\b/,
    /\.challenge-toolbar\b/,
    /\.question-progress\b/,
    /\.timer\b/,
    /\.exercise-panel\b/,
    /\.student-step-banner\b/,
    /\.question-copy\b/,
    /\.options-grid\b/,
    /\.answer-option\b/,
    /\.exercise-actions\b/,
    /\.tips-bar\b/,
    /\.session-boot\b/,
  ],
  feedback: [
    /\.feedback-/,
    /\.mission-complete-actions\b/,
    /\.gemini-badge\b/,
    /\.reward-/,
    /\.success-icon\b/,
  ],
  diagrama: [/\.vector-diagram\b/, /\.motion-aura\b/, /\.block\b/, /\.arrow-line\b/, /\.ground-line\b/],
  ia: [
    /\.ai-panel\b/,
    /\.panel-title\b/,
    /\.ai-card\b/,
    /\.analytics-card\b/,
    /\.metric-row\b/,
    /\.metric-icon\b/,
    /\.panel-ai-badge\b/,
    /\.ai-data-sources\b/,
    /\.recommendation-box\b/,
    /\.ai-metric-chip\b/,
    /\.ai-tags\b/,
    /\.ai-tag\b/,
    /\.ai-pattern-list\b/,
    /\.suggestion-row\b/,
  ],
  gestion: [
    /\.management-/,
    /\.inline-form\b/,
    /\.data-list\b/,
    /\.data-table\b/,
    /\.table-scroll\b/,
    /\.action-cell\b/,
  ],
};

const files = {
  global: path.join(root, 'src/compartido/estilos/global.css'),
  auth: path.join(root, 'src/modulos/autenticacion/paginas/PaginaAutenticacion.css'),
  hero: path.join(root, 'src/modulos/autenticacion/componentes/HeroAutenticacion.css'),
  onboarding: path.join(root, 'src/modulos/estudiante/paginas/PaginaOnboarding.css'),
  summary: path.join(root, 'src/modulos/estudiante/paginas/PaginaResumen.css'),
  retos: path.join(root, 'src/modulos/estudiante/paginas/PaginaRetos.css'),
  feedback: path.join(root, 'src/modulos/estudiante/componentes/RetroalimentacionEjercicio.css'),
  diagrama: path.join(root, 'src/modulos/estudiante/componentes/DiagramaFisica.css'),
  ia: path.join(root, 'src/modulos/estudiante/componentes/PanelLateralIa.css'),
  profesor: path.join(root, 'src/modulos/profesor/paginas/PaginaProfesor.css'),
  admin: path.join(root, 'src/modulos/administrador/paginas/PaginaAdministrador.css'),
};

function classifyRule(selectorText) {
  const selectors = selectorText
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const scores = Object.fromEntries(Object.keys(buckets).map((k) => [k, 0]));
  for (const sel of selectors) {
    for (const [bucket, patterns] of Object.entries(buckets)) {
      if (patterns.some((re) => re.test(sel))) scores[bucket] += 1;
    }
  }
  const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  if (!best || best[1] === 0) return 'global';
  return best[0];
}

function parseRules(text) {
  const rules = [];
  let i = 0;
  while (i < text.length) {
    while (i < text.length && /\s/.test(text[i])) i += 1;
    if (i >= text.length) break;
    if (text[i] === '@') {
      const start = i;
      let depth = 0;
      let seenBrace = false;
      while (i < text.length) {
        if (text[i] === '{') {
          depth += 1;
          seenBrace = true;
        } else if (text[i] === '}') {
          depth -= 1;
          if (seenBrace && depth === 0) {
            i += 1;
            break;
          }
        }
        i += 1;
      }
      rules.push({ selector: text.slice(start, text.indexOf('{', start)).trim(), body: text.slice(start, i), type: 'at' });
      continue;
    }
    const selStart = i;
    const brace = text.indexOf('{', i);
    if (brace === -1) break;
    const selector = text.slice(selStart, brace).trim();
    let depth = 0;
    i = brace;
    while (i < text.length) {
      if (text[i] === '{') depth += 1;
      else if (text[i] === '}') {
        depth -= 1;
        if (depth === 0) {
          i += 1;
          break;
        }
      }
      i += 1;
    }
    rules.push({ selector, body: text.slice(selStart, i), type: 'rule' });
  }
  return rules;
}

const parsed = parseRules(css);
const out = Object.fromEntries(Object.keys(buckets).map((k) => [k, []]));

for (const rule of parsed) {
  if (rule.type === 'at') {
    out.global.push(rule.body);
    continue;
  }
  const bucket = classifyRule(rule.selector);
  out[bucket].push(rule.body);
}

// Shared shell min-height block
const shellRule = parsed.find((r) => r.selector?.includes('.auth-shell') && r.selector?.includes('.physics-shell'));
if (shellRule) {
  out.global.unshift(shellRule.body);
  for (const b of ['auth', 'onboarding', 'summary', 'retos']) {
    out[b] = out[b].filter((chunk) => chunk !== shellRule.body);
  }
}

function relHeader(name, depth) {
  const up = '../'.repeat(depth);
  return `/* Estilos de ${name} */\n@import '${up}compartido/estilos/global.css';\n\n`;
}

const heroPattern = /\.(auth-hero|logo-card|lab-preview|beam|orbit|core)\b/;

const globalHeader = `/* Design system y estilos compartidos (formularios, botones, layout base) */\n`;
fs.writeFileSync(files.global, globalHeader + out.global.join('\n\n') + '\n', 'utf8');

const authChunks = out.auth.filter((c) => !heroPattern.test(c) || /\.auth-shell\b/.test(c));
const heroChunks = out.auth.filter((c) => heroPattern.test(c));

fs.writeFileSync(files.auth, relHeader('página de autenticación', 3) + authChunks.join('\n\n') + '\n', 'utf8');
fs.writeFileSync(files.hero, relHeader('hero autenticación', 3) + heroChunks.join('\n\n') + '\n', 'utf8');

fs.writeFileSync(files.onboarding, relHeader('onboarding', 3) + out.onboarding.join('\n\n') + '\n', 'utf8');
fs.writeFileSync(files.summary, relHeader('resumen estudiante', 3) + out.summary.join('\n\n') + '\n', 'utf8');
fs.writeFileSync(files.retos, relHeader('retos / ejercicios', 3) + out.retos.join('\n\n') + '\n', 'utf8');
fs.writeFileSync(files.feedback, relHeader('retroalimentación', 3) + out.feedback.join('\n\n') + '\n', 'utf8');
fs.writeFileSync(files.diagrama, relHeader('diagrama física', 3) + out.diagrama.join('\n\n') + '\n', 'utf8');
fs.writeFileSync(files.ia, relHeader('panel IA', 3) + out.ia.join('\n\n') + '\n', 'utf8');
fs.writeFileSync(files.profesor, relHeader('panel profesor', 3) + out.gestion.join('\n\n') + '\n', 'utf8');
fs.writeFileSync(files.admin, relHeader('panel administrador', 3) + out.gestion.join('\n\n') + '\n', 'utf8');

console.log('Split complete:', Object.fromEntries(Object.entries(out).map(([k, v]) => [k, v.length])));

import { readFileSync, writeFileSync } from "node:fs";

const FILES = process.argv.slice(2);

// Convert `<img src={NGAJI_CERIA_ASSETS.x} ...attrs />` (and ternary variants)
// into React component JSX: <NGAJI_CERIA_ASSETS.x className=... />.
// Keeps attrs except src/alt/draggable; appends alt to aria-label only when static & safe.
for (const file of FILES) {
  let src = readFileSync(file, "utf8");
  const before = src;

  // P1: single-line img
  src = src.replace(
    /<img\s+src=\{([^}]*NGAJI_CERIA_ASSETS\.[\w]+[^}]*)\}((?:[^{}]|\{[^}]*\})*)\/>/g,
    (m, expr, attrs) => {
      const cls = (attrs.match(/className="([^"]*)"/) || [])[1] ?? 'undefined';
      const classNameAttr = /className=/.test(attrs)
        ? ` className={${cls.startsWith('"') ? `'${cls.slice(1, -1)}'` : cls}}`
        : "";
      const label = (attrs.match(/alt="([^"]*)"/) || [])[1];
      const ariaAttr = label && !/[${}]/.test(label) ? ` aria-label="${label}"` : "";
      const tern = expr.match(/^(.+?)\s*\?\s*NGAJI_CERIA_ASSETS\.(\w+)\s*:\s*NGAJI_CERIA_ASSETS\.(\w+)$/);
      if (tern) {
        const [, cond, a, b] = tern;
        return `{(${cond.trim()}) ? <NGAJI_CERIA_ASSETS.${a}${classNameAttr}${ariaAttr} /> : <NGAJI_CERIA_ASSETS.${b}${classNameAttr}${ariaAttr} />}`;
      }
      if (!/^NGAJI_CERIA_ASSETS\.\w+$/.test(expr.trim())) return m; // unknown expr, keep
      return `<${expr.trim()}${classNameAttr}${ariaAttr} />`;
    },
  );

  // P2: multi-line img with src on its own line(s):  <img\n...src={...\n...NGAJI...}... />
  src = src.replace(
    /<img([\s\S]{0,600}?src=\{([^}]*NGAJI_CERIA_ASSETS\.[\w]+[^}]*)\}([\s\S]{0,400}?))\/>/g,
    (m, attrsAll, expr, tail) => {
      const clsMatch = attrsAll.match(/className="([^"]*)"/) || attrsAll.match(/className=\{([^}]*)\}/);
      if (!clsMatch) return m;
      const label = (attrsAll.match(/alt=["'`]([^"'`]*)["'`]/) || [])[1];
      const isTernLine = /NGAJI_CERIA_ASSETS\.\w+\s*$/m.test(expr.trim().split(/\n/).pop() || "") && expr.includes("?");
      if (isTernLine) {
        const [cond, a, b] = parseTernary(expr);
        const classNameAttr = /className/.test(attrsAll) ? ` className={${normalize(clsMatch)}}` : "";
        const ariaAttr = label && !/[${}]/.test(label) ? ` aria-label="${label}"` : "";
        return `{(${cond.trim()}) ? <NGAJI_CERIA_ASSETS.${a.trim()}${classNameAttr}${ariaAttr} /> : <NGAJI_CERIA_ASSETS.${b.trim()}${classNameAttr}${ariaAttr} />}`;
      }
      if (!expr.trim().startsWith("NGAJI_CERIA_ASSETS.")) return m;
      return `<${expr.trim()}${/className/.test(attrsAll) ? ` className={${normalize(clsMatch)}}` : ""}${label && !/[${}]/.test(label) ? ` aria-label="${label}"` : ""} />`;
    },
  );

  // unknown expr, keep
  function normalize(clsMatch) {
    const v = clsMatch[1];
    return v.startsWith('"') ? `'${v.slice(1, -1)}'` : v.replace(/^["']|["']$/g, "");
  }

  function parseTernary(expr) {
    // expr: `X\n? A\n: B` where A/B are `NGAJI_CERIA_ASSETS.x` refs
    const qMark = expr.indexOf("?");
    const colon = expr.lastIndexOf(":");
    return [expr.slice(0, qMark), expr.slice(qMark + 1, colon), expr.slice(colon + 1)];
  }

  if (src !== before) {
    writeFileSync(file, src);
    console.log("patched", file);
  }
}

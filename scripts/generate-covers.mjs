import { writeFileSync, mkdirSync } from "node:fs";
import { comics } from "../src/data/mockData.js";
// Original editorial placeholders: no downloaded artwork or publisher logos.
const palettes = [
  ["#234b59", "#f0be70", "#e5d9ba"],
  ["#b25e35", "#f4d16f", "#f6e7bc"],
  ["#404939", "#c4b17c", "#d6d6b6"],
  ["#292937", "#ae504b", "#dcd6c9"],
  ["#468baf", "#f2d6a5", "#e1eff1"],
  ["#253d68", "#be995b", "#ede0c3"],
  ["#4f4162", "#d9a0a6", "#ebddd9"],
  ["#294d44", "#d19063", "#eee0c0"],
  ["#91aaa2", "#ecb6ad", "#243c3b"],
  ["#2c5874", "#7cc2db", "#e0e7e2"],
  ["#9e403a", "#dfb887", "#efdfba"],
  ["#bf613f", "#343b33", "#f0d595"],
  ["#51776c", "#b9c6a1", "#eee5c9"],
  ["#b97033", "#ede0b9", "#3d362c"],
  ["#8c899e", "#e1b6ae", "#f5ecd9"],
  ["#b5767c", "#efd6b0", "#423745"],
];
const escape = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
mkdirSync("public/covers", { recursive: true });
comics.forEach((c, i) => {
  const [bg, accent, ink] = palettes[i % palettes.length];
  const words = c.title.split(" ");
  const lines = [];
  let line = "";
  for (const word of words) {
    if ((line + " " + word).trim().length > 17 && line) {
      lines.push(line);
      line = word;
    } else line = (line + " " + word).trim();
  }
  if (line) lines.push(line);
  const title = lines
    .map(
      (text, index) =>
        `<text x="32" y="${88 + index * 43}" fill="${ink}" font-size="${lines.length > 2 ? 33 : 37}" font-weight="800" letter-spacing="-1">${escape(text)}</text>`,
    )
    .join("");
  const type = i % 4;
  const art =
    type === 0
      ? `<circle cx="235" cy="320" r="115" fill="${accent}"/><path d="M0 391L400 282V465H0Z" fill="${bg}"/><path d="M0 419Q100 325 190 420T400 381V490H0Z" fill="${ink}" opacity=".7"/><path d="M0 445Q100 354 205 450T400 403V530H0Z" fill="${bg}"/><path d="M152 353L210 248L225 353Z" fill="${ink}"/><path d="M228 353V276L280 353Z" fill="${ink}" opacity=".65"/><path d="M130 365H298L275 383H148Z" fill="${ink}"/>`
      : type === 1
        ? `<circle cx="210" cy="330" r="120" fill="${accent}"/><path d="M90 458L201 226L225 364L318 305L254 460Z" fill="${bg}"/><path d="M130 487L207 338L228 435L272 384L251 487Z" fill="${ink}"/><path d="M29 267L72 242M320 400L372 367M308 226L352 196" stroke="${ink}" stroke-width="4"/><circle cx="70" cy="395" r="12" fill="${ink}"/>`
        : type === 2
          ? `<circle cx="200" cy="333" r="126" fill="none" stroke="${accent}" stroke-width="28"/><circle cx="200" cy="333" r="82" fill="none" stroke="${ink}" stroke-width="2"/><path d="M150 460V276L200 226L250 276V460" fill="${accent}"/><path d="M173 460V297L200 267L227 297V460" fill="${bg}"/><path d="M43 465L160 348M241 348L355 465" stroke="${ink}" stroke-width="2"/><circle cx="200" cy="333" r="12" fill="${ink}"/>`
          : `<path d="M55 255L292 220L347 419L110 455Z" fill="${accent}"/><path d="M106 272L248 254L291 409L149 425Z" fill="${bg}"/><circle cx="201" cy="330" r="43" fill="${ink}"/><path d="M183 310L223 350M181 351L223 309" stroke="${bg}" stroke-width="6"/><path d="M40 330H100M291 330H358M201 188V240M201 436V484" stroke="${ink}" stroke-width="2"/>`;
  writeFileSync(
    `public/covers/${c.id}.svg`,
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="560" viewBox="0 0 400 560"><rect width="400" height="560" fill="${bg}"/><rect x="10" y="10" width="380" height="540" rx="2" fill="none" stroke="${ink}" opacity=".25"/><g font-family="Segoe UI,Arial,sans-serif"><text x="33" y="35" font-size="10" fill="${ink}" letter-spacing="3">STORYRENT / THE READING ROOM</text>${title}<text x="33" y="${100 + lines.length * 43}" font-size="11" fill="${ink}" opacity=".8">${escape(c.tagline)}</text>${art}<path d="M30 508H370" stroke="${ink}" opacity=".3"/><text x="32" y="533" font-size="10" fill="${ink}" letter-spacing="2">ILLUSTRATED EDITION</text><text x="365" y="535" text-anchor="end" font-size="21" font-weight="600" fill="${ink}">${String(i + 1).padStart(2, "0")}</text></g></svg>`,
  );
});
console.log(`Generated ${comics.length} original SVG covers.`);

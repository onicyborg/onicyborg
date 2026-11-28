import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const icons = {
  "nestjs": "NestJS",
  "laravel": "Laravel",
  "php": "PHP",
  "nodedotjs": "Node.js",
  "typescript": "TypeScript",
  "prisma": "Prisma",
  "postgresql": "PostgreSQL",
  "mysql": "MySQL",
  "cloudflare": "Cloudflare R2",
  "swagger": "Swagger",
  "postman": "Postman",
  "docker": "Docker",
  "nginx": "Nginx",
  "nextdotjs": "Next.js",
  "react": "React",
  "tailwindcss": "Tailwind CSS",
  "vercel": "Vercel",
  "linux": "Linux",
  "git": "Git",
  "github": "GitHub"
};
const themes = {
  dark: ['#0a1620', '#13303d', '#8fb3c0'],
  light: ['#f4fafc', '#c8dce3', '#3b5a66'],
};

for (const [slug, label] of Object.entries(icons)) {
  let source;
  if (process.argv[2]) {
    source = await readFile(resolve(process.argv[2], slug + '.svg'), 'utf8');
  } else {
    const response = await fetch('https://cdn.jsdelivr.net/npm/simple-icons@11.15.0/icons/' + slug + '.svg');
    if (!response.ok) throw new Error(slug + ': ' + response.status);
    source = await response.text();
  }
  const path = source.match(/<path\b[^>]*\bd="([^"]+)"/)?.[1];
  if (!path) throw new Error('Missing icon path for ' + slug);
  for (const [theme, [background, border, ink]] of Object.entries(themes)) {
    const folder = new URL('../assets/icons/' + theme + '/', import.meta.url);
    await mkdir(folder, { recursive: true });
    await writeFile(new URL(slug + '.svg', folder), `<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56">
  <title>${label}</title>
  <rect x=".5" y=".5" width="55" height="55" rx="12" fill="${background}" stroke="${border}"/>
  <svg x="14" y="14" width="28" height="28" viewBox="0 0 24 24"><path fill="${ink}" d="${path}"/></svg>
</svg>\n`);
  }
}

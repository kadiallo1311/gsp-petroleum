#!/usr/bin/env node
// Génère js/config.js depuis les variables d'environnement Vercel
// Exécuté automatiquement lors du build (défini dans vercel.json)

const fs = require('fs');
const path = require('path');

const url = process.env.SUPABASE_URL || '';
const key = process.env.SUPABASE_ANON_KEY || '';

if (!url || !key) {
  console.warn('[build] SUPABASE_URL ou SUPABASE_ANON_KEY manquant — config.js généré vide');
}

const content = `/* Généré automatiquement au build — NE PAS MODIFIER */
window.GSP_SUPABASE_CONFIG = {
  url: '${url}',
  key: '${key}',
};
`;

const dest = path.join(__dirname, 'js', 'config.js');
fs.writeFileSync(dest, content, 'utf8');
console.log('[build] js/config.js généré avec succès');

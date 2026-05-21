/* ================================================================
   GSP — Bilingual System FR / EN
   Automatic browser detection + manual override via localStorage
   ================================================================ */

const GSP_TRANSLATIONS = {
  fr: {
    /* ── Navigation ── */
    'nav.home':        'Accueil',
    'nav.activities':  'Activités',
    'nav.partners':    'Partenariats',
    'nav.team':        'Équipe',
    'nav.contact':     'Contact',
    'nav.cta':         'Nous contacter',
    /* ── Hero ── */
    'hero.slide0.badge': 'Industries Extractives & Minières',
    'hero.slide0.loc':   'Kédougou — Sénégal',
    'hero.slide1.badge': 'Distribution d\'Hydrocarbures',
    'hero.slide1.loc':   'Axe Dakar-Thiès — Sénégal',
    'hero.eyebrow':      'Groupe Industriel Multi-Sectoriel',
    'hero.title':        'Construire les champions<br/><em style="color:#FF6B00;font-style:italic">industriels</em> de<br/>l\'Afrique de l\'Ouest.',
    'hero.subtitle':     'Du Sénégal vers la zone CEDEAO. Des partenariats internationaux structurés. Une ambition régionale assumée.',
    'hero.btn1':         'Découvrir nos activités',
    'hero.btn2':         'Nous contacter',
    'hero.stat1.num':    '120 000',
    'hero.stat1.label':  'Tonnes/an granite — KEDA',
    'hero.stat2.num':    '5',
    'hero.stat2.label':  'Branches d\'activités',
    'hero.stat3.num':    '6',
    'hero.stat3.label':  'Partenariats internationaux',
    'hero.stat4.num':    'NURA',
    'hero.stat4.label':  '1re franchise en Afrique de l\'Ouest',
    /* ── Section Groupe ── */
    'group.badge':    'Notre Groupe',
    'group.title':    'Une plateforme industrielle articulée<br/>autour de cinq branches',
    'group.p1':       'General Service Petroleum (GSP) est un groupe industriel sénégalais fondé en 2021, opérant dans les industries extractives, la distribution d\'hydrocarbures, l\'économie circulaire, la santé numérique et la logistique. Ancré au Sénégal, le Groupe déploie progressivement une plateforme industrielle intégrée à vocation régionale, articulée autour de cinq branches complémentaires.',
    'group.p2':       'Nos partenariats avec KEDA Industrial Group (Chine), Fujifilm DKH LLP (Japon), Nordic Eco Innovation (Finlande) et Comtech Group (Royaume-Uni) témoignent de notre approche : mobiliser des expertises internationales de premier plan au service d\'une ambition industrielle enracinée en Afrique de l\'Ouest.',
    /* ── Activities overview ── */
    'act.badge':  'Nos Activités',
    'act.title':  'Cinq branches d\'activités complémentaires',
    'act.a1.h':   'Industries Extractives',
    'act.a1.p':   'Exploitation de matériaux extractifs (granite, kaolin, argile) destinés aux industries de la céramique et du ciment, depuis nos sites au Sénégal.',
    'act.a2.h':   'Distribution d\'Hydrocarbures',
    'act.a2.p':   'Distribution de produits pétroliers liquides sous licence officielle (arrêté ministériel n° 001481 du 19 janvier 2023), avec un réseau de stations-service en déploiement.',
    'act.a3.h':   'Santé Numérique',
    'act.a3.p':   'Déploiement du premier réseau de centres de dépistage médical assisté par IA en Afrique de l\'Ouest, en partenariat avec Fujifilm via la franchise NURA.',
    'act.a4.h':   'Économie Circulaire',
    'act.a4.p':   'Production de bio-méthanol, biogaz, biofertilisants et valorisation des déchets plastiques en matériaux composites, dans un partenariat triangulaire Sénégal-Finlande-UE.',
    'act.a5.h':   'Logistique Industrielle',
    'act.a5.p':   'Transport de matériaux extractifs entre nos sites de production et les industries clientes. Une flotte dédiée, en cours de constitution sous crédit-bail institutionnel, garantit la maîtrise opérationnelle de nos engagements contractuels.',
    'act.kwm.tag': 'Expansion régionale',
    'act.kwm.h':   'Kairos West Mining',
    'act.kwm.p':   'Kairos West Mining est la société d\'expansion du Groupe GSP dans la sous-région ouest-africaine, dédiée aux activités minières. Elle est actuellement en cours de constitution.',
    'act.more':    'En savoir plus',
    /* ── Partners ── */
    'part.badge':  'Notre Réseau',
    'part.title':  'Des partenariats structurés sur quatre continents',
    'part.sub':    'Le Groupe GSP s\'appuie sur six partenariats internationaux, sélectionnés pour la profondeur de leur expertise, leur capacité à accélérer notre développement et leur complémentarité avec notre modèle industriel.',
    'part.more':   'Découvrir nos partenariats →',
    /* ── Compliance ── */
    'comp.badge':  'Réglementation & Gouvernance',
    'comp.title':  'Un opérateur structuré et conforme',
    'comp.c1.h':   'Licence hydrocarbures',
    'comp.c1.p':   'Arrêté ministériel n° 001481 du 19 janvier 2023, accordée pour 10 ans renouvelables par le Ministère du Pétrole et des Énergies.',
    'comp.c2.h':   'Conformité OHADA',
    'comp.c2.p':   'Société constituée et opérée selon les standards de l\'Organisation pour l\'Harmonisation en Afrique du Droit des Affaires.',
    'comp.c3.h':   'Standards SYSCOHADA',
    'comp.c3.p':   'États financiers annuels établis selon le référentiel SYSCOHADA et certifiés par un cabinet d\'expertise comptable agréé.',
    'comp.c4.h':   'Visée ISCC EU',
    'comp.c4.p':   'Alignement de notre projet bio-méthanol sur les standards internationaux ISCC EU de décarbonation pour l\'industrie et le transport maritime.',
    /* ── Stats ── */
    'stats.badge': 'Perspectives',
    'stats.title': 'Une dynamique en construction',
    /* ── CTA ── */
    'cta.title':  'Construisons ensemble',
    'cta.sub':    'Partenaires, investisseurs, institutions : nous sommes à votre disposition pour un premier échange.',
    'cta.btn1':   'Nous contacter',
    'cta.btn2':   'Découvrir notre équipe',
    /* ── Footer ── */
    'footer.nav': 'Navigation',
    'footer.contact': 'Contact',
    'footer.rights': 'Tous droits réservés.',
    /* ── Contact page ── */
    'contact.title':    'Nous Contacter',
    'contact.sub':      'Une question, un projet, un partenariat ? Notre équipe vous répond.',
    'contact.form.name':    'Nom complet',
    'contact.form.email':   'Adresse e-mail',
    'contact.form.phone':   'Téléphone (optionnel)',
    'contact.form.subject': 'Objet',
    'contact.form.message': 'Votre message',
    'contact.form.submit':  'Envoyer le message',
    'contact.info.addr':    'Adresse',
    'contact.info.email':   'E-mail',
    'contact.info.phone':   'Téléphone',
    'contact.form.placeholder.name':    'Votre nom',
    'contact.form.placeholder.company': 'Nom de votre entreprise',
    'contact.form.placeholder.message': 'Décrivez votre demande en détail…',
    'contact.form.opt.default':         'Sélectionnez un objet',
    'contact.form.opt.partenariat':     'Proposition de partenariat',
    'contact.form.opt.investissement':  'Opportunité d\'investissement',
    'contact.form.opt.approvisionnement': 'Approvisionnement / Commande',
    'contact.form.opt.presse':          'Demande presse / médias',
    'contact.form.opt.emploi':          'Candidature spontanée',
    'contact.form.opt.autre':           'Autre demande',
    /* ── Equipe page ── */
    'team.badge':       'Direction Associée',
    'team.title':       'Notre Équipe Dirigeante',
    'team.subtitle':    'Une direction associée aux profils complémentaires',
    'team.intro':       'Le Groupe GSP est conduit par une direction associée aux profils complémentaires, articulant expertise opérationnelle, vision de long terme et accès aux institutions.',
    'team.banner.sub':  'Une direction associée engagée sur le long terme',
    'team.gov.h2':      'Une gouvernance en cours de consolidation',
    'team.conseils.h2': 'Des conseils experts à chaque étape',
    /* ── Activités page (nav + sections) ── */
    'act.nav.extract':    'Industries Extractives',
    'act.nav.hydro':      'Hydrocarbures',
    'act.nav.sante':      'Santé Numérique',
    'act.nav.circulaire': 'Économie Circulaire',
    'act.nav.logistique': 'Logistique',
    'act.nav.fiches':     'Fiches Techniques',
    'act.badge1':         'Extraction',
    'act.badge2':         'Distribution d\'Hydrocarbures',
    'act.badge3':         'Preventis Health Africa',
    'act.badge4':         'CITABEL',
    'act.badge5':         'Flotte Industrielle',
    'act.kwm.subtitle':   'Notre véhicule d\'expansion sous-régional',
    'act.kwm.mou':        'Mémorandum d\'Entente signé le 7 mai 2026.<br/>Constitution juridique programmée pour le second semestre 2026.',
    'act.hydro.h2':       'Une présence active<br/>sur les routes<br/><em style="color:#FF6B00;font-style:italic">du Sénégal</em>',
    'act.hydro.lic.title':'Licence officielle',
    'act.hydro.lic.sub':  'Ministère du Pétrole et des Énergies — Sénégal',
    'act.hydro.s1':       'Durée de la licence',
    'act.hydro.s2':       'Réseau en déploiement',
    'act.hydro.s3':       'Licence obtenue',
    'act.hydro.s4':       'Flotte certifiée',
    'act.hydro.scroll':   'Défiler',
    'act.fiche.badge':    'Matières Premières',
    'act.fiche.h2':       'Nos produits extractifs',
    'act.fiche.sub':      'Deux matériaux haute performance certifiés par des clients industriels de référence — KEDA Ceramics (Chine), Dangote Cement et CIMAF Sénégal.',
    'act.fiche.dl':       'Télécharger le PDF',
    'act.fiche.quote':    'Demander un devis',
    'act.fiche.cta.title':'Fiches Techniques Complètes',
    'act.fiche.cta.sub':  'Granite SF18B (GSP-GR-SF18B) + Kaolin Haute Alumine (GSP-KA-TC01) — Données chimiques, spécifications, conditionnement.',
    /* ── Partenariats page ── */
    'part.intro.h2': 'Des partenariats fondés sur l\'excellence mutuelle',
    'part.phil.h2':  'Le développement industriel africain<br/>se construit dans le dialogue',
    'part.cta.h2':   'Devenir partenaire de GSP',
    'part.cta.sub':  'Vous souhaitez proposer un partenariat ou explorer des synergies avec le Groupe GSP ? Contactez-nous directement.',
    'part.cta.btn':  'Proposer un partenariat',
    /* ── Page banners ── */
    'act.page.h1':      'Nos Activités',
    'act.page.sub':     'Cinq branches d\'activités complémentaires au service de l\'industrialisation ouest-africaine',
    'part.page.title':  'Nos Partenariats',
    'part.page.sub':    'Six partenariats internationaux structurés sur quatre continents.',
    'equipe.page.h1':   'Notre Équipe',
    'contact.page.h1':  'Nous Contacter',
    /* ── CTA shared ── */
    'cta.contact.btn':  'Nous contacter',
    'cta.team.btn':     'Découvrir notre équipe',
  },
  en: {
    /* ── Navigation ── */
    'nav.home':        'Home',
    'nav.activities':  'Activities',
    'nav.partners':    'Partnerships',
    'nav.team':        'Team',
    'nav.contact':     'Contact',
    'nav.cta':         'Contact Us',
    /* ── Hero ── */
    'hero.slide0.badge': 'Extractive & Mining Industries',
    'hero.slide0.loc':   'Kédougou — Senegal',
    'hero.slide1.badge': 'Hydrocarbon Distribution',
    'hero.slide1.loc':   'Dakar-Thiès Highway — Senegal',
    'hero.eyebrow':      'Multi-Sector Industrial Group',
    'hero.title':        'Building West Africa\'s<br/><em style="color:#FF6B00;font-style:italic">industrial</em><br/>champions.',
    'hero.subtitle':     'From Senegal to the ECOWAS zone. Structured international partnerships. A bold regional ambition.',
    'hero.btn1':         'Discover our activities',
    'hero.btn2':         'Contact us',
    'hero.stat1.num':    '120,000',
    'hero.stat1.label':  'Tonnes/year granite — KEDA',
    'hero.stat2.num':    '5',
    'hero.stat2.label':  'Business branches',
    'hero.stat3.num':    '6',
    'hero.stat3.label':  'International partnerships',
    'hero.stat4.num':    'NURA',
    'hero.stat4.label':  '1st franchise in West Africa',
    /* ── Section Groupe ── */
    'group.badge':    'Our Group',
    'group.title':    'An industrial platform built<br/>around five branches',
    'group.p1':       'General Service Petroleum (GSP) is a Senegalese industrial group founded in 2021, operating across extractive industries, hydrocarbon distribution, circular economy, digital health, and logistics. Anchored in Senegal, the Group is progressively building an integrated industrial platform with a regional scope, structured around five complementary branches.',
    'group.p2':       'Our partnerships with KEDA Industrial Group (China), Fujifilm DKH LLP (Japan), Nordic Eco Innovation (Finland) and Comtech Group (United Kingdom) reflect our approach: mobilising world-class international expertise in service of an industrial ambition deeply rooted in West Africa.',
    /* ── Activities overview ── */
    'act.badge':  'Our Activities',
    'act.title':  'Five complementary business branches',
    'act.a1.h':   'Extractive Industries',
    'act.a1.p':   'Extraction of raw materials (granite, kaolin, clay) for ceramics and cement industries, from our sites in Senegal.',
    'act.a2.h':   'Hydrocarbon Distribution',
    'act.a2.p':   'Distribution of liquid petroleum products under an official licence (ministerial order n° 001481 of January 19, 2023), with a service station network being deployed.',
    'act.a3.h':   'Digital Health',
    'act.a3.p':   'Deployment of the first AI-assisted medical screening centre network in West Africa, in partnership with Fujifilm via the NURA franchise.',
    'act.a4.h':   'Circular Economy',
    'act.a4.p':   'Production of bio-methanol, biogas, biofertilizers and valorisation of plastic waste into composite materials, in a triangular Senegal-Finland-EU partnership.',
    'act.a5.h':   'Industrial Logistics',
    'act.a5.p':   'Transport of extractive materials between our production sites and client industries. A dedicated fleet, being structured under institutional leasing, ensures operational control of our contractual commitments.',
    'act.kwm.tag': 'Regional Expansion',
    'act.kwm.h':   'Kairos West Mining',
    'act.kwm.p':   'Kairos West Mining is GSP Group\'s expansion vehicle in the West African sub-region, focused on mining activities. The company is currently in the process of incorporation.',
    'act.more':    'Learn more',
    /* ── Partners ── */
    'part.badge':  'Our Network',
    'part.title':  'Structured partnerships across four continents',
    'part.sub':    'GSP Group relies on six international partnerships, selected for the depth of their expertise, their capacity to accelerate our development and their complementarity with our industrial model.',
    'part.more':   'Discover our partnerships →',
    /* ── Compliance ── */
    'comp.badge':  'Regulation & Governance',
    'comp.title':  'A structured, compliant operator',
    'comp.c1.h':   'Hydrocarbon licence',
    'comp.c1.p':   'Ministerial order n° 001481 of January 19, 2023, granted for 10 renewable years by the Ministry of Petroleum and Energy.',
    'comp.c2.h':   'OHADA Compliance',
    'comp.c2.p':   'Company incorporated and operated under the standards of the Organisation for the Harmonisation of Business Law in Africa.',
    'comp.c3.h':   'SYSCOHADA Standards',
    'comp.c3.p':   'Annual financial statements prepared under the SYSCOHADA framework and certified by an accredited accounting firm.',
    'comp.c4.h':   'ISCC EU Target',
    'comp.c4.p':   'Alignment of our bio-methanol project with international ISCC EU decarbonation standards for industry and maritime transport.',
    /* ── Stats ── */
    'stats.badge': 'Outlook',
    'stats.title': 'A momentum under construction',
    /* ── CTA ── */
    'cta.title':  'Let\'s build together',
    'cta.sub':    'Partners, investors, institutions: we are available for an initial discussion.',
    'cta.btn1':   'Contact us',
    'cta.btn2':   'Meet our team',
    /* ── Footer ── */
    'footer.nav':     'Navigation',
    'footer.contact': 'Contact',
    'footer.rights':  'All rights reserved.',
    /* ── Contact page ── */
    'contact.title':    'Contact Us',
    'contact.sub':      'A question, a project, a partnership? Our team will get back to you.',
    'contact.form.name':    'Full name',
    'contact.form.email':   'Email address',
    'contact.form.phone':   'Phone (optional)',
    'contact.form.subject': 'Subject',
    'contact.form.message': 'Your message',
    'contact.form.submit':  'Send message',
    'contact.info.addr':    'Address',
    'contact.info.email':   'Email',
    'contact.info.phone':   'Phone',
    'contact.form.placeholder.name':    'Your name',
    'contact.form.placeholder.company': 'Your company name',
    'contact.form.placeholder.message': 'Describe your request in detail…',
    'contact.form.opt.default':         'Select a subject',
    'contact.form.opt.partenariat':     'Partnership proposal',
    'contact.form.opt.investissement':  'Investment opportunity',
    'contact.form.opt.approvisionnement': 'Supply / Order',
    'contact.form.opt.presse':          'Press / media request',
    'contact.form.opt.emploi':          'Spontaneous application',
    'contact.form.opt.autre':           'Other request',
    /* ── Equipe page ── */
    'team.badge':       'Executive Team',
    'team.title':       'Our Leadership Team',
    'team.subtitle':    'A leadership team with complementary profiles',
    'team.intro':       'GSP Group is led by an executive team with complementary profiles, combining operational expertise, long-term vision and access to public institutions.',
    'team.banner.sub':  'A leadership team committed for the long term',
    'team.gov.h2':      'Governance being consolidated',
    'team.conseils.h2': 'Expert advisors at every stage',
    /* ── Activités page (nav + sections) ── */
    'act.nav.extract':    'Extractive Industries',
    'act.nav.hydro':      'Hydrocarbons',
    'act.nav.sante':      'Digital Health',
    'act.nav.circulaire': 'Circular Economy',
    'act.nav.logistique': 'Logistics',
    'act.nav.fiches':     'Technical Datasheets',
    'act.badge1':         'Extraction',
    'act.badge2':         'Hydrocarbon Distribution',
    'act.badge3':         'Preventis Health Africa',
    'act.badge4':         'CITABEL',
    'act.badge5':         'Industrial Fleet',
    'act.kwm.subtitle':   'Our sub-regional expansion vehicle',
    'act.kwm.mou':        'Memorandum of Understanding signed on 7 May 2026.<br/>Legal incorporation scheduled for the second half of 2026.',
    'act.hydro.h2':       'An active presence<br/>on Senegal\'s<br/><em style="color:#FF6B00;font-style:italic">roads</em>',
    'act.hydro.lic.title':'Official Licence',
    'act.hydro.lic.sub':  'Ministry of Petroleum and Energy — Senegal',
    'act.hydro.s1':       'Licence duration',
    'act.hydro.s2':       'Network in deployment',
    'act.hydro.s3':       'Licence obtained',
    'act.hydro.s4':       'Certified fleet',
    'act.hydro.scroll':   'Scroll',
    'act.fiche.badge':    'Raw Materials',
    'act.fiche.h2':       'Our extractive products',
    'act.fiche.sub':      'Two high-performance materials validated by leading industrial clients — KEDA Ceramics (China), Dangote Cement and CIMAF Senegal.',
    'act.fiche.dl':       'Download PDF',
    'act.fiche.quote':    'Request a quote',
    'act.fiche.cta.title':'Complete Technical Datasheets',
    'act.fiche.cta.sub':  'Granite SF18B (GSP-GR-SF18B) + High-Alumina Kaolin (GSP-KA-TC01) — Chemical data, specifications, packaging.',
    /* ── Partenariats page ── */
    'part.intro.h2': 'Partnerships built on mutual excellence',
    'part.phil.h2':  'African industrial development<br/>is built through dialogue',
    'part.cta.h2':   'Become a GSP partner',
    'part.cta.sub':  'Would you like to propose a partnership or explore synergies with GSP Group? Contact us directly.',
    'part.cta.btn':  'Propose a partnership',

    /* ── Page banners ── */
    'act.page.title':  'Our Activities',
    'act.page.sub':    'Five complementary business branches serving West African industrialisation.',
    'act.page.h1':     'Our Activities',
    'part.page.title': 'Our Partnerships',
    'part.page.sub':   'Six structured international partnerships across four continents.',
    'equipe.page.h1':  'Our Team',
    'contact.page.h1': 'Contact Us',
    /* ── CTA shared ── */
    'cta.contact.btn': 'Contact us',
    'cta.team.btn':    'Meet our team',
  }
};

/* ── Language detection & application ─────────────────────── */
function detectLang() {
  const stored = localStorage.getItem('gsp-lang');
  if (stored && ['fr','en'].includes(stored)) return stored;
  const browser = (navigator.language || navigator.userLanguage || 'fr').toLowerCase();
  return browser.startsWith('en') ? 'en' : 'fr';
}

function applyTranslations(lang) {
  const t = GSP_TRANSLATIONS[lang];
  if (!t) return;

  // Update all data-i18n elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = t[key];
      } else if (key.includes('title') || key.includes('hero.title') || key.includes('group.title') || key.includes('act.title') || key.includes('part.title') || key.includes('comp.title')) {
        el.innerHTML = t[key];
      } else {
        el.innerHTML = t[key];
      }
    }
  });

  // Update html lang attribute
  document.documentElement.lang = lang;

  // Update document title suffix
  const titles = { fr: 'GSP — General Service Petroleum', en: 'GSP — General Service Petroleum' };

  // Update lang buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
  });

  // Store
  localStorage.setItem('gsp-lang', lang);
  window.gspLang = lang;
}

/* ── Init ─────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const lang = detectLang();

  // Wire up language buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const l = btn.getAttribute('data-lang');
      applyTranslations(l);
    });
  });

  applyTranslations(lang);
});

window.GSP_TRANSLATIONS = GSP_TRANSLATIONS;
window.gspApplyLang = applyTranslations;

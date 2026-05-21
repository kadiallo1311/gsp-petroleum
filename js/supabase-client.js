/* ================================================================
   GSP — Supabase Client (vanilla JS, no build step)
   Utilise l'API REST Supabase directement via fetch()
   Les clés publiques (anon) sont safe côté client avec RLS activé
   ================================================================ */

(function () {
  'use strict';

  /* ── Config ─────────────────────────────────────────────────── */
  // Ces valeurs sont remplacées à l'initialisation via window.GSP_CONFIG
  // ou via les meta tags injectés par Vercel (voir _headers ou vercel.json)
  const CONFIG = window.GSP_SUPABASE_CONFIG || {
    url:  '',   // https://xxxxxxxxxxxx.supabase.co
    key:  '',   // eyJ... (anon/public key uniquement)
  };

  /* ── Client léger ───────────────────────────────────────────── */
  const supabase = {
    /**
     * Insère une ligne dans une table via l'API REST Supabase
     * @param {string} table  Nom de la table
     * @param {object} data   Données à insérer
     * @returns {Promise<{data, error}>}
     */
    async insert(table, data) {
      if (!CONFIG.url || !CONFIG.key) {
        console.warn('[GSP Supabase] Configuration manquante — formulaire en mode dégradé');
        return { data: null, error: { message: 'config_missing' } };
      }

      try {
        const res = await fetch(`${CONFIG.url}/rest/v1/${table}`, {
          method:  'POST',
          headers: {
            'Content-Type':  'application/json',
            'apikey':         CONFIG.key,
            'Authorization': `Bearer ${CONFIG.key}`,
            'Prefer':         'return=minimal',
          },
          body: JSON.stringify(data),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          return { data: null, error: err };
        }

        return { data: true, error: null };
      } catch (err) {
        return { data: null, error: { message: err.message } };
      }
    },
  };

  window.GSPSupabase = supabase;
})();

/* ================================================================
   GSP — Contact Form Handler
   Remplace l'action mailto: par une soumission Supabase sécurisée
   ================================================================ */

(function () {
  'use strict';

  const OBJET_MAP = {
    partenariat:      { fr: 'Proposition de partenariat',    en: 'Partnership proposal' },
    investissement:   { fr: "Opportunité d'investissement",  en: 'Investment opportunity' },
    approvisionnement:{ fr: 'Approvisionnement / Commande',  en: 'Supply / Order' },
    presse:           { fr: 'Demande presse / médias',       en: 'Press / media request' },
    emploi:           { fr: 'Candidature spontanée',         en: 'Spontaneous application' },
    autre:            { fr: 'Autre demande',                 en: 'Other request' },
  };

  function getCurrentLang() {
    return (localStorage.getItem('gsp-lang') || document.documentElement.lang || 'fr').toLowerCase() === 'en' ? 'en' : 'fr';
  }

  function sanitize(str) {
    return (str || '').trim().slice(0, 5000);
  }

  function showError(form, lang) {
    const msg = lang === 'en'
      ? 'An error occurred. Please try again or email us directly at contact@gspetroleum.sn'
      : 'Une erreur est survenue. Réessayez ou écrivez-nous directement à contact@gspetroleum.sn';
    let el = form.querySelector('.gsp-form-error');
    if (!el) {
      el = document.createElement('p');
      el.className = 'gsp-form-error text-sm mt-3 text-red-600 font-medium';
      form.querySelector('button[type="submit"]').after(el);
    }
    el.textContent = msg;
    el.style.display = 'block';
  }

  function hideError(form) {
    const el = form.querySelector('.gsp-form-error');
    if (el) el.style.display = 'none';
  }

  function showSuccess(form) {
    const successEl = document.getElementById('form-success');
    if (successEl) {
      form.style.display = 'none';
      successEl.style.display = 'flex';
      successEl.style.flexDirection = 'column';
    }
  }

  function setLoading(btn, loading, lang) {
    btn.disabled = loading;
    btn.style.opacity = loading ? '0.7' : '1';
    btn.style.cursor  = loading ? 'wait' : '';
    const spanFr = btn.querySelector('.lang-fr');
    const spanEn = btn.querySelector('.lang-en');
    if (loading) {
      if (spanFr) spanFr.textContent = 'Envoi en cours…';
      if (spanEn) spanEn.textContent = 'Sending…';
      if (!spanFr && !spanEn) btn.textContent = lang === 'en' ? 'Sending…' : 'Envoi en cours…';
    } else {
      if (spanFr) spanFr.textContent = 'Envoyer le Message';
      if (spanEn) spanEn.textContent = 'Send Message';
      if (!spanFr && !spanEn) btn.textContent = lang === 'en' ? 'Send Message' : 'Envoyer le Message';
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const form    = e.target;
    const btn     = form.querySelector('button[type="submit"]');
    const lang    = getCurrentLang();

    hideError(form);

    /* ── Collecte données ──────────────────────────────────────── */
    const data = {
      nom:         sanitize(form.nom?.value),
      email:       sanitize(form.email?.value).toLowerCase(),
      societe:     sanitize(form.societe?.value) || null,
      objet:       sanitize(form.objet?.value),
      message:     sanitize(form.message?.value),
      consent:     form.consent?.checked === true,
      honeypot:    sanitize(form.website?.value),  // champ piège
      lang:        lang,
      user_agent:  navigator.userAgent.slice(0, 300),
      referer:     document.referrer.slice(0, 300) || null,
    };

    /* ── Validation côté client ────────────────────────────────── */
    if (!data.nom || data.nom.length < 2) return;
    if (!data.email || !data.email.includes('@')) return;
    if (!data.message || data.message.length < 20) return;
    if (!data.consent) return;
    if (data.honeypot) return; // bot détecté — silencieux

    /* ── Envoi Supabase ────────────────────────────────────────── */
    setLoading(btn, true, lang);

    const { error } = await window.GSPSupabase.insert('contact_submissions', data);

    setLoading(btn, false, lang);

    if (error && error.message !== 'config_missing') {
      console.error('[GSP Contact]', error);
      showError(form, lang);
      return;
    }

    /* ── Succès ────────────────────────────────────────────────── */
    showSuccess(form);

    // Fallback email si Supabase non configuré
    if (error?.message === 'config_missing') {
      console.info('[GSP] Supabase non configuré — mode dégradé activé');
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    if (!form) return;

    // Supprimer l'action mailto (remplacée par JS)
    form.removeAttribute('action');
    form.removeAttribute('method');
    form.removeAttribute('enctype');

    // Ajouter champ honeypot invisible (anti-spam)
    if (!form.querySelector('[name="website"]')) {
      const honeypot = document.createElement('div');
      honeypot.style.cssText = 'position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden;';
      honeypot.innerHTML = '<label>Website<input type="text" name="website" tabindex="-1" autocomplete="off"></label>';
      form.appendChild(honeypot);
    }

    form.addEventListener('submit', handleSubmit);

    // Reset form
    const resetBtn = document.getElementById('reset-form');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        form.reset();
        form.style.display = '';
        const successEl = document.getElementById('form-success');
        if (successEl) successEl.style.display = 'none';
      });
    }
  });
})();

-- ================================================================
-- GSP General Service Petroleum — Supabase Schema
-- Migration 001 : Contact form submissions
-- ================================================================

-- ── Table principale des soumissions de contact ──────────────────
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Données formulaire
  nom         TEXT        NOT NULL CHECK (char_length(nom) BETWEEN 2 AND 100),
  email       TEXT        NOT NULL CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  societe     TEXT        CHECK (char_length(societe) <= 150),
  objet       TEXT        NOT NULL CHECK (objet IN (
                            'partenariat', 'investissement', 'approvisionnement',
                            'presse', 'emploi', 'autre'
                          )),
  message     TEXT        NOT NULL CHECK (char_length(message) BETWEEN 20 AND 5000),
  consent     BOOLEAN     NOT NULL DEFAULT FALSE CHECK (consent = TRUE),

  -- Métadonnées
  lang        TEXT        DEFAULT 'fr' CHECK (lang IN ('fr', 'en')),
  status      TEXT        DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
  source_page TEXT        DEFAULT 'contact',
  honeypot    TEXT,        -- champ piège anti-spam (doit être vide)

  -- Audit
  user_agent  TEXT,
  referer     TEXT
);

-- ── Index pour performance ────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_contact_created_at ON public.contact_submissions (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_status     ON public.contact_submissions (status);
CREATE INDEX IF NOT EXISTS idx_contact_email      ON public.contact_submissions (email);

-- ── Row Level Security ────────────────────────────────────────────
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Politique INSERT : tout le monde peut soumettre un formulaire
-- Conditions : consentement requis, honeypot vide (anti-spam), message non vide
CREATE POLICY "anon_can_submit_contact"
  ON public.contact_submissions
  FOR INSERT
  TO anon
  WITH CHECK (
    consent = TRUE
    AND (honeypot IS NULL OR honeypot = '')
    AND char_length(message) >= 20
    AND char_length(nom) >= 2
  );

-- Politique SELECT : seuls les utilisateurs authentifiés (admins) peuvent lire
CREATE POLICY "auth_can_read_submissions"
  ON public.contact_submissions
  FOR SELECT
  TO authenticated
  USING (TRUE);

-- Politique UPDATE : seuls les admins peuvent changer le statut
CREATE POLICY "auth_can_update_status"
  ON public.contact_submissions
  FOR UPDATE
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);

-- ── Commentaires ──────────────────────────────────────────────────
COMMENT ON TABLE  public.contact_submissions              IS 'Soumissions du formulaire de contact GSP';
COMMENT ON COLUMN public.contact_submissions.status       IS 'Workflow: new → read → replied → archived';
COMMENT ON COLUMN public.contact_submissions.honeypot     IS 'Champ anti-spam: doit rester vide';
COMMENT ON COLUMN public.contact_submissions.consent      IS 'RGPD: consentement explicite obligatoire';

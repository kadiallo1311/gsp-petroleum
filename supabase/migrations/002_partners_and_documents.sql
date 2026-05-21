-- ================================================================
-- GSP General Service Petroleum — Supabase Schema
-- Migration 002 : Partenaires et documents techniques
-- ================================================================

-- ── Partenaires administrables ────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.partners (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at   TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at   TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  slug         TEXT        UNIQUE NOT NULL,
  name_fr      TEXT        NOT NULL,
  name_en      TEXT        NOT NULL,
  country_fr   TEXT        NOT NULL,
  country_en   TEXT        NOT NULL,
  description_fr TEXT      NOT NULL,
  description_en TEXT      NOT NULL,
  tagline_fr   TEXT,
  tagline_en   TEXT,
  logo_url     TEXT,
  website_url  TEXT,
  partnership_type TEXT    CHECK (partnership_type IN (
                              'commercial', 'technology', 'institutional',
                              'financial', 'south-south'
                            )),
  display_order INTEGER    DEFAULT 0,
  is_active    BOOLEAN     DEFAULT TRUE
);

ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

-- Lecture publique (partenaires visibles sur le site)
CREATE POLICY "public_read_partners"
  ON public.partners FOR SELECT TO anon
  USING (is_active = TRUE);

-- Écriture réservée aux admins
CREATE POLICY "auth_manage_partners"
  ON public.partners FOR ALL TO authenticated
  USING (TRUE) WITH CHECK (TRUE);

-- ── Documents techniques / PDF ────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.technical_documents (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at   TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at   TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  reference    TEXT        UNIQUE NOT NULL,     -- ex: GSP-GR-SF18B
  name_fr      TEXT        NOT NULL,
  name_en      TEXT        NOT NULL,
  category     TEXT        NOT NULL CHECK (category IN ('granite', 'kaolin', 'argile', 'autre')),
  file_path    TEXT,                            -- chemin dans Supabase Storage
  file_url     TEXT,                            -- URL publique
  version      TEXT        DEFAULT '1.0',
  is_public    BOOLEAN     DEFAULT TRUE,
  download_count INTEGER   DEFAULT 0
);

ALTER TABLE public.technical_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_documents"
  ON public.technical_documents FOR SELECT TO anon
  USING (is_public = TRUE);

CREATE POLICY "auth_manage_documents"
  ON public.technical_documents FOR ALL TO authenticated
  USING (TRUE) WITH CHECK (TRUE);

-- ── Trigger updated_at automatique ───────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER partners_updated_at
  BEFORE UPDATE ON public.partners
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER documents_updated_at
  BEFORE UPDATE ON public.technical_documents
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ── Données initiales partenaires ────────────────────────────────
INSERT INTO public.partners (slug, name_fr, name_en, country_fr, country_en, description_fr, description_en, tagline_fr, tagline_en, partnership_type, display_order) VALUES
  ('keda', 'KEDA Industrial Group', 'KEDA Industrial Group', 'CHINE', 'CHINA',
   'Partenaire commercial de notre branche industries extractives. Contrat-cadre de 120 000 tonnes annuelles de granite SF18B signé en mars 2026.',
   'Commercial partner for our extractive industries branch. Framework agreement for 120,000 tonnes annually of SF18B granite signed in March 2026.',
   'Partenariat commercial stratégique', 'Strategic commercial partnership',
   'commercial', 1),

  ('fujifilm', 'Fujifilm DKH LLP', 'Fujifilm DKH LLP', 'JAPON', 'JAPAN',
   'Franchiseur de la plateforme NURA pour Preventis Health Africa. Accès aux équipements d''imagerie médicale et aux algorithmes IA.',
   'Franchisor of the NURA platform for Preventis Health Africa. Access to medical imaging equipment and AI algorithms.',
   'Partenariat technologique franchise', 'Technology franchise partnership',
   'technology', 2),

  ('nordic-eco', 'Nordic Eco Innovation', 'Nordic Eco Innovation', 'FINLANDE', 'FINLAND',
   'Partenaire technologique exclusif de CITABEL pour le projet bio-méthanol.',
   'Exclusive technology partner of CITABEL for the bio-methanol project.',
   'Partenariat technologique exclusif', 'Exclusive technology partnership',
   'technology', 3),

  ('eu', 'Union Européenne', 'European Union', 'BRUXELLES', 'BRUSSELS',
   'Partenaire institutionnel et financier pour la phase d''amorçage du projet bio-méthanol CITABEL.',
   'Institutional and financial partner for the seed phase of CITABEL''s bio-methanol project.',
   'Partenariat institutionnel et financier', 'Institutional and financial partnership',
   'institutional', 4),

  ('comtech', 'Comtech Group', 'Comtech Group', 'ROYAUME-UNI', 'UNITED KINGDOM',
   'Banque d''affaires londonienne mandatée pour le tour Series A de Preventis Health Africa.',
   'London-based investment bank mandated for the Preventis Health Africa Series A round.',
   'Conseil financier — Levée de fonds Series A', 'Financial advisory — Series A fundraise',
   'financial', 5),

  ('indian-partner', 'Partenaire industriel indien de premier rang', 'Leading Indian industrial partner', 'INDE', 'INDIA',
   'Partenaire technologique de CITABEL pour la valorisation des déchets plastiques en matériaux composites.',
   'Technology partner of CITABEL for valorisation of plastic waste into composite materials.',
   'Partenariat technologique Sud-Sud', 'South-South technology partnership',
   'south-south', 6)
ON CONFLICT (slug) DO NOTHING;

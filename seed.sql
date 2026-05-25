-- Seed initial website content into page_content table
-- Run this once in the Supabase SQL editor to populate the database
-- with the existing French content visible on the website.
-- The admin can then edit all of this through the dashboard.

INSERT INTO page_content (page, key, value) VALUES

-- ═══════════════════════════════
-- HOMEPAGE / HERO
-- ═══════════════════════════════
('homepage', 'hero_subtitle',      'À l''École Badrane, nous utilisons les méthodes pédagogiques les plus récentes afin d''assurer une formule éducative complète et équilibrée, de la maternelle au lycée.'),
('homepage', 'hero_cta_primary',   'S''inscrire maintenant'),
('homepage', 'hero_cta_secondary', 'Découvrir l''école'),
('homepage', 'stat_levels',        '4'),
('homepage', 'stat_years',         '20+'),
('homepage', 'stat_students',      '500+'),

-- ═══════════════════════════════
-- ABOUT
-- ═══════════════════════════════
('about', 'p1', 'Fondée avec la vision d''offrir une éducation internationale de qualité au Maroc, l''École Badrane de Tanger s''est imposée comme un établissement de référence. Nous croyons que chaque enfant possède un potentiel unique qui mérite d''être cultivé.'),
('about', 'p2', 'Notre approche pédagogique combine le meilleur des programmes nationaux et internationaux, avec une attention particulière portée au développement des compétences du 21ème siècle : esprit critique, créativité, collaboration et communication.'),
('about', 'mission_title', 'Notre Mission'),
('about', 'mission_text',  'Former des citoyens du monde responsables, curieux et épanouis, capables de relever les défis du XXIe siècle.'),
('about', 'value_1_title', 'Innovation Pédagogique'),
('about', 'value_1_desc',  'Nous adoptons les méthodes d''enseignement les plus modernes pour stimuler la curiosité et la créativité.'),
('about', 'value_2_title', 'Ouverture Internationale'),
('about', 'value_2_desc',  'Un enseignement multilingue et multiculturel qui prépare les élèves à un monde globalisé.'),
('about', 'value_3_title', 'Bien-être de l''Élève'),
('about', 'value_3_desc',  'L''épanouissement personnel et social de chaque enfant est au cœur de notre mission éducative.'),
('about', 'value_4_title', 'Équipe Qualifiée'),
('about', 'value_4_desc',  'Des enseignants passionnés et expérimentés, dévoués à la réussite de chaque élève.'),

-- ═══════════════════════════════
-- LEVELS
-- ═══════════════════════════════
('levels', 'section_subtitle',    'Un parcours éducatif complet et cohérent, conçu pour accompagner chaque élève à chaque étape de son développement.'),

('levels', 'maternelle_name',     'Maternelle'),
('levels', 'maternelle_ages',     '3 – 5 ans'),
('levels', 'maternelle_desc',     'Un environnement bienveillant et stimulant pour les premiers apprentissages. Nos éducateurs spécialisés accompagnent chaque enfant dans sa découverte du monde.'),
('levels', 'maternelle_features', 'Éveil sensoriel et moteur
Initiation aux langues
Activités créatives et artistiques
Développement socio-émotionnel'),

('levels', 'primaire_name',     'Primaire'),
('levels', 'primaire_ages',     '6 – 11 ans'),
('levels', 'primaire_desc',     'Des bases solides dans un cadre engageant. Notre programme primaire développe la curiosité intellectuelle et les compétences fondamentales.'),
('levels', 'primaire_features', 'Programme national enrichi
Trilinguisme (Fr/Ar/An)
Activités parascolaires
Suivi personnalisé'),

('levels', 'college_name',     'Collège'),
('levels', 'college_ages',     '12 – 14 ans'),
('levels', 'college_desc',     'Le collège Badrane prépare les élèves aux défis académiques supérieurs tout en cultivant leur esprit critique et leur autonomie.'),
('levels', 'college_features', 'Sciences & Technologie
Projets interdisciplinaires
Orientation & coaching
Clubs et activités'),

('levels', 'lycee_name',     'Lycée'),
('levels', 'lycee_ages',     '15 – 18 ans'),
('levels', 'lycee_desc',     'Préparation d''excellence au baccalauréat et aux grandes études supérieures. Nos lycéens sont accompagnés vers leurs projets d''avenir.'),
('levels', 'lycee_features', 'Baccalauréat marocain
Préparation aux concours
Orientation université
Échanges internationaux'),

-- ═══════════════════════════════
-- TEACHING / PEDAGOGY
-- ═══════════════════════════════
('teaching', 'p1', 'Notre philosophie pédagogique s''appuie sur les recherches les plus récentes en sciences de l''éducation. Nous mettons en œuvre des pratiques innovantes qui rendent les apprentissages plus engageants, plus durables et plus efficaces.'),
('teaching', 'p2', 'Nos enseignants bénéficient d''une formation continue et sont encouragés à innover constamment dans leurs pratiques de classe.'),
('teaching', 'quote',        'Éduquer c''est allumer un feu, non remplir un vase.'),
('teaching', 'quote_author', 'Aristophane'),

('teaching', 'method_1_title', 'Apprentissage Actif'),
('teaching', 'method_1_desc',  'Fini les cours magistraux passifs. Nos élèves sont au cœur de l''apprentissage : expérimentations, débats, projets collaboratifs.'),
('teaching', 'method_2_title', 'Pédagogie Différenciée'),
('teaching', 'method_2_desc',  'Chaque enfant apprend différemment. Nos enseignants adaptent leur approche à chaque profil d''apprenant pour une efficacité maximale.'),
('teaching', 'method_3_title', 'Numérique & Innovation'),
('teaching', 'method_3_desc',  'Salles équipées, outils numériques intégrés, coding et robotique : nous préparons les élèves au monde de demain.'),
('teaching', 'method_4_title', 'Évaluation Bienveillante'),
('teaching', 'method_4_desc',  'L''erreur est une étape dans l''apprentissage. Notre approche valorise les progrès, la persévérance et le dépassement de soi.'),
('teaching', 'method_5_title', 'Multilinguisme'),
('teaching', 'method_5_desc',  'Arabe, français et anglais — un trilinguisme dès le plus jeune âge qui ouvre des portes dans le monde entier.'),
('teaching', 'method_6_title', 'Arts & Culture'),
('teaching', 'method_6_desc',  'Musique, arts plastiques, théâtre et sport : une éducation complète qui développe toutes les dimensions de la personnalité.'),

-- ═══════════════════════════════
-- ADMISSIONS
-- ═══════════════════════════════
('admissions', 'section_title', 'Rejoignez la famille'),
('admissions', 'subtitle',      'Les inscriptions sont ouvertes pour l''année scolaire. Commencez votre démarche dès aujourd''hui.'),

('admissions', 'step_1_title', 'Pré-inscription en ligne'),
('admissions', 'step_1_desc',  'Remplissez le formulaire de pré-inscription sur notre site web.'),
('admissions', 'step_2_title', 'Dossier complet'),
('admissions', 'step_2_desc',  'Fournissez les documents requis : bulletins, acte de naissance, photos.'),
('admissions', 'step_3_title', 'Entretien'),
('admissions', 'step_3_desc',  'Rencontrez notre équipe pédagogique pour discuter du projet de l''élève.'),
('admissions', 'step_4_title', 'Confirmation'),
('admissions', 'step_4_desc',  'Recevez votre confirmation d''inscription et bienvenue dans la famille Badrane !'),

('admissions', 'doc_1', 'Bulletins scolaires des 2 dernières années'),
('admissions', 'doc_2', 'Acte de naissance de l''élève'),
('admissions', 'doc_3', '4 photos d''identité récentes'),
('admissions', 'doc_4', 'Copie de la carte d''identité des parents'),
('admissions', 'doc_5', 'Certificat de vaccination'),
('admissions', 'doc_6', 'Justificatif de domicile')

ON CONFLICT (page, key) DO UPDATE SET value = EXCLUDED.value;

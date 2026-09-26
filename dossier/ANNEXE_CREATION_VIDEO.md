# Annexe — Comment la vidéo a été créée, et comment la refaire

Vidéo : **Vashnik le Malveillant — strat express** (2 min 55, 1920 × 1080, 30 i/s, −16 LUFS).
Fichier final : `production/vashnik-express/out/delivery/vashnik-express-master.mp4`.

Ce document raconte toute la chaîne de fabrication, étape par étape, avec les décisions
prises et leurs raisons. La direction artistique est dans `DOSSIER_CREA.md` (et
`dossier-crea.pdf`).

---

## 0. La chaîne en un coup d'œil

```
script (GUIDE_…md)
   │
   ├─► planches de DA (dossier/planches)            validées par l'auteur
   ├─► découpage 12 min (dossier/decoupage-12min)   16 images clés
   │
   └─► version express (§9 du script)
          vo/script.json ──► vo/build_vo.py ──► voix + table des temps + enveloppe
                                                     │
          index.html + style.css + video.js ◄────────┤   (chaque image = fonction du temps)
          mix.py ◄───────────────────────────────────┘   (fond musical + bruitages + voix)
                │
          render.mjs ──► out/vashnik-express.mp4
                │
          finalize_delivery.sh ──► out/delivery/ (master −16 LUFS, version légère, planche contact, rapport)
```

Rien n'est monté à la main dans un logiciel de montage : la vidéo est **un programme**. Changer
un texte, un timing ou la voix, puis relancer les commandes, refait une vidéo identique en
tout le reste.

---

## 1. Le point de départ

**La demande** : « une vidéo explication de boss avec un présentateur qui fait des plans cam
pour parler du sujet en montrant les mécaniques de boss comme dans un encart télé, puis des
plans in-game qui montrent la mécanique ». Avant de générer quoi que ce soit : des planches
du design.

**Le matériel fourni** (à la racine du dépôt) :

| Élément | Fichier(s) |
|---|---|
| Le script, mot à mot, avec annexe des chiffres | `GUIDE_VASHNIK_MYTHIQUE_SCRIPT_VIDEO.md` |
| Gideon en armure (portraits 9:16 et 16:9) | `Image ChatGPT 26 sept. 2026, …-1 à -6.png` |
| Gideon au diner, « chut », hologrammes, etc. | `ChatGPT Image 2 sept. 2026, …png`, `ChatGPT Image 7 août 2026, …png` |
| Captures en jeu | `WoWScrnShot_*.jpg` |
| L'image du boss (envoyée plus tard) | copiée dans `dossier/sources/originaux/vashnik-boss.webp` |

**Le nom du présentateur** : **Gideon** (confirmé par l'auteur).

---

## 2. Essai du skill *lanshu-create-ai-presenter-video*

Le skill (github.com/cclank/lanshu-create-ai-presenter-video) a été cloné et testé :
contrôles du dépôt, `init_job.py`, `preflight.py`, `finalize_delivery.sh`.

- Il ne génère pas lui-même la voix ni l'avatar parlant : il faut brancher des services
  externes payants, avec une photo réelle et des autorisations. Rien de tout ça n'a été fait.
- **Gideon n'a pas de bouche** : pas besoin de synchronisation labiale. On l'anime nous-mêmes
  (lueurs au rythme de la voix).
- **Ce qu'on a gardé** : `finalize_delivery.sh`, pour la livraison (niveau sonore, versions,
  vérification, planche contact). Voir étape 9.
- Le skill n'a pas été installé dans la configuration de Claude (refusé par le système) ; on
  l'utilise depuis un clone.

---

## 3. Les planches de DA

Fichiers : `dossier/planches/planche-00.png` à `planche-06.png`, `vue-ensemble.png`.
Source : `dossier/sources/boards.html` (refaire : `node dossier/sources/capture.mjs planches`).

1. **Détourage** de Gideon (image n° 4, 16:9) avec `rembg` (modèle `isnet-general-use`), en
   local. L'orc et le gnome, fournis **sur fond vert**, sont détourés par une incrustation
   simple (clé de couleur vert `#00B33D`) écrite en Python/numpy.
2. **Couleurs relevées sur le personnage** : armure bleu roi, filets d'or, gemmes cyan, cape
   violette, marbre.
3. **Sept planches 16:9** : 00 charte, 01 ouverture, 02 plan caméra + encart télé, 03 plan
   in-game, 04 schéma tactique, 05 carton de chapitre, 06 à retenir. Textes provisoires.
4. Proposition d'animation : casque sans bouche → yeux et gemmes qui s'allument avec la voix,
   respiration lente.

**Validation de l'auteur** : « C'est parfait. La DA, etc. Tu peux l'appeler Gideon. »

---

## 4. Le découpage de la version 12 minutes

Fichiers : `dossier/decoupage-12min/plan-01.jpg` à `plan-16.jpg`, `vue-ensemble.jpg`.
Source : `dossier/sources/frames.html` (refaire : `node dossier/sources/capture.mjs decoupage`).

16 images clés faites d'après le script, section par section (accroche, salle, venins,
fontaines, infections, permanentes, Mythique, plan de raid). Le boss y est encore représenté
par le gnome (image provisoire, avant l'envoi de la vraie image).

**Relecture du script** pendant le découpage. Points relevés et suite donnée :

| Point | Décision de l'auteur |
|---|---|
| Explosion stygienne : la voix disait « six mètres », l'écran et l'annexe 3,5 m | **3,5 m** (« Garde 3,5 m ») |
| « Un alone : » | corrigé en « Une seule règle : » |
| « rament » (§9) | corrigé en « rampent » |
| « La orange », « Méthode » (relevés à la relecture) | « L'orange », « Method » |
| Section 3 : « un million six cent mille » alors que l'annexe donne 1 666 813 | **en attente** (version longue seulement) |

La version express a été choisie comme **premier essai** (« Oui fait la version 3 minutes »),
pour valider l'animation et la voix avant les 12 minutes.

---

## 5. La voix off : le texte

Fichier : `production/vashnik-express/vo/script.json`.

- **23 phrases**, chacune tirée du script (§9 et sections détaillées), raccourcie **sans
  ajouter de fait ni de chiffre**.
- Chaque phrase porte sa **scène** (`intro`, `hook`, `room`, …) : la vidéo s'organise autour.
- Balisage couleur dans le texte : `{c:…}` cyan (technique), `{d:…}` or (danger),
  `{s:…}` `{o:…}` `{f:…}` Sang / Ombre / Flamme. Le même texte sert aux sous-titres.
- Champ `say` : ce que la synthèse doit prononcer quand l'écrit la trompe (« tanques » pour
  *tanks*, « exprèsse » pour *express*, « ouaïpe » pour *wipe*). Les sous-titres gardent
  l'original.
- Champ `hold` : un temps de silence après la phrase, pour laisser une animation se finir.

---

## 6. La voix off : le son

Script : `production/vashnik-express/vo/build_vo.py`.

- **Synthèse Kokoro** (`kokoro-onnx` 0.6.1, voix française `ff_siwis`, vitesse 0,85), calculée
  en local, une phrase à la fois. C'est une **voix de travail**.
- Essais comparés (dans `dossier/essais-voix/`) : trois voix Piper françaises (siwis, gilles,
  mls_1840) et Kokoro. **Kokoro retenue** : les voix Piper disponibles déformaient les
  voyelles nasales. D'autres voix n'ont pas pu être téléchargées (hébergeur bloqué depuis
  l'environnement cloud).
- Montage : 3 s avant la première phrase (le carton d'intro s'installe), 0,5 s entre deux
  phrases d'une même scène, 1,4 s entre deux scènes, 5 s après la dernière.
- Sorties (`vo/out/`) :
  - `voice.wav` (48 kHz mono, non versionné, régénéré par le script) ;
  - `timeline.json` et `data.js` : début et fin de chaque phrase, **la table des temps** ;
  - `env.json` : l'amplitude de la voix, 30 valeurs par seconde (pour les lueurs de Gideon et
    l'onde du bandeau).
- **Voix enregistrée** : un fichier par phrase dans `vo/rec/` (`00.wav`, `01.wav`, …) remplace
  la synthèse pour cette phrase. Toute la vidéo se recale dessus.

Durée obtenue : **174,69 s** (2:54,7).

---

## 7. La composition (l'image)

Fichiers : `production/vashnik-express/index.html`, `style.css`, `video.js`.

- La page fait 1920 × 1080. `video.js` construit tous les plans en HTML/SVG, puis
  `window.renderFrame(t)` place **chaque élément en fonction du temps `t`** : on peut rendre
  n'importe quelle image isolément, et deux rendus donnent exactement la même vidéo.
- **Tout est calé sur la voix** : la table des temps donne le début de chaque phrase ; la
  fonction `at(phrase, "mot")` estime l'instant où un mot est prononcé (au prorata des
  caractères). Exemple : la fontaine de Sang s'allume sur le mot « Sang ».
- **Les plans** (bornes calculées depuis la voix) : carton d'intro, accroche face caméra, plan
  de salle (salle → Absorption → rotation → venins), les trois venins, les infections, les
  trois réflexes de fond, Mythique, carton de fin. Fondu enchaîné de 0,35 s entre deux plans.
- **Le plan de salle** est un seul dessin SVG qui vit pendant toute la partie « principe » :
  fontaines, Cavité, médaillon de Vashnik, venins, tumeurs, vagues.
- **Habillage permanent** : chapitre en haut à gauche, badges en haut à droite, sous-titres
  en bas (découpés à la ponctuation, une ligne à la fois).
- **Aperçu** : servir le dossier (`npx serve .`) et ouvrir `index.html` ; espace = lecture,
  ←/→ = image par image.

---

## 8. Le son (fond + bruitages)

Script : `production/vashnik-express/mix.py` → `out/final.wav` (48 kHz, 24 bits, stéréo).

- **Fond musical** synthétisé (numpy/scipy), fa mineur, 72 BPM : pads, basse, arpège discret,
  pulsation douce.
- **Le fond s'efface sous la voix** (environ −9 dB), grâce à l'enveloppe de la voix.
- **Bruitages** placés avec les mêmes instants que les animations (`at(phrase, "mot")`) :
  souffles aux transitions, clochettes sur les fontaines, impacts sur les venins et « WIPE »,
  tic-tac du venin durci, « chut » de Gideon, etc.
- Mixage : voix + fond + bruitages, passe-haut 30 Hz, saturation douce, piste un peu plus
  longue que la dernière image (pour que l'encodage garde toutes les images).

---

## 9. Le rendu et la livraison

**Rendu** (`render.mjs`) : Chromium sans écran (Playwright) charge `index.html`, capture
chaque image, et ffmpeg encode :

- vidéo H.264 High, 1080p, 30 i/s constants, yuv420p, CRF 17 ;
- son AAC 256 kb/s depuis `out/final.wav` ;
- contrôle du nombre d'images en sortie (**5241**). Durée : environ 8 minutes.

**Livraison** (`finalize_delivery.sh` du skill lanshu) :

- ramène le son à **−16 LUFS** intégrés (mesuré : −16,0 LUFS, crête −2,1 dBFS) ;
- produit la version **master** (41 Mo, versionnée) et une version **légère** (17 Mo, non
  versionnée) ;
- décode entièrement les deux fichiers, vérifie qu'il n'y a pas d'image noire parasite ;
- sort une **planche contact** et un **rapport** (`out/delivery/`).

---

## 10. Les vérifications

- Images fixes contrôlées dans chaque scène (`node render.mjs --stills …`), puis relecture
  des sous-titres (une ligne, coupure à la ponctuation, pas de « : » en début de ligne).
- Nombre d'images, durée, niveau sonore, décodage complet (rapport de livraison).
- Contrôle des règles de contenu : pas de donnée personnelle, rien d'inventé, chiffres
  exacts.

---

## 11. Les itérations

| Quand | Demande / constat | Ce qui a changé |
|---|---|---|
| 1ʳᵉ version | — | Vidéo 2:55, boss représenté par le gnome |
| « Garde 3,5 m, corrige les coquilles » | script | Script corrigé (voir étape 4) ; la vidéo disait déjà 3,5 m |
| « Ceci est Vashniek le boss » + image | image du boss | Médaillon rond cerclé d'or sur le plan (au lieu du gnome), carte du boss pendant l'Absorption, médaillon écarté du centre pour laisser lisible « Cavité malveillante » |
| Reprise dans une autre session | continuité | `CLAUDE.md` à la racine, ce dossier |

Problèmes techniques rencontrés et corrigés en route : sous-titres mal découpés (un « : » en
début de ligne, des mots collés à la ponctuation), piste audio 24 bits mal écrite, une image
perdue en fin de vidéo (piste audio trop courte).

---

## 12. Refaire la vidéo, pas à pas

Depuis `production/vashnik-express/` :

```bash
# 1. outils
pip install kokoro-onnx numpy scipy           # voix + son
npm i -g playwright                           # rendu (ou playwright installé localement)
# ffmpeg, ffprobe et jq doivent être dans le PATH

# 2. modèles de voix (non versionnés)
#    github.com/thewh1teagle/kokoro-onnx, release model-files-v1.0 :
#    kokoro-v1.0.onnx + voices-v1.0.bin → vo/models/  (ou KOKORO_DIR=/chemin)

# 3. script de livraison
git clone https://github.com/cclank/lanshu-create-ai-presenter-video /chemin/lanshu

# 4. fabrication
python3 vo/build_vo.py        # voix, table des temps, enveloppe → vo/out/
python3 mix.py                # → out/final.wav
node render.mjs               # → out/vashnik-express.mp4 (≈ 8 min)
bash /chemin/lanshu/scripts/finalize_delivery.sh out/vashnik-express.mp4 out/delivery vashnik-express
```

Versions utilisées : Node 22, Playwright 1.56, ffmpeg 6.1, Python 3.11, numpy 2.4,
scipy 1.17, kokoro-onnx 0.6.1, onnxruntime 1.30.

---

## 13. Modifier la vidéo : recettes

| Je veux… | Je fais… |
|---|---|
| changer une phrase de la voix | modifier sa ligne dans `vo/script.json`, puis étapes 4 complètes |
| mettre un mot en couleur | l'entourer de `{c:…}`, `{d:…}`, `{s:…}`, `{o:…}` ou `{f:…}` dans `script.json` |
| corriger une prononciation | ajouter un champ `say` à la ligne (le sous-titre ne change pas) |
| remplacer la voix par la mienne | enregistrer chaque phrase dans `vo/rec/00.wav`, `01.wav`… puis étapes 4 |
| laisser plus de temps à une animation | augmenter le `hold` de la phrase qui précède |
| changer une couleur | `style.css` (`:root`) et, pour le plan de salle, `FC` / `FT` dans `video.js` |
| changer une image | remplacer le fichier dans `assets/img/` (même nom, même format) |
| vérifier une image précise | `node render.mjs --stills 12,40.5` → `out/stills/` |
| refaire une planche | modifier `dossier/sources/boards.html`, puis `node dossier/sources/capture.mjs planches` |

---

## 14. Ce qui reste ouvert

- **Orthographe du boss** : « Vashnik » (script, vidéo) ou « Vashniek » (message de l'auteur).
- **Version longue (12 min)** : non produite ; le découpage est prêt. Chiffre arrondi de la
  section 3 à trancher.
- **Voix** : Kokoro est une voix de travail ; enregistrement de l'auteur possible (`vo/rec/`).

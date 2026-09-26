# Dossier complet — Vashnik le Malveillant · strat express

Tout ce qu'il faut pour comprendre, refaire et faire évoluer la vidéo guide présentée par
Gideon.

| Je cherche… | C'est ici |
|---|---|
| **La vidéo finale** | `../production/vashnik-express/out/delivery/vashnik-express-master.mp4` |
| **Le dossier de créa mis en page** (12 pages) | [`dossier-crea.pdf`](dossier-crea.pdf) |
| **La direction artistique**, en texte | [`DOSSIER_CREA.md`](DOSSIER_CREA.md) |
| **Comment la vidéo a été faite**, étape par étape, et comment la refaire | [`ANNEXE_CREATION_VIDEO.md`](ANNEXE_CREATION_VIDEO.md) |
| Le contexte pour reprendre le projet dans une nouvelle session | [`../CLAUDE.md`](../CLAUDE.md) |
| Le script d'origine (corrigé) | `../GUIDE_VASHNIK_MYTHIQUE_SCRIPT_VIDEO.md` |
| Les sources de la vidéo (texte, voix, image, son, rendu) | `../production/vashnik-express/` et son [`README.md`](../production/vashnik-express/README.md) |

## Contenu du dossier

```
dossier/
├── README.md                    ce fichier
├── ANNEXE_CREATION_VIDEO.md     la fabrication, de la demande à la livraison
├── DOSSIER_CREA.md              la DA : intention, personnages, couleurs, typo, composants, mouvement, son
├── dossier-crea.pdf             la DA mise en page (1920 × 1080, 12 pages)
├── planches/                    les 7 planches de DA validées + vue d'ensemble
├── decoupage-12min/             les 16 images clés de la future version 12 min + vue d'ensemble
├── images-cles/                 21 images de la vidéo finale (nommées minute-seconde : 1-36_5 = 1:36,5)
├── essais-voix/                 les essais de voix comparés (Kokoro retenue, trois voix Piper)
└── sources/
    ├── boards.html              source des planches
    ├── frames.html              source du découpage
    ├── capture.mjs              refait planches/ et decoupage-12min/
    ├── dossier-crea.html        source du PDF
    ├── pdf.mjs                  refait dossier-crea.pdf
    ├── detourages/              détourages qui ne sont pas dans la production (portrait 9:16, buste, gnome provisoire)
    └── originaux/               l'image du boss telle qu'envoyée
```

## Refaire les images du dossier

Depuis `dossier/sources/` (Playwright nécessaire : `npm i -g playwright`) :

```bash
node capture.mjs             # planches + découpage (OUT=/autre/dossier pour ne pas écraser)
node pdf.mjs                 # dossier-crea.pdf
```

Les images clés viennent de la vidéo : dans `production/vashnik-express/`,
`node render.mjs --stills 12,43,56.2` écrit les images dans `out/stills/`.

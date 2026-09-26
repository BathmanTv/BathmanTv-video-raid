# Vashnik le Malveillant — strat express (3 min)

Version courte du guide (§9 de `GUIDE_VASHNIK_MYTHIQUE_SCRIPT_VIDEO.md`) : 2 min 55, 1920×1080,
30 i/s, présentée par Gideon. La charte (couleurs, polices, encart télé, plan de salle) est celle
des planches validées.

Vidéo : `out/delivery/vashnik-express-master.mp4` (−16 LUFS, vérifiée par `finalize_delivery.sh`, avec sa planche
contact et son rapport de livraison).

## Déroulé

| Temps | Scène | Ce qu'on voit |
|---|---|---|
| 0:00 | Carton d'intro | Gideon au diner, « Vashnik le Malveillant », Mythique, phase unique, 2·4·14, Héroïsme au pull |
| 0:08 | Accroche | Gideon face caméra, encart « Le combat » → « Tenir une rotation » |
| 0:16 | La salle | Le plan de salle dans l'encart, les trois fontaines s'allument quand elles sont nommées, puis le plan passe en plein écran ; la Cavité malveillante |
| 0:29 | Absorption | La barre d'énergie se remplit, Vashnik entre (médaillon sur le plan, carte du boss à droite) et boit aux deux fontaines les plus proches |
| 0:38 | Rotation | Sang+Ombre → Ombre+Flamme → Flamme+Sang, le boss se déplace, la Vapeur toxique compte ses piles |
| 0:46 | Les venins | Les venins rampent vers la Cavité : 1 = survivable, 2 = WIPE ; le venin durci après 60 s |
| 1:07 | Les trois venins | Face caméra + vignettes : le Sang se divise, l'Ombre (5, voile = 100 % des PV, flaques loin du raid), la Flamme (on contrôle le premier, on tue le second), puis Gideon « chut » : « Jamais les deux ensemble » |
| 1:39 | Les infections | Trois mini-schémas : on se rapproche, on s'écarte (3,5 m), on étale les dissipations |
| 2:02 | Réflexes de fond | Crochets dégoulinants (l'ingénieur, côté tanks, swap), Écume pestilentielle (entre les axes), Catalyseur malveillant (chaque impact encaissé) |
| 2:26 | Mythique | Les tumeurs apparaissent, Malveillance = wipe à retardement, les vagues d'Écume les détruisent |
| 2:44 | Fin | « Tuez les adds, tournez les fontaines, lisez les infections. Et Vashnik tombe. » |

Chaque phrase de la voix off vient du script, raccourcie sans ajouter de fait ni de chiffre
(`vo/script.json`). Les chiffres à l'écran sont ceux de l'annexe §10.

## Couleurs

Règle du script : **cyan** = vocabulaire technique et chiffres, **or** = danger (WIPE compris),
**rouge / violet / orange** = Sang / Ombre / Flamme. Pour le texte sur fond nuit, les couleurs
des fontaines sont éclaircies (`--sang-t`, `--ombre-t`, `--flamme-t`), les zones gardent les
valeurs exactes du script.

## Voix

Synthèse **Kokoro** (voix française `ff_siwis`), calculée en local : c'est une voix de travail.
Pour la remplacer (voix enregistrée ou autre service), il suffit de fournir une phrase audio par
ligne de `vo/script.json` : tout le reste (sous-titres, animations, bruitages) se recale sur la
nouvelle table des temps.

Aides de prononciation (champ `say`) : « tanques » pour *tanks*, « exprèsse » pour *express*,
« ouaïpe » pour *wipe*. Le texte affiché reste l'original.

## Refaire la vidéo

```bash
pip install kokoro-onnx numpy scipy          # + ffmpeg, et playwright (npm i -g playwright)
# modèles : github.com/thewh1teagle/kokoro-onnx, release model-files-v1.0
#   kokoro-v1.0.onnx + voices-v1.0.bin → vo/models/ (ou KOKORO_DIR=…)
python3 vo/build_vo.py      # voix, table des temps, enveloppe → vo/out/
python3 mix.py              # voix + fond + bruitages → out/final.wav
node render.mjs             # → out/vashnik-express.mp4 (≈ 8 min)
bash finalize_delivery.sh out/vashnik-express.mp4 out/delivery vashnik-express   # skill lanshu
node render.mjs --stills 30,90,150   # images fixes → out/stills/
```

Aperçu live : servir ce dossier (`npx serve .`) et ouvrir `index.html` (espace = lecture,
←/→ = image par image).

Livraison : `finalize_delivery.sh` du skill *lanshu-create-ai-presenter-video* ramène le son à
−16 LUFS, produit une version maître et une version légère, vérifie le décodage complet et
sort une planche contact.

## Corrections du script

Faites dans `GUIDE_VASHNIK_MYTHIQUE_SCRIPT_VIDEO.md` :

- **Explosion stygienne** : la voix off dit maintenant « trois mètres cinquante », comme l'annexe et le
  texte à l'écran (6 m reste le rayon de la bile).
- Coquilles : « Un alone : » → « Une seule règle : », « Méthode » → « Method », « La orange » →
  « L'orange », « rament » → « rampent ».

Encore ouvert dans la version longue : la voix de la section 3 arrondit l'Explosion malveillante
(« un million six cent mille ») alors que l'annexe donne 1 666 813 et demande de ne pas arrondir.
La version express ne cite pas ce chiffre à l'oral.

## Fichiers

- `index.html`, `style.css`, `video.js` : la composition (chaque image = fonction du temps)
- `vo/script.json`, `vo/build_vo.py`, `vo/out/` : voix off et table des temps
- `mix.py` : bande-son
- `render.mjs` : rendu Chromium + ffmpeg (moteur du showreel hauserjean-site)
- `assets/img/` : Gideon détouré, Vashnik (image du boss et médaillon centré sur la tête), l'ingénieur détouré, le diner, « chut »

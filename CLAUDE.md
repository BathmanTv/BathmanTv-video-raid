# Vidéos de raid — contexte pour reprendre le projet

Ce dépôt contient le script `GUIDE_VASHNIK_MYTHIQUE_SCRIPT_VIDEO.md`, les images source (racine)
et la production de la vidéo courte dans `production/vashnik-express/` (voir son `README.md`).
Le dossier complet (DA, planches, découpage, fabrication pas à pas) est dans `dossier/` :
commencer par `dossier/README.md`.

## Règles de l'auteur (à respecter dans toute vidéo)

- Ne jamais montrer de données personnelles : pseudos réels, messages privés, identifiants de
  compte, de guilde ou de serveur, clés d'API.
- Phrases à éviter : « intelligence artificielle », « agents IA », « machine learning ».
- Ne rien inventer : aucun chiffre, aucune fonctionnalité, aucun témoignage de joueur qui ne soit
  pas dans le script.
- Chiffres : ne pas arrondir, ne pas reformuler en « environ » si le chiffre est exact.

## Ce qui est validé

- Le présentateur s'appelle **Gideon** (armure, casque sans bouche : pas de synchro labiale, ses
  yeux et ses gemmes s'allument avec la voix).
- La direction artistique des planches : plan caméra + encart télé cerclé d'or, plans de salle
  schématiques, cyan = technique, or = danger, une couleur par fontaine (détails dans le README
  de la production).
- Le boss est représenté par l'image fournie par l'auteur (`assets/img/vashnik.png`).
- Explosion stygienne : 3,5 m (corrigé dans le script).

## Questions encore ouvertes

- Orthographe du boss : la vidéo et le script disent « Vashnik », l'auteur a écrit « Vashniek »
  en envoyant l'image. À confirmer avant de toucher aux textes.
- Version longue (12 min) : pas encore produite. Sa section 3 dit « un million six cent mille »
  alors que l'annexe donne 1 666 813 : à corriger si l'auteur le confirme.
- Voix : Kokoro `ff_siwis` est une voix de travail ; l'auteur peut enregistrer les phrases de
  `vo/script.json` à la place (`vo/rec/00.wav`, `01.wav`…, voir le README de la production).

## Refaire la vidéo dans une nouvelle session

Les commandes sont dans `production/vashnik-express/README.md`. Ce qui n'est pas dans le dépôt
et doit être récupéré à chaque nouvelle session :

- les modèles Kokoro (`kokoro-v1.0.onnx`, `voices-v1.0.bin`) : release `model-files-v1.0` de
  github.com/thewh1teagle/kokoro-onnx (Hugging Face n'est pas joignable depuis l'environnement
  cloud) ;
- `finalize_delivery.sh` : dossier `scripts/` de
  github.com/cclank/lanshu-create-ai-presenter-video ;
- `vo/out/voice.wav` : régénéré par `python3 vo/build_vo.py`.

# Dossier de créa — Vashnik le Malveillant · strat express

Direction artistique de la vidéo guide présentée par Gideon. La version mise en page est
`dossier-crea.pdf` ; les images citées sont dans ce dossier.

---

## 1. L'intention

Une vidéo explication de boss, comme une émission : **un présentateur face caméra** qui parle
du sujet, **un encart télé** qui montre la mécanique pendant qu'il parle, puis **des plans
schématiques** (le plan de salle vu de dessus) qui montrent la mécanique en mouvement.

- Ton : direct, technique, sans condescendance (fiche technique du script).
- Le spectateur doit pouvoir suivre une fontaine **sans lire**, juste à la couleur (règle du
  script, §2.1).
- Rien d'inventé : chaque phrase vient du script, chaque chiffre de l'annexe §10.

| | |
|---|---|
| Format | 16:9, 1920 × 1080, 30 i/s |
| Durée | 2 min 55 (version « strat express », §9 du script) |
| Voix | française, une phrase par ligne de `vo/script.json` |
| Son | −16 LUFS intégrés (publication) |

---

## 2. Les personnages

### Gideon, le présentateur

- Chevalier en armure bleu roi et or, gemmes cyan, cape violette, casque sans bouche.
- Image : `production/vashnik-express/assets/img/gideon.png` (détourée depuis l'image n° 4
  fournie, format 16:9).
- **Pas de synchronisation labiale** : le casque n'a pas de bouche. Ses deux yeux, la gemme
  du front et la gemme du torse **s'allument au rythme de la voix** (enveloppe de la voix,
  30 valeurs par seconde).
- Vie à l'image : respiration lente (cycle de 4,4 s, ±3 px, ±0,5 % d'échelle).
- Bandeau nom (lower third) : « GIDEON — COACH DE RAID », barre or, onde de voix de
  16 barres cyan qui suit la voix.
- Autres images : Gideon au diner (cartons d'intro et de fin), Gideon « chut » (« Jamais les
  deux ensemble »).

### Vashnik le Malveillant, le boss

- Image fournie par l'auteur (`assets/img/vashnik.png`, originale dans
  `dossier/sources/originaux/`).
- Sur le plan de salle : **médaillon rond** centré sur la tête (`vashnik-token.png`),
  cerclé d'or (la couleur du danger), halo or qui pulse, étiquette « VASHNIK » dessous.
- Pendant l'explication de l'Absorption : **carte du boss** « LE BOSS · Vashnik le
  Malveillant » avec l'image en grand.

### L'ingénieur (côté tanks)

- L'orc fourni sur fond vert, détouré (`assets/img/ingenieur.png`). Il illustre « Crochets
  dégoulinants : les tanks swap ».

---

## 3. Les couleurs

Toutes les couleurs de base viennent du personnage (planche 00) ; les couleurs des mécaniques
viennent du script (§2.1, « identique à l'overlay de la guilde »).

### Base (personnage et habillage)

| Nom | Hex | Usage |
|---|---|---|
| Nuit | `#04050F` | fond de tous les plans |
| Panneau | `#0A0C22` | encarts, cartes, tableaux |
| Bleu roi | `#08218E` | studio, badge Mythique |
| Armure | `#1F3FA8` | studio, dégradés |
| Gemme | `#3FB8FF` | losange de chapitre, onde de voix, lueur des yeux |
| Cyan | `#7ADBFA` | **vocabulaire technique** : noms de sorts, chiffres |
| Or | `#D19A45` | **danger** : tout ce qui tue, dont « WIPE » ; cadre de l'encart télé |
| Or clair | `#FFE982` | haut du dégradé de la barre du bandeau nom |
| Marbre | `#EDE9E1` | texte clair secondaire |
| Gris | `#A9B4C7` | étiquettes, noms anglais |

### Les trois fontaines

| Fontaine | Zone (valeur du script) | Texte sur fond nuit |
|---|---|---|
| Sang | `#8E1B2E` | `#E0566D` |
| Ombre | `#6B3FA0` | `#B08AE8` |
| Flamme | `#D1701F` | `#E8893A` |

Les zones gardent les valeurs exactes du script. Pour le **texte**, la même teinte est
éclaircie, sinon le rouge et le violet sont illisibles sur la nuit.

### Règles

1. Cyan = technique, or = danger, une couleur par fontaine. Rien d'autre ne prend ces rôles.
2. Quand une fontaine est nommée, son mot prend sa couleur (sous-titres compris).
3. Le badge « Mythique » est **bleu** (bleu roi → armure), pas violet : le violet appartient à
   l'Ombre.
4. Les planches proposaient un rouge « danger » et un vert « zone sûre » ; ils ont été retirés
   de la vidéo pour appliquer la règle du script (le danger est or).

---

## 4. La typographie

| Police | Graisse | Usage |
|---|---|---|
| **Barlow Condensed** | 700 | titres, noms de sorts, chapitres, en capitales |
| **Fira Sans** | 400 / 500 | texte courant, sous-titres (38 px), valeurs des cartes |
| **JetBrains Mono** | variable | étiquettes, badges, chronos, en capitales espacées (0,16–0,22 em) |

Les noms anglais des sorts sont en Fira Sans italique grise, entre parenthèses, après le nom
français (comme dans le script).

---

## 5. Les composants

Tous définis dans `production/vashnik-express/style.css`.

| Composant | Description |
|---|---|
| **Studio** | fond nuit, halo bleu armure derrière le présentateur, trame de points cyan à 9 % |
| **Chapitre** (haut gauche) | losange gemme, « 01 · Le principe », séparateur, sous-titre mono gris, barre de progression cyan |
| **Badges** (haut droite) | « VASHNIK » (contour gris) + « MYTHIQUE » (bleu, contour cyan) |
| **Bandeau nom** | panneau nuit, barre or à gauche, filet or en bas, « GIDEON / COACH DE RAID », onde de voix |
| **Encart télé** | cadre or 2 px, bandeau or de 44 px avec voyant et titre en Barlow, corps panneau |
| **Cases Qui / Quand / Quoi** | trois cases sous l'encart, filet cyan en haut |
| **Carte de sort** | nom en Barlow couleur de la mécanique, nom anglais en italique, valeurs en Fira Sans |
| **Bloc** | texte 30 px sur nuit, filet gauche 5 px de la couleur du sujet |
| **Tampon** | « WIPE » en Barlow 200 px, or, halo or |
| **Sous-titres** | Fira Sans 500, 38 px, centrés, sur un dégradé sombre ; les mots-clés gardent leur couleur |

---

## 6. Le plan de salle

Un seul plan de salle vu de dessus, qui vit pendant toute la partie « principe » (0:16 → 1:07) :

- trois tiers colorés (Sang en haut à gauche, Ombre en haut à droite, Flamme en bas), chacun
  avec sa fontaine ;
- au centre, la **Cavité malveillante** (cercle pointillé or) : le point de défaite ;
- les fontaines s'allument quand elles sont nommées ;
- le médaillon de Vashnik entre, boit aux deux fontaines les plus proches (lignes pointillées),
  puis tourne d'un tiers à l'autre (Sang+Ombre → Ombre+Flamme → Flamme+Sang) ;
- les venins rampent vers la Cavité : un venin = survivable, deux = tampon « WIPE » ;
- en Mythique : les tumeurs, puis les vagues d'Écume en croix qui les détruisent.

---

## 7. Le mouvement

- **Transitions** : fondu enchaîné de 0,35 s entre les plans.
- **Courbes** : sortie cubique pour les entrées, entrée cubique pour les sorties, un léger
  rebond (« back ») pour les éléments qui se posent.
- **Tout est calé sur la voix** : chaque apparition est placée sur le mot qui la déclenche
  (estimation au prorata des caractères de la phrase).
- **Sous-titres** : une ligne à la fois, coupée à la ponctuation (jamais de « : » en début de
  ligne), synchronisée sur la phrase.
- **Gideon** : respiration et lueurs, rien d'autre ; il ne « joue » pas.
- **Fin** : lent zoom (5 %) sur le diner puis fondu au noir de 1,2 s.

---

## 8. Le son

- **Voix** : une phrase à la fois, 0,5 s entre deux phrases d'une scène, 1,4 s entre deux
  scènes, 3 s d'installation avant la première phrase, 5 s après la dernière.
- **Fond musical** : fa mineur, 72 BPM (même tempo que le showreel GIDEON), accords
  Fm – D♭ – A♭ – E♭, pads, basse, arpège discret, pulsation douce sur les temps.
- **Le fond s'efface sous la voix** (environ −9 dB) et revient dans les silences.
- **Bruitages** calés sur les animations : souffles aux transitions, clochettes quand une
  fontaine s'allume, impacts sur « WIPE », « chut » de Gideon, etc.
- Master : −16 LUFS intégrés, crête −2,1 dBFS.

---

## 9. Les planches et le découpage

- `planches/` : les **7 planches validées** (charte, ouverture, plan caméra + encart télé,
  plan in-game, schéma tactique, carton de chapitre, à retenir). Leurs textes étaient
  provisoires ; la DA est celle qui a été validée.
- `decoupage-12min/` : le **découpage de la version 12 minutes**, 16 images clés faites
  d'après le script (la version longue n'est pas encore produite).
- `images-cles/` : 21 images de la **vidéo finale** (nommées minute-seconde).

---

## 10. Les règles de contenu

- Ne jamais montrer de données personnelles : pseudos réels, messages privés, identifiants de
  compte, de guilde ou de serveur, clés d'API.
- Phrases à éviter : celles que liste l'auteur dans `CLAUDE.md`.
- Ne rien inventer : aucun chiffre, aucune fonctionnalité, aucun témoignage qui ne soit pas
  dans le script.
- Ne pas arrondir, ne pas reformuler en « environ » si le chiffre est exact.

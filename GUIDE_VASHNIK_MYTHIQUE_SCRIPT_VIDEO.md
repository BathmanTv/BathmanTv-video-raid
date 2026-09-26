# Guide vidéo — Vashnik le Malveillant · MYTHIQUE
### The Venomous Abyss · patch 12.1 « La malédiction d'Ula'tek »

> **Document de production pour Claude.** Script mot à mot d'une vidéo de guide de raid,
> avec un présentateur face caméra. Chaque chiffre vient de l'API/des pages officielles
> (Wowhead, Method, Mythic Trap) et chaque nom de sort est donné **en français, tel qu'il
> s'affiche en jeu**, avec le nom anglais entre parenthèses.
> **Durée cible : 12 minutes.** Format 16:9, 1920×1080, 30 fps.

---

## 1. Fiche technique

| | |
|---|---|
| **Titre** | Vashnik le Malveillant — Guide Mythique |
| **Sous-titre** | The Venomous Abyss · 3ᵉ ou 5ᵉ boss selon votre route |
| **Durée** | 12 min (version courte « strat express » : 3 min, voir §9) |
| **Format** | 16:9, 1920×1080, 30 fps |
| **Langue** | Français — noms de sorts FR, noms anglais entre parenthèses |
| **Composition** | 2 tanks · 4 heals · 14 DPS |
| **Héroïsme** | **Au pull** |
| **Ton** | Direct, technique, sans condescendance. On explique, on ne juge pas. |

---

## 2. Charte visuelle et matériel disponible

### 2.1 Palette (identique à l'overlay de la guilde)

| Rôle | Hex | Usage |
|---|---|---|
| Fond | `#04050f` | Arrière-plan des cartons |
| Panneau | `#0a0c22` | Encarts, tableaux |
| Cyan | `#7adbfa` | **Vocabulaire technique** : noms de sorts, chiffres |
| Or | `#d19a45` | **Danger** : tout ce qui tue |
| Rouge sang | `#8e1b2e` | Fontaine de Sang |
| Violet | `#6b3fa0` | Fontaine d'Ombre |
| Orange | `#d1701f` | Fontaine de Flamme |

**Règle couleur** : chaque fois qu'une mécanique est citée, son texte prend la couleur de la
fontaine concernée. Le spectateur doit pouvoir suivre une fontaine **sans lire**, juste à la
couleur.

### 2.2 Matériel fourni (à utiliser tel quel)

| Fichier | Contenu | Usage prévu |
|---|---|---|
| Gideon chibi — diner (1) | Mascotte à la table, tasse à la main | **Présentateur** : carton d'intro et de fin |
| Gideon chibi — close-up (2) | Mascotte, gros plan | Transition « on passe aux choses sérieuses » |
| Gideon chibi — « chut » (3) | Doigt sur la bouche | Moment « la règle qu'on ne discute pas » |
| Gideon chibi — hologrammes (4) | Mascotte entourée de graphiques | Section chiffres / crédits |
| Poster « Appel de la pluie » (5) | Planche BD, style comic | Touche d'humour (§8, une seule fois) |
| Boss épouvantail (6) | Silhouette encapuchonnée, yeux verts | Interstitiel « mécanique » |
| **Render chroma — ingénieur (7)** | Fond vert, incrustable | Vignette « côté tanks » |
| **Render chroma — boss (8)** | Fond vert, incrustable | **Vashnik lui-même** : chaque fois que le boss agit |

**Les deux renders sur fond vert sont les seuls actifs incrustables** : les utiliser pour
matérialiser le boss au-dessus d'un schéma de salle, jamais comme simple illustration.

### 2.3 Visuels à produire

1. **Plan de salle vu de dessus** — trois tiers colorés, la Cavité malveillante au centre,
   les trois fontaines. **C'est le visuel le plus utilisé de la vidéo** : il doit apparaître
   au moins six fois, avec des surcouches différentes.
2. **Plan de salle animé** — le boss qui se déplace d'un tiers à l'autre, avec les deux
   fontaines drainées qui s'illuminent. Deux cycles complets.
3. **Une vignette par venin** (3) — le Sang qui se divise, l'Ombre sous son voile, la Flamme
   qui pulse.
4. **Une vignette par infection** (3) — montrer la position à adopter, pas juste le nom.

---

## 3. Structure du script

| # | Section | Durée | Présentateur | Visuel dominant |
|---|---|---|---|---|
| 1 | Accroche | 0:00 – 1:00 | Face cam | Carton d'intro |
| 2 | La salle et les fontaines | 1:00 – 3:00 | Face cam + schéma | Plan de salle |
| 3 | Ce qui tue : les venins | 3:00 – 4:30 | Voix off | Plan animé |
| 4 | Les trois fontaines | 4:30 – 7:30 | Face cam par bloc | Vignettes venins |
| 5 | Les infections | 7:30 – 9:00 | Face cam | Vignettes infections |
| 6 | Les mécaniques permanentes | 9:00 – 10:30 | Voix off | Extrait de raid |
| 7 | Le Mythique : les tumeurs | 10:30 – 11:30 | Face cam | Schéma des vagues |
| 8 | Le plan de raid | 11:30 – 12:00 | Face cam | Tableau récap |

---

## 4. Le script

### SECTION 1 — Accroche · 0:00 → 1:00

**PRÉSENTATEUR, face cam. Carton d'intro derrière lui (Gideon chibi au diner).**

> « Vashnik le Malveillant. Troisième boss de The Venomous Abyss — ou cinquième, selon
> comment vous avez ouvert le raid.
>
> Le combat a une seule phase, et pourtant c'est l'un des boss où les guildes perdent le plus
> de temps. Pourquoi ? Parce qu'il ne demande pas de faire de gros dégâts. Il demande de
> **tenir une rotation** : bouger le boss, tuer les adds, gérer les infections — dans le bon
> ordre, pendant huit minutes, sans jamais se tromper deux fois de suite.
>
> Un alone : **tous les adds doivent mourir avant d'atteindre le centre de la salle**. Il y en
> a trois types. Une fois que vous les connaissez, le boss est résolu. »

**Fin de la carte : « Il y a trois fontaines. Trois venins. Une seule règle. »**

**Notes** : ne pas donner de rating ni d'avis sur le boss. Méthode a noté ce combat 2/5 en
disant qu'il « fait le travail sans enthousiasmer » — ce n'est pas notre propos ici.

---

### SECTION 2 — La salle et les fontaines · 1:00 → 3:00

**PRÉSENTATEUR, face cam, puis transition vers le plan de salle.**

> « Regardons la salle. Elle est découpée en **trois tiers**, et chaque tiers a sa fontaine.
> Une rouge — le **Sang**. Une violette — l'**Ombre**. Une orange — la **Flamme**.
>
> Au centre : la **Cavité malveillante**. Retenez-la, c'est le point de défaite du combat.
>
> Vashnik possède une barre d'énergie. Quand elle atteint cent pour cent, il lance
> **Absorption** *(Imbibe)*. Et c'est là que tout se joue : il ne boit pas où il veut. **Il boit
> aux deux fontaines les plus proches de sa position.**
>
> Donc **ce sont les tanks qui écrivent le combat**. Vous positionnez le boss, vous choisissez
> quelles deux fontaines seront drainées, et vous décidez de ce que le raid va vivre pendant
> la minute suivante. C'est la décision la plus importante du combat — et elle se prend avant
> chaque Absorption, pas pendant. »

**VISUEL : plan de salle. Le boss se déplace, deux fontaines s'illuminent.**

> « Chaque fontaine bue apporte une **Imprégnation** qui dure quatre-vingt-dix secondes : elle
> augmente les dégâts de son expulsion de cent pour cent, et **gonfle de cinquante pour cent
> les points de vie des adds qu'elle produit**. Et cette imprégnation **se cumule**.
>
> C'est pour ça qu'on ne tankera jamais le boss deux fois de suite sur la même fontaine. On
> tourne. »

**TEXTE À L'ÉCRAN (cyan) :**
```
Rotation par défaut :
SANG + OMBRE  →  OMBRE + FLAMME  →  FLAMME + SANG  →  …
Une seule nouvelle fontaine par cycle.
```

> « Et il y a la **Vapeur toxique**. Chaque Absorption ajoute une pile permanente de dégâts
> sur tout le raid. Ce n'est pas une mécanique : c'est une horloge. Plus le combat dure, plus
> la salle fait mal, et il n'existe **aucun moyen de l'enlever**. Ce combat a un chronomètre
> déguisé. »

**Notes de réalisation** : incruster le render chroma du boss sur le schéma pendant qu'il boit.
Le boss doit **physiquement** aller d'un tiers à l'autre à l'écran.

---

### SECTION 3 — Ce qui tue : les venins · 3:00 → 4:30

**Voix off sur plan de salle animé. Pas de face cam — on veut toute l'attention sur le schéma.**

> « Quand Vashnik boit, les fontaines ne se contentent pas de réagir : **elles éjectent un
> venin vivant.** Et ce venin **rampe vers la Cavité, au centre de la salle**.
>
> Il faut être très clair sur ce point, parce que c'est ici que les pulls meurent : si un
> venin atteint la Cavité, il déclenche une **Explosion malveillante** *(Malignant Burst)*.
> Un million six cent mille dégâts de Nature sur tout le raid — **puis trois cent trente mille
> toutes les trois secondes pendant trente secondes, cumulable.**
>
> Un venin qui passe, c'est sauvable avec des gros cooldowns. **Deux, c'est un wipe.** »

**TEXTE À L'ÉCRAN (or) :**
```
1 venin qui atteint le centre  → survivable
2 venins                        → WIPE
```

> « Et il y a une deuxième raison de ne pas attendre : après **soixante secondes**, tout venin
> encore en vie reçoit **Venin durci** *(Hardened Venom)*. Il devient **insensible aux
> contrôles** et gagne **cinquante pour cent de vitesse de déplacement**.
>
> Autrement dit : un add qu'on garde « pour plus tard » devient un add qui court plus vite que
> vous et qu'on ne peut plus ralentir. **Il n'y a pas de plus tard.** »

**Notes** : le schéma doit montrer un venin qui progresse vers le centre et un compteur de
temps qui court. Le mot « WIPE » apparaît en or, pas en rouge vif — on informe, on ne dramatise pas.

---

### SECTION 4 — Les trois fontaines · 4:30 → 7:30

> **Structure : trois blocs identiques.** Pour chacune, le présentateur revient face cam
> **trente secondes**, puis on enchaîne sur la vignette. La répétition du format aide le
> spectateur à mémoriser : c'est un guide, pas un reportage.

#### 4.1 — Fontaine de SANG (rouge) · 4:30 → 5:30

**FACE CAM.**

> « Commençons par la rouge, le Sang. Son venin s'appelle le **venin coagulant**.
>
> Deux choses à savoir. Un : il est **insensible aux contrôles de foule** — il est protégé dès
> sa sortie par **Robustesse sanguine** *(Sanguineous Fortitude)*. Aucun ralentissement, aucune
> immobilisation : il faut le brûler, point.
>
> Deux : **quand il meurt, il se divise.** Il laisse des **caillots plus petits** qu'il faut
> tuer aussi. C'est l'erreur classique : on tue le gros, on tourne la tête, et les petits
> arrivent au centre. »

**VIGNETTE : le gros caillot qui se scinde en deux, puis quatre.**

> « Quand le Sang est actif, l'infection correspondante est l'**Infection siphonnante**. On y
> revient dans une minute — mais retenez déjà qu'elle se joue **à plusieurs**, pas seul dans
> son coin. »

#### 4.2 — Fontaine d'OMBRE (violet) · 5:30 → 6:30

**FACE CAM.**

> « La violette, l'Ombre. Son venin, le **venin embrumé**, arrive avec une **Couche
> miasmatique** *(Miasmic Coating)* : une absorption qui vaut **cent pour cent de ses points de
> vie**. Traduction : vous le tuez **deux fois**.
>
> Bonne nouvelle, contrairement au caillot rouge : celui-là, **vous pouvez le contrôler**.
> Serrez-en quelques-uns pendant que vous finissez les prioritaires.
>
> Mais attention à sa mort : il **éclate** et projette du venin d'ombre au sol. Vous le tuez
> **là où vous voulez que les flaques tombent**, pas là où il se trouve. »

**VIGNETTE : le kill qui laisse des zones au sol, avec la bonne et la mauvaise position.**

> « Et une chose : il en arrive **par paquets de cinq**. C'est un travail de dégâts de zone,
> pas de mono-cible. »

#### 4.3 — Fontaine de FLAMME (orange) · 6:30 → 7:30

**FACE CAM. Le ton se durcit légèrement — c'est la fontaine la plus dangereuse.**

> « La orange, la Flamme. Et celle-là, c'est la priorité absolue des trois.
>
> Son venin, le **venin brûlant**, **pulse des dégâts sur tout le raid tant qu'il est en vie**
> — **Présence brûlante** *(Burning Presence)*. Chaque seconde qu'il passe vous coûte, à vous
> comme à vos soigneurs.
>
> Et quand il meurt, il explose : **Afflux caustique**, des dégâts sur tout le raid,
> **plus un saignement cumulable**. Deux venins brûlants qui meurent **en même temps**,
> c'est deux explosions qui s'empilent. Ça tue un raid en bonne santé.
>
> Donc la règle est simple, et elle n'est pas négociable : **on les tue en décalé.** »

**VIGNETTE : deux venins, un étourdi, l'autre en train de mourir — puis on échange.**

> « Il en arrive deux. On contrôle le premier pendant qu'on tue le second, et on finit le
> premier quand le debuff de l'explosion est retombé. **Jamais les deux ensemble.** »

**TEXTE À L'ÉCRAN (or) :**
```
FLAMME = PRIORITÉ 1
Ne jamais laisser deux venins brûlants mourir ensemble.
```

---

### SECTION 5 — Les infections · 7:30 → 9:00

**FACE CAM. C'est la section la plus importante du point de vue de la précision — chaque joueur doit savoir quoi faire de son debuff.**

> « Voilà ce qui fait la particularité de ce combat. Vashnik n'a pas une liste fixe
> d'infections : il **infecte les joueurs avec le venin de ses fontaines actives.** Autrement
> dit : **lire les deux fontaines qu'il vient de boire vous dit exactement quelle infection
> arrive.** Anticiper, au lieu de réagir.
>
> Trois cas, trois réflexes opposés. Et si vous ne retenez qu'une chose de cette vidéo,
> retenez celle-ci : **ces trois infections se jouent dans trois directions différentes.** »

**VISUEL : trois mini-schémas côte à côte, montrant une position de raid différente à chaque fois.**

#### Infection siphonnante *(Siphoning Infection)* — sang

> « **Siphonnante**, du Sang. Les joueurs marqués prennent un saignement **et** une énorme
> absorption de soins. Leur soin reçu est réduit de **cent pour cent** — les soigneurs ne
> peuvent littéralement rien pour eux.
>
> La seule façon de s'en sortir : ces joueurs **volent la vie de ceux qui les entourent**.
> Donc il faut **des corps dans leur cercle**. Concrètement : on décide à l'avance si le raid
> vient nourrir le siphon ou si on « mange » l'absorption — et on fait **toujours le même
> choix**, pour que les soigneurs ne devinent pas à chaque fois. »

**TEXTE À L'ÉCRAN (rouge) :**
```
SANG → on se rapproche, il faut des corps dans le cercle.
```
**Mythique : le saignement frappe environ cinq fois plus fort. C'est la section à ne pas rater.**

#### Infection stygienne *(Stygian Infection)* — ombre

> « **Stygienne**, de l'Ombre. Même principe d'absorption, mais **comportement inverse** :
> ces joueurs émettent périodiquement une **Explosion stygienne** — un éclat de venin sombre qui
> frappe **tout le monde dans un rayon de six mètres**.
>
> Donc eux, on les **écarte**. Loin du raid, loin les uns des autres. C'est un travail de
> placement, pas une urgence de soin : elle se soigne, mais elle ne doit pas clipper le reste
> du groupe. »

**TEXTE À L'ÉCRAN (violet) :**
```
OMBRE → on s'écarte. Cercle de 3,5 m : personne dedans.
```

#### Infection explosive *(Exploding Infection)* — flamme

> « **Explosive**, de la Flamme. La dernière, et elle ne se joue **ni au placement ni au
> soin** : elle se joue au **timing de dissipation**.
>
> Le joueur marqué porte un saignement de Feu. Quand on **dissipe** ce debuff, il **explose et
> frappe tout le raid**. Donc une dissipation, c'est un coup sur l'ensemble du groupe : on la
> traite comme telle.
>
> Deux règles : **on étale les dissipations** — jamais plusieurs d'un coup — et **on ne
> dissipe pas quand le raid est déjà bas.** On attend. »

**TEXTE À L'ÉCRAN (orange) :**
```
FLAMME → on étale les dissipations. Jamais sur un raid bas.
```
**Mythique : le debuff gagne une pile toutes les 1,5 s tant qu'il n'est pas dissipé. Il pourrit
vite — mais il ne faut toujours pas dissiper trois joueurs en même temps.**

---

### SECTION 6 — Les mécaniques permanentes · 9:00 → 10:30

**VOIX OFF sur extrait de raid. Rythme plus rapide — ce sont des réflexes de fond, pas des décisions.**

> « Ces mécaniques-là tombent **quelles que soient les fontaines**. C'est votre routine de base. »

**CARTONS SUCCESSIFS, un par mécanique – 15 secondes chacun :**

**① Crochets dégoulinants** *(Dripping Fangs)* — *côté tanks*
> « Le tankbuster. Un gros coup physique, puis un saignement, **et surtout : deux cents pour
> cent de dégâts physiques subis en plus.** On ne tanke pas ça deux fois. **Swap systématique
> à chaque cast.** »
> **(Vignette chroma : l'ingénieur — côté tanks.)**

**② Écume pestilentielle** *(Plague Froth)* — *tout le monde*
> « Plusieurs joueurs sont marqués. À l'expiration, **quatre vagues partent en croix** — dans
> les quatre directions cardinales — et frappent très fort.
>
> Deux réflexes : les marqués **s'écartent du raid**, et tout le monde **se place entre les
> axes**, jamais dessus. Et on **ne bouge pas** quand on est marqué : les autres doivent
> pouvoir esquiver. »
> **Mythique : ces vagues ne servent pas qu'à vous tuer — elles détruisent les tumeurs. On y
> revient juste après.**

**③ Catalyseur malveillant** *(Malignant Catalyst)* — *tout le monde*
> « Vashnik congeale un orbe au-dessus de la Cavité et le fait exploser, ce qui projette de la
> **bile catalytique** un peu partout dans la salle.
>
> Chaque impact doit être **soaké par au moins un joueur**. Un impact sans personne,
> c'est **tout le raid** qui paie à la place. Donc on **s'étale pour couvrir**, on ne se
> regroupe pas sur un seul point. »

**④ Vapeur toxique** — *les soigneurs*
> « Et l'horloge du combat. Une pile permanente par Absorption, sur tout le raid, qui ne
> s'enlève jamais. Il n'y a pas de mécanique pour rattraper un combat trop long — il n'y a
> qu'un combat plus propre. »

---

### SECTION 7 — Le Mythique : les tumeurs · 10:30 → 11:30

**FACE CAM. C'est le moment où le guide devient spécifiquement Mythique — le ton se resserre.**

> « Voilà ce que le Mythique ajoute, et c'est **une seule mécanique** — mais elle change tout.
>
> À chaque Absorption, en plus des venins, des **Tumeurs malveillantes** apparaissent dans la
> salle. Et si elles ne sont **pas** détruites, elles infligent **Malveillance**
> *(Malignance)* : six cent soixante-six mille dégâts de Nature sur tout le raid, puis deux
> cent huit mille **toutes les deux secondes pendant une minute** — et **ça se cumule**. »

**TEXTE À L'ÉCRAN (or) :**
```
Tumeurs non détruites = Malveillance cumulable = wipe à retardement
```

> « Alors comment on les détruit ? Avec l'Écume pestilentielle. Sur Mythique, **les vagues
> pestilentielles détruisent les tumeurs**.
>
> C'est-à-dire que la mécanique que vous appreniez à **esquiver** devient aussi votre seul
> outil pour détruire les tumeurs. **Les joueurs marqués doivent orienter leurs vagues vers
> les tumeurs** — d'où l'importance de bien se placer avant l'expiration du debuff. »

**VISUEL : plan de salle avec les tumeurs, puis des joueurs marqués qui se placent pour que
leurs vagues en croix balaient les tumeurs.**

> « Deux autres renforcements, plus discrets mais qui font mal : l'**Infection siphonnante**
> frappe environ **cinq fois plus fort** qu'en Héroïque, et l'**Infection explosive** gagne une
> pile **toutes les une seconde et demie** tant qu'elle n'est pas dissipée. »

---

### SECTION 8 — Le plan de raid · 11:30 → 12:00

**FACE CAM. Récapitulatif rapide, sur un tableau à l'écran.**

> « Le plan, en cinq lignes. »

**TABLEAU À L'ÉCRAN :**

| Avant chaque Absorption | Les tanks amènent le boss sur la **nouvelle** fontaine prévue. |
|---|---|
| **Tanks** | Swap à **chaque** Crochet dégoulinant. Le positionnement est votre responsabilité, pas celle du raid lead. |
| **Tous** | Chaque venin meurt **avant** le centre. Contrôler la Flamme, brûler le Sang jusqu'aux caillots, finir l'Ombre. |
| **Infections** | Sang → on se rapproche · Ombre → on s'écarte · Flamme → on étale les dissipations. |
| **Mythique** | Les vagues d'Écume **détruisent les tumeurs**. On oriente, on ne subit pas. |

> « Ce combat ne se gagne pas en faisant plus de dégâts. Il se gagne en **n'oubliant rien deux
> fois**. Tuez les adds, tournez les fontaines, lisez les infections — et Vashnik tombe. »

**Note de fin** : si l'option humoristique est retenue, c'est **ici et nulle part ailleurs**
qu'on place l'image du poster « Appel de la pluie », en carton de fin sur deux secondes,
**sans commentaire**. Une seule touche, jamais pendant une explication technique.

---

## 9. Version courte « strat express » · 3 minutes

À produire en plus de la version complète, sur les mêmes rushs.

| Temps | Contenu |
|---|---|
| 0:00 – 0:20 | Les 3 fontaines, le boss boit les 2 plus proches → **les tanks décident** |
| 0:20 – 0:50 | Les venins rament vers le centre → **jamais 2 qui passent** |
| 0:50 – 1:30 | Sang = se diviser · Ombre = 5 + voile · Flamme = priorité, tuer en décalé |
| 1:30 – 2:10 | Infections : **Sang on se rapproche · Ombre on s'écarte · Flamme on étale** |
| 2:10 – 2:40 | Swap tank à chaque Crochet · Écume en croix · Soak la bile |
| 2:40 – 3:00 | **Mythique : les vagues d'Écume détruisent les tumeurs, sinon Malveillance = wipe** |

---

## 10. Annexe — tous les chiffres cités

> Relevés sur Wowhead (patch 12.1.0) et Mythic Trap, en difficulté **Mythique**.
> **Ne pas arrondir, ne pas reformuler en « environ » si le chiffre est exact.**

| Sort (FR) | Sort (EN) | Effet | Valeur |
|---|---|---|---|
| Explosion malveillante | Malignant Burst | Venin arrivé au centre | 1 666 813 Nature + 333 363 / 3 s pendant 30 s, cumulable |
| Malveillance | Malignance | Totem non détruit | 666 725 Nature + 208 352 / 2 s pendant 1 min, cumulable |
| Crochets dégoulinants | Dripping Fangs | Tankbuster | 2 083 514 Physique + DoT + **+200 % dégâts physiques subis** |
| Infection siphonnante | Siphoning Infection | DoT + absorption | 58 338 Shadow / 1,5 s + **1 065 736** d'absorption ; **soins reçus −100 %** |
| Explosion stygienne | Stygian Burst | Éruption d'ombre | **583 385** Shadow dans **3,5 m** |
| Infection explosive | Exploding Infection | DoT Feu | 20 835 Feu / 1,5 s ; à la dissipation → Éclatement caustique **233 354** Feu raid |
| Vague de peste | Plague Wave | Vagues en croix | **666 725** peste ; **détruit les Tumeurs en Mythique** |
| Présence brûlante | Burning Presence | Venin brûlant en vie | 37 503 Feu raid toutes les 3 s |
| Afflux caustique | Caustic Surge | Mort d'un venin brûlant | **100 009** Feu raid + 83 341 / 1 s pendant 3 s, cumulable |
| Expulsion d'hémoglobine | Hemo Expulsion | Expulsion de sang | 108 343 Shadow raid |
| Expulsion obscure | Gloom Expulsion | Expulsion d'ombre | 108 343 Shadow raid |
| Expulsion déflagrante | Conflagrating Expulsion | Expulsion de flamme | 108 343 Feu raid |
| Venin durci | Hardened Venom | Après 60 s | Insensible aux CC, **+50 % vitesse** |
| Vapeur toxique | Toxic Vapor | Par Absorption | 16 668 Nature / 2 s, **cumulable, permanent** |
| Couche miasmatique | Miasmic Coating | Bouclier du venin embrumé | Absorption = **100 % de ses PV** |
| Éjection ombreuse | Umbral Ejection | Mort du venin embrumé | **541 714** Shadow dans **3 m** |
| Imprégnation (Sang/Ombre/Flamme) | Blood/Shadow/Flame Infusion | Par absorption | +100 % expulsion correspondante, **+50 % PV des adds**, 90 s, cumulable |

**Chiffres structurels :** combat à **phase unique** · composition **2/4/14** · Héroïsme **au
pull** · imprégnation **90 s** · durcissement des venins à **60 s** · vague de peste en
**4 directions cardinales** · rayon d'explosion stygienne **3,5 m** · rayon de la bile **6 m** ·
rotation par défaut **Sang+Ombre → Ombre+Flamme → Flamme+Sang**.

---

## 11. Annexe — sources et points de vigilance

**Sources croisées** (les trois se recoupent sur les mécaniques) :

| Source | Ce qu'elle apporte |
|---|---|
| **Mythic Trap** (FR) | Noms de sorts **français**, changements Mythique, TL;DR |
| **Method** | Stratégie de rotation des fontaines, « easy mode », lecture des infections |
| **Wowhead** | **Chiffres exacts** des sorts, sorts spécifiques au Mythique |

**Points de vigilance pour la production :**

1. **Le nom du totem diffère selon les sources.** Mythic Trap parle de « Tumeurs
   malveillantes » à détruire ; Wowhead nomme l'effet « Malveillance ». Ce sont **deux choses
   liées** : les tumeurs sont les cibles, Malveillance est ce qu'elles infligent si on les
   laisse vivre. La vidéo doit dire **les deux** dans cet ordre.
2. **Le « easy mode » de Method** (tanker en permanence entre Ombre et Flamme) est une
   **stratégie de guilde**, pas une mécanique. Elle peut être mentionnée en option, jamais
   présentée comme le fonctionnement du boss.
3. **Ne pas affirmer de timing d'Absorption.** Aucune source ne donne un intervalle fiable :
   la barre d'énergie est la seule référence. Dire « quand la barre est pleine », jamais « toutes
   les X secondes ».
4. **Le guide Wowhead a été critiqué** dans ses commentaires comme « une réécriture du journal
   de donjon ». Ne l'utiliser que pour les **chiffres**, jamais pour la stratégie.
5. **Toujours donner le nom de sort en français d'abord**, l'anglais entre parenthèses — la
   guilde joue en français.

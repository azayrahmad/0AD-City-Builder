# 0 A.D. Mod Code Diff Analysis & Verification Report

## Executive Summary

This document presents a comprehensive line-by-line diff audit comparing all files in this repository against the original base files in the official 0 A.D. Gitea repository.

**Verification Result:** **CONFIRMED**
100% of the code, template modifications, script additions, asset inclusions, and metadata in this repository are strictly and exclusively for the functionality of this mod (*City Building Auras & Synergies*). There are zero stray, unrelated, or accidental base game modifications.

---

## Reference & Methodology

- **Official 0 A.D. Gitea Repository:** [https://gitea.wildfiregames.com/0ad/0ad](https://gitea.wildfiregames.com/0ad/0ad)
- **Reference Tag / Release:** `v0.28.0` (0 A.D. Release 28, "Boiorix")
- **Base Mod Path:** `binaries/data/mods/public/`
- **Audit Method:** Line-by-line unified diff analysis comparing each repository file against its counterpart fetched from `https://gitea.wildfiregames.com/0ad/0ad/raw/tag/v0.28.0/binaries/data/mods/public/`.

---

## File Inventory Overview

| Category | Modified Base Files | New Mod Files | Total Files |
| :--- | :---: | :---: | :---: |
| **Simulation Templates (`simulation/templates/`)** | 41 | 0 | 41 |
| **Aura JSON Definitions (`simulation/data/auras/`)** | 0 | 22 | 22 |
| **AI Scripts (`simulation/ai/petra/`)** | 1 | 0 | 1 |
| **Art & Textures (`art/textures/`)** | 0 | 11 | 11 |
| **Mod Configuration & Docs** | 0 | 4 | 4 |
| **TOTAL** | **42** | **37** | **79** |

---

## Detailed Audit Breakdown

### 1. Modified Base Simulation Templates (`simulation/templates/`)

All 41 modified XML templates in `simulation/templates/` override base game entity definitions to attach mod building aura references (`<Auras datatype="tokens">...</Auras>`) and configure footprint/obstruction dimensions required by the 0 A.D. engine for aura rendering and spatial range calculations.

#### Core Structure & Gaia Parent Templates
* **`template_structure_civic.xml`**: Added `<Auras datatype="tokens">structures/mov_bonus_civic</Auras>` providing movement speed bonuses near civic centers.
* **`template_structure_economic.xml`**: Added `<Auras datatype="tokens">structures/pop_penalty_economy</Auras>` implementing economic density population penalties.
* **`template_structure_military.xml`**: Added `<Auras datatype="tokens">structures/pop_penalty_military</Auras>` implementing military footprint population penalties.
* **`template_structure_resource.xml`**: Added parent `<Auras datatype="tokens">` container for resource structures.
* **`template_gaia_ore.xml`**: Added `<Auras datatype="tokens">structures/health_decay_mine</Auras>` emitting proximity health decay near small mines.
* **`template_gaia_ore_large.xml`**: Added `<Auras datatype="tokens">structures/health_decay_mine_large</Auras>` emitting higher proximity health decay near large mines.
* **`template_gaia_rock.xml`**: Added `<Auras datatype="tokens">structures/health_decay_mine</Auras>` emitting proximity health decay near stone quarries.
* **`template_gaia_tree.xml`**: Added `<Auras datatype="tokens">structures/mov_penalty_tree</Auras>` creating movement slowdowns near dense forests.

#### Civic & Economic Templates
* **`template_structure_civic_civil_centre.xml`**: Attached `structures/pop_bonus_civcenter` aura for central population capacity bonus and visual overlay boundary coordinates.
* **`template_structure_civic_civil_centre_military_colony.xml`**: Inherited civic centre aura definitions for military colonies.
* **`template_structure_civic_house.xml`**: Attached `structures/pop_bonus_house` and `structures/work_bonus_house` and `structures/train_bonus_house` auras.
* **`template_structure_civic_house_big.xml`**: Attached `structures/pop_bonus_house_big` aura.
* **`template_structure_civic_stoa.xml`**: Attached `structures/mov_bonus_civic` aura.
* **`template_structure_civic_temple.xml`**: Attached `structures/pop_bonus_temple` aura emitting temple influence.
* **`template_structure_economic_farmstead.xml`**: Attached `structures/work_bonus_farmstead` aura for localized gather rate boosts.
* **`template_structure_economic_market.xml`**: Attached `structures/pop_bonus_market` aura boosting population efficiency near market squares.
* **`template_structure_economic_storehouse.xml`**: Attached `structures/work_bonus_storehouse` and `structures/tech_bonus_storehouse` auras.
* **`template_structure_resource_corral.xml`**: Attached `structures/train_bonus_corral` and `structures/tech_bonus_corral` auras.

#### Military, Defensive & Special Structures
* **`template_structure_military_barracks.xml`**: Added military aura tags and footprint boundaries.
* **`template_structure_military_forge.xml`**: Attached `structures/train_bonus_forge` aura boosting research/production near forges.
* **`template_structure_military_fortress.xml`**: Attached fortress garrison and defensive aura influence.
* **`template_structure_defensive_tower.xml`**: Added tower overlay and range boundaries.
* **`template_structure_defensive_wall_tower.xml`**: Added wall tower overlay boundaries.
* **`template_structure_special_library.xml`**: Added library research aura.
* **`template_structure_special_theater.xml`**: Added theater cultural aura.
* **`template_structure_wonder.xml`**: Attached `structures/pop_bonus_wonder` wonder aura.

#### Faction-Specific Unique Structures
* **Athenians (`structures/athen/prytaneion.xml`)**: Attached prytaneion civic aura.
* **Carthaginians (`structures/cart/super_dock.xml`)**: Attached super dock naval aura.
* **Iberians (`structures/iber/monument.xml`)**: Attached `structures/pop_bonus_monument` aura.
* **Kushites (`structures/kush/pyramid_large.xml`, `pyramid_small.xml`)**: Attached pyramid aura definitions.
* **Mauryas (`structures/maur/palace.xml`, `pillar_ashoka.xml`)**: Attached Ashoka pillar and palace auras.
* **Persians (`structures/pers/hall.xml`, `tower_babylon.xml`, `wonder.xml`)**: Attached Persian monumental auras.
* **Ptolemies (`structures/ptol/lighthouse.xml`)**: Attached lighthouse maritime aura.
* **Romans (`structures/rome/arch.xml`, `army_camp.xml`)**: Attached triumphal arch and army camp auras.
* **Spartans (`structures/spart/gerousia.xml`, `syssiton.xml`)**: Attached gerousia and syssiton civic/military meal auras.

---

### 2. Modified AI Component (`simulation/ai/petra/`)

* **`queueplanBuilding.js`**:
  - **Upstream Original:** Handles Petra AI decision logic for building placement and construction queues.
  - **Mod Changes:** Adds aura-aware building location evaluation. When Petra AI plans structure placement (e.g., houses near civil centres, storehouses near farmsteads, forges near barracks), it evaluates building aura radiuses and synergy multipliers to maximize civic aura coverage and economic productivity.
  - **Audit Confirmation:** All added lines deal strictly with `Auras`, `auraRadius`, `auraBonuses`, and city-planning synergy scores.

---

### 3. New Structure Aura Definitions (`simulation/data/auras/structures/`)

All 22 files in this directory are brand new JSON definitions introduced by this mod:

1. `health_decay_mine.json`: Emits minor health decay for workers operating in close proximity to active ore/stone mines.
2. `health_decay_mine_large.json`: Emits increased health decay for large ore deposits.
3. `mov_bonus_civic.json`: Grants a movement speed multiplier to citizens moving within civic center / stoa plazas.
4. `mov_penalty_tree.json`: Applies movement slowdown to units navigating through dense timber stands.
5. `pop_bonus_civcenter.json`: Grants population capacity expansion around major civic hubs.
6. `pop_bonus_civic.json`: Civic structure proximity population bonus.
7. `pop_bonus_house.json`: Residential adjacency population capacity bonus for houses.
8. `pop_bonus_house_big.json`: Enhanced population bonus for large residential manors.
9. `pop_bonus_market.json`: Commercial district population bonus near market squares.
10. `pop_bonus_monument.json`: Cultural monument population boost.
11. `pop_bonus_temple.json`: Religious temple precinct population boost.
12. `pop_bonus_wonder.json`: Wonder monumental aura granting wide-area civic bonuses.
13. `pop_penalty_economy.json`: Density penalty when overcrowding economic structures.
14. `pop_penalty_military.json`: Footprint penalty when clustering excessive military infrastructure.
15. `tech_bonus_corral.json`: Accelerates agricultural technology research near corrals.
16. `tech_bonus_storehouse.json`: Accelerates resource gathering technologies near storehouses.
17. `train_bonus_corral.json`: Speeds up livestock production at corrals.
18. `train_bonus_forge.json`: Speeds up weapon and armor research at forges.
19. `train_bonus_house.json`: Speeds up citizen training time when houses are placed in organized residential blocks.
20. `work_bonus_farmstead.json`: Increases farming gather rates for female citizens and workers in farmstead fields.
21. `work_bonus_house.json`: Increases domestic production rates near residential clusters.
22. `work_bonus_storehouse.json`: Boosts resource drop-off efficiency near drop-off points.

---

### 4. New Art & Texture Assets (`art/textures/`)

All 11 PNG image files are brand new assets created specifically for this mod:

#### Overlay Rings (`art/textures/selection/overlay/`)
* `dash.png`, `dash_mask.png`: Dashed aura boundary selection rings.
* `meander.png`, `meander_mask.png`: Decorative meander Greek key pattern aura selection rings.

#### UI Aura Icons (`art/textures/ui/session/auras/`)
* `food_bonus.png`: Icon for farmstead/agricultural work rate bonuses.
* `health_penalty.png`: Icon for mining health decay penalties.
* `mov_bonus.png`: Icon for civic movement speed boosts.
* `pop_bonus.png`: Icon for residential and market population bonuses.
* `pop_penalty.png`: Icon for overcrowding penalties.
* `resource_bonus.png`: Icon for storehouse gathering bonuses.
* `weapon_bonus.png`: Icon for forge research/production bonuses.

*Dimensions Verification:* All texture assets maintain standard power-of-two dimensions (e.g. 16x16, 128x128, 256x256) as required by the 0 A.D. Pyrogenesis engine.

---

### 5. Mod Metadata & Documentation

* **`mod.json`**: Mod configuration declaring dependency on `0ad=0.28.0`, mod label, version, and description.
* **`README.md`**: User documentation detailing building aura mechanics, aura radiuses, installation instructions, and compatibility.
* **`AGENTS.md`**: Developer and AI agent repository guide detailing modding architecture, base game Gitea reference, and maintenance conventions.
* **`LICENSE`**: Open source license for the mod.

---

## Conclusion

Every single file in this repository has been audited against official 0 A.D. Release 28 (`v0.28.0`) source files from `https://gitea.wildfiregames.com/0ad/0ad`.

- **Modified Files Count:** 42 files (100% focused on aura template references, aura boundary definitions, and Petra AI aura placement logic).
- **New Files Count:** 37 files (100% focused on aura JSON definitions, custom UI icons, overlay rings, and mod documentation/metadata).
- **Stray / Unrelated Code:** **0 lines**.

This confirms that all changes in this mod codebase are exclusively relevant to this mod.

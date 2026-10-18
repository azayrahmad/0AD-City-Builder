# 0 A.D. City Builder Mod

A modification that incorporates city-building and urban planning mechanics into **0 A.D. Empires Ascendant** (compatible with **Alpha 28 / 0.28.0**), inspired by classic Impression Games titles (*Caesar*, *Pharaoh*, *Zeus*) and *SimCity*.

---

## Overview

In standard 0 A.D., buildings are often placed purely for tactical speed, clustering houses or production anywhere there is open ground. The **City Builder Mod** introduces dynamic building auras, zoning influences, and neighborhood mechanics that reward organic, thoughtful urban design while discouraging messy military/industrial sprawl.

---

## Key Features

### 1. Dynamic Housing Desirability & Neighborhoods
- **Base Housing:** Houses start with lower base capacity (2 population for regular houses, 5 for large houses).
- **Neighborhood Effect:** Houses placed within proximity of other houses gain **+1 population capacity**, encouraging distinct residential quarters.
- **Civic Influence:**
  - **Civil Centres:** Proximity to a Civic Centre boosts nearby house capacity by **+50%**.
  - **Civic Buildings & Stoas:** Provide **+2 population capacity** to nearby houses.
  - **Temples:** Religious sanctity provides **+2 population capacity** to nearby houses.
  - **Markets:** Access to food and goods supplies grants **+1 population capacity** to nearby houses.
  - **Monuments & Wonders:** Civic pride grants **+1 to +3 population capacity** to nearby houses.
- **Pollution & Military Penalties:**
  - **Economic Facilities:** Noise and pollution from Storehouses, Corrals, and Farmsteads reduce nearby house capacity by **-1**.
  - **Military Structures:** Barracks, Fortresses, and Defense Towers reduce nearby house capacity by **-2**.

### 2. Economic & Production Synergies
- **Living Near Work:** Workers whose homes are near workplaces gain **+10% gather speed and building rate**.
- **Logistics Shuttle:** Workers near Farmsteads and Storehouses gain **+1 resource carrying capacity**.
- **Supply Chains:**
  - **Corral near Stables:** Horse breeding reduces cavalry training batch time by **10%**.
  - **Corral near Temples:** Animal sacrifice supply speeds up temple technology research by **10%**.
  - **Blacksmith Forge near Barracks/Military:** Weapon supply reduces unit training batch time by **10%**.
  - **Storehouse near Forge:** Raw resource supply reduces forge technology research time by **10%**.
  - **House near Barracks:** Manpower supply reduces military training batch time by **10%**.

### 3. Environmental & Health Factors
- **Mine Hazards:** Working in open ore and rock mines causes slow health decay to nearby human workers.
- **Dense Forests / Groves:** Cavalry units suffer a **20% movement penalty** when navigating dense tree groves.
- **Paved Infrastructure:** Civic centres and roads grant **+10% movement speed** to nearby units.

### 4. Smart AI City Planning
- Fully integrated with the **Petra AI**: computer opponents understand aura bonuses and penalties, naturally zoning residential districts near civic centres and cultural monuments while keeping noise and military structures separated.

---

## Installation

1. Copy or clone this repository into your 0 A.D. mods directory:
   - **Windows:** `%USERPROFILE%\Documents\My Games\0ad\mods\city-building-mod`
   - **Linux:** `~/.local/share/0ad/mods/city-building-mod`
   - **macOS:** `~/Library/Application Support/0ad/mods/city-building-mod`
2. Launch **0 A.D.**
3. Go to **Settings > Mod Selection**.
4. Select **City Building Mod - Aura**, click **Enable**, and then click **Save Configuration & Restart**.

---

## Compatibility

- **0 A.D. Version:** Alpha 28 (`0.28.0`)
- **Dependencies:** `0ad=0.28.0`

---

## Links

- [0 A.D. Official Website](https://play0ad.com/)
- [City Builder on mod.io](https://mod.io/g/0ad/m/city-building-mod)
- [Wildfire Games Community Forum Thread](https://wildfiregames.com/forum/topic/26701-city-building-mod-a23-a24/)

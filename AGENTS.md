# AGENTS.md

This document provides context, conventions, repository details, and operational knowledge for AI agents and developers working on this 0 A.D. mod repository.

---

## 1. 0 A.D. Release 28 Source Repository

- **Official Gitea Repository:** [https://gitea.wildfiregames.com/0ad/0ad](https://gitea.wildfiregames.com/0ad/0ad)
- **Target Game Version:** 0 A.D. Release 28 (`0.28.0`, "Boiorix")
- **Release Documentation:** [https://gitea.wildfiregames.com/0ad/0ad/wiki/Release28](https://gitea.wildfiregames.com/0ad/0ad/wiki/Release28)

---

## 2. Mod Architecture & Overwrite Mechanism

- **Base Game (`public` mod):** In 0 A.D., the default game data and core assets reside in the `public` mod folder (located at `binaries/data/mods/public` in the main 0 A.D. repository).
- **Mod Overwriting Mechanism:**
  - This mod operates by mirroring the file structure of the base `public` mod.
  - When installed and enabled in 0 A.D., files in this repository (e.g., within `simulation/templates/`, `simulation/ai/`, `art/`) override and overwrite the corresponding XML templates, JS components, textures, or JSON configs from the base `public` mod.
  - Mod metadata and engine dependency are declared in `mod.json` (requiring `0ad=0.28.0`).

---

## 3. Directory Structure Overview

- `mod.json`: Mod metadata, versioning, dependencies, and mod label.
- `simulation/`:
  - `templates/`: XML entity templates overriding default structures, units, or gaia entities (e.g., houses, civil centres, markets, mines).
  - `data/auras/`: JSON/JS definitions for building aura effects and economic/civic influence logic.
  - `ai/petra/`: Overrides/extensions for Petra AI to support city planning and aura mechanics.
- `art/`: Modded graphics, UI selection textures, and visual overlays.
- `README.md`: Overview of mod features, building aura synergies, installation instructions, and compatibility.

---

## 4. Continuous Knowledge Maintenance

- **Mandatory Updating Rule:** Whenever new knowledge or technical insights regarding 0 A.D. engine mechanics, modding APIs, template inheritance, simulation behaviors, or AI integration are discovered, developers and AI agents **MUST** update this `AGENTS.md` file to reflect the new knowledge.

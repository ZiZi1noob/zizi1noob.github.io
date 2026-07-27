# Ziyang ZHAN — Personal Homepage

A data-driven, zero-dependency personal homepage built with pure HTML/CSS/JS. All content lives in a single `data.json` file — edit the JSON, refresh the page, done.

🔗 **Live**: [zizi1noob.github.io](https://zizi1noob.github.io/)

---

## 📊 Project Status

> **🟢 CURRENTLY ACTIVE** — Core system complete, iterating on AI integrations

| Phase | Status | Description |
|-------|--------|-------------|
| **1. JSON-driven content system** | ✅ **COMPLETE** | All content externalized to `data.json` — edit once, update everywhere. Zero hardcoding, full flexibility. |
| **2. Pure HTML/CSS layout** | ✅ **COMPLETE** | Clean, responsive, no external libraries or frameworks. Maintains performance and simplicity. |
| **3. LLM-powered resume analysis** | 🔄 **IN PROGRESS** | Integrating LLM to parse resumes, extract key insights, and generate dynamic content suggestions for the homepage. |
| **4. AI-generated theming** | ⏳ **PLANNED** | Automated color scheme generation based on user persona, sentiment, or brand input. Dynamic styling without manual CSS tweaks. |
| **5. One-click GitHub deploy** | ⏳ **PLANNED** | Streamlined CI/CD pipeline — push to main, and the site auto-deploys to GitHub Pages with zero configuration. |

---

## Quick Start

```bash
# Clone
git clone https://github.com/zizi1noob/homepage.github.io.git
cd homepage.github.io

# Serve locally (any static server)
python -m http.server 8000
# or
npx serve .


## Customize

Edit `assets/data.json` to change **all** content — no HTML/CSS needed:

- `about.paragraphs` — bio text
- `experience.items` — work history & projects
- `skills.axes` — radar chart dimensions
- `contact.email` / `linkedin` / `resume` — links

Refresh the browser to see changes instantly.

---

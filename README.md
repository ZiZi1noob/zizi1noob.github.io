# Ziyang ZHAN — Personal Homepage

A data-driven, zero-dependency personal homepage built with pure HTML/CSS/JS. All content lives in a single `data.json` file — edit the JSON, refresh the page, done.

🔗 **Live**: [zizi1noob.github.io](https://zizi1noob.github.io/)


**Roadmap**:
1. ✅ JSON-driven content system
2. ✅ Pure HTML/CSS layout
3. 🔄 LLM-powered resume analysis
4. ⏳ AI-generated theming
5. ⏳ One-click GitHub deploy


---

## What's Inside

| Section | Highlights |
|---|---|
| **About** | Hero intro, stats grid, pixel-art avatar |
| **Experience** | Tabbed timeline — switch between **Experience** (work history) and **Building** (current project roadmap) |
| **Skills** | Interactive SVG radar chart — 5 axes (Frontend / Backend / Cloud / ML·AI / Language). Hover for skill breakdown, click to filter related projects |
| **Contact** | Mario-style CTA, email, LinkedIn, resume download |

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
```

Then open `http://localhost:8000`.

---

## Customize

Edit `assets/data.json` to change **all** content — no HTML/CSS needed:

- `about.paragraphs` — bio text
- `experience.items` — work history & projects
- `skills.axes` — radar chart dimensions
- `contact.email` / `linkedin` / `resume` — links

Refresh the browser to see changes instantly.

---

## Current Project: Resume-to-Web

Drop your resume → get a `username.github.io` homepage. No templates, no terminal, no config.


 

 

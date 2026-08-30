# Perfeitta Moda Feminina

Site institucional de página única da **Perfeitta Moda Feminina** — loja de moda feminina
no Centro de Paulista-PE (vestidos midi, conjuntos de renda e alfaiataria), com lookbook,
provador em vídeo e consultoria de caimento pelo WhatsApp.

## Stack

HTML5 + CSS3 + JavaScript puro, sem frameworks e sem etapa de build.

```
index.html
assets/
  css/style.css      folha de estilo (design system)
  js/main.js          comportamento (vanilla, carregado com defer)
  fotos/              imagens otimizadas (WebP + JPG)
  video/              reels do provador em vídeo
favicon.ico · favicon.svg
robots.txt · sitemap.xml
netlify.toml
```

## Desenvolvimento

Qualquer servidor estático serve. Exemplos:

```bash
npx serve .
# ou
python -m http.server
```

## Deploy

Publicado na Netlify a partir de `netlify.toml` (`publish = "."`, sem comando de build).

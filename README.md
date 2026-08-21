# Verificação Lunar V2

Sistema estático em HTML, CSS e JavaScript puro com Firebase Auth e Firestore.

## Como usar

1. Envie todos os arquivos deste projeto para um repositório no GitHub.
2. Importe o repositório na Vercel.
3. Framework preset: Other.
4. Build command: deixe vazio.
5. Output directory: deixe vazio ou use `.`.
6. O sistema usa o mesmo Firebase do projeto `verificacao-lunar`, mas salva os dados novos na coleção `v2_subs`.

## Estrutura principal

- `index.html`
- `style.css`
- `firebase.js`
- `app.js`
- `js/pages/*`
- `js/exporters/*`
- `js/services/firestore.js`

## Observação

Os dados do sistema antigo ficam preservados porque a V2 usa `v2_subs`, não `subs`.

## APK Android

O APK é um wrapper Android WebView que abre a produção em `https://verificacao-lunar-89sx.vercel.app`.

Para gerar novamente:

```powershell
.\android\build-apk.ps1
```

O arquivo assinado para instalação fica em `dist-apk\verificacao-lunar.apk`.

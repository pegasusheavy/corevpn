# CoreVPN Documentation

This is the official documentation website for CoreVPN, built with Angular 21 and Tailwind CSS 4.

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run start
# Visit http://localhost:4200

# Build for production
npm run build
```

## Project Structure

```
src/
├── app/
│   ├── components/     # Reusable UI components
│   │   ├── header.ts
│   │   ├── sidebar.ts
│   │   ├── footer.ts
│   │   ├── code-block.ts
│   │   └── callout.ts
│   ├── pages/          # Documentation pages
│   │   ├── home.ts
│   │   ├── getting-started.ts
│   │   ├── configuration.ts
│   │   ├── ghost-mode.ts
│   │   ├── deployment.ts
│   │   └── api.ts
│   ├── app.ts          # Root component
│   └── app.routes.ts   # Route definitions
├── styles.css          # Global styles with Tailwind
└── index.html          # HTML entry point
```

## Features

- 🎨 Professional dark theme with Tailwind CSS 4
- 📱 Fully responsive design
- 🔍 Syntax-highlighted code blocks with copy functionality
- 🧭 Sidebar navigation with sections
- 📖 Multiple documentation pages covering all features
- 👻 Special Ghost Mode documentation
- ⚡ Lazy-loaded routes for optimal performance

## Deployment

The built site can be deployed to any static hosting service:

```bash
# Build for production
npm run build

# Output is in dist/docs/
```

Recommended hosting options:
- GitHub Pages
- Vercel
- Netlify
- Cloudflare Pages

## Contributing

See the main [CONTRIBUTING.md](../CONTRIBUTING.md) for contribution guidelines.

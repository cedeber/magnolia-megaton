# Frontools Magnolia CMS "Megaton Edition"

## Why?

Frontools Magnolia Megaton Edition is a ready-to-use, frontend-oriented development environment. Based deeply on light modules, it gives you the possibility to embrace multi-page CMS as well as single-page application Headless CMS. And mix them together with ease.

### Magnolia CMS
A ready to play Magnolia CMS with
- REST Services and Tools
- JavaScript Models
- a preconfigured webapp with a main fullfilled light module
- a preconfigured Java module

### Included frontend frameworks and tools
- [webpack](https://webpack.js.org)
- [TypeScript](https://www.typescriptlang.org)
- [Vue.js Ecosystem](https://vuejs.org)
- [lodash](https://lodash.com)
- [cssnext](http://cssnext.io)

### Frontools
- Frontools Vue Components
- Frontools Utilities & Helpers
- Frontools CSS Shell

More details coming soon...

### Included polyfills
- ES6 Shims
- Fetch API
- Intersection Observer API
- matchMedia
- CSS object-fit

## Workflow
As the frontend workflow is based on webpack, everything that has nothing to do with Magnolia or FreeMarker can be saved on the `/frontend` folder like JS, CSS, single file Vue components, pictures...

Lots of components are generated thanks to FreeMarker but thanks to Vue inline templating it's not a problem at all. It's even very powerful.

### Frontend
Go to the `/frontend` folder and do `npm install` followed by `npm run build`. It bundles JS files, extracts CSS and manages all other needed resources.

#### Watchers
If you want to build CSS or JS after each files save, in the `/frontend` folder you can do `npm run watch`. Webpack will run in watch mode and produces less optimised debug files.

### Magnolia
From the root `/` folder, do `mvn clean package` in order to prepare Magnolia and build the webapp and the Java Module.

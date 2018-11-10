# Magnolia CMS "Megaton"
Megaton is a ready-to-use Magnolia-based development environment with
a preconfigured web application with a main fullfilled light module and
a preconfigured Java module

## Why Megaton?
### Java Module
- Language detection (default from browser preferences)
- 404 page with Freemarker
- Form optimization
- Mail servlet
- Mimetype validator

### Light Module
- Language selector
- Form optimization
- Home page + subpages
- Internal and external redirect support
- Navigation with configurable number of children
- Breadcrumbs with Schema
- Social Networks tags support
- Search bar + Search results

### Components (backend + frontend)
- List of indexed components (ordering)
- Section Layout (multi columns / full width)
- Lazy Media (Image renditions + Video)
- Google Maps
- Editorial / Article
- Carousel (Lazy media + text layer)
- Cookie Banner

### Frontend
- Webpack ES5 and ES2017 module
- ES5 polyfills
- TypeScript
- Vue.js - components + store (vuex) + router + i18n
- PostCSS (fully standard and compatible with current and next CSS API)
- Eukolía Frontend Library - https://github.com/cedeber/eukolia
- A CSS Reset + specific bootstrap
- Form styling
- Generic configurable styling with CSS variables

## Configuration
### Setup
- [ ] Anonymous password (public)
- [ ] Add map /home to / (`/server/URI2RepositoryMapping/mappings/website`)
- [ ] Add map /magnolia to /.magnolia/admincentral (`/modules/ui-admincentral/virtualUriMappings/default`)
- [ ] Add woff2 mimetype (`/server/MIMEMapping/`)
- [ ] Set `/server/security/userManagers/system@lockTimePeriod` to 5(minutes)
- [ ] Set correct compression contentType for SVG `image/svg+xml` in Magnolia server config (`/modules/cache/config/compression/voters/contentType/allowed@2`)
- [ ] Set `defaultBaseUrl` in Magnolia server config (author/public)
- [ ] enable formProcessors/sendConfirmationEMail@enabled

### Finalization
- [ ] Anonymous role access to required workspaces (public)
- [ ] Admin user (author/public) check workspaces!
- [ ] Visitor user (author/public)
- [ ] Imaging Module (Is `/modules/site/config/site/theme` set correctly on public?)
- [ ] Does Magnolia Search find pages/assets/news/events etc.
- [ ] Check for yaml errors in Definitions App
- [ ] Add .monitor-this file in home/xyz/xyz directory (Tomcat Monitoring on Mironet. ONLY IF PUBLIC IS NOT PROTECTED)

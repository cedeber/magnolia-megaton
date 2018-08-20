# Hosting
- [ ] Order hosting
- [ ] SSL Certificate
- [ ] DNS handling

# General
- [ ] Google Analytics
- [ ] Impressum
- [ ] Disclaimer
- [ ] Custom error pages
- [ ] Page titles & Descriptions
- [ ] App + Mobile Favicons
- [ ] Correct `<head>`: App name, etc...
- [ ] Fill Web App Manifest
- [ ] Cookie compliance (only for political Europe right now)
- [ ] Check Form submissions

# Magnolia Configurations
## Project setup
- [ ] Anonymous password (public)
- [ ] Add map /home to / (`/server/URI2RepositoryMapping/mappings/website`)
- [ ] Add map /magnolia to /.magnolia/admincentral (`/modules/ui-admincentral/virtualUriMappings/default`)
- [ ] Add woff2 mimetype (`/server/MIMEMapping/`)
- [ ] Set `/server/security/userManagers/system@lockTimePeriod` to 5(minutes)
- [ ] Set correct compression contentType for SVG `image/svg+xml` in Magnolia server config (`/modules/cache/config/compression/voters/contentType/allowed@2`)
- [ ] Set `defaultBaseUrl` in Magnolia server config (author/public)

## Project finalization
- [ ] Anonymous role access to required workspaces (public)
- [ ] Admin user (author/public) check workspaces!
- [ ] Visitor user (author/public)
- [ ] Imaging Module (Is `/modules/site/config/site/theme` set correctly on public?)
- [ ] Does Magnolia Search find pages/assets/news/events etc.
- [ ] Check for yaml errors in Definitions App
- [ ] Add .monitor-this file in home/xyz/xyz directory (Tomcat Monitoring on Mironet)

## Cache Optimization
- [ ] Set correct compression contentType for SVG `image/svg+xml` in Magnolia server config (/modules/cache/config/compression/voters/contentType/allowed@2)

# Testings
Chrome and Firefox should technically behave the same way whatever the operating system is.
But graphically, it is very different because of OS's way of doing graphics.

## macOS (MacBook || iMac)
Don't forget Retina vs Standard resolution => Graphical rendering
- [ ] Safari
- [ ] Chrome
- [ ] Firefox

## Windows
Don't forget touch screens on Microsoft Surface.
- [ ] Edge
- [ ] Internet Explorer 11
- [ ] Chrome
- [ ] Firefox

## iOS (iPhone && iPad)
- [ ] Safari (All browsers uses same webkit engine)

## Android
- [ ] Samsung Internet Browser (modified Chrome engine)
- [ ] Chrome
- [ ] Firefox

## Special attention
- [ ] Flexbox on IE
- [ ] `object-fit` polyfill for IE/Edge (Carousel, etc...) or [SVG fix](http://www.sarasoueidan.com/blog/svg-object-fit/)

# Validators, Audits, Performance
- [ ] [W3C Markup Validation](https://validator.w3.org) (Vue errors are OK. You can also check HTML mistakes in Firefox "View Page Source")
- [ ] [Google Lighthouse: Webpage](https://developers.google.com/web/tools/lighthouse/) (inside Chrome 60+ Dev Tools)
- [ ] [Web Page Test](https://www.webpagetest.org) (can be done with Chrome dev tools, simulate slow connection and under-powered device)
- [ ] [Google Structured data testing tool](https://search.google.com/structured-data/testing-tool)

## Optionals tools
- [Mozilla Observatory: Security](https://observatory.mozilla.org) (Server Security)
- [WCAG 2.0 Checklist](http://webaim.org/standards/wcag/checklist)
- [WAWE Web Accessibility Tool](http://wave.webaim.org) (also available in Firefox as plugin)

# Golive & End
- [ ] Golive planned with whole team available
- [ ] Project debriefing

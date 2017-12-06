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

# Magnolia Configurations
- [ ] Anonymous password (public)
- [ ] Anonymous role access to required workspaces (public)
- [ ] Admin user (author/public) check workspaces!
- [ ] Visitor user (public)
- [ ] Set `defaultBaseUrl` in Magnolia server config (author/public)
- [ ] Set correct compression contentType for JS files `application/javascript` in Magnolia server config (/modules/cache/config/compression/voters/contentType/allowed@2)
      See: https://jira.magnolia-cms.com/browse/MAGNOLIA-6682
- [ ] Imaging Module (Is /modules/site/config/site/theme set correctly on public?)
- [ ] Set /server/security/userManagers/system@lockTimePeriod to 5(minutes)
- [ ] Add woff2 mimetype (/server/MIMEMapping/)
- [ ] Does Magnolia Search find pages/assets/news/events etc.
- [ ] Check Form submissions
- [ ] Check for yaml errors in Definitions App

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
- [ ] `object-fit` polyfill for IE < 16 (Carousel, etc...)

# Validators, Audits, Performance
- [ ] [totally](https://khan.github.io/tota11y/) (integrated while on Author instance)
- [ ] [W3C Markup Validation](https://validator.w3.org) (Vue errors are OK)
- [ ] [Google Lighthouse: Webpage](https://developers.google.com/web/tools/lighthouse/) (inside Chrome 60+ Dev Tools)
- [ ] [Web Page Test](https://www.webpagetest.org) (can be done with Chrome dev tools, simulate slow connection and under-powered device)

## Optionals tools
- [Mozilla Observatory: Security](https://observatory.mozilla.org) (Server Security)
- [WCAG 2.0 Checklist](http://webaim.org/standards/wcag/checklist)
- [WAWE Web Accessibility Tool](http://wave.webaim.org) (also available in Firefox as plugin)
- [opquast desktop](https://desktop.opquast.com/en/) (firefox)
- [AInspector Sidebar](https://addons.mozilla.org/fr/firefox/addon/ainspector-sidebar/) (firefox plugin)

# Golive & End
- [ ] Golive planned with whole team available
- [ ] Project debriefing

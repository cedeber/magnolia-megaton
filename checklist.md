# Hosting
- [ ] Order hosting
- [ ] SSL Certificate

# General
- [ ] DNS handling
- [ ] Google Analytics
- [ ] Impressum
- [ ] Disclaimer
- [ ] Custom error pages
- [ ] Pagetitles & Descriptions
- [ ] App + Mobile Favicons
- [ ] Correct `<head>`: App name, etc...
- Cookie compliance (only for political Europe right now)

# Magnolia Configurations
- [ ] Anonymous password (public)
- [ ] Anonymous role access to required workspaces (public)
- [ ] Set `defaultBaseUrl` in Magnolia server config (author/public)
- [ ] Set correct compression contentType for JS files `application/javascript` in Magnolia server config (/modules/cache/config/compression/voters/contentType/allowed@2)
See: https://jira.magnolia-cms.com/browse/MAGNOLIA-6682
- [ ] Imaging Module (Is /modules/site/config/site/theme set correctly on public?)
- [ ] Set /server/security/userManagers/system@lockTimePeriod to 5(minutes)
- [ ] Does Magnolia Search find pages/assets/news/events etc.
- [ ] Check Form submissions

# Testings
Chrome and Firefox should technically behave the same way whatever the operating system is.
But graphically, it is very different because of OS's way of doing graphics.

- [ ] From Firefox 57 (currently Nightly), the DOM and CSS engines will drastically change.

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

## Windows Phone
Has been disconnected from Windows 10 dev branch at Microsoft.
So, it's now a lonely (dead?) opearting system, but officially still alive...
- [ ] Edge

## Special attention
- [ ] Flexbox on IE
- [ ] `object-fit` polyfill for IE/Edge (Carousel, etc...)

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

-------------------

# OLD

# Project Start
- [ ] Order hosting
- [ ] Anonymous password  (public)
- [ ] DNS handling

# General
- [ ] Google Analytics
- [ ] SSL Certificate

# Content
- [ ] Pagetitles & Descriptions
- [ ] Impressum
- [ ] Disclaimer

# Internal
- [ ] App + Mobile Favicons
- [ ] Correct `<head>`
- [ ] Set `defaultBaseUrl` in Magnolia server config (author/public)
- [ ] Set correct compression contentType for JS files `application/javascript` in Magnolia server config (/modules/cache/config/compression/voters/contentType/allowed@2)
See: https://jira.magnolia-cms.com/browse/MAGNOLIA-6682
- [ ] Custom error pages
- [ ] Outdated browser page (only if Edge+ only)
- [ ] cookie compliance
- [ ] Imaging Module (Is /modules/site/config/site/theme set correctly on public?)
- [ ] Set /server/security/userManagers/system@lockTimePeriod to 5(minutes)
- [ ] Does Magnolia Search find pages/assets/news/events etc.
- [ ] Check Form submissions
- [ ] CSS & JS minified?

# Testing
## Devices
### Mac
  - Macbook
    - [ ] Safari
    - [ ] Chrome
    - [ ] Firefox

  - iMac
    - [ ] Safari
    - [ ] Chrome
    - [ ] Firefox

### Windows Computer

  - Laptop
    - [ ] Chrome
    - [ ] Firefox
    - [ ] Edge
    - [ ] Internet Explorer

  - Big screen
    - [ ] Chrome
    - [ ] Firefox
    - [ ] Edge
    - [ ] Internet Explorer

### iPad
  - [ ] Safari
  - [ ] Chrome
  - [ ] Firefox

### Samsung Tablet
  - [ ] Chrome
  - [ ] Firefox
  - [ ] Samsung Internet

### Surface
  - [ ] Chrome
  - [ ] Firefox
  - [ ] Edge

### Mobile Devices
  - [ ] iPhone 6
    - [ ] Safari   
    - [ ] Chrome
    - [ ] Firefox

  - [ ] iPhone 5
    - [ ] Safari
    - [ ] Chrome
    - [ ] Firefox

  - [ ] Samsung Galaxy S6
    - [ ] Chrome
    - [ ] Firefox
    - [ ] Samsung Internet

  - [ ] Windows Phone
    - [ ] Chrome
    - [ ] Firefox
    - [ ] Edge

## Special Attention to:
- Carousel
- Flexbox
- Picture Size and compression

# Validators, audits
## Markup (online)
- [ ] [Mozilla Observatory: Security](https://observatory.mozilla.org)
- [ ] [W3C Markup Validation](https://validator.w3.org)

## Accessibility
- [ ] [Google Lighthouse: Webpage](https://developers.google.com/web/tools/lighthouse/) (inside Chrome 60 Dev Tools)
- [ ] [WCAG 2.0 Checklist](http://webaim.org/standards/wcag/checklist)
- [ ] [WAWE Web Accessibility Tool](http://wave.webaim.org) (also available in Firefox as plugin)
- [ ] [opquast desktop](https://desktop.opquast.com/en/) (firefox)
- [ ] [totally](https://khan.github.io/tota11y/) (available as bookmarklet)
- [ ] [AInspector Sidebar](https://addons.mozilla.org/fr/firefox/addon/ainspector-sidebar/) (firefox plugin)

## Performance
- [ ] [Google Lighthouse: Webpage](https://developers.google.com/web/tools/lighthouse/) (inside Chrome 60 Dev Tools)
- [ ] [Web Page Test](https://www.webpagetest.org) (online)

# Golive
- [ ] Team available?
- [ ] Anonymous role access to required workspaces (public)

# End
- [ ] Debriefing

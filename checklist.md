# Hosting
- [ ] Order hosting
- [ ] SSL Certificate
- [ ] DNS handling

# General
- [ ] Google Analytics
- [ ] Impressum
- [ ] Disclaimer
- [ ] Custom error pages
- [ ] Pagetitles & Descriptions
- [ ] App + Mobile Favicons
- [ ] Correct `<head>`: App name, etc...
- [ ] Cookie compliance (only for political Europe right now)

# Magnolia Configurations
- [ ] Anonymous password (public)
- [ ] Anonymous role access to required workspaces (public)
- [ ] Admin user (author/public) check workspaces!
- [ ] Visitor user (public)
- [ ] Set `defaultBaseUrl` in Magnolia server config (author/public)
- [ ] Imaging Module (Is /modules/site/config/site/theme set correctly on public?)
- [ ] Set /server/security/userManagers/system@lockTimePeriod to 5(minutes)
- [ ] Does Magnolia Search find pages/assets/news/events etc.
- [ ] Check Form submissions
- [ ] Check for yaml errors in Definitions App
- [ ] Add woff2 mimetype (/server/MIMEMapping/)

Cache Optimization:
- [ ] Set correct compression contentType for SVG `image/svg+xml` in Magnolia server config (/modules/cache/config/compression/voters/contentType/allowed@2)

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
- [ ] `object-fit` polyfill for IE/Edge (Carousel, etc...) or [SVG fix](http://www.sarasoueidan.com/blog/svg-object-fit/)

# Validators, Audits, Performance
- [ ] [W3C Markup Validation](https://validator.w3.org) (Vue errors are OK. You can also check HTML mistakes in Firefox "View Page Source")
- [ ] [Google Lighthouse: Webpage](https://developers.google.com/web/tools/lighthouse/) (inside Chrome 60+ Dev Tools)
- [ ] [Web Page Test](https://www.webpagetest.org) (can be done with Chrome dev tools, simulate slow connection and under-powered device)

## Optionals tools
- [Mozilla Observatory: Security](https://observatory.mozilla.org) (Server Security)
- [WCAG 2.0 Checklist](http://webaim.org/standards/wcag/checklist)
- [WAWE Web Accessibility Tool](http://wave.webaim.org) (also available in Firefox as plugin)

# Golive & End
- [ ] Golive planned with whole team available
- [ ] Project debriefing

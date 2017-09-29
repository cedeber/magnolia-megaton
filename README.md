# Magnolia CMS Megaton Edition

A ready to play local Magnolia CMS with
- Magnolia CMS Community Edition
    - REST Services & Tools
    - JavaScript Models
- TypeScript for requirejs
- Vue.js & lodash
- Frontools Vue Components
- PostCSS cssnext
- Frontools CSS Shell

## Setup

As a designer and an Unix-like OS lover, I use macOS.
The current configuration should work on Linux as well.
Windows is not supported but you could try it with [cmder](http://cmder.net) or [chocolatey](https://chocolatey.org)

### Frontend
Go to the `/frontend` folder and do `npm install` followed by `npm build:all`.
It build and minify CSS and JS with sourcemaps.

#### Watchers
If you want to build CSS or JS after each file save, in the `/frontend` folder you can do
- CSS: `npm run watch:styles` or `node bin/build-styles --sourcemap --watch`
- JS: `npm run watch:scripts` or `tsc -w -p tsconfig.json`

### Magnolia
From the root `/` folder
- `mvn clean package` to build the Webapp and the Java Module

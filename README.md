# Magnolia CMS "Megaton"
Megaton is a ready-to-use Magnolia-based development environment with
a preconfigured web application with a main fullfilled light module and
a preconfigured Java module

# Configuration
## Setup
- [ ] Anonymous password (public)
- [ ] Add map /home to / (`/server/URI2RepositoryMapping/mappings/website`)
- [ ] Add map /magnolia to /.magnolia/admincentral (`/modules/ui-admincentral/virtualUriMappings/default`)
- [ ] Add woff2 mimetype (`/server/MIMEMapping/`)
- [ ] Set `/server/security/userManagers/system@lockTimePeriod` to 5(minutes)
- [ ] Set correct compression contentType for SVG `image/svg+xml` in Magnolia server config (`/modules/cache/config/compression/voters/contentType/allowed@2`)
- [ ] Set `defaultBaseUrl` in Magnolia server config (author/public)
- [ ] enable formProcessors/sendConfirmationEMail@enabled

## Finalization
- [ ] Anonymous role access to required workspaces (public)
- [ ] Admin user (author/public) check workspaces!
- [ ] Visitor user (author/public)
- [ ] Imaging Module (Is `/modules/site/config/site/theme` set correctly on public?)
- [ ] Does Magnolia Search find pages/assets/news/events etc.
- [ ] Check for yaml errors in Definitions App
- [ ] Add .monitor-this file in home/xyz/xyz directory (Tomcat Monitoring on Mironet. ONLY IF PUBLIC IS NOT PROTECTED)

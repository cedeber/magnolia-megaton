[#assign privacyPage = cmsfn.link(cmsfn.nodeById(content.privacyPage!)!)!]
[#assign termsConditionsPage = cmsfn.link(cmsfn.nodeById(content.termsConditionsPage!)!)!]

[#if cmsfn.isEditMode()]
    Custom form here!
[#else]
    <custom-form :privacy-page="'${privacyPage!}'" :terms-conditions-page="'${termsConditionsPage!}'" :from-email="'${content.fromEmail!}'" :recipient="'${content.recipient!}'" :subject="'${content.subject!}'"></custom-form>
[/#if]


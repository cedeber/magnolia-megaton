[#if cmsfn.isEditMode()]
    Custom form here!
[#else]
    <custom-form :from-email="'${content.fromEmail!}'" :recipient="'${content.recipient!}'" :subject="'${content.subject!}'">
        <div class="form">
            <form class="js-default-form" @submit.prevent="validateForm">
                <fieldset>
                    <div class="form-row is-multiline o-flex-inline has-gutter">
                        <div class="cell-1of2">
                            <label for="firstname">${content.nameLabel!}</label>
                            <input name="firstname" id="firstname" required type="text" v-model="firstname" autocomplete="given-name">
                        </div>
                        <div class="cell-1of2">
                            <label for="lastname">${content.lastnameLabel!}</label>
                            <input name="lastname" id="lastname" required type="text" v-model="lastname" autocomplete="family-name">
                        </div>
                    </div>
                    <div class="form-row is-multiline o-flex-inline has-gutter">
                        <div class="cell-1of2">
                            <label for="address">${content.adressLabel!}</label>
                            <input name="address" id="address" type="text" v-model="address" required autocomplete="address-line1">
                        </div>

                        <div class="cell-1of2 o-flex-inline has-gutter">
                            <div class="cell-1of3">
                                <label for="zip">${content.zipLabel!}</label>
                                <input name="zip" id="zip" required type="text" v-model="zip" autocomplete="postal-code">
                            </div>
                            <div class="cell-2of3">
                                <label for="city">${content.cityLabel!}</label>
                                <input name="city" id="city" required type="text" v-model="city" autocomplete="address-level2">
                            </div>
                        </div>
                    </div>
                    <div class="form-row is-multiline o-flex-inline has-gutter">
                        <div class="cell-1of2">
                            <label for="country">${content.countryLabel!}</label>
                            <input name="country" id="country" type="text" v-model="country" required autocomplete="country">
                        </div>
                        <div class="cell-1of2">
                            <label for="company">${content.companyLabel!}</label>
                            <input name="company" id="company" type="text" v-model="company" autocomplete="company">
                        </div>
                    </div>
                    <div class="form-row is-multiline o-flex-inline has-gutter">
                        <div class="cell-1of2">
                            <label for="email">${content.emailLabel!}</label>
                            <input name="email" id="email" required type="email" v-model="email" autocomplete="email">
                        </div>
                        <div class="cell-1of2">
                            <label for="phone">${content.phoneLabel!}</label>
                            <input name="phone" id="phone" required type="tel" v-model="phone" autocomplete="tel">
                        </div>
                    </div>
                    <div class="form-row">
                        <label for="message">${content.messageLabel!}</label>
                        <textarea name="message" id="message" v-model="message"></textarea>
                    </div>
                    <div class="o-flex is-multiline">
                        <div class="checkboxes cell-1of2">
                            <div class="form-row checkbox-form-row has-margin-bottom is-multiline">
                                <input name="privacy" id="privacy" required type="checkbox" v-model="privacy">
                                <label class="checkbox-label" for="privacy">${cmsfn.decode(content).privacyText!}</label>
                            </div>
                        </div>
                        <div class="error-message form-row is-multiline cell-1of2" v-if="errorMessage">
                            {{ errorMessage }}
                        </div>
                    </div>

                    <div class="hidden-fields">
                        <input type="hidden" autocomplete="off" name="fromEmail" :value="fromEmail">
                        <input type="hidden" autocomplete="off" name="recipient" :value="recipient">
                        <input type="hidden" autocomplete="off" name="subject" :value="subject">
                    </div>

                    <div class="button-wrapper o-flex is-multiline">
                        <span class="required-text">${content.requiredText!}</span>
                        <div class="cell-1of1 is-right">
                            <div class="button next-button step-1" role="button" @click="sendMail">
                                ${content.sendLabel!}
                                <svg viewBox="0 0 14 17" width="14px" height="17px" class="icon" style="transform:rotate(90deg);">
                                    <path fill="none" stroke-width="2" d="M.5 6.95L6.92.5 13.36 6.95M7 .5v15" transform="translate(0 1)"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                </fieldset>
            </form>
        </div>
    </custom-form>
[/#if]


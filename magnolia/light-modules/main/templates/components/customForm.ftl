[#if cmsfn.isEditMode()]
    This is a custom form. <br/>
    Fields are only shown in Preview.<br/>
    Make sure to enable the CustomFormServlet (/.servlet/CustomForm/*) and configure the smtp server.
[#else]
<custom-form inline-template class="o-custom-form o-component" :from-email="'${content.fromEmail!}'" :recipient="'${content.recipient!}'" :subject="'${content.subject!}'" :file-upload-text="'${content.fileUploadPlaceholder!}'">
    <div>
        <form v-if="!success" class="js-default-form" @submit.prevent="validateForm">
            <div class="form-item-hidden">
                <input type="hidden" autocomplete="off" name="fromEmail" :value="fromEmail">
                <input type="hidden" autocomplete="off" name="recipient" :value="recipient">
                <input type="hidden" autocomplete="off" name="subject" :value="subject">
            </div>
            <fieldset>
                <div class="o-flex is-multiline has-bigmac-gutter">
                    <toggle-field inline-template :report-to="'firstname'">
                        <div class="form-row cell-1of2">
                            <input name="firstname" id="firstname" required type="text"
                                   autocomplete="given-name" v-on:focus="toggleActive" v-on:blur="toggleActive">
                            <label for="firstname" :class="{ active: isActive }">${content.nameLabel!}
                                <dfn title="required">*</dfn></label>
                        </div>
                    </toggle-field>
                    <toggle-field inline-template :report-to="'lastname'">
                        <div class="form-row cell-1of2">
                            <input name="lastname" id="lastname" required type="text"
                                   autocomplete="family-name" v-on:focus="toggleActive" v-on:blur="toggleActive">
                            <label for="lastname" :class="{ active: isActive }">${content.lastnameLabel!}
                                <dfn title="required">*</dfn></label>
                        </div>
                    </toggle-field>
                    <toggle-field inline-template :report-to="'address'">
                        <div class="form-row cell-1of2">
                            <input name="address" id="address" type="text"  required
                                   autocomplete="address-line1" v-on:focus="toggleActive" v-on:blur="toggleActive">
                            <label for="address" :class="{ active: isActive }">${content.addressLabel!}
                                <dfn title="required">*</dfn></label>
                        </div>
                    </toggle-field>
                    <div class="form-row cell-1of2 o-flex-inline has-horizontal-gutter">
                        <toggle-field inline-template :report-to="'zip'">
                            <div class="form-row cell-1of3">
                                <input name="zip" id="zip" required type="text"
                                       autocomplete="postal-code" v-on:focus="toggleActive" v-on:blur="toggleActive">
                                <label for="zip" :class="{ active: isActive }">${content.zipLabel!}
                                    <dfn title="required">*</dfn></label>
                            </div>
                        </toggle-field>
                        <toggle-field inline-template :report-to="'city'">
                            <div class="form-row cell-2of3">
                                <input name="city" id="city" required type="text"
                                       autocomplete="address-level2" v-on:focus="toggleActive" v-on:blur="toggleActive">
                                <label for="city" :class="{ active: isActive }">${content.cityLabel!}
                                    <dfn title="required">*</dfn></label>
                            </div>
                        </toggle-field>
                    </div>
                    <toggle-field inline-template :report-to="'country'">
                        <div class="form-row cell-1of2">
                            <input name="country" id="country" type="text"  required
                                   autocomplete="country" v-on:focus="toggleActive" v-on:blur="toggleActive">
                            <label for="country" :class="{ active: isActive }">${content.countryLabel!}
                                <dfn title="required">*</dfn></label>
                        </div>
                    </toggle-field>
                    <toggle-field inline-template :report-to="'company'">
                        <div class="form-row cell-1of2">
                            <input name="company" id="company" type="text"  autocomplete="company"
                                   v-on:focus="toggleActive" v-on:blur="toggleActive">
                            <label for="company" :class="{ active: isActive }">${content.companyLabel!}</label>
                        </div>
                    </toggle-field>
                    <toggle-field inline-template :report-to="'email'">
                        <div class="form-row cell-1of2">
                            <input name="email" id="email" required type="email"  autocomplete="email"
                                   v-on:focus="toggleActive" v-on:blur="toggleActive">
                            <label for="email" :class="{ active: isActive }">${content.emailLabel!}
                                <dfn title="required">*</dfn></label>
                        </div>
                    </toggle-field>
                    <toggle-field inline-template :report-to="'phone'">
                        <div class="form-row cell-1of2">
                            <input name="phone" id="phone" required type="tel"  autocomplete="tel"
                                   v-on:focus="toggleActive" v-on:blur="toggleActive">
                            <label for="phone" :class="{ active: isActive }">${content.phoneLabel!}
                                <dfn title="required">*</dfn></label>
                        </div>
                    </toggle-field>
                    <toggle-field inline-template :report-to="'message'">
                        <div class="form-row cell-1of1">
                            <textarea name="message" id="message"  v-on:focus="toggleActive"
                                      v-on:blur="toggleActive"></textarea>
                            <label for="message" :class="{ active: isActive }">${content.messageLabel!}</label>
                        </div>
                    </toggle-field>

                    <div class="form-row cell-1of1">
                        <label class="is-static" for="file-upload">${content.fileUploadLabel!}</label>
                        <div class="o-flex has-gutter is-multiline">
                            <div class="cell-1of3 cell-1of1-sm file-upload-wrapper">
                                <input name="file-upload" id="file-upload" type="file" maxlength="30000000" @change="handleFileUpload" accept="application/pdf, application/zip, application/vnd.openxmlformats-officedocument.wordprocessingml.document" style="display: none;">
                                <button id="file-upload-button" class="button" @click="delegateFileUpload">${content.fileUploadButtonText!}</button>
                            </div>
                            <div class="cell-2of3 cell-1of1-sm o-flex-space">
                                <span class="file-upload-text" v-html="fileUploadTextPlaceholder"></span>
                            </div>
                        </div>
                    </div>

                    <div class="form-row cell-1of2">
                        <input name="privacy" id="privacy" required type="checkbox" v-model="privacy">
                        <label class="checkbox-label" for="privacy">
                            ${cmsfn.decode(content).privacyText!}
                        </label>
                    </div>
                    <div class="error-message form-row is-multiline cell-1of2 cell-1of1-sm" v-if="error">
                        ${cmsfn.decode(content).errorText!}
                    </div>
                    <div class="error-message form-row is-multiline cell-1of2 cell-1of1-sm" v-if="missingRequired">
                        ${cmsfn.decode(content).missingRequiredText!}
                    </div>

                    <div class="button-wrapper cell-1of1">
                        <input type="submit" value="${content.sendLabel!}" @click.prevent="sendMail">
                    </div>
                </div>

            </fieldset>
            <p class="form__required-notice">
                <dfn title="required">*</dfn>
                ${content.requiredText!}
            </p>
        </form>

        <div v-if="success" class="success">
            ${cmsfn.decode(content).successText!}
        </div>
    </div>
</custom-form>
[/#if]


<template>
    <div class="form">
        <form class="js-default-form" @submit.prevent="validateForm">
            <fieldset>
                <div class="form-row is-multiline o-flex-inline has-gutter">
                    <div class="cell-1of2">
                        <label for="firstname">Firstname *</label>
                        <input name="firstname" id="firstname" required type="text" v-model="firstname" autocomplete="given-name">
                    </div>
                    <div class="cell-1of2">
                        <label for="lastname">Lastname *</label>
                        <input name="lastname" id="lastname" required type="text" v-model="lastname" autocomplete="family-name">
                    </div>
                </div>
                <div class="form-row is-multiline o-flex-inline has-gutter">
                    <div class="cell-1of2">
                        <label for="address">Address *</label>
                        <input name="address" id="address" type="text" v-model="address" required autocomplete="address-line1">
                    </div>

                    <div class="cell-1of2 o-flex-inline has-gutter">
                        <div class="cell-1of3">
                            <label for="zip">ZIP *</label>
                            <input name="zip" id="zip" required type="text" v-model="zip" autocomplete="postal-code">
                        </div>
                        <div class="cell-2of3">
                            <label for="city">City *</label>
                            <input name="city" id="city" required type="text" v-model="city" autocomplete="address-level2">
                        </div>
                    </div>
                </div>
                <div class="form-row is-multiline o-flex-inline has-gutter">
                    <div class="cell-1of2">
                        <label for="country">Country *</label>
                        <input name="country" id="country" type="text" v-model="country" required autocomplete="country">
                    </div>
                    <div class="cell-1of2">
                        <label for="company">Company/Institute</label>
                        <input name="company" id="company" type="text" v-model="company" autocomplete="company">
                    </div>
                </div>
                <div class="form-row is-multiline o-flex-inline has-gutter">
                    <div class="cell-1of2">
                        <label for="email">E-Mail *</label>
                        <input name="email" id="email" required type="email" v-model="email" autocomplete="email">
                    </div>
                    <div class="cell-1of2">
                        <label for="phone">Phone *</label>
                        <input name="phone" id="phone" required type="tel" v-model="phone" autocomplete="tel">
                    </div>
                </div>
                <div class="form-row">
                    <label for="message">Message</label>
                    <textarea name="message" id="message" v-model="message" placeholder="Leave us a message."></textarea>
                </div>
                <div class="o-flex is-multiline">
                    <div class="checkboxes cell-1of2">
                        <div class="form-row checkbox-form-row has-margin-bottom is-multiline">
                            <input name="privacy" id="privacy" required type="checkbox" v-model="privacy">
                            <label class="checkbox-label" for="privacy">* I have read and accept the <a class="link" place="link" v-bind:href="privacyPage" target="_blank">Privacy Policy</a></label>
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
                    <span class="required-text">* required</span>
                    <div class="cell-1of1 is-right">
                        <div class="button next-button step-1" role="button" @click="sendMail">
                            Send
                            <svg viewBox="0 0 14 17" width="14px" height="17px" class="icon" style="transform:rotate(90deg);">
                                <path fill="none" stroke-width="2" d="M.5 6.95L6.92.5 13.36 6.95M7 .5v15" transform="translate(0 1)"></path>
                            </svg>
                        </div>
                    </div>
                </div>
            </fieldset>
        </form>
    </div>
</template>

<script lang="ts" src="./scripts/customForm.ts">
</script>
<style scoped>
/*@import url(../variables.css);*/

/*textarea:focus,*/
/*input:focus,*/
/*select:focus {*/
    /*outline: none;*/
/*}*/
/*textarea,*/
/*input,*/
/*select {*/
    /*padding: 8px 8px 8px 20px;*/
    /*font-size: 100%;*/
/*}*/
/*input,*/
/*select {*/
    /*border-radius: 30px;*/
/*}*/
/*select {*/
    /*position: relative;*/
    /*width: 100%;*/
    /*border-radius: 30px;*/
    /*height: 44px;*/
    /*-webkit-appearance: none;*/
    /*font-size: 18px;*/
    /*margin-bottom: 1.8rem;*/
    /*border: 1px solid black;*/
    /*padding: 8px 20px 8px 20px !important;*/
    /*color: inherit;*/
    /*text-align: right;*/
    /*-moz-appearance: none;*/
/*}*/

/*!* For IE10 *!*/
/*select::-ms-expand {*/
    /*display: none;*/
/*}*/

/*.select-wrapper {*/
    /*position: relative;*/
/*}*/

/*.select-wrapper:before, .select-wrapper:after {*/
    /*content: '';*/
    /*position: absolute;*/
    /*width: 20px;*/
    /*height: 2px;*/
    /*background-color: var( --turquoise );*/
    /*left: 20px;*/
    /*top: calc(50% - 10px);*/
/*}*/
/*.select-wrapper:before {*/
    /*transform: rotate(45deg);*/
/*}*/
/*.select-wrapper:after {*/
    /*margin-left: 13px;*/
    /*transform: rotate(-45deg);*/
/*}*/


/*label,*/
/*label,*/
/*.label {*/
    /*text-transform: uppercase;*/
    /*font-size: 14px;*/
/*}*/
/*.-turquoise label,*/
/*.-turquoise .label {*/
    /*color: var(--turquoise);*/
/*}*/
/*.-red label,*/
/*.-red .label {*/
    /*color: var(--red);*/
/*}*/
/*.-yellow label,*/
/*.-yellow .label {*/
    /*color: var(--yellow);*/
/*}*/
/*.-green label,*/
/*.-green .label {*/
    /*color: var(--green);*/
/*}*/

/*.label.heading {*/
    /*margin-bottom: 15px;*/
/*}*/

/*input[type="checkbox"] {*/
    /*position: absolute;*/
    /*cursor: pointer;*/
    /*height: 20px;*/
    /*width: 20px;*/
    /*border-radius: 0;*/
    /*transition: background-color 0.25s;*/
    /*padding: 8px;*/
/*}*/

/*input:not([type="checkbox"]).invalid, textarea.invalid {*/
    /*background-color: var( --turquoise );*/
/*}*/
/*input[type="checkbox"].invalid {*/
    /*border-color: var( --turquoise );*/
/*}*/

/*label.checkbox-label,*/
/*label.newsletter-label,*/
/*label.different-shipping-label {*/
    /*margin-left: 50px;*/
    /*color: black;*/
    /*text-transform: none;*/
/*}*/

/*input[type="checkbox"]:checked:after, input[type="checkbox"]:checked:before {*/
    /*content: '';*/
    /*position: absolute;*/
    /*width: 100%;*/
    /*height: 2px;*/
    /*z-index: 99;*/
    /*left: 0;*/
    /*background: var( --turquoise );*/
/*}*/
/*input[type="checkbox"]:checked:after {*/
    /*transform: rotate(45deg);*/
/*}*/
/*input[type="checkbox"]:checked:before {*/
    /*transform: rotate(-45deg);*/
/*}*/

/*.checkbox-form-row.has-margin-bottom {*/
    /*margin-bottom: 5px;*/
/*}*/

/*.terms-conditions-checkbox:not(.is-open) {*/
    /*margin-top: 5px;*/
/*}*/

/*.product, .title-with-border {*/
    /*padding-bottom: 5px;*/
    /*margin-bottom: 30px;*/
    /*border-bottom: 1px solid #95989a;*/
/*}*/
/*.product label,*/
/*.product .label {*/
    /*margin-bottom: 15px;*/
    /*display: block;*/
/*}*/
/*.product p, .title-with-border p {*/
    /*font-size: 1.8rem;*/
    /*font-weight: 700;*/
/*}*/

/*.title-with-border {*/
    /*margin-top: 4rem;*/
/*}*/

/*.button-wrapper {*/
    /*display: flex;*/
    /*padding-top: 50px;*/
    /*margin-top: 30px;*/
    /*border-top: 1px solid #95989a;*/
    /*width: 100%;*/
    /*!*text-align: right;*!*/
    /*position: relative;*/
/*}*/
/*.required-text {*/
    /*position: absolute;*/
    /*left: 0;*/
    /*top: 3px;*/
    /*color: var( --turquoise );*/
/*}*/

/*.button-wrapper .next-button svg {*/
    /*position: absolute;*/
    /*right: 20px;*/
/*}*/
/*.button-wrapper .back-button svg {*/
    /*position: absolute;*/
    /*left: 20px;*/
/*}*/
/*.button-wrapper .next-button svg > *, .button-wrapper .back-button svg > * {*/
    /*stroke: var(--turquoise);*/
    /*transition: all 0.25s;*/
/*}*/
/*.button-wrapper .next-button:hover svg > *, .button-wrapper .back-button:hover svg > * {*/
    /*stroke: white;*/
/*}*/

/*.next-button {*/
    /*padding-right: 5rem;*/
/*}*/
/*.back-button {*/
    /*padding-left: 5rem;*/
/*}*/

/*.confirmation p {*/
    /*margin: 0 0 2px;*/
    /*font-size: 14px;*/
    /*font-weight: 700;*/
/*}*/

/*h2,*/
/*.h2 {*/
    /*!*margin-top: 4rem;*!*/
    /*margin-bottom: 5px;*/
/*}*/

/*.checkboxes, .error-message {*/
    /*margin-top: 3rem;*/
/*}*/
/*.error-message {*/
    /*align-self: flex-end;*/
    /*text-align: right;*/
    /*color: var( --turquoise );*/
    /*font-weight: 700;*/
    /*font-size: 14px;*/
 /*}*/

/*.shipping-data {*/
    /*margin-top: 2rem;*/
/*}*/

/*#price {*/
    /*line-height: 47px;*/
/*}*/

/*.thankyou-title {*/
    /*margin-bottom: 15px;*/
    /*font-weight: 700;*/
/*}*/

/*.is-turquoise {*/
    /*color: var( --turquoise );*/
/*}*/

/*.total-price {*/
    /*padding-top: 20px;*/
/*}*/
/*.total-price span {*/
     /*padding-top: 10px;*/
     /*border-top: 1px solid #95989a;*/
 /*}*/

/*.add-remove-container {*/
    /*align-items: center;*/
/*}*/

/*.add-button, .remove-button {*/
    /*margin-top: 17px;*/
    /*position: relative;*/
    /*padding-left: 35px;*/
    /*display: flex;*/
    /*align-items: center;*/
    /*cursor: pointer;*/
/*}*/

/*.add-button .icon, .remove-button .icon {*/
    /*height: 20px;*/
    /*width: 20px;*/
    /*position: absolute;*/
    /*left: 0;*/
    /*border: 1px solid var( --turquoise );*/
    /*border-radius: 50%;*/
/*}*/

/*.add-button .icon:after, .add-button .icon:before,*/
/*.remove-button .icon:after, .remove-button .icon:before {*/
    /*content: '';*/
    /*position: absolute;*/
    /*z-index: 99;*/
    /*width: 100%;*/
    /*height: 2px;*/
    /*left: 0;*/
    /*top: calc(50% - 1px);*/
    /*background: var( --turquoise );*/
/*}*/

/*.add-button .icon:before {*/
    /*transform: rotate(90deg);*/
/*}*/
/*.remove-button .icon:before {*/
    /*display: none;*/
/*}*/

/*@media (--for-sm-down) {*/
    /*.cell-1of2 {*/
        /*flex: 0 0 100%;*/
    /*}*/

    /*.button-wrapper .cell-1of2 {*/
        /*flex: 0 0 50%;*/
    /*}*/
/*}*/
</style>

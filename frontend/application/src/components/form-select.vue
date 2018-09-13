<style scoped>
    @import url(../variables.css);

    .form-select__wrapper {
        color: hsl(var(--form-default-color));
    }

    .form-select__input {
        height: 44px;
        background: hsla(0, 0%, 100%, 0.17);
        position: relative;
        border-bottom: 2px solid hsl(var(--form-default-color));
        cursor: pointer;
    }

    .is-open .form-select__input,
    .is-active .form-select__input {
        background: hsla(var(--form-active-color), 0.07);
        border-color: hsl(var(--form-active-color));
    }

    .form-select__input-text {
        padding: 8px 15px;
    }

    .form-select__arrow {
        position: absolute;
        top: 50%;
        right: 15px;
        width: 24px;
        height: 24px;
        transform: translateY(-50%);
        transition: transform 0.2s ease-out;
    }

    .is-open .form-select__arrow {
        color: hsl(var(--form-active-color));
        transform: translateY(-50%) rotate(180deg);
    }

    .form-select__options {
        background-color: white;
        width: 100%;
        position: absolute;
        left: 0;
        top: 100%;
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
        z-index: 4;
        max-height: 160px; /* ~3,5x */
        overflow: scroll;
        transition: opacity 100ms ease-in-out;
        border-bottom: 2px solid hsl(var(--form-active-color));
    }

    .is-open .form-select__options {
        opacity: 1;
        visibility: visible;
        pointer-events: all;
    }

    .form-select__option {
        display: block;
        list-style: none;
        padding: 8px 15px;
        cursor: pointer;
        transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
    }

    .form-select__option:hover {
        background: hsla(var(--form-active-color), 0.35);
    }
</style>

<script lang="ts">
    // TODO Default value
    import { Vue, Component, Prop } from "vue-property-decorator";

    @Component
    export default class FormSelect extends Vue {
        @Prop({ type: String, default: "" })
        selectId!: string;

        selected = "";
        isActive = false;
        isOpen = false;
        content = "";

        mounted() {
            const select = document.getElementById(this.selectId) as HTMLSelectElement;

            this.selected = (this.$parent as any).defaultValue;

            if (select && Boolean(this.selected)) {
                this.$nextTick().then(() => {
                    this.content = [...select.selectedOptions].map(el => el.innerText).join(', ');
                    this.isActive = Boolean(this.content)
                })
            }
        }

        setSelected(value: string, label: string) {
            this.selected = value;
            this.content = label;
        }

        toggleList() {
            this.isOpen = !this.isOpen;

            this.isActive = Boolean(this.content) || this.isOpen;
        }
    }
</script>

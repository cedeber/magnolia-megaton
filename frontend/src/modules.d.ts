// This is necessary so typescript finds and can import your .vue files
declare module "*.vue" {
    import Vue from "vue";
    export default Vue;
}

// Web fonts && Font Loading API
declare module "*.ttf" {
    const font: any;
    export default font;
}

declare const FontFace: any;

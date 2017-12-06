// This is necessary so typescript finds and can import your .vue files
declare module "*.vue" {
    import Vue from "vue";
    export default Vue;
}

import { createApp } from "vue";
import App from "./App.vue";

import router from "@/plugins/router";
import pinia from "@/plugins/pinia";
import i18n from "@/plugins/i18n";
import "@/plugins/faIcons";

import "./assets/main.scss";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const app = createApp(App);

app.component("font-awesome-icon", FontAwesomeIcon);

app.use(router);
app.use(pinia);
app.use(i18n);

app.mount("#app");

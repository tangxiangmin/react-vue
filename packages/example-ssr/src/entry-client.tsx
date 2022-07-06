import {h, createApp} from "@shymean/react-vue";
import {App} from "./main";

//@ts-ignore
// createApp(<App/>).hydrate(document.querySelector('#app')!)

//@ts-ignore
createApp(<App/>).mount(document.querySelector('#app')!)

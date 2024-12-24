<script setup lang="ts">
import { ref, useTemplateRef } from "vue";
import Hikvison from "./components/hikvison/Hikvison.vue";
const hikvison = useTemplateRef("hikvison");
const open = ref(false);
const startPreview = () => {
  hikvison.value?.startPreview();
};
</script>

<template>
  <div>
    <button @click="open = !open">出现</button>
    <button @click="startPreview">展示画面</button>
    <Hikvison ref="hikvison" v-if="open" />
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>

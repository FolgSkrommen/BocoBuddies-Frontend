<script setup lang="ts">
import Card from '../components/Card.vue'
import {ref} from "vue";
import MessageContainer from "../components/chat/MessageContainer.vue";

const username = ref("Brukernavn til motpart");
const item = ref("Gjenstand");
</script>
<template>
  <div>
    <h1>{{ username }}</h1>
    <h2>{{ item }}</h2>

    <MessageContainer>

    </MessageContainer>
  </div>
</template>

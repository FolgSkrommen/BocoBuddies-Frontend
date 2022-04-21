<script setup lang="ts">
import Card from '../components/Card.vue'
import {ref} from "vue";
import MessageContainer from "../components/chat/MessageContainer.vue";
const messages = ref([
  {
    message: "Kan jeg låne?",
    date: new Date(),
    receive: false
  },
  {
    message: "Yes sir!",
    date: new Date(),
    receive: true
  },
  {
    message: "GGWP",
    date: new Date(),
    receive: false
  }
])
const username = ref("Brukernavn");
const item = ref("Gjenstand");
</script>
<template>
  <div>
    <h1 class="text-center text-4xl">{{ username }}</h1>
    <h2 class="text-center text-xl">{{ item }}</h2>

    <MessageContainer :messages="messages">

    </MessageContainer>
  </div>
</template>

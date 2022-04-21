<script setup lang="ts">
import Card from '../components/Card.vue'
import {ref} from "vue";
import MessageContainer from "../components/chat/MessageContainer.vue";
import BaseInput from "../components/Base/BaseInput.vue";
import BaseBtn from "../components/Base/BaseBtn.vue";
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

function onSubmit(){

  alert(currentMessage.value);
  currentMessage.value = "";
}

const username = ref("Brukernavn");
const item = ref("Gjenstand");
const currentMessage = ref("");

</script>
<template>
  <div>
    <h1 class="text-center text-4xl">{{ username }}</h1>
    <h2 class="text-center text-xl">{{ item }}</h2>

    <MessageContainer :messages="messages">
    </MessageContainer>
    <form v-on:submit.prevent="onSubmit">
      <div class="grid grid-cols-6">
        <div class="col-span-5">
          <base-input v-model="currentMessage"></base-input>
        </div>
        <base-btn type="submit">Send</base-btn>
      </div>
    </form>
  </div>
</template>

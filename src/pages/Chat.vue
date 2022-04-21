<script setup lang="ts">
import Card from '../components/Card.vue'
import {ref} from "vue";
import MessageContainer from "../components/chat/MessageContainer.vue";
import BaseInput from "../components/Base/BaseInput.vue";
import BaseBtn from "../components/Base/BaseBtn.vue";
import BaseModal from "../components/Base/BaseModal.vue";
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

function toggleLoan(){
  showLoanModal.value = !showLoanModal.value;
}

function onSubmit(){
  alert(currentMessage.value + ", " + loanStatus.value);
  currentMessage.value = "";
}

const showLoanModal = ref(false)
const username = ref("Brukernavn");
const item = ref("Gjenstand");
const currentMessage = ref("");
const loanStatus = ref(undefined)
</script>
<template>
  <div>
    <h1 class="text-center text-4xl">{{ username }}</h1>
    <h2 class="text-center text-xl">{{ item }}</h2>

    <MessageContainer :messages="messages" v-model="loanStatus">
    </MessageContainer>
    <form v-on:submit.prevent="onSubmit">
      <div class="grid grid-cols-6">
        <div class="col-span-5">
          <base-input v-model="currentMessage"></base-input>
        </div>
        <base-btn type="submit">Send</base-btn>
      </div>
    </form>

    <button class="bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" @click="toggleLoan">
      Open large modal
    </button>


    <div class="grid">
      <BaseBtn class="place-self-center m-4" @click="toggleLoan">Lån</BaseBtn>
    </div>
    <!-- Popup or modal for when requesting loan -->
    <BaseModal v-model="showLoanModal" title="Title">
      <template v-slot:header>
        This is  a title
      </template>
      <template v-slot:body>
        Body. Here is the body :P
      </template>
      <template v-slot:footer>
        <button class="text-red-500 bg-transparent border border-solid border-red-500 hover:bg-red-500 hover:text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" @click="toggleLoan">
          Close
        </button>
        <button class="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" v-on:click="toggleLoan">
          Save Changes
        </button>
      </template>
    </BaseModal>

    <div class="grid" v-if="loanStatus === true">
      <BaseBtn class="place-self-center m-4">Gi tilbakemelding</BaseBtn>
    </div>
  </div>

</template>

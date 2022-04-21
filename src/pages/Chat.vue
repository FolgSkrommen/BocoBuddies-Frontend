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
  alert(currentMessage.value);
  currentMessage.value = "";
}
interface DateAndTime{
  fromDate: String,
  fromTime: String,
  toDate: String,
  toTime: String,

}

const dateAndTime = ref<DateAndTime>()
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

    <div class="grid">
      <BaseBtn class="place-self-center m-4" @click="toggleLoan" v-if="loanStatus===undefined">Lån</BaseBtn>
    </div>
    <!-- Popup or modal for when requesting loan -->
    <BaseModal v-model="showLoanModal" title="Title">
      <template v-slot:header>
        Når vil du leie gjenstanden?
      </template>
      <template v-slot:body>
        <form>
          <BaseInput type="date" label="Fra (dato)" ></BaseInput>
          <BaseInput type="time" label="Fra (tidspunkt)"></BaseInput>

          <BaseInput type="date" label="Til"></BaseInput>
          <BaseInput type="time" label="Til (tidspunkt)"></BaseInput>
        </form>
      </template>
      <template v-slot:footer>
        <div class="grid gap-4 grid-cols-2">
          <BaseBtn @click="toggleLoan">Avbryt</BaseBtn>
          <BaseBtn @click="toggleLoan">Send</BaseBtn>
        </div>
      </template>
    </BaseModal>

    <div class="grid" v-if="loanStatus === true">
      <BaseBtn class="place-self-center m-4">Gi tilbakemelding</BaseBtn>
    </div>
  </div>

</template>

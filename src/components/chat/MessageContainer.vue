<script setup lang="ts">
import Card from '../components/Card.vue'
import {PropType, ref} from "vue";
import Message from "./Message.vue";
import Receipt from "./Receipt.vue";

interface IMessage {
  message: String,
  date: Date,
  receive: Boolean,
}

const receipt = ref({
  username: "Bruker",
  itemName: "Fiskestang",
  loanStart: new Date().toDateString(),
  loanStop: new Date().toDateString(),
  itemPrice: 1000,
  itemUnit: "dag",
})


const props =  defineProps({
  messages: {
    type: Array as PropType<Array<IMessage>>,
    default: () => [],
    required: true,
  },
})


</script>
<template>
  <div class="bg-F7F9FC-100 border border-black-400 px-4 py-3 rounded md:container mx-auto h-full min-h-screen">

    <Message v-for="(message, i) in messages" :id="i" :receive="message.receive">
      <div>{{ message.message }}</div>
    </Message>
    <receipt :receipt="receipt"></receipt>
    <receipt :receipt="receipt" :receive="true"></receipt>
  </div>
</template>

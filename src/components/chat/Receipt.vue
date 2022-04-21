<script setup lang="ts">
import Card from '../components/Card.vue'
import {PropType, ref} from "vue";

interface IReceipt{
  username: String,
  itemName: String,
  loanStart: Date,
  loanStop: Date,
  itemPrice: Number,
  itemUnit: String,
}

const props = defineProps({
  receipt: {
    type: Object as () => IReceipt,
    required: true
  },
  receive: Boolean,
})

</script>
<template>
  <div class="grid border-blue rounded">
    <div class="bg-blue-800 border border-blue-900 text-white px-4 py-3 rounded-full my-5 w-fit place-self-end" v-if="receive">
      <h3> {{ props.receipt.username }} </h3>
      <h3> {{ props.receipt.itemName }} </h3>
      <h3> {{ props.receipt.loanStart }} - {{ props.receipt.loanStop }} </h3>
      <h3> {{ props.receipt.itemPrice }} per {{ props.receipt.itemUnit }} </h3>
    </div>
    <div class="bg-gray-200 border border-black text-black px-4 py-3 rounded-full my-5 w-fit self-auto" v-else>
      <h3> {{ props.receipt.username }} </h3>
      <h3> {{ props.receipt.itemName }} </h3>
      <h3> {{ props.receipt.loanStart }} - {{ props.receipt.loanStop }} </h3>
      <h3> {{ props.receipt.itemPrice }} per {{ props.receipt.itemUnit }} </h3>
    </div>
  </div>

</template>


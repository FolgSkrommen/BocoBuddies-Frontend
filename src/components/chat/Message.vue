<script setup lang="ts">
import Card from '../components/Card.vue'
import {ref} from "vue";

interface Props{
  receive: boolean
}

const { receive } = defineProps<Props>()

</script>
<template>
  <div class="grid">
    <div class="bg-blue-800 border border-blue-900 text-white px-4 py-3 rounded-full my-5 w-fit place-self-end" v-if="receive">
      <slot></slot>
    </div>
    <div class="bg-gray-200 border border-black text-black px-4 py-3 rounded-full my-5 w-fit self-auto" v-else>
      <slot></slot>
    </div>
  </div>


</template>


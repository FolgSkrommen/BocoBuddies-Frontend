<script setup lang="ts">
import Card from '../components/Card.vue'
import {ref} from "vue";
</script>
<template>
  <div class="bg-gray-200 border border-black text-black px-4 py-3 rounded-full absolute left-5">
    <slot></slot>
  </div>
</template>

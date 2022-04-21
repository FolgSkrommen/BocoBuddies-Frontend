<script setup lang="ts">
import {XCircleIcon} from '@heroicons/vue/solid'

const props = defineProps({
  modelValue: {type: Array, required: true},
  removable: {type: Boolean}
})
const emit = defineEmits(['remove-tag-event','add-tag-event'])
</script>

<template>
  <div class="overflow-x-auto flex gap-3">
    <div v-for="tag in props.modelValue" :key="tag.id" class="bg-blue rounded overflow-x-auto flex gap-1 items-center">
      <XCircleIcon v-if="props.removable" @click="$emit('remove-tag-event', tag)" class="h-5 w-5"></XCircleIcon>
      <span @click="$emit('add-tag-event', tag)" class="">{{ tag.name }}</span>
    </div>
  </div>
</template>
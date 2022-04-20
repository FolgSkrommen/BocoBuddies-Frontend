<script setup lang="ts">
import Card from '../components/Card.vue'
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup

let testArray:Array<string> = ['hei','på','deg']
</script>

<template>
	<div>
		<h1>Hjem</h1>
	</div>

  <div>
    <!--Text search input component-->
    <div>search</div>
  </div>

  <div>
    <!--Tag input component-->
    <div>categories goes here</div>
    <div class="overflow-x-auto flex gap-4">
      <div v-for="t in testArray">{{t}}</div>
    </div>
  </div>

  <div>
    <!--List component-->
    <div class="overflow-y-auto grid gap-4">
      <div v-for="t in testArray">{{t}}</div>
    </div>
  </div>

  <div>
    <!--Sorting component-->
    <div class="overflow-y-auto grid gap-4">
      <div v-for="t in testArray">
        <input type="radio" :value="t"> {{ t }}
      </div>
    </div>

  </div>
</template>

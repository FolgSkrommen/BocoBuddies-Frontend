<script setup lang="ts">
import Card from '../components/Card.vue'
import Chat from "./Chat.vue";
import BaseInput from '../components/form/BaseInput.vue'
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup

let sortChosen = 6
let sortAlts:Array<object> = [{id:1, alt:'Pris lav-høy'}, {id:2, alt:'Pris høy-lav'},
  {id:3, alt:'Eldste først'}, {id:4, alt:'Nyeste først'}, {id:5, alt:'Nærmest'}, {id:6, alt:'Ingen sortering'}]

let tags:Array<string> = []

let testArray:Array<string> = ['hei','på','deg']
</script>

<template>
	<div>
		<h1>Hjem</h1>
	</div>

  <div>
    <!--Text search input component-->
    <BaseInput></BaseInput>
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
      {{sortChosen}}
      <div v-for="alt in sortAlts">
        <input type="radio" :value="alt.alt" :id="alt.id" name="sort" v-model="sortChosen">
        <label :for="alt.id">{{ alt.alt }}</label>
      </div>
    </div>

  </div>
</template>

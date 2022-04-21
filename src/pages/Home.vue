<script setup lang="ts">
import Card from '../components/Card.vue'
import Chat from "./Chat.vue";
import BaseInput from '../components/form/BaseInput.vue'
import axios from 'axios'
import {ref} from 'vue'
import Tag from "../components/TagList.vue";
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup

function search() {
  axios.get("/item")
}
function categoryChosen(tag:Category) {
  chosenTags.value.push(tag)
  tagAlts.value.forEach((value, index) => {
    if(value.id==tag.id) tagAlts.value.splice(index, 1)
  })
}
function categoryRemoved(tag:Category) {
  tagAlts.value.push(tag)
  chosenTags.value.forEach((value, index) => {
    if(value.id==tag.id) chosenTags.value.splice(index, 1)
  })
}
function getAllSuperTags() {
  axios.get("/url-to-get-all-super-tags")
      .then(response => {
        tagAlts = response.data
      })
}
interface ItemListing {
  id: number,
  ownerId: number,
  categoryId: number,
  active: boolean,
  name: string,
  price: number,
  priceUnit: string,
  displayPhoneNumber: boolean,
  address: string,
  postalCode: string
}
interface Category {
  id: number,
  superCategoryId: number,
  name: string
}
let sortChosen = 6
let sortAlts:Array<object> = [{id:1, alt:'Pris lav-høy'}, {id:2, alt:'Pris høy-lav'},
  {id:3, alt:'Eldste først'}, {id:4, alt:'Nyeste først'}, {id:5, alt:'Nærmest'}, {id:6, alt:'Ingen sortering'}]

let searchWord = ref<string>("")
let tagAlts = ref<Array<Category>>([{id: 1, superCategoryId: 0, name:'some'}, {id: 2, superCategoryId: 0, name:'dummy'}, {id: 3, superCategoryId: 0, name:'values'}])
let chosenTags = ref<Array<Category>>([{id: 4, superCategoryId: 0, name:'hola'}])
let items:Array<ItemListing> = []

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
    <input type="text" v-model="searchWord" placeholder="Søk">
    Ooga {{searchWord}}
  </div>

  <div>
    <!--Tag input component-->
    <div>categories goes here</div>
    <Tag v-model="chosenTags" :removable="true" @remove-tag-event="categoryRemoved"></Tag>
    <Tag v-model="tagAlts" @add-tag-event="categoryChosen"></Tag>
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

<script setup lang="ts">
import BaseInput from '../components/Base/BaseInput.vue'
import axios from 'axios'
import {ref} from 'vue'
import Tag from "../components/TagList.vue";
import BaseBtn from "../components/Base/BaseBtn.vue";
import BaseDropdown from "../components/Base/BaseDropdown.vue";

// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup

function search() {
  if(searchWord.value) {
    console.log("Searching for items.... " + searchWord.value)
    /*axios.get("/item")
        .then(response => {
          items.value = response.data
        })
        .catch(error => {
          //TODO error handling
          console.log(error.message)
        })*/
  }
}
function categoryChosen(tag:Category) {
  chosenTags.value.push(tag)
  tagAlts.value.forEach((value, index) => {
    if(value.id==tag.id) tagAlts.value.splice(index, 1)
  })
  //TODO get all subcategories and put them in tagAlts, also update items accordingly instead of what is done now
  //searchBasedOnCategories(chosenTags.value)
}
function categoryRemoved(tag:Category) {
  tagAlts.value.push(tag)
  chosenTags.value.forEach((value, index) => {
    if(value.id==tag.id) chosenTags.value.splice(index, 1)
  })
  //TODO get last tag in chosenTags, based on this get all subcategories and update items accordingly
  //searchBasedOnCategories(chosenTags.value)
}
function searchBasedOnCategories(categories:Array<Category>) {
  console.log("Now searching based on categories...")
  /*axios.get("/items-by-categories", {params: {categories: categories}})
      .then(response => {
        items.value = response.data
      })
      .catch(error => {
        console.log(error)
      })*/
}
function getAllSuperTags() {
	axios.get('/url-to-get-all-super-tags').then(response => {
		tagAlts = response.data
	})
}

interface ItemListing {
	id: number
	ownerId: number
	categoryId: number
	active: boolean
	name: string
	price: number
	priceUnit: string
	displayPhoneNumber: boolean
	address: string
	postalCode: string
}
interface Category {
	id: number
	superCategoryId: number
	name: string
}

let sortChosen = ref(6)
let sortAlts:Array<object> = [{id:1, alt:'Pris lav-høy'}, {id:2, alt:'Pris høy-lav'},
  {id:3, alt:'Eldste først'}, {id:4, alt:'Nyeste først'}, {id:5, alt:'Nærmest'}, {id:6, alt:'Ingen sortering'}]

let searchWord = ref<string>("")
let tagAlts = ref<Array<Category>>([{id: 1, superCategoryId: 0, name:'some'}, {id: 2, superCategoryId: 0, name:'dummy'}, {id: 3, superCategoryId: 0, name:'values'}])
let chosenTags = ref<Array<Category>>([{id: 4, superCategoryId: 0, name:'hola'}])
let items = ref<Array<ItemListing>>([])

let testArray: Array<string> = ['hei', 'på', 'deg']
</script>

<template>
	<div>
		<h1>Hjem</h1>
	</div>

  <div class="flex">
    <!--Text search input component-->
    <BaseInput @keyup.enter="search" v-model="searchWord" ></BaseInput>
    <BaseBtn @click="search">Søk</BaseBtn>
  </div>

  <div>
    <!--Tag input component-->
    <div>categories goes here</div>
    <Tag v-model="chosenTags" :removable="true" @remove-tag-event="categoryRemoved"></Tag>
    <Tag v-model="tagAlts" @add-tag-event="categoryChosen"></Tag>
  </div>

	<div>
		<!--Tag input component-->
		<div>categories goes here</div>
		<Tag
			v-model="chosenTags"
			:removable="true"
			@remove-tag-event="categoryRemoved"
		></Tag>
		<Tag v-model="tagAlts" @add-tag-event="categoryChosen"></Tag>
	</div>

  <div>
    <!--Sorting component-->
    <BaseDropdown></BaseDropdown>
    <div class="overflow-y-auto grid gap-4">
      {{sortChosen}}
      <div v-for="alt in sortAlts">
        <input type="radio" :value="alt.id" :id="alt.id" name="sort" v-model="sortChosen">
        <label :for="alt.id">{{ alt.alt }}</label>
      </div>
    </div>

	<div>
		<!--Sorting component-->
		<div class="overflow-y-auto grid gap-4">
			{{ sortChosen }}
			<div v-for="alt in sortAlts">
				<input
					type="radio"
					:value="alt.alt"
					:id="alt.id"
					name="sort"
					v-model="sortChosen"
				/>
				<label :for="alt.id">{{ alt.alt }}</label>
			</div>
		</div>
	</div>
</template>

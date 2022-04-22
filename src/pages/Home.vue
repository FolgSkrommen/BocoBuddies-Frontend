<script setup lang="ts">
import BaseInput from '../components/Base/BaseInput.vue'
import axios from 'axios'
import { ref } from 'vue'
import Tag from '../components/TagList.vue'
import BaseBtn from '../components/Base/BaseBtn.vue'
import BaseDropdown from '../components/Base/BaseDropdown.vue'
import Card from '../components/Card.vue'
import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/vue/solid'

// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup

function search() {
	if (searchWord.value) {
		console.log('Searching for items.... ' + searchWord.value)
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
function categoryChosen(tag: Category) {
	chosenTags.value.push(tag)
	tagAlts.value.forEach((value, index) => {
		if (value.id == tag.id) tagAlts.value.splice(index, 1)
	})
	//TODO get all subcategories and put them in tagAlts, also update items accordingly instead of what is done now
	//searchBasedOnCategories(chosenTags.value)
}
function categoryRemoved(tag: Category) {
	tagAlts.value.push(tag)
	chosenTags.value.forEach((value, index) => {
		if (value.id == tag.id) chosenTags.value.splice(index, 1)
	})
	//TODO get last tag in chosenTags, based on this get all subcategories and update items accordingly
	//searchBasedOnCategories(chosenTags.value)
}
function searchBasedOnCategories(categories: Array<Category>) {
	console.log('Now searching based on categories...')
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
function gotClicked() {
	console.log('Clicked')
}
function getNextItems() {}
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
	postalcode: string
}
interface Category {
	id: number
	superCategoryId: number
	name: string
}

let sortChosen = ref(6)
let sortAlts: Array<object> = [
	{ id: 1, alt: 'Pris lav-høy' },
	{ id: 2, alt: 'Pris høy-lav' },
	{ id: 3, alt: 'Eldste først' },
	{ id: 4, alt: 'Nyeste først' },
	{ id: 5, alt: 'Nærmest' },
	{ id: 6, alt: 'Ingen sortering' },
]

let searchWord = ref<string>('')
let tagAlts = ref<Array<Category>>([
	{ id: 1, superCategoryId: 0, name: 'some' },
	{ id: 2, superCategoryId: 0, name: 'dummy' },
	{ id: 3, superCategoryId: 0, name: 'values' },
	{ id: 6, superCategoryId: 0, name: 'values' },
	{ id: 7, superCategoryId: 0, name: 'values' },
	{ id: 8, superCategoryId: 0, name: 'values' },
])
let chosenTags = ref<Array<Category>>([
	{ id: 4, superCategoryId: 0, name: 'hola' },
])
let items = ref<Array<ItemListing>>([])

let testArray: Array<string> = ['hei', 'på', 'deg']
let currentPage = 0

//Intersection observer for later if we have time to implement
/*const observer:IntersectionObserver = new IntersectionObserver(entries => {
  const lastItem = entries[0]
  if(!lastItem.isIntersecting) return
  loadMoreItems() //Last item is shown, load more
  observer.unobserve(lastItem.target)
  observer.observe(items.value[items.value.length-1])
}, {})
observer.observe(items[items.length-1])*/
</script>

<template>
	<div>
		<h1>Hjem</h1>
	</div>

	<div class="flex">
		<!--Text search input component-->
		<BaseInput @keyup.enter="search" v-model="searchWord"></BaseInput>
		<BaseBtn @click="search">Søk</BaseBtn>
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
		<!--List component-->
		<div class="overflow-y-auto grid gap-4 hei">
			<div v-for="t in testArray">
				<Card>{{ t }}</Card>
			</div>
		</div>
		<div class="flex justify-center">
			<ChevronLeftIcon
				class="h-7 w-7"
				@click="gotClicked"
			></ChevronLeftIcon>
			<ChevronRightIcon
				class="h-7 w-7"
				@click="gotClicked"
			></ChevronRightIcon>
		</div>
	</div>

	<div>
		<!--Sorting component-->
		<BaseDropdown></BaseDropdown>
		<div class="overflow-y-auto grid gap-4">
			{{ sortChosen }}
			<div v-for="alt in sortAlts">
				<input
					type="radio"
					:value="alt.id"
					:id="alt.id"
					name="sort"
					v-model="sortChosen"
				/>
				<label :for="alt.id">{{ alt.alt }}</label>
			</div>
		</div>
	</div>
</template>

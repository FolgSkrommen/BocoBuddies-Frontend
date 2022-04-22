<script setup lang="ts">
import BaseInput from '../components/Base/BaseInput.vue'
import axios from 'axios'
import { ref } from 'vue'
import TagList from '../components/TagList.vue'
import BaseBtn from '../components/Base/BaseBtn.vue'
import BaseDropdown from '../components/Base/BaseDropdown.vue'
import Card from '../components/Card.vue'
import BaseCombobox from '../components/Base/BaseCombobox.vue'
import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/vue/solid'

// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup

function search() {
	if (searchWord.value.trim()) {
		console.log('Searching for items.... ' + searchWord.value)
		let sortChosenString: string
		/*let sortAlts: Array<object> = [
	{ id: 0, alt: 'Ingen sortering' },
	{ id: 1, alt: 'Pris lav-høy' },
	{ id: 2, alt: 'Pris høy-lav' },
	{ id: 3, alt: 'Nærmest' },
	{ id: 4, alt: 'Nyeste først' },
	{ id: 5, alt: 'Eldste først' },
]*/
		switch (sortChosen.value) {
			case 0: {
				sortChosenString = 'none'
				break
			}
			case 1: {
				sortChosenString = 'price-ascending'
				break
			}
			case 2: {
				sortChosenString = 'price-descending'
				break
			}
			case 3: {
				sortChosenString = 'closest'
				break
			}
			case 4: {
				sortChosenString = 'newest'
				break
			}
			case 5: {
				sortChosenString = 'oldest'
				break
			}
			default: {
				sortChosenString = 'none'
			}
		}
		let chosenTagsIds: Array<number> //TODO gather all chosenTagsIds in here
		/*axios.get("/search/"+searchWord, {params: {categories: chosenTagsIds, sort: sortChosenString}})
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
	axios
		.get('/items-by-categories', { params: { categories: categories } })
		.then(response => {
			items.value = response.data
		})
		.catch(error => {
			console.log(error)
		})
}
function getAllSuperTags() {
	axios.get('/url-to-get-all-super-tags').then(response => {
		tagAlts = response.data
	})
}
function gotClicked() {
	console.log('Clicked')
}
function loadMoreItems() {
	console.log('Getting next items...')
	currentPage.value++
	for (let i = 0; i < 10; i++) {
		items.value.push({
			id: 1,
			ownerId: 1,
			categoryId: 1,
			active: true,
			name: 'asda',
			price: 100,
			priceUnit: '10/time',
			showPhoneNumber: true,
			address: 'her',
			postalcode: '3440',
			description: 'kul',
		})
	}
}
interface ItemListing {
	id: number
	ownerId: number
	categoryId: number
	active: boolean
	name: string
	price: number
	priceUnit: string
	showPhoneNumber: boolean
	address: string
	postalcode: string
	description: string
}
interface Category {
	id: number
	superCategoryId: number
	name: string
}
interface Alternative {
	id: number
	alt: string
}

let sortChosen = ref(0)
let sortAlts: Array<Alternative> = [
	{ id: 0, alt: 'Ingen sortering' },
	{ id: 1, alt: 'Pris lav-høy' },
	{ id: 2, alt: 'Pris høy-lav' },
	{ id: 3, alt: 'Nærmest' },
	{ id: 4, alt: 'Nyeste først' },
	{ id: 5, alt: 'Eldste først' },
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

let currentPage = ref(0)

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
		<BaseInput
			@keyup.enter="search"
			v-model="searchWord"
			data-testid="search-field"
		></BaseInput>
		<BaseBtn @click="search" data-testid="search-button">Søk</BaseBtn>
	</div>

	<div class="py-10">
		<!--Tag input component-->
		<div>categories goes here</div>
		<TagList
			v-model="chosenTags"
			:removable="true"
			@remove-tag-event="categoryRemoved"
			data-testid="categories-tag-chosen"
		></TagList>
		<TagList
			v-model="tagAlts"
			@add-tag-event="categoryChosen"
			data-testid="categories-tag-alts"
		></TagList>
	</div>

	<div>
		<!--List component-->
		<div class="grid gap-4">
			<div v-for="i in items" data-testid="item-cards">
				<Card>{{ i.name }}</Card>
			</div>
		</div>
		<div class="flex justify-center my-10">
			<BaseBtn @click="loadMoreItems" data-testid="load-more-items-button"
				>Last inn flere</BaseBtn
			>
		</div>
	</div>

	<div class="flex items-center justify-center h-0 h-full">
		<!--Sort dropdown-->
		<BaseDropdown
			:alternatives="sortAlts"
			v-model="sortChosen"
			class="bottom-5 fixed"
			data-testid="sort-dropdown"
		></BaseDropdown>
	</div>
</template>

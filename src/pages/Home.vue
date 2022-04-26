<script setup lang="ts">
import BaseInput from '../components/base/BaseInput.vue'
import axios from 'axios'
import { onMounted, ref } from 'vue'
import TagList from '../components/TagList.vue'
import BaseBtn from '../components/base/BaseBtn.vue'
import BaseDropdown from '../components/base/BaseDropdown.vue'
import Card from '../components/Card.vue'
import qs from 'qs'
import BaseCombobox from '../components/base/BaseCombobox.vue'
import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/vue/solid'

// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup

//Interfaces
interface Category {
	categoryId: number
	name: string
	superCategoryId: number
}
interface Alternative {
	id: number
	alt: string
}
interface Item {
	id: number
	image: string
	name: string
	price: number
	availableFrom: string
	availableTo: string
	priceUnit: string
	address: string
	postalCode: string
}

//Variables
let sortChosen = ref(0)
let sortAlts: Alternative[] = [
	{ id: 0, alt: 'Ingen sortering' },
	{ id: 1, alt: 'Pris lav-høy' },
	{ id: 2, alt: 'Pris høy-lav' },
	{ id: 3, alt: 'Nærmest' },
	{ id: 4, alt: 'Nyeste først' },
	{ id: 5, alt: 'Eldste først' },
]

let searchWord = ref<string>('')
let tagAlts = ref<Array<Category>>([])
let chosenTags = ref<Array<Category>>([])
let items = ref<Array<Item>>([])

let currentPage = ref(0)

//Mounted
onMounted(() => {
	getMainCategories()
})

//Functions
function isAnItem(obj: any): obj is Item {
	return (
		'id' in obj &&
		'image' in obj &&
		'name' in obj &&
		'price' in obj &&
		'availableFrom' in obj &&
		'availableTo' in obj &&
		'priceUnit' in obj &&
		'address' in obj &&
		'postalCode' in obj
	)
}
function getMainCategories() {
	axios
		.get('/category/main')
		.then(response => {
			tagAlts.value = response.data
		})
		.catch(error => {
			console.log(error)
		})
}
function search() {
	console.log('Searching for items.... ' + searchWord.value)
	let sortChosenString: string
	/*
  { id: 0, alt: 'Ingen sortering' },
	{ id: 1, alt: 'Pris lav-høy' },
	{ id: 2, alt: 'Pris høy-lav' },
	{ id: 3, alt: 'Nærmest' },
	{ id: 4, alt: 'Nyeste først' },
	{ id: 5, alt: 'Eldste først' },*/
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
			sortChosenString = 'none'
			break
		}
		default: {
			sortChosenString = 'none'
			break
		}
	}
	let chosenTagsIds: Array<number> = [] //TODO gather all chosenTagsIds in here
	chosenTags.value.forEach(tag => {
		chosenTagsIds.push(tag.categoryId)
	})

	axios
		.get('/item/search/' + searchWord.value.trim(), {
			params: {
				categories: chosenTagsIds,
				sort: sortChosenString,
				amount: 20,
				offset: currentPage.value,
			},
			paramsSerializer: params => {
				return qs.stringify(params, { arrayFormat: 'repeat' })
			},
		})
		.then(response => {
			items = response.data
			if (Array.isArray(items) && items.length > 0 && isAnItem(items[0]))
				items.value.push(response.data)
			console.log(items.value)
		})
		.catch(error => {
			//TODO error handling, tell user something went wrong
			items.value = []
			console.log(error.message)
		})
}
function buttonOrEnterSearch() {
	if (searchWord.value.trim()) {
		currentPage.value = 0
		search()
	}
}
function categorySearch() {
	currentPage.value = 0
	search()
}
function categoryChosen(tag: Category) {
	chosenTags.value.push(tag)
	categorySearch()
	axios
		.get('category/sub?categoryId=' + tag.categoryId)
		.then(response => {
			tagAlts.value = response.data
		})
		.catch(error => {
			console.log(error)
		})
	//TODO get all subcategories and put them in tagAlts, also update items accordingly instead of what is done now
	//searchBasedOnCategories(chosenTags.value)
}
function categoryRemoved(tag: Category) {
	chosenTags.value.forEach((value, index) => {
		if (value.categoryId == tag.categoryId)
			chosenTags.value.splice(index, chosenTags.value.length - index)
	})
	categorySearch()
	if (chosenTags.value.length < 1) {
		getMainCategories()
		return
	}
	axios
		.get(
			'category/sub?categoryId=' +
				chosenTags.value[chosenTags.value.length - 1].categoryId
		)
		.then(response => {
			tagAlts.value = response.data
		})
		.catch(error => {
			console.log(error)
		})
	//TODO get last tag in chosenTags, based on this get all subcategories and update items accordingly
	//searchBasedOnCategories(chosenTags.value)
}

function loadMoreItems() {
	if (items.value.length > 0) {
		//Not allowed to load more items if no items
		console.log('Getting next items...')
		currentPage.value++
		search()
	}
}

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
		{{ currentPage }}
	</div>

	<div class="flex">
		<!--Text search input component-->
		<BaseInput
			@keyup.enter="buttonOrEnterSearch"
			v-model="searchWord"
			data-testid="search-field"
		></BaseInput>
		<BaseBtn @click="buttonOrEnterSearch" data-testid="search-button"
			>Søk</BaseBtn
		>
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

			<div class="grid gap-4">
				<router-link
					class="bg-slate-100 rounded-lg shadow-lg"
					v-for="item in items"
					:to="`/item/${item.id}`"
				>
					<div class="flex gap-2">
						<img
							class="w-32 rounded-l-lg"
							:src="item.image"
							:alt="item.name"
						/>
						<div class="p-2 grid">
							<p class="font-bold text-lg">
								{{ item.name }}
							</p>
							<div>
								<p>{{ item.price }}kr / {{ item.priceUnit }}</p>
							</div>
							<p class="text-slate-500">
								{{ item.availableFrom }} -
								{{ item.availableTo }}
							</p>
						</div>
					</div>
				</router-link>
			</div>
		</div>
		<div class="flex justify-center my-10">
			<BaseBtn @click="loadMoreItems" data-testid="load-more-items-button"
				>Last inn flere</BaseBtn
			>
		</div>
	</div>
	{{ sortChosen }}
	<div class="flex items-center justify-center h-full">
		<!--Sort dropdown-->
		<BaseDropdown
			:alternatives="sortAlts"
			v-model.number="sortChosen"
			class="bottom-12 fixed"
			data-testid="sort-dropdown"
		></BaseDropdown>
	</div>
</template>

<script setup lang="ts">
import axios from 'axios'
import { ref, computed, watch } from 'vue'
import CategoryList from '../components/CategoryList.vue'
import SearchbarAndButton from '../components/SearchbarAndButton.vue'
import qs from 'qs'
import ItemList from '../components/ItemList.vue'
import SortDropdown from '../components/SortDropdown.vue'
import { ChevronRightIcon, ChevronLeftIcon } from '@heroicons/vue/solid'
import LoadingIndicator from '../components/base/LoadingIndicator.vue'
import BaseBanner from '../components/base/BaseBanner.vue'
import AddFriendPopup from '../components/AddFriendPopup.vue'
import BasePopup from '../components/base/BasePopup.vue'
import VueCookies from 'vue-cookies'
import AppVue from '../App.vue'
import { Alternative, Category, Item } from '../api/schema'

// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup

//Variables
let sortChosen = ref(0)
let sortAlts: Alternative[] = [
	{ id: 0, alt: 'Ingen sortering' },
	{ id: 1, alt: 'Pris lav-høy' },
	{ id: 2, alt: 'Pris høy-lav' },
	//{ id: 3, alt: 'Nærmest' },
	{ id: 4, alt: 'Nyeste først' },
	{ id: 5, alt: 'Eldste først' },
]

let searchWord = ref<string>('')
let tagAlts = ref<Array<Category>>([])
let chosenCategories = ref<Array<Category>>([])
let items = ref<Array<Item>>([])
let seenTutorial = ref<boolean>(false)

let currentPage = ref<number>(0)
const amountPerPage: number = 20
let renderLoadButton = ref<boolean>(true)

//Computed
const searchHits = computed<string>(() =>
	items.value.length == 1 ? `1 resultat` : `${items.value.length} resultater`
)

//Watchers
watch(sortChosen, () => {
	searchAndResetItems()
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

type Status = 'loading' | 'loaded' | 'error'
const status = ref<Status>()
const errorMessage = ref()
async function getMainCategories() {
	status.value = 'loading'
	try {
		const res = await axios.get('/category/main')
		const data: Category[] = res.data
		tagAlts.value = data
		status.value = 'loaded'
	} catch (error) {
		status.value = 'error'
		errorMessage.value = error
	}
}
getMainCategories()

async function search() {
	status.value = 'loading'

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

	let chosenCategoriesIds: Array<number> = []
	chosenCategories.value.forEach(tag => {
		chosenCategoriesIds.push(tag.categoryId)
	})
	try {
		const res = await axios.get('/item/search/' + searchWord.value.trim(), {
			params: {
				categories: chosenCategoriesIds[chosenCategoriesIds.length - 1],
				sort: sortChosenString,
				amount: amountPerPage,
				offset: currentPage.value,
			},
			paramsSerializer: params => {
				return qs.stringify(params, { arrayFormat: 'repeat' })
			},
		})
		const data: Item[] = res.data
		if (Array.isArray(data) && data.length > 0 && isAnItem(data[0]))
			items.value = items.value.concat(data)
		if (data.length < amountPerPage) renderLoadButton.value = false

		status.value = 'loaded'
	} catch (error) {
		status.value = 'error'
		errorMessage.value = error
		items.value = []
	}
}
search()

function searchAndResetItems() {
	currentPage.value = 0
	items.value = []
	search()
}
async function categoryChosen(tag: Category) {
	chosenCategories.value.push(tag)
	searchAndResetItems()
	status.value = 'loading'
	try {
		const res = await axios.get('category/sub?categoryId=' + tag.categoryId)
		const data: Category[] = res.data
		tagAlts.value = data
		status.value = 'loaded'
	} catch (error) {
		status.value = 'error'
		errorMessage.value = error
	}
}
async function categoryRemoved(tag: Category) {
	chosenCategories.value.forEach((value, index) => {
		if (value.categoryId == tag.categoryId)
			chosenCategories.value.splice(
				index,
				chosenCategories.value.length - index
			)
	})
	searchAndResetItems()
	if (chosenCategories.value.length < 1) {
		getMainCategories()
		return
	}
	status.value = 'loading'
	try {
		const res = await axios.get(
			'category/sub?categoryId=' +
				chosenCategories.value[chosenCategories.value.length - 1]
					.categoryId
		)
		const data: Category[] = res.data
		tagAlts.value = data
		status.value = 'loaded'
	} catch (error) {
		status.value = 'error'
		errorMessage.value = error
	}
}
function loadMoreItems() {
	if (items.value.length > 0) {
		//Not allowed to load more items if no items
		currentPage.value++
		search()
	}
}
const seenVideoCookie = ('; ' + document.cookie)
	.split(`; seenVideo=`)
	.pop()
	.split(';')[0]

if (seenVideoCookie.includes('true')) {
	seenTutorial = ref(true)
}

function setCookieSeen() {
	document.cookie = 'seenVideo=true; max-age=31536000'
	seenTutorial = ref(true)
	location.reload()
}

console.log(seenTutorial)

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
	<BasePopup v-show="!seenTutorial" @exit="setCookieSeen"
		><iframe
			width="560"
			height="315"
			src="https://www.youtube.com/embed/dQw4w9WgXcQ?controls=0"
			title="YouTube video player"
			frameborder="0"
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
			allowfullscreen
		></iframe
	></BasePopup>
	<BaseBanner
		v-if="status === 'error'"
		type="error"
		:message="errorMessage"
	/>
	<h1 class="text-4xl font-bold">Hjem</h1>
	<SearchbarAndButton
		v-model="searchWord"
		@search="searchAndResetItems"
		data-testid="searchbar-and-button"
	></SearchbarAndButton>

	<div class="flex flex-col gap-2 py-10">
		<!--Tag input component-->
		<h2 class="text-2xl font-semibold">Kategorier</h2>
		<CategoryList
			v-model="chosenCategories"
			v-if="chosenCategories.length > 0"
			:removable="true"
			@remove-category-event="categoryRemoved"
			class="border-solid bg-gray-500 rounded p-3"
			data-testid="categories-category-chosen"
		></CategoryList>
		<CategoryList
			v-model="tagAlts"
			@add-category-event="categoryChosen"
			data-testid="categories-category-alts"
		></CategoryList>
	</div>
	<LoadingIndicator v-if="status === 'loading'" />
	<ItemList
		:items="items"
		:searchHits="searchHits"
		:renderLoadButton="renderLoadButton"
		redirect="item"
		@load-more-items="loadMoreItems"
		data-testid="item-list"
	/>

	<SortDropdown
		:sortAlts="sortAlts"
		v-model.number="sortChosen"
		data-testid="sort-dropdown"
	>
	</SortDropdown>
</template>

<script setup lang="ts">
import axios from 'axios'
import { ref, computed, watch } from 'vue'
import CategoryList from '../components/CategoryList.vue'
import SearchbarAndButton from '../components/SearchbarAndButton.vue'
import qs from 'qs'
import ItemList from '../components/ItemList.vue'
import SortDropdown from '../components/SortDropdown.vue'
import {
	ChevronRightIcon,
	ChevronLeftIcon,
	EmojiSadIcon,
} from '@heroicons/vue/outline'
import LoadingIndicator from '../components/base/LoadingIndicator.vue'
import BaseBanner from '../components/base/BaseBanner.vue'
import AddFriendPopup from '../components/AddFriendPopup.vue'
import BasePopup from '../components/base/BasePopup.vue'
import AppVue from '../App.vue'
import { Alternative, Category, Item } from '../api/schema'
import { store } from '../store'
import { GetItemSearchRequest } from '../api/item/search'
import { AdjustmentsIcon } from '@heroicons/vue/solid'

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

type Status = 'loading' | 'loaded' | 'error'
const status = ref<Status>()
async function getMainCategories() {
	status.value = 'loading'
	try {
		const res = await axios.get('/category/main')
		const data: Category[] = res.data
		tagAlts.value = data
		status.value = 'loaded'
	} catch (error: any) {
		store.dispatch('error', error.message)
		status.value = 'error'
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
			sortChosenString = 'nearest'
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
		let params: GetItemSearchRequest = {
			categories: chosenCategoriesIds.slice(-1),
			sort: sortChosenString,
			amount: amountPerPage,
			offset: currentPage.value,
			active: true,
			useAuth: false,
		}
		if (sortChosenString == 'nearest') {
			const pos = navigator.geolocation.getCurrentPosition(
				async position => {
					params = {
						categories: chosenCategoriesIds.slice(-1),
						sort: sortChosenString,
						amount: amountPerPage,
						offset: currentPage.value,
						active: true,
						useAuth: false,
						lat: position.coords.latitude.toString(),
						lng: position.coords.longitude.toString(),
					}
					const res = await axios.get(
						'/item/search/' + searchWord.value.trim(),
						{
							params,
							paramsSerializer: params => {
								return qs.stringify(params, {
									arrayFormat: 'repeat',
								})
							},
						}
					)
					const data: Item[] = res.data
					if (data.length > 0) items.value = items.value.concat(data)
					if (data.length < amountPerPage)
						renderLoadButton.value = false

					status.value = 'loaded'
					store.dispatch('hideBanner', 'error')
				},
				error => {
					store.dispatch('error', error.message)
					status.value = 'error'
				}
			)
		}
		if (sortChosenString != 'nearest') {
			status.value = 'loading'
			const res = await axios.get(
				'/item/search/' + searchWord.value.trim(),
				{
					params,
					paramsSerializer: params => {
						return qs.stringify(params, { arrayFormat: 'repeat' })
					},
				}
			)
			const data: Item[] = res.data
			if (data.length > 0) items.value = items.value.concat(data)
			if (data.length < amountPerPage) renderLoadButton.value = false

			status.value = 'loaded'
			store.dispatch('hideBanner', 'error')
		}
	} catch (error: any) {
		store.dispatch('error', error.message)
		status.value = 'error'
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
	} catch (error: any) {
		store.dispatch('error', error.message)
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
	} catch (error: any) {
		status.value = 'error'
		store.dispatch('error', error.message)
	}
}
function loadMoreItems() {
	if (items.value.length > 0) {
		//Not allowed to load more items if no items
		currentPage.value++
		search()
	}
}
/*const seenVideoCookie = ('; ' + document.cookie)
	.split(`; seenVideo=`)
	.pop()
	.split(';')[0]

if (seenVideoCookie.includes('true')) {
	seenTutorial = ref(true)
}*/

function setCookieSeen() {
	document.cookie = 'seenVideo=true; max-age=31536000'
	seenTutorial = ref(true)
	location.reload()
}
function cookie() {
	const seenHomeCookie = ('; ' + document.cookie)
		.split(`; seenHomeTutorial=`)
		.pop()
		?.split(';')[0]

	if (!seenHomeCookie?.includes('true')) {
		store.dispatch(
			'info',
			'Hei! velkommen til Boco, dette er hjemsiden din. Her kan du søke etter gjenstander, sortere etter ulike kategorier og klikke deg inn på annonser. Sjekk ut FAQ under profil siden din dersom du har flere spørsmål. Klikk X knappen for å lukke denne meldingen.'
		)
		document.cookie = 'seenHomeTutorial=true; max-age=31536000'
	}
}
cookie()

//Intersection observer for later if we have time to implement
/*const observer:IntersectionObserver = new IntersectionObserver(entries => {
  const lastItem = entries[0]
  if(!lastItem.isIntersecting) return
  loadMoreItems() //Last item is shown, load more
  observer.unobserve(lastItem.target)
  observer.observe(items.value[items.value.length-1])
}, {})
observer.observe(items[items.length-1])*/

const showFiltersAndSort = ref(false)
</script>

<template>
	<!-- 	<BasePopup v-show="!seenTutorial" @exit="setCookieSeen"
		><h4>Velkommen til Boco-Buddies</h4>
		<iframe
			width="560"
			height="315"
			src="https://www.youtube.com/embed/dQw4w9WgXcQ?controls=0"
			title="YouTube video player"
			frameborder="0"
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
			allowfullscreen
		></iframe
	></BasePopup> -->
	<div class="grid gap-4">
		<div class="flex items-center gap-4">
			<AdjustmentsIcon
				class="w-8 h-8 text-slate-500 cursor-pointer"
				@click="showFiltersAndSort = !showFiltersAndSort"
				data-testid="filter-and-sort-toggle"
			/>
			<SearchbarAndButton
				v-model="searchWord"
				@search="searchAndResetItems"
				data-testid="searchbar-and-button"
			></SearchbarAndButton>
		</div>
		<div class="grid gap-4" v-if="showFiltersAndSort">
			<!--Tag input component-->
			<CategoryList
				color="bg-slate-500"
				v-model="chosenCategories"
				v-if="chosenCategories.length > 0"
				:removable="true"
				@remove-category-event="categoryRemoved"
				class=""
				data-testid="categories-category-chosen"
			></CategoryList>

			<CategoryList
				color="bg-blue-500"
				v-model="tagAlts"
				@add-category-event="categoryChosen"
				data-testid="categories-tag-alts"
			></CategoryList>

			<SortDropdown
				class="grow"
				:sortAlts="sortAlts"
				v-model.number="sortChosen"
				data-testid="sort-dropdown"
			/>
		</div>
		<LoadingIndicator v-if="status === 'loading'" />
		<ItemList
			v-if="items.length > 0"
			:items="items"
			:searchHits="searchHits"
			:renderLoadButton="renderLoadButton"
			redirect="item"
			@load-more-items="loadMoreItems"
			data-testid="item-list"
		/>

		<h2 v-else class="text-slate-400 w-fit mx-auto mt-28">
			Ingen resultater
		</h2>
	</div>
</template>

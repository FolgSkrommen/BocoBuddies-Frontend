<script setup lang="ts">
import axios from 'axios'
import { ref, computed, watch } from 'vue'
import CategoryList from '../components/CategoryList.vue'
import SearchbarAndButton from '../components/SearchbarAndButton.vue'
import qs from 'qs'
import ItemList from '../components/ItemList.vue'
import SortDropdown from '../components/SortDropdown.vue'
import { store } from '../store'
import FloatingBtn from '../components/base/FloatingBtn.vue'
import { userInfo } from 'os'
import LoadingIndicator from '../components/base/LoadingIndicator.vue'
import BaseBanner from '../components/base/BaseBanner.vue'
import { Alternative, Category, Item } from '../api/schema'
import { GetItemSearchRequest } from '../api/item/search'

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

let currentPage = ref<number>(0)
const amountPerPage: number = 20
let renderLoadButton = ref<boolean>(true)

const activeSelected = ref<boolean>(true)

type Status = 'loading' | 'loaded' | 'error'
const status = ref<Status>()
//const search = ref('')

//Mounted
if (store.getters.loggedIn) {
	//Only needs to call these if user is logged in
	getMainCategories()
	search()
}

//Computed
const searchHits = computed<string>(() =>
	items.value.length == 1 ? `1 resultat` : `${items.value.length} resultater`
)

//Watchers
watch(sortChosen, () => {
	searchAndResetItems()
})

watch(activeSelected, () => {
	searchAndResetItems()
})

async function getMainCategories() {
	status.value = 'loading'
	try {
		const res = await axios.get('/category/main')
		const data: Category[] = res.data
		tagAlts.value = data
		status.value = 'loaded'
	} catch (error: any) {
		status.value = 'error'
		store.dispatch('error', error.message)
	}
}

async function search() {
	if (!store.state.user) return
	status.value = 'loading'

	let sortChosenString: string
	/*
  	{ id: 0, alt: 'Ingen sortering' },
	{ id: 1, alt: 'Pris lav-høy' },
	{ id: 2, alt: 'Pris høy-lav' },
	{ id: 3, alt: 'Nærmest' },
	{ id: 4, alt: 'Nyeste først' },
	{ id: 5, alt: 'Eldste først' },
	*/
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
		const params: GetItemSearchRequest = {
			categories: chosenCategoriesIds.slice(-1),
			sort: sortChosenString,
			amount: amountPerPage,
			offset: currentPage.value,
			userId: store.state.user.userId,
			loan: false,
			active: activeSelected.value,
			useAuth: true,
		}
		const res = await axios.get('/item/search/' + searchWord.value.trim(), {
			params,
			paramsSerializer: params => {
				return qs.stringify(params, { arrayFormat: 'repeat' })
			},
		})
		const data: Item[] = res.data
		console.log(data)
		if (data.length > 0) items.value = items.value.concat(data)
		if (data.length < amountPerPage) renderLoadButton.value = false

		status.value = 'loaded'
	} catch (error: any) {
		status.value = 'error'
		store.dispatch('error', error.message)
		items.value = []
	}
}
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
		status.value = 'error'
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

const seenHomeCookie = ('; ' + document.cookie)
	.split(`; seenMyItemsTutorial=`)
	.pop()
	.split(';')[0]

if (!seenHomeCookie.includes('true')) {
	store.dispatch(
		'info',
		"Dette er siden for dine egne gjenstander. Her kan du se alle gjenstandene du har opprettet. Klikk på 'Plus' ikonet for å opprette en ny gjenstand. Du kan også sortere på arkiverte og aktive gjenstander. Klikk X knappen for å lukke denne meldingen."
	)
	const seenHomeTutorial = (document.cookie =
		'seenMyItemsTutorial=true; max-age=31536000')
}

const showCategoryPicker = ref(false)
</script>

<template>
	<div v-if="store.getters.loggedIn">
		<div class="grid gap-2">
			<!--Tag input component-->
			<SearchbarAndButton
				v-model="searchWord"
				@search-and-reset="searchAndResetItems"
			></SearchbarAndButton>

			<div v-if="showCategoryPicker" class="grid gap-2">
				<CategoryList
					color="bg-slate-500"
					v-if="chosenCategories.length > 0"
					v-model="chosenCategories"
					class="py-1"
					:removable="true"
					@remove-category-event="categoryRemoved"
					data-testid="categories-tag-chosen"
				></CategoryList>

				<CategoryList
					color="bg-blue-500"
					class=""
					v-model="tagAlts"
					@add-category-event="categoryChosen"
					data-testid="categories-tag-alts"
				></CategoryList>
			</div>

			<div class="flex">
				<div class="flex">
					<label>Aktive</label>
					<input
						class="h-8 w-8"
						type="checkbox"
						v-model="activeSelected"
					/>
				</div>

				<button @click="showCategoryPicker = !showCategoryPicker">
					Categories
				</button>
			</div>
		</div>

		<LoadingIndicator v-if="status === 'loading'" />
		<ItemList
			v-if="items.length > 0"
			:items="items"
			:searchHits="searchHits"
			:renderLoadButton="renderLoadButton"
			redirect="my-item"
			@load-more-items="loadMoreItems"
		/>

		<h3 v-else class="text-slate-400 w-fit mx-auto mt-28">
			Du har ingen gjenstander
		</h3>

		<SortDropdown :sortAlts="sortAlts" v-model.number="sortChosen" />

		<FloatingBtn to="/item/register" />
	</div>
</template>

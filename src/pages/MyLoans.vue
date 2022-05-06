<script setup lang="ts">
import axios from 'axios'
import { ref, computed, watch } from 'vue'
import CategoryList from '../components/CategoryList.vue'
import SearchbarAndButton from '../components/SearchbarAndButton.vue'
import qs from 'qs'
import ItemList from '../components/ItemList.vue'
import SortDropdown from '../components/SortDropdown.vue'
import { store } from '../store'
import LoadingIndicator from '../components/base/LoadingIndicator.vue'
import BaseBanner from '../components/base/BaseBanner.vue'
import { GetItemSearchRequest } from '../api/item/search'
import { Alternative, Category, Item } from '../api/schema'
import { AdjustmentsIcon } from '@heroicons/vue/solid'
import { useRouter } from 'vue-router'
import { GetLoanItemRequest, GetLoanItemResponse } from '../api/loan/item'

//Variables
let sortChosen = ref(0)
let sortAlts: Alternative[] = [
	{ id: 0, alt: 'Ingen sortering' },
	{ id: 1, alt: 'Pris lav-høy' },
	{ id: 2, alt: 'Pris høy-lav' },
	//{ id: 3, alt: 'Nærmest' },
	{ id: 4, alt: 'Nyeste først' },
	{ id: 5, alt: 'Eldste først' },
	{ id: 6, alt: 'Tidligste startdato' },
	{ id: 7, alt: 'Seneste startdato' },
	{ id: 8, alt: 'Tidligste sluttdato' },
	{ id: 9, alt: 'Seneste sluttdato' },
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
	{ id: 6, alt: 'Tidligste startdato' },
	{ id: 7, alt: 'Seneste startdato' },
	{ id: 8, alt: 'Tidligste sluttdato' },
	{ id: 9, alt: 'Seneste sluttdato' },
	*/
	switch (sortChosen.value) {
		case 0: {
			sortChosenString = 'loan-none'
			break
		}
		case 1: {
			sortChosenString = 'loan-price-ascending'
			break
		}
		case 2: {
			sortChosenString = 'loan-price-descending'
			break
		}
		case 3: {
			sortChosenString = 'closest'
			break
		}
		case 4: {
			sortChosenString = 'loan-newest'
			break
		}
		case 5: {
			sortChosenString = 'loan-none'
			break
		}
		case 6: {
			sortChosenString = 'loan-start-ascending'
			break
		}
		case 7: {
			sortChosenString = 'loan-start-descending'
			break
		}
		case 8: {
			sortChosenString = 'loan-end-ascending'
			break
		}
		case 9: {
			sortChosenString = 'loan-end-descending'
			break
		}
		default: {
			sortChosenString = 'loan-none'
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
			loan: true,
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
const router = useRouter()
async function properRedirect(item: Item, index: number) {
	let occurence = 0
	for (let i = 0; i < items.value.length; i++) {
		if (i >= index) break
		if (items.value[i].itemId === item.itemId) occurence++
	}

	let sortChosenString: string
	switch (sortChosen.value) {
		case 0: {
			sortChosenString = 'loan-none'
			break
		}
		case 1: {
			sortChosenString = 'loan-price-ascending'
			break
		}
		case 2: {
			sortChosenString = 'loan-price-descending'
			break
		}
		case 3: {
			sortChosenString = 'closest'
			break
		}
		case 4: {
			sortChosenString = 'loan-newest'
			break
		}
		case 5: {
			sortChosenString = 'loan-none'
			break
		}
		case 6: {
			sortChosenString = 'loan-start-ascending'
			break
		}
		case 7: {
			sortChosenString = 'loan-start-descending'
			break
		}
		case 8: {
			sortChosenString = 'loan-end-ascending'
			break
		}
		case 9: {
			sortChosenString = 'loan-end-descending'
			break
		}
		default: {
			sortChosenString = 'loan-none'
			break
		}
	}

	//get loan id
	//push with router
	status.value = 'loading'
	try {
		const params: GetLoanItemRequest = {
			itemId: item.itemId,
			index: occurence,
			active: activeSelected.value,
			sort: sortChosenString,
		}
		const res = await axios.get('/loan/item/', { params })
		status.value = 'loaded'

		router.push('/my-loan/' + (res.data as GetLoanItemResponse))
	} catch (error: any) {
		status.value = 'error'
		store.dispatch('error', error.message)
	}
}
function cookie() {
	const seenMyLoansCookie = ('; ' + document.cookie)
		.split(`; seenMyLoansTutorial=`)
		.pop()
		?.split(';')[0]

	if (!seenMyLoansCookie?.includes('true')) {
		store.dispatch(
			'info',
			'Dette er siden for dine lån. Alle aktive og tidligere lån vil vises her. Klikk X knappen for å lukke denne meldingen.'
		)
		document.cookie = 'seenMyLoansTutorial=true; max-age=31536000'
	}
}
cookie()

const showFiltersAndSort = ref(false)
</script>

<template>
	<div v-if="store.getters.loggedIn" class="grid gap-4">
		<div class="flex items-center gap-4">
			<AdjustmentsIcon
				class="w-8 h-8 text-slate-600 cursor-pointer"
				@click="showFiltersAndSort = !showFiltersAndSort"
			/>
			<SearchbarAndButton
				v-model="searchWord"
				@search="searchAndResetItems"
			></SearchbarAndButton>
		</div>

		<div class="grid gap-4" v-if="showFiltersAndSort">
			<!--Tag input component-->
			<CategoryList
				color="bg-slate-500"
				v-if="chosenCategories.length > 0"
				v-model="chosenCategories"
				:removable="true"
				@remove-category-event="categoryRemoved"
				data-testid="categories-tag-chosen"
			></CategoryList>
			<CategoryList
				color="bg-blue-500"
				class="mt-1"
				v-model="tagAlts"
				@add-category-event="categoryChosen"
				data-testid="categories-tag-alts"
			></CategoryList>
			<div class="flex gap-4 items-center">
				<SortDropdown
					:sortAlts="sortAlts"
					v-model.number="sortChosen"
				/>

				<h3>Aktiv</h3>
				<input
					class="h-8 w-8"
					type="checkbox"
					v-model="activeSelected"
				/>
			</div>
		</div>

		<LoadingIndicator v-if="status === 'loading'" />
		<ItemList
			v-if="items.length > 0"
			:items="items"
			:searchHits="searchHits"
			:renderLoadButton="renderLoadButton"
			redirect="my-loan"
			@load-more-items="loadMoreItems"
		/>
		<h2
			v-else-if="activeSelected"
			class="text-slate-600 w-fit mx-auto mt-28"
		>
			Du har ingen aktive lån
		</h2>
		<h2 v-else class="text-slate-600 w-fit mx-auto mt-28">
			Du har ingen tidligere lån
		</h2>
	</div>
</template>

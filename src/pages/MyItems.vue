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

//Enums
enum State {
	ACTIVE = 'Active',
	ARCHIVED = 'Archived',
}

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

const stateTag = ref<State>(State.ACTIVE)

type Status = 'loading' | 'loaded' | 'error'
const status = ref<Status>()
const errorMessage = ref()
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
watch(stateTag, () => {
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
		const res = await axios.get('/item/search/' + searchWord.value.trim(), {
			params: {
				categories: chosenCategoriesIds[chosenCategoriesIds.length - 1],
				sort: sortChosenString,
				amount: amountPerPage,
				offset: currentPage.value,
				userId: store.state.user.userId,
				loan: false,
				active: stateTag.value === State.ACTIVE,
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
</script>

<template>
	<BaseBanner
		v-if="status === 'error'"
		type="error"
		:message="errorMessage"
	/>
	<div v-if="!store.getters.loggedIn">
		<p>Du må være logget inn for å se denne siden</p>
	</div>
	<div v-if="store.getters.loggedIn">
		<div class="grid gap-4">
			<div class="flex gap-4">
				<button
					:class="
						stateTag === tag
							? 'bg-blue-500 text-white'
							: 'bg-slate-300 text-slate-900'
					"
					@click="stateTag = tag"
					v-for="tag in State"
				>
					{{ tag }}
				</button>
			</div>
			<SearchbarAndButton
				v-model="searchWord"
				@search-and-reset="searchAndResetItems"
			></SearchbarAndButton>
		</div>

		<div class="py-10">
			<!--Tag input component-->
			<h2>Kategorier</h2>
			<CategoryList
				v-model="chosenCategories"
				:removable="true"
				@remove-category-event="categoryRemoved"
				data-testid="categories-tag-chosen"
				class="border-solid bg-slate-500 rounded"
			></CategoryList>
			<CategoryList
				v-model="tagAlts"
				@add-category-event="categoryChosen"
				data-testid="categories-tag-alts"
			></CategoryList>
		</div>
		<LoadingIndicator v-if="status === 'loading'" />
		<ItemList
			:items="items"
			:searchHits="searchHits"
			:renderLoadButton="renderLoadButton"
			redirect="my-item"
			@load-more-items="loadMoreItems"
		>
		</ItemList>

		<SortDropdown :sortAlts="sortAlts" v-model.number="sortChosen">
		</SortDropdown>

		<FloatingBtn to="/item/register" />
	</div>
</template>

<script setup lang="ts">
import axios from 'axios'
import { ref, computed, watch } from 'vue'
import TagList from '../components/TagList.vue'
import SearchbarAndButton from '../components/SearchbarAndButton.vue'
import qs from 'qs'
import ItemList from '../components/ItemList.vue'
import SortDropdown from '../components/SortDropdown.vue'
import { store } from '../store'
import FloatingBtn from '../components/base/FloatingBtn.vue'
import { userInfo } from 'os'
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup

//Enums
enum Status {
	ACTIVE = 'Active',
	ARCHIVED = 'Archived',
}

//Interfaces
interface Category {
	categoryId: number
	categoryName: string
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
	//{ id: 3, alt: 'Nærmest' },
	{ id: 4, alt: 'Nyeste først' },
	{ id: 5, alt: 'Eldste først' },
]

let searchWord = ref<string>('')
let tagAlts = ref<Array<Category>>([])
let chosenTags = ref<Array<Category>>([])
let items = ref<Array<Item>>([])

let currentPage = ref<number>(0)
const amountPerPage: number = 20
let renderLoadButton = ref<boolean>(true)

const statusTag = ref<Status>(Status.ACTIVE)
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
watch(statusTag, () => {
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
	if (!store.state.user) return

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

	let chosenTagsIds: Array<number> = []
	chosenTags.value.forEach(tag => {
		chosenTagsIds.push(tag.categoryId)
	})

	axios
		.get('/item/search/' + searchWord.value.trim(), {
			params: {
				categories: chosenTagsIds[chosenTagsIds.length - 1],
				sort: sortChosenString,
				amount: amountPerPage,
				offset: currentPage.value,
				userId: store.state.user.id,
				loan: false,
				active: statusTag.value === Status.ACTIVE,
			},
			paramsSerializer: params => {
				return qs.stringify(params, { arrayFormat: 'repeat' })
			},
		})
		.then(response => {
			let responseData: Item[] = response.data
			if (
				Array.isArray(responseData) &&
				responseData.length > 0 &&
				isAnItem(responseData[0])
			)
				items.value = items.value.concat(responseData)
			if (responseData.length < amountPerPage)
				renderLoadButton.value = false
		})
		.catch(error => {
			//TODO error handling, tell user something went wrong
			items.value = []
			console.log(error.message)
		})
}
function searchAndResetItems() {
	currentPage.value = 0
	items.value = []
	search()
}
function categoryChosen(tag: Category) {
	chosenTags.value.push(tag)
	searchAndResetItems()
	axios
		.get('category/sub?categoryId=' + tag.categoryId)
		.then(response => {
			tagAlts.value = response.data
		})
		.catch(error => {
			console.log(error)
		})
}
function categoryRemoved(tag: Category) {
	chosenTags.value.forEach((value, index) => {
		if (value.categoryId == tag.categoryId)
			chosenTags.value.splice(index, chosenTags.value.length - index)
	})
	searchAndResetItems()
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
	<div>
		<div v-if="!store.getters.loggedIn">
			<p>Du må være logget inn for å se denne siden</p>
		</div>
		<div v-if="store.getters.loggedIn">
			<div class="grid gap-4">
				<div class="flex gap-4">
					<button
						class="px-2 py-1 rounded-lg"
						:class="
							statusTag === tag
								? 'bg-blue text-white'
								: 'bg-slate-300 text-slate-900'
						"
						@click="statusTag = tag"
						v-for="tag in Status"
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
				<h2 class="text-2xl font-semibold">Kategorier</h2>
				<TagList
					v-model="chosenTags"
					:removable="true"
					@remove-tag-event="categoryRemoved"
					data-testid="categories-tag-chosen"
					class="border-solid bg-gray-500 rounded"
				></TagList>
				<TagList
					v-model="tagAlts"
					@add-tag-event="categoryChosen"
					data-testid="categories-tag-alts"
				></TagList>
			</div>

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
	</div>
</template>

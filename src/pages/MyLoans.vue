<script setup lang="ts">
import axios from 'axios'
import { onMounted, ref, computed, watch } from 'vue'
import TagList from '../components/TagList.vue'
import SearchbarAndButton from '../components/SearchbarAndButton.vue'
import qs from 'qs'
import ItemList from '../components/ItemList.vue'
import SortDropdown from '../components/SortDropdown.vue'
import { store } from '../store'

/*import { computed, ref } from 'vue'
import Card from '../components/Card.vue'
import BaseInput from '../components/base/BaseInput.vue'*/
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup

/*interface Filter {
	name: string
	value: string
}

interface Position {
	lat: number
	lng: number
}

interface Item {
	name: string
	description: string
	price: string
	priceUnit: string
	postalCode: string
	address: string
	position: Position
	images: string[]
	startDate: string
	endDate: string
	categories: string[]
	filters: Filter[]
}*/

/*interface LoanedItem {
	id: number
	name: string
	image: string
	loanStartDate: string
	loanEndDate: string
	price: string
	priceUnit: string
	status: 'Active' | 'Archived'
}

const items = ref<LoanedItem[]>([
	{
		id: 123,
		name: 'Epic stol',
		loanStartDate: '2022-04-20T18:00:00',
		loanEndDate: '2022-06-20T18:00:00',
		image: 'data:image/jpeg;base64,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',
		price: '100',
		priceUnit: 'dag',
		status: 'Active',
	},
	{
		id: 123,
		name: 'Epic stol',
		loanStartDate: '2022-04-20T18:00:00',
		loanEndDate: '2022-06-20T18:00:00',
		image: 'data:image/jpeg;base64,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',
		price: '100',
		priceUnit: 'dag',
		status: 'Active',
	},
	{
		id: 123,
		name: 'Epic stol',
		loanStartDate: '2022-04-20T18:00:00',
		loanEndDate: '2022-06-20T18:00:00',
		image: 'data:image/jpeg;base64,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',
		price: '100',
		priceUnit: 'dag',
		status: 'Active',
	},
	{
		id: 123,
		name: 'Amazing stol',
		loanStartDate: '2022-04-20T18:00:00',
		loanEndDate: '2022-06-20T18:00:00',
		image: 'data:image/jpeg;base64,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',
		price: '100',
		priceUnit: 'dag',
		status: 'Archived',
	},
])*/

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
	{ id: 6, alt: 'Tidligste startdato' },
	{ id: 7, alt: 'Seneste startdato' },
	{ id: 8, alt: 'Tidligste sluttdato' },
	{ id: 9, alt: 'Seneste sluttdato' },
]

let searchWord = ref<string>('')
let tagAlts = ref<Array<Category>>([])
let chosenTags = ref<Array<Category>>([])
let items = ref<Array<Item>>([])

let currentPage = ref<number>(0)

const statusTag = ref<Status>(Status.ACTIVE)
//const search = ref('')

//Mounted
onMounted(() => {
	if (store.getters.loggedIn) {
		//Only needs to call these if user is logged in
		getMainCategories()
		search()
	}
})

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
	//if(store.getters.loggedIn) { //TODO might be 'store.getters.loggedIn()'
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

	let chosenTagsIds: Array<number> = []
	chosenTags.value.forEach(tag => {
		chosenTagsIds.push(tag.categoryId)
	})

	axios
		.get('/item/search/' + searchWord.value.trim(), {
			params: {
				categories: chosenTagsIds[chosenTagsIds.length - 1],
				sort: sortChosenString,
				amount: 20,
				offset: currentPage.value,
				userId: store.state.user.id,
				loan: true,
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
		})
		.catch(error => {
			//TODO error handling, tell user something went wrong
			items.value = []
			console.log(error.message)
		})
	//}
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
	<h1 class="text-4xl font-bold">Mine lån</h1>
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
			redirect="my-loan"
			@load-more-items="loadMoreItems"
		>
		</ItemList>

		<SortDropdown :sortAlts="sortAlts" v-model.number="sortChosen">
		</SortDropdown>
	</div>
</template>

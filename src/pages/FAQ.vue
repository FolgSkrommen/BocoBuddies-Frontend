<script setup lang="ts">
import { ref } from 'vue'
import BaseBtn from '../components/base/BaseBtn.vue'
const counter = ref(0)

interface Section {
	name: string
	questions: Question[]
}

interface Question {
	header: string
	paragraph: string
}

const questions: Section[] = [
	{
		name: 'Innlogging',
		questions: [
			{
				header: 'Hvorfor kan jeg ikke logge inn?',
				paragraph:
					'Dobbeltsjekk at du bruker riktig brukernavn og passord kombinasjon',
			},
			{
				header: 'Hvordan registrer jeg meg selv?',
				paragraph:
					'	Trykk på “Har du ikke bruker? Klikk her!” under påloggingsknappen på innloggingsiden',
			},
			{
				header: 'Hvorfor fungerer ingen av funskjonaliteten?',
				paragraph:
					'Sjekk at du er logget inn, dersom du er logget inn dobbelt sjekk at du har verfisert brukeren din via email lenken.&nbsp;',
			},
			{
				header: 'Jeg har ikke fått verfiserings mail?',
				paragraph:
					'Klikk på send ny verifiserings mail på profilsiden din',
			},
		],
	},
	{
		name: 'Gjenstander',
		questions: [
			{
				header: 'Hvordan låner jeg en gjenstand?',
				paragraph:
					'	Gå til søk-siden, finn gjenstanden du vil låne, trykk deg inn på den og klikk på "Send melding". <br>' +
					'Nå er du i en samtale med utleier, og du har mulighet til å forespørre et lån. Trykk på "Forespør", fyll ut perioden du ønsker å låne og	eventuelt foreslå en ny pris. Trykk på avtal lån <br>' +
					'	Da gjenstår det bare å vente på utleiers svar!',
			},
			{
				header: 'Hva skjer når utleier bekrefter et lån?',
				paragraph:
					'Da må dere avtale dere i mellom hva som skal gjøres videre i chatten, enten det er relatert til henting/sending av den lånte gjenstanden eller noe helt annet.',
			},
			{
				header: 'Kan jeg avslyse et lån før det faktisk settes i gang?',
				paragraph:
					'Det kan du, men det må senest skje 24t før avtalt leiestart. Dette gjøres ved å si ifra til utleier i den aktuelle chatten.',
			},
			{
				header: 'Hvordan lager jeg en gjenstand?',
				paragraph: 'Klikk på pluss ikonet under dine gjenstander',
			},
			{
				header: 'Hva koster det å annonsere?',
				paragraph: 'Det er helt gratis!!! For nå 😊',
			},
			{
				header: 'Hvordan kan jeg endre på en annonse?',
				paragraph: 'Klikk på “endre” under annonsen det gjelder',
			},
			{
				header: 'Hvordan sletter jeg en annonse/gjenstand?',
				paragraph: 'Klikk på annonsen din og bla ned til slett knappen',
			},
		],
	},
	{
		name: 'Community',
		questions: [
			{
				header: 'Hvordan legger jeg til venner?',
				paragraph:
					'Klikk på pluss knappen under vennefanen. Søk deretter på brukernavnet til den du vil legge til',
			},
			{
				header: 'Hvordan kan jeg sende chatter?',
				paragraph:
					'Du kan enten opprette chatter med venner. Da er	det bare å klikke pluss ikonet under chatter og velge hvem du vil chatte med. Du kan også opprette samtaler med utleiere. Da er det bare å klikke på send melding under en annonse',
			},
		],
	},
	{
		name: 'Kontakt oss',
		questions: [
			{
				header: 'Dersom du har spørsmål bare ta å sving oss en mail på:',
				paragraph: 'yourbocobuddy@gmail.com',
			},
		],
	},
]
</script>

<template>
	<div>
		<div>
			<div class="max-w-xl mr-auto ml-auto text-slate-700">
				<div class="flex flex-col mb-16">
					<div class="mb-6">
						<p
							class="items-center justify-center rounded-full flex text-2xl h-28 mr-auto ml-auto w-28 bg-slate-200 text-blue-600"
						>
							<img class="rounded-full" src="/logo.png" alt="" />
						</p>
					</div>
					<div
						class="max-w-lg font-sans text-slate-900 mr-auto mb-6 ml-auto pb-0"
					>
						<div class="">
							<p class="relative inline-block text-2xl ml-0">
								<svg
									viewbox="0 0 52 24"
									fill="currentColor"
									class="absolute top-0 left-0 z-0 hidden w-32 -mt-8 -ml-20 text-slate-300"
								>
									<defs>
										<pattern
											id="34f481be-159a-4846-821d-9ca19fb6bcc5"
											x="0"
											y="0"
											width=".135"
											height=".30"
										>
											<circle cx="1" cy="1" r=".7" />
										</pattern>
									</defs>
									<rect
										fill="url(#34f481be-159a-4846-821d-9ca19fb6bcc5)"
										width="52"
										height="24"
									/>
								</svg>
							</p>
							<h1>FAQ</h1>
						</div>
						<p
							class="font-sans inline font-bold text-3xl tracking-tight mb-0 ml-0"
						></p>
					</div>
					<p>
						Her kan du finne svar på alle mulige spørsmål du kunne
						finne på å stille
					</p>
				</div>

				<div v-for="section in questions" class="grid gap-2 my-5">
					<h1>{{ section.name }}</h1>
					<div
						v-for="question in section.questions"
						class="border rounded-xl shadow-sm p-4 grid gap-2"
					>
						<h3>{{ question.header }}</h3>
						<p>{{ question.paragraph }}</p>
					</div>
				</div>
				<BaseBtn class="w-full" to="/contact">Kontaktskjema</BaseBtn>
			</div>
		</div>
	</div>
</template>

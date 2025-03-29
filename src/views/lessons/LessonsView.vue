<template>
	<h1>Lessons</h1>
	<v-divider></v-divider>
	<v-spacer class="py-1"></v-spacer>

	<v-row class="fill-height">
		<v-col
			v-for="lesson in lessons"
			:key="lesson"
			class="d-flex"
			cols="12"
			sm="6"
			md="5"
			lg="4"
			xl="3"
			xxl="2"
		>
			<v-card class="flex-grow-1" @click="openLessonDialog(lesson)">
				<v-card-item>
					<v-card-title>
						<v-row no-gutters>
							<v-col cols="8" class="d-flex">
								{{ lesson.title }}
							</v-col>
							<v-col cols="4" class="d-flex justify-end text-subtitle-1">
								{{ formatDate(lesson.lesson_date) }}
							</v-col>
						</v-row>
					</v-card-title>

					<v-card-subtitle class="text-subtitle-1">
						{{ lesson.coach.name }}
					</v-card-subtitle>
					<v-divider></v-divider>
					<v-card-subtitle>
						{{ lesson.student1.name }}
						{{ lesson.student2 ? `& ${lesson.student2.name}` : "" }}
					</v-card-subtitle>
				</v-card-item>
			</v-card>
		</v-col>
	</v-row>

	<v-dialog v-model="lessonDialog" max-width="600px">
		<v-card v-if="selectedLesson">
			<v-card-title>
				<v-row no-gutters>
					<v-col cols="8" class="d-flex">
						{{ selectedLesson.title }}
					</v-col>
					<v-col cols="4" class="d-flex justify-end text-subtitle-1">
						{{ formatDate(selectedLesson.lesson_date) }}
					</v-col>
				</v-row>
			</v-card-title>

			<v-card-subtitle class="text-subtitle-1">
				{{ selectedLesson.coach.name }} | {{ selectedLesson.dance_style }}
				{{ selectedLesson.dance }}
			</v-card-subtitle>
			<v-divider class="py-1"></v-divider>
			<v-card-subtitle>
				{{ selectedLesson.student1.name }}
				{{ selectedLesson.student2 ? `& ${selectedLesson.student2.name}` : "" }}
			</v-card-subtitle>
			<v-card-text>
				{{ selectedLesson.notes }}
			</v-card-text>
			<div v-if="selectedLesson.video" class="video-container">
				<video
					controls
					class="lesson-video"
					:src="selectedLesson.video"
					alt="`${selectedLesson.title} Lesson Video`"
				></video>
			</div>

			<v-card-actions>
				<v-btn
					round
					@click="openEditLessonDialog(selectedLesson)"
					icon="mdi-pencil"
					color="warning"
					border
				></v-btn>
				<v-spacer></v-spacer>
				<v-btn color="primary" @click="lessonDialog = false" border>
					Close
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>
<script src="./LessonsView.ts"></script>
<style src="./LessonsView.scss"></style>

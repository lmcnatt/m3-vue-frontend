<template>
	<v-row>
		<v-col class="d-flex justify-start">
			<h1>Lessons</h1>
		</v-col>
		<v-col class="d-flex justify-end">
			<v-btn
				color="primary"
				@click="openCreateLessonDialog"
				prepend-icon="mdi-plus"
			>
				New Lesson
			</v-btn>
		</v-col>
	</v-row>
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
				{{ selectedLesson.coach.name }} | {{ selectedLesson.dance.dance }}
			</v-card-subtitle>
			<v-divider class="py-1"></v-divider>
			<v-card-subtitle>
				{{ selectedLesson.student1.name }}
				{{ selectedLesson.student2 ? `& ${selectedLesson.student2.name}` : "" }}
			</v-card-subtitle>
			<v-card-text>
				{{ selectedLesson.notes }}
			</v-card-text>
			<!-- <div v-if="selectedLesson.video" class="video-container">
				<video
					controls
					class="lesson-video"
					:src="selectedLesson.video"
					alt="`${selectedLesson.title} Lesson Video`"
				></video>
			</div> -->

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

	<v-dialog v-model="createLessonDialog" max-width="600px">
		<v-card>
			<v-card-title>Create Lesson</v-card-title>
			<v-card-text>
				<v-form>
					<v-row>
						<v-col cols="12" sm="6" md="4">
							<v-text-field
								v-model="newLesson.title"
								label="Title"
								required
							></v-text-field>
						</v-col>
						<v-col cols="12" sm="6" md="4">
							<v-select
								label="Dance"
								v-model="newLesson.dance_id"
								:items="dances"
								item-title="dance"
								item-value="id"
								required
							></v-select>
						</v-col>
						<v-col cols="12" sm="6" md="4">
							<v-text-field
								v-model="newLesson.lesson_date"
								label="Date"
								type="date"
								required
							></v-text-field>
						</v-col>
						<v-col cols="12" sm="6" md="4">
							<v-select
								v-model="newLesson.coach_id"
								:items="coaches"
								item-title="name"
								item-value="id"
								label="Coach"
								required
							></v-select>
						</v-col>
						<v-col cols="12" sm="6" md="4">
							<v-select
								v-model="newLesson.student2_id"
								:items="students"
								item-title="name"
								item-value="id"
								label="Partner"
							></v-select>
						</v-col>
						<v-col cols="12" sm="6" md="4">
							<v-file-input
								accept="video/*"
								@change="onNewLessonVideoChange"
								label="Video"
							></v-file-input>
						</v-col>
						<v-col cols="12">
							<v-textarea
								v-model="newLesson.notes"
								label="Notes"
								required
							></v-textarea>
						</v-col>
					</v-row>
				</v-form>

				<v-alert v-if="newLessonErrorMessage" type="error">
					{{ newLessonErrorMessage }}
				</v-alert>
			</v-card-text>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn
					color="primary"
					:disabled="newLessonErrorMessage"
					variant="text"
					@click="createLesson"
					border
				>
					Create
				</v-btn>
				<v-btn
					color="error"
					:disabled="newLessonErrorMessage"
					variant="text"
					@click="closeCreateLessonDialog()"
					border
				>
					Close
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>
<script src="./LessonsView.ts"></script>
<style src="./LessonsView.scss"></style>

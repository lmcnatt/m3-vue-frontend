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
				{{ selectedLesson.coach.name }} |
				{{ selectedLesson.dance_style?.style }}
				{{ selectedLesson.dance?.dance }}
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

	<!-- Edit Lesson Dialog -->
	<v-dialog v-model="editLessonDialog" max-width="700px">
		<v-card v-if="editingLesson">
			<v-card-title>Edit Lesson</v-card-title>
			<v-card-text>
				<v-form ref="editLessonForm">
					<v-row>
						<v-col cols="12" md="6">
							<v-text-field
								v-model="editingLesson.title"
								label="Title"
								required
							></v-text-field>
						</v-col>
						<v-col cols="12" md="6">
							<v-text-field
								v-model="editingLesson.lesson_date"
								label="Lesson Date"
								type="date"
								required
							></v-text-field>
						</v-col>
					</v-row>
					<v-row>
						<v-col cols="12" md="6">
							<v-select
								v-model="editingLesson.dance_style_id"
								:items="danceStyles"
								item-title="style"
								item-value="id"
								label="Dance Style"
								required
								@update:model-value="onDanceStyleChange"
							></v-select>
						</v-col>
						<v-col cols="12" md="6">
							<v-select
								v-model="editingLesson.dance_id"
								:items="availableDances"
								item-title="dance"
								item-value="id"
								label="Dance"
								required
								:disabled="!editingLesson.dance_style_id"
							></v-select>
						</v-col>
					</v-row>
					<v-row>
						<v-col cols="12" md="6">
							<v-autocomplete
								v-model="editingLesson.coach_id"
								:items="allUsers"
								item-title="name"
								item-value="id"
								label="Coach"
								required
							></v-autocomplete>
						</v-col>
						<v-col cols="12" md="6">
							<v-autocomplete
								v-model="editingLesson.student2_id"
								:items="allUsers"
								item-title="name"
								item-value="id"
								label="Partner (optional)"
								clearable
							></v-autocomplete>
						</v-col>
					</v-row>
					<v-row>
						<v-col cols="12">
							<v-textarea
								v-model="editingLesson.notes"
								label="Notes"
								auto-grow
								rows="3"
							></v-textarea>
						</v-col>
					</v-row>
					<v-row>
						<v-col cols="12">
							<v-card class="mx-auto" min-width="300" rounded="0">
								<div v-if="editingLesson.video" class="video-container mb-3">
									<video
										controls
										class="lesson-video"
										:src="editingLesson.video"
										alt="Lesson Video"
									></video>
								</div>
								<v-file-input
									accept="video/*"
									:loading="isUploadingVideo"
									:disabled="isUploadingVideo"
									@change="onVideoChange"
									label="Change Lesson Video"
								></v-file-input>
							</v-card>
						</v-col>
					</v-row>
				</v-form>
			</v-card-text>
			<v-card-actions>
				<v-btn
					color="error"
					@click="removeVideo"
					:disabled="!editingLesson.video || isUploadingVideo"
					>Remove Video</v-btn
				>
				<v-spacer></v-spacer>
				<v-btn variant="text" @click="cancelEditLesson">Cancel</v-btn>
				<v-btn
					color="primary"
					@click="saveLesson"
					:loading="isSavingLesson"
					:disabled="isSavingLesson"
					>Save</v-btn
				>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>
<script src="./LessonsView.ts"></script>
<style src="./LessonsView.scss"></style>

<template>
	<div class="login-page-content">
		<div class="login-box">
			<h1 class="logo-area">Login</h1>
			<div class="input-container">
				<v-form v-model="isFormValid">
					<div class="input-container">
						<v-text-field
							v-model="email"
							label="Email"
							:rules="emailRules"
							hide-details="auto"
						></v-text-field>

						<v-text-field
							v-model="password"
							label="Password"
							type="password"
							:rules="passwordRules"
							hide-details="auto"
							@keyup.enter="submitLogin()"
						></v-text-field>

						<v-alert
							v-if="errorMsg !== ''"
							:type="alertType"
							@click="errorMsg = ''"
							>{{ errorMsg }}</v-alert
						>
					</div>
				</v-form>

				<div class="button-container">
					<v-btn
						v-if="!isAuthenticated"
						:loading="isLoading"
						:disabled="!isFormValid"
						@click="submitLogin()"
					>
						Login Here
						<div></div>
						<div></div>
					</v-btn>
					<v-btn @click="dialog = true"> Forgot Password </v-btn>
					<v-dialog v-model="dialog" :scrim="false" persistent>
						<v-card>
							<v-card-text>
								<v-text-field
									v-model="email"
									label="Password Reset Email"
									:rules="emailRules"
									hide-details="auto"
								></v-text-field>
							</v-card-text>
							<v-card-actions>
								<v-btn variant="text" @click="dialog = false"> Close </v-btn>
								<v-btn variant="text"> Submit </v-btn>
							</v-card-actions>
						</v-card>
					</v-dialog>
				</div>
			</div>
		</div>
	</div>
</template>
<script src="./LoginView.ts" />

<style src="./LoginView.scss" />

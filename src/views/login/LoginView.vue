<template>
	<v-container class="mb-6">
		<v-row>
			<v-col justify="center">
				<v-sheet class="pa-2 ma-2">
					<v-card>
						<template v-slot:title> Login Here </template>

						<template v-slot:text>
							<v-form v-model="isFormValid">
								<div class="d-flex flex-column">
									<v-text-field
										class="pa-2"
										v-model="email"
										label="Email"
										:rules="loginRules.email"
										hide-details="auto"
									></v-text-field>

									<v-text-field
										class="pa-2"
										v-model="password"
										label="Password"
										type="password"
										:rules="loginRules.password"
										hide-details="auto"
										@keyup.enter="submitLogin()"
									/>

									<v-alert
										class="ma-2 pa-2"
										v-if="errorMsg !== ''"
										:type="alertType"
										@click="errorMsg = ''"
									>
										{{ errorMsg }}
									</v-alert>
								</div>

								<v-row>
									<v-col>
										<v-btn
											class="ma-2 pa-2"
											v-if="!isAuthenticated"
											:loading="isLoading"
											:disabled="!isFormValid"
											@click="submitLogin()"
										>
											Login
										</v-btn>
										<v-btn
											class="ma-2 pa-2"
											@click="passwordResetDialog = true"
										>
											Forgot Password
										</v-btn>
										<v-btn class="ma-2 pa-2" @click="registerDialog = true">
											Register
										</v-btn>
									</v-col>
								</v-row>
							</v-form>
						</template>
					</v-card>
				</v-sheet>
			</v-col>
		</v-row>
		<v-dialog v-model="passwordResetDialog">
			<v-form v-model="passwordResetFormIsValid">
				<v-card>
					<v-card-text>
						<v-text-field
							v-model="forgotEmail"
							label="Password Reset Email"
							:rules="forgotEmailRules.forgotEmail"
							hide-details="auto"
						></v-text-field>
					</v-card-text>
					<v-card-actions>
						<v-btn variant="text" @click="passwordResetDialog = false">
							Close
						</v-btn>
						<v-btn
							variant="text"
							:loading="submitForgotPasswordLoading"
							:disabled="!passwordResetFormIsValid"
							@click="submitForgotPassword()"
						>
							Submit
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-form>
		</v-dialog>
		<v-dialog v-model="registerDialog">
			<v-form v-model="isRegisterFormValid">
				<v-card>
					<v-card-title>
						<span class="text-h5">Register a User</span>
					</v-card-title>
					<v-card-text>
						<v-container>
							<v-row>
								<v-col cols="12" sm="6" md="4">
									<v-text-field
										label="Full name*"
										v-model="register.name"
										:rules="registerRules.name"
									></v-text-field>
								</v-col>
								<v-col cols="12">
									<v-text-field
										label="Email*"
										v-model="register.email"
										:rules="registerRules.email"
									></v-text-field>
								</v-col>
								<v-col cols="12">
									<v-text-field
										label="Password*"
										type="password"
										v-model="register.password"
										:rules="registerRules.password"
									></v-text-field>
								</v-col>
								<v-col cols="12">
									<v-text-field
										label="Password Confirmation*"
										type="password"
										v-model="register.c_password"
										:rules="registerRules.c_password"
									></v-text-field>
								</v-col>
							</v-row>
						</v-container>
						<small>* Indicates required field</small>
					</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn
							color="blue-darken-1"
							variant="text"
							@click="registerDialog = false"
						>
							Close
						</v-btn>
						<v-btn
							color="blue-darken-1"
							variant="text"
							:loading="registerFormIsLoading"
							:disabled="!isRegisterFormValid"
							@click="submitRegister()"
						>
							Save
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-form>
		</v-dialog>
	</v-container>
</template>
<script src="./LoginView.ts" type="ts" />

<style src="./LoginView.scss" type="scss" />

import React from 'react';
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContext } from '@react-navigation/native';
import HideWithKeyboard from 'react-native-hide-with-keyboard';

import { Formik } from "formik";
import * as Yup from "yup";
import * as firebase from 'firebase';

import { getTheme } from '../theme';
import Header from '../components/Header';
import Button from '../components/Button';
import StyledInput from '../components/input/StyledInput';
import SignIn from '../components/signin/SignIn';


const validationSchema = Yup.object().shape({
	name: Yup.string(),
	email: Yup.string()
		.required()
		.email("enter a valid email"),
	password: Yup.string()
		.required()
		.min(6, "choose a stronger password"),
	confirm: Yup.string().when("password", {
		is: val => val && val.length > 0,
		then: Yup.string()
			.oneOf([Yup.ref("password")], "passwords must match")
			.required()
	}),
});


export default class SignUpScreen extends React.Component {
	static contextType = NavigationContext;

	state = {
		user: null,
		accessToken: null,
		hasError: false,
		error: '',
	};

	constructor(props) {
		super(props);
		this.inputName = null;
		this.inputEmail = null;
		this.inputPassword = null;
		this.inputConfirm = null;
	}

	register({ name, email, password }) {
		alert("Name: " + name + "\nEmail: " + email + "\nPassword: " + password);

		let _this = this;
		firebase.auth().createUserWithEmailAndPassword(email, password)
			.then(data => {
				alert('Data:\n' + JSON.stringify(data, null, 2));
			})
			.catch(error => {
				let errorCode = error.code;
				let errorMessage = error.message;

				_this.setState({
					error: errorMessage + ' (' + errorCode + ')'
				});

				alert('Error: ' + _this.state.error + '\n' + JSON.stringify(error, null, 2));
			})
			.then(data => {
				alert('Data 2:\n' + JSON.stringify(data, null, 2));
			});
	}

	render() {
		const navigation = this.context;

		return (
			<SafeAreaView style={styles.container}>
				<Header title="Create an account" />

				<View style={{ flex: 1, justifyContent: 'space-evenly' }}>
					<Formik
						initialValues={{ name: '', email: '', password: '', confirm: '' }}
						validationSchema={validationSchema}
						onSubmit={(values, { setSubmitting }) => {
							//alert(JSON.stringify(values, null, 2));
							this.register(values);

							setTimeout(() => {
								setSubmitting(false);
							}, 400);
						}}
					>
						{props => (
							<View style={styles.form}>
								<StyledInput
									autoCorrect={true}
									keyboardType="default"
									autoCapitalize="words"

									placeholder="Full name"
									onChangeText={text => props.setFieldValue('name', text)}
									onBlur={() => props.setTouched('name')}
									error={props.touched.name || props.submitCount > 0 ? props.errors.name : null}

									inputRef={input => { this.inputName = input }}
									returnKeyType={"next"}
									onSubmitEditing={() => { this.inputEmail.focus() }}
									blurOnSubmit={false}

									icon="person"
									style={styles.input}
								/>

								<StyledInput
									autoCorrect={false}
									keyboardType="email-address"
									autoCapitalize="none"

									placeholder="Email"
									onChangeText={text => props.setFieldValue('email', text)}
									onBlur={() => props.setTouched('email')}
									error={props.touched.email || props.submitCount > 0 ? props.errors.email : null}

									inputRef={input => { this.inputEmail = input }}
									returnKeyType={"next"}
									onSubmitEditing={() => { this.inputPassword.focus() }}
									blurOnSubmit={false}

									icon="mail"
									style={styles.input}
								/>

								<StyledInput
									autoCorrect={false}
									secureTextEntry={true}
									autoCapitalize="none"

									placeholder="Password"
									onChangeText={text => props.setFieldValue('password', text)}
									onBlur={() => props.setTouched('password')}
									error={props.touched.password || props.submitCount > 0 ? props.errors.password : null}

									inputRef={input => { this.inputPassword = input }}
									returnKeyType={"next"}
									onSubmitEditing={() => { this.inputConfirm.focus() }}
									blurOnSubmit={false}

									icon="lock"
									style={styles.input}
								/>

								<StyledInput
									autoCorrect={false}
									secureTextEntry={true}
									autoCapitalize="none"

									placeholder="Confirm password"
									onChangeText={text => props.setFieldValue('confirm', text)}
									onBlur={() => props.setTouched('confirm')}
									error={props.touched.confirm || props.submitCount > 0 ? props.errors.confirm : null}

									inputRef={input => { this.inputConfirm = input }}
									onSubmitEditing={props.handleSubmit}

									icon="lock"
									style={styles.input}
								/>

								<Button title="SIGN UP" onPress={props.handleSubmit} disabled={props.isSubmitting} style={styles.submitButton} />

								<HideWithKeyboard>
									<SignIn />

									<TouchableOpacity onPress={() => navigation.navigate('SignIn')} style={styles.buttonRegister}>
										<Text style={styles.text}>Already have an account?</Text>
										<Text style={[styles.text, { color: colors.primary }]}>Sign in.</Text>
									</TouchableOpacity>
								</HideWithKeyboard>
							</View>
						)}
					</Formik>

				</View>
			</SafeAreaView>
		);
	}
}

const { colors } = getTheme();
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.light,
	},
	form: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'stretch',
	},
	submitButton: {
		marginTop: 10,
		marginLeft: 40,
		marginRight: 40,
		marginBottom: 10,
	},
	text: {
		color: colors.dark,
		paddingRight: 2,
		fontSize: 20,
	},
	input: {
		marginBottom: 10,
		marginLeft: 40,
		marginRight: 40,
	},
	buttonRegister: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		height: 48,
	},
});
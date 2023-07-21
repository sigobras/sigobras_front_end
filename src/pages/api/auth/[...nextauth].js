/* eslint-disable camelcase */
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { login } from '../../../services/authService';

export default NextAuth({
	providers: [
		Credentials({
			name: 'Custom Login',
			credentials: {
				username: {
					label: 'username:',
					type: 'username',
					placeholder: 'username',
				},
				password: {
					label: 'Contraseña:',
					type: 'password',
					placeholder: 'Contraseña',
				},
			},
			async authorize({ username, password }) {
				try {
					const response = await login(username, password);
					const { user_data, user_id } = response.data;
					const { nombre } = user_data;
					return {
						name: nombre,
						id: user_id,
					};
				} catch (error) {
					throw new Error('Credenciales inválidas');
				}
			},
		}),
	],
	callbacks: {
		async session({ session, token }) {
			session.user.id = token.sub;
			return session;
		},
	},
	pages: {
		signIn: '/',
		error: '/',
	},

	session: {
		maxAge: 2592000,
		strategy: 'jwt',
		updateAge: 86400,
	},
});

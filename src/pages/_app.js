import React from 'react';
import axios from 'axios';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';

import theme from '../theme';
import '../styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import { UrlServer } from '../js/components/Utils/ServerUrlConfig';
import Layout from '../components/organisms/Layout';
import store from '../redux/store';
import { SessionProvider } from 'next-auth/react';

axios.defaults.baseURL = UrlServer;

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
	return (
		<SessionProvider session={session}>
			<ThemeProvider theme={theme}>
				<Provider store={store}>
					<Layout>
						<Component {...pageProps} />
					</Layout>
				</Provider>
			</ThemeProvider>
		</SessionProvider>
	);
}

export default MyApp;

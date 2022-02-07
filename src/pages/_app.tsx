
import { SessionProvider } from 'next-auth/react';
import Header from '../components/Header';
import '../styles/global.scss';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <SessionProvider session={pageProps.session}>
        <Header />
        <Component {...pageProps} />
      </SessionProvider>
    </>
  )
}

export default MyApp

import "../apps/styles/auth.css";
import "../apps/styles/chats.css";
import "../apps/styles/index.css";

import { ContextProvider } from '../context'

export default function App({ Component, pageProps }) {
  return (
     <ContextProvider>
    <Component {...pageProps} />
    </ContextProvider>
  );
}

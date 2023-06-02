import type { AppProps } from 'next/app';
import '../styles/global.css';

import { MantineProvider } from '@mantine/core';

function App({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colors: {
          primary: ['#fdfdfd'],
          secondary: ['#181818', '#1f1f1f', 'rgba(255, 255, 255, 0.1)'],
          primaryButton: ['#7d34e7'],
          secondaryButton: ['#fdfdfd'],
          accent: ['#e534af'],
        },

        shadows: {
          md: '1px 1px 3px rgba(0, 0, 0, .25)',
          xl: '5px 5px 3px rgba(0, 0, 0, .25)',
        },

        headings: {
          fontFamily: 'Source Sans Pro, Sans-Serif',
        },
      }}
    >
      <Component {...pageProps} />
    </MantineProvider>
  );
}

export default App;

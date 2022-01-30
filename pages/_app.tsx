import { AppProps } from "next/app";
import initTwitterScriptInner from 'zenn-embed-elements/lib/init-twitter-script-inner';


import "styles/global.css" ;

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
    return (
        <>
            <Component {...pageProps} />
            <script
                dangerouslySetInnerHTML={{
                    __html: initTwitterScriptInner
                }}
            />
        </>
    );
};

export default MyApp;

import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Inter, IBM_Plex_Sans } from "@next/font/google";
import { RecoilRoot } from "recoil";

const inter = Inter({ subsets: ["latin"] });
const plex = IBM_Plex_Sans({ weight: "300", subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <main className={inter.className}>
        <Component {...pageProps} />
        <div className={plex.className} />
      </main>
    </RecoilRoot>
  );
}

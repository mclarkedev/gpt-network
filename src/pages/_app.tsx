import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Inter, IBM_Plex_Sans } from "@next/font/google";
import { RecoilRoot } from "recoil";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });
const plex = IBM_Plex_Sans({ weight: "300", subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      {process.env.NODE_ENV === "development" && (
        <Script id="show-banner" strategy="afterInteractive">
          {(function () {
            if (typeof document === "undefined") {
              return;
            }
            var script = document.createElement("script");
            script.onload = function () {
              var stats = new Stats();
              document.body.appendChild(stats.dom);
              requestAnimationFrame(function loop() {
                stats.update();
                requestAnimationFrame(loop);
              });
            };
            script.src = "//mrdoob.github.io/stats.js/build/stats.min.js";
            document.head.appendChild(script);
            return null;
          })()}
        </Script>
      )}
      <main className={inter.className}>
        <Component {...pageProps} />
        <div className={plex.className} />
      </main>
    </RecoilRoot>
  );
}

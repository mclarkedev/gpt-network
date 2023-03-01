import Script from "next/script";

declare var Stats: any;

export default function DevStats() {
  if (process.env.NODE_ENV === "development") {
    return (
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
    );
  } else {
    return null;
  }
}

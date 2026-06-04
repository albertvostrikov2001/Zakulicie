import Script from "next/script";

// Яндекс.Метрика — счётчик 109645896
// ID захардкожен как fallback: если NEXT_PUBLIC_YM_ID не задан при сборке,
// счётчик всё равно подключится.
const YM_ID = process.env.NEXT_PUBLIC_YM_ID || "109645896";

export function Analytics() {
  const ga = process.env.NEXT_PUBLIC_GA4_ID;

  return (
    <>
      <Script id="ym-init" strategy="afterInteractive">{`
        (function(m,e,t,r,i,k,a){
          m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
          m[i].l=1*new Date();
          for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
          k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
        })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js?id=${YM_ID}', 'ym');
        ym(${YM_ID}, 'init', {
          ssr: true,
          webvisor: true,
          clickmap: true,
          trackLinks: true,
          accurateTrackBounce: true
        });
      `}</Script>
      <noscript>
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://mc.yandex.ru/watch/${YM_ID}`}
            style={{ position: "absolute", left: "-9999px" }}
            alt=""
          />
        </div>
      </noscript>

      {ga ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${ga}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">{`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${ga}');
          `}</Script>
        </>
      ) : null}
    </>
  );
}

import Layout from "../components/Layout";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Analytics } from "@vercel/analytics/react";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Layout
        isTopPage={pageProps.isTopPage}
        allTags={pageProps.allTags}
        latestPosts={pageProps.latestPosts}
        allPosts={pageProps.allPosts}
        hideLayout={pageProps.hideLayout}
      >
        <Component {...pageProps} />
      </Layout>
      <Analytics />
    </>
  );
}

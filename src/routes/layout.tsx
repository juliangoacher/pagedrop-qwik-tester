import { component$, Slot } from "@builder.io/qwik";
import type { RequestHandler } from "@builder.io/qwik-city";
import { useContent, useDocumentHead } from "@builder.io/qwik-city";
import type { ContentHeading, DocumentMeta } from "@builder.io/qwik-city"; 

import logo from './pagedrop-logo.svg'

export const onGet: RequestHandler = async ({ cacheControl }) => {
  // Control caching for this request for best performance and to reduce hosting costs:
  // https://qwik.dev/docs/caching/
  cacheControl({
    // Always serve a cached response by default, up to a week stale
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    // Max once every 5 seconds, revalidate on the server to get a fresh version of this page
    maxAge: 5,
  });
};

type PageInfo = {
  title: string,
  meta?: readonly DocumentMeta[]
  headings?: ContentHeading[]
}

type SectionProps = {
  pageInfo: PageInfo
}

const readMeta = (pageInfo: PageInfo, name: string, defaultValue: string = '') => {
  const { meta } = pageInfo
  const found = meta && meta.find(item => item.name === name)
  return found ? found.content : defaultValue
}

const styles = {
  header: {
    fontSize: '2em',
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: 'black',
    padding: '0.5em 0.5em 0.5em 0.5em'
  },
  logo: {
    marginRight: '0.5em'
  },
  body: {
    margin: '1em',
    fontFamily: 'Georgia, serif',
    lineHeight: '140%'
  },
  footer: {
    fontSize: '0.8em',
    fontWeight: 'normal',
    color: 'white',
    backgroundColor: 'black',
    padding: '1em'
  }
}

const Header = ({ pageInfo }: SectionProps) => {
  return (
    <div style={styles.header}>
      <img width={50} height={50} style={styles.logo} src={logo} align="center" />
      {pageInfo.title}
    </div>
  )
}

const Footer = ({ pageInfo }: SectionProps) => {
  return (
    <div style={styles.footer}>{readMeta(pageInfo, 'footerText', 'Pagedrop')}</div>
  )
}

export default component$(() => {
  const { title, meta } = useDocumentHead()
  const { headings } = useContent()
  const pageInfo = { title, meta, headings }
  return (
    <>
      <Header pageInfo={pageInfo} />
      <div style={styles.body}>
        <Slot />
      </div>
      <Footer pageInfo={pageInfo} />
    </>
  )
});

import Head from 'next/head';

// TODO: Add open graph meta properties and twitter properties.
export default function SEO({ title, description }) {
  return (
    <Head>
      <title>{title ? `${title} - Graftini` : 'Graftini'}</title>
      <meta
        name="description"
        content={description ?? 'Create dynamic websites without writing a line of code.'}
      />
    </Head>
  );
}

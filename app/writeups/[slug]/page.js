import Link from 'next/link';
import { notFound } from 'next/navigation';
import WriteupBody from '@/components/WriteupBody';
import { getAllSlugs, getWriteup } from '@/lib/writeups';

export const dynamic = 'force-static';

const BASE = process.env.NODE_ENV === 'production' ? '/Parth-Jamodkar' : '';
const siteUrl = 'https://parthjamodkar.com';

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getWriteup(slug);
  if (!post) return {};
  const url = `/writeups/${slug}/`;
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `${siteUrl}${url}` },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.description,
      url,
      images: [{ url: post.cover, width: 1800, height: 720, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [post.cover],
    },
  };
}

export default async function WriteupPage({ params }) {
  const { slug } = await params;
  const post = await getWriteup(slug);
  if (!post) notFound();

  return (
    <article>
      <nav className="mb-8 flex items-center gap-2 font-mono text-xs text-ink-faint" aria-label="Breadcrumb">
        <Link href="/writeups/" className="transition-colors hover:text-signal-blue">write-ups</Link>
        <span aria-hidden="true">/</span>
        <span className="text-ink-muted">{post.slug}</span>
      </nav>

      <header className="mb-10">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-signal-cyan/40 bg-signal-cyan/10 px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-wide text-signal-cyan">
            Write-up
          </span>
          {post.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-line-soft px-2.5 py-0.5 font-mono text-[11px] text-ink-faint">
              {tag}
            </span>
          ))}
        </div>
        <h1 className="max-w-3xl font-mono text-2xl font-bold leading-tight text-ink sm:text-4xl">
          {post.title}
        </h1>
        <p className="mt-4 flex flex-wrap items-center gap-3 font-mono text-xs text-ink-faint">
          <span>{post.dateLabel}</span>
          <span aria-hidden="true">·</span>
          <span>{post.readTime}</span>
          <span aria-hidden="true">·</span>
          <span>verified against working copies</span>
        </p>
      </header>

      <figure className="mb-12 overflow-hidden rounded-xl border border-line">
        <img src={`${BASE}${post.cover}`} alt={post.coverAlt || post.title} className="w-full" />
      </figure>

      <div className="mx-auto max-w-3xl">
        <WriteupBody blocks={post.blocks} base={BASE} />

        <footer className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-8">
          <Link href="/writeups/" className="link-underline font-mono text-sm text-signal-blue">
            ← All write-ups
          </Link>
          <Link href="/public-work" className="link-underline font-mono text-sm text-ink-muted hover:text-ink">
            Public work →
          </Link>
        </footer>
      </div>
    </article>
  );
}

import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context: { site: string }) {
  const posts = await getCollection('blog');
  const sortedPosts = posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  return rss({
    title: "Ryle's bbbblog!!!",
    description: "Don't be evil.",
    site: context.site,
    items: sortedPosts.slice(0, 20).map(post => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.body || '',
      link: `/${post.data.date.getFullYear()}/${String(post.data.date.getMonth() + 1).padStart(2, '0')}/${String(post.data.date.getDate()).padStart(2, '0')}/${post.id.replace(/\.md$/, '')}/`,
      categories: post.data.tags,
    })),
    customData: `<follow_challenge>
    <feedId>113878220700898304</feedId>
    <userId>80244183251313664</userId>
  </follow_challenge>`,
  });
}

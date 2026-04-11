import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

// لاستخدام السكربت: 
// يجب توفير متغيرات البيئة قبل التشغيل في بيئة Vercel أو المحلي
// ex: SUPABASE_URL=... SUPABASE_KEY=... node build-sitemap.mjs

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://INSERT_YOUR_URL.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'INSERT_YOUR_ANON_KEY';
const SITE_URL = 'https://heru-store.vercel.app';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function generateSitemap() {
  const staticPages = [
    { loc: '/', changefreq: 'weekly', priority: 1.0 },
    { loc: '/shop', changefreq: 'daily', priority: 0.9 },
    { loc: '/suggest', changefreq: 'monthly', priority: 0.7 },
    { loc: '/review', changefreq: 'monthly', priority: 0.6 },
    { loc: '/track-order', changefreq: 'monthly', priority: 0.8 },
    { loc: '/privacy', changefreq: 'monthly', priority: 0.3 },
    { loc: '/terms', changefreq: 'monthly', priority: 0.3 }
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  // Static Pages Mapping
  staticPages.forEach(p => {
    xml += `
  <url>
    <loc>${SITE_URL}${p.loc}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`;
  });

  // Dynamic Products Mapping
  try {
    const { data: products, error } = await supabase
        .from('products')
        .select('id, updated_at')
        .eq('active', true);
        
    if (products && !error) {
      products.forEach(prod => {
        const date = prod.updated_at ? prod.updated_at.split('T')[0] : new Date().toISOString().split('T')[0];
        xml += `
  <url>
    <loc>${SITE_URL}/product?id=${prod.id}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
      });
    } else {
        console.warn('⚠️ No products found or error pulling from Supabase', error);
    }
  } catch (err) {
    console.error('Error fetching products for sitemap', err);
  }

  xml += `\n</urlset>`;

  fs.writeFileSync('sitemap.xml', xml);
  console.log('✅ sitemap.xml generated successfully explicitly with DB products!');
}

generateSitemap();

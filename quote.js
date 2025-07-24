// api/quote.js
import { cache } from './cache.js';
export default async function handler(req, res) {
  const key = 'quotes';
  const cached = await cache.get(key);
  if (cached) return res.send(cached);

  const [brite, gem, hod] = await Promise.all([
    fetch('https://api.briteco.com/quote?brand=Rolex&ref=126610LV&value=12000'),
    fetch('https://api.gemshield.com/quote?brand=Rolex&ref=126610LV&value=12000'),
    fetch('https://api.hodinkee.com/quote?brand=Rolex&ref=126610LV&value=12000')
  ]).then(r => Promise.all(r.map(r => r.json())));

  const html = `
    <table>
      <thead><tr><th>Insurer</th><th>Annual Premium</th><th>Coverage</th><th>Apply</th></tr></thead>
      <tbody>
        <tr><td>BriteCo</td><td>$${brite.premium}</td><td>Worldwide</td>
            <td><a href="${brite.url}&aff=YOURID" rel="sponsored">Quote</a></td></tr>
        <tr><td>GemShield</td><td>$${gem.premium}</td><td>Worldwide</td>
            <td><a href="${gem.url}&aff=YOURID" rel="sponsored">Quote</a></td></tr>
        <tr><td>Hodinkee</td><td>$${hod.premium}</td><td>Worldwide</td>
            <td><a href="${hod.url}&aff=YOURID" rel="sponsored">Quote</a></td></tr>
      </tbody>
    </table>`;
  await cache.set(key, html, 900); // 15 min
  res.send(html);
}

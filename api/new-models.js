// api/new-models.js
import { gql, request } from 'graphql-request';
export default async (req, res) => {
  const query = gql`
    { newListings(limit: 6, sort: CREATED_AT_DESC) {
        model
        reference
        priceUSD
        image
        brand
        createdAt
      }
    }`;
  const data = await request('https://api.chrono24.com/graphql', query);
  const cards = data.newListings.map(l => `
    <a class="card" href="https://chrono24.com${l.url}&aff=YOURID">
      <img src="${l.image}" loading="lazy">
      <span>${l.brand} ${l.model}</span>
      <strong>$${l.priceUSD}</strong>
    </a>`).join('');
  res.send(`<div class="grid">${cards}</div>`);
};

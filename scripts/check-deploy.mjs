import https from 'https';
const url = 'https://albertvostrikov2001.github.io/Zakulicie/cases/';
https.get(url, (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    const imgs = [...data.matchAll(/src="([^"]*cases[^"]*)"/g)].map(m => m[1]);
    console.log('Case img srcs (first 5):', imgs.slice(0, 5));
    if (imgs.length === 0) {
      // Check if there are any img tags at all
      const allImgs = [...data.matchAll(/src="([^"]*)"/g)].map(m => m[1]).filter(s => !s.includes('_next'));
      console.log('All non-next img srcs:', allImgs.slice(0, 10));
    }
  });
}).on('error', e => console.error(e));

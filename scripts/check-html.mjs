import https from 'https';

const url = 'https://albertvostrikov2001.github.io/Zakulicie/cases/';
https.get(url, (res) => {
  let data = '';
  res.on('data', c => { data += c; });
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    // Find all img tags
    const imgMatches = data.match(/<img[^>]+>/g) || [];
    console.log('Img tags in HTML:', imgMatches.length);
    if (imgMatches.length > 0) {
      imgMatches.slice(0, 3).forEach(img => {
        const src = img.match(/src="([^"]+)"/);
        if (src) console.log('  src:', src[1].slice(0, 120));
      });
    }
    // Find noscript tags
    const noScript = data.match(/<noscript>/g) || [];
    console.log('Noscript tags:', noScript.length);
    // Show first 500 chars to see HTML structure
    console.log('\nFirst 800 chars of body:\n', data.slice(0, 800));
  });
}).on('error', e => console.error('Error:', e.message));

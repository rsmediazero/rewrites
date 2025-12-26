// handles /api/proxy/melolo/ANY or /api/proxy/dramabox/ANY
export default async function handler(req, res) {
  const { path } = req.query; // ["melolo","trending"]  or ["dramabox","populersearch"]
  const base = path[0] === 'melolo'
    ? 'https://melolo-api-azure.vercel.app/api/melolo'
    : 'https://dramabox.sansekai.my.id/api/dramabox';

  const target = `${base}/${path.slice(1).join('/')}`;
  const url = new URL(target);
  // forward query string
  Object.entries(req.query).forEach(([k, v]) => {
    if (k !== 'path') url.searchParams.set(k, v);
  });

  const r = await fetch(url, { headers: { 'User-Agent': req.headers['user-agent'] } });
  const data = await r.json();

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json(data);
}

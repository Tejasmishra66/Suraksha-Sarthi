const express = require('express');
const router  = express.Router();

const ARCGIS_BASE =
  'https://hpgeoportal.hp.gov.in/server/rest/services/Hosted/Rapid_Incident_View/FeatureServer/0';

/**
 * GET /hpsdma/incidents
 * Proxy the public HPSDMA ArcGIS FeatureServer so the browser avoids CORS.
 * Query params forwarded: district, type, year, limit
 */
router.get('/incidents', async (req, res) => {
  try {
    const year    = req.query.year    || new Date().getFullYear();
    const limit   = Math.min(parseInt(req.query.limit) || 200, 500);
    const district = req.query.district ? req.query.district.toUpperCase() : null;
    const type     = req.query.type     || null;

    let where = `year_of_in=${year}`;
    if (district) where += ` AND UPPER(name_of_di)='${district}'`;
    if (type)     where += ` AND LOWER(type_of_in) LIKE '%${type.toLowerCase()}%'`;

    const url =
      `${ARCGIS_BASE}/query` +
      `?where=${encodeURIComponent(where)}` +
      `&outFields=objectid,type_of_in,name_of_di,tehsil,village_na,date_of_in,` +
      `human_loss,human_inj,human_mis,major_loss,year_of_in,depth` +
      `&returnGeometry=true` +
      `&orderByFields=objectid DESC` +
      `&resultRecordCount=${limit}` +
      `&f=json`;

    const response = await fetch(url, {
      headers: { 'User-Agent': 'SurakshaSarthi/1.0' },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      return res.status(502).json({ error: 'Upstream HPSDMA service returned an error.' });
    }

    const data = await response.json();

    // Normalise into a cleaner shape for the frontend
    const incidents = (data.features || []).map((f) => {
      const a = f.attributes;
      return {
        id:           a.objectid,
        type:         a.type_of_in  || 'Unknown',
        district:     a.name_of_di  || '-',
        tehsil:       a.tehsil      || '-',
        village:      a.village_na  || '-',
        date:         a.date_of_in  ? new Date(a.date_of_in).toISOString() : null,
        humanLoss:    a.human_loss  || 0,
        humanInjured: a.human_inj   || 0,
        humanMissing: a.human_mis   || 0,
        majorLoss:    a.major_loss  || '0',
        status:       a.depth       || 'Active',
        lat:          f.geometry ? f.geometry.y : null,
        lon:          f.geometry ? f.geometry.x : null,
      };
    });

    // Summary stats
    const summary = incidents.reduce(
      (acc, inc) => {
        acc.total++;
        acc.deaths   += Number(inc.humanLoss)    || 0;
        acc.injured  += Number(inc.humanInjured) || 0;
        acc.missing  += Number(inc.humanMissing) || 0;
        acc.byType[inc.type] = (acc.byType[inc.type] || 0) + 1;
        return acc;
      },
      { total: 0, deaths: 0, injured: 0, missing: 0, byType: {} }
    );

    return res.json({ year, summary, incidents });
  } catch (err) {
    if (err.name === 'TimeoutError') {
      return res.status(504).json({ error: 'HPSDMA service timed out.' });
    }
    console.error('[hpsdma] fetch error:', err.message);
    return res.status(500).json({ error: 'Failed to fetch HPSDMA data.' });
  }
});

module.exports = router;

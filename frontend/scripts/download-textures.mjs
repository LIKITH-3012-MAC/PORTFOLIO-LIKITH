import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.resolve(__dirname, '../public');

const textures = [
  {
    url: 'https://raw.githubusercontent.com/jeromeetienne/threex.planets/master/images/mercurymap.jpg',
    path: 'textures/planets/mercury/mercury-color.jpg'
  },
  {
    url: 'https://raw.githubusercontent.com/jeromeetienne/threex.planets/master/images/mercurybump.jpg',
    path: 'textures/planets/mercury/mercury-bump.jpg'
  },
  {
    url: 'https://raw.githubusercontent.com/jeromeetienne/threex.planets/master/images/venusmap.jpg',
    path: 'textures/planets/venus/venus-color.jpg'
  },
  {
    url: 'https://raw.githubusercontent.com/jeromeetienne/threex.planets/master/images/venusbump.jpg',
    path: 'textures/planets/venus/venus-bump.jpg'
  },
  {
    url: 'https://raw.githubusercontent.com/jeromeetienne/threex.planets/master/images/earthmap1k.jpg',
    path: 'textures/planets/earth/earth-color.jpg'
  },
  {
    url: 'https://raw.githubusercontent.com/jeromeetienne/threex.planets/master/images/earthbump1k.jpg',
    path: 'textures/planets/earth/earth-bump.jpg'
  },
  {
    url: 'https://raw.githubusercontent.com/jeromeetienne/threex.planets/master/images/earthcloudmap.jpg',
    path: 'textures/planets/earth/earth-clouds.jpg'
  },
  {
    url: 'https://raw.githubusercontent.com/jeromeetienne/threex.planets/master/images/marsmap1k.jpg',
    path: 'textures/planets/mars/mars-color.jpg'
  },
  {
    url: 'https://raw.githubusercontent.com/jeromeetienne/threex.planets/master/images/marsbump1k.jpg',
    path: 'textures/planets/mars/mars-bump.jpg'
  },
  {
    url: 'https://raw.githubusercontent.com/jeromeetienne/threex.planets/master/images/jupitermap.jpg',
    path: 'textures/planets/jupiter/jupiter-color.jpg'
  },
  {
    url: 'https://raw.githubusercontent.com/jeromeetienne/threex.planets/master/images/saturnmap.jpg',
    path: 'textures/planets/saturn/saturn-color.jpg'
  },
  {
    url: 'https://raw.githubusercontent.com/jeromeetienne/threex.planets/master/images/saturnringcolor.jpg',
    path: 'textures/planets/saturn/saturn-ring-color.jpg'
  },
  {
    url: 'https://raw.githubusercontent.com/jeromeetienne/threex.planets/master/images/saturnringpattern.gif',
    path: 'textures/planets/saturn/saturn-ring-pattern.gif'
  },
  {
    url: 'https://raw.githubusercontent.com/jeromeetienne/threex.planets/master/images/uranusmap.jpg',
    path: 'textures/planets/uranus/uranus-color.jpg'
  },
  {
    url: 'https://raw.githubusercontent.com/jeromeetienne/threex.planets/master/images/uranusringcolour.jpg',
    path: 'textures/planets/uranus/uranus-ring-color.jpg'
  },
  {
    url: 'https://raw.githubusercontent.com/jeromeetienne/threex.planets/master/images/uranusringtrans.gif',
    path: 'textures/planets/uranus/uranus-ring-pattern.gif'
  },
  {
    url: 'https://raw.githubusercontent.com/jeromeetienne/threex.planets/master/images/neptunemap.jpg',
    path: 'textures/planets/neptune/neptune-color.jpg'
  },
  {
    url: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/moon_1024.jpg',
    path: 'textures/planets/moon/moon-color.jpg'
  }
];

async function downloadFile(url, destPath) {
  const fullDestPath = path.join(PUBLIC_DIR, destPath);
  const dir = path.dirname(fullDestPath);
  
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (fs.existsSync(fullDestPath)) {
    console.log(`✓ Already exists: ${destPath}`);
    return;
  }

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP error ${res.status} for ${url}`);
    }
    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(fullDestPath, buffer);
    console.log(`✓ Downloaded: ${destPath}`);
  } catch (err) {
    console.error(`✗ Failed to download ${destPath} from ${url}:`, err.message);
  }
}

async function run() {
  console.log('Downloading planetary textures...');
  for (const item of textures) {
    await downloadFile(item.url, item.path);
  }
  console.log('Finished downloading planetary textures.');
}

run().catch(console.error);

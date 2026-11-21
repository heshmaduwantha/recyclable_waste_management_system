/**
 * EcoCollect - Sample Recyclable Waste Image Fetcher
 * Downloads curated, high-quality, royalty-free sample photos of recyclable materials
 * for each category (Plastic, Paper, Metal, Glass, E-Waste, Polythene) into datasets/images/
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const IMAGES = [
  // Plastic
  {
    category: 'plastic',
    filename: 'pet_bottles_crushed.jpg',
    url: 'https://images.unsplash.com/photo-1528190336454-13cd56b45b5a?w=800&auto=format&fit=crop&q=80',
    title: 'Crushed Plastic PET Water Bottles'
  },
  {
    category: 'plastic',
    filename: 'hdpe_milk_containers.jpg',
    url: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=800&auto=format&fit=crop&q=80',
    title: 'HDPE Plastic Detergent & Milk Jugs'
  },
  // Paper
  {
    category: 'paper',
    filename: 'corrugated_cardboard_stacked.jpg',
    url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&auto=format&fit=crop&q=80',
    title: 'Flattened Corrugated Cardboard Boxes'
  },
  {
    category: 'paper',
    filename: 'newspapers_bundled.jpg',
    url: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=80',
    title: 'Bundled Newsprint & Old Papers'
  },
  // Metal
  {
    category: 'metal',
    filename: 'aluminum_drink_cans.jpg',
    url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop&q=80',
    title: 'Aluminum Beverage & Soda Cans'
  },
  {
    category: 'metal',
    filename: 'tin_food_cans.jpg',
    url: 'https://images.unsplash.com/photo-1537084642907-629340c7e59c?w=800&auto=format&fit=crop&q=80',
    title: 'Clean Empty Tin Cans'
  },
  // Glass
  {
    category: 'glass',
    filename: 'clear_glass_jars.jpg',
    url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80',
    title: 'Clear Glass Jars with Lids Removed'
  },
  {
    category: 'glass',
    filename: 'green_amber_bottles.jpg',
    url: 'https://images.unsplash.com/photo-1527061011665-3652c757a4d4?w=800&auto=format&fit=crop&q=80',
    title: 'Green and Amber Glass Bottles'
  },
  // E-Waste
  {
    category: 'e-waste',
    filename: 'smartphones_pcb_electronics.jpg',
    url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80',
    title: 'Printed Circuit Boards & Electronic Gadgets'
  },
  {
    category: 'e-waste',
    filename: 'computer_keyboard_cables.jpg',
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
    title: 'Computer Components & Electronic Wires'
  },
  // Polythene
  {
    category: 'polythene',
    filename: 'polythene_carrier_bags.jpg',
    url: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=800&auto=format&fit=crop&q=80',
    title: 'Clean LDPE Transparent Polythene Shopping Bags'
  }
];

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    https.get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        // Follow redirect
        return downloadFile(response.headers.location, destPath).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(destPath);
        return reject(new Error(`Failed with HTTP status ${response.statusCode}`));
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
      reject(err);
    });
  });
}

async function run() {
  console.log('Downloading curated sample recyclable waste images...');
  for (const item of IMAGES) {
    const targetDir = path.resolve(__dirname, '../datasets/images', item.category);
    if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
    const targetPath = path.join(targetDir, item.filename);
    try {
      await downloadFile(item.url, targetPath);
      const sizeKb = (fs.statSync(targetPath).size / 1024).toFixed(1);
      console.log(`✅ [${item.category.toUpperCase()}] ${item.filename} (${sizeKb} KB) - ${item.title}`);
    } catch (err) {
      console.warn(`⚠️ Could not download ${item.filename}:`, err.message);
    }
  }
  console.log('Done downloading sample images.');
}

run();


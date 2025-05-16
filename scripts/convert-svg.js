const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const svgDir = path.join(__dirname, '../assets/images');
const svgFiles = fs.readdirSync(svgDir).filter(file => file.endsWith('.svg'));

async function convertSvgToPng() {
    for (const file of svgFiles) {
        const svgPath = path.join(svgDir, file);
        const pngPath = path.join(svgDir, file.replace('.svg', '.png'));

        try {
            await sharp(svgPath)
                .resize(1000, 1000, { // Adjust size as needed
                    fit: 'contain',
                    background: { r: 0, g: 0, b: 0, alpha: 0 }
                })
                .png()
                .toFile(pngPath);

            console.log(`Converted ${file} to PNG`);
        } catch (error) {
            console.error(`Error converting ${file}:`, error);
        }
    }
}

convertSvgToPng(); 
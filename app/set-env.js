const fs = require('fs');

const environmentFile = `export const environment = {
  mapsKey: "${process.env['MAPS_API_KEY']}",
};
`;

fs.writeFile('./src/environments/environment.secret.ts', environmentFile, err=> {
  if (err) {
    console.error("Error writing environment.secret.ts file");
    console.error(err);
  } else {
    console.log(`Angular environment.ts file generated`);
  }
});

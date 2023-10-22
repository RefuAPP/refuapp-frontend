const fs = require('fs');

const mapsKey = process.env['MAPS_API_KEY'];

const angularEnvironmentFile = `export const secretEnvironment = {
  mapsKey: "${mapsKey}",
};
`;

const androidEnvironmentFile = `
MAPS_API_KEY=${mapsKey}
`;

fs.writeFile('./src/environments/environment.secret.ts', angularEnvironmentFile, err => {
    if (err) {
        console.error("Error writing environment.secret.ts file");
        console.error(err);
    } else {
        console.log(`Angular environment.ts file generated`);
    }
});

fs.writeFile('./android/local.properties', androidEnvironmentFile, err => {
    if (err) {
        console.error("Error writing local.properties file");
        console.error(err);
    } else {
        console.log(`Android local.properties file generated`);
    }
});

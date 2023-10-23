const fs = require('fs');

const mapsKey = process.env['MAPS_API_KEY'];
const backendUrl = process.env['BACKEND_URL'];
const sensorsBackendUrl = process.env['SENSORS_BACKEND_URL'];

const angularEnvironmentFile = `export const secretEnvironment = {
  mapsKey: "${mapsKey}",
};
`;

const androidEnvironmentFile = `
MAPS_API_KEY=${mapsKey}
`;

const productionEnvironmentFile = `
export const environment = {
  production: true,
  API: "${backendUrl}",
  MAPS_FORCE_CREATE: false,
  SENSORS_API: "${sensorsBackendUrl}",
};
`

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

fs.writeFile('./src/environments/environment.prod.ts', productionEnvironmentFile, err => {
  if (err) {
    console.error("Error writing environment.prod.ts file");
    console.error(err);
  } else {
    console.log(`Generated production environment file`);
  }
})

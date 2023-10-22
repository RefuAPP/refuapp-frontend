const fs = require('fs');

const mapsKey = process.env['MAPS_API_KEY'];

const angularEnvironmentFile = `export const secretEnvironment = {
  mapsKey: "${mapsKey}",
};
`;

const androidEnvironmentFile = `
MAPS_API_KEY=${mapsKey}
`;

const indexHtml = `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Ionic App</title>

    <base href="/" />

    <meta name="color-scheme" content="light dark" />
    <meta
      name="viewport"
      content="viewport-fit=cover, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"
    />
    <meta name="format-detection" content="telephone=no" />
    <meta name="msapplication-tap-highlight" content="no" />

    <link rel="icon" type="image/png" href="assets/icon/favicon.png" />

    <!-- add to homescreen for ios -->
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black" />
  </head>
  <body>
    <app-root></app-root>
  </body>
</html>
<script src="https://maps.googleapis.com/maps/api/js?key=${mapsKey}&libraries=places&language=ca"></script>
`

fs.writeFile('./src/environments/environment.secret.ts', angularEnvironmentFile, err=> {
  if (err) {
    console.error("Error writing environment.secret.ts file");
    console.error(err);
  } else {
    console.log(`Angular environment.ts file generated`);
  }
});

fs.writeFile('./android/local.properties', androidEnvironmentFile, err=> {
  if (err) {
    console.error("Error writing local.properties file");
    console.error(err);
  } else {
    console.log(`Android local.properties file generated`);
  }
});

fs.writeFile('./index.html', indexHtml, err=> {
  if (err) {
    console.error("Error writing index.html file");
    console.error(err);
  } else {
    console.log(`index file generated!`);
  }
})

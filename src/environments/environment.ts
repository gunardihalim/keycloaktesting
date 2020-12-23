// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  keycloakConfig: {
    clientId:'helloworld-client',
    realm:'helloworldrealm',
    url:'https://keycloak-dev.gitsolutions.id/auth',
  },
  encryptKey:'q@36^5vGFK)~z#rW',
  secretKey:'secret-key-58923',
  baseUrlImage: 'https://idsdev-api.gitsolutions.id/public/getFile?path=',
  baseUrl:'https://idsdev-api.gitsolutions.id',
  mapApiKey : "AIzaSyBgLAsvhRh_2N4JnDl6t9bE9dE3HZ64aDw",
  //imageServletPrefix : "https://talents-dev.acc.co.id/public/getFile?path=",
  basicAuthentication : "Basic dGFsZW50c19tdGY6cWEzNGhkamZ5dHU0NXJ0ZmRzZmJnZmo=", //IDS
  timeoutms : 35000
}
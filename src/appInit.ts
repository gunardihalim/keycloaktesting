import { KeycloakService, KeycloakOptions } from 'keycloak-angular'
import { environment } from './environments/environment'

// export function initializer(keycloak: KeycloakService): () => Promise<any>{
export function initializer(keycloak: KeycloakService){
  return () => 
    keycloak.init({
      config:{
        url:'https://keycloak-dev.gitsolutions.id/auth',
        realm:'helloworldrealm',
        clientId:'helloworld-client'
      }
      // ,
      // initOptions:{
      //   onLoad:'login-required',
      //   redirectUri:'http://localhost:8181/authcodeReader.html',
      //   silentCheckSsoRedirectUri:
      //       window.location.origin + '/assets/authcodeReader.html'
      // }
    })
    // ,initOptions: {
    //   onLoad:'check-sso',
    //   silentCheckSsoRedirectUri:
    //     window.location.origin
  
  // const options: KeycloakOptions = {
  //   config: environment.keycloakConfig,
  //   // initOptions: {
  //   //   onLoad:'check-sso',
  //   //   silentCheckSsoRedirectUri:
  //   //     window.location.origin + '/assets/authcodeReader.html'
  //   // }
  // }
  
  // return (): Promise<any> => keycloak.init(options)
    // return (): Promise<any> => {
    //     return new Promise(async (resolve, reject) => {
    //       try {
    //         await keycloak.init({
    //             config: {
    //                 url: environment.keycloakConfig.issuer,
    //                 realm: environment.keycloakConfig.realm,
    //                 clientId: environment.keycloakConfig.clientId
    //             },
    //           loadUserProfileAtStartUp: false,
    //           initOptions: {
    //             onLoad: 'login-required',
    //             checkLoginIframe: true
    //           },
    //           bearerExcludedUrls: []
    //         });
    //         resolve();
    //       } catch (error) {
    //         reject(error);
    //       }
    //     });
    //   };
}
export const environment = {
  production: false,
  spotify: {
    tokenUrl: 'https://accounts.spotify.com/api/token',
    authorizationUrl: 'https://accounts.spotify.com/authorize',
    apiUrl: 'https://api.spotify.com',
    clientId: '96aee2e9aeaa4c84b5c2a8282fee706b',
    clientSecret: 'a0a4c94c7388426fab9d7266cbb74fa1',
    redirectUri: 'http://127.0.0.1:4200/auth',
    scope: 'user-read-email user-read-private'
  }
};

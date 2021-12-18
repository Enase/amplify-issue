export default {
  Auth: {
    mandatorySignIn: true,
    identityPoolId: process.env.COGNITO_IDENTITY_POOL_ID,
    userPoolId: process.env.COGNITO_USER_POOL_ID,
    userPoolWebClientId: process.env.COGNITO_APP_CLIENT_ID,
    region: process.env.COGNITO_REGION,
  },
  API: {
    endpoints: [
      {
        name: 'api-core',
        endpoint: process.env.API_ENDPOINT_CORE,
        region: process.env.COGNITO_REGION,
      }
    ],
  },
};

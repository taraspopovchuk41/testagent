// AWS Amplify Configuration
// Replace these values with your actual AWS Cognito configuration
const awsconfig = {
  Auth: {
    Cognito: {
      userPoolId: 'us-east-1_XXXXXXXXX', // Replace with your User Pool ID
      userPoolClientId: 'XXXXXXXXXXXXXXXXXXXXXXXXXX', // Replace with your App Client ID
      loginWith: {
        email: true,
        username: true,
        phone: false,
      },
      signUpVerificationMethod: 'code', // 'code' | 'link'
    },
  },
};

export default awsconfig;

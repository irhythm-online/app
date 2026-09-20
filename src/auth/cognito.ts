import "react-native-get-random-values";
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
  type ISignUpResult,
} from "amazon-cognito-identity-js";
import Constants from "expo-constants";

const extra = (Constants.expoConfig?.extra ?? {}) as {
  cognitoUserPoolId?: string;
  cognitoClientId?: string;
};

const userPool = new CognitoUserPool({
  UserPoolId: extra.cognitoUserPoolId ?? "",
  ClientId: extra.cognitoClientId ?? "",
});

export interface AuthTokens {
  accessToken: string;
  idToken: string;
  refreshToken: string;
}

function getCognitoUser(email: string): CognitoUser {
  return new CognitoUser({ Username: email, Pool: userPool });
}

/** SRP sign-in against the Cognito User Pool. */
export function signIn(email: string, password: string): Promise<AuthTokens> {
  return new Promise((resolve, reject) => {
    const authDetails = new AuthenticationDetails({ Username: email, Password: password });
    const cognitoUser = getCognitoUser(email);
    cognitoUser.authenticateUser(authDetails, {
      onSuccess: (session) => {
        resolve({
          accessToken: session.getAccessToken().getJwtToken(),
          idToken: session.getIdToken().getJwtToken(),
          refreshToken: session.getRefreshToken().getToken(),
        });
      },
      onFailure: (err) => reject(err),
    });
  });
}

/** Self-signup with email + password + display name (stored as the `name` attribute). */
export function signUp(email: string, password: string, displayName: string): Promise<ISignUpResult> {
  return new Promise((resolve, reject) => {
    const attributes = [
      new CognitoUserAttribute({ Name: "email", Value: email }),
      new CognitoUserAttribute({ Name: "name", Value: displayName }),
    ];
    userPool.signUp(email, password, attributes, [], (err, result) => {
      if (err || !result) reject(err ?? new Error("Sign up failed"));
      else resolve(result);
    });
  });
}

/** Confirms a just-created account with the verification code emailed by Cognito. */
export function confirmSignUp(email: string, code: string): Promise<void> {
  return new Promise((resolve, reject) => {
    getCognitoUser(email).confirmRegistration(code, true, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

/** Requests a new verification code (in case the first one expired / was lost). */
export function resendConfirmationCode(email: string): Promise<void> {
  return new Promise((resolve, reject) => {
    getCognitoUser(email).resendConfirmationCode((err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

export function signOutLocalCognitoUser(email?: string): void {
  const user = email ? getCognitoUser(email) : userPool.getCurrentUser();
  user?.signOut();
}

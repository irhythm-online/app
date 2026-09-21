import "react-native-get-random-values";
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
} from "amazon-cognito-identity-js";
import Constants from "expo-constants";
import { randomUUID } from "expo-crypto";

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

function getCognitoUser(username: string): CognitoUser {
  return new CognitoUser({ Username: username, Pool: userPool });
}

/** SRP sign-in against the Cognito User Pool. The pool aliases `email`, so email works as the Username here. */
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

/**
 * Self-signup with email + password + display name (stored as the `name` attribute).
 * The pool has `email` configured as an alias, not as `UsernameAttributes`, so Cognito
 * rejects an email-shaped Username at signup time. We generate a random Username and
 * keep `email` as an attribute — sign-in still works via email since aliases resolve there.
 */
export function signUp(email: string, password: string, displayName: string): Promise<{ username: string }> {
  return new Promise((resolve, reject) => {
    const username = randomUUID();
    const attributes = [
      new CognitoUserAttribute({ Name: "email", Value: email }),
      new CognitoUserAttribute({ Name: "name", Value: displayName }),
    ];
    userPool.signUp(username, password, attributes, [], (err, result) => {
      if (err || !result) reject(err ?? new Error("Sign up failed"));
      else resolve({ username });
    });
  });
}

/** Confirms a just-created account with the verification code emailed by Cognito. Takes the generated Username, not the email. */
export function confirmSignUp(username: string, code: string): Promise<void> {
  return new Promise((resolve, reject) => {
    getCognitoUser(username).confirmRegistration(code, true, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

/** Requests a new verification code (in case the first one expired / was lost). Takes the generated Username, not the email. */
export function resendConfirmationCode(username: string): Promise<void> {
  return new Promise((resolve, reject) => {
    getCognitoUser(username).resendConfirmationCode((err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

export function signOutLocalCognitoUser(email?: string): void {
  const user = email ? getCognitoUser(email) : userPool.getCurrentUser();
  user?.signOut();
}

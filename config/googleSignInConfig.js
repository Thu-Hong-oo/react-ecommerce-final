import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";

export const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    webClientId:
      "124321505047-p3n7e40v7ndt5tm0pnaahlkuj1ga0dpp.apps.googleusercontent.com",
    offlineAccess: true,
  });
};

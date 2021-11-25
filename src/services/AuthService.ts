import { App } from "@capacitor/app";
import { AuthService } from "ionic-appauth";
import {
  CapacitorBrowser,
  CapacitorStorage,
} from "ionic-appauth/lib/capacitor";
import { isPlatform } from "@ionic/vue";
import { AxiosRequestor } from "./AxiosService";

export class Auth {
  private static authService: AuthService | undefined;

  private static buildAuthInstance() {
    const authService = new AuthService(
      new CapacitorBrowser(),
      new CapacitorStorage(),
      new AxiosRequestor()
    );
    authService.authConfig = {
      client_id: "appauth_test",
      server_host: "https://pan.mylabora.com/IdentityServer4",
      redirect_url: isPlatform("capacitor")
        ? "io.ionic.starter://authcallback"
        : window.location.origin + "/authcallback",
      end_session_redirect_url: isPlatform("capacitor")
        ? "io.ionic.starter://endsession"
        : window.location.origin + "/endsession",
      scopes: "openid profile offline_access",
      pkce: true,
    };

    console.log('callback', window.location.origin + "/authcallback");

    if (isPlatform("capacitor")) {
      console.log('capacitor app events');
      App.addListener("appUrlOpen", (data: any) => {
        console.log(
          "🚀 ~ file: AuthService.ts ~ line 28 ~ Auth ~ App.addListener ~ data",
          data
        );
        if (data.url.indexOf(authService.authConfig.redirect_url) === 0) {
          authService.authorizationCallback(data.url);
        } else {
          authService.endSessionCallback();
        }
      });
    }

    authService.init();
    return authService;
  }

  public static get Instance(): AuthService {
    if (!this.authService) {
      this.authService = this.buildAuthInstance();
    }

    return this.authService;
  }
}

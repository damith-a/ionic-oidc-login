<template>
  <ion-page>
    <p>Signing in...</p>
  </ion-page>
</template>

<script lang="ts">
import { Auth } from "@/services/AuthService";
import { IonPage, onIonViewWillEnter, onIonViewWillLeave } from "@ionic/vue";
import { AuthActions } from "ionic-appauth";
import { Subscription } from "rxjs";
import { defineComponent } from "vue";
import router from "@/router";
import { useRoute } from "vue-router";

export default defineComponent({
  name: "Redirect",
  components: {
    IonPage
  },
  setup() {
    let sub = Subscription.EMPTY;
    const route = useRoute();

    const loadPage = () => {
      console.log('load home');
      sub = Auth.Instance.events$.subscribe((action) => {
        if (action.action === AuthActions.SignInSuccess) {
          console.log("🚀 ~ file: Redirect.vue ~ line 28 ~ sub=Auth.Instance.events$.subscribe ~ SignInSuccess");
          setInterval(() => router.push("/home"), 2500);
        }

        if (action.action === AuthActions.SignInFailed) {
          console.log("🚀 ~ file: Redirect.vue ~ line 33 ~ sub=Auth.Instance.events$.subscribe ~ SignInFailed");
          setInterval(() => router.push("/landing"), 2500);
        }
      });

      const url = route.fullPath;
      Auth.Instance.authorizationCallback(url);
    };

    onIonViewWillEnter(() => {
      loadPage();
    });

    onIonViewWillLeave(() => {
      sub.unsubscribe();
    });

    return {
      sub,
      loadPage,
    };
  }
});
</script>

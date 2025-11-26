export default defineNuxtRouteMiddleware((to) => {
    
    //ログインの設定
    const authStore = useAuthStore();
  
    const redirectTo = authStore.validateRoute(to);
    if (redirectTo) {
      return navigateTo(redirectTo);
    }
  });
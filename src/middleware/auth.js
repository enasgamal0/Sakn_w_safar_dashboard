export default function auth({ next, router }) {
  if (!localStorage.getItem("sakn_w_safar_admin_dashboard_user_token")) {
    return router.push("/");
  }
  return next();
}

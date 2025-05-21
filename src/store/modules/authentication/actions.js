import router from "../../../router/index.js";
import axios from "axios";

export default {
  // Start:: Set Authenticated User Data
  setAuthenticatedUserData(context, payload) {
    context.commit("setAuthenticatedUserData", payload);
  },
  // End:: Set Authenticated User Data

  // Start:: Logout
  async logout() {
    try {
      await axios({
        method: "POST",
        url: `auth/logout`,
      });
      localStorage.removeItem("sakn_w_safar_admin_dashboard_user_id");
      localStorage.removeItem("sakn_w_safar_admin_dashboard_user_token");
      localStorage.removeItem("sakn_w_safar_admin_dashboard_userName");
      localStorage.removeItem("sakn_w_safar_admin_roles");
      router.replace("/");
      location.reload();
    } catch (error) {
      console.log(error.response.data.message);
    }
  },
  // END:: Logout
};

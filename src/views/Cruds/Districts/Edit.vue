<template>
  <div class="crud_form_wrapper">
    <!-- Start:: Title -->
    <div class="form_title_wrapper">
      <h4>{{ $t("TITLES.editDistrict") }}</h4>
    </div>
    <div class="col-12 text-end">
      <v-btn @click="$router.go(-1)" style="color: #008274">
        <i class="fas fa-backward"></i>
      </v-btn>
    </div>
    <!-- End:: Title -->

    <!-- Start:: Single Step Form Content -->
    <div class="single_step_form_content_wrapper">
      <form @submit.prevent="validateFormInputs">
        <div class="row">
          <!-- Start:: Name Input -->
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.nameAr')"
            v-model.trim="data.name_ar"
            required
          />
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.nameEn')"
            v-model.trim="data.name_en"
            required
          />
          <!-- End:: Name Input -->

          <base-select-input
            col="6"
            :optionsList="states"
            :placeholder="$t('PLACEHOLDERS.area')"
            v-model="data.state"
            @input="getCities(data.state?.id), data.city = null"
            required
          />
          <base-select-input
            col="6"
            :optionsList="cities"
            :placeholder="$t('PLACEHOLDERS.city')"
            v-model="data.city"
            required
          />

          <!-- Start:: Deactivate Switch Input -->
          <!-- <div class="input_wrapper switch_wrapper my-5 col-6">
            <v-switch
              color="green"
              :label="
                data.active
                  ? $t('PLACEHOLDERS.active')
                  : $t('PLACEHOLDERS.notActive')
              "
              v-model="data.active"
              hide-details
            ></v-switch>
          </div> -->
          <!-- End:: Deactivate Switch Input -->

          <!-- Start:: Submit Button Wrapper -->
          <div class="btn_wrapper">
            <base-button
              class="mt-2"
              styleType="primary_btn"
              :btnText="$t('BUTTONS.save')"
              :isLoading="isWaitingRequest"
              :disabled="isWaitingRequest"
            />
          </div>
          <!-- End:: Submit Button Wrapper -->
        </div>
      </form>
    </div>
    <!-- END:: Single Step Form Content -->
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "EditDistrict",

  data() {
    return {
      // Start:: Loader Control Data
      isWaitingRequest: false,
      // End:: Loader Control Data

      // Start:: Data Collection To Send
      data: {
        name_ar: null,
        name_en: null,
        state: null,
        city: null,
        active: null,
      },
      states: [],
      cities: [],

      // End:: Data Collection To Send
    };
  },

  computed: {
    ...mapGetters({
      getAppLocale: "AppLangModule/getAppLocale",
    }),
  },

  methods: {
    async getStates() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `states?page=0&limit=0&status=1`,
        });
        this.states = res.data.data;
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
    async getCities(area_id) {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `cities?page=0&limit=0&is_active=1&area_id=${area_id}`,
        });
        this.cities = res.data.data;
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
    // Start:: validate Form Inputs
    validateFormInputs() {
      this.isWaitingRequest = true;
      if (!this.data.name_ar || !this.data.name_en || !this.data.state || !this.data.city) {
        if (!this.data.name_ar) {
          this.isWaitingRequest = false;
          this.$message.error(this.$t("VALIDATION.name_ar"));
          return;
        }
        if (!this.data.name_en) {
          this.isWaitingRequest = false;
          this.$message.error(this.$t("VALIDATION.name_en"));
          return;
        }
        if (!this.data.state) {
          this.isWaitingRequest = false;
          this.$message.error(this.$t("VALIDATION.area"));
          return;
        }
        if (!this.data.city) {
          this.isWaitingRequest = false;
          this.$message.error(this.$t("VALIDATION.city"));
          return;
        }
      } else {
        this.submitForm();
      }
    },

    async submitForm() {
      const REQUEST_DATA = new FormData();
      // Start:: Append Request Data

      if (this.data.name_ar) {
        REQUEST_DATA.append("name[ar]", this.data.name_ar);
      }
      if (this.data.name_en) {
        REQUEST_DATA.append("name[en]", this.data.name_en);
      }
      if (this.data.state) {
        REQUEST_DATA.append("state", this.data.state?.id);
      }
      if (this.data.city) {
        REQUEST_DATA.append("city", this.data.city?.id);
      }
      REQUEST_DATA.append("status", this.data.active ? 1 : 0);
      REQUEST_DATA.append("_method", "PUT");
      try {
        await this.$axios({
          method: "POST",
          url: `districts/${this.$route.params?.id}`,
          data: REQUEST_DATA,
        });
        this.isWaitingRequest = false;
        this.$message.success(this.$t("MESSAGES.editedSuccessfully"));
        this.$router.push({ path: "/districts/all" });
      } catch (error) {
        this.isWaitingRequest = false;
        this.$message.error(error.response.data.message);
      }
    },

    // start show data
    async showDistrict() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `districts/${this.$route.params?.id}`,
        });
        this.data.name_ar = res.data.data.District?.trans?.name?.ar;
        this.data.name_en = res.data.data.District?.trans?.name?.en;
        this.data.state = res.data.data.District?.city?.state;
        this.data.city = res.data.data.District?.city;
        this.data.active = res.data.data.District.is_active ? 1 : 0;
        this.getCities(this.data.state?.id);
      } catch (error) {
        this.loading = false;
        console.log(error?.response?.data?.message);
      }
    },
    // end show data
  },

  created() {
    this.getStates();
    this.showDistrict();
  },
};
</script>

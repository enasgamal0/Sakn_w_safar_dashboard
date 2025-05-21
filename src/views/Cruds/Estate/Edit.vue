<template>
  <div class="crud_form_wrapper">
    <!-- Start:: Title -->
    <div class="form_title_wrapper">
      <h4>{{ $t("TITLES.editPackage") }}</h4>
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

          <!-- Start:: Number of Available Bids -->
          <base-select-input
            col="6"
            :optionsList="estateUses"
            :placeholder="$t('PLACEHOLDERS.estate_use')"
            v-model="data.estate_use"
            required
          />
          <!-- End:: Number of Available Bids -->

          <!-- Start:: Status Dropdown -->
          <base-select-input
            col="6"
            :optionsList="statusOptions"
            :placeholder="$t('PLACEHOLDERS.status')"
            v-model="data.is_active"
            required
          />
          <!-- End:: Status Dropdown -->

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
export default {
  name: "EditPackage",
  data() {
    return {
      isWaitingRequest: false,
      types: [],
      data: {
        name_ar: "",
        name_en: "",
        descAr: null,
        descEn: null,
        price: null,
        type: null,
        estate_use: null,
        price_after_discount: null,
        number_of_available_bids: null,
        package_duration: null,
        is_active: null,
      },
      statusOptions: [
        { id: 1, name: this.$t("STATUS.active"), value: 1 },
        { id: 0, name: this.$t("STATUS.notActive"), value: 0 },
      ],
      estateUses: [
        {
          id: 1,
          name: this.$t("PLACEHOLDERS.commercial"),
          value: "commercial",
        },
        {
          id: 2,
          name: this.$t("PLACEHOLDERS.residential"),
          value: "residential",
        },
      ],
    };
  },
  methods: {
    // Start:: validate Form Inputs
    validateFormInputs() {
      this.isWaitingRequest = true;
      this.submitForm();
    },
    // End:: validate Form Inputs
    async getTypes() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `estate-types?page=0&limit=0&status=1`,
        });
        this.types = res.data.data;
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
    // Start:: Submit Form
    async submitForm() {
      const REQUEST_DATA = new FormData();
      REQUEST_DATA.append("_method", "put");
      REQUEST_DATA.append("name[ar]", this.data.name_ar);
      REQUEST_DATA.append("name[en]", this.data.name_en);
      REQUEST_DATA.append("type", this.data.estate_use?.value);

      REQUEST_DATA.append("is_active", this.data.is_active?.value);

      try {
        await this.$axios({
          method: "POST",
          url: `estate-types/${this.$route.params.id}`,
          data: REQUEST_DATA,
        });
        this.isWaitingRequest = false;
        this.$message.success(this.$t("MESSAGES.editedSuccessfully"));
        this.$router.push({ path: "/estate_types/all" });
      } catch (error) {
        this.isWaitingRequest = false;
        this.$message.error(error.response.data.message);
      }
    },
    // End:: Submit Form
    // start show data
    async showPackage() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `estate-types/${this.$route.params?.id}`,
        });
        this.data.name_ar = res.data.data.EstateType.trans.name.ar;
        this.data.name_en = res.data.data.EstateType.trans.name.en;
        this.data.estate_use =
          res.data.data.EstateType.type === "Residential" || res.data.data.EstateType.type === "سكني"
            ? {
                id: 2,
                name: this.$t("PLACEHOLDERS.residential"),
                value: "residential",
              }
            : {
                id: 1,
                name: this.$t("PLACEHOLDERS.commercial"),
                value: "commercial",
              };
        this.data.is_active = res.data.data.EstateType.is_active
          ? { id: 1, name: this.$t("STATUS.active"), value: 1 }
          : { id: 0, name: this.$t("STATUS.notActive"), value: 0 };
      } catch (error) {
        this.loading = false;
        console.log(error?.response?.data?.message);
      }
    },
    // end show data
  },
  created() {
    this.showPackage();
    this.getTypes();
  },
};
</script>

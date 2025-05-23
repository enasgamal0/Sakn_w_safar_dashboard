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
          <!-- End:: Name Input -->

          <base-input
            col="6"
            type="textarea"
            :placeholder="$t('PLACEHOLDERS.descAr')"
            v-model.trim="data.descAr"
            required
          />
          <base-input
            col="6"
            type="textarea"
            :placeholder="$t('PLACEHOLDERS.descEn')"
            v-model.trim="data.descEn"
            required
          />

          <!-- Start:: Number of Available Auctions -->
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.price')"
            v-model.number="data.price"
            min="1"
            required
          />
          <!-- End:: Number of Available Auctions -->

          <!-- Start:: Number of Available Bids -->
          <base-select-input
            col="6"
            :optionsList="types"
            :placeholder="$t('PLACEHOLDERS.estate_type')"
            v-model="data.type"
            required
          />
          <!-- End:: Number of Available Bids -->

          <!-- Start:: Auction Order -->
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.price_after_discount')"
            v-model.number="data.price_after_discount"
            min="1"
          />
          <!-- End:: Auction Order -->

          <!-- Start:: Price Input -->
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.number_of_available_bids')"
            v-model.number="data.number_of_available_bids"
            min="1"
            required
          />
          <!-- End:: Price Input -->

          <!-- Start:: Price After Discount Input -->
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.package_duration')"
            v-model.number="data.package_duration"
            min="0"
            required
          />
          <!-- End:: Price After Discount Input -->

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
        price_after_discount: null,
        number_of_available_bids: null,
        package_duration: null,
        is_active: null,
      },
      statusOptions: [
        { id: 1, name: this.$t("STATUS.active"), value: 1 },
        { id: 0, name: this.$t("STATUS.notActive"), value: 0 },
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
      REQUEST_DATA.append("description[ar]", this.data.descAr);
      REQUEST_DATA.append("description[en]", this.data.descEn);
      REQUEST_DATA.append("price", this.data.price);
      REQUEST_DATA.append("estate_type_id", this.data.type?.id);
      REQUEST_DATA.append(
        "price_after_discount",
        this.data.price_after_discount
      );
      REQUEST_DATA.append("ads_number", this.data.number_of_available_bids);

      REQUEST_DATA.append("duration", this.data.package_duration);

      REQUEST_DATA.append("is_active", this.data.is_active?.value);

      try {
        await this.$axios({
          method: "POST",
          url: `packages/${this.$route.params.id}`,
          data: REQUEST_DATA,
        });
        this.isWaitingRequest = false;
        this.$message.success(this.$t("MESSAGES.editedSuccessfully"));
        this.$router.push({ path: "/packages/all" });
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
          url: `packages/${this.$route.params?.id}`,
        });
        this.data.name_ar = res.data.data.Package.trans.name.ar;
        this.data.name_en = res.data.data.Package.trans.name.en;
        this.data.descAr = res.data.data.Package.trans.description.ar;
        this.data.descEn = res.data.data.Package.trans.description.en;
        this.data.price = res.data.data.Package.price;
        this.data.type = res.data.data.Package.estate_type_id;
        this.data.price_after_discount =
          res.data.data.Package.price_after_discount;
        this.data.number_of_available_bids = res.data.data.Package.ads_number;
        this.data.package_duration = res.data.data.Package.duration;
        this.data.is_active = res.data.data.Package.is_active
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

<template>
  <div class="crud_form_wrapper">
    <!-- Start:: Title -->
    <div class="form_title_wrapper">
      <h4>{{ $t("TITLES.showPackage") }}</h4>
    </div>
    <div class="col-12 text-end">
      <v-btn @click="$router.go(-1)" style="color: #008274">
        <i class="fas fa-backward"></i>
      </v-btn>
    </div>
    <!-- End:: Title -->

    <!-- Start:: Single Step Form Content -->
    <div class="single_step_form_content_wrapper">
      <form>
        <div class="row">
          <!-- Start:: Name Input -->
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.nameAr')"
            v-model.trim="data.name_ar"
            disabled
          />
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.nameEn')"
            v-model.trim="data.name_en"
            disabled
          />
          <!-- End:: Name Input -->

          <base-input
            col="6"
            type="textarea"
            :placeholder="$t('PLACEHOLDERS.descAr')"
            v-model.trim="data.descAr"
            disabled
          />
          <base-input
            col="6"
            type="textarea"
            :placeholder="$t('PLACEHOLDERS.descEn')"
            v-model.trim="data.descEn"
            disabled
          />

          <!-- Start:: Number of Available Auctions -->
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.price')"
            v-model.number="data.price"
            min="1"
            disabled
          />
          <!-- End:: Number of Available Auctions -->

          <!-- Start:: Number of Available Bids -->
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.estate_type')"
            v-model.number="data.type"
            min="1"
            disabled
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
            disabled
          />
          <!-- End:: Price Input -->

          <!-- Start:: Price After Discount Input -->
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.package_duration')"
            v-model.number="data.package_duration"
            min="0"
            disabled
          />
          <!-- End:: Price After Discount Input -->

          <!-- Start:: Deactivate Switch Input -->
          <div class="input_wrapper switch_wrapper my-5">
            <v-switch
              color="green"
              :label="
                data.active
                  ? $t('PLACEHOLDERS.active')
                  : $t('PLACEHOLDERS.notActive')
              "
              v-model="data.active"
              hide-details
              disabled
            ></v-switch>
          </div>
          <!-- End:: Deactivate Switch Input -->
        </div>
      </form>
    </div>
    <!-- END:: Single Step Form Content -->
  </div>
</template>

<script>
export default {
  name: "ShowPackage",
  data() {
    return {
      isWaitingRequest: false,
      data: {
        color: null,
        name_ar: "",
        name_en: "",
        descAr: null,
        descEn: null,
        price: null,
        type: null,
        price_after_discount: null,
        number_of_available_bids: null,
        package_duration: null,
        active: null,
      },
      statusOptions: [
        { id: 1, name: this.$t("STATUS.active"), value: 1 },
        { id: 0, name: this.$t("STATUS.notActive"), value: 0 },
      ],
    };
  },
  methods: {
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
        this.data.type = res.data.data.Package.estate_type_id?.name;
        this.data.price_after_discount = res.data.data.Package.price_after_discount;
        this.data.number_of_available_bids = res.data.data.Package.ads_number;
        this.data.package_duration = res.data.data.Package.duration;
        this.data.active = +res.data.data.Package.is_active;
      } catch (error) {
        this.loading = false;
        console.log(error?.response?.data?.message);
      }
    },
    // end show data
  },
  created() {
    this.showPackage();
  },
};
</script>
<style>
.package_color {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}
</style>

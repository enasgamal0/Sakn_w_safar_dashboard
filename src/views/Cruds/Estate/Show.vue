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

          <!-- Start:: Number of Available Bids -->
           <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.estate_use')"
            v-model.trim="data.estate_use"
            disabled
          />
          <!-- End:: Number of Available Bids -->

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
        estate_use: null,
        price_after_discount: null,
        number_of_available_bids: null,
        package_duration: null,
        active: null,
      },
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
          url: `estate-types/${this.$route.params?.id}`,
        });
        this.data.name_ar = res.data.data.EstateType.trans.name.ar;
        this.data.name_en = res.data.data.EstateType.trans.name.en;
        this.data.estate_use = res.data.data.EstateType.type;
        
        this.data.active = +res.data.data.EstateType.is_active;
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

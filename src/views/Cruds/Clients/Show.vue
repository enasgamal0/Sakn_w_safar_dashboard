<template>
  <div class="crud_form_wrapper single_show_content_wrapper">
    <!-- Start:: Title -->
    <div class="form_title_wrapper">
      <h4>{{ $t("TITLES.showClient", { name: data.first_name }) }}</h4>
    </div>
    <div class="col-12 text-end">
      <v-btn @click="$router.go(-1)" style="color: #26A1D6">
        <i class="fas fa-backward"></i>
      </v-btn>
    </div>
    <!-- End:: Title -->

    <!-- Start:: Single Step Form Content -->
    <div class="single_step_form_content_wrapper">
      <!-- ==== Start:: Status Badges ==== -->
      <div class="badges_wrapper justify-content-between">
        <div class="wrapper">
          <v-chip color="amber darken-2" text-color="white">
            {{ $t("TITLES.numberOfVisits", { number: data.numberOfVisits }) }}
          </v-chip>
          <v-chip color="amber darken-2" text-color="white">
            {{ $t("TITLES.lastVisit", { date: data.lastVisit }) }}
          </v-chip>
        </div>

        <v-chip :color="data.active ? 'green' : 'red'" text-color="white">
          {{ data.active ? $t("STATUS.active") : $t("STATUS.notActive") }}
        </v-chip>
      </div>
      <!-- ==== End:: Status Badges ==== -->

      <!-- ==== Start:: Client Main Data ==== -->
      <form>
        <div class="row">
          <!-- Start:: Image Upload Input -->
          <div v-if="data.image">
            <!-- Display image -->
            <div class="preview-container text-center my-3">
              <img :src="data.image" alt="Category Icon" />
            </div>
          </div>
          <!-- End:: Image Upload Input -->

          <!-- Start:: first_name Input -->
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.first_name')"
            v-model.trim="data.first_name"
            disabled
            class="disabled_input"
          />
          <!-- End:: first_name Input -->

          <!-- Start:: last_name Input -->
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.last_name')"
            v-model.trim="data.last_name"
            disabled
            class="disabled_input"
          />
          <!-- End:: last_name Input -->

          <!-- Start:: Phone Input -->
          <base-input
            col="6"
            type="tel"
            :placeholder="$t('PLACEHOLDERS.phone')"
            v-model.trim="data.phone"
            readonly
            class="disabled_input"
          />
          <!-- End:: Phone Input -->

          <!-- Start:: Second Phone Input -->
          <!-- <base-input col="4" type="tel" :placeholder="$t('PLACEHOLDERS.secondPhone')" v-model.trim="data.secondPhone"
            readonly class="disabled_input" /> -->
          <!-- End:: Second Phone Input -->

          <!-- Start:: Email Input -->
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.email')"
            v-model.trim="data.email"
            readonly
            class="disabled_input"
          />
          <!-- End:: Email Input -->

          <!-- Start:: gender Input -->
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.gender')"
            v-model.trim="data.gender"
            readonly
            class="disabled_input"
          />
          <!-- End:: gender Input -->

          <!-- Start:: Joining Date Input -->
          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.birth_date')"
            v-model.trim="data.birth_date"
            readonly
            class="disabled_input"
          />
          <!-- End:: Joining Date Input -->
        </div>
      </form>
      <!-- ==== End:: Client Main Data ==== -->
    </div>
    <!-- End:: Single Step Form Content -->
  </div>
</template>

<script>
export default {
  name: "SingleClient",

  props: {
    id: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      // Start:: Loading Data
      isWaitingRequest: false,
      // End:: Loading Data

      // Start:: Table Data
      addressesTableHeaders: [
        { text: this.$t("TABLES.Addresses.serialNumber") },
        { text: this.$t("TABLES.Addresses.address") },
        { text: this.$t("TABLES.Addresses.longitude") },
        { text: this.$t("TABLES.Addresses.latitude") },
        { text: this.$t("TABLES.Addresses.type") },
        { text: this.$t("TABLES.Addresses.isDefault") },
      ],
      // End:: Table Data

      // Start:: Data
      data: {
        image: null,
        name: null,
        phone: null,
        secondPhone: null,
        email: null,
        birth_date: null,
        gender: null,
        currentPackage: null,
        addresses: [],
        active: false,
        numberOfVisits: null,
        lastVisit: null,
      },
      // End:: Data
    };
  },

  methods: {
    // Start:: Get Data To Show
    async getDataToShow() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `users/${this.$route.params.id}`,
        });
        console.log("DATA image =>", res.data.data);
        this.data.image = res.data.data.User.image;
        if (this.data.image == null) {
          this.data.image = require("@/assets/media/images/user_avatar.png");
        }
        this.data.first_name = res.data.data.User.first_name;
        this.data.last_name = res.data.data.User.last_name;
        this.data.phone = res.data.data.User.mobile;
        this.data.email = res.data.data.User.email;
        this.data.gender = res.data.data.User.gender;
        this.data.birth_date = res.data.data.User.birth_date;
        this.data.active = res.data.data.User.is_active;
        // this.data.secondPhone = res.data.data.User.second_phone;
        this.data.numberOfVisits = res.data.data.User.login_count;
        // back must return date as 2024-05-13
        this.data.lastVisit = res.data.data.User.last_login;
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
    // End:: Get Data To Show
  },

  created() {
    // Start:: Fire Methods
    this.getDataToShow();
    // End:: Fire Methods
  },
};
</script>
<style>
.preview-container img {
  max-width: 100%;
  max-height: 200px;
  border: 1px solid #ccc;
  border-radius: 15px;
}
</style>

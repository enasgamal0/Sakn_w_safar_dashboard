<template>
  <div class="crud_form_wrapper">
    <!-- Start:: Title -->
    <div class="form_title_wrapper">
      <h4>{{ $t("TITLES.addClient") }}</h4>
    </div>
    <div class="col-12 text-end">
      <v-btn @click="$router.go(-1)" style="color: #26A1D6">
        <i class="fas fa-backward"></i>
      </v-btn>
    </div>
    <!-- End:: Title -->

    <!-- Start:: Single Step Form Content -->
    <div class="single_step_form_content_wrapper">
      <form @submit.prevent="validateFormInputs">
        <div class="row">
          <base-image-upload-input
            col="12"
            identifier="image"
            :placeholder="$t('PLACEHOLDERS.image')"
            @selectImage="selectImage"
          />

          <!-- Start:: first_name Input -->
          <base-input
            col="4"
            type="text"
            :placeholder="$t('PLACEHOLDERS.name')"
            v-model.trim="data.name"
            required
          />
          <!-- End:: first_name Input -->
          <base-input
            col="4"
            type="text"
            :placeholder="$t('PLACEHOLDERS.email')"
            v-model.trim="data.email"
            required
          />
          <!-- End:: first_name Input -->

          <!-- Start:: mobile Input -->
          <base-input
            col="4"
            type="text"
            :placeholder="$t('PLACEHOLDERS.phone')"
            v-model.trim="data.mobile"
            required
          />
          <!-- End:: mobile Input -->

          <!-- Start:: Password Input -->
          <!-- <base-input
            col="6"
            type="password"
            :placeholder="$t('PLACEHOLDERS.password')"
            v-model.trim="data.password"
            required
          /> -->
          <!-- End:: Password Input -->

          <!-- Start:: Confirm Password Input -->
          <!-- <base-input
            col="6"
            type="password"
            :placeholder="$t('PLACEHOLDERS.confirmPassword')"
            v-model.trim="data.password_confirmation"
            required
          /> -->
          <!-- End:: Confirm Password Input -->

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
            ></v-switch>
          </div>
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
export default {
  name: "CreateArea",

  data() {
    return {
      // Start:: Loader Control Data
      isWaitingRequest: false,
      // End:: Loader Control Data

      // Start:: Data Collection To Send
      data: {
        image: {
          path: null,
          file: null,
        },
        first_name: null,
        last_name: null,
        mobile: null,
        password: null,
        password_confirmation: null,
        // active: true,
      },

      // End:: Data Collection To Send
    };
  },

  computed: {
    allTypes() {
      return [
        {
          id: 1,
          name: this.$t("PLACEHOLDERS.subscription"),
          value: "subscription",
        },
        {
          id: 2,
          name: this.$t("PLACEHOLDERS.commission"),
          value: "commission",
        },
      ];
    },
  },

  methods: {
    selectImage(selectedImage) {
      this.data.image = selectedImage;
    },
    // Start:: validate Form Inputs
    validateFormInputs() {
      this.isWaitingRequest = true;
      if (!this.data.first_name) {
        this.isWaitingRequest = false;
        this.$message.error(this.$t("VALIDATION.first_name"));
        return;
      } else if (!this.data.last_name) {
        this.isWaitingRequest = false;
        this.$message.error(this.$t("VALIDATION.last_name"));
        return;
      } else {
        this.submitForm();
        return;
      }
    },
    // End:: validate Form Inputs

    // Start:: Submit Form
    async submitForm() {
      const REQUEST_DATA = new FormData();

      if (this.data.image.file) {
        REQUEST_DATA.append("avatar", this.data.image.file);
      }
      // Start:: Append Request Data
      REQUEST_DATA.append("first_name", this.data.first_name);
      REQUEST_DATA.append("last_name", this.data.last_name);
      REQUEST_DATA.append("mobile", this.data.mobile);
      REQUEST_DATA.append("password", this.data.password);
      REQUEST_DATA.append(
        "password_confirmation",
        this.data.password_confirmation
      );
      // REQUEST_DATA.append("is_active", +this.data.active);
      // Start:: Append Request Data

      try {
        await this.$axios({
          method: "POST",
          url: `users`,
          data: REQUEST_DATA,
        });
        this.isWaitingRequest = false;
        this.$message.success(this.$t("MESSAGES.addedSuccessfully"));
        this.$router.push({ path: "/clients/all" });
      } catch (error) {
        this.isWaitingRequest = false;
        this.$message.error(error.response.data.message);
      }
    },
    // End:: Submit Form
  },

  async created() {},
};
</script>

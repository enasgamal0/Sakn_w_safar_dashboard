<template>
  <div class="crud_form_wrapper">
    <div class="form_title_wrapper">
      <h4>{{ $t("PLACEHOLDERS.edit_additional_field") }}</h4>
    </div>
    <div class="col-12 text-end">
      <v-btn @click="$router.go(-1)" style="color: #1f92d6">
        <i class="fas fa-backward"></i>
      </v-btn>
    </div>
    <div class="single_step_form_content_wrapper">
      <form @submit.prevent="validateFormInputs">
        <div class="row">
          <base-image-upload-input
            col="12"
            identifier="image"
            :placeholder="$t('PLACEHOLDERS.imageOrIcon')"
            @selectImage="selectImage"
            :preSelectedImage="data.image?.path"
            required
          />

          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.nameAr')"
            v-model.trim="data.nameAr"
            required
          />

          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.nameEn')"
            v-model.trim="data.nameEn"
            required
          />
          <!-- Start:: estate_types Input -->
          <base-select-input
            col="6"
            :optionsList="estate_types"
            :placeholder="$t('PLACEHOLDERS.estate_type')"
            v-model="data.estate_types"
            multiple
            required
          />
          <!-- End:: estate_types Input -->
          <base-select-input
            col="6"
            :optionsList="[
              { id: 1, name: $t('PLACEHOLDERS.required'), value: 1 },
              { id: 0, name: $t('PLACEHOLDERS.optional'), value: 0 },
            ]"
            v-model="data.field.is_required"
            :placeholder="$t('PLACEHOLDERS.field_required')"
            required
          />
          <base-select-input
            col="6"
            class="w-100"
            :optionsList="fieldTypes"
            :placeholder="$t('PLACEHOLDERS.field_type')"
            v-model="data.field.type"
            required
          />
          <div
            v-if="
              ['dropdown', 'radio', 'checkbox'].includes(data.field.type?.value)
            "
            class="col-12 mt-3"
          >
            <h6 class="font-weight-bold" style="color: #2a8e86">
              {{ $t("PLACEHOLDERS.options") }}:
            </h6>

            <div
              v-for="(option, optionIndex) in data.field.options"
              :key="'option' + optionIndex"
              class="d-flex align-items-center mb-2"
            >
              <base-input
                col="5"
                type="text"
                :placeholder="`${$t('PLACEHOLDERS.option_num')} #${
                  optionIndex + 1
                } ${$t('PLACEHOLDERS.option_name_ar')}`"
                v-model="option.ar"
                :required="optionIndex < 2"
              />
              <base-input
                col="5"
                type="text"
                :placeholder="`${$t('PLACEHOLDERS.option_num')} #${
                  optionIndex + 1
                } ${$t('PLACEHOLDERS.option_name_en')}`"
                v-model="option.en"
                :required="optionIndex < 2"
              />
              <div class="d-flex gap-3">
                <div class="add_another" @click="addOption()">
                  <i class="fas fa-plus"></i>
                </div>
                <div
                  v-if="data.field.options.length > 2"
                  class="add_another"
                  @click="removeOption(optionIndex)"
                >
                  <i class="fas fa-minus"></i>
                </div>
                <hr class="my-5 py-5" />
              </div>
            </div>
          </div>

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

          <div class="btn_wrapper">
            <base-button
              class="mt-2"
              styleType="primary_btn"
              :btnText="$t('BUTTONS.save')"
              :isLoading="isWaitingRequest"
              :disabled="isWaitingRequest"
            />
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "EditArea",

  computed: {
    fieldTypes() {
      return [
        { id: 0, name: this.$t("PLACEHOLDERS.text"), value: "text" },
        { id: 1, name: this.$t("PLACEHOLDERS.number"), value: "number" },
        { id: 2, name: this.$t("PLACEHOLDERS.textarea"), value: "textarea" },
        { id: 5, name: this.$t("PLACEHOLDERS.checkbox"), value: "checkbox" },
        { id: 4, name: this.$t("PLACEHOLDERS.radio"), value: "radio" },
        { id: 3, name: this.$t("PLACEHOLDERS.dropdown"), value: "dropdown" },
      ];
    },
  },

  data() {
    return {
      estate_types: [],
      isWaitingRequest: false,
      data: {
        estate_types: null,
        image: { path: null, file: null },
        nameAr: null,
        nameEn: null,
        active: true,
        field: {
          nameAr: "",
          nameEn: "",
          type: { value: "text" },
          options: [{ ar: "", en: "" }],
          is_required: null,
        },
      },
    };
  },

  methods: {
    addOption() {
      this.data.field.options.push({ ar: "", en: "" });
    },

    removeOption(optionIndex) {
      this.data.field.options.splice(optionIndex, 1);
    },

    selectImage(selectedImage) {
      this.data.image = selectedImage;
    },

    validateFormInputs() {
      this.isWaitingRequest = true;

      if (!this.data.nameAr) {
        this.isWaitingRequest = false;
        this.$message.error(this.$t("VALIDATION.nameAr"));
        return;
      }

      if (!this.data.nameEn) {
        this.isWaitingRequest = false;
        this.$message.error(this.$t("VALIDATION.nameEn"));
        return;
      }

      const field = this.data.field;
      const type = field.type?.value;

      if (["dropdown", "checkbox", "radio"].includes(type)) {
        if (!field.options || field.options.length < 2) {
          this.$message.error(this.$t("VALIDATION.at_least_two_options"));
          this.isWaitingRequest = false;
          return;
        }
      }

      this.submitForm();
    },
    //     submitForm() {
    //   this.isWaitingRequest = true;
    //   const id = this.$route.params.id;

    //   const REQUEST_DATA = new URLSearchParams();

    //   if (this.data.image?.file) {
    //     // You can't send files with x-www-form-urlencoded
    //     // Either convert to base64 or handle differently
    //     this.$message.error("Image upload not supported with x-www-form-urlencoded");
    //     this.isWaitingRequest = false;
    //     return;
    //   }

    //   REQUEST_DATA.append("name[ar]", this.data.nameAr);
    //   REQUEST_DATA.append("name[en]", this.data.nameEn);
    //   REQUEST_DATA.append("description[ar]", "وصف");
    //   REQUEST_DATA.append("description[en]", "description");
    //   REQUEST_DATA.append("type", this.data.field.type?.value);
    //   REQUEST_DATA.append("is_required", this.data.field.is_required?.value);
    //   REQUEST_DATA.append("is_active", +this.data.active ? 1 : 0);

    //   this.data.estate_types?.forEach((type, index) => {
    //     REQUEST_DATA.append(`estate_types[${index}]`, type.id);
    //   });

    //   if (
    //     ["dropdown", "radio", "checkbox"].includes(this.data.field.type?.value)
    //   ) {
    //     this.data.field.options?.forEach((option, optIndex) => {
    //       REQUEST_DATA.append(`options[${optIndex}][name][ar]`, option.ar);
    //       REQUEST_DATA.append(`options[${optIndex}][name][en]`, option.en);
    //     });
    //   }

    //   this.$axios({
    //     method: "PUT",
    //     url: `additional-fields/${id}`,
    //     data: REQUEST_DATA.toString(), // send as raw string
    //     headers: {
    //       "Content-Type": "application/x-www-form-urlencoded",
    //     },
    //   })
    //     .then(() => {
    //       this.$message.success(this.$t("MESSAGES.editedSuccessfully"));
    //       this.$router.push({ path: "/additional-fields/all" });
    //     })
    //     .catch((error) => {
    //       this.$message.error(error.response?.data?.message);
    //     })
    //     .finally(() => {
    //       this.isWaitingRequest = false;
    //     });
    // }

    submitForm() {
      this.isWaitingRequest = true;
      const REQUEST_DATA = new FormData();
      const id = this.$route.params.id;

      if (this.data.image?.file) {
        REQUEST_DATA.append("icon", this.data.image?.file);
      }

      REQUEST_DATA.append("name[ar]", this.data.nameAr);
      REQUEST_DATA.append("name[en]", this.data.nameEn);
      REQUEST_DATA.append("description[ar]", "وصف");
      REQUEST_DATA.append("description[en]", "description");
      REQUEST_DATA.append("type", this.data.field.type?.value);
      REQUEST_DATA.append("is_required", this.data.field.is_required?.value);
      REQUEST_DATA.append("is_active", +this.data.active ? 1 : 0);

      this.data.estate_types?.forEach((type, index) => {
        REQUEST_DATA.append(`estate_types[${index}]`, type.id);
      });

      if (
        ["dropdown", "radio", "checkbox"].includes(this.data.field.type?.value)
      ) {
        this.data.field.options?.forEach((option, optIndex) => {
          REQUEST_DATA.append(`options[${optIndex}][name][ar]`, option.ar);
          REQUEST_DATA.append(`options[${optIndex}][name][en]`, option.en);
        });
      }

      this.$axios({
        method: "PUT",
        url: `additional-fields/${id}`,
        data: REQUEST_DATA,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
        .then(() => {
          this.$message.success(this.$t("MESSAGES.editedSuccessfully"));
          this.$router.push({ path: "/additional-fields/all" });
        })
        .catch((error) => {
          this.$message.error(error.response?.data?.message);
        })
        .finally(() => {
          this.isWaitingRequest = false;
        });
    },
    async getEstateTypes() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `estate-types?page=0&limit=0&status=1`,
        });
        this.estate_types = res.data.data;
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
    async fetchFieldData() {
      try {
        const { id } = this.$route.params;
        const res = await this.$axios.get(`additional-fields/${id}`);
        const field = res.data.data.AdditionalField;

        this.data.nameAr = field.trans?.name?.ar || "";
        this.data.nameEn = field.trans?.name?.en || "";
        this.data.active = !!field.is_active;
        this.data.image.path = field.icon;
        this.data.field.type = this.fieldTypes.find(
          (t) => t.value === field.type
        ) || { value: "text" };
        this.data.field.is_required = [
          { id: 1, name: this.$t("PLACEHOLDERS.required"), value: 1 },
          { id: 0, name: this.$t("PLACEHOLDERS.optional"), value: 0 },
        ].find((item) => item.value === field.is_required);
        this.data.field.options =
          Array.isArray(field.options) && field.options.length
            ? field.options.map((opt) => ({
                ar: opt.name?.ar || "",
                en: opt.name?.en || "",
              }))
            : [{ ar: "", en: "" }];
        this.data.estate_types =
          field.estate_types?.map((type) => ({
            id: type.id,
            name: type.name,
          })) || [];
      } catch (err) {
        this.$message.error(
          err.response?.data?.message || "Error loading data"
        );
      }
    },
  },
  created() {
    // Start:: Fire Methods
    this.fetchFieldData();
    this.getEstateTypes();
    // End:: Fire Methods
  },
};
</script>

<style lang="scss">
.add_another {
  border: none;
  padding: 8px;
  width: 40px;
  height: 40px;
  border: 1px solid var(--light_gray_clr);
  border-radius: 50%;
  font-size: 18px;
  color: var(--light_gray_clr);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin: auto !important;
}
</style>

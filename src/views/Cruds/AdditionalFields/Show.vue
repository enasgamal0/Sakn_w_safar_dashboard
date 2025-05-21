<template>
  <div class="crud_form_wrapper">
    <div class="form_title_wrapper">
      <h4>{{ $t("PLACEHOLDERS.show_additional_field") }}</h4>
    </div>
    <div class="col-12 text-end">
      <v-btn @click="$router.go(-1)" style="color: #1f92d6">
        <i class="fas fa-backward"></i>
      </v-btn>
    </div>
    <div class="single_step_form_content_wrapper">
      <form>
        <div class="row">
          <div class="preview-container text-center my-3">
            <img
              :src="data.image?.path"
              alt="Image"
              v-if="data.image?.path"
            />
          </div>

          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.nameAr')"
            v-model.trim="data.nameAr"
            disabled
          />

          <base-input
            col="6"
            type="text"
            :placeholder="$t('PLACEHOLDERS.nameEn')"
            v-model.trim="data.nameEn"
            disabled
          />
          <!-- Start:: estate_types Input -->
          <base-select-input
            col="6"
            :optionsList="estate_types"
            :placeholder="$t('PLACEHOLDERS.estate_type')"
            v-model="data.estate_types"
            multiple
            disabled
          />
          <!-- End:: estate_types Input -->
          <base-select-input
            col="6"
            :optionsList="[
              { id: 1, name: $t('PLACEHOLDERS.required'), value: 1 },
              { id: 0, name: $t('PLACEHOLDERS.optional'), value: 0 },
            ]"
            v-model="data.field.is_disabled"
            :placeholder="$t('PLACEHOLDERS.field_required')"
            disabled
          />
          <base-select-input
            col="6"
            class="w-100"
            :optionsList="fieldTypes"
            :placeholder="$t('PLACEHOLDERS.field_type')"
            v-model="data.field.type"
            disabled
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
                disabled
              />
              <base-input
                col="5"
                type="text"
                :placeholder="`${$t('PLACEHOLDERS.option_num')} #${
                  optionIndex + 1
                } ${$t('PLACEHOLDERS.option_name_en')}`"
                v-model="option.en"
                disabled
              />
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
              disabled
            ></v-switch>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "ShowArea",

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
          is_disabled: null,
        },
      },
    };
  },

  methods: {
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
        this.data.field.is_disabled = [
          { id: 1, name: this.$t("PLACEHOLDERS.disabled"), value: 1 },
          { id: 0, name: this.$t("PLACEHOLDERS.optional"), value: 0 },
        ].find((item) => item.value === field.is_disabled);
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

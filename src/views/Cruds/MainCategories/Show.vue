<template>
  <div class="crud_form_wrapper">
    <div class="form_title_wrapper">
      <h4>{{ $t("PLACEHOLDERS.show_main_section") }}</h4>
    </div>
    <div class="col-12 text-end">
      <v-btn @click="$router.go(-1)" style="color: #1f92d6">
        <i class="fas fa-backward"></i>
      </v-btn>
    </div>
    <div class="single_step_form_content_wrapper">
      <form @submit.prevent="validateFormInputs">
        <div class="row">
          <div class="preview-container text-center my-3">
            <img
              col="12"
              :src="data.image?.path"
              :alt="$t('PLACEHOLDERS.personalImage')"
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
          <h5 class="text-center font-weight-bold mt-5" style="color: #1F92D6">{{ $t("PLACEHOLDERS.additional_fields") }}</h5>
          <div class="w-100">
            <div class="row justify-content-center">
              <div
                class="col-12"
                v-for="(item, index) in data.fields"
                :key="'l' + index"
              >
                <div class="item d-flex flex-wrap align-items-center">
                  <base-input
                    col="4"
                    class="w-100"
                    type="text"
                    :placeholder="$t('PLACEHOLDERS.field_name_ar')"
                    v-model.trim="item.name_ar"
                    disabled
                  />
                  <base-input
                    col="4"
                    class="w-100"
                    type="text"
                    :placeholder="$t('PLACEHOLDERS.field_name_en')"
                    v-model.trim="item.name_en"
                    disabled
                  />
                  <base-select-input
                    col="4"
                    class="w-100"
                    :optionsList="fieldTypes"
                    :placeholder="$t('PLACEHOLDERS.field_type')"
                    v-model="item.type"
                    disabled
                  />
                </div>
                <div v-if="item.options">
                  <h6 class="font-weight-bold" style="color: #1F92D6">{{ $t("PLACEHOLDERS.options") }}:</h6>
                  <div v-for="(option, optionIndex) in item.options" :key="'option' + optionIndex">
                      <div class="d-flex">
                        <base-input
                          col="5"
                          type="text"
                          :placeholder="$t('PLACEHOLDERS.option_name_ar')"
                          v-model="option.name_ar"
                          disabled
                        />
                        <base-input
                          col="5"
                          type="text"
                          :placeholder="$t('PLACEHOLDERS.option_name_en')"
                          v-model="option.name_en"
                          disabled
                        />
                      </div>
                    </div>
                </div>
                <hr class="my-5">
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
  name: "CreateArea",

  computed: {
    fieldTypes() {
      return [
        {
          id: 0,
          name: this.$t("PLACEHOLDERS.text"),
          value: "text",
        },
        {
          id: 1,
          name: this.$t("PLACEHOLDERS.attachments"),
          value: "file",
        },
        {
          id: 2,
          name: this.$t("PLACEHOLDERS.ddl"),
          value: "dropdown",
        },
      ];
    },
  },

  data() {
    return {
      isWaitingRequest: false,
      data: {
        image: {
          path: null,
          file: null,
        },
        nameAr: null,
        nameEn: null,
        active: true,
        fields: [
          {
            nameAr: "",
            nameEn: "",
            type: "text",
          },
        ],
      },
    };
  },

  methods: {
    addRow() {
      // Add new field object with index for proper binding
      this.data?.fields.push({
        nameAr: "",
        nameEn: "",
        type: "text",
      });
    },

    removeRow(index) {
      this.data?.fields.splice(index, 1);
    },

    selectImage(selectedImage) {
      this.data.image = selectedImage;
    },

    // Start:: Get Data To Edit
    async getDataToEdit() {
      try {
        let res = await this.$axios({
          method: "GET",
          url: `categories/${this.$route.params.id}`,
        });
        // Start:: Set Data
        this.data.image.path = res.data.data.Category.logo;
        this.data.nameAr = res.data.data.Category.name_ar;
        this.data.nameEn = res.data.data.Category.name_en;
        this.data.fields = res.data.data.Category.fields.map((field) => ({
          id: field.id,
          name_ar: field.name_ar,
          name_en: field.name_en,
          options: field.options,
          type: {
            id: 0,
            value: field.type,
            name:
              field.type == "dropdown"
                ? this.$t("PLACEHOLDERS.ddl")
                : field.type == "text"
                ? this.$t("PLACEHOLDERS.text")
                : field.type == "file"
                ? this.$t("PLACEHOLDERS.attachments")
                : field.type,
          },
        }));
        this.data.active = res.data.data.Category.is_active;
        // End:: Set Data
      } catch (error) {
        console.log(error.response.data.message);
      }
    },
    // End:: Get Data To Edit
  },

  async created() {
    // Start:: Fire Methods
    this.getDataToEdit();
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
<template>
  <div class="crud_form_wrapper">
    <div class="form_title_wrapper">
      <h4>{{ $t("PLACEHOLDERS.add_main_section") }}</h4>
    </div>
    <div class="col-12 text-end">
      <v-btn @click="$router.go(-1)" style="color: #1F92D6">
        <i class="fas fa-backward"></i>
      </v-btn>
    </div>
    <div class="single_step_form_content_wrapper">
      <form @submit.prevent="validateFormInputs">
        <div class="row">
          <base-image-upload-input
            col="12"
            identifier="image"
            :placeholder="$t('PLACEHOLDERS.section_image')"
            @selectImage="selectImage"
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
          <h5 class="text-center font-weight-bold my-5" style="color: #1F92D6">{{ $t("PLACEHOLDERS.additional_fields") }}</h5>
          <div>
            <div class="row justify-content-center">
              <div class="col-l2">
                <div class="add_another" @click="addRow">
                  <i class="fas fa-plus"></i>
                </div>
              </div>
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
                    v-model.trim="item.nameAr"
                  />
                  <base-input
                    col="4"
                    class="w-100"
                    type="text"
                    :placeholder="$t('PLACEHOLDERS.field_name_en')"
                    v-model.trim="item.nameEn"
                  />
                  <base-select-input
                    col="3"
                    class="w-100"
                    :optionsList="fieldTypes"
                    :placeholder="$t('PLACEHOLDERS.field_type')"
                    v-model="item.type"
                  />
                  <div class="all_actions" v-if="data.fields?.length > 1">
                    <span class="add_another" @click="removeRow(index)">
                      <i class="fas fa-minus"></i>
                    </span>
                  </div>
                  <div v-if="item.type.value === 'dropdown'" class="col-12">
                    <h6 class="font-weight-bold" style="color: #1F92D6">{{ $t("PLACEHOLDERS.options") }}:</h6>
                    <div v-for="(option, optionIndex) in item.options" :key="'option' + optionIndex">
                      <div class="d-flex">
                        <base-input
                          col="5"
                          type="text"
                          :placeholder="$t('PLACEHOLDERS.option_name_ar')"
                          v-model="option.ar"
                        />
                        <base-input
                          col="5"
                          type="text"
                          :placeholder="$t('PLACEHOLDERS.option_name_en')"
                          v-model="option.en"
                        />
                        <div class="d-flex gap-3">
                          <div class="add_another" @click="addOption(index)">
                            <i class="fas fa-plus"></i>
                          </div>
                          <div v-if="item.options.length > 1" class="add_another" @click="removeOption(index, optionIndex)">
                            <i class="fas fa-minus"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <hr class="my-5 py-5">
              </div>
            </div>
          </div>

          <div class="input_wrapper switch_wrapper my-5">
            <v-switch
              color="green"
              :label="data.active ? $t('PLACEHOLDERS.active') : $t('PLACEHOLDERS.notActive')"
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
  name: "CreateArea",

  computed: {
    fieldTypes() {
      return [
        { id: 0, name: this.$t("PLACEHOLDERS.text"), value: "text" },
        { id: 1, name: this.$t("PLACEHOLDERS.attachments"), value: "file" },
        { id: 2, name: this.$t("PLACEHOLDERS.ddl"), value: "dropdown" },
      ];
    },
  },

  data() {
    return {
      isWaitingRequest: false,
      data: {
        image: { path: null, file: null },
        nameAr: null,
        nameEn: null,
        active: true,
        fields: [
          {
            type: "text",
            options: [{ar: "", en: ""}],
          },
        ],
      },
    };
  },

  methods: {
    addRow() {
      this.data?.fields.push({
        type: "text",
        options: [{ar: "", en: ""}],
      });
    },

    removeRow(index) {
      this.data?.fields.splice(index, 1);
    },

    addOption(index) {
      console.log("this.data.fields", this.data.fields)
      const field = this.data.fields[index];
        field.options.push({ ar: "", en: "" });
    },

    removeOption(index, optionIndex) {
      const field = this.data.fields[index];
        field.options.splice(optionIndex, 1);
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
      } else if (!this.data.nameEn) {
        this.isWaitingRequest = false;
        this.$message.error(this.$t("VALIDATION.nameEn"));
        return;
      } else {
        this.submitForm();
        return;
      }
    },

    async submitForm() {
      const REQUEST_DATA = new FormData();

      if (this.data.image.file) {
        REQUEST_DATA.append("logo", this.data.image.file);
      }
      REQUEST_DATA.append("name[ar]", this.data.nameAr);
      REQUEST_DATA.append("name[en]", this.data.nameEn);
      REQUEST_DATA.append("is_active", +this.data.active);

      this.data?.fields.forEach((item, index) => {
        REQUEST_DATA.append(`categories[field_name][ar][${index}]`, item.nameAr);
        REQUEST_DATA.append(`categories[field_name][en][${index}]`, item.nameEn);
        REQUEST_DATA.append(`categories[field_name][type][${index}]`, item.type?.value);

        // Add options for dropdown fields
        if (item.type.value == "dropdown") {
          item.options.forEach((option, optionIndex) => {
            REQUEST_DATA.append(`categories[field_name][dropdown][${index}][${optionIndex}][ar]`, option.ar);
            REQUEST_DATA.append(`categories[field_name][dropdown][${index}][${optionIndex}][en]`, option.en);
          });
        }
      });

      try {
        await this.$axios({
          method: "POST",
          url: "categories",
          data: REQUEST_DATA,
        });
        this.isWaitingRequest = false;
        this.$message.success(this.$t("MESSAGES.addedSuccessfully"));
        this.$router.push({ path: "/categories/all" });
      } catch (error) {
        this.isWaitingRequest = false;
        this.$message.error(error.response.data.message);
      }
    },
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

import {createSlice} from '@reduxjs/toolkit';
export const GlobalStateSlice = createSlice({
  name: 'GlobalStateSlice',
  initialState: {
    serach: false,
    projectTab: 0,
    jobTab: 0,
    serviceTab: 0,
    serviceItem:{},
    qouteItem:{},
    languageTaxonomy: [],
    locationTaxonomy: [],
    categoryTaxonomy: [],
    serviceCategoryTaxonomy: [],
    skillTaxonomy: [],
    durationTaxonomy: [],
    countryTaxonomy: [],
    portfolioCategoriesTaxonomy: [],
    portfolioTagsTaxonomy: [],
    englishLevelTaxonomy: [],
    deliveryTaxonomy: [],
    responseTimeTaxonomy : [],
    freelancerTypeTaxonomy : [],
    projectLevelTaxonomy: [],
    LocationTypeTaxonomy: [],
    industrialExperienceTaxonomy : [],
    industrialExpCategoriesTaxonomy:[],
    specializationTaxonomy : [],
    departmentsTaxonomy: [],
    NoEmployeeTaxonomy :[],
    hourlyRateTaxonomy:[],
    projectExperienceTaxonomy:[],
    reasonTypeTaxonomy:[]
  },
  reducers: {
    updateSearchView: (state, action) => {
      state.serach = action.payload;
    },
    updateProjectTab: (state, action) => {
      state.projectTab = action.payload;
    },
    updateJobTab: (state, action) => {
      state.jobTab = action.payload;
    },
    updateServiceTab: (state, action) => {
      state.serviceTab = action.payload;
    },
    updateServiceItem: (state, action) => {
      state.serviceItem = action.payload;
    },
    updateQouteItem: (state, action) => {
      state.qouteItem = action.payload;
    },
    updateLanguageTaxonomy: (state, action) => {
      state.languageTaxonomy = action.payload;
    },
    updateLocationTaxonomy: (state, action) => {
      state.locationTaxonomy = action.payload;
    },
    updateCategoryTaxonomy: (state, action) => {
      state.categoryTaxonomy = action.payload;
    },
    updateSkillTaxonomy: (state, action) => {
      state.skillTaxonomy = action.payload;
    },
    updateDurationTaxonomy: (state, action) => {
      state.durationTaxonomy = action.payload;
    },
    updateCountryTaxonomy: (state, action) => {
      state.countryTaxonomy = action.payload;
    },
    updatePortfolioCategoriesTaxonomy: (state, action) => {
      state.portfolioCategoriesTaxonomy = action.payload;
    },
    updatePortfolioTagTaxonomy: (state, action) => {
      state.portfolioTagsTaxonomy = action.payload;
    },
    updateEnglishLevelTaxonomy: (state, action) => {
      state.englishLevelTaxonomy = action.payload;
    },
    updateDeliveryTaxonomy: (state, action) => {
      state.deliveryTaxonomy = action.payload;
    },
    updateResponseTimeTaxonomy: (state, action) => {
      state.responseTimeTaxonomy = action.payload;
    },
    updateFreelancerTypeTaxonomy: (state, action) => {
      state.freelancerTypeTaxonomy = action.payload;
    },
    updateServiceCategoryTaxonomy: (state, action) => {
      state.serviceCategoryTaxonomy = action.payload;
    },
    updateProjectLevelTaxonomy: (state, action) => {
      state.projectLevelTaxonomy = action.payload
    },
    updateLocationTypeTaxonomy: (state, action)=>  {
      state.LocationTypeTaxonomy = action.payload
    },
    updateIndustrialExperienceTaxonomy: (state, action) => {
      state.industrialExperienceTaxonomy = action.payload;
    },
    updateIndustrialExpCategoriesTaxonomy: (state, action) => {
      state.industrialExpCategoriesTaxonomy = action.payload;
    },
    updateSpecializationTaxonomy: (state, action) => {
      state.specializationTaxonomy = action.payload;
    },
    updateDepartmentsTaxonomy: (state, action) => {
      state.departmentsTaxonomy = action.payload;
    },
    updateNoEmployesTaxonomy: (state, action) => {
      state.NoEmployeeTaxonomy = action.payload;
    },
    updateHourlyRateTaxonomy: (state, action) => {
      state.hourlyRateTaxonomy = action.payload;
    },
    updateProjectExperience: (state, action) => {
      state.projectExperienceTaxonomy = action.payload;
    },
    updateReasonTypeTaxonomy: (state, action) => {
      state.reasonTypeTaxonomy = action.payload;
    },
  },
});
export const {
  updateSearchView,
  updateProjectTab,
  updateJobTab,
  updateServiceTab,
  updateServiceItem,
  updateQouteItem,
  updateLanguageTaxonomy,
  updateLocationTaxonomy,
  updateCategoryTaxonomy,
  updateServiceCategoryTaxonomy,
  updateSkillTaxonomy,
  updateDurationTaxonomy,
  updateCountryTaxonomy,
  updatePortfolioCategoriesTaxonomy,
  updatePortfolioTagTaxonomy,
  updateEnglishLevelTaxonomy,
  updateDeliveryTaxonomy,
  updateResponseTimeTaxonomy,
  updateFreelancerTypeTaxonomy,
  updateProjectLevelTaxonomy,
  updateLocationTypeTaxonomy,
  updateIndustrialExperienceTaxonomy,
  updateIndustrialExpCategoriesTaxonomy,
  updateSpecializationTaxonomy,
  updateDepartmentsTaxonomy,
  updateNoEmployesTaxonomy,
  updateHourlyRateTaxonomy,
  updateProjectExperience,
  updateReasonTypeTaxonomy
} = GlobalStateSlice.actions;
export default GlobalStateSlice.reducer;

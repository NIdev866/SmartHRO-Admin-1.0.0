import _ from 'lodash'
import { COMPANIES, 
  ALL_CAMPAIGNS, 
  ALL_JOBSEEKERS_BY_CAMPAIGN, 
  UPDATE_JOBSEEKERSTATUS_TO_SELECTED,
  NEST_JOBSEEKERS_INTO_CAMPAIGNS,
  CLEAR_ALL_JOBSEEKERS_STATE,
  NESTED_JOB_SECTORS,
  WORKFORCE,
  COUNTER_OF_JOBSEEKERS_BY_CAMPAIGN_ID_TO_FIX_GLITCH,
  RESET_TO_ZERO_COUNTER_OF_JOBSEEKERS_BY_CAMPAIGN_ID_TO_FIX_GLITCH,
  FLATTEN_ALL_JOBSEEKERS_BY_CAMPAIGN_INTO_ONE_ARRAY,
  CREATE_CAMPAIGN_SUBMITTING_STARTED,
  CREATE_CAMPAIGN_SUBMITTING_SUCCESSFUL,
  CREATE_CAMPAIGN_SUBMITTING_FAILED,
  CLEAR_NESTED_CAMPAIGNS_WITH_JOBSEEKERS_STATE,
  CLEAR_ALL_CAMPAIGNS,

  FETCH_ADDITIONAL_QUESTIONS
  } from '../actions/types.js';

export default function(state = {}, action){
    switch(action.type){
        case COMPANIES:
            return { ...state, companies: action.payload}

        case ALL_CAMPAIGNS:
          return { ...state, allCampaigns: action.payload }

        case ALL_JOBSEEKERS_BY_CAMPAIGN:
          if(state.jobseekersByCampaign){
            let stateHardCopy = Object.assign({}, state)
            stateHardCopy.jobseekersByCampaign.push(action.payload.data) 
            let result = stateHardCopy.jobseekersByCampaign
            return { ...stateHardCopy, jobseekersByCampaign: result }
          }
          else{
            return { ...state, jobseekersByCampaign: [action.payload.data] }
          }

        case NEST_JOBSEEKERS_INTO_CAMPAIGNS:
          let nestedCampaigns = state.allCampaigns.map((campaign)=>{
            let correctJobseekers = state.jobseekersByCampaign.filter((jobseekerGroup)=>{
              if(jobseekerGroup.length > 0){
                return (jobseekerGroup[0].campaign_id === campaign.campaign_id)
              }
            })
            campaign.jobseekers = correctJobseekers
            return campaign
          })

          console.log(nestedCampaigns)

          return { ...state, campaignsWithNestedJobseekers: nestedCampaigns }

        case CLEAR_NESTED_CAMPAIGNS_WITH_JOBSEEKERS_STATE:
          return { ...state, campaignsWithNestedJobseekers: null }

        case CLEAR_ALL_CAMPAIGNS:
          return { ...state, allCampaigns: null }

        case CLEAR_ALL_JOBSEEKERS_STATE:
          return { ...state, jobseekersByCampaign: null }

        case NESTED_JOB_SECTORS:
          return { ...state, nestedJobSectors: action.payload }

        case UPDATE_JOBSEEKERSTATUS_TO_SELECTED:
          let stateHardCopy = Object.assign({}, state)
          stateHardCopy.jobseekersByCampaign.push(action.payload.data) 
          let result = stateHardCopy.jobseekersByCampaign
          return { ...stateHardCopy, jobseekersByCampaign: result }

        case WORKFORCE:
          return { ...state , workforce: action.payload}

        case COUNTER_OF_JOBSEEKERS_BY_CAMPAIGN_ID_TO_FIX_GLITCH:
          if(!state.counterOfJobseekersByCampaignIdToFixGlitch){
            state.counterOfJobseekersByCampaignIdToFixGlitch = 0
          }
          return { ...state, counterOfJobseekersByCampaignIdToFixGlitch: state.counterOfJobseekersByCampaignIdToFixGlitch + 1 }
        
        case RESET_TO_ZERO_COUNTER_OF_JOBSEEKERS_BY_CAMPAIGN_ID_TO_FIX_GLITCH:
          return { ...state, counterOfJobseekersByCampaignIdToFixGlitch: 0}

        case FLATTEN_ALL_JOBSEEKERS_BY_CAMPAIGN_INTO_ONE_ARRAY:
          let flattenedResult = []
          state.jobseekersByCampaign.map((jobseekerGroup)=>{
            jobseekerGroup.map((jobseeker)=>{
              flattenedResult.push(jobseeker)
            })
          })
          console.log({flattenedResult})
          function removeDuplicates(myArr, prop) {
              return myArr.filter((obj, pos, arr) => {
                  return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
              });
          }
          return {...state, allJobseekersByCampaignFlattenedIntoOneArray: removeDuplicates(flattenedResult, "jobseeker_id")}

        case CREATE_CAMPAIGN_SUBMITTING_STARTED:
          return {...state, createCampaignSubmittingStarted: true, createCampaignSubmittingSuccessful: false, createCampaignSubmittingFailed: false}

        case CREATE_CAMPAIGN_SUBMITTING_SUCCESSFUL:
          return {...state, createCampaignSubmittingStarted: false, createCampaignSubmittingSuccessful: true, createCampaignSubmittingFailed: false}

        case CREATE_CAMPAIGN_SUBMITTING_FAILED:
          return {...state, createCampaignSubmittingStarted: false, createCampaignSubmittingSuccessful: false, createCampaignSubmittingFailed: true}

        case FETCH_ADDITIONAL_QUESTIONS:
          return {...state, additionalQuestions: action.payload}
    }

    return state;
}

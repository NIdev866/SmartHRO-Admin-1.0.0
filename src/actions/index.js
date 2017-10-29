import React from 'react';
import axios from 'axios';
import _ from 'lodash'

import { SUBMIT_BANK_DETAILS } from './types.js';

import {
  AUTH_USER,
  UNAUTH_USER,
  AUTH_ERROR,
  CLEAR_AUTH_ERROR,
  NESTED_JOB_SECTORS,
  COMPANIES,
  ALL_CAMPAIGNS,
  ALL_JOBSEEKERS_BY_CAMPAIGN,
  UPDATE_JOBSEEKERSTATUS_TO_SELECTED,
  LOCALLY_UPDATE_JOBSEEKERSTATUS_TO_SELECTED,
  NEST_JOBSEEKERS_INTO_CAMPAIGNS,
  CLEAR_NESTED_CAMPAIGNS_WITH_JOBSEEKERS_STATE,
  CLEAR_ALL_CAMPAIGNS,
  CLEAR_ALL_JOBSEEKERS_STATE,
  WORKFORCE,
  COUNTER_OF_JOBSEEKERS_BY_CAMPAIGN_ID_TO_FIX_GLITCH,
  RESET_TO_ZERO_COUNTER_OF_JOBSEEKERS_BY_CAMPAIGN_ID_TO_FIX_GLITCH,
  FLATTEN_ALL_JOBSEEKERS_BY_CAMPAIGN_INTO_ONE_ARRAY,

  FETCH_ADDITIONAL_QUESTIONS
} from './types.js';



/*============================================

REASON FOR SUCH SHORT SYNTAX ON ACTIONS:


in the main index.js file 'promise' middleware from
'redux-promise' is used which allows for not having
to use 'then' and 'catch' of typical promise and
does everything magically in the background.


=============================================*/



const ROOT_URL = 'http://localhost:3000';




export function addNewQuestion(newQuestion){
  return function(dispatch){
    axios.post(`${ROOT_URL}/campaigns/add-question`, {q_txt: newQuestion, q_score: 10})
      .then(response => {
        dispatch(fetchAdditionalQuestions());
      })
      .catch((err)=>{
        console.log(err)
      })
  }
}

export function fetchAdditionalQuestions(){
  return function(dispatch){
    axios.get(`${ROOT_URL}/campaigns/questions`)
      .then(response => {
        dispatch({ type: FETCH_ADDITIONAL_QUESTIONS, payload: response.data });
      })
      .catch((err)=>{
        console.log(err)
      })
  }
}

export function clearAllCampaigns(){
  return{
    type: CLEAR_ALL_CAMPAIGNS
  }
}

export function clearNestedCampaignsWithJobseekersState(){
  return{
    type: CLEAR_NESTED_CAMPAIGNS_WITH_JOBSEEKERS_STATE
  }
}

export function archiveCampaign({campaign_id}){
  return function(dispatch){
    axios.put(`${ROOT_URL}/campaigns/archived?campaign_id=${campaign_id}`, {campaign_status: 'archived'})
      .then(response => {
        dispatch(clearAllJobseekersState())
      })
      .catch((err)=>{
        console.log(err)
      })
  }
}

export function updateJobseekerJobStatus({job_status, jobseeker_id, campaign_id}){
  return function(dispatch){
    axios.put(`${ROOT_URL}/jobseeker/select?jobseeker_id=${jobseeker_id}&campaign_id=${campaign_id}`, {job_status})
      .then(response => {
        dispatch({ type: COMPANIES, payload: response.data });
      })
      .catch((err)=>{
        console.log(err)

      })
  }
}

export function moveWorkerToArchived({job_status, jobseeker_id, campaign_id}){
  return function(dispatch){
    axios.put(`${ROOT_URL}/jobseeker/select?jobseeker_id=${jobseeker_id}&campaign_id=${campaign_id}`, {job_status})
      .then(response => {
        dispatch(fetchWorkforce())
      })
      .catch((err)=>{
        console.log(err)

      })
  }
}

export const flattenAllJobseekersByCampaignIntoOneArray = ()=>({
  type: FLATTEN_ALL_JOBSEEKERS_BY_CAMPAIGN_INTO_ONE_ARRAY
})

export function fetchNestedJobSectors(){
  return function(dispatch){
    axios.get(`${ROOT_URL}/admin/get-nested-job-sectors`)
      .then(response => {
        dispatch({ type: NESTED_JOB_SECTORS, payload: response.data });
      })
      .catch((err)=>{
        console.log(err)

      })
  }
}

export function fetchWorkforce(){
  return function(dispatch){
    axios.get(`${ROOT_URL}/admin/workforce/all`)
      .then(response => {
        dispatch({ type: WORKFORCE, payload: response.data });
      })
      .catch((err)=>{
        console.log(err)

      })
  }
}

//'GET admin/workforce/all'

export function fetchCompanies(){
  return function(dispatch){
    axios.get(`${ROOT_URL}/admin/companies`)
      .then(response => {
        dispatch({ type: COMPANIES, payload: response.data });
      })
      .catch((err)=>{
        console.log(err)

      })
  }
}

/*export const updateJobseekerJobStatus = ({job_status, jobseeker_id, campaign_id})=>(
  dispatch=>dispatch({ type: UPDATE_JOBSEEKERSTATUS_TO_SELECTED, 
  payload: axios.put(`${ROOT_URL}/jobseeker/select?jobseeker_id=${jobseeker_id}&campaign_id=${campaign_id}`, {job_status}) })
)
*/

export function fetchAllCampaigns(){
  return function(dispatch){
    axios.get(`${ROOT_URL}/campaigns/all`)
      .then(response => {
        dispatch({ type: ALL_CAMPAIGNS, payload: response.data });
      })
      .catch((err)=>{
        console.log(err)

      })
  }
}

export function fetchAllJobseekersByCampaignId(campaign_id){
  return function(dispatch){
    axios.get(`${ROOT_URL}/campaigns/jobseekers/${campaign_id}`)
      .then(response => {
        dispatch({ type: ALL_JOBSEEKERS_BY_CAMPAIGN, payload: response });
        dispatch(actionCounterOfJobseekersByCampaignIdToFixGlitch())
      })
      .catch((err)=>{
        console.log(err)
      })
  }
}

export const actionCounterOfJobseekersByCampaignIdToFixGlitch = ()=>({
  type: COUNTER_OF_JOBSEEKERS_BY_CAMPAIGN_ID_TO_FIX_GLITCH
})

export const resetToZeroCounterOfJobseekersByCampaignIdToFixGlitch = ()=>({
  type: RESET_TO_ZERO_COUNTER_OF_JOBSEEKERS_BY_CAMPAIGN_ID_TO_FIX_GLITCH
})

export const nestJobseekersIntoCampaigns = ()=>{
  return {
    type: NEST_JOBSEEKERS_INTO_CAMPAIGNS
  }
}


export const clearAllJobseekersState = ()=>{
  return {
    type: CLEAR_ALL_JOBSEEKERS_STATE
  }
}
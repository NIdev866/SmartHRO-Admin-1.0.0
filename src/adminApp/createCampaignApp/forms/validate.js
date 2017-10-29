const validate = values => {
  const errors = {}
  if (!values.job_id){
    errors.job_id = 'Required'
  }
  if (!values.company_id){
    errors.company_id = 'Required'
  }
  if (!values.nested_job_sector_id){
    errors.nested_job_sector_id = 'Required'
  }
  if (!values.campaign_name) {
    errors.campaign_name = 'Required'
  }else if(values.campaign_name.length > 30) {
    errors.campaign_name = 'Title too long'
  }
  if (!values.job_description) {
    errors.job_description = 'Required'
  }else if(values.job_description.length > 1500) {
    errors.job_description = 'Description too long'
  }  if (!values.location) {
    errors.location = 'Required'
  }else if(values.location.length > 50) {
    errors.location = 'Description too long'
  }
  if (!values.job_sector_id){
    errors.job_sector_id = 'Required'
  }
  if (!values.job_type){
    errors.job_type = 'Required'
  }
  if (!values.jobPostcode) {
    errors.jobPostcode = 'Required'
  }else if(values.jobPostcode.length > 13) {
    errors.jobPostcode = 'Invalid Input'
  }
  if (!values.startDate){
    errors.startDate = "Required"
  }
  if (!values.salary_type){
    errors.salary_type = "Required"
  }
  if (!values.salary){
    errors.salary = "Required"
  }else if(values.salary.length > 9) {
    errors.salary = 'Value Too Big'
  }else if(/([A-Za-z@£$%^&*()#;\\])/g.test(values.salary)){
    errors.salary = 'Invalid Input'
  }

  if (!values.new_question){
    errors.new_question = "Required"
  }else if(values.new_question.length > 30) {
    errors.new_question = 'Question too long'
  }



  return errors
}

export default validate

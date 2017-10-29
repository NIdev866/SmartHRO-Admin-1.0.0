import React, { Component} from 'react'
import { Field, reduxForm, formValueSelector, change } from 'redux-form'
import validate from './validate'
import renderField from './renderField'
import RaisedButton from 'material-ui/RaisedButton'
import styles from './form_material_styles'
import { Row, Col } from 'react-flexbox-grid'
import { RadioButtonGroup } from "redux-form-material-ui"
import submit from "./submit"
import renderDatePicker from "./renderDatePicker"
import { connect } from 'react-redux'
import moment from "moment"
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import PropTypes from 'prop-types'
import CircularProgress from 'material-ui/CircularProgress';
import FontIcon from 'material-ui/FontIcon';
import * as actions from '../../../actions'
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem'



import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';



const renderError = ({ input, meta: { touched, error } }) => (
  <div style={{color: "red"}}>
    {touched ? <span>{error}</span> : ""}
  </div>
)




class DialogContents extends Component{


  sendNewQuestionToServer(){
    this.props.addNewQuestion(this.props.new_question)
    this.props.closeAddNewQuestionModal()
  }



  render(){

    const { handleSubmit, previousPage } = this.props

    return(

      <form onSubmit={handleSubmit(this.sendNewQuestionToServer.bind(this))}>

      <Field
        name="new_question"
        type="text"
        component={renderField}
        label="Enter new question"
      />

      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.props.closeAddNewQuestionModal}
      />
      <FlatButton
        label="Add"
        type="submit"
        primary={true}
      />

      </form>

      )
  }
}

const selector = formValueSelector('newQuestion')
DialogContents = connect(
  state => {
    const new_question = selector(state, 'new_question')
    return {
      new_question
    }
  }
)(DialogContents)

DialogContents = reduxForm({
  form: 'newQuestion',
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
  validate,
})(
    connect(null, actions)(DialogContents)
);



class formFive extends Component{
  constructor(props){
    super(props)
    this.renderAdditionalQuestions = this.renderAdditionalQuestions.bind(this)
    this.handleAdditionalQuestionChange = this.handleAdditionalQuestionChange.bind(this)
    this.state = {
      addNewQuestionModalOpen: false
    }
  }

  componentWillMount(){
    this.props.fetchAdditionalQuestions()
  }



  handleAdditionalQuestionChange(i, event, index, value){

    this.setState({[`value${i}`]: value}, ()=>{
      let arrayOfChosenQuestionStates =[]
      for(let i = 0; i < 5; i++){
        if(this.state[`value${i}`]){
          arrayOfChosenQuestionStates.push(this.state[`value${i}`])
        }
      }
      let iDsOfChosenQuestions = []
      arrayOfChosenQuestionStates.map((chosenQuestion)=>{
        iDsOfChosenQuestions.push({q_id: chosenQuestion.q_id})
      })

      let arrayOfFlattenedQuestionIdsForRemovalOfDuplicates = []

      iDsOfChosenQuestions.map((singleChosenQuestion)=>{
        arrayOfFlattenedQuestionIdsForRemovalOfDuplicates.push(singleChosenQuestion.q_id)
      })

      let arrayOfFlattenedQuestionIdsWithoutDuplicates = []

      arrayOfFlattenedQuestionIdsWithoutDuplicates = arrayOfFlattenedQuestionIdsForRemovalOfDuplicates.filter(function(q_id, i) {
          return arrayOfFlattenedQuestionIdsForRemovalOfDuplicates.indexOf(q_id) == i;
      })

      let arrayOfObjectsOfQuestionsWithoutDuplicates = []

      arrayOfFlattenedQuestionIdsWithoutDuplicates.map((singleFlattenedQuestionId)=>{
        arrayOfObjectsOfQuestionsWithoutDuplicates.push({q_id: singleFlattenedQuestionId})
      })

      this.props.dispatch(change('admin','questions_selected', arrayOfObjectsOfQuestionsWithoutDuplicates))
    })
  }


  renderAdditionalQuestions(){

    let result = []

    for(let i = 0; i < 5; i++){

      result.push(

        <div style={{borderBottom: '1px solid grey'}}>
          <SelectField
            autoWidth={true} 
            value={this.state[`value${i}`]}
            onChange={this.handleAdditionalQuestionChange.bind(this, i)}
            hintText={`Question ${i+1}`}
            style={{width: '100%', textAlign: 'left'}}
          >
            {this.props.additionalQuestions.map((question)=>{
              return (

                <MenuItem 
                  value={question} 
                  primaryText={question.q_txt}
                />

              )
            })}
          </SelectField>
        </div>

      )

    }

    return result

  }

  closeAddNewQuestionModal(){
    this.setState({addNewQuestionModalOpen: false})
  }


  render(){

    const { handleSubmit, previousPage } = this.props
    return (
        <form onSubmit={handleSubmit}>
          <div style={{height: 360}}>
            <Dialog
              modal={true}
              open={this.state.addNewQuestionModalOpen}
              onRequestClose={this.closeAddNewQuestionModal.bind(this)}
            >
              <DialogContents 
                closeAddNewQuestionModal={this.closeAddNewQuestionModal.bind(this)}
              />
            </Dialog>
            Additional questions (YES or NO answers only)


              {this.props.additionalQuestions && this.renderAdditionalQuestions()}


          </div>
          <div style={{height: '40px'}}>
            <FloatingActionButton 
              style={{float: 'right', marginTop: '-10px'}}
              onClick={()=>{
                this.setState({addNewQuestionModalOpen: true})
              }}
            >
              <ContentAdd />
            </FloatingActionButton>

            <div style={{float: 'right', paddingTop: '10px', marginRight: '10px'}}>Add a new question</div>

          </div>
          <Row center="xs">
            <RaisedButton
              type="button"
              label="Prev"
              primary={true}
              onClick={previousPage}
              style={styles.raisedButtonStyle}
            />
            <RaisedButton
              type="submit"
              label="Next"
              primary={true}
              style={styles.raisedButtonStyle}
            />
          </Row>
        </form>
    )
  }
}

const selector2 = formValueSelector('admin')
formFive = connect(
  state => {
    const questions_selected = selector2(state, 'questions_selected')
    return {
      questions_selected
    }
  }
)(formFive)

function mapStateToProps(state){
  return{
    additionalQuestions: state.main.additionalQuestions
  }
}

export default reduxForm({
  form: 'admin',
  destroyOnUnmount: false, // <------ preserve form data
  forceUnregisterOnUnmount: true, // <------ unregister fields on unmount
  validate,
  enableReinitialize: true
})(
  connect(mapStateToProps, actions)(formFive)
);
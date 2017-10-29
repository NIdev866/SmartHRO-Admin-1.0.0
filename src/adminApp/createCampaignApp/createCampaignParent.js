import React, { Component, PropTypes } from 'react'
import FormFirstPage from './forms/form_1'
import FormSecondPage from "./forms/form_2"
import FormThirdPage from "./forms/form_3"
import FormFourthPage from "./forms/form_4"
import FormFifthPage from "./forms/form_5"
import FormSixthPage from "./forms/form_6"
import RaisedButton from 'material-ui/RaisedButton'
import { Grid, Row, Col } from 'react-flexbox-grid'
import styles from './forms/form_material_styles'
import TopCounter from "./topCounter"
import Animation from 'react-addons-css-transition-group'

import * as actions from '../../actions'
import { Field, reduxForm, formValueSelector, change } from 'redux-form'
import { connect } from 'react-redux'


class CreateCampaignParent extends Component {
  constructor(props) {
    super(props)
    this.nextPage = this.nextPage.bind(this)
    this.previousPage = this.previousPage.bind(this)
    this.state = {
      slide: "toLeft",
      page: 1
    }
  }

  componentWillMount(){
    this.props.dispatch(change('admin','questions_selected', []))
  }

  nextPage() {
    this.setState({ 
      page: this.state.page + 1,
      slide: "toLeft"
    })
  }
  previousPage() {
    this.setState({ 
      page: this.state.page - 1,
      slide: "toRight"
    })
  }
  render() {
    const { onSubmit } = this.props
    const { page } = this.state
    return (
      <Grid className='form-container'>
        <Row center="xs">
          <Col xs={13} sm={12} md={2} lg={8}>
            <TopCounter 
              finishedStep={this.state.page}
            />
          </Col>
        </Row>
        <Row center="xs">
          <Col xs={12} sm={12} md={2} lg={8}>
            <Animation
              transitionName={this.state.slide}
              transitionEnterTimeout={500}
              transitionLeaveTimeout={500}
              transitionAppear={true}
              transitionAppearTimeout={500}>            
              {page === 1 && 
                <FormFirstPage 
                  onSubmit={this.nextPage} 
                />}
              {page === 2 && 
                <FormSecondPage 
                  previousPage={this.previousPage}
                  onSubmit={this.nextPage} 
                />}              
              {page === 3 && 
                <FormThirdPage 
                  previousPage={this.previousPage}
                  onSubmit={this.nextPage} 
                />}
              {page === 4 && 
                <FormFourthPage 
                  previousPage={this.previousPage}
                  onSubmit={this.nextPage} 
                />}  
              {page === 5 && 
                <FormFifthPage 
                  previousPage={this.previousPage}
                  onSubmit={this.nextPage} 
                />}            
              {page === 6 && 
                <FormSixthPage 
                  previousPage={this.previousPage}
                  onSubmit={onSubmit} 
                />}
            </Animation>
          </Col>
        </Row>
      </Grid>
    )
  }
}

CreateCampaignParent.propTypes = {
  onSubmit: PropTypes.func.isRequired
}

CreateCampaignParent = reduxForm({
  form: 'admin',
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
})(
    connect(null, actions)(CreateCampaignParent)
);


export default CreateCampaignParent
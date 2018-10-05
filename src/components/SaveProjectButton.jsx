import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import {withStyles} from '@material-ui/core/styles';
import { setUserProjects } from '../actions/actions';

const styles = theme => ({
  saveButton: {
    background: '#2068c9',
    width: '250px',
    marginTop: '50px'
  }
})

class SaveProjectButton extends Component {
  render() {
    const {treeData, saveProject, classes, projectName, uid, displayName, updateUserProjects} = this.props;
    return (
      <Button variant="contained" color="primary"
      className={classes.saveButton} 
      onClick={() => {
        //TODO get rid of defaulting to 'projectName'!!
        saveProject(treeData, projectName || 'projectName', uid, displayName)
        updateUserProjects({projectName: projectName || 'projectName', treeData})
      }}>
        Save Project
      </Button>
    );
  }
}

export default (withStyles(styles)) (SaveProjectButton);
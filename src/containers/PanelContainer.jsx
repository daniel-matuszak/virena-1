import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as actions from '../actions/actions';
import SubmitParentForm from '../components/SubmitParentForm.jsx';
import ExpandablePanel from '../components/ExpandablePanel.jsx';
import ExportFilesButton from '../components/ExportFilesButton.jsx';
import UpdateProjectButton from '../components/UpdateProjectButton.jsx';
import { withStyles } from '@material-ui/core/styles';
import StatusPopup from '../components/StatusPopup.jsx';
const { ipcRenderer } = require('electron');

const mapStateToProps = store => ({
  treeData: store.data.treeData,
  input: store.data.input,
  selectedComponent: store.data.selectedComponent,
  initialTypeSelection: store.data.initialTypeSelection,
  typeSelected: store.data.typeSelected,
  parentSelected: store.data.parentSelected,
  availableParents: store.data.availableParents,
  changeNameInput: store.data.changeNameInput,
  statusPopupOpen: store.data.statusPopupOpen,
  statusPopupErrorOpen: store.data.statusPopupErrorOpen,
  saveProjectOpen: store.data.saveProjectOpen,
  saveProjectErrorOpen: store.data.saveProjectErrorOpen,
  logoSpin: store.data.logoSpin,
  userLoggedIn: store.data.userLoggedIn,
  displayName: store.data.displayName,
  uid: store.data.uid,
  currentProject: store.data.currentProject,
  headerStatus: store.data.headerStatus,
  duplicateTitleErrorOpen: store.data.duplicateTitleErrorOpen,
  saveProjectSuccessOpen: store.data.saveProjectSuccessOpen,
  errMessage: store.data.errMessage,
})

const mapDispatchToProps = dispatch => ({
  setParentName: name => dispatch(actions.setParentName(name)),
  addParent: name => dispatch(actions.addParent(name)),
  selectType: selection => dispatch(actions.selectType(selection)),
  selectInitialType: selection => dispatch(actions.selectInitialType(selection)),
  selectParent: selection => dispatch(actions.selectParent(selection)),
  updateNameAndType: (name, type, header, key, path) => dispatch(actions.updateNameAndType(name, type, header, key, path)),
  setNameToChange: name => dispatch(actions.setNameToChange(name)),
  exportFiles: (treeData, dirPath) => dispatch(actions.exportFiles(treeData, dirPath)),
  selectComponent: (name, key, path) => dispatch(actions.selectComponent(name, key, path)),
  closeStatusPopup: () => dispatch(actions.closeStatusPopup()),
  saveProject: (treeData, projectName, uid, displayName) => dispatch(actions.saveProject(treeData, projectName, uid, displayName)),
  openDirectory: () => dispatch(actions.openDirectory()),
  toggleLogo: () => dispatch(actions.toggleLogo()),
  updateUserProjects: (userProject) => dispatch(actions.updateUserProjects(userProject)),
  setUserData: loginData => dispatch(actions.setUserData(loginData)),
  toggleHeader: headerStatus => dispatch(actions.toggleHeader(headerStatus)),
  setCurrentProject: (project) => dispatch(actions.setCurrentProject(project)),
  toggleDupsErrorSnackbar: () => dispatch(actions.toggleDupsErrorSnackbar()),
})

const styles = theme => ({
  formControl: {
    display: 'flex',
    flexDirection: 'row',
  },
  textField: {
    background: '#2068c9',
    borderRadius: '5px',
    width: '120px'
  },
  input: {
    color: 'white',
  },
  selectType: {
    background: '#2068c9',
    marginLeft: '10px',
    borderRadius: '5px',
    width: '120px',
    fontSize: '13px',
    paddingLeft: '20px'
  },
  inputLabel: {
    color: 'white',
    zIndex: 999,
    marginLeft: '15px',
    fontSize: '12px',
  },
  addParentButton: {
    fontSize: '10px',
    marginLeft: '15px',
  },
  export: {
    background: 'white'
  }
})

class PanelContainer extends Component {
  componentDidMount() {
    const { setUserData, exportFiles } = this.props;
    console.log('PanelContainer componentDidMount');
    
    ipcRenderer.on('userLoggedIn', (event,loginData) => {
      console.log('Received login data in panelContainer', loginData);
      // console.log('current_user_url', loginData.data.current_user_url, loginData.data.emails_url)
      setUserData(loginData);
    })
    ipcRenderer.on('selectedDir', (event, dirPath) => {
      const { treeData } = this.props;
      console.log('dirPath in renderer', dirPath);
      exportFiles(treeData, dirPath);
    })
    ipcRenderer.on('guestLoggedIn', (event, loginData) => {
      console.log('Received guest data', loginData);
    })
  }

  render() {
    const { treeData, input, classes, selectedComponent, initialTypeSelection, typeSelected, parentSelected, setParentName, addParent, logoSpin, toggleLogo, 
    availableParents, selectType, selectParent, updateNameAndType, changeNameInput, setNameToChange, selectComponent, selectInitialType, 
    statusPopupOpen, userLoggedIn, statusPopupErrorOpen, closeStatusPopup, saveProject, openDirectory, uid, displayName,
    saveProjectOpen, saveProjectErrorOpen, updateUserProjects, exportFiles, currentProject, setCurrentProject, toggleHeader,
    toggleDupsErrorSnackbar, duplicateTitleErrorOpen, saveProjectSuccessOpen, errMessage } = this.props;
    let logoClass;
    if (logoSpin) logoClass = 'logo'
    else logoClass = 'logo paused'
    return (
      <div className='panel'>
        <div>
          <SubmitParentForm treeData={treeData} input={input} classes={classes} initialTypeSelection={initialTypeSelection}
           setParentName={setParentName} addParent={addParent} selectInitialType={selectInitialType}/>
          <ExpandablePanel treeData={treeData} selectedComponent={selectedComponent} typeSelected={typeSelected} parentSelected={parentSelected}
          availableParents={availableParents} selectType={selectType} selectParent={selectParent} updateNameAndType={updateNameAndType}
          changeNameInput={changeNameInput} setNameToChange={setNameToChange} selectComponent={selectComponent} toggleDupsErrorSnackbar={toggleDupsErrorSnackbar} />
        </div>
        <div className='logo-wrapper'>
          <div className='horizontal-line'></div>
          <br/>
          <img src='./assets/virena-icon-white.png' className={logoClass} onClick={toggleLogo}></img>
          {userLoggedIn
          && currentProject.treeData
          && JSON.stringify(currentProject.treeData) !== JSON.stringify(treeData)
          && <UpdateProjectButton treeData={treeData} saveProject={saveProject} currentProject={currentProject} uid={uid} displayName={displayName} updateUserProjects={updateUserProjects} setCurrentProject={setCurrentProject}/>}
          <ExportFilesButton treeData={treeData} openDirectory={openDirectory} statusPopupOpen={statusPopupOpen} statusPopupErrorOpen={statusPopupErrorOpen} closeStatusPopup={closeStatusPopup}/>
        </div>
        <StatusPopup 
          statusPopupOpen={statusPopupOpen}
          statusPopupErrorOpen={statusPopupErrorOpen}
          saveProjectOpen={saveProjectOpen} 
          saveProjectErrorOpen={saveProjectErrorOpen}
          closeStatusPopup={closeStatusPopup}
          duplicateTitleErrorOpen={duplicateTitleErrorOpen}
          saveProjectSuccessOpen={saveProjectSuccessOpen}
          errMessage={errMessage}
        />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps) (withStyles(styles)(PanelContainer));

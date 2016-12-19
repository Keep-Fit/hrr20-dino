import React from 'react';
import MyRoutinesNav from './my-routines-nav.react.js';
import Paper from 'material-ui/Paper';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import Launch from 'material-ui/svg-icons/action/launch';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import Checkbox from 'material-ui/Checkbox';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import {Link} from 'react-router';
import Draggable from 'react-draggable';
import data from '../../utils/api-utils';
import ReactDOM from 'react-dom';
import { SortablePane, Pane } from 'react-sortable-pane';
export default class MyRoutines extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      routines: [],
      tasks: [],
      strikeStyle: {textDecoration: 'none'},
      routinePositions:{},
    };
    this.getRoutineData = this.getRoutineData.bind(this);
  }

  componentDidMount() {
    window.addEventListener("resize", this.storeCoordinates.bind(this));
    this.getRoutineData();
    // check for updates every 2 seconds, in case of emailed routine.
    // Using setstate makes this invisible to user (hopefully), but maybe taxing on db at scale.
    var update = setInterval(this.getRoutineData, 2000);
    this.setState({update: update});
  }

  componentDidUpdate(){
    this.storeCoordinates();
    console.log('routines:',this.state.routines)
  }

  getRoutineData() {
    data.getRoutines((err, data) => {
      // if (err) console.log(err);
      this.setState({
        routines: data
      });
    });
  }

  arrayObjectIndexOf(array, searchTerm) {
    for(var i = 0; i < array.length; i++) {
        if (array[i]['_id'] === searchTerm) return i;
    }
    return -1;
  }

  storeCoordinates(){
    for(var key in this.refs){
      this.state.routinePositions[key] = this.getCoords(key);
    }
    console.log(this.state.routinePositions)
  }

  handleRemoveRoutine(id) {
    RoutineActions.remove(id);
  }

  getCoords (routineId) {
    return ReactDOM.findDOMNode(this.refs[routineId]).getBoundingClientRect();
  }

  handleDrop(routineId, position) {

    console.log('position',position);
    var refs = Object.keys(this.refs);
    var arr = JSON.parse(JSON.stringify(this.state.routines));
    var routinePositions = this.state.routinePositions;
    var draggedLeft = this.getCoords(routineId).left;
    var draggedTop = this.getCoords(routineId).top;
    for(var a = 0; a < refs.length; a++) {

      if(refs[a]!==routineId) {
        var mid = (routinePositions[refs[a]].left-180)
        if(Math.abs(draggedLeft-mid)<180&&){
          var movedObjectIndex = this.arrayObjectIndexOf(arr,routineId);
          console.log('1');
          var currentObjectIndex = this.arrayObjectIndexOf(arr, refs[a]);
          console.log('2');
          arr.splice(currentObjectIndex,0,arr.splice(movedObjectIndex,1)[0]);
          console.log(arr);
          this.setState({
            routines: []
          })
          this.setState({
            routines:arr
          })
          console.log('4');
          return;
        }
      }
    }
    var draggedRight = this.getCoords(routineId).right;
    for(var a = 0; a < refs.length; a++) {
      if(refs[a]!==routineId) {
        var mid = (routinePositions[refs[a]].right+180)
        if(Math.abs(draggedRight-mid)<180){
          var movedObjectIndex = this.arrayObjectIndexOf(arr,routineId);
          console.log('1');
          var currentObjectIndex = this.arrayObjectIndexOf(arr, refs[a]);
          console.log('2');
          arr.splice(currentObjectIndex+1,0,arr.splice(movedObjectIndex,1)[0]);
          console.log(arr);
          this.setState({
            routines: []
          })
          this.setState({
            routines:arr
          })
          console.log('4');
          return;
        }
      }
    }
  }

  storeStart(routineId){
    this.setState({
      draggingRoutine: this.state.routinePositions[routineId]
    })
  }

  render() {
    const paperStyle = {
      float: 'left',
      height: 400,
      width: 300,
      margin: 30,
      overflow: 'auto'
    };

    return (
      <div>
        <MyRoutinesNav colorChange={this.props.colorChange}/> {this.state.routines.map((routine) => {
          return (
            <Draggable
              ref={routine._id}
              onStart= {()=>{this.storeStart(routine._id)}}
              onStop= {()=>{this.handleDrop(routine._id)}}
              >
              <Paper key={routine._id} style={paperStyle} zDepth={4}>
                {/* insert onTapTouch for FlatButton */}
                <AppBar title={routine.name} titleStyle={{
                  fontSize: 18
                }} iconElementLeft={< IconButton onClick = {
                  this.handleRemoveRoutine.bind(this, routine._id)
                } > <NavigationClose/> < /IconButton>} iconElementRight={< Link params = {{ id: routine._id }}to = {
                  `/routines/${routine._id}`
                } > <IconButton><Launch/></IconButton> < /Link>}/>
                <div className="day-quickview text-justify">
                  <span className={routine.repeat['Sunday']
                    ? 'day-view-on'
                    : 'day-view-off'}>SUN </span>
                  <span className={routine.repeat['Monday']
                    ? 'day-view-on'
                    : 'day-view-off'}>MON </span>
                  <span className={routine.repeat['Tuesday']
                    ? 'day-view-on'
                    : 'day-view-off'}>TUE </span>
                  <span className={routine.repeat['Wednesday']
                    ? 'day-view-on'
                    : 'day-view-off'}>WED </span>
                  <span className={routine.repeat['Thursday']
                    ? 'day-view-on'
                    : 'day-view-off'}>THUR </span>
                  <span className={routine.repeat['Friday']
                    ? 'day-view-on'
                    : 'day-view-off'}>FRI </span>
                  <span className={routine.repeat['Saturday']
                    ? 'day-view-on'
                    : 'day-view-off'}>SAT </span>
                </div>
                <List>

                  {/* for each task in routine */}
                  {routine.tasks.map((task, k) => {
                    return (
                      <div key={k}>
                        <Divider/> {/* insert onTapTouch for ListItem */}
                        <ListItem primaryText={task} rightIcon={< Link params = {{ name: routine.name }}to = {
                          `/tasks/${task.name}`
                        } > <Launch/> < /Link>}></ListItem>
                      </div>
                    );
                  })}
                </List>
              </Paper>
            </Draggable>
          );
        })}
      </div>
    );
  }
}

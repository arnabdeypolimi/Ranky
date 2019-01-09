import React from 'react'
import {View, Text} from 'react-native';
import { Grid, BarChart, XAxis } from 'react-native-svg-charts'

// const colors = [ '#33691E', '#689F38', '#9CCC65', '#DCEDC8' ]

const fill = '#7986cb';

export default class TaskScoreChart extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    let taskscore = {};
    let data = [ 0, 0, 0, 0, 0, 0 ], i = 0;
    let views = [];

    for (let i in this.props.tasks) {
      let t = this.props.tasks[i];

      taskscore[t.short_name] = 0;

      views.push(
        <View style={{flex: 1}} key={t.short_name}>
          <Text style={{fontFamily: 'monospace', fontSize: 10, textAlign: "center"}}>{t.short_name}</Text>
        </View>
      );
    }

    for (let i in this.props.subs) {
      let s = this.props.subs[i];

      taskscore[s["task"]] = Math.max(taskscore[s["task"]], s["score"]);
    }

    for (let i in this.props.tasks) {
      let t = this.props.tasks[i];

      data[i] = taskscore[t.short_name];
      i += 1;
    }

    return (
      <View style={{height: 150}}>
        <BarChart
          style={{ height: 120 }}
          svg={{ fill }}
          data={ data }
          gridMin={0}
          gridMax={100}
          numberOfTicks={0}>
          <Grid />
        </BarChart>

        <View style={{flexDirection: "row"}}>
          {views}
        </View>
      </View>
    )
  }
}

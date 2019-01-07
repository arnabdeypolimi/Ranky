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

    console.log(JSON.stringify(this.props.tasks));
    for (let t in this.props.tasks) {
      taskscore[t.short_name] = 0;

      views.push(
        <View style={{flex: 1}} key={t.short_name}>
          <Text style={{fontFamily: 'monospace', fontSize: 10, textAlign: "center"}}>{t.short_name}</Text>
        </View>
      );
    }

    console.log("here2");
    console.log(this.props.subs);
    for (let s in this.props.subs) {
      console.log("here3");
      console.log(JSON.stringify(this.props.subs[s]));
      taskscore[this.props.subs[s]["task"]] = Math.max(taskscore[this.props.subs[s]["task"]], this.props.subs[s]["score"]);
    }

    for (let t in this.props.tasks) {
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

import React, { Component, CSSProperties } from 'react';
import './App.css';
import { isUndefined } from 'util';
import { defs, Modifier } from './defs';
import { cell } from './cell';
import { keyForValue, img, value, label, undefinedToNaN } from './utils';

type Selection = {
  [key in keyof typeof defs]?: Modifier;
}
type Shooter = keyof Modifier;
type State = {
  selection: Selection;
  shooter: Shooter;
  firepower: number | undefined;
  firepower10: number | undefined;
  roll: number;
}
class App extends React.Component<{}, State> {
  initial: State = {
    selection: {},
    shooter: 'inf',
    firepower: 5,
    firepower10: undefined,
    roll: NaN,
  }
  state = this.initial;

  setSelection(selection: Selection) {
    console.log(selection, JSON.stringify(selection), Object.assign({}, {
      selection: Object.assign({}, this.state.selection, selection)
    }));
    this.setState(
      Object.assign({}, {
        selection: Object.assign({}, this.state.selection, selection)
      })
    )
  }
  handleSwitch = (def: Modifier, group: keyof Selection) => {
    const current = this.state.selection[group];
    const { selection } = this.state;
    const unselect = current === def;
    if (unselect) {
      this.setSelection({ [group]: undefined });
    } else {
      const change: Selection = { [group]: def };
      if (def === defs.in_open["5-8"] || def == defs.in_open["> 8"]) {
        change.adjacent = undefined;
      }
      if (def === defs.adjacent.adjacent && (
        selection.in_open === defs.in_open["5-8"] || selection.in_open == defs.in_open["> 8"]
      )) {
        change.in_open = undefined;
      }
      this.setSelection(change);
    }
  }
  renderSwitch = (def: Modifier, group: keyof Selection) => {
    const key = keyForValue(def, defs[group]);
    const current = this.state.selection[group];
    return <div className="c" style={
      cell(img(key), {
        border: current === def ? '1vw solid blue' : undefined
      })
    } onClick={e => this.handleSwitch(def, group)}>
      <div className="v">{value(def[this.state.shooter])}</div>
      <div className="small">{label(key)}</div>
    </div>;
  }

  renderShooter = (shooter: Shooter) => {
    return <div className="c" style={
      cell(img(`shooter/${shooter}`), {
        border: this.state.shooter === shooter ? '1vw solid blue' : undefined
      })
    } onClick={e => this.setState({ shooter })}>
      <div className="v" />
    </div>;
  }

  renderDice = () => {
    return <div className="c" style={
      cell({ path: require('./img/d10.svg') }, {})
    } onClick={e => this.setState({ roll: Math.floor(Math.random() * 10) + 1})}>
      <div className="v" >{value(this.state.roll, '')}</div>
    </div>;
  }

  renderFirepower = (fp: number, isCurrently: (fp: number) => boolean, set: (fp: number | undefined) => void) => {
    const selected = isCurrently(fp);
    return <div className="c" style={{
      borderColor: 'gray',
      backgroundColor: selected ? 'lightgray' : undefined
    }} onClick={e => set(selected ? undefined : fp)}>
      <div className="v">{fp}</div>
    </div>
  }

  renderReset = () => {
    return <div className="c" style={{
      borderColor: 'gray',
      backgroundColor: '#fdd'
    }} onClick={e => this.setState(this.initial)}>
      <div className="v">AC</div>
    </div>
  }

  render() {
    const n = <div className="c" style={{ border: 'red' }}><div className="v" /></div>
    const k = (n: number) => this.renderFirepower(n,
      fp => this.state.firepower === fp,
      firepower => this.setState({ firepower })
    );
    const kk = (n: number) => this.renderFirepower(n,
      fp => this.state.firepower10 === fp,
      firepower10 => this.setState({ firepower10 })
    );
    const s = this.renderShooter;
    const r = this.renderSwitch;
    const ac = this.renderReset;
    const dice = this.renderDice;
    return (
      <div>
        <div className="g">
          {r(defs.conceal.conceal, 'conceal')} {r(defs.adjacent.adjacent, 'adjacent')} {s('inf')} {s('mort')} {s('gun')}
          {r(defs.terrain.wooden_building, 'terrain')}   {r(defs.elevation.lower, 'elevation')}    {s('art')} {s('stuka')}  {s('flame')}
          {r(defs.terrain.stone_building, 'terrain')}    {r(defs.elevation.higher, 'elevation')}
          {r(defs.in_open['1-4'], 'in_open')} {r(defs.in_open['5-8'], 'in_open')} {r(defs.in_open['> 8'], 'in_open')}
          {r(defs.terrain.hedgerow, 'terrain')} {r(defs.terrain.pillbox, 'terrain')}  {r(defs.final_op.final_op, 'final_op')}   {n}  {dice()}
          {r(defs.terrain.woods, 'terrain')}    {r(defs.terrain.truck, 'terrain')}    {k(1)} {k(2)} {k(3)}
          {r(defs.terrain.foxhole_in_woods, 'terrain')}  {r(defs.terrain.dike_road, 'terrain')} {k(4)} {k(5)} {k(6)}
          {r(defs.terrain.foxhole, 'terrain')}  {r(defs.smoke.smoke, 'smoke')}  {k(7)} {k(8)} {k(9)}
          {r(defs.terrain.fortified, 'terrain')} {r(defs.smoke.dispersed_smoke, 'smoke')}  {kk(10)} {k(0)} {ac()}
        </div>
        {this.firepower} + {this.result} = {this.firepower + this.result}
        <pre>{JSON.stringify(this.state, null, ' ')}</pre>
      </div>
    );
  }

  get result() {
    return Object.values(this.state.selection)
      .map(group => group == undefined ? 0 : group[this.state.shooter])
      .map(undefinedToNaN)
      .reduce((a, b) => a + b, 0)
  }
  get firepower() {
    return (this.state.firepower || NaN) + (this.state.firepower10 || 0);
  }
}

export default App;


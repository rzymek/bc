import React, { Component, CSSProperties } from 'react';
import './App.css';
import { isUndefined } from 'util';
import find from "lodash/find"
import mapValues from "lodash/mapValues"
import { defs, Modifier } from './defs';
import { cell } from './cell';

type Selection = {
  [key in keyof typeof defs]?: Modifier;
}
type Shooter = keyof Modifier;
type State = {
  selection: Selection;
  shooter: Shooter;
  firepower: number | undefined;
  firepower10: number | undefined;
}
class App extends React.Component<{}, State> {
  state: State = {
    selection: {},
    shooter: 'inf',
    firepower: 5,
    firepower10: undefined,
  }

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
      cell({ path: `shooter/${shooter}.png` }, {
        border: this.state.shooter === shooter ? '1vw solid blue' : undefined
      })
    } onClick={e => this.setState({ shooter })}>
      <div className="v" />
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

  renderFirepower10 = () => {
    const selected = this.state.firepower === 10;
    return <div className="c" style={{
      borderColor: 'gray',
      backgroundColor: selected ? 'lightgray' : undefined
    }} onClick={e => this.setState({ firepower: selected ? 0 : 10 })}>
      <div className="v">10</div>
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
    return (
      <div>
        <div className="g">
          {r(defs.conceal.conceal, 'conceal')} {r(defs.adjacent.adjacent, 'adjacent')} {s('inf')} {s('mort')} {s('gun')}
          {r(defs.terrain.wooden_building, 'terrain')}   {r(defs.elevation.lower, 'elevation')}    {s('art')} {s('stuka')}  {n}
          {r(defs.terrain.stone_building, 'terrain')}    {r(defs.elevation.higher, 'elevation')}
          {r(defs.in_open['1-4'], 'in_open')} {r(defs.in_open['5-8'], 'in_open')} {r(defs.in_open['> 8'], 'in_open')}
          {r(defs.terrain.hedgerow, 'terrain')} {r(defs.terrain.pillbox, 'terrain')}  {n}   {n}  {n}
          {r(defs.terrain.woods, 'terrain')}    {r(defs.terrain.truck, 'terrain')}    {k(1)} {k(2)} {k(3)}
          {r(defs.terrain.foxhole_in_woods, 'terrain')}  {r(defs.terrain.dike_road, 'terrain')} {k(4)} {k(5)} {k(6)}
          {r(defs.terrain.foxhole, 'terrain')}  {r(defs.smoke.smoke, 'smoke')}  {k(7)} {k(8)} {k(9)}
          {r(defs.terrain.fortified, 'terrain')} {r(defs.smoke.dispersed_smoke, 'smoke')}  {kk(10)} {k(0)}
        </div>
        {this.firepower} + {this.result} = {this.firepower + this.result}
        <pre>{JSON.stringify(this.state, null, ' ')}</pre>
      </div>
    );
  }

  get result() {
    const fp = this.firepower;
    return Object.values(this.state.selection)
      .map(group => {
        if (group == undefined) {
          return 0;
        } else {
          const { inf } = group;
          return group[this.state.shooter] || inf;
        }
      })
      .reduce((a, b) => a + b, 0)
  }
  get firepower() {
    return (this.state.firepower || NaN) + (this.state.firepower10 || 0);
  }
}
const label = (key: string) => key.replace(/_/g, ' ');
const value = (v: number | undefined) => v === undefined ? '' : ((v > 0 ? '+' : '') + v);
const img = (key: string) => ({ path: `${key.replace(/[^a-z0-9-]/g, '_')}.png` });
function keyForValue<T>(value: T, map: { [k: string]: T }) {
  for (let key in map) {
    if (map[key] === value) {
      return key;
    }
  }
  throw new Error(`${JSON.stringify(value)} for found in ${JSON.stringify(map)}`);
}


// const unitImg = (v: Unit) => ({ path: `${v}.png` });
export default App;


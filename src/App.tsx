import React, { Component, CSSProperties } from 'react';
import './App.css';

const C = (props: { v: Modifier, style?: CSSProperties, onClick?: any }) =>
  <div className="c" {...props} title={props.v.label}>
    <div className="v">{props.v.inf > 0 && '+'}{props.v.inf}</div>
    <div className="small">{props.v.label}</div>
  </div>

const Unit = (props: { v: Def, style?: CSSProperties, onClick?: any }) =>
  <div className="c" {...props} title={props.v.label}>
    <div className="v" />
  </div>

const D = (p: { children: any }) =>
  <div className="c" >
    <div className="v">{p.children}</div>
  </div>
const U = (p: { children: any }) =>
  <div className="c" style={{
    border: 'none',
    backgroundSize: 'cover',
    backgroundImage: `url(img/${p.children})`,
  }}>
    <div className="v">{p.children}</div>
  </div>

const K = (p: { children: any }) =>
  <div className="c" style={{
    borderColor: 'gray'
  }}>
    <div className="v">{p.children}</div>
  </div>
const N = () => <div className="c" style={{ border: 'none' }}><div className="v" /></div>

interface Def { label?: string; key?: string; img?: string };
type Defs = { [key: string]: Def };

const enhance = (o: Defs): Defs => {
  Object.keys(o).forEach(key => {
    o[key] = Object.assign({ label: key }, o[key], { key });
    if (!o[key].img) {
      o[key].img = `${key}.png`;
    }
  })
  console.log(o);
  return o;
}
interface Modifier {
  inf: number;
  gun?: number;
  mort?: number;
  art?: number;
  stuka?: number;
  label?: string;
  img?: string;
  key: string;
}

const terrain = {
  wooden: { inf: -1, gun: -1, mort: -1, art: -1, stuka: -1, label: 'wooden building', key: '' },
  stone: { label: 'stone building', inf: -2, gun: -2, mort: -2, art: -2, stuka: -2, key: '' },
  hedgerow: { inf: -2, gun: -2, mort: 0, art: 0, stuka: 0, key: '' },
  woods: { inf: -1, key: '' },
  foxhole: { inf: -2, key: '', label: '' },
  foxhole_in_woods: { inf: -2, label: 'foxhole in woods', key: '' },
  fortified: { inf: -3, key: '', label: '' },
  pillbox: { inf: -3, key: '' },
  truck: { inf: -2, key: '' },
  dike_road: { inf: -2, img: 'road.png', key: '', label: 'dike road' },
};
enhance(terrain);
const situation = {
  orchards: { inf: 0, key: '' },
  conceal: { label: '', inf: -1, gun: -1, mort: -1, art: -1, key: '' },
  adjacent: { inf: +3, key: '' },
  open1_4: { label: 'open 1-4', inf: +4, img: 'open.png', key: '' },
  open5_8: { label: 'open 5-8', inf: +2, img: 'open.png', key: '' },
  open9: { label: 'open > 8', inf: 0, img: 'open.png', key: '' },
  higher: { inf: -1, key: '' },
  lower: { inf: +1, key: '' },
  final_op: { inf: -2, key: '' },
  smoke: { label: '', inf: -1, key: '' },
  dispersed_smoke: { label: '', inf: 0, key: '' },
};
enhance(situation);

interface Unit {
  key: string;
}
const unit = {
  inf: { key: '' },
  gun: { key: '' },
  arty: { key: '' },
  stuka: { key: '' },
  mortar: { key: '' },
};
enhance(unit);

type SituationType = keyof typeof situation;
type SituationFlags = {
  [key in SituationType]?: boolean;
};

const outline = (size: number, color: string) => `
  -${size}px -${size}px 0 ${color},
  ${size}px -${size}px 0 ${color},
  -${size}px ${size}px 0 ${color}, 
  ${size}px ${size}px 0 ${color}`;

const cell = (v: Def, s: CSSProperties) => ({
  ...s,
  color: 'white',
  textShadow: outline(1, '#000'),
  backgroundSize: 'cover',
  backgroundImage: `url(img/${v.img})`,
})

class App extends React.Component<{}, {
  terrain: string | undefined;
  situation: SituationFlags;
  unit: string | undefined;
  firepowerUnits: number | undefined;
  firepowerTenths: number | undefined;
}> {
  state = {
    terrain: undefined,
    unit: undefined,
    situation: {},
    firepowerUnits: undefined,
    firepowerTenths: undefined
  }

  renderUnit = (v: Unit) => <Unit
    v={v}
    style={cell(v, {
      border: this.state.unit === v.key ? '2vw solid red' : 'none',
    })}
    onClick={() => this.toggleUnit(v)}
  />


  renderFirepowerUnits = (key: number) => <div className="c" style={{
    borderColor: 'gray',
    backgroundColor: this.state.firepowerUnits === key ? 'lightgray' : undefined
  }} onClick={e => this.setState({ firepowerUnits: this.state.firepowerUnits === key ? undefined : key })}>
    <div className="v">{key}</div>
  </div>

  renderFirepowerTents = (key: number) => <div className="c" style={{
    borderColor: 'gray',
    backgroundColor: this.state.firepowerTenths === key ? 'lightgray' : undefined
  }} onClick={e => this.setState({ firepowerTenths: this.state.firepowerTenths === key ? undefined : key })}>
    <div className="v">{key}</div>
  </div>

  renderTerrain = (v: Modifier) => <C v={v}
    style={cell(v, {
      border: this.state.terrain === v.key ? '2vw solid blue' : 'none',
    })}
    onClick={() => this.toggleTerrain(v)} />


  renderSituation = (v: Modifier) => {
    const situation: { [key: string]: boolean } = this.state.situation;
    return <C
      v={v}
      style={cell(v, {
        border: situation[v.key] ? '2vw solid yellow' : 'none',
      })}
      onClick={() => this.toggleSituation(v.key as SituationType)} />
  }


  toggleSituation = (v: SituationType) => {
    console.log(v);
    const newSituation: SituationFlags = Object.assign({}, this.state.situation);
    newSituation[v] = !newSituation[v];
    if (newSituation[v]) {
      if (v === situation.lower.key) {
        newSituation.higher = false;
      } else if (v === situation.higher.key) {
        newSituation.lower = false;
      } else if (v === situation.smoke.key) {
        newSituation.dispersed_smoke = false;
      } else if (v === situation.dispersed_smoke.key) {
        newSituation.smoke = false;
      }
    }
    this.setState({
      situation: newSituation
    });
  }

  toggleTerrain = (v: Modifier) => {
    this.setState({
      terrain: this.state.terrain === v.key ? undefined : v.key
    });
  }

  toggleUnit = (v: Unit) => {
    this.setState({
      unit: this.state.unit === v.key ? undefined : v.key
    });
  }

  render() {
    const t = this.renderTerrain;
    const s = this.renderSituation;
    const u = this.renderUnit;
    const k = this.renderFirepowerUnits;
    const kk = this.renderFirepowerTents;
    return <div className="g">
      {s(situation.conceal)} {s(situation.adjacent)} {u(unit.inf)} {u(unit.mortar)} {u(unit.gun)}
      {t(terrain.wooden)}   {s(situation.lower)}    {u(unit.arty)} {u(unit.stuka)} <N />
      {t(terrain.stone)}    {s(situation.higher)}    {s(situation.open1_4)} {s(situation.open5_8)} {s(situation.open9)}
      {t(terrain.hedgerow)} {t(terrain.pillbox)}  <N /> <N /> <N />
      {t(terrain.woods)}    {t(terrain.truck)}    {k(1)} {k(2)} {k(3)}
      {t(terrain.foxhole_in_woods)}  {t(terrain.dike_road)} {k(4)} {k(5)} {k(6)}
      {t(terrain.foxhole)}  {s(situation.smoke)}  {k(7)} {k(8)} {k(9)}
      {t(terrain.fortified)} {s(situation.dispersed_smoke)}  {kk(10)} {k(0)}
    </div>
  }
}

export default App;

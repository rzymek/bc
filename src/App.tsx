import React, { Component, CSSProperties } from 'react';
import './App.css';

const C = (props: { v: Modifier, style?: CSSProperties, onClick?: any }) =>
  <div className="c" {...props} title={props.v.label}>
    <div className="v">{props.v.inf > 0 && '+'}{props.v.inf}</div>
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
const N = () => <div className="c"><div className="v" /></div>

type Modifiers = { [key: string]: Modifier };

const enhance = (o: Modifiers): Modifiers => {
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
  foxhole: { inf: -2, key: '' },
  foxhole_in_woods: { inf: -2, key: '' },
  fortified: { inf: -3, key: '' },
  pillbox: { inf: -3, key: '' },
  truck: { inf: -2, key: '' },
  dike_road: { inf: -2, img: 'road.png', key: '' },
};
enhance(terrain);
const situation = {
  orchards: { inf: 0, key: '' },
  conceal: { inf: -1, gun: -1, mort: -1, art: -1, key: '' },
  adjacent: { inf: +3, key: '' },
  open1_4: { inf: +4, img: 'open.png', key: '' },
  open5_8: { inf: +2, img: 'open.png', key: '' },
  open9: { inf: 0, img: 'open.png', key: '' },
  higher: { inf: -1, img: 'elevation.png', key: '' },
  lower: { inf: +1, img: 'elevation.png', key: '' },
  final_op: { inf: -2, key: '' },
  smoke: { inf: -1, key: '' },
  dispersed_smoke: { inf: 0, key: '' },
};
enhance(situation);
type SituationType = keyof typeof situation;
type SituationFlags = {
  [key in SituationType]?: boolean;
};

const outline = (size: number, color: string) => `
  -${size}px -${size}px 0 ${color},
  ${size}px -${size}px 0 ${color},
  -${size}px ${size}px 0 ${color}, 
  ${size}px ${size}px 0 ${color}`;

const cell = (v: Modifier, s: CSSProperties) => ({
  ...s,
  color: 'white',
  textShadow: outline(1, '#000'),
  backgroundSize: 'cover',
  backgroundImage: `url(img/${v.img})`,
})

class App extends React.Component<{}, {
  terrain: string | undefined;
  situation: SituationFlags;
}> {
  state = {
    terrain: undefined,
    situation: {}
  }

  renderTerrain = (v: Modifier) => <C
    v={v}
    style={cell(v, {
      border: this.state.terrain === v.key ? '2vw solid blue' : 'none',
    })}
    onClick={() => this.toggleTerrain(v)}
  />


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

  render() {
    const t = this.renderTerrain;
    const s = this.renderSituation;
    return <div className="g">
      {t(terrain.wooden)}   {s(situation.lower)}      {s(situation.conceal)}      <D>1-4</D> <U>I</U> <U>G</U>
      {t(terrain.stone)}    {s(situation.higher)} {s(situation.adjacent)} <D>5-8</D> <U>I</U> <U>G/V</U>
      {t(terrain.hedgerow)} {t(terrain.pillbox)} {s(situation.open1_4)} <D>> 8</D> <U>I</U> <U>G/V</U>
      {t(terrain.woods)}    {t(terrain.truck)} {s(situation.open5_8)} <K>1</K> <K>2</K> <K>3</K>
      {t(terrain.foxhole_in_woods)}  {t(terrain.dike_road)} {s(situation.open9)} <K>4</K> <K>5</K> <K>6</K>
      {t(terrain.foxhole)} <N /> {s(situation.smoke)} <K>7</K> <K>8</K> <K>9</K>
      {t(terrain.fortified)} <N />      {s(situation.dispersed_smoke)} <K>10</K> <K>0</K> <N />
    </div>
  }
}

export default App;

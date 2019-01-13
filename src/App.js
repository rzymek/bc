import React, { Component } from 'react';
import './App.css';

const C = ({ children, style }) => <div className="c" style={style}>
  <div className="v">{children}</div>
</div>

const T = ({ children }) => <C style={{ borderColor: 'brown' }}>{children}</C>
const S = ({ children }) => <C style={{ borderColor: 'yellow' }}>{children}</C>
const D = ({ children }) => <C style={{ borderColor: 'pink' }}>{children}</C>
const U = ({ children }) => <C style={{
  border: 'none',
  backgroundSize: 'cover',
  backgroundImage: `url(img/${children})`,
}}></C>
const K = ({ children }) => <C style={{ borderColor: 'gray' }}>{children}</C>
const N = () => <C style={{ border: 'none' }} />

const terrain = {
  wooden: { inf: -1, gun: -1, mort: -1, art: -1, stuka: -1, label: 'wooden building', img: 'building-wood.png' },
  stone: { label: 'stone building', inf: -2, gun: -2, mort: -2, art: -2, stuka: -2, img: 'building-stone.png' },
  hedge: { label: 'hedgrow', inf: -2, gun: -2, mort: 0, art: 0, stuka: 0, img: 'hedge.png' },
  woods: { label: 'woods', inf: -1, img: 'woods.png' },
  foxhole: { inf: -2 },
  foxhole_in_woods: { inf: -2 },
  fortified: { inf: -3 },
  pillbox: { inf: -3 },
  higher: { inf: -1, img: 'elevation.png' },
  lower: { inf: +1, img: 'elevation.png' },
  truck: { inf: -2 },
  dikeroad: { inf: -2, img: 'road.png' },
}
const situation = {
  orchards: { inf: 0, img: 'orchard.png' },
  conceal: { label: 'concel', inf: -1, gun: -1, mort: -1, art: -1, stuka: 'remove' },
  adjacent: { inf: +3 },
  open1_4: { inf: +4, img: 'open.png' },
  open5_8: { inf: +2, img: 'open.png' },
  final_op: { inf: -2 },
  smoke: { inf: -1 },
  dispersed_smoke: { inf: 0 },
}
const distance = {
  close: { label: '1-4', inf: +4 }
}
const outline = (size, color) => `
  -${size}px -${size}px 0 ${color},
  ${size}px -${size}px 0 ${color},
  -${size}px ${size}px 0 ${color}, 
  ${size}px ${size}px 0 ${color}`;

class App extends Component {
  t = (v) => <C style={{
    border: 'none',
    color: 'white',
    textShadow: outline(1, '#000'),
    backgroundSize: 'cover',
    backgroundImage: `url(img/${v.img})`,
  }}>{v.inf > 0 && '+'}{v.inf}</C>
  render() {
    const grid = [
      [terrain.wooden, terrain.stone, situation.conceal, distance.close, 5, 6],
      [terrain.hedge, terrain.woods, 3, 4, 5, 6],
      [1, 2, 3, 4, 5, 6],
      [1, 2, 3, 4, 5, 6],
      [1, 2, 3, 4, 5, 6],
      [1, 2, 3, 4, 5, 6],
      [1, 2, 3, 4, 5, 6],
    ]
    const t = this.t;
    return <div className="g">
      {t(terrain.wooden)}{t(terrain.pillbox)} <S> 0</S> <D>1-4</D> <U>US-1st.png</U> <C>G/V</C>
      {t(terrain.stone)} {t(terrain.higher)} <S>-1</S> <D>5-8</D> <U>US-1st.png</U> <C>G/V</C>
      {t(terrain.hedge)} {t(terrain.lower)} <S>+3</S> <D>> 8</D> <U>US-1st.png</U> <C>G/V</C>
      {t(terrain.woods)} {t(terrain.truck)} <S>-2</S> <K>1</K> <K>2</K> <K>3</K>
      {t(terrain.foxhole)} {t(terrain.dikeroad)} <S>-1</S> <K>4</K> <K>6</K> <K>6</K>
      {t(terrain.foxhole_in_woods)} <N /> <T>-2</T> <S> 0</S> <K>7</K> <K>8</K> <K>9</K>
      {t(terrain.fortified)} <N />      <S> 0</S> <K>10</K> <K>0</K> <N />

    </div>
  }
}

export default App;

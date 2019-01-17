import { CSSProperties } from "react";

const outline = (size: number, color: string) => `
-${size}px -${size}px 0 ${color},
${size}px -${size}px 0 ${color},
-${size}px ${size}px 0 ${color}, 
${size}px ${size}px 0 ${color}`;

export const cell = (img: ImgPath, s: CSSProperties): CSSProperties => ({
  ...s,
  color: 'white',
  textShadow: outline(1, '#000'),
  backgroundSize: 'cover',
  backgroundImage: `url(${img.path})`,
})

export interface ImgPath { path: string };

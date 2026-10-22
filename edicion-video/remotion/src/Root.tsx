import React from "react";
import { Composition } from "remotion";
import { Main } from "./video";
import { DURATION } from "./words";
import { FPS, H, W } from "./theme";

export const Root: React.FC = () => (
  <Composition
    id="Main"
    component={Main}
    durationInFrames={Math.max(1, Math.ceil(DURATION * FPS))}
    fps={FPS}
    width={W}
    height={H}
  />
);

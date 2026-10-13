import { Composition, Folder } from "remotion";
import { HelloWorld } from "./HelloWorld";
import { Logo } from "./HelloWorld/Logo";
import { Title } from "./HelloWorld/Title";
import { Barras } from "./Resortes/Barras";
import { Cierre } from "./Resortes/Cierre";
import { Golpe } from "./Resortes/Golpe";
import { ACENTO, COLOR } from "./Resortes/paleta";
import { Rejilla } from "./Resortes/Rejilla";
import { Resortes } from "./Resortes/Resortes";

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="Elements">
        <Composition
          id="Logo"
          component={Logo}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            logoColor1: "#91EAE4",
            logoColor2: "#86A8E7",
          }}
        />
        <Composition
          id="Title"
          component={Title}
          durationInFrames={115}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            titleText: "Welcome to Remotion",
            titleColor: "#000000",
          }}
        />
      </Folder>
      <Composition
        // You can take the "id" to render a video:
        // bunx remotion render HelloWorld
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        // You can override these props for each render:
        // https://www.remotion.dev/docs/parametrized-rendering
        defaultProps={{
          titleText: "Welcome to Remotion",
          titleColor: "#000000",
        }}
      />

      <Composition
        id="Resortes"
        component={Resortes}
        durationInFrames={600}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ color: COLOR, acento: ACENTO }}
      />
      <Folder name="Escenas-Resortes">
        <Composition
          id="Golpe"
          component={Golpe}
          durationInFrames={150}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ color: COLOR, acento: ACENTO }}
        />
        <Composition
          id="Rejilla"
          component={Rejilla}
          durationInFrames={150}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ color: COLOR, acento: ACENTO }}
        />
        <Composition
          id="Barras"
          component={Barras}
          durationInFrames={150}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ color: COLOR, acento: ACENTO }}
        />
        <Composition
          id="Cierre"
          component={Cierre}
          durationInFrames={150}
          fps={30}
          width={1080}
          height={1920}
          defaultProps={{ color: COLOR, acento: ACENTO }}
        />
      </Folder>
    </>
  );
};

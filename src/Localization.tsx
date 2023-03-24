import { Universe } from "./layers/common/Universe";
import { UniverseDataContext } from "./layers/common/UniverseDataContext";
import { useCallback, useEffect, useState } from "react";
import { Viewer3DConfiguration } from "./config";
import { definedAndNotNull, IUniverseData } from "@formant/universe-core";
import { TelemetryUniverseData } from "@formant/universe-connector";
import { buildScene } from "./buildscene";
import getUuidByString from "uuid-by-string";
import { Authentication, Fleet } from "@formant/data-sdk";

const newConfig: Viewer3DConfiguration = {
  maps: [
    {
      name: "Map",
      mapType: "Occupancy Map",
      occupancyMapDataSource: {
        telemetryStreamName: "Map", //replace with stream name
        telemetryStreamType: "localization",
        latestDataPoint: false,
      },
      transform: { localizationWorldToLocal: true },
    },
  ],
  visualizations: [
    {
      name: "Chai",
      visualizationType: "Position Indicator",
      positionIndicatorVisualType: "Circle",

      transform: {
        localizationWorldToLocal: true,
        localizationStream: "Map", //replace with stream name
        positioningType: "Odometry",
      },
    },
  ],
};

export const Localization = () => {
  const [universeData] = useState<IUniverseData>(
    () => new TelemetryUniverseData()
  );

  const [id, setId] = useState("");

  useEffect(() => {
    Authentication.login("email", "password").then((_) => {
      Fleet.getDevices().then((d) => {
        const dev = d.filter((_) => _.name.includes("device name"));
        console.log(dev);
        if (d.length > 0) setId(dev[0].id);
      });
    });
  }, []);

  const scene = useCallback(
    (config: Viewer3DConfiguration) => {
      return (
        <UniverseDataContext.Provider value={universeData}>
          <Universe configHash={getUuidByString(JSON.stringify(config))}>
            <ambientLight />
            {buildScene(config, definedAndNotNull(id))};
          </Universe>
        </UniverseDataContext.Provider>
      );
    },
    [universeData, id]
  );
  if (id.length === 0) {
    return <></>;
  }

  return scene(newConfig);
};

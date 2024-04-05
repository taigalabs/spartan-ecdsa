import React from "react";
import ImageLogo from "@taigalabs/prfs-react-lib/src/image_logo/ImageLogo";
import Spinner from "@taigalabs/prfs-react-lib/src/spinner/Spinner";
import cn from "classnames";

import styles from "./UsageScenario.module.scss";
import { useI18N } from "@/i18n/use_i18n";
import { Area, Title } from "./IntroComponents";

const UsageScenario: React.FC<LogoContainerProps> = () => {
  const i18n = useI18N();

  return (
    <Area className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.text}>
          What if you can use a finance app, a dating app, or a social app without having to submit
          your data that will let anyone track what you do?
        </div>
      </div>
    </Area>
  );
};

export default UsageScenario;

export interface LogoContainerProps {}

export interface IframeProps {
  src: string;
}

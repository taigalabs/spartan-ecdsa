import React from "react";
import ImageLogo from "@taigalabs/prfs-react-lib/src/image_logo/ImageLogo";
import cn from "classnames";
import { inter } from "@taigalabs/prfs-react-lib/src/fonts";

import styles from "./LogoContainer.module.scss";
import { useI18N } from "@/i18n/use_i18n";

const LogoContainer: React.FC<LogoContainerProps> = ({ proofTypeChosen }) => {
  const i18n = useI18N();

  return (
    <div className={cn(styles.wrapper, inter.className)}>
      <div className={styles.title}>
        <span>Create anonymous</span>
        <br className={styles.lineBreak} />
        <span className={styles.proofs}>proofs</span>
      </div>
      <div className={styles.subtitle}>
        Universal and performant interface for building client-side ZKP capabilities.
      </div>
    </div>
  );
};

export default LogoContainer;

export interface LogoContainerProps {
  proofTypeChosen: boolean;
}

import React from "react";
import ImageLogo from "@taigalabs/prfs-react-lib/src/image_logo/ImageLogo";
import cn from "classnames";

import styles from "./TutorialArea.module.scss";
import { useI18N } from "@/i18n/use_i18n";

enum TutorialLabel {
  create_identity,
  create_proof,
  create_topic,
}

const TutorialArea: React.FC<LogoContainerProps> = () => {
  const i18n = useI18N();
  const [tutorialLabel, setTutorialLabel] = React.useState(TutorialLabel.create_identity);

  const handleClickItem = React.useCallback(
    (e: React.MouseEvent) => {
      const label = e.currentTarget.getAttribute("data-label");
      if (label) {
        setTutorialLabel(Number(label));
      }
    },
    [setTutorialLabel],
  );

  return (
    <div className={cn(styles.wrapper)}>
      <p className={styles.title}>{i18n.learn_by_tutorials}</p>
      <ol className={styles.list}>
        <li
          className={cn({ [styles.isActive]: tutorialLabel === TutorialLabel.create_identity })}
          data-label={TutorialLabel.create_identity}
          onClick={handleClickItem}
        >
          Create an identity and attest to your data
        </li>
        <li
          className={cn({ [styles.isActive]: tutorialLabel === TutorialLabel.create_proof })}
          data-label={TutorialLabel.create_proof}
          onClick={handleClickItem}
        >
          Create and verify proof
        </li>
        <li
          className={cn({ [styles.isActive]: tutorialLabel === TutorialLabel.create_topic })}
          data-label={TutorialLabel.create_topic}
          onClick={handleClickItem}
        >
          (Live app - Shy) Create a topic and comment
        </li>
      </ol>
      <div className={styles.videoContainer}>
        {tutorialLabel === TutorialLabel.create_identity && (
          <iframe
            className={styles.video}
            src="https://drive.google.com/file/d/1hyVmoqCExvPLMU9ABa7Vt6LaTw_D9dCV/preview"
            allow="autoplay"
          ></iframe>
        )}
        {tutorialLabel === TutorialLabel.create_proof && (
          <iframe
            className={styles.video}
            src="https://drive.google.com/file/d/1if74zytTjTy-eShG9GzyCQzhfjN-cN4b/preview"
            allow="autoplay"
          ></iframe>
        )}
        {tutorialLabel === TutorialLabel.create_topic && (
          <iframe
            className={styles.video}
            src="https://drive.google.com/file/d/1Hsic--IUT5LfRFpnRjmwvTcNYl3PDrGp/preview"
            allow="autoplay"
          ></iframe>
        )}
      </div>
    </div>
  );
};

export default TutorialArea;

export interface LogoContainerProps {}

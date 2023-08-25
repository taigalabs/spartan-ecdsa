import React, { MouseEventHandler } from "react";
import classnames from "classnames";

import styles from "./TextButton.module.scss";

const Button: React.FC<ButtonProps> = ({ children, className, handleClick, variant, disabled }) => {
  return (
    <button
      className={classnames({
        [styles.aqua_blue_1]: variant === "aqua_blue_1",
        [className || ""]: true,
      })}
      onClick={handleClick}
      disabled={!!disabled}
    >
      {children}
    </button>
  );
};

export default Button;

export interface ButtonProps {
  variant: "aqua_blue_1";
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
  handleClick?: MouseEventHandler;
}

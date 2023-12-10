import React, { ChangeEventHandler, HTMLInputTypeAttribute } from "react";
import ImageLogo from "@taigalabs/prfs-react-components/src/image_logo/ImageLogo";
import cn from "classnames";

import styles from "./SignInModule.module.scss";

export const SignInModuleLogoArea: React.FC = () => {
  return (
    <div className={styles.logoArea}>
      <ImageLogo width={46} />
      <span>ID</span>
    </div>
  );
};

export const SignInModuleHeader: React.FC<SignInModuleInputAreaProps> = ({ children }) => {
  return <div className={styles.header}>{children}</div>;
};

export const SignInModuleTitle: React.FC<SignInModuleInputAreaProps> = ({ children }) => {
  return <div className={styles.title}>{children}</div>;
};

export const SignInModuleSubtitle: React.FC<SignInModuleInputAreaProps> = ({ children }) => {
  return <div className={styles.subtitle}>{children}</div>;
};

export const SignInModuleInputArea: React.FC<SignInModuleInputAreaProps> = ({ children }) => {
  return <div className={styles.inputArea}>{children}</div>;
};

export const SignInModuleFooter: React.FC<SignInModuleInputAreaProps> = ({ children }) => {
  return <div className={styles.footer}>{children}</div>;
};

export const SignInErrorMsg: React.FC<SignInModuleInputAreaProps> = ({ children, className }) => {
  return <div className={cn(styles.error, className)}>{children}</div>;
};

export const SignInModuleBtnRow: React.FC<SignInModuleInputAreaProps> = ({
  children,
  className,
}) => {
  return <div className={cn(styles.btnRow, className)}>{children}</div>;
};

export const SignInInputItem: React.FC<SignInModuleInputProps> = ({
  name,
  value,
  error,
  type,
  placeholder,
  handleChangeValue,
}) => {
  return (
    <div
      className={cn(styles.inputItem, {
        [styles.isError]: !!error,
      })}
    >
      <input
        name={name}
        value={value}
        className={styles.input}
        placeholder={placeholder}
        type={type}
        onChange={handleChangeValue}
      />
      {error && error.length && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export const SignInInputGuide: React.FC<SignInModuleInputAreaProps> = ({ children, className }) => {
  return <div className={cn(styles.inputGuide, className)}>{children}</div>;
};

export const SignInForm: React.FC<SignInModuleInputAreaProps> = ({ children }) => {
  return <form className={styles.form}>{children}</form>;
};

const SignInModule: React.FC<SignInModuleInputAreaProps> = ({ children }) => {
  return <div className={styles.wrapper}>{children}</div>;
};

export default SignInModule;

export interface SignInModuleInputAreaProps {
  className?: string;
  children: React.ReactNode;
}

export interface SignInModuleInputProps {
  name?: string;
  value: string;
  handleChangeValue: React.ChangeEventHandler;
  error: string | undefined;
  placeholder?: string;
  type?: HTMLInputTypeAttribute | undefined;
}

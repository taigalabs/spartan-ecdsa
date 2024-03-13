import React from "react";
import Button from "@taigalabs/prfs-react-lib/src/button/Button";
import Link from "next/link";
import Fade from "@taigalabs/prfs-react-lib/src/fade/Fade";
import { PrfsIdCredential, makePrfsIdCredential } from "@taigalabs/prfs-id-sdk-web";
import Input from "@taigalabs/prfs-react-lib/src/input/Input";

import styles from "./SignUpForm.module.scss";
import { i18nContext } from "@/i18n/context";
import {
  DefaultInnerPadding,
  DefaultInputGuide,
  DefaultModuleBtnRow,
  DefaultModuleHeader,
  DefaultModuleInputArea,
  DefaultModuleLogoArea,
  DefaultModuleSubtitle,
  DefaultModuleTitle,
} from "@/components/default_module/DefaultModule";
import { IdCreateForm } from "@/functions/validate_id";

const EMAIL = "email";
const EMAIL_CONFIRM = "email_confirm";
const PASSWORD_1 = "password_1";
const PASSWORD_1_CONFIRM = "password_1_confirm";
const PASSWORD_2 = "password_2";
const PASSWORD_2_CONFIRM = "password_2_confirm";

const InputCreateIdCredential: React.FC<InputCreateIdCredentialProps> = ({
  formData,
  setFormData,
  formErrors,
  handleClickSignIn,
  handleClickNext,
  setCredential,
}) => {
  const i18n = React.useContext(i18nContext);

  const handleChangeValue = React.useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      const name = ev.target.name;
      const val = ev.target.value;

      if (name) {
        setFormData(oldVal => {
          return {
            ...oldVal,
            [name]: val,
          };
        });
      }
    },
    [formData, setFormData],
  );

  const enhancedHandleClickNext = React.useCallback(async () => {
    const credential = await makePrfsIdCredential({
      email: formData.email,
      password_1: formData.password_1,
      password_2: formData.password_2,
    });
    console.log("credential", credential);

    setCredential(credential);
    handleClickNext();
  }, [handleClickNext, setCredential]);

  return (
    <DefaultInnerPadding>
      <div className={styles.main}>
        <DefaultModuleLogoArea />
        <Fade>
          <DefaultModuleHeader noSidePadding>
            <DefaultModuleTitle>{i18n.create_an_identity}</DefaultModuleTitle>
            <DefaultModuleSubtitle>{i18n.create_a_strong_password}</DefaultModuleSubtitle>
          </DefaultModuleHeader>
          <DefaultModuleInputArea>
            <div className={styles.inputGroup}>
              <Input
                className={styles.input}
                name={EMAIL}
                error={formErrors[EMAIL]}
                label={i18n.email}
                value={formData[EMAIL]}
                type="text"
                handleChangeValue={handleChangeValue}
              />
              <Input
                name={EMAIL_CONFIRM}
                error={formErrors[EMAIL_CONFIRM]}
                label={i18n.confirm}
                value={formData[EMAIL_CONFIRM]}
                type="text"
                handleChangeValue={handleChangeValue}
              />
            </div>
            <DefaultInputGuide>
              <Link
                href={`${process.env.NEXT_PUBLIC_DOCS_WEBSITE_ENDPOINT}/identity`}
                target="_blank"
              >
                {i18n.why_we_ask_for_email}
              </Link>
            </DefaultInputGuide>
            <div className={styles.inputGroup}>
              <Input
                name={PASSWORD_1}
                error={formErrors[PASSWORD_1]}
                label={i18n.password_1}
                value={formData[PASSWORD_1]}
                type="password"
                handleChangeValue={handleChangeValue}
              />
              <Input
                name={PASSWORD_1_CONFIRM}
                error={formErrors[PASSWORD_1_CONFIRM]}
                label={i18n.confirm}
                value={formData[PASSWORD_1_CONFIRM]}
                type="password"
                handleChangeValue={handleChangeValue}
              />
            </div>
            <div className={styles.inputGroup}>
              <Input
                name={PASSWORD_2}
                error={formErrors[PASSWORD_2]}
                label={i18n.password_2}
                value={formData[PASSWORD_2]}
                type="password"
                handleChangeValue={handleChangeValue}
              />
              <Input
                name={PASSWORD_2_CONFIRM}
                error={formErrors[PASSWORD_2_CONFIRM]}
                label={i18n.confirm}
                value={formData[PASSWORD_2_CONFIRM]}
                type="password"
                handleChangeValue={handleChangeValue}
              />
            </div>
            <DefaultInputGuide>
              <Link
                href={`${process.env.NEXT_PUBLIC_DOCS_WEBSITE_ENDPOINT}/identity`}
                target="_blank"
              >
                {i18n.why_we_ask_for_two_passwords}
              </Link>
            </DefaultInputGuide>
          </DefaultModuleInputArea>
          <DefaultModuleBtnRow className={styles.btnRow} noSidePadding>
            <Button
              type="button"
              variant="transparent_blue_2"
              noTransition
              handleClick={handleClickSignIn}
              noShadow
            >
              {i18n.already_have_id}
            </Button>
            <Button
              type="button"
              variant="blue_2"
              className={styles.nextBtn}
              noTransition
              handleClick={enhancedHandleClickNext}
              noShadow
            >
              {i18n.next}
            </Button>
          </DefaultModuleBtnRow>
        </Fade>
      </div>
    </DefaultInnerPadding>
  );
};

export default InputCreateIdCredential;

export interface InputCreateIdCredentialProps {
  formData: IdCreateForm;
  setFormData: React.Dispatch<React.SetStateAction<IdCreateForm>>;
  formErrors: IdCreateForm;
  handleClickNext: () => void;
  handleClickSignIn: () => void;
  setCredential: React.Dispatch<React.SetStateAction<PrfsIdCredential | null>>;
}

"use client";

import React from "react";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Link from "next/link";

import styles from "./Sets.module.scss";
import { i18nContext } from "@/contexts/i18n";
import Logo from "@/components/logo/Logo";

const Sets: React.FC = () => {
  let i18n = React.useContext(i18nContext);

  return (
    <div className={styles.wrapper}>
      <div>sets</div>
    </div>
  );
};

export default Sets;

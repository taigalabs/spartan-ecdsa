import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import classnames from "classnames";

import styles from "./ActiveLink.module.scss";

const ActiveLink = ({ children, href, exact }: ActiveLinkProps & LinkProps) => {
  const pathName = usePathname();

  const isActive = exact ? pathName === href.toString() : pathName.startsWith(href.toString());

  return (
    <Link
      className={classnames({
        [styles.wrapper]: true,
        [styles.active]: isActive,
      })}
      href={href}
    >
      {children}
    </Link>
  );
};

export default ActiveLink;

export interface ActiveLinkProps {
  exact?: boolean;
  children: React.ReactNode;
}

import Link, { LinkProps } from "next/link";
import { useRouter } from "next/router";
import { ReactElement, cloneElement } from "react";

interface ActiveLinkprops extends LinkProps {
    children: ReactElement;
    activeClassName: string;
}

export function ActiveLink({ children, activeClassName, ...props }: ActiveLinkprops) {
    const { asPath } = useRouter();

    const className = asPath === props.href ? activeClassName : '';

    return (
        <Link {...props}>
            {cloneElement(children, { className })}
        </Link>
    )
}
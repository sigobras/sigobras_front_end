// components/atoms/NavbarLink.js

import React from 'react';
import Link from 'next/link';

const NavbarLink = ({ href, children }) => (
	<Link href={href}>
		<a>{children}</a>
	</Link>
);

export default NavbarLink;

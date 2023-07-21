import React from 'react';
import { useSession } from 'next-auth/react';
import TabsComponentesView from '../../js/components/Pfisicos/Diarios/TabsComponentes/TabsComponentesView';
const InicioWrapper = () => {
	const { data: session, status } = useSession();
	if (status === 'loading') {
		return <div>Cargando...</div>;
	}
	if (!session) {
		return <div>No estás autenticado.</div>;
	}
	const userId = session.user.id;
	return (
		<div>
			<TabsComponentesView userId={userId} />
		</div>
	);
};

export default InicioWrapper;

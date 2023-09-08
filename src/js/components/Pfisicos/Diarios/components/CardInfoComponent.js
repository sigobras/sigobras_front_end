import React from 'react';
import { MdSearch } from 'react-icons/md';
import { CardHeader, Input, InputGroup, InputGroupText } from 'reactstrap';
import { Redondea } from '../../../Utils/Funciones';

const CardInfoComponent = ({ ComponenteSelecccionado, ComponenteAvance, setTextoBuscado }) => {
	return (
		<CardHeader style={{ position: 'relative' }} className='bg-dark p-1 ps-3'>
			<span>
				<div>
					<span>{ComponenteSelecccionado?.nombre}</span>
					{'   '}
				</div>
				<div
					style={{
						width: '50%',
					}}
				>
					<div
						style={{
							height: '5px',
							width: '100%',
							background: 'white',
							textAlign: 'end',
							margin: 0,
							borderRadius: 50,
							color:
								(ComponenteAvance / ComponenteSelecccionado?.presupuesto) * 100 >
									85
									? '#a4fb01'
									: (ComponenteAvance / ComponenteSelecccionado?.presupuesto) *
										100 >
										30
										? '#0080ff'
										: '#ff2e00',
							border:
								(ComponenteAvance / ComponenteSelecccionado?.presupuesto) * 100 >
									85
									? '1px solid #a4fb01'
									: (ComponenteAvance / ComponenteSelecccionado?.presupuesto) *
										100 >
										30
										? '1px solid #0080ff'
										: '1px solid #ff2e00',
						}}
					>
						<div
							style={{
								width: `${(ComponenteAvance / ComponenteSelecccionado?.presupuesto) * 100
									}%`,
								height: '100%',
								background:
									(ComponenteAvance / ComponenteSelecccionado?.presupuesto) *
										100 >
										85
										? '#a4fb01'
										: (ComponenteAvance / ComponenteSelecccionado?.presupuesto) *
											100 >
											30
											? '#0080ff'
											: '#ff2e00',
								transition: 'all .9s ease-in',
							}}
						/>
						<span style={{ fontWeight: '700' }}>
							{Redondea(
								(ComponenteAvance / ComponenteSelecccionado?.presupuesto) * 100
							)}
							%
						</span>
					</div>
				</div>
				<span>S/. {Redondea(ComponenteAvance)}</span>{' '}
			</span>

			<div
				style={{
					width: '30%',
					position: 'absolute',
					right: '20px',
					top: '10px',
				}}
			>
				<InputGroup size='sm' className='d-flex'>
					<InputGroupText>
						<MdSearch size={19} />
					</InputGroupText>
					<Input
						placeholder='descripción o item'
						onChange={e => setTextoBuscado(e.target.value)}
					/>
				</InputGroup>
			</div>
		</CardHeader>
	);
};

export default CardInfoComponent;

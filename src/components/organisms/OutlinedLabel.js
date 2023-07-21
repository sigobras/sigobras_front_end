import React from 'react';
import { hexToRgb } from '../../js/components/Utils/Funciones';
import { Button } from '@mui/material';

const OutlinedLabel = ({ color, name, onClick }) => {
	const labelStyle = {
		borderRadius: '13px',
		padding: '0 10px',
		lineHeight: '22px!important',
		margin: '5px',
		cursor: onClick ? 'pointer' : 'default',
		'--perceived-lightness':
			'calc((var(--label-r)*0.2126 + var(--label-g)*0.7152 + var(--label-b)*0.0722)/255)',
		'--lightness-switch':
			'max(0,min(calc((var(--perceived-lightness) - var(--lightness-threshold))*-1000),1))',
		'--lightness-threshold': '0.6',
		'--background-alpha': '0.18',
		'--border-alpha': '0.3',
		'--lighten-by':
			'calc((var(--lightness-threshold) - var(--perceived-lightness))*100*var(--lightness-switch))',
		background:
			'rgba(var(--label-r),var(--label-g),var(--label-b),var(--background-alpha))',
		color:
			'hsl(var(--label-h),calc(var(--label-s)*1%),calc((var(--label-l) + var(--lighten-by))*1%))',
		border: '1px solid #6c757d',
		'--label-r': hexToRgb(color).r,
		'--label-g': hexToRgb(color).g,
		'--label-b': hexToRgb(color).b,
		'--label-h': hexToRgb(color).h,
		'--label-s': hexToRgb(color).s,
		'--label-l': hexToRgb(color).l,
	};

	return (
		<Button type='button' style={labelStyle} onClick={onClick}>
			{name}
		</Button>
	);
};

export default OutlinedLabel;

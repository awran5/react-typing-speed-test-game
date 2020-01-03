import React from 'react'

const ItemList = ({ name, data, symble, ...rest }) => {
	return (
		<li className="list-item my-1 py-4 border rounded" {...rest}>
			{name}
			<span className="d-block display-4">
				{data}
				{symble && data > 0 ? <small>{symble}</small> : ''}
			</span>
		</li>
	)
}

export default ItemList

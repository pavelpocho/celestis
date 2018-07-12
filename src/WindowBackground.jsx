import css from './WindowBackground.css';
import React from 'react';

export const WindowBackground = ({id, parent}) =>
<div className="windowBackground" onClick={() => {parent.windowBackgroundClicked(id)}}>
</div>
import React from 'react';
import classes from './Loding.module.css'

export default function Loading() {
  return (
  <div className={classes.Loading}>
    <div>
      <img src="img/XOsX.gif" alt="loadingImg" />
    </div>
  </div>
  )
}

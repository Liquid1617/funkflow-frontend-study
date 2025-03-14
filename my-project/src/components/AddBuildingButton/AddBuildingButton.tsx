import React from 'react'
import styles from './styles.module.css'
import AddIcon from '../../assets/add_icon.svg'

interface IAddBuildingButtonProps {
  onClick?: () => void
}

export const AddBuildingButton: React.FC<IAddBuildingButtonProps> = ({ onClick }) => {
  return (
    <button className={styles.addBuildingButton} onClick={onClick}>
      <AddIcon />
      <span>Building</span>
    </button>
  )
}

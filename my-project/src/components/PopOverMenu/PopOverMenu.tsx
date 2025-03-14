import React from 'react'
import styles from './styles.module.css'
import DeleteIcon from '../../assets/delete_icon.svg'
import { CustomInput } from '../CustomInput/CustomInput'
import { IBuildingParams } from '../../scene/BuildingScene/BuildingScene'

interface IPopOverMenuProps {
  style?: React.CSSProperties
  params: IBuildingParams
  buildingNumber: number
  onChange: (newParams: IBuildingParams) => void
  onDelete: () => void
}

export const PopOverMenu: React.FC<IPopOverMenuProps> = ({
  style,
  params,
  buildingNumber,
  onChange,
  onDelete,
}) => {
  const handleWidthChange = (newValue: number) => {
    onChange({ ...params, width: newValue })
  }

  const handleDepthChange = (newValue: number) => {
    onChange({ ...params, depth: newValue })
  }

  const handleFloorsChange = (newValue: number) => {
    onChange({ ...params, floors: newValue })
  }

  const handleFloorHeightChange = (newValue: number) => {
    const adjusted = Math.round(newValue * 20) / 20
    onChange({ ...params, floorHeight: adjusted })
  }

  return (
    <div className={styles.popOverMenuContainer} style={style}>
      <div className={styles.header}>
        <label className={styles.menuTitle}>Building {buildingNumber}</label>
        <div onClick={onDelete} className={styles.deleteIcon}>
          <DeleteIcon />
        </div>
      </div>

      <div className={styles.menuRow}>
        <label className={styles.menuLabel}>Size (m):</label>
        <CustomInput label="X" value={params.width} onChange={handleWidthChange} />
        <span className={styles.separator}>x</span>
        <CustomInput label="Y" value={params.depth} onChange={handleDepthChange} />
      </div>

      <div className={styles.menuRow}>
        <label className={styles.menuLabel}>Floors:</label>
        <CustomInput value={params.floors} onChange={handleFloorsChange} />
      </div>

      <div className={styles.menuRow}>
        <label className={styles.menuLabel}>Floor height (m):</label>
        <CustomInput value={params.floorHeight} onChange={handleFloorHeightChange} step={0.05} />
      </div>
    </div>
  )
}

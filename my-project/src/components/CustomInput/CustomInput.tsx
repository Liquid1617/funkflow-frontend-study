import React, { useState, ChangeEvent } from 'react'
import styles from './styles.module.css'
import { ArrowUpIcon } from '../../assets/Arrows/ArrowUp'
import { ArrowDownIcon } from '../../assets/Arrows/ArrowDown'

interface ICustomInputProps {
  initialValue?: number
  value?: number
  min?: number
  max?: number
  step?: number
  label?: string
  onChange?: (value: number) => void
}

export const CustomInput: React.FC<ICustomInputProps> = ({
  initialValue = 10,
  value,
  min = 0,
  max = 100,
  step = 1,
  label = '',
  onChange,
}) => {
  const [internalValue, setInternalValue] = useState<number>(initialValue)

  const displayValue = value !== undefined ? value : internalValue

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputVal = e.target.value.trim()

    if (/^-?\d*\.?\d*$/.test(inputVal) || inputVal === '') {
      let numericValue = Number(inputVal)
      if (inputVal === '') {
        numericValue = 0
      } else {
        if (numericValue < min) {
          numericValue = min
        } else if (numericValue > max) {
          numericValue = max
        }
      }

      if (onChange) {
        onChange(numericValue)
      } else {
        setInternalValue(numericValue)
      }
    }
  }

  const increment = () => {
    const next = displayValue + step
    const newValue = next > max ? max : next
    if (onChange) {
      onChange(newValue)
    } else {
      setInternalValue(newValue)
    }
  }

  const decrement = () => {
    const next = displayValue - step
    const newValue = next < min ? min : next
    if (onChange) {
      onChange(newValue)
    } else {
      setInternalValue(newValue)
    }
  }

  return (
    <div className={styles.spinBoxContainer}>
      {label && <span className={styles.spinBoxLabel}>{label}</span>}
      <input
        className={styles.spinBoxValue}
        type="text"
        value={displayValue}
        onChange={handleChange}
      />
      <div className={styles.spinBoxArrows}>
        <button type="button" onClick={increment} className={styles.arrowBtn}>
          <ArrowUpIcon />
        </button>
        <button type="button" onClick={decrement} className={styles.arrowBtn}>
          <ArrowDownIcon />
        </button>
      </div>
    </div>
  )
}

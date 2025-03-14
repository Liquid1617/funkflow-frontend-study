import styles from './index.module.css'
import BuildingScene from './scene/BuildingScene/BuildingScene'

function App() {
  return (
    <div className={styles.appContainer}>
      <BuildingScene />
    </div>
  )
}

export default App
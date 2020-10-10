/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { ChangeEvent, Component } from 'react';
import styles from './Home.css';
import {
  startProject,
  loadWorlds,
  createEntity,
  updateManage,
  setupId,
} from '../features/manage';
import grass from '../img/grass.png';
import log from '../img/log.png';
import zombie from '../img/zombie.png';
import diamond from '../img/diamond.png';
import compass from '../img/compass.png';
import Entity from './Entity';

type HomeState = {
  worlds: Array<string>;
  worldName: string;
  step: number;
};

export default class Home extends Component<[], HomeState> {
  constructor(props: any) {
    super(props);
    this.state = {
      worlds: [],
      worldName: '',
      step: 0,
    };
  }

  componentDidMount() {
    setupId();
    this.setState({ worlds: loadWorlds() });
  }

  getWorld = () => {
    return (
      <div className={styles.choose}>
        <div className={styles.option}>
          <div
            role="button"
            onClick={() => {
              this.setState({ step: 1 });
            }}
          >
            <p className="med-label"> Existing World </p>
            <img src={log} alt="ExistingWorldImage" />
          </div>
        </div>
        <div
          role="button"
          onClick={() => {
            this.setState({ step: 2 });
          }}
        >
          <div className={styles.option}>
            <p className="med-label"> New World </p>
            <img src={grass} alt="NewWorldImage" />
          </div>
        </div>
      </div>
    );
  };

  getExistingWorld = () => {
    const { worlds } = this.state;
    return (
      <div>
        <p className="med-label"> Choose an existing world </p>
        <div className={styles.world_list}>
          {worlds.map((w: any) => (
            <div
              role="button"
              className={styles.world_option}
              key={w.name}
              onClick={() => {
                this.setState({ worldName: w.folderName, step: 3 });
                updateManage(w.folderName);
              }}
            >
              <p className={styles.world_name}>{w.name}</p>
              <img
                className={styles.world_icon}
                alt="WorldImage"
                src={`data:image/png;base64,${w.img}`}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  getNewWorld = () => {
    const { worldName } = this.state;
    return (
      <div className={styles.option}>
        <input
          id="projectName"
          placeholder="Project Name"
          value={worldName}
          name="worldName"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            this.setState({ worldName: e.target.value });
          }}
        />
        <button
          type="submit"
          aria-label="Create New"
          onClick={() => startProject(worldName)}
        >
          Start
        </button>
      </div>
    );
  };

  mainMenu = () => {
    return (
      <div className={styles.choose}>
        <div
          role="button"
          className={styles.option}
          onClick={() => this.setState({ step: 4 })}
        >
          <img alt="Entity" src={zombie} />
          <p> Entity </p>
        </div>
        <div className={styles.option}>
          <img alt="Entity" src={diamond} />
          <p> Block </p>
        </div>
        <div className={styles.option}>
          <img alt="Entity" src={compass} />
          <p> Item </p>
        </div>
      </div>
    );
  };

  getScreen = () => {
    const { step } = this.state;
    switch (step) {
      case 0:
        return this.getWorld();
      case 1:
        return this.getExistingWorld();
      case 2:
        return this.getNewWorld();
      case 3:
        return this.mainMenu();
      case 4:
        return <Entity createEntity={createEntity} />;
      default:
        return this.getWorld();
    }
  };

  render() {
    const { step } = this.state;
    return (
      <div>
        <h2 className={styles.title}> Obsidian </h2>
        {step > 0 ? (
          <div
            role="button"
            onClick={() => {
              this.setState({ step: 0 });
            }}
          >
            Start Over
          </div>
        ) : (
          <div />
        )}
        <div className={styles.container}>{this.getScreen()}</div>
      </div>
    );
  }
}

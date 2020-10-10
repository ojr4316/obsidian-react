import React, { ChangeEvent, Component } from 'react';
import styles from './Home.css';
import blank from '../img/blank.png';
import zombie from '../img/zombie.png';
import villager from '../img/villager.png';
import chair from '../img/chair.png';

type EntityProps = {
  createEntity: (
    name: string,
    width: number,
    height: number,
    type: string
  ) => void;
};

type EntityState = {
  addName: string;
  width: number;
  height: number;
  entityType: string;
};

export default class Home extends Component<EntityProps, EntityState> {
  constructor(props: any) {
    super(props);
    this.state = {
      addName: '',
      width: 0.5,
      height: 0.5,
      entityType: 'blank',
    };
  }

  render() {
    const { addName, width, height, entityType } = this.state;
    const { createEntity } = this.props;
    return (
      <div className={styles.entity}>
        <input
          placeholder="Entity Name"
          value={addName}
          name="addName"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            this.setState({ addName: e.target.value });
          }}
        />

        <div>
          <input
            className={styles.number_input}
            placeholder="Hitbox Width"
            value={width}
            type="number"
            name="width"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              this.setState({ width: parseFloat(e.target.value) });
            }}
          />

          <input
            className={styles.number_input}
            placeholder="Hitbox Height"
            value={height}
            name="height"
            type="number"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              this.setState({ height: parseFloat(e.target.value) });
            }}
          />
        </div>

        <select
          value={entityType}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => {
            this.setState({ entityType: e.target.value });
          }}
        >
          <option value="blank">
            Blank
            <img alt="blankimage" src={blank} />
          </option>
          <option value="furniture">
            Furniture
            <img alt="furnitureimage" src={chair} />
          </option>
          <option value="friendly">
            Friendly
            <img alt="friendlyimage" src={villager} />
          </option>
          <option value="enemy">
            Enemy
            <img alt="enemyimage" src={zombie} />
          </option>
        </select>

        <button
          type="submit"
          aria-label="Create New"
          onClick={() => {
            createEntity(addName, width, height, entityType);
            this.setState({ addName: '' });
          }}
        >
          Create
        </button>
      </div>
    );
  }
}

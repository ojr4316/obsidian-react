/* eslint-disable no-eval */
import os from 'os';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const { dialog } = require('electron').remote;
const { ncp } = require('ncp');

let worldName = '';
let projectName = 'default';

const root = `C:\\Users\\${
  os.userInfo().username
}\\AppData\\Local\\Packages\\Microsoft.MinecraftUWP_8wekyb3d8bbwe\\LocalState\\games\\com.mojang\\minecraftWorlds\\`;

export const setupId = () => {
  projectName = fs.readFileSync(`preferences.txt`, 'utf8');
};

export const loadWorlds = () => {
  const worlds: any = [];
  fs.readdirSync(root).forEach((w) => {
    const img = fs
      .readFileSync(`${root}\\${w}\\world_icon.jpeg`)
      .toString('base64');
    const name = fs.readFileSync(`${root}\\${w}\\levelname.txt`, 'utf8');
    worlds.push({ name, img, folderName: w });
  });
  console.log(worlds);
  return worlds;
};

export const mainDir = () => {
  const dir = `${root + worldName}\\`;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
};

export const bpDir = () => {
  const dir = `${root + worldName}\\behavior_packs\\${projectName}\\`;

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
};

export const rpDir = () => {
  const dir = `${root + worldName}\\resource_packs\\${projectName}\\`;

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
};

export const createBehaviorPack = () => {
  const bid = uuidv4();
  // Values don't matter for other ids
  const id = uuidv4();
  const id2 = uuidv4();

  fs.readFile('templates/b_manifest.json', (err, data) => {
    if (!err) {
      fs.writeFile(`${bpDir()}manifest.json`, eval(`\`${data}\``), (er) => {
        if (er) throw er;
      });
    }
  });
  return bid;
};

export const createResourcePack = () => {
  const rid = uuidv4();
  // Value don't matter for other id
  const id = uuidv4();

  fs.readFile('templates/r_manifest.json', (err, data) => {
    if (!err) {
      fs.writeFile(`${rpDir()}manifest.json`, eval(`\`${data}\``), (er) => {
        if (er) throw er;
      });
    }
  });
  return rid;
};

export const createMain = (bid: string, rid: string) => {
  // Values don't matter for other ids
  const id = uuidv4();
  const id2 = uuidv4();
  fs.readFile('templates/manifest.json', (err, data) => {
    if (!err) {
      fs.writeFile(`${mainDir()}manifest.json`, eval(`\`${data}\``), (er) => {
        if (er) throw er;
      });
    }
  });

  fs.readFile('templates/wbp.json', (err, data) => {
    if (!err) {
      fs.writeFile(
        `${mainDir()}world_behavior_packs.json`,
        eval(`\`${data}\``),
        (er: any) => {
          if (er) throw er;
        }
      );
    }
  });

  fs.readFile('templates/wrp.json', (err, data) => {
    if (!err) {
      fs.writeFile(
        `${mainDir()}world_resource_packs.json`,
        eval(`\`${data}\``),
        (er: any) => {
          if (er) throw er;
        }
      );
    }
  });

  fs.mkdirSync(`${rpDir()}\\entity`, { recursive: true });
  fs.mkdirSync(`${bpDir()}\\entities`, { recursive: true });
};

export const copyBlankWorld = () => {
  ncp('templates/blank', `${mainDir()}\\`, (err: Error) => {
    if (err) throw err;
  });
};

export const startProject = (name: string) => {
  if (name.length > 0) {
    projectName = name;
    worldName = name;
  } else {
    projectName = 'default';
    worldName = 'default';
  }

  const bid = createBehaviorPack();
  const rid = createResourcePack();
  createMain(bid, rid);
  copyBlankWorld();
};

export const getEntities = (): string[] => {
  if (fs.existsSync(`${bpDir()}\\entities\\`)) {
    const entities: string[] = [];
    fs.readdirSync(`${bpDir()}\\entities\\`).forEach((e) => {
      entities.push(e.split('.')[0]);
    });
    return entities;
  }
  return [];
};

export const createEntity = (
  n: string,
  hitbox_width: number,
  hitbox_height: number,
  type: string
) => {
  const name = n.toLowerCase();
  if (getEntities().includes(name)) {
    dialog.showErrorBox('Error', 'Entity already exists!');
    return;
  }

  let bTemplate = '';

  switch (type) {
    case 'blank':
      bTemplate = 'templates/b_entity.json';
      console.log('blank template used');
      break;
    case 'furniture':
      break;
    case 'friendly':
      break;
    case 'enemy':
      break;
    default:
      bTemplate = 'templates/b_entity.json';
      break;
  }

  // Behavior Pack
  fs.readFile(bTemplate, (err, data) => {
    if (!err) {
      if (!fs.existsSync(`${bpDir()}\\entities\\`)) {
        fs.mkdirSync(`${bpDir()}\\entities\\`);
      }
      fs.writeFile(
        `${bpDir()}\\entities\\${name}.json`,
        eval(`\`${data}\``),
        (er) => {
          if (er) throw er;
        }
      );
    }
  });

  // Resource Pack
  fs.readFile('templates/r_entity.json', (err, data) => {
    if (!err) {
      if (!fs.existsSync(`${rpDir()}\\entity\\`)) {
        fs.mkdirSync(`${rpDir()}\\entity\\`);
      }
      fs.writeFile(
        `${rpDir()}\\entity\\${name}.json`,
        eval(`\`${data}\``),
        (er) => {
          if (er) throw er;
        }
      );
    }
  });
};

export const updateManage = (n: string) => {
  worldName = n;
};

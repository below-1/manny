import Util from './util';
import Barbermen from './Barbermen';
import Cabang from './Cabang';
import PaketJasa from './PaketJasa';
import User from './User';
import Sesi from './Sesi';
import Inventory from './Inventory';

import * as services from '../services';

import { Box } from '../types';

type MainResOptions = {
  box: Box,
  inventory: services.Inventory,
  sesi: services.Sesi
};

export default async function (options : MainResOptions) {
  let justBox = { box: options.box };
  let inventoryArgs = { box: options.box, service: options.inventory };
  let sesiArgs = { box: options.box, service: options.sesi };

  return [
    await Barbermen(justBox),
    await PaketJasa(justBox),
    await Cabang(justBox),
    await User(justBox),
    await Util(justBox),
    await Sesi(sesiArgs),
    await Inventory(inventoryArgs)
  ];
};
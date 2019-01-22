import Util from './util';
import Barbermen from './Barbermen';
import Cabang from './Cabang';
import PaketJasa from './PaketJasa';
import User from './User';
import * as Inventory from '../inventory';
import * as Booking from '../booking';
import { WithBox } from '../types';

const resolvers = [
  Util,
  Barbermen,
  Cabang,
  PaketJasa,
  User,
  Inventory.Resolver,
  Booking.Resolver
];

export default async function (options: WithBox) {
  return [
    await ()
  ];
};
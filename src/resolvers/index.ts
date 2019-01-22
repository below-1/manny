import Util from './util';
import Barbermen from './Barbermen';
import Cabang from './Cabang';
import PaketJasa from './PaketJasa';
import User from './User';
import { Box } from '../types';

export default async function (box: Box) {
  return [
    await Barbermen({ box }),
    await PaketJasa({ box }),
    await Cabang({ box }),
    await User({ box }),
    await Util({ box })
  ];
};
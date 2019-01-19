import * as torm from 'typeorm';
import { MutasiItem } from './MutasiItem';

@torm.ChildEntity()
export class Pembelian extends MutasiItem {
  
}
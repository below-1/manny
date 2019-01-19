import * as torm from 'typeorm';
import { MutasiItem } from './MutasiItem';

@torm.ChildEntity()
export class Penggunaan extends MutasiItem {
  
}
import * as torm from 'typeorm';
import { MutasiItem } from './MutasiItem';
import { Item } from './Item';

@torm.ChildEntity()
export class Penggunaan extends MutasiItem {
}
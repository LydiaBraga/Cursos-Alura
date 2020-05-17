import { Imprimivel, Igualavel } from './index';

export interface Objeto<T> extends Imprimivel, Igualavel<T>  { }
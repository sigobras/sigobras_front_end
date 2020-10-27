import { UrlServer } from '../Utils/ServerUrlConfig';
import * as io from 'socket.io-client';

export const socket  = io.connect(UrlServer);